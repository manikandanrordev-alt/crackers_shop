class AddDiscountToShopConfig < ActiveRecord::Migration[8.1]
  def change
    unless column_exists?(:shop_configs, :default_discount_percentage)
      add_column :shop_configs, :default_discount_percentage, :decimal, precision: 5, scale: 2, default: 0.0
    end
  end
end
