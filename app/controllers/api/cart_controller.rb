module Api
  class CartController < BaseController
    before_action :set_cart

    def show
      render json: cart_summary
    end

    def add_item
      product = Product.find_by(id: params[:product_id])
      unless product
        return render json: { success: false, error: "Product not found" }, status: :not_found
      end

      amount = params[:amount].to_i
      amount = 1 if amount <= 0

      if product.stock_quantity.to_i < amount
        return render json: { success: false, error: "Insufficient stock available" }, status: :unprocessable_entity
      end

      item = @cart.cart_items.find_or_initialize_by(product: product)
      if item.persisted?
        item.quantity += amount
      else
        item.quantity = amount
      end

      if item.save
        render json: {
          success: true,
          message: "#{product.name} added to cart",
          cart: cart_summary
        }
      else
        render json: { success: false, error: item.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end

    def update_item
      item = @cart.cart_items.find_by(id: params[:id])
      unless item
        return render json: { success: false, error: "Item not found in cart" }, status: :not_found
      end

      new_quantity = params[:quantity].to_i
      if new_quantity > 0
        if item.product.stock_quantity.to_i < new_quantity
          return render json: { success: false, error: "Only #{item.product.stock_quantity} available in stock" }, status: :unprocessable_entity
        end
        item.update(quantity: new_quantity)
      else
        item.destroy
      end

      render json: {
        success: true,
        message: "Cart updated",
        cart: cart_summary
      }
    end

    def remove_item
      item = @cart.cart_items.find_by(id: params[:id])
      if item
        item.destroy
        render json: { success: true, message: "Item removed from cart", cart: cart_summary }
      else
        render json: { success: false, error: "Item not found" }, status: :not_found
      end
    end

    def clear
      @cart.cart_items.destroy_all
      render json: { success: true, message: "Cart cleared", cart: cart_summary }
    end

    private

    def set_cart
      if current_user
        @cart = Cart.find_or_create_by(user: current_user)
      else
        # Guest fallback user or session
        guest_email = session[:guest_email] ||= "guest_#{SecureRandom.hex(6)}@rakshcrackers.com"
        guest_user = User.find_or_create_by(email: guest_email) do |u|
          u.password = SecureRandom.hex(10)
          u.role = :customer
        end
        @cart = Cart.find_or_create_by(user: guest_user)
      end
    end

    def cart_summary
      items = @cart.cart_items.includes(:product).order(created_at: :desc)
      
      serialized_items = items.map do |item|
        prod = item.product
        item_subtotal = (prod.price.to_f * item.quantity).round(2)
        mrp_subtotal = (prod.mrp.to_f * item.quantity).round(2)
        item_savings = (mrp_subtotal - item_subtotal).clamp(0, Float::INFINITY)

        {
          id: item.id,
          product_id: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price.to_f,
          mrp: prod.mrp.to_f,
          quantity: item.quantity,
          stock_quantity: prod.stock_quantity.to_i,
          item_subtotal: item_subtotal,
          item_savings: item_savings,
          discount_percentage: prod.discount_percentage,
          image_url: prod.image.attached? ? rails_blob_path(prod.image, only_path: true) : nil
        }
      end

      total_price = serialized_items.sum { |i| i[:item_subtotal] }.round(2)
      total_mrp = serialized_items.sum { |i| (i[:mrp] * i[:quantity]) }.round(2)
      total_savings = (total_mrp - total_price).clamp(0, Float::INFINITY).round(2)
      total_quantity = serialized_items.sum { |i| i[:quantity] }

      {
        cart_id: @cart.id,
        items: serialized_items,
        total_items: total_quantity,
        total_price: total_price,
        total_mrp: total_mrp,
        total_savings: total_savings
      }
    end
  end
end
