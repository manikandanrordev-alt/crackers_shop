module Api
  class SpinWheelController < BaseController
    PRIZES = [
      { id: 1, label: "10% Extra Off", code: "DIWALI10", discount_pct: 10, type: "discount", description: "Flat 10% Extra Wholesale Discount" },
      { id: 2, label: "₹100 Cash Off", code: "CASH100", discount_amount: 100, type: "cash", description: "₹100 Festive Cash Off on minimum ₹1000 order" },
      { id: 3, label: "Free Sparklers", code: "FREESPARK", type: "gift", description: "Complimentary 10cm Electric Sparklers box on your order!" },
      { id: 4, label: "15% VIP Treat", code: "VIP15", discount_pct: 15, type: "discount", description: "Exclusive 15% VIP Festive Rebate" },
      { id: 5, label: "+50 Diwali Points", code: "POINTS50", points: 50, type: "points", description: "50 Reward Points added directly to your account!" },
      { id: 6, label: "5% Instant Bonus", code: "BOOM5", discount_pct: 5, type: "discount", description: "5% Instant Festival Bonus" }
    ].freeze

    def prizes
      render json: { prizes: PRIZES }
    end

    def spin
      prize = PRIZES.sample

      if current_user && prize[:points]
        current_user.increment!(:points, prize[:points])
      end

      render json: {
        success: true,
        prize: prize,
        user_points: current_user&.points || 0,
        message: "Congratulations! You won: #{prize[:label]}!"
      }
    end
  end
end
