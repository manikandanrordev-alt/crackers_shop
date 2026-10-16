module Api
  class ProductsController < BaseController
    before_action :ensure_admin!, only: [:create, :update, :destroy, :bulk_destroy, :import_csv]
    before_action :set_product, only: [:show, :update, :destroy]

    def index
      products = Product.with_attached_image.all

      if params[:category].present? && params[:category] != "All"
        products = products.where(category: params[:category])
      end

      if params[:search].present?
        query = "%#{params[:search].downcase}%"
        products = products.where("LOWER(name) LIKE ? OR LOWER(description) LIKE ?", query, query)
      end

      case params[:sort]
      when "price_asc"
        products = products.order(price: :asc)
      when "price_desc"
        products = products.order(price: :desc)
      when "name"
        products = products.order(name: :asc)
      else
        products = products.order(created_at: :desc)
      end

      render json: {
        products: products.map { |p| product_payload(p) },
        total: products.count,
        categories: Product.distinct.pluck(:category).compact.sort
      }
    end

    def categories
      cats = Product.group(:category).count
      render json: {
        categories: cats.map { |name, count| { name: name, count: count } }
      }
    end

    def show
      render json: { product: product_payload(@product) }
    end

    def create
      product = Product.new(product_params)

      # If price not provided or 0, calculate based on MRP and default discount
      if product.price.blank? || product.price.to_f.zero?
        config = ShopConfig.first
        discount = config&.default_discount_percentage.to_f
        if product.mrp.present? && discount > 0
          product.price = (product.mrp.to_f * (1.0 - (discount / 100.0))).round(2)
        else
          product.price = product.mrp || 0
        end
      end

      if product.save
        render json: {
          success: true,
          message: "Product created successfully",
          product: product_payload(product)
        }, status: :created
      else
        render json: {
          success: false,
          error: product.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    def update
      if @product.update(product_params)
        render json: {
          success: true,
          message: "Product updated successfully",
          product: product_payload(@product)
        }
      else
        render json: {
          success: false,
          error: @product.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    def destroy
      @product.destroy
      render json: { success: true, message: "Product deleted successfully" }
    end

    def bulk_destroy
      ids = params[:ids] || params[:product_ids] || []
      if ids.any?
        deleted_count = Product.where(id: ids).destroy_all.count
        render json: { success: true, message: "#{deleted_count} products deleted successfully" }
      else
        render json: { success: false, error: "No product IDs provided" }, status: :unprocessable_entity
      end
    end

    def import_csv
      require "csv"
      
      csv_text = if params[:file].present?
        params[:file].read
      elsif params[:csv_data].present?
        params[:csv_data]
      end

      if csv_text.blank?
        return render json: { success: false, error: "Please provide a CSV file or spreadsheet data" }, status: :unprocessable_entity
      end

      csv_text = csv_text.force_encoding("UTF-8").sub("\xEF\xBB\xBF", "")
      created = 0
      updated = 0
      errors = []

      config = ShopConfig.first
      default_discount = config&.default_discount_percentage.to_f
      default_discount = 70.0 if default_discount.zero?

      CSV.parse(csv_text, headers: true, header_converters: :symbol, skip_blanks: true) do |row|
        name = row[:name] || row[:product_name] || row[:item_name]
        next if name.blank?

        name = name.to_s.strip
        category = (row[:category] || row[:cat] || "Wholesale Crackers").to_s.strip
        mrp = (row[:mrp] || row[:retail_mrp] || row[:price]).to_f
        
        price = (row[:price] || row[:wholesale_price]).to_f
        if price.zero? && mrp > 0
          price = (mrp * (1.0 - (default_discount / 100.0))).round(2)
        end

        stock = (row[:stock] || row[:stock_quantity] || row[:quantity] || 100).to_i
        description = row[:description] || "#{name} - Sivakasi standard fireworks"

        prod = Product.where("lower(name) = ?", name.downcase).first || Product.new(name: name)
        is_new = prod.new_record?

        prod.category = category if category.present?
        prod.mrp = mrp if mrp > 0
        prod.price = price if price > 0
        prod.stock_quantity = stock
        prod.description = description if description.present?

        if prod.save
          if is_new
            created += 1
          else
            updated += 1
          end
        else
          errors << "#{name}: #{prod.errors.full_messages.join(', ')}"
        end
      end

      render json: {
        success: true,
        message: "Inventory sync complete! Created: #{created}, Updated: #{updated} products.",
        created_count: created,
        updated_count: updated,
        total_count: Product.count,
        errors: errors.first(10)
      }
    rescue CSV::MalformedCSVError => e
      render json: { success: false, error: "Malformed CSV file: #{e.message}" }, status: :unprocessable_entity
    rescue => e
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end

    private

    def set_product
      @product = Product.find_by(id: params[:id])
      unless @product
        render json: { error: "Product not found" }, status: :not_found
      end
    end

    def product_params
      params.permit(:name, :category, :description, :mrp, :price, :stock_quantity, :image)
    end
  end
end
