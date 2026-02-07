if Rails.env.staging?
  Rails.application.config.to_prepare do
    begin
      admin = User.find_or_initialize_by(email: "admin@raksh.com")

      # Always ensure role
      admin.role = "admin"

      # 🔑 FORCE reset password if missing or invalid
      if admin.encrypted_password.blank?
        Rails.logger.info "🔐 Resetting admin password"

        admin.password = "password"
        admin.password_confirmation = "password"
      end

      admin.save!

      Rails.logger.info "✅ Staging admin ready: #{admin.email}"

    rescue => e
      Rails.logger.error "❌ Staging admin setup failed: #{e.class} - #{e.message}"
    end
  end
end
