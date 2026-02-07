class OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cart, only: [:new, :create]

  def new
    @order = Order.new
    if @cart.cart_items.empty?
      redirect_to cart_path, alert: "Your cart is empty."
    end
  end

  def create
    @order = Order.new(order_params)
    @order.user = current_user
    @order.total_amount = @cart.cart_items.sum { |item| item.product.price * item.quantity }
    
    if @order.save
      # Move cart items to order items
      @cart.cart_items.each do |cart_item|
        @order.order_items.create(
          product: cart_item.product,
          quantity: cart_item.quantity,
          price: cart_item.product.price
        )
      end
      
      # Recalculate and update total to ensure accuracy
      # Using update_pages/update_column to avoid callbacks if needed, but save should work if callback is correct
      # For now, manually updating total based on created items to be safe
      total = @order.order_items.sum { |item| item.price * item.quantity }
      @order.update_column(:total_amount, total)
      
      # Clear cart
      @cart.cart_items.destroy_all
      
      redirect_to order_path(@order), notice: "Order placed successfully!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @order = Order.find(params[:id])
    if @order.user != current_user && !current_user.admin?
      redirect_to root_path, alert: "Not authorized."
    end
  end

  def index
    @orders = current_user.orders.order(created_at: :desc)
  end

  private

  def set_cart
    @cart = Cart.find_or_create_by(user: current_user)
  end

  def order_params
    params.require(:order).permit(:name, :address, :phone, :payment_method)
  end
end
