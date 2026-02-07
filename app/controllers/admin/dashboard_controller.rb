class Admin::DashboardController < Admin::AdminController
  def index
    @total_users = User.count
    @total_products = Product.count
    @total_orders = Order.count
    @recent_orders = Order.includes(:user).order(created_at: :desc).limit(5)
  end
end
