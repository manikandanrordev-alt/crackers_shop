class AddAddressToShopConfigs < ActiveRecord::Migration[8.1]
  def change
    add_column :shop_configs, :address, :text
  end
end
