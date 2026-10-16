import React, { useState } from 'react';
import { ShoppingCart, Eye, Plus, Minus, Check, Flame } from 'lucide-react';

const CATEGORY_FALLBACK_IMAGES = {
  'Sparklers': '/images/cat_sparklers.jpg',
  'Ground Chakkars': '/images/cat_crackers.jpg',
  'Flower Pots': '/images/cat_flowerpots.jpg',
  'Rockets': '/images/cat_rockets.jpg',
  'Sky Shots': '/images/hero_2.jpg',
  'Sound Crackers': '/images/cat_crackers.jpg',
  'Gift Boxes': '/images/cat_giftbox.jpg'
};

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const fallbackImg = CATEGORY_FALLBACK_IMAGES[product.category] || '/images/cat_crackers.jpg';
  const displayImage = product.image_url || fallbackImg;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 15;

  const handleAdd = async (e) => {
    e.stopPropagation();
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
    <div 
      className="glass-card" 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        cursor: 'pointer' 
      }}
      onClick={() => onQuickView(product)}
    >
      {/* Top Image Container */}
      <div className="card-img-container">
        <img 
          src={displayImage} 
          alt={product.name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.5s ease',
            filter: isOutOfStock ? 'grayscale(100%) opacity(40%)' : 'none'
          }}
          className="product-img-zoom"
          onError={(e) => { e.target.src = '/images/cat_giftbox.jpg'; }}
        />

        {/* Dark blend overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5,5,8,0.2) 0%, rgba(5,5,8,0) 50%, rgba(12,10,20,0.75) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'var(--fire-gradient)',
            color: '#FFF',
            padding: '3px 9px',
            borderRadius: 9999,
            fontSize: '0.72rem',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 3
          }}>
            -{product.discount_percentage}% OFF
          </div>
        )}

        {/* Stock Badge */}
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          {isOutOfStock ? (
            <span style={{ background: 'rgba(244, 63, 94, 0.9)', color: '#FFF', padding: '3px 8px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700 }}>
              Sold Out
            </span>
          ) : isLowStock ? (
            <span style={{ background: 'rgba(168, 85, 247, 0.9)', color: '#FFF', padding: '3px 8px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700 }}>
              Only {product.stock_quantity} left
            </span>
          ) : (
            <span style={{ background: 'rgba(16, 185, 129, 0.85)', color: '#FFF', padding: '3px 8px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700 }}>
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Button Hover Overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            background: 'rgba(5, 5, 8, 0.85)',
            backdropFilter: 'blur(6px)',
            border: '1px solid var(--border-violet)',
            color: 'var(--violet-light)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Quick View Cracker Details"
        >
          <Eye size={18} />
        </button>
      </div>

      {/* Content Body */}
      <div className="card-content-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {product.code && (
              <span style={{ 
                padding: '2px 6px', 
                borderRadius: 4, 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                fontFamily: 'monospace',
                background: 'rgba(168, 85, 247, 0.2)', 
                color: 'var(--violet-bright)',
                border: '1px solid var(--border-violet)'
              }}>
                #{product.code}
              </span>
            )}
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              {product.category}
            </span>
          </div>
          <span className="d-none-sm" style={{ fontSize: '0.72rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
            <Flame size={12} /> Genuine Sivakasi
          </span>
        </div>

        <h3 
          className="font-heading card-title-text" 
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Pricing Matrix */}
        <div style={{ marginTop: 'auto', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--violet-light)', fontFamily: 'var(--font-heading)' }}>
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.mrp}
              </span>
            )}
          </div>
          {product.savings > 0 && (
            <div className="d-none-sm" style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 600, marginTop: 2 }}>
              Save ₹{product.savings} factory wholesale discount
            </div>
          )}
        </div>

        {/* Actions Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={(e) => e.stopPropagation()}>
          {/* Quantity Stepper */}
          <div className="card-stepper-wrap" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 9999, 
            padding: '2px 4px' 
          }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock || quantity <= 1}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', display: 'flex' }}
            >
              <Minus size={14} />
            </button>
            <span style={{ width: 28, textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isOutOfStock || quantity >= product.stock_quantity}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', display: 'flex' }}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock || isAdding}
            className="btn-prime card-add-btn"
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              fontSize: '0.82rem',
              background: isOutOfStock 
                ? 'rgba(255, 255, 255, 0.08)' 
                : justAdded 
                  ? 'linear-gradient(135deg, #10B981, #059669)' 
                  : 'var(--violet-gradient)',
              color: isOutOfStock ? 'var(--text-muted)' : '#FFFFFF',
              boxShadow: isOutOfStock ? 'none' : undefined,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {justAdded ? (
              <>
                <Check size={16} />
                <span>Added!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={15} />
                <span>Add ({quantity})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
