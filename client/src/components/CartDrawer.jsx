import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onProceedToCheckout,
  appliedPromo,
  setAppliedPromo
}) {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState(appliedPromo?.code || '');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const items = cart?.items || [];
  const totalPrice = cart?.total_price || 0;
  const totalSavings = cart?.total_savings || 0;

  // Handle promo code apply
  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoInput.trim().toUpperCase();

    if (!code) {
      setAppliedPromo(null);
      return;
    }

    if (code === 'DIWALI10') {
      const discountPct = 10;
      setAppliedPromo({ code, discountPct, label: '10% Extra Wholesale Discount' });
      setPromoSuccess('10% Festive Discount Applied!');
    } else if (code === 'VIP15') {
      const discountPct = 15;
      setAppliedPromo({ code, discountPct, label: '15% VIP Festive Rebate' });
      setPromoSuccess('15% VIP Discount Applied!');
    } else if (code === 'BOOM5') {
      const discountPct = 5;
      setAppliedPromo({ code, discountPct, label: '5% Express Bonus' });
      setPromoSuccess('5% Express Bonus Applied!');
    } else if (code === 'CASH100') {
      if (totalPrice < 1000) {
        setPromoError('Min order ₹1,000 required for CASH100');
        return;
      }
      setAppliedPromo({ code, discountAmount: 100, label: '₹100 Festive Cash Off' });
      setPromoSuccess('₹100 Festive Cash Applied!');
    } else if (code === 'FREESPARK') {
      setAppliedPromo({ code, gift: 'Free 10cm Sparklers Box', label: 'Free Sparkler Box on Order' });
      setPromoSuccess('Free Sparklers Box added to your dispatch!');
    } else {
      setPromoError('Invalid coupon code. Try spinning the Luck Wheel!');
    }
  };

  // Calculate final discount
  let extraDiscount = 0;
  if (appliedPromo?.discountPct) {
    extraDiscount = (totalPrice * (appliedPromo.discountPct / 100));
  } else if (appliedPromo?.discountAmount) {
    extraDiscount = appliedPromo.discountAmount;
  }
  const finalPayable = Math.max(0, totalPrice - extraDiscount);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div 
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} color="var(--violet-light)" />
            </div>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>
                Your Festive Cart
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {cart?.total_items || 0} cracker items added
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Wholesale Savings Banner */}
        {totalSavings > 0 && (
          <div style={{ background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.18), rgba(16, 185, 129, 0.15))', borderBottom: '1px solid var(--border-violet)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
            <Sparkles size={16} color="var(--violet-light)" />
            <span style={{ color: '#D8B4FE', fontWeight: 700 }}>
              You are saving <strong>₹{totalSavings}</strong> with Sivakasi factory rates!
            </span>
          </div>
        )}

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={32} color="var(--text-muted)" />
              </div>
              <h4 style={{ color: '#FFF', marginBottom: 8, fontWeight: 700 }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>
                Explore our 2026 Diwali cracker collection and add your favorite sparklers!
              </p>
              <button onClick={onClose} className="btn-prime">
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 12
                  }}
                >
                  {/* Thumbnail */}
                  <img 
                    src={item.image_url || '/images/cat_giftbox.jpg'} 
                    alt={item.name}
                    style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', background: '#050508' }}
                    onError={(e) => { e.target.src = '/images/cat_giftbox.jpg'; }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {item.category}
                    </div>
                    <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--violet-light)', fontSize: '0.95rem' }}>
                        ₹{item.price * item.quantity}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        (₹{item.price} each)
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      background: 'rgba(5, 5, 8, 0.7)', 
                      border: '1px solid var(--border-subtle)', 
                      borderRadius: 9999, 
                      padding: '2px 4px' 
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ width: 24, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#FB7185', cursor: 'pointer', padding: 6 }}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(8, 7, 14, 0.98)' }}>
            
            {/* Promo Code Input */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Tag size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. DIWALI10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="input-prime"
                    style={{ paddingLeft: 36, height: 38, fontSize: '0.85rem', textTransform: 'uppercase' }}
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="btn-outline-violet"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Apply
                </button>
              </div>
              {promoSuccess && (
                <div style={{ fontSize: '0.8rem', color: '#34D399', marginTop: 6, fontWeight: 600 }}>
                  ✓ {promoSuccess}
                </div>
              )}
              {promoError && (
                <div style={{ fontSize: '0.8rem', color: '#FB7185', marginTop: 6, fontWeight: 600 }}>
                  ✗ {promoError}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({cart?.total_items} items)</span>
                <span>₹{totalPrice}</span>
              </div>

              {extraDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399', fontWeight: 600 }}>
                  <span>Promo Code Discount ({appliedPromo?.code})</span>
                  <span>-₹{extraDiscount.toFixed(0)}</span>
                </div>
              )}

              {appliedPromo?.gift && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--violet-light)', fontWeight: 600 }}>
                  <span>Festive Bonus Gift</span>
                  <span>{appliedPromo.gift}</span>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                  Total Payable:
                </span>
                <span className="font-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--violet-light)' }}>
                  ₹{Math.round(finalPayable)}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => { onClose(); onProceedToCheckout(); }}
              className="btn-prime"
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onClose}
              style={{ width: '100%', marginTop: 10, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'center' }}
            >
              Continue Adding Crackers
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
