require "test_helper"

class Admin::ProductsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @product = products(:one)
    @user = users(:one) # Admin
    sign_in @user
  end

  test "should get index" do
    get admin_products_url
    assert_response :success
  end

  test "should get new" do
    get new_admin_product_url
    assert_response :success
  end

  test "should create product" do
    assert_difference("Product.count") do
      post admin_products_url, params: { product: { category: @product.category, description: @product.description, name: "New Unique Product", price: @product.price, stock_quantity: @product.stock_quantity } }
    end

    assert_redirected_to admin_products_url
  end

  test "should get edit" do
    get edit_admin_product_url(@product)
    assert_response :success
  end

  test "should update product" do
    patch admin_product_url(@product), params: { product: { category: @product.category, description: @product.description, name: @product.name, price: @product.price, stock_quantity: @product.stock_quantity } }
    assert_redirected_to admin_products_url
  end

  test "should destroy product" do
    # Create a product specifically for deletion to avoid FK issues with order_items
    product_to_delete = Product.create!(
      name: "Delete Me",
      description: "To be deleted",
      price: 10.0,
      stock_quantity: 10,
      category: "Test"
    )

    assert_difference("Product.count", -1) do
      delete admin_product_url(product_to_delete)
    end

    assert_redirected_to admin_products_url
  end
end
