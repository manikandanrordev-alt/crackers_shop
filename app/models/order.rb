class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items
  has_one_attached :lr_photo

  enum :status, { pending: 0, completed: 1, cancelled: 2 }
  enum :payment_method, { cash: 0, card: 1, upi: 2 }

  before_save :calculate_total

  def calculate_total
    item_total = order_items.sum { |item| item.price * item.quantity }
    discount_amount = item_total * (discount_percentage.to_f / 100.0)
    self.total_amount = item_total - discount_amount
  end
end
