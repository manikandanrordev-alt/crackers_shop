module Api
  class ShopConfigController < BaseController
    before_action :ensure_admin!, only: [:update]

    def show
      config = ShopConfig.first_or_create(shop_name: "Raksh Crackers - Sivakasi Direct")
      render json: shop_config_payload(config)
    end

    def update
      config = ShopConfig.first_or_create(shop_name: "Raksh Crackers - Sivakasi Direct")
      
      update_params = params.permit(
        :shop_name,
        :address,
        :whatsapp_number,
        :instagram_url,
        :facebook_url,
        :default_discount_percentage,
        :logo,
        :pricelist_pdf
      )

      if config.update(update_params)
        render json: {
          success: true,
          message: "Shop configuration updated successfully",
          config: shop_config_payload(config)
        }
      else
        render json: {
          success: false,
          error: config.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end
  end
end
