require "test_helper"

class Admin::DashboardControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    sign_in users(:one) # Admin user
  end

  test "should get index" do
    get admin_root_url
    assert_response :success
  end
end
