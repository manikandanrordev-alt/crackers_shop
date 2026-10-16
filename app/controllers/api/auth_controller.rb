module Api
  class AuthController < BaseController
    def me
      if current_user
        render json: { logged_in: true, user: current_user_payload }
      else
        render json: { logged_in: false, user: nil }
      end
    end

    def login
      email = params[:email].to_s.strip.downcase
      password = params[:password].to_s

      user = User.find_by(email: email)
      if user&.valid_password?(password)
        session[:user_id] = user.id
        sign_in(:user, user) rescue nil
        token = generate_auth_token(user)

        render json: {
          success: true,
          message: "Signed in successfully",
          token: token,
          user: current_user_payload(user)
        }
      else
        render json: {
          success: false,
          error: "Invalid email or password"
        }, status: :unauthorized
      end
    end

    def register
      email = params[:email].to_s.strip.downcase
      password = params[:password].to_s
      password_confirmation = params[:password_confirmation].to_s.presence || password

      if email.blank? || password.blank?
        return render json: { success: false, error: "Email and password are required" }, status: :unprocessable_entity
      end

      if User.exists?(email: email)
        return render json: { success: false, error: "Email has already been taken" }, status: :unprocessable_entity
      end

      user = User.new(
        email: email,
        password: password,
        password_confirmation: password_confirmation,
        role: :customer,
        points: 50 # Bonus festive points on sign up!
      )

      if user.save
        session[:user_id] = user.id
        sign_in(:user, user) rescue nil
        token = generate_auth_token(user)

        render json: {
          success: true,
          message: "Account registered successfully",
          token: token,
          user: current_user_payload(user)
        }, status: :created
      else
        render json: {
          success: false,
          error: user.errors.full_messages.join(", ")
        }, status: :unprocessable_entity
      end
    end

    def logout
      session.delete(:user_id)
      sign_out(:user) rescue nil
      render json: { success: true, message: "Logged out successfully" }
    end

    def demo_login
      role = params[:role] == "admin" ? :admin : :customer
      user = User.find_by(role: role)

      unless user
        email = role == :admin ? "admin@raksh.com" : "customer@raksh.com"
        user = User.find_or_create_by!(email: email) do |u|
          u.password = "password"
          u.password_confirmation = "password"
          u.role = role
          u.points = 100
        end
      end

      session[:user_id] = user.id
      sign_in(:user, user) rescue nil
      token = generate_auth_token(user)

      render json: {
        success: true,
        message: "Logged in as #{user.role}",
        token: token,
        user: current_user_payload(user)
      }
    end
  end
end
