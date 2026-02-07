class Product < ApplicationRecord
  has_many :order_items
  has_many :orders, through: :order_items
  has_one_attached :image

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock_quantity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :mrp, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  def discount_percentage
    return 0 if mrp.nil? || mrp.zero? || price >= mrp
    ((mrp - price) / mrp * 100).round
  end
end
