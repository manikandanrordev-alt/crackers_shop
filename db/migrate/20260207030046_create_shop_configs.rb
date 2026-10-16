class CreateShopConfigs < ActiveRecord::Migration[8.1]
  def change
    create_table :shop_configs do |t|
      t.string :key
      t.text :value

      t.timestamps
    end
  end
end
