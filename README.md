# 🎆 Raksh Crackers - Sivakasi Direct
### Modern Luxury B2C & Wholesale Cracker E-Commerce Portal

[![Ruby on Rails](https://img.shields.io/badge/Ruby_on_Rails-8.1-CC0000?style=for-the-badge&logo=ruby-on-rails&logoColor=white)](https://rubyonrails.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Render](https://img.shields.io/badge/Deploy_to-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

An enterprise-grade, high-performance fireworks shopping and consignment tracking web application built for Sivakasi direct cracker sales. Features a state-of-the-art **Obsidian Noir & Neon Violet** design aesthetic, a 100% pure React SPA frontend, and a high-speed Rails 8 JSON API backend.

---

## ✨ Features

### 🛍️ Customer Experience
- **Luxury Obsidian & Neon Violet Design**: Sleek dark-mode aesthetic with glassmorphism, responsive grid layouts, and micro-interactions.
- **Dynamic Sivakasi Factory Discounts**: Automatic calculation of original price vs. factory discounted price (e.g. 80% Sivakasi direct discount) driven dynamically by store configuration.
- **Interactive Product Catalog**: Instant category filtering (Sparklers, Rockets, Flower Pots, Ground Chakkars, Bombs, Gift Boxes), search, and high-resolution modal quick views.
- **Seamless Shopping Cart & Checkout**: Slide-out cart drawer with live subtotal calculation, quantity adjustments, and direct WhatsApp order dispatch.
- **Floating WhatsApp Support**: Dedicated customer inquiry channel connected to the configured store support number.

### 🔐 Administrative & Role-Based Control
- **Strict Role-Based Segregation**: Customers and non-authenticated guests experience a streamlined shopping interface. Navigation tabs for **Live Factory Stock**, **Consignment LR Tracking**, and **Shop Catalog** management are rendered strictly for authenticated store administrators.
- **Live Factory Stock Management**: Real-time inventory tracking with stock level indicators and quick quantity adjustments.
- **Consignment LR Tracking System**: Search and live-status progression (Manifested → Dispatched → In Transit → Sivakasi Hub → Out for Delivery) by LR number or customer mobile number.
- **Dynamic Store Settings**: Manage store name, physical Sivakasi dispatch address, active discount percentage, WhatsApp contact, social media links, and logo directly from the admin panel without code changes.

### ⚡ Architectural Highlights
- **100% Pure React SPA**: All legacy ERB templates and Rails CSS removed. The frontend is built with React 18, compiled with Vite, and served seamlessly by Rails.
- **Persistent SPA Routing**: Clean browser URL management (`/`, `/stock`, `/orders`, `/track`, `/admin`) with full support for direct links and page refresh.
- **High-Performance Rails 8 API**: Utilizes Puma, ActiveStorage (Cloudinary integrated), Devise authentication, and Solid Queue/Solid Cache.

---

## 🛠️ Tech Stack

- **Backend**: Ruby 4.0.x / Rails 8.1
- **Database**: PostgreSQL
- **Frontend**: React 18, Vite, Lucide Icons, Modern Vanilla CSS Design System
- **Asset Pipeline**: Propshaft & Precompiled React SPA in `public/dist/`
- **File & Media Storage**: Cloudinary / ActiveStorage
- **Authentication**: Devise + Role-Based Access Control (`admin` vs `customer`)

---

## 🚀 Local Development Setup

### Prerequisites
- **Ruby**: 3.3+ (or 4.0.x)
- **Node.js**: 18+ & npm
- **PostgreSQL**: Running locally on port 5432

### 1. Clone the Repository
```bash
git clone https://github.com/manikandanrordev-alt/crackers_shop.git
cd crackers_shop
```

### 2. Install Dependencies
```bash
# Install Ruby gems
bundle install

# Install React frontend dependencies
cd client
npm install
cd ..
```

### 3. Setup Database
```bash
# Create, migrate, and seed initial database
bundle exec rails db:create db:migrate db:seed
```

> **Default Seed Admin Account:**
> - **Email**: `admin@raksh.com`
> - **Password**: `password`

### 4. Build React Frontend
```bash
cd client
npm run build
cd ..
```

### 5. Start the Rails Server
```bash
bundle exec rails server -p 3000
```
Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## ☁️ 1-Click Production Deployment (Render)

This repository includes a native **[Render Blueprint](https://render.com/docs/blueprint-spec)** (`render.yaml`) that automatically provisions both the **Web Application** and **PostgreSQL Database** together in one dashboard.

### Steps to Deploy:
1. Fork or push this repository to your GitHub account.
2. Sign in to **[Render.com](https://dashboard.render.com)**.
3. Click **New +** → **Blueprint**.
4. Select your `crackers_shop` repository and choose the `main` branch.
5. Click **Apply**.

Render will automatically:
- Provision a free managed PostgreSQL database (`crackers-db`).
- Execute `bin/render-build.sh` (installing gems and precompiling assets).
- Run `rails db:prepare` and `rails db:seed` to prepare tables and initial data.
- Start Puma with HTTPS enabled.

---

## 🔑 Environment Variables Reference

When deploying to production, configure the following variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `RAILS_ENV` | Application environment | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `SECRET_KEY_BASE` | Encryption secret for sessions & JWT | Generated via `rails secret` |
| `RAILS_SERVE_STATIC_FILES` | Enables Puma/Thruster to serve React SPA | `true` |
| `CLOUDINARY_URL` | Cloudinary credentials for product images & PDFs | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` |

---

## 📁 Project Directory Structure

```text
crackers_shop/
├── app/
│   ├── controllers/
│   │   ├── api/
│   │   │   ├── admin/           # Admin-only endpoints (billing, products, stock)
│   │   │   ├── orders_controller.rb
│   │   │   ├── products_controller.rb
│   │   │   └── shop_config_controller.rb
│   │   └── home_controller.rb   # SPA Host controller (renders React dist/index.html)
│   └── models/                  # ActiveRecord models (Product, Order, ShopConfig, User)
├── client/                      # Pure React 18 Application (Vite)
│   ├── src/
│   │   ├── components/          # UI Components (Navbar, Hero, ProductGrid, AdminPortal, etc.)
│   │   ├── services/api.js      # REST API client
│   │   ├── App.jsx              # Main SPA router & state management
│   │   └── index.css            # Obsidian Noir & Neon Violet Design System
├── config/                      # Rails application & route configurations
├── db/                          # Database schema, migrations, and seeds
├── public/dist/                 # Production-compiled React frontend assets
├── bin/render-build.sh          # Automated build script for Render deployment
└── render.yaml                  # 1-Click Infrastructure as Code deployment blueprint
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
