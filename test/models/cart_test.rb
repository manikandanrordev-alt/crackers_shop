require "test_helper"

class CartTest < ActiveSupport::TestCase
  test "should belong to user" do
    cart = Cart.new(user: users(:one))
    assert cart.save
  end
end
