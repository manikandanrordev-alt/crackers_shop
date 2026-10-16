class AddSocialsToShopConfigs < ActiveRecord::Migration[8.1]
  def change
    add_column :shop_configs, :whatsapp_number, :string
    add_column :shop_configs, :instagram_url, :string
    add_column :shop_configs, :facebook_url, :string
  end
end
