import React, { useState } from 'react';
import { X, QrCode, CreditCard, Banknote, ShieldCheck, Copy, Check } from 'lucide-react';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  user, 
  appliedPromo, 
  onOrderPlaced 
}) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'upi' | 'card'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const totalPrice = cart?.total_price || 0;
  let promoDiscount = 0;
  if (appliedPromo?.discountPct) {
    promoDiscount = (totalPrice * (appliedPromo.discountPct / 100));
  } else if (appliedPromo?.discountAmount) {
    promoDiscount = appliedPromo.discountAmount;
  }
  const finalPayable = Math.max(0, Math.round(totalPrice - promoDiscount));

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('rakshcrackers@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp phone number');
      return;
    }
    if (!customerAddress.trim()) {
      setErrorMessage('Please enter your delivery destination address');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        payment_method: paymentMethod,
        discount_percentage: appliedPromo?.discountPct || 0
      };

      await onOrderPlaced(orderPayload);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-prime"
        style={{ maxWidth: 680, padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="badge-violet">SECURE CHECKOUT</span>
            <h3 className="font-heading" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginTop: 4 }}>
              Delivery Details & Order Review
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {errorMessage && (
            <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #F43F5E', borderRadius: 10, color: '#FB7185', fontSize: '0.9rem', marginBottom: 20 }}>
              ⚠ {errorMessage}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-prime"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                WhatsApp Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9842100000"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="input-prime"
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Delivery Address (with Pincode & City) *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Plot No. 42, Gandhi Nagar, 2nd Cross, Madurai - 625020"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="input-prime"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
              Select Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { id: 'cash', label: 'Cash on Delivery', icon: Banknote },
                { id: 'upi', label: 'Instant UPI QR', icon: QrCode },
                { id: 'card', label: 'Card / NetBanking', icon: CreditCard }
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                const IconComp = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      border: isSelected ? '1px solid var(--violet-light)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(168, 85, 247, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 12,
                      padding: '12px 8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <IconComp size={22} color={isSelected ? 'var(--violet-light)' : 'var(--text-muted)'} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#FFF' : 'var(--text-secondary)' }}>
                      {m.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* UPI QR Code Preview if UPI selected */}
            {paymentMethod === 'upi' && (
              <div style={{ marginTop: 16, padding: 16, background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 80, height: 80, background: '#FFF', borderRadius: 8, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 100 100" width="72" height="72">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="25" height="25" fill="black" />
                    <rect x="15" y="15" width="15" height="15" fill="white" />
                    <rect x="18" y="18" width="9" height="9" fill="black" />
                    <rect x="65" y="10" width="25" height="25" fill="black" />
                    <rect x="70" y="15" width="15" height="15" fill="white" />
                    <rect x="73" y="18" width="9" height="9" fill="black" />
                    <rect x="10" y="65" width="25" height="25" fill="black" />
                    <rect x="15" y="70" width="15" height="15" fill="white" />
                    <rect x="18" y="73" width="9" height="9" fill="black" />
                    <rect x="42" y="15" width="8" height="15" fill="black" />
                    <rect x="42" y="42" width="16" height="16" fill="black" />
                    <rect x="65" y="45" width="20" height="8" fill="black" />
                    <rect x="45" y="70" width="10" height="20" fill="black" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--violet-light)', fontSize: '0.9rem' }}>
                    Scan with GPay / PhonePe / Paytm
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    UPI ID: <strong style={{ color: '#FFF' }}>rakshcrackers@icici</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--violet-light)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedUpi ? 'Copied UPI ID!' : 'Copy UPI ID'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Box */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              <span>Order Subtotal ({cart?.total_items} items)</span>
              <span>₹{totalPrice}</span>
            </div>

            {promoDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#34D399', fontWeight: 600, marginBottom: 6 }}>
                <span>Coupon Discount ({appliedPromo?.code})</span>
                <span>-₹{promoDiscount.toFixed(0)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              <span>Sivakasi Transport Freight</span>
              <span style={{ color: '#34D399', fontWeight: 600 }}>FREE TO DESTINATION</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>Grand Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--violet-light)' }}>₹{finalPayable}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-prime"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
          >
            {isSubmitting ? (
              <span>Placing Order with Sivakasi Factory...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Confirm & Place Order (₹{finalPayable})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
