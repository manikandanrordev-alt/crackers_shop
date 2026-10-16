import React, { useState, useEffect } from 'react';
import { X, Package, Truck, Calendar, ShoppingBag, Eye, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function CustomerOrdersModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetail = async (orderId) => {
    try {
      const res = await api.getOrder(orderId);
      setSelectedOrder(res.order);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-prime"
        style={{ maxWidth: 720, padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} color="var(--violet-bright)" />
            </div>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                My Orders & LR Tracking
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Track your Sivakasi parcel delivery
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={fetchOrders}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}
              title="Refresh Orders"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6 }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              Loading your festive orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ color: '#FFF', fontWeight: 700 }}>No orders placed yet</h4>
              <p style={{ fontSize: '0.9rem', marginTop: 4 }}>
                Add items to cart and checkout to light up your Diwali!
              </p>
            </div>
          ) : selectedOrder ? (
            /* Order Detail View */
            <div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', color: 'var(--violet-bright)', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 16 }}
              >
                ← Back to all orders
              </button>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-violet)', borderRadius: 12, padding: '18px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <span className="badge-violet">ORDER #{selectedOrder.id}</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Placed on {selectedOrder.created_at}
                    </div>
                  </div>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: 9999, 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    background: selectedOrder.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                    color: selectedOrder.status === 'completed' ? '#34D399' : 'var(--violet-light)',
                    border: '1px solid currentColor'
                  }}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>

                {/* LR Number Tracking */}
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Truck size={20} color="var(--violet-light)" />
                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--violet-bright)', fontWeight: 700 }}>Transport LR Number: </span>
                    <span style={{ color: '#FFF', fontWeight: 800 }}>
                      {selectedOrder.lr_number ? selectedOrder.lr_number : 'Booking in progress at Sivakasi parcel office'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <h5 style={{ color: '#FFF', fontSize: '0.9rem', marginBottom: 10 }}>Order Items</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {item.product_name} <strong style={{ color: '#FFF' }}>× {item.quantity}</strong>
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--violet-bright)' }}>
                        ₹{item.subtotal || item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, color: '#FFF' }}>Total Paid</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--violet-bright)' }}>
                    ₹{selectedOrder.total_amount}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Orders List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map((ord) => (
                <div 
                  key={ord.id}
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, color: '#FFF', fontSize: '1rem' }}>
                        #{ord.id}
                      </span>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: 9999, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        background: ord.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                        color: ord.status === 'completed' ? '#34D399' : 'var(--violet-light)'
                      }}>
                        {ord.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {ord.created_at} • {ord.items_count} items
                    </div>
                    {ord.lr_number && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--violet-bright)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Truck size={14} /> LR No: {ord.lr_number}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--violet-bright)', marginBottom: 6 }}>
                      ₹{ord.total_amount}
                    </div>
                    <button
                      onClick={() => handleViewDetail(ord.id)}
                      className="btn-outline-violet"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      <Eye size={14} />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
