require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get root_url
    assert_response :success
  end

  test "should show product" do
    get product_url(products(:one))
    assert_response :success
  end
end
