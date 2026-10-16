include ActionView::Helpers::NumberHelper
product = Product.find(2)
html = ApplicationController.render(
  inline: <<-ERB,
    <% if product.mrp.present? && product.mrp > product.price %>
      <span class="text-muted small" style="text-decoration: line-through;"><%= number_to_currency(product.mrp, unit: "₹", precision: 0) %></span>
    <% end %>
    <span class="fw-bold text-success" style="font-size: 1.2rem;"><%= number_to_currency(product.price, unit: "₹", precision: 0) %></span>
  ERB
  locals: { product: product }
)
puts "--- Generated HTML ---"
puts html
