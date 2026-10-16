import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  Phone, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function OrderTrackingModal({ isOpen, onClose, initialQuery = '' }) {
  if (!isOpen) return null;

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTrack = async (searchVal = query) => {
    const q = (searchVal || '').trim();
    if (!q) {
      setError('Please enter your Sivakasi Transport LR number or 10-digit phone number.');
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);
    setSelectedOrder(null);

    try {
      const data = await api.trackOrder(q);
      if (data?.found && data.orders?.length > 0) {
        setResults(data.orders);
        setSelectedOrder(data.orders[0]); // Select latest by default
      } else {
        setError(data?.message || `No orders or parcels found matching "${q}". Please check your LR number or mobile number.`);
      }
    } catch (err) {
      setError(err.message || 'Tracking lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-prime"
        style={{ maxWidth: 780, padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border-violet)', 
          background: 'rgba(12, 10, 20, 0.98)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 38, 
              height: 38, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
            }}>
              <Truck size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFF', margin: 0 }}>
                Live Parcel & Order Tracking
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Track your Sivakasi parcel by LR number or phone number
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              padding: 6 
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar Input */}
        <div style={{ padding: '20px 24px 16px', background: 'rgba(19, 16, 34, 0.6)', borderBottom: '1px solid var(--border-subtle)' }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
            style={{ display: 'flex', gap: 10 }}
          >
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter LR Number (e.g. ST-89241) or Mobile Number..."
                className="input-prime"
                style={{ paddingLeft: 42, height: 44, fontSize: '0.9rem' }}
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-prime"
              style={{ padding: '0 24px', height: 44, fontSize: '0.9rem' }}
            >
              {loading ? 'Searching...' : 'Track Parcel'}
            </button>
          </form>

          {/* Quick Samples / Hints */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Quick search:</span>
            <button
              type="button"
              onClick={() => { setQuery('1'); handleTrack('1'); }}
              style={{ background: 'none', border: '1px dashed var(--border-violet)', color: 'var(--violet-bright)', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Demo Order #1
            </button>
            <button
              type="button"
              onClick={() => { setQuery('9842154321'); handleTrack('9842154321'); }}
              style={{ background: 'none', border: '1px dashed var(--border-violet)', color: 'var(--violet-bright)', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Customer Phone
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px', maxHeight: '68vh', overflowY: 'auto' }}>
          {error && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              padding: '14px 18px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              borderRadius: 10, 
              color: '#FCA5A5', 
              fontSize: '0.88rem' 
            }}>
              <AlertCircle size={20} color="#F87171" style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          {/* Multi-Order Tabs if query returned multiple */}
          {results && results.length > 1 && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 6 }}>
              {results.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid',
                    borderColor: selectedOrder?.id === ord.id ? 'var(--violet-primary)' : 'var(--border-subtle)',
                    background: selectedOrder?.id === ord.id ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255,255,255,0.02)',
                    color: selectedOrder?.id === ord.id ? '#FFF' : 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: selectedOrder?.id === ord.id ? 700 : 500
                  }}
                >
                  Order #{ord.id} {ord.lr_number ? `(LR: ${ord.lr_number})` : ''} • ₹{ord.total_amount}
                </button>
              ))}
            </div>
          )}

          {/* Active Order Tracking Display */}
          {selectedOrder && (
            <div>
              {/* Top Status Hero Card */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(12, 10, 20, 0.95) 100%)', 
                border: '1px solid var(--border-violet)', 
                borderRadius: 14, 
                padding: '20px', 
                marginBottom: 24 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>
                        Order #{selectedOrder.id}
                      </span>
                      <span className="badge-violet">
                        {selectedOrder.status === 'completed' ? 'Delivered' : 'In Transit'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Booked on {selectedOrder.created_at} • {selectedOrder.items?.length || 0} cracker items
                    </div>
                  </div>

                  {/* LR Badge or Alert */}
                  {selectedOrder.has_lr ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      padding: '6px 14px', 
                      background: 'rgba(56, 189, 248, 0.15)', 
                      border: '1px solid rgba(56, 189, 248, 0.4)', 
                      borderRadius: 8,
                      color: '#7DD3FC' 
                    }}>
                      <Truck size={18} />
                      <div>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#BAE6FD' }}>Transport LR Number</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>{selectedOrder.lr_number}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '6px 12px', 
                      background: 'rgba(255, 255, 255, 0.04)', 
                      border: '1px solid var(--border-subtle)', 
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}>
                      Transport LR generating at Sivakasi office
                    </div>
                  )}
                </div>

                {/* Live Status Message Banner */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10, 
                  padding: '12px 14px', 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: 10,
                  borderLeft: '3px solid var(--violet-primary)'
                }}>
                  <ShieldCheck size={20} color="var(--violet-bright)" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.88rem', color: '#FFF' }}>
                    <strong style={{ color: 'var(--violet-bright)' }}>Current Status: </strong>
                    {selectedOrder.live_status}
                  </div>
                </div>
              </div>

              {/* 5-Stage Live Timeline */}
              <div style={{ marginBottom: 28 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFF', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} color="var(--violet-light)" />
                  <span>Sivakasi Transport Dispatch Journey</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
                  {selectedOrder.tracking_stages?.map((stage, idx) => {
                    const isLast = idx === selectedOrder.tracking_stages.length - 1;
                    return (
                      <div key={idx} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                        {/* Vertical Connector Line */}
                        {!isLast && (
                          <div style={{
                            position: 'absolute',
                            left: 14,
                            top: 26,
                            bottom: -10,
                            width: 2,
                            background: stage.completed ? 'var(--violet-primary)' : 'rgba(255, 255, 255, 0.1)'
                          }} />
                        )}

                        {/* Node Circle */}
                        <div style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: stage.completed 
                            ? 'var(--violet-gradient)' 
                            : (stage.current ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)'),
                          border: stage.current 
                            ? '2px solid var(--violet-bright)' 
                            : (stage.completed ? 'none' : '1px solid var(--border-subtle)'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          zIndex: 2
                        }}>
                          {stage.completed ? (
                            <CheckCircle2 size={16} color="#FFF" />
                          ) : (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: stage.current ? 'var(--violet-bright)' : 'var(--text-muted)' }}>
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ paddingBottom: 22, flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ 
                              fontWeight: 600, 
                              fontSize: '0.9rem', 
                              color: stage.completed || stage.current ? '#FFF' : 'var(--text-muted)' 
                            }}>
                              {stage.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: stage.completed ? 'var(--violet-bright)' : 'var(--text-muted)' }}>
                              {stage.date}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                            {stage.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info & Destination Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Delivery Destination</div>
                  <div style={{ fontWeight: 600, color: '#FFF', fontSize: '0.88rem' }}>{selectedOrder.customer_name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {selectedOrder.customer_address}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--violet-bright)', marginTop: 4 }}>
                    Contact: {selectedOrder.customer_phone}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Payment & Consignment</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Payment Mode:</span>
                    <strong style={{ color: '#FFF', textTransform: 'capitalize' }}>{selectedOrder.payment_method}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Amount:</span>
                    <strong style={{ color: 'var(--violet-bright)', fontSize: '1rem' }}>₹{selectedOrder.total_amount}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Transport LR:</span>
                    <strong style={{ color: selectedOrder.lr_number ? '#38BDF8' : 'var(--text-muted)' }}>
                      {selectedOrder.lr_number || 'Under Booking'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 600, marginBottom: 10 }}>
                    Consignment Cracker Items ({selectedOrder.items.length})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {it.product_name} <strong style={{ color: '#FFF' }}>× {it.quantity}</strong>
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--violet-bright)' }}>
                          ₹{it.subtotal || it.price * it.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Empty Initial Search State */}
          {!loading && !results && !error && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Truck size={44} color="var(--violet-light)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 600, marginBottom: 6 }}>
                Track Your Sivakasi Fireworks Consignment
              </h4>
              <p style={{ fontSize: '0.85rem', maxWidth: 460, margin: '0 auto' }}>
                Enter the Transport LR number sent to your mobile via SMS, or enter your 10-digit customer mobile number to view live transit stages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
