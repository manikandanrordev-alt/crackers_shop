class CreateInitialAdminUser < ActiveRecord::Migration[8.1]
  def up
    # Create admin user if it doesn't exist
    User.find_or_create_by!(email: 'admin@raksh.com') do |u|
      u.password = 'password'
      u.password_confirmation = 'password'
      u.role = :admin
    end
  rescue => e
    # Log error but don't fail migration if user creation fails (e.g. validtion errors)
    puts "Could not create admin user: #{e.message}"
  end

  def down
    # Ideally we don't want to delete data in production, but for reversibility:
    User.find_by(email: 'admin@raksh.com')&.destroy
  end
end
