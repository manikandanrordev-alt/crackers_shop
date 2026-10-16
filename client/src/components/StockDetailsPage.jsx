import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  ShoppingCart, 
  Check, 
  ArrowLeft,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';

export default function StockDetailsPage({ 
  products = [], 
  categories = [], 
  onAddToCart, 
  onBackToShop,
  shopConfig = {} 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState({});
  const [addedId, setAddedId] = useState(null);

  const productList = Array.isArray(products) ? products : [];
  const categoryList = ['All', ...new Set([
    ...(Array.isArray(categories) ? categories : []),
    ...productList.map((p) => p.category)
  ].filter(Boolean))];

  const filteredProducts = productList.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !search || 
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) || 
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleQtyChange = (id, delta, maxStock) => {
    const current = quantities[id] || 1;
    const next = Math.max(1, Math.min(maxStock, current + delta));
    setQuantities({ ...quantities, [id]: next });
  };

  const handleAdd = (id, stock) => {
    const qty = quantities[id] || 1;
    onAddToCart(id, qty);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const totalInStockItems = productList.filter((p) => (p.stock_quantity || 0) > 0).length;
  const totalUnitsAvailable = productList.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <button
            onClick={onBackToShop}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--violet-bright)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              marginBottom: 8,
              padding: 0
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Storefront</span>
          </button>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#FFF', margin: 0 }}>
            Live Factory Stock & Inventory Status
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Direct real-time stock levels from Sivakasi manufacturing godown
          </p>
        </div>

        {/* Inventory Summary Chips */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10 }}>
            <div style={{ fontSize: '0.72rem', color: '#6EE7B7' }}>Active Products</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>{totalInStockItems} in stock</div>
          </div>
          <div style={{ padding: '8px 16px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid var(--border-violet)', borderRadius: 10 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--violet-light)' }}>Total Units Ready</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFF' }}>{totalUnitsAvailable} cartons</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: 14, 
        padding: '14px 18px', 
        background: 'rgba(255, 255, 255, 0.02)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 12, 
        marginBottom: 20 
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', maxWidth: '100%', paddingBottom: 4 }}>
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 9999,
                fontSize: '0.82rem',
                border: selectedCategory === cat ? '1px solid var(--violet-bright)' : '1px solid var(--border-subtle)',
                background: selectedCategory === cat ? 'var(--violet-gradient)' : 'rgba(255,255,255,0.03)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search stock by cracker name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-prime"
            style={{ paddingLeft: 36, height: 38, fontSize: '0.85rem', borderRadius: 8 }}
          />
        </div>
      </div>

      {/* Stock Inventory Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ 
                background: 'rgba(12, 10, 20, 0.95)', 
                borderBottom: '1px solid var(--border-violet)', 
                textAlign: 'left', 
                color: 'var(--text-secondary)' 
              }}>
                <th style={{ padding: '14px 16px', width: 60 }}>#</th>
                <th style={{ padding: '14px 16px' }}>Item Name</th>
                <th style={{ padding: '14px 16px' }}>Category</th>
                <th style={{ padding: '14px 16px' }}>Unit Rate</th>
                <th style={{ padding: '14px 16px' }}>Available Stock</th>
                <th style={{ padding: '14px 16px' }}>Inventory Health</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Add Units to Cart</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => {
                  const stock = p.stock_quantity || 0;
                  const currentQty = quantities[p.id] || 1;

                  let statusBadge = (
                    <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      In Stock
                    </span>
                  );

                  if (stock <= 0) {
                    statusBadge = (
                      <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                        Out of Stock
                      </span>
                    );
                  } else if (stock <= 15) {
                    statusBadge = (
                      <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(244, 63, 94, 0.15)', color: '#FB7185', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                        Low Stock ({stock} left)
                      </span>
                    );
                  }

                  return (
                    <tr 
                      key={p.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border-subtle)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)'
                      }}
                    >
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#FFF' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{p.id}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge-violet" style={{ fontSize: '0.75rem' }}>{p.category}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--violet-bright)' }}>
                        ₹{p.price}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: stock > 0 ? '#FFF' : '#F87171', fontSize: '0.92rem' }}>
                          {stock} cartons
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {statusBadge}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {stock > 0 ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: 2 }}>
                              <button
                                onClick={() => handleQtyChange(p.id, -1, stock)}
                                style={{ width: 26, height: 26, background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '0.9rem' }}
                              >
                                -
                              </button>
                              <span style={{ width: 28, textAlign: 'center', fontSize: '0.82rem', fontWeight: 700, color: '#FFF' }}>
                                {currentQty}
                              </span>
                              <button
                                onClick={() => handleQtyChange(p.id, 1, stock)}
                                style={{ width: 26, height: 26, background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '0.9rem' }}
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => handleAdd(p.id, stock)}
                              className="btn-prime"
                              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            >
                              {addedId === p.id ? (
                                <>
                                  <Check size={14} /> Added
                                </>
                              ) : (
                                <>
                                  <ShoppingCart size={14} /> Add
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Unavailable</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
