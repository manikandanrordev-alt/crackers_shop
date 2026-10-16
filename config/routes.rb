Rails.application.routes.draw do
  devise_for :users, skip: [:sessions, :registrations, :passwords]

  # REST API for React Frontend
  namespace :api do
    # Authentication & Session
    get "auth/me", to: "auth#me"
    post "auth/login", to: "auth#login"
    post "auth/register", to: "auth#register"
    delete "auth/logout", to: "auth#logout"
    post "auth/demo_login", to: "auth#demo_login"

    # Shop Configuration
    get "shop_config", to: "shop_config#show"
    put "shop_config", to: "shop_config#update"
    patch "shop_config", to: "shop_config#update"

    # Products & Categories
    resources :products, only: [:index, :show, :create, :update, :destroy] do
      collection do
        get :categories
        post :bulk_destroy
        delete :bulk_destroy
        post :import_csv
      end
    end

    # Cart
    resource :cart, only: [:show], controller: "cart" do
      post :add_item
      post :update_item
      post :remove_item
      post :clear
    end

    # Orders & Tracking
    resources :orders, only: [:index, :show, :create, :update] do
      collection do
        get :track
      end
    end

    # Admin Management
    namespace :admin do
      get "dashboard", to: "dashboard#index"
      get "users", to: "users#index"
      
      resources :products, only: [:create, :update, :destroy] do
        collection do
          post :bulk_destroy
          delete :bulk_destroy
          post :import_csv
        end
      end

      resources :orders, only: [:update]

      # Fast Billing (POS)
      get "billing/products", to: "billing#search_products"
      post "billing/checkout", to: "billing#checkout"
      get "billing/tts", to: "billing#tts"
      post "billing/ai_parse", to: "billing#ai_parse"
    end
  end

  # Fallback to SPA root for all non-API and non-Rails asset requests
  root "home#index"
  get "*path", to: "home#index", constraints: ->(req) { !req.path.start_with?("/api", "/rails") }
end
