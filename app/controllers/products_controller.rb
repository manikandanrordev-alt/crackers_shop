class ProductsController < ApplicationController
  def index
    @products = Product.all
    if params[:category].present?
      @products = @products.where(category: params[:category])
    end
  end

  def show
    @product = Product.find(params[:id])
  end
end
