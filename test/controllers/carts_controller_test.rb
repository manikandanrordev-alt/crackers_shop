require "test_helper"

class CartsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @user = users(:one)
    @product = products(:one)
    sign_in @user
  end

  test "should add item to cart" do
    assert_difference("CartItem.count") do
      post add_item_cart_url, params: { product_id: @product.id, amount: 1 }
    end
    assert_redirected_to cart_url
  end
end
