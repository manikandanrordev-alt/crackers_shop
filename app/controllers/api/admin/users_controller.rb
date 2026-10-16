module Api
  module Admin
    class UsersController < BaseController
      before_action :ensure_admin!

      def index
        users = User.includes(:orders).all.order(created_at: :desc).map do |u|
          {
            id: u.id,
            email: u.email,
            role: u.role,
            is_admin: u.admin?,
            points: u.points || 0,
            orders_count: u.orders.count,
            total_spent: u.orders.sum(:total_amount).to_f.round(2),
            created_at: u.created_at.strftime("%d %b %Y"),
            created_at_iso: u.created_at.iso8601
          }
        end

        render json: { users: users, total: users.count }
      end
    end
  end
end
