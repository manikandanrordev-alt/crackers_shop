if Rails.env.staging?
  Rails.application.config.after_initialize do
    next if User.exists?(email: "admin@raksh.com")

    User.create!(
      email: "admin@raksh.com",
      password: "password",
      password_confirmation: "password",
      role: :admin
    )

    Rails.logger.info "✅ Staging admin user created"
  end
end
