Rails.application.routes.draw do
  get "spin_wheel/index"
  devise_for :users
  
  root "products#index"

  resources :products, only: [:index, :show]
  resources :orders, only: [:new, :create, :show, :index]
  resource :cart, only: [:show] do
    post :add_item
    post :remove_item
    post :update_item
  end

  namespace :admin do
    root "dashboard#index"
    resources :users, only: [:index]
    resources :products
    resources :orders, only: [:index, :show]
    resources :shop_configs, only: [:index, :update]
    
    # Fast Billing Routes
    get 'billing', to: 'billing#index'
    post 'billing/checkout', to: 'billing#checkout'
    get 'billing/search_products', to: 'billing#search_products'
  end
  
  # Spin wheel route
  post 'spin_wheel/spin', to: 'spin_wheel#spin'
end
