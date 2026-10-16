module Api
  class OrdersController < BaseController
    before_action :authenticate_user!, except: [:create, :show, :track]
    before_action :set_order, only: [:show, :update]

    def track
      query = params[:query].to_s.strip
      if query.blank?
        return render json: { success: false, error: "Please enter an LR number, mobile number, or order ID" }, status: :unprocessable_entity
      end

      clean_digits = query.gsub(/\D/, '')
      orders = Order.none

      # 1. Look up by LR number (exact or partial)
      orders = Order.where("lower(lr_number) = :q OR lr_number ILIKE :like_q", q: query.downcase, like_q: "%#{query}%")
      
      # 2. Look up by Customer Phone (stripping non-digit characters in PostgreSQL)
      if orders.empty? && clean_digits.length >= 7
        last_digits = clean_digits[-10..-1] || clean_digits
        orders = Order.where("regexp_replace(customer_phone, '\\D', '', 'g') ILIKE :clean_q OR customer_phone ILIKE :like_q", clean_q: "%#{last_digits}%", like_q: "%#{query}%")
      end

      # 3. Look up by Order ID
      if orders.empty? && query =~ /\A\d+\z/
        orders = Order.where(id: query.to_i)
      end

      orders = orders.includes(:user, order_items: :product).order(created_at: :desc).limit(10)

      if orders.empty?
        return render json: {
          success: false,
          found: false,
          message: "No Sivakasi transport parcels or orders found matching '#{query}'. Please verify your LR number or 10-digit phone number."
        }
      end

      results = orders.map do |ord|
        has_lr = ord.lr_number.present?

        stages = [
          {
            title: "Order Placed & Confirmed",
            desc: "Order received by Raksh Crackers Sivakasi office",
            date: ord.created_at.strftime("%d %b %Y, %I:%M %p"),
            completed: true,
            current: !has_lr && ord.status == "pending"
          },
          {
            title: "Factory Quality Pack & Boxed",
            desc: "Crackers packed securely in heavy-duty weatherproof cartons conforming to PESO safety standards",
            date: ord.created_at > 1.day.ago ? "Processing" : (ord.created_at + 4.hours).strftime("%d %b %Y"),
            completed: has_lr || ord.status == "completed",
            current: has_lr && ord.status == "pending"
          },
          {
            title: has_lr ? "Sivakasi Transport LR Booked" : "Transport Booking in Progress",
            desc: has_lr ? "Booked via Sivakasi Parcel Transport. LR No: #{ord.lr_number}" : "Consignment being registered at Sivakasi parcel booking counter",
            date: has_lr ? ord.updated_at.strftime("%d %b %Y") : "Pending Dispatch",
            completed: has_lr,
            current: has_lr && ord.status == "pending",
            lr_number: ord.lr_number
          },
          {
            title: "In Transit Across Regional Hubs",
            desc: has_lr ? "Consignment dispatched from Sivakasi central hub towards your destination city" : "Will start once LR is dispatched",
            date: has_lr ? "Active Transit" : "Upcoming",
            completed: ord.status == "completed",
            current: has_lr && ord.status != "completed"
          },
          {
            title: "Destination Godown / Delivered",
            desc: ord.status == "completed" ? "Parcel safely delivered or collected with LR acknowledgment" : "Expected arrival at your nearest transport godown",
            date: ord.status == "completed" ? ord.updated_at.strftime("%d %b %Y") : "Expected within 2-3 business days",
            completed: ord.status == "completed",
            current: ord.status == "completed"
          }
        ]

        live_status = if ord.status == "completed"
          "Delivered / Parcel Collected from Destination Godown"
        elsif has_lr
          "Live in Transit: Booked via Sivakasi Transport (LR ##{ord.lr_number})"
        elsif ord.status == "cancelled"
          "Order Cancelled"
        else
          "Packaging & Consignment Preparation at Sivakasi Works"
        end

        order_detail_payload(ord).merge(
          has_lr: has_lr,
          live_status: live_status,
          tracking_stages: stages
        )
      end

      render json: {
        success: true,
        found: true,
        query: query,
        orders: results
      }
    end

    def index
      orders = if current_user.admin?
        Order.includes(:user, order_items: :product).order(created_at: :desc)
      else
        current_user.orders.includes(order_items: :product).order(created_at: :desc)
      end

      render json: {
        orders: orders.map { |o| order_summary_payload(o) }
      }
    end

    def show
      unless @order
        return render json: { error: "Order not found" }, status: :not_found
      end

      # Allow if user owns order, or is admin, or is accessing newly created order
      if current_user && !current_user.admin? && @order.user_id != current_user.id
        return render json: { error: "Not authorized" }, status: :forbidden
      end

      render json: { order: order_detail_payload(@order) }
    end

    def create
      # Resolve user: current_user or create customer account from phone/email
      user = current_user
      unless user
        customer_email = params[:customer_email].to_s.strip.presence || 
                         (params[:customer_phone].present? ? "user_#{params[:customer_phone].gsub(/\D/, '')}@rakshcrackers.com" : "customer_#{SecureRandom.hex(4)}@rakshcrackers.com")
        user = User.find_or_create_by(email: customer_email) do |u|
          u.password = "password"
          u.role = :customer
        end
        sign_in(:user, user)
      end

      # Get items from cart or explicit payload
      cart = Cart.find_by(user: user) || (session[:guest_email] && Cart.find_by(user: User.find_by(email: session[:guest_email])))
      items_to_order = []

      if params[:items].present? && params[:items].is_a?(Array)
        params[:items].each do |item_data|
          prod = Product.find_by(id: item_data[:id] || item_data[:product_id])
          next unless prod
          qty = item_data[:quantity].to_i
          qty = 1 if qty <= 0
          items_to_order << { product: prod, quantity: qty, price: prod.price }
        end
      elsif cart && cart.cart_items.any?
        cart.cart_items.each do |ci|
          items_to_order << { product: ci.product, quantity: ci.quantity, price: ci.product.price }
        end
      end

      if items_to_order.empty?
        return render json: { success: false, error: "Your cart is empty. Please add items before checking out." }, status: :unprocessable_entity
      end

      # Validate stock
      items_to_order.each do |item|
        if item[:product].stock_quantity.to_i < item[:quantity]
          return render json: {
            success: false,
            error: "Product '#{item[:product].name}' only has #{item[:product].stock_quantity} left in stock."
          }, status: :unprocessable_entity
        end
      end

      payment_method_val = case params[:payment_method].to_s.downcase
                           when "upi" then :upi
                           when "card" then :card
                           else :cash
                           end

      discount_pct = params[:discount_percentage].to_f.clamp(0, 100)

      order = nil
      Order.transaction do
        order = Order.new(
          user: user,
          customer_name: params[:customer_name].presence || user.email.split("@").first.capitalize,
          customer_phone: params[:customer_phone].presence || "",
          customer_address: params[:customer_address].presence || "Sivakasi Direct Delivery",
          payment_method: payment_method_val,
          status: :pending,
          discount_percentage: discount_pct
        )
        order.save!

        items_to_order.each do |item|
          order.order_items.create!(
            product: item[:product],
            quantity: item[:quantity],
            price: item[:price]
          )
          # Decrement inventory
          item[:product].decrement!(:stock_quantity, item[:quantity])
        end

        # Recalculate and persist total
        item_total = order.order_items.sum { |oi| oi.price * oi.quantity }
        discount_amount = item_total * (discount_pct / 100.0)
        order.update_columns(
          discount: discount_amount,
          total_amount: (item_total - discount_amount).round(2)
        )

        # Clear cart if exists
        cart.cart_items.destroy_all if cart

        # Award festive reward points
        user.increment!(:points, 25)
      end

      render json: {
        success: true,
        message: "Order placed successfully! Thank you for celebrating with Raksh Crackers.",
        order: order_detail_payload(order)
      }, status: :created
    rescue => e
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end

    def update
      ensure_admin!
      return if performed?

      update_params = params.permit(:status, :lr_number, :lr_photo)
      
      if update_params[:status].present? && Order.statuses.key?(update_params[:status])
        @order.status = update_params[:status]
      end

      if update_params[:lr_number].present?
        @order.lr_number = update_params[:lr_number]
      end

      if update_params[:lr_photo].present?
        @order.lr_photo.attach(update_params[:lr_photo])
      end

      if @order.save
        render json: {
          success: true,
          message: "Order updated successfully",
          order: order_detail_payload(@order)
        }
      else
        render json: { success: false, error: @order.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end

    private

    def set_order
      @order = Order.find_by(id: params[:id])
    end

    def order_summary_payload(order)
      {
        id: order.id,
        user_email: order.user&.email,
        customer_name: order.customer_name.presence || order.user&.email,
        customer_phone: order.customer_phone,
        total_amount: order.total_amount.to_f,
        discount: order.discount.to_f,
        discount_percentage: order.discount_percentage.to_f,
        status: order.status,
        payment_method: order.payment_method,
        lr_number: order.lr_number,
        has_lr_photo: order.lr_photo.attached?,
        items_count: order.order_items.sum(:quantity),
        created_at: order.created_at.strftime("%d %b %Y, %I:%M %p"),
        date_iso: order.created_at.iso8601
      }
    end

    def order_detail_payload(order)
      items = order.order_items.includes(:product).map do |oi|
        prod = oi.product
        {
          id: oi.id,
          product_id: oi.product_id,
          product_name: prod ? prod.name : "Cracker Item",
          category: prod ? prod.category : "Crackers",
          quantity: oi.quantity,
          price: oi.price.to_f,
          subtotal: (oi.price.to_f * oi.quantity).round(2),
          image_url: prod&.image&.attached? ? rails_blob_path(prod.image, only_path: true) : nil
        }
      end

      raw_subtotal = items.sum { |i| i[:subtotal] }.round(2)

      {
        id: order.id,
        user_id: order.user_id,
        user_email: order.user&.email,
        customer_name: order.customer_name.presence || order.user&.email,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        payment_method: order.payment_method,
        status: order.status,
        lr_number: order.lr_number,
        lr_photo_url: order.lr_photo.attached? ? rails_blob_path(order.lr_photo, only_path: true) : nil,
        subtotal: raw_subtotal,
        discount: order.discount.to_f,
        discount_percentage: order.discount_percentage.to_f,
        total_amount: order.total_amount.to_f,
        items: items,
        created_at: order.created_at.strftime("%d %b %Y, %I:%M %p"),
        created_at_iso: order.created_at.iso8601
      }
    end
  end
end
