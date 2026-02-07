json.extract! product, :id, :name, :price, :description, :stock_quantity, :category, :created_at, :updated_at
json.url product_url(product, format: :json)
