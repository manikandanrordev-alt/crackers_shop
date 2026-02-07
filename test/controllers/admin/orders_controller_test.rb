require "test_helper"

class Admin::OrdersControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @order = orders(:one)
    sign_in users(:one) # Admin
  end

  test "should get index" do
    get admin_orders_url
    assert_response :success
  end

  test "should show order" do
    get admin_order_url(@order)
    assert_response :success
  end
end
