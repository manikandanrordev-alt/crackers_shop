class Admin::OrdersController < Admin::AdminController
  def index
    @orders = Order.includes(:user).order(created_at: :desc)
  end

  def show
    @order = Order.find(params[:id])
  end

  def update
    @order = Order.find(params[:id])
    if @order.update(order_params)
      redirect_to admin_order_path(@order), notice: "Order updated successfully."
    else
      render :show
    end
  end

  private

  def order_params
    params.require(:order).permit(:status, :lr_number, :lr_photo)
  end
end
