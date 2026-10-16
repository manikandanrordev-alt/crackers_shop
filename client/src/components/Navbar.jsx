import React, { useState } from 'react';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  ShieldCheck, 
  Search, 
  Flame, 
  Package,
  Truck,
  Boxes,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';

export default function Navbar({ 
  shopConfig, 
  cart, 
  user, 
  onOpenCart, 
  onOpenAuth, 
  onLogout, 
  onOpenOrders,
  onOpenAdmin,
  onOpenTracking,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartCount = cart?.total_items || 0;
  const totalCartPrice = cart?.total_price || 0;
  const discountPct = shopConfig?.default_discount_percentage || 70;
  const shopName = shopConfig?.shop_name || 'Raksh Crackers';

  return (
    <header className="sticky top-0 z-50 glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', background: 'rgba(5, 5, 8, 0.96)', borderBottom: '1px solid var(--border-violet)', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
      {/* Top Banner Notice */}
      <div style={{ background: 'linear-gradient(90deg, #3B0764 0%, #6B21A8 50%, #3B0764 100%)', padding: '5px 16px', fontSize: '0.78rem', color: '#F3E8FF', fontWeight: 600, textAlign: 'center', letterSpacing: '0.02em' }}>
        ✨ {shopName} • Direct Sivakasi Factory Wholesale — Flat {discountPct}% Off • Pan-India Transport LR Tracking ✨
      </div>

      {/* Main Top Header Bar */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        {/* Brand Logo & Name */}
        <div 
          onClick={() => { setActiveTab('shop'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: 'none', flexShrink: 0 }}
        >
          <div style={{ 
            width: 38, 
            height: 38, 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, #C084FC 0%, #7E22CE 85%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
            border: '2px solid rgba(216, 180, 254, 0.5)',
            flexShrink: 0
          }}>
            <Flame size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <span className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', lineHeight: 1.2 }}>
                {shopName}
              </span>
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(168, 85, 247, 0.18)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: 4, color: '#C084FC', fontWeight: 700 }}>
                Sivakasi
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              Direct Factory Wholesale & Retail
            </div>
          </div>
        </div>

        {/* Search Bar - Center and Spacious */}
        <div style={{ flex: '1 1 360px', maxWidth: 460, position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search crackers by name (e.g. sparklers, rockets, shots)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-prime"
            style={{ paddingLeft: 38, paddingRight: 32, height: 38, fontSize: '0.82rem', borderRadius: 9999, width: '100%' }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Header Utilities: Track, Orders, Cart, User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Quick Track Button */}
          <button
            onClick={onOpenTracking}
            className="btn-outline-violet"
            style={{ padding: '6px 13px', fontSize: '0.8rem', gap: 6, whiteSpace: 'nowrap' }}
            title="Track parcel with Sivakasi LR Number or Phone Number"
          >
            <Truck size={14} />
            <span>Track LR</span>
          </button>

          {/* Orders History if logged in */}
          {user && (
            <button 
              onClick={onOpenOrders}
              className="btn-secondary-dark"
              style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              title="My Orders"
            >
              <Package size={14} />
              <span>Orders</span>
            </button>
          )}

          {/* Admin Console Shortcut (only if user is admin) */}
          {user?.is_admin && (
            <button 
              onClick={onOpenAdmin}
              className="btn-prime"
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', whiteSpace: 'nowrap' }}
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </button>
          )}

          {/* Cart Pill - Hidden for Store Admin */}
          {!user?.is_admin && (
            <button 
              onClick={onOpenCart}
              className="btn-prime"
              style={{ padding: '6px 15px', position: 'relative', whiteSpace: 'nowrap' }}
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span style={{ 
                  background: '#F43F5E', 
                  color: '#FFF', 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  padding: '1px 6px', 
                  borderRadius: 9999, 
                  marginLeft: 4,
                  boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
                }}>
                  {totalCartCount}
                </span>
              )}
              {totalCartPrice > 0 && (
                <span style={{ marginLeft: 6, opacity: 0.95, fontSize: '0.8rem', fontWeight: 700 }}>
                  ₹{totalCartPrice}
                </span>
              )}
            </button>
          )}

          {/* User Auth Menu */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="btn-secondary-dark"
                style={{ padding: '6px 11px', gap: 6, whiteSpace: 'nowrap' }}
              >
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(168, 85, 247, 0.25)', border: '1px solid var(--violet-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#C084FC' }}>
                  {user.email[0].toUpperCase()}
                </div>
                <span style={{ fontSize: '0.8rem' }}>{user.name || user.email.split('@')[0]}</span>
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="btn-outline-violet"
                style={{ padding: '6px 13px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
              >
                <User size={14} />
                <span>Login</span>
              </button>
            )}

            {/* User Dropdown */}
            {userDropdownOpen && user && (
              <div 
                className="glass-panel"
                style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: '120%', 
                  width: 220, 
                  padding: 12, 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-violet)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.85), 0 0 20px rgba(168, 85, 247, 0.2)',
                  borderRadius: 12,
                  zIndex: 100
                }}
              >
                <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.85rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  <div style={{ marginTop: 4 }}>
                    <span className="badge-violet" style={{ fontSize: '0.68rem' }}>
                      {user.is_admin ? '👑 Store Manager' : '👤 Customer'}
                    </span>
                  </div>
                </div>

                {user.is_admin && (
                  <button 
                    onClick={() => { onOpenAdmin(); setUserDropdownOpen(false); }}
                    style={{ width: '100%', textAlign: 'left', padding: '7px 8px', background: 'none', border: 'none', color: '#10B981', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', borderRadius: 6 }}
                  >
                    <ShieldCheck size={14} /> Admin Dashboard
                  </button>
                )}

                <button 
                  onClick={() => { onOpenOrders(); setUserDropdownOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '7px 8px', background: 'none', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', borderRadius: 6 }}
                >
                  <Package size={14} /> My Orders
                </button>

                <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '6px 0' }} />

                <button 
                  onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                  style={{ width: '100%', textAlign: 'left', padding: '7px 8px', background: 'rgba(244, 63, 94, 0.1)', border: 'none', color: '#FB7185', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', borderRadius: 6, fontWeight: 600 }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Dedicated Navigation Links Strip - Only for Admin */}
      {user?.is_admin && (
        <div style={{ borderTop: '1px solid rgba(168, 85, 247, 0.15)', background: 'rgba(9, 7, 16, 0.85)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '4px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setActiveTab('shop')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '7px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'shop' ? 'rgba(168, 85, 247, 0.22)' : 'transparent',
                color: activeTab === 'shop' ? 'var(--violet-bright)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'shop' ? 700 : 500,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <ShoppingBag size={15} />
              <span>Shop Catalog</span>
            </button>


            <button
              onClick={() => setActiveTab('stock')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '7px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'stock' ? 'rgba(168, 85, 247, 0.22)' : 'transparent',
                color: activeTab === 'stock' ? 'var(--violet-bright)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'stock' ? 700 : 500,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Boxes size={15} />
              <span>Live Factory Stock</span>
            </button>

            <button
              onClick={onOpenTracking}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '7px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Truck size={15} />
              <span>Track Consignment LR</span>
            </button>
          </div>
        </div>
      </div>
      )}
    </header>
  );
}
