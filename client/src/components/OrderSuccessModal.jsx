import React from 'react';
import { CheckCircle2, Printer, Sparkles, Truck, ArrowRight, Package } from 'lucide-react';

export default function OrderSuccessModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-prime"
        style={{ maxWidth: 650, padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Header */}
        <div style={{ 
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, rgba(12, 10, 20, 0.98) 100%)', 
          padding: '36px 24px 24px', 
          textAlign: 'center',
          borderBottom: '1px solid var(--border-violet)'
        }}>
          <div style={{ 
            width: 70, 
            height: 70, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #10B981, #059669)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)'
          }}>
            <CheckCircle2 size={40} color="#FFF" />
          </div>

          <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', marginBottom: 6 }}>
            Order Placed Successfully!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Thank you for celebrating Diwali with Raksh Crackers!
          </p>

          <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(168, 85, 247, 0.15)', border: '1px solid var(--border-violet)', padding: '6px 16px', borderRadius: 9999 }}>
            <span style={{ color: 'var(--violet-bright)', fontWeight: 700, fontSize: '0.9rem' }}>
              Order ID: #{order.id}
            </span>
          </div>
        </div>

        {/* Invoice Summary Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Dispatch Notice */}
          <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <Truck size={24} color="var(--violet-light)" />
            <div style={{ fontSize: '0.85rem' }}>
              <strong style={{ color: 'var(--violet-bright)' }}>Sivakasi Transport Dispatch:</strong>
              <div style={{ color: 'var(--text-secondary)' }}>
                Your parcel will be packed and booked via Sivakasi Transport. Transport LR copy will be SMSed to <span style={{ color: '#FFF' }}>{order.customer_phone}</span>.
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, fontSize: '0.85rem', marginBottom: 16 }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                <div style={{ color: '#FFF', fontWeight: 600 }}>{order.customer_name}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>WhatsApp Number:</span>
                <div style={{ color: '#FFF', fontWeight: 600 }}>{order.customer_phone}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                <div style={{ color: 'var(--violet-bright)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {order.payment_method}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <div style={{ color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>
                  {order.status || 'Pending Dispatch'}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Delivery Address:</span>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>
                {order.customer_address}
              </div>
            </div>
          </div>

          {/* Items Summary */}
          {order.items && order.items.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 700, marginBottom: 10 }}>
                Ordered Crackers ({order.items.length} items)
              </h4>
              <div style={{ maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.product_name} <strong style={{ color: '#FFF' }}>× {item.quantity}</strong>
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--violet-bright)' }}>
                      ₹{item.subtotal || item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Paid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 18px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--border-violet)', borderRadius: 12, marginBottom: 24 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF' }}>Grand Total</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--violet-bright)' }}>
              ₹{order.total_amount}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handlePrint}
              className="btn-secondary-dark"
              style={{ flex: 1, padding: '12px' }}
            >
              <Printer size={18} />
              <span>Print Invoice Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="btn-prime"
              style={{ flex: 1, padding: '12px' }}
            >
              <span>Back to Shop</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
