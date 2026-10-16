import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryPills from './components/CategoryPills';
import ProductCard from './components/ProductCard';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import StockDetailsPage from './components/StockDetailsPage';
import CustomerOrdersModal from './components/CustomerOrdersModal';
import AuthModal from './components/AuthModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminPortal from './components/AdminPortal';
import { api, setAuthToken } from './services/api';
import { ShieldCheck, Flame, Phone, MapPin, Mail, Award, LayoutGrid, List, Truck } from 'lucide-react';

export default function App() {
  // App Core State
  const [shopConfig, setShopConfig] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_asc' | 'price_desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [recentOrderSuccess, setRecentOrderSuccess] = useState(null);

  // Applied Promo Code
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Active Tab: 'shop' | 'stock'
  const [activeTab, setActiveTab] = useState('shop');

  // URL Routing Sync
  const applyRoute = (pathname) => {
    const p = (pathname || '/').replace(/\/$/, '') || '/';
    if (p === '/admin') {
      setIsAdminOpen(true);
      setIsOrdersOpen(false);
      setIsTrackingOpen(false);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    } else if (p === '/stock') {
      if (user?.is_admin) {
        setActiveTab('stock');
      } else {
        setActiveTab('shop');
      }
      setIsAdminOpen(false);
      setIsOrdersOpen(false);
      setIsTrackingOpen(false);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    } else if (p === '/orders') {
      setIsOrdersOpen(true);
      setIsAdminOpen(false);
      setIsTrackingOpen(false);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    } else if (p === '/track') {
      setIsTrackingOpen(true);
      setIsAdminOpen(false);
      setIsOrdersOpen(false);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    } else if (p === '/cart') {
      setIsCartOpen(true);
      setIsAdminOpen(false);
      setIsOrdersOpen(false);
      setIsTrackingOpen(false);
      setIsCheckoutOpen(false);
    } else if (p === '/checkout') {
      setIsCheckoutOpen(true);
      setIsAdminOpen(false);
      setIsOrdersOpen(false);
      setIsTrackingOpen(false);
      setIsCartOpen(false);
    } else {
      setActiveTab('shop');
      setIsAdminOpen(false);
      setIsOrdersOpen(false);
      setIsTrackingOpen(false);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    }
  };

  const navigateTo = (path, replace = false) => {
    if (window.location.pathname !== path) {
      if (replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
    }
    applyRoute(path);
  };

  // Initial Load
  const initApp = async () => {
    try {
      // Load Shop Config
      const configData = await api.getShopConfig().catch(() => null);
      if (configData) setShopConfig(configData);

      // Check current user
      const authData = await api.getMe().catch(() => ({ logged_in: false, user: null }));
      if (authData?.logged_in) {
        setUser(authData.user);
        if (window.location.pathname === '/admin' && authData.user?.is_admin) {
          setIsAdminOpen(true);
        }
      }

      // Load Cart
      const cartData = await api.getCart().catch(() => null);
      if (cartData) setCart(cartData);

      // Load Categories
      const catData = await api.getProductCategories().catch(() => ({ categories: [] }));
      if (catData?.categories) {
        setCategories(catData.categories.map((c) => c.name));
      }

      // Load Products
      await fetchProducts(activeCategory, searchQuery, sortBy);
    } catch (e) {
      console.error('App init error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (cat = activeCategory, search = searchQuery, sort = sortBy) => {
    try {
      const data = await api.getProducts({ category: cat, search, sort });
      setProducts(data.products || []);
    } catch (e) {
      console.error('Failed to load products:', e);
    }
  };

  useEffect(() => {
    initApp();
    applyRoute(window.location.pathname);

    const handlePopState = () => {
      applyRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Re-fetch products on filter/search change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(activeCategory, searchQuery, sortBy);
    }, 150);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, sortBy]);

  // Cart Operations
  const handleAddToCart = async (productId, amount = 1) => {
    try {
      const res = await api.addToCart(productId, amount);
      if (res?.cart) setCart(res.cart);
    } catch (e) {
      alert(e.message || 'Could not add product to cart');
    }
  };

  const handleUpdateQuantity = async (itemId, qty) => {
    try {
      const res = await api.updateCartItem(itemId, qty);
      if (res?.cart) setCart(res.cart);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRemoveCartItem = async (itemId) => {
    try {
      const res = await api.removeCartItem(itemId);
      if (res?.cart) setCart(res.cart);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await api.clearCart();
      if (res?.cart) setCart(res.cart);
    } catch (e) {
      alert(e.message);
    }
  };

  // Auth Operations
  const handleLogin = async (email, password) => {
    const res = await api.login(email, password);
    if (res.token) setAuthToken(res.token);
    setUser(res.user);
    if (res.user?.is_admin) {
      navigateTo('/admin');
    } else {
      const cartData = await api.getCart();
      setCart(cartData);
    }
  };

  const handleRegister = async (email, password, conf) => {
    const res = await api.register(email, password, conf);
    if (res.token) setAuthToken(res.token);
    setUser(res.user);
    const cartData = await api.getCart();
    setCart(cartData);
  };

  const handleDemoLogin = async (role) => {
    const res = await api.demoLogin(role);
    if (res.token) setAuthToken(res.token);
    setUser(res.user);
    if (res.user?.is_admin) {
      navigateTo('/admin');
    } else {
      const cartData = await api.getCart();
      setCart(cartData);
    }
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    setAuthToken('');
    setUser(null);
    navigateTo('/');
    const cartData = await api.getCart().catch(() => null);
    setCart(cartData);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    navigateTo(activeTab === 'stock' ? '/stock' : '/');
  };

  const handleCloseOrders = () => {
    setIsOrdersOpen(false);
    navigateTo(activeTab === 'stock' ? '/stock' : '/');
  };

  const handleCloseTracking = () => {
    setIsTrackingOpen(false);
    navigateTo(activeTab === 'stock' ? '/stock' : '/');
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    navigateTo(activeTab === 'stock' ? '/stock' : '/');
  };

  // Order Placement
  const handleOrderPlaced = async (orderData) => {
    const res = await api.createOrder(orderData);
    setIsCheckoutOpen(false);
    setRecentOrderSuccess(res.order);
    const cartData = await api.getCart();
    setCart(cartData);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Prime Navigation Header */}
      <Navbar
        shopConfig={shopConfig}
        cart={cart}
        user={user}
        onOpenCart={() => navigateTo('/cart')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenOrders={() => navigateTo('/orders')}
        onOpenAdmin={() => navigateTo('/admin')}
        onOpenTracking={() => navigateTo('/track')}
        activeTab={activeTab}
        setActiveTab={(tab) => navigateTo(tab === 'stock' ? '/stock' : '/')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Storefront Body */}
      <main style={{ flex: 1 }}>
        {activeTab === 'stock' && user?.is_admin ? (
          <StockDetailsPage
            products={products}
            categories={categories}
            shopConfig={shopConfig}
            onAddToCart={handleAddToCart}
            onBackToShop={() => navigateTo('/')}
          />
        ) : (
          <>
            {/* Festive Hero Banner */}
            <HeroBanner
              shopConfig={shopConfig}
              onExplore={scrollToProducts}
              onOpenTracking={() => navigateTo('/track')}
            />

            {/* Content Container */}
            <div id="products-section" style={{ maxWidth: 1380, margin: '0 auto', padding: '0 20px 60px' }}>
              
              {/* Category Pills Bar */}
              <CategoryPills
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => setActiveCategory(cat)}
              />

              {/* Controls Bar: Sort, View mode & Count */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24, padding: '12px 18px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Showing <strong style={{ color: '#FFF' }}>{products.length}</strong> Sivakasi Cracker Products
                  {activeCategory !== 'All' && <span> in <strong style={{ color: 'var(--violet-bright)' }}>{activeCategory}</strong></span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Sort Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ background: '#0C0A14', border: '1px solid var(--border-subtle)', color: '#FFF', padding: '6px 12px', borderRadius: 8, fontSize: '0.85rem' }}
                    >
                      <option value="featured">✨ Featured & New</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.5)', padding: 3, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setViewMode('grid')}
                      style={{
                        background: viewMode === 'grid' ? 'var(--violet-gradient)' : 'none',
                        color: viewMode === 'grid' ? '#FFFFFF' : 'var(--text-muted)',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Grid Cards View"
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      style={{
                        background: viewMode === 'table' ? 'var(--violet-gradient)' : 'none',
                        color: viewMode === 'table' ? '#FFFFFF' : 'var(--text-muted)',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Table View"
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid or Wholesale Table */}
              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 16 }}>
                  <Flame size={44} color="var(--violet-light)" style={{ margin: '0 auto 12px' }} />
                  <h3 className="font-heading" style={{ color: '#FFF', fontSize: '1.3rem', fontWeight: 700 }}>
                    No Crackers Found in this Selection
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
                    Try searching with another keyword or select "All" categories.
                  </p>
                  <button 
                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                    className="btn-prime"
                    style={{ marginTop: 18 }}
                  >
                    View Full 2026 Catalog
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                /* Luxury Cards Grid */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              ) : (
                /* Wholesale Price List Table */
                <div className="glass-card" style={{ padding: 16, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '12px' }}>Cracker Item Name</th>
                        <th style={{ padding: '12px' }}>Category</th>
                        <th style={{ padding: '12px' }}>Retail MRP</th>
                        <th style={{ padding: '12px' }}>Wholesale Price ({shopConfig?.default_discount_percentage || 70}% Off)</th>
                        <th style={{ padding: '12px' }}>Stock</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Add to Cart</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 12px' }}>
                            <div style={{ fontWeight: 700, color: '#FFF' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#10B981' }}>Standard Sivakasi Brand</div>
                          </td>
                          <td style={{ padding: '14px 12px' }}>
                            <span className="badge-violet">{p.category}</span>
                          </td>
                          <td style={{ padding: '14px 12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{p.mrp}
                          </td>
                          <td style={{ padding: '14px 12px', fontWeight: 800, color: 'var(--violet-bright)', fontSize: '1rem' }}>
                            ₹{p.price}
                          </td>
                          <td style={{ padding: '14px 12px' }}>
                            <span style={{ color: p.stock_quantity > 0 ? '#34D399' : '#F87171', fontWeight: 700 }}>
                              {p.stock_quantity > 0 ? `${p.stock_quantity} left` : 'Out of Stock'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleAddToCart(p.id, 1)}
                              disabled={p.stock_quantity <= 0}
                              className="btn-prime"
                              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            >
                              Add to Cart
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Wholesale Assurance Strip */}
              <div style={{ marginTop: 60, padding: '36px 30px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(12, 10, 20, 0.95) 100%)', border: '1px solid var(--border-violet)', borderRadius: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--violet-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Award size={22} color="#FFFFFF" />
                    </div>
                    <div>
                      <h4 style={{ color: '#FFF', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                        Direct From Sivakasi
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                        We operate directly from the heart of Sivakasi, Tamil Nadu, eliminating all middlemen commissions.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShieldCheck size={22} color="#FFF" />
                    </div>
                    <div>
                      <h4 style={{ color: '#FFF', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                        100% Green Certified
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                        Produced strictly conforming to Supreme Court and PESO safety standards with 30% reduced emissions.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #38BDF8, #0284C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Truck size={22} color="#FFF" />
                    </div>
                    <div>
                      <h4 style={{ color: '#FFF', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                        Pan-India Transport LR
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                        Daily dispatches via VRL, ARC & Kranti. Instant tracking by LR or phone number.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <footer style={{ background: '#050508', borderTop: '1px solid var(--border-violet)', padding: '50px 20px 24px' }}>
        <div style={{ maxWidth: 1380, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 36, marginBottom: 40 }}>
            <div>
              <div className="font-display" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--violet-bright)', marginBottom: 12 }}>
                {shopConfig?.shop_name || 'Raksh Crackers'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                Direct factory fireworks wholesale and retail supply from Sivakasi, Tamil Nadu. Bringing joy, safety, and brilliant sparkles to families across India.
              </p>
              {(shopConfig?.instagram_url || shopConfig?.facebook_url) && (
                <div style={{ display: 'flex', gap: 10 }}>
                  {shopConfig?.instagram_url && (
                    <a href={shopConfig.instagram_url} target="_blank" rel="noreferrer" className="btn-secondary-dark" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      Instagram
                    </a>
                  )}
                  {shopConfig?.facebook_url && (
                    <a href={shopConfig.facebook_url} target="_blank" rel="noreferrer" className="btn-secondary-dark" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      Facebook
                    </a>
                  )}
                </div>
              )}
            </div>

            <div>
              <h4 style={{ color: '#FFF', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>
                Wholesale Categories
              </h4>
              <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Sparklers (10cm, 15cm, 30cm, 50cm Deluxe)</li>
                <li>Ground Chakkars & 5-in-1 Musical Wheels</li>
                <li>Flower Pots & Golden Jumbo Fountains</li>
                <li>Sky Symphony Rockets & Multi-Star Cakes</li>
                <li>VIP Sivakasi Family Hampers</li>
              </ul>
            </div>

            <div>
              <h4 style={{ color: '#FFF', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>
                Sivakasi Headquarters
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <MapPin size={16} color="var(--violet-light)" style={{ flexShrink: 0, marginTop: 4 }} />
                  <span>{shopConfig?.address || '123 Celebration Bypass Road, Sivakasi, Tamil Nadu - 626123'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Phone size={16} color="var(--violet-light)" />
                  <span>{shopConfig?.whatsapp_number || '+91 98421 54321'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={16} color="var(--violet-light)" />
                  <span>orders@rakshcrackers.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#FFF', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>
                Sivakasi Transport Logistics
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
                Daily parcel shipments booked through VRL, ARC, TAT, and Kranti Road Transport. Track your delivery LR receipt anytime.
              </p>
              <button 
                onClick={() => setIsTrackingOpen(true)}
                className="btn-outline-violet" 
                style={{ padding: '8px 16px', fontSize: '0.82rem', gap: 6 }}
              >
                <Truck size={14} />
                <span>Track Order by LR / Phone</span>
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>
              © 2026 {shopConfig?.shop_name || 'Raksh Crackers'}. Sivakasi Direct Wholesale Fireworks. All Rights Reserved.
            </div>
            <div>
              <span 
                onClick={() => {
                  if (user?.is_admin) {
                    setIsAdminOpen(true);
                  } else {
                    handleDemoLogin('admin').then(() => setIsAdminOpen(true));
                  }
                }} 
                style={{ cursor: 'pointer', color: 'var(--text-muted)', textDecoration: 'underline', fontSize: '0.75rem' }}
                title="Management Login"
              >
                Store Administration
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Concierge Widget - Only for customers */}
      {!user?.is_admin && (
        <FloatingWhatsApp shopConfig={shopConfig} whatsappNumber={shopConfig?.whatsapp_number} />
      )}

      {/* Modals & Drawers - Cart & Checkout for Customers Only */}
      {!user?.is_admin && (
        <>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={handleCloseCart}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onProceedToCheckout={() => {
              setIsCheckoutOpen(true);
              navigateTo('/checkout');
            }}
            appliedPromo={appliedPromo}
            setAppliedPromo={setAppliedPromo}
          />

          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => {
              setIsCheckoutOpen(false);
              navigateTo(isCartOpen ? '/cart' : '/');
            }}
            cart={cart}
            user={user}
            appliedPromo={appliedPromo}
            onOrderPlaced={handleOrderPlaced}
          />
        </>
      )}

      <OrderSuccessModal
        order={recentOrderSuccess}
        onClose={() => setRecentOrderSuccess(null)}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Live Parcel Tracking System (LR / Phone) */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={handleCloseTracking}
        onAddToCart={handleAddToCart}
      />

      <CustomerOrdersModal
        isOpen={isOrdersOpen}
        onClose={handleCloseOrders}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemoLogin={handleDemoLogin}
      />

      {/* Full Admin Command Center */}
      {isAdminOpen && (
        <AdminPortal
          shopConfig={shopConfig}
          user={user}
          onConfigUpdated={(cfg) => setShopConfig(cfg)}
          onClose={handleCloseAdmin}
        />
      )}
    </div>
  );
}
