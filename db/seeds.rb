# Admin User
admin = User.find_or_create_by!(email: 'admin@raksh.com') do |u|
  u.password = 'password'
  u.password_confirmation = 'password'
  u.role = :admin
end
puts "Admin user ready: #{admin.email} / password"

# Shop Configuration
shop = ShopConfig.first_or_create!(
  shop_name: "Raksh Crackers - Sivakasi Direct",
  address: "123 Celebration Bypass Road, Sivakasi, Tamil Nadu - 626123",
  whatsapp_number: "+91 98421 54321",
  default_discount_percentage: 80.0
)
puts "Shop config ready: #{shop.shop_name} (#{shop.default_discount_percentage}%)"

# Sample Products (only if table empty)
if Product.count == 0
  categories = ['Sparklers', 'Rockets', 'Flower Pots', 'Ground Chakkars', 'Bombs', 'Gift Boxes']
  20.times do |i|
    Product.create!(
      name: "#{Faker::Commerce.product_name} #{i + 1}",
      description: Faker::Lorem.sentence(word_count: 10),
      price: Faker::Commerce.price(range: 50..2000),
      stock_quantity: rand(15..120),
      category: categories.sample
    )
  end
  puts "Sample products seeded."
else
  puts "Products already exist (#{Product.count} products)."
end
