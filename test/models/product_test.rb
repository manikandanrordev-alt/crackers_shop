require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "the truth" do
    assert true
  end

  test "product has name" do
    product = products(:one)
    assert_equal "Ground Chakra", product.name
  end
end
