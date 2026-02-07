class Admin::BillingController < Admin::AdminController
  def index
    @products = Product.all
  end

  def search_products
    query = params[:query].downcase
    @products = Product.where("lower(name) LIKE ?", "%#{query}%").limit(10)
    
    render partial: "product_list", locals: { products: @products }
  end

  def checkout
    # Logic to create order from billing page
    user = User.find_or_create_by(email: params[:customer_email]) do |u|
      u.password = SecureRandom.hex(10)
      u.role = :customer
    end

    Order.transaction do
      order = Order.create!(
        user: user,
        status: :completed,
        payment_method: params[:payment_method],
        total_amount: params[:total_amount],
        customer_name: params[:customer_name],
        customer_phone: params[:customer_phone],
        customer_address: params[:customer_address],
        discount_percentage: params[:discount_percentage] || 0
      )

      params[:items].each do |item|
        product = Product.find(item[:id])
        order.order_items.create!(
          product: product,
          quantity: item[:quantity],
          price: product.price
        )
        product.decrement!(:stock_quantity, item[:quantity].to_i)
      end
    end

    render json: { status: "success", message: "Order created successfully" }
  rescue => e
    render json: { status: "error", message: e.message }, status: :unprocessable_entity
  end
end
