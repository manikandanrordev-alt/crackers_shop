class Admin::ShopConfigsController < Admin::AdminController
  def index
    @shop_config = ShopConfig.first_or_create(shop_name: "Raksh Crackers")
  end

  def update
    @shop_config = ShopConfig.first
    if @shop_config.update(shop_config_params)
      redirect_to admin_shop_config_path, notice: "Shop settings updated successfully."
    else
      render :index, status: :unprocessable_entity
    end
  end

  private

  def shop_config_params
    params.require(:shop_config).permit(:shop_name, :whatsapp_number, :instagram_url, :facebook_url, :default_discount_percentage, :logo)
  end
end
