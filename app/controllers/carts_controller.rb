class CartsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_cart

  def show
    @cart_items = @cart.cart_items.includes(:product).order(created_at: :desc)
    @cart_total = @cart_items.sum { |item| item.product.price * item.quantity }
  end

  def add_item
    product = Product.find(params[:product_id])
    amount = params[:amount].to_i
    amount = 1 if amount <= 0

    @cart_item = @cart.cart_items.find_or_initialize_by(product: product)
    
    if @cart_item.persisted?
      @cart_item.quantity += amount
    else
      @cart_item.quantity = amount
    end

    if @cart_item.save
      redirect_to cart_path, notice: "#{product.name} added to cart."
    else
      redirect_to root_path, alert: "Could not add item to cart."
    end
  end

  def remove_item
    @cart_item = @cart.cart_items.find(params[:id])
    @cart_item.destroy
    redirect_to cart_path, notice: "Item removed from cart."
  end

  def update_item
    @cart_item = @cart.cart_items.find(params[:id])
    new_quantity = params[:quantity].to_i

    if new_quantity > 0
      @cart_item.update(quantity: new_quantity)
      # Recalculate totals
      @cart_total = @cart.cart_items.sum { |item| item.product.price * item.quantity }
      @item_total = @cart_item.product.price * @cart_item.quantity
      
      respond_to do |format|
        format.html { redirect_to cart_path, notice: "Cart updated." }
        format.json { render json: { 
          status: "updated", 
          cart_total: number_to_currency(@cart_total, unit: "₹"),
          item_total: number_to_currency(@item_total, unit: "₹")
        } }
      end
    else
      @cart_item.destroy
      # Recalculate totals
      @cart_total = @cart.cart_items.sum { |item| item.product.price * item.quantity }
      respond_to do |format|
        format.html { redirect_to cart_path, notice: "Item removed." }
        format.json { render json: { 
           status: "removed",
           cart_total: number_to_currency(@cart_total, unit: "₹")
        } }
      end
    end
  end

  private

  def set_cart
    @cart = Cart.find_or_create_by(user: current_user)
  end
end
