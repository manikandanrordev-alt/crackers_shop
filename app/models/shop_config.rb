class ShopConfig < ApplicationRecord
  validates :shop_name, presence: true, uniqueness: true
  validates :whatsapp_number, presence: true, allow_blank: true
  
  validate :validate_social_urls

  private

  def validate_social_urls
    [:instagram_url, :facebook_url].each do |attr|
      value = self[attr]
      next if value.blank?

      begin
        uri = URI.parse(value)
        unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
          errors.add(attr, "must be a valid URL starting with http:// or https://")
        end
      rescue URI::InvalidURIError
        errors.add(attr, "is not a valid URL")
      end
    end
  end
end
