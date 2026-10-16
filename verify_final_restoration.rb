puts "=== Starting FINAL Verification ==="

# 1. Verify Shop Config Params & Logo
config = ShopConfig.first_or_create(shop_name: "Raksh Crackers")
config.update!(default_discount_percentage: 15.0)
puts "Shop Config Discount: #{config.reload.default_discount_percentage}% (Expected 15.0)"

# Simulate Logo Attachment
File.open("test_final_logo.png", "wb") { |f| f.write("dummy") }
config.logo.attach(io: File.open("test_final_logo.png"), filename: "logo.png", content_type: "image/png")
puts "Shop Config Logo Attached? #{config.logo.attached?}"
File.delete("test_final_logo.png") if File.exist?("test_final_logo.png")

# 2. Verify Product Form View Content
view_content = File.read("app/views/admin/products/_form.html.erb")
if view_content.include?('id="product_mrp"') && 
   view_content.include?('id="product_price"') && 
   view_content.include?('readonly: true') &&
   view_content.include?('calculatePrice')
  puts "Product Form View: VERIFIED (IDs, ReadOnly, JS present)"
else
  puts "Product Form View: FAILED - Missing content!"
   puts view_content.last(500) # Print tail if failed
end

# 3. Verify Bulk Delete
route_defined = Rails.application.routes.routes.map(&:defaults).include?({controller: "admin/products", action: "bulk_destroy"})
puts "Bulk Destroy Route: #{route_defined ? 'YES' : 'NO'}"

controller_method = Admin::ProductsController.instance_methods.include?(:bulk_destroy)
puts "Controller Action: #{controller_method ? 'YES' : 'NO'}"

puts "=== Verification Complete ==="
