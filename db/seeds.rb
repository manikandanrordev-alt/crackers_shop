# Admin User
User.find_or_create_by!(email: 'admin@raksh.com') do |u|
  u.password = 'password'
  u.password_confirmation = 'password'
  u.role = :admin
end

puts "Admin user created: admin@raksh.com / password"

# Sample Products
categories = ['Sparklers', 'Rockets', 'Flower Pots', 'Ground Chakkars', 'Bombs', 'Gift Boxes']

20.times do |i|
  Product.create!(
    name: "#{Faker::Commerce.product_name} #{i}",
    description: Faker::Lorem.sentence(word_count: 10),
    price: Faker::Commerce.price(range: 50..2000),
    stock_quantity: rand(10..100),
    category: categories.sample
  )
end

puts "Sample products created."
