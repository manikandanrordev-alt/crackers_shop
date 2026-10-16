module Api
  module Admin
    class DashboardController < BaseController
      before_action :ensure_admin!

      def index
        total_orders = Order.count
        total_products = Product.count
        total_users = User.count
        total_revenue = Order.where(status: [:completed, :pending]).sum(:total_amount).to_f.round(2)

        pending_orders_count = Order.where(status: :pending).count
        completed_orders_count = Order.where(status: :completed).count
        cancelled_orders_count = Order.where(status: :cancelled).count

        low_stock_products = Product.where("stock_quantity <= ?", 20).limit(5).map { |p| product_payload(p) }

        recent_orders = Order.includes(:user, order_items: :product).order(created_at: :desc).limit(8).map do |o|
          {
            id: o.id,
            customer_name: o.customer_name.presence || o.user&.email,
            email: o.user&.email,
            total_amount: o.total_amount.to_f,
            status: o.status,
            payment_method: o.payment_method,
            items_count: o.order_items.sum(:quantity),
            created_at: o.created_at.strftime("%d %b %Y, %I:%M %p")
          }
        end

        category_stats = Product.group(:category).count.map do |cat, count|
          { name: cat, count: count }
        end

        render json: {
          metrics: {
            total_orders: total_orders,
            total_products: total_products,
            total_users: total_users,
            total_revenue: total_revenue,
            pending_orders: pending_orders_count,
            completed_orders: completed_orders_count,
            cancelled_orders: cancelled_orders_count
          },
          recent_orders: recent_orders,
          low_stock_products: low_stock_products,
          categories: category_stats
        }
      end
    end
  end
end
