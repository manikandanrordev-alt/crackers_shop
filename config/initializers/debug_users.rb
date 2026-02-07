if Rails.env.staging?
  Rails.application.config.after_initialize do
    Rails.logger.info "USERS IN DB:"
    User.all.each do |u|
      Rails.logger.info " - #{u.email} | role=#{u.role}"
    end
  end
end
