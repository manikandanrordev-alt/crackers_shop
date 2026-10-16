puts "--- Cleaning Database ---"
CartItem.destroy_all
OrderItem.destroy_all
Cart.destroy_all
Order.destroy_all
Product.destroy_all
User.destroy_all
ShopConfig.destroy_all

puts "--- Creating Users ---"
user = User.create!(email: "user@example.com", password: "password", password_confirmation: "password")
admin = User.create!(email: "admin@example.com", password: "password", password_confirmation: "password", role: :admin)

puts "--- Creating Shop Config (Social Icons) ---"
ShopConfig.create!(
  shop_name: "Raksh Crackers",
  whatsapp_number: "919876543210",
  instagram_url: "https://instagram.com/rakshcrackers",
  facebook_url: "https://facebook.com/rakshcrackers"
)

puts "--- Creating Products ---"
ws = ["Standard", "Premium", "Deluxe", "Supreme"]
cats = ["Sparklers", "Flower Pots", "Ground Chakkars", "Rockets"]

20.times do |i|
  price = rand(100..1000)
  # Formula: Price = MRP * (1 - Discount%)
  # We want Discount% = 70% = 0.7
  # Price = MRP * 0.3
  # So MRP = Price / 0.3
  mrp = (price / 0.3).ceil 
  
  Product.create!(
    name: "#{ws.sample} #{cats.sample} #{i+1}",
    category: cats.sample,
    price: price,
    mrp: mrp,
    stock_quantity: 100,
    description: "Best quality crackers for Diwali."
  )
end

puts "--- Done! Created 20 products with 70% Discount and Social Config ---"
