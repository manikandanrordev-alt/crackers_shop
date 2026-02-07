class AddShopNameToShopConfigs < ActiveRecord::Migration[8.1]
  def change
    add_column :shop_configs, :shop_name, :string
  end
end
