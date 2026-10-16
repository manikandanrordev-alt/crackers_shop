puts "--- Shop Config (Social Icons) ---"
config = ShopConfig.first
if config
  puts "WhatsApp: #{config.whatsapp_number.present? ? 'Yes' : 'No'}"
  puts "Instagram: #{config.instagram_url.present? ? 'Yes' : 'No'}"
  puts "Facebook: #{config.facebook_url.present? ? 'Yes' : 'No'}"
else
  puts "ShopConfig Missing!"
end

puts "\n--- Product Discount Check ---"
products = Product.all
if products.any?
  sample = products.first
  puts "Sample: #{sample.name}"
  puts "Price: #{sample.price}"
  puts "MRP: #{sample.mrp}"
  puts "Discount %: #{sample.discount_percentage}%"
  
  incorrect_discounts = products.select { |p| p.discount_percentage != 70 }
  if incorrect_discounts.any?
    puts "WARNING: #{incorrect_discounts.count} products do NOT have 70% discount."
    puts "Example incorrect: #{incorrect_discounts.first.discount_percentage}%"
  else
    puts "SUCCESS: All #{products.count} products have exactly 70% discount."
  end
else
  puts "No products found!"
end

puts "\n--- File Check ---"
puts "Turbo Stream View: #{File.exist?('app/views/carts/update_item.turbo_stream.erb') ? 'Exists' : 'Missing'}"
puts "JS Controller: #{File.exist?('app/javascript/controllers/shopping_cart_controller.js') ? 'Exists' : 'Missing'}"
