import React, { useState } from 'react';
import { X, ShoppingCart, ShieldCheck, Plus, Minus, Check, Award } from 'lucide-react';

const CATEGORY_FALLBACK_IMAGES = {
  'Sparklers': '/images/cat_sparklers.jpg',
  'Ground Chakkars': '/images/cat_crackers.jpg',
  'Flower Pots': '/images/cat_flowerpots.jpg',
  'Rockets': '/images/cat_rockets.jpg',
  'Sky Shots': '/images/hero_2.jpg',
  'Sound Crackers': '/images/cat_crackers.jpg',
  'Gift Boxes': '/images/cat_giftbox.jpg'
};

export default function ProductQuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fallbackImg = CATEGORY_FALLBACK_IMAGES[product.category] || '/images/cat_crackers.jpg';
  const displayImage = product.image_url || fallbackImg;
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAdd = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    try {
      await onAddToCart(product.id, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-prime"
        style={{ maxWidth: 720, padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(5, 5, 8, 0.85)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {/* Visual Side */}
          <div style={{ background: '#050508', position: 'relative', minHeight: 300 }}>
            <img 
              src={displayImage} 
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = '/images/cat_giftbox.jpg'; }}
            />
            {product.discount_percentage > 0 && (
              <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                background: 'var(--fire-gradient)',
                color: '#FFF',
                padding: '6px 14px',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: '0.85rem'
              }}>
                -{product.discount_percentage}% WHOLESALE OFF
              </div>
            )}
          </div>

          {/* Details Side */}
          <div style={{ padding: '30px 24px', display: 'flex', flexDirection: 'column' }}>
            <span className="badge-violet" style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
              {product.category}
            </span>

            <h2 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: 12, lineHeight: 1.25 }}>
              {product.name}
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              {product.description || 'Authentic Sivakasi direct manufactured premium firework with guaranteed safety certification, sparkling effects, and superior burst brilliance.'}
            </p>

            {/* Pricing Box */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--violet-light)', fontFamily: 'var(--font-heading)' }}>
                  ₹{product.price}
                </span>
                {product.mrp > product.price && (
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    MRP: ₹{product.mrp}
                  </span>
                )}
              </div>
              {product.savings > 0 && (
                <div style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 700, marginTop: 4 }}>
                  You Save: ₹{product.savings} (Direct Factory Price)
                </div>
              )}
            </div>

            {/* Safety Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>100% Green Certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Award size={16} color="var(--violet-primary)" />
                <span>Standard Sivakasi Brand</span>
              </div>
            </div>

            {/* Actions Area */}
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: 9999, 
                padding: '4px 8px' 
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock || quantity <= 1}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ width: 36, textAlign: 'center', fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock || quantity >= product.stock_quantity}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={isOutOfStock || isAdding}
                className="btn-prime"
                style={{ flex: 1, padding: '12px 20px', fontSize: '0.95rem' }}
              >
                {justAdded ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Cart (₹{product.price * quantity})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
