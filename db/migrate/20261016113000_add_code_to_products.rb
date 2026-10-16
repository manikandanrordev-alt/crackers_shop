class AddCodeToProducts < ActiveRecord::Migration[8.1]
  def change
    add_column :products, :code, :string
    add_index :products, :code
  end
end
