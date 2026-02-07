puts "--- Products Checking ---"
Product.all.each do |p|
  puts "ID: #{p.id} | Name: #{p.name} | Price: #{p.price} | MRP: #{p.mrp} | Condition Met: #{p.mrp.to_f > p.price}"
end
puts "--- Asset Config ---"
puts Rails.application.config.assets.paths
