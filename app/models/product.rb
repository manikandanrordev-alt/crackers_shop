class Product < ApplicationRecord
  has_many :order_items, dependent: :destroy
  has_many :orders, through: :order_items
  has_many :cart_items, dependent: :destroy
  has_one_attached :image

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock_quantity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :mrp, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :code, uniqueness: { case_sensitive: false }, allow_blank: true

  before_validation :ensure_code

  def discount_percentage
    return 0 if mrp.nil? || mrp.zero? || price >= mrp
    ((mrp - price) / mrp * 100).round
  end

  private

  def ensure_code
    if code.blank?
      last_numeric = Product.where("code ~ '^[0-9]+$'").pluck(:code).map(&:to_i).max || 100
      self.code = (last_numeric + 1).to_s
    else
      self.code = code.to_s.strip.upcase
    end
  end
end
