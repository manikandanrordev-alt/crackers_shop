class HomeController < ApplicationController
  def index
    @featured_products = Product.limit(4) # Example: Show a few products on home if needed, or just static content
  end
end
