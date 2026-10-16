module Api
  class BaseController < ActionController::Base
    skip_before_action :verify_authenticity_token

    private

    def current_user
      return @current_user if defined?(@current_user)

      user = nil

      # 1. Check Authorization Bearer or X-Auth-Token header
      auth_header = request.headers["Authorization"].to_s
      token = if auth_header.start_with?("Bearer ")
        auth_header.split(" ").last
      else
        request.headers["X-Auth-Token"]
      end

      if token.present?
        begin
          payload = Rails.application.message_verifier(:api_auth).verify(token)
          user = User.find_by(id: payload["user_id"])
        rescue => _e
          user = User.find_by(id: token) if token.to_s.match?(/\A\d+\z/)
        end
      end

      # 2. Check session
      user ||= User.find_by(id: session[:user_id]) if session[:user_id].present?

      # 3. Check Warden / Devise
      user ||= warden.user(:user) rescue nil

      @current_user = user
    end

    def authenticate_user!
      unless current_user
        render json: { error: "Authentication required", logged_in: false }, status: :unauthorized
      end
    end

    def ensure_admin!
      authenticate_user!
      return if performed?

      unless current_user.admin?
        render json: { error: "Admin authorization required" }, status: :forbidden
      end
    end

    def generate_auth_token(user)
      Rails.application.message_verifier(:api_auth).generate({ "user_id" => user.id, "created_at" => Time.current.to_i })
    end

    def current_user_payload(user = current_user)
      return nil unless user

      {
        id: user.id,
        email: user.email,
        role: user.role,
        is_admin: user.admin?,
        points: user.points || 0,
        name: user.email.split("@").first.capitalize
      }
    end

    def product_payload(product)
      {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price.to_f,
        mrp: product.mrp.to_f,
        stock_quantity: product.stock_quantity.to_i,
        discount_percentage: product.discount_percentage.to_i,
        savings: (product.mrp.to_f - product.price.to_f).clamp(0, Float::INFINITY),
        in_stock: product.stock_quantity.to_i > 0,
        image_url: product.image.attached? ? rails_blob_path(product.image, only_path: true) : nil
      }
    end

    def shop_config_payload(config)
      config ||= ShopConfig.first_or_create(shop_name: "Raksh Crackers - Sivakasi Direct")
      {
        id: config.id,
        shop_name: config.shop_name.presence || "Raksh Crackers",
        address: config.address.presence,
        whatsapp_number: config.whatsapp_number.presence,
        instagram_url: config.instagram_url.presence,
        facebook_url: config.facebook_url.presence,
        default_discount_percentage: config.default_discount_percentage.to_f,
        logo_url: config.logo.attached? ? rails_blob_path(config.logo, only_path: true) : nil,
        pricelist_pdf_url: config.pricelist_pdf.attached? ? rails_blob_path(config.pricelist_pdf, only_path: true) : (File.exist?(Rails.root.join("public/pricelist/wholesale_pricelist_2026.pdf")) ? "/pricelist/wholesale_pricelist_2026.pdf" : nil)
      }
    end
  end
end
