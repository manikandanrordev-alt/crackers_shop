class AddDetailsToOrdersAndProducts < ActiveRecord::Migration[8.0]
  def change
    add_column :orders, :customer_name, :string
    add_column :orders, :customer_address, :text
    add_column :orders, :customer_phone, :string
    add_column :orders, :discount_percentage, :decimal, default: 0
    add_column :orders, :lr_number, :string

    add_column :products, :mrp, :decimal
    add_index :products, :name
  end
end
