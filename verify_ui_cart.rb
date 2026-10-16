# Verify Layout
layout = File.read("app/views/layouts/application.html.erb")
if layout.include?(".floating-socials") && layout.include?("btn-whatsapp")
  puts "Layout: OK (Floating Socials Present)"
else
  puts "Layout: FAIL (Floating Socials Missing)"
end

# Verify Controller
controller = File.read("app/controllers/carts_controller.rb")
if controller.include?("format.json") && controller.include?("cart_total:")
  puts "Controller: OK (JSON Response Present)"
else
  puts "Controller: FAIL (JSON Response Missing)"
end

# Verify View
view = File.read("app/views/carts/show.html.erb")
if view.include?('id="cart-total"') && view.include?('id="item-total-')
  puts "View: OK (IDs Present)"
else
  puts "View: FAIL (IDs Missing)"
end

# Verify JS
js = File.read("app/javascript/controllers/shopping_cart_controller.js")
if js.include?("fetch(form.action") && js.include?("response.json()")
  puts "JS: OK (Fetch Logic Present)"
else
  puts "JS: FAIL (Fetch Logic Missing)"
end
