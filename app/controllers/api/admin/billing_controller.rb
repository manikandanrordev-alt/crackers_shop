module Api
  module Admin
    class BillingController < BaseController
      before_action :ensure_admin!

      def search_products
        query = params[:query].to_s.strip.downcase
        products = Product.all

        if query.present?
          products = products.where("LOWER(name) LIKE ? OR LOWER(category) LIKE ?", "%#{query}%", "%#{query}%")
        end

        products = products.limit(20)

        render json: {
          products: products.map { |p| product_payload(p) }
        }
      end

      def checkout
        customer_email = params[:customer_email].to_s.strip.presence ||
                         (params[:customer_phone].present? ? "pos_#{params[:customer_phone].gsub(/\D/, '')}@rakshcrackers.com" : "walkin_#{SecureRandom.hex(4)}@rakshcrackers.com")

        user = User.find_or_create_by(email: customer_email) do |u|
          u.password = SecureRandom.hex(10)
          u.role = :customer
        end

        items = params[:items] || []
        if items.empty?
          return render json: { success: false, error: "No items in bill" }, status: :unprocessable_entity
        end

        order = nil
        Order.transaction do
          discount_pct = params[:discount_percentage].to_f.clamp(0, 100)

          order = Order.create!(
            user: user,
            status: :completed,
            payment_method: params[:payment_method] || :cash,
            total_amount: 0,
            customer_name: params[:customer_name].presence || "Walk-in Customer",
            customer_phone: params[:customer_phone].presence || "",
            customer_address: params[:customer_address].presence || "Counter Sale",
            discount_percentage: discount_pct
          )

          total_sum = 0
          items.each do |item|
            product = Product.find(item[:id] || item[:product_id])
            quantity = item[:quantity].to_i
            quantity = 1 if quantity <= 0

            order.order_items.create!(
              product: product,
              quantity: quantity,
              price: product.price
            )

            product.decrement!(:stock_quantity, quantity)
            total_sum += (product.price.to_f * quantity)
          end

          discount_amount = total_sum * (discount_pct / 100.0)
          order.update_columns(
            discount: discount_amount,
            total_amount: (total_sum - discount_amount).round(2)
          )
        end

        shop = ShopConfig.first
        render json: {
          success: true,
          message: "Bill generated successfully",
          invoice: {
            order_id: order.id,
            shop_name: shop&.shop_name || "Raksh Crackers",
            date: order.created_at.strftime("%d-%m-%Y %I:%M %p"),
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            payment_method: order.payment_method.to_s.upcase,
            items: order.order_items.map do |oi|
              {
                name: oi.product.name,
                category: oi.product.category,
                quantity: oi.quantity,
                unit_price: oi.price.to_f,
                subtotal: (oi.price.to_f * oi.quantity).round(2)
              }
            end,
            subtotal: order.order_items.sum { |oi| oi.price.to_f * oi.quantity }.round(2),
            discount_percentage: order.discount_percentage.to_f,
            discount_amount: order.discount.to_f,
            total_amount: order.total_amount.to_f
          }
        }
      rescue => e
        render json: { success: false, error: e.message }, status: :unprocessable_entity
      end
    end
  end
end
