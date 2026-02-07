class Admin::ProductsController < Admin::AdminController
  before_action :set_product, only: [:edit, :update, :destroy]

  def index
    @products = Product.with_attached_image.all
  end

  def new
    @product = Product.new
  end

  def create
    @product = Product.new(product_params)
    if @product.save
      redirect_to admin_products_path, notice: "Product created successfully."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @product.update(product_params)
      redirect_to admin_products_path, notice: "Product updated successfully."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    redirect_to admin_products_path, notice: "Product deleted."
  end

  def bulk_destroy
    if params[:product_ids].present?
      Product.where(id: params[:product_ids]).destroy_all
      redirect_to admin_products_path, notice: "Selected products were successfully deleted."
    else
      redirect_to admin_products_path, alert: "No products selected."
    end
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :description, :price, :stock_quantity, :category, :image, :mrp)
  end
end
