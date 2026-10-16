import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Search, 
  ShoppingCart, 
  Check, 
  Download, 
  ArrowLeft,
  Sparkles,
  Tag
} from 'lucide-react';

export default function PriceListPage({ 
  products = [], 
  categories = [], 
  onAddToCart, 
  onBackToShop,
  shopConfig = {} 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState(null);

  const discountPct = shopConfig?.default_discount_percentage || 70;
  const productList = Array.isArray(products) ? products : [];
  const categoryList = ['All', ...new Set([
    ...(Array.isArray(categories) ? categories : []),
    ...productList.map((p) => p.category)
  ].filter(Boolean))];

  // Filter products
  const filteredProducts = productList.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !search || 
      (p.name && p.name.toLowerCase().includes(search.toLowerCase())) || 
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = ['ID', 'Item Name', 'Category', 'Retail MRP (INR)', 'Wholesale Price (INR)', 'Discount %', 'Stock Status'];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.category || 'Crackers').replace(/"/g, '""')}"`,
      p.mrp || 0,
      p.price || 0,
      p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : discountPct,
      p.stock_quantity > 0 ? `${p.stock_quantity} Boxes Available` : 'Out of Stock'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const brandSlug = (shopConfig?.shop_name || 'Sivakasi_Wholesale').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `${brandSlug}_Wholesale_Pricelist_2026_${selectedCategory.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export / Print PDF function
  const handleDownloadPDF = () => {
    if (shopConfig?.pricelist_pdf_url) {
      window.open(shopConfig.pricelist_pdf_url, '_blank');
    } else {
      window.print();
    }
  };

  const handleAdd = (id) => {
    onAddToCart(id, 1);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Top Header & Breadcrumb */}
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
            2026 Diwali Wholesale Price List
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Direct factory prices with {discountPct}% wholesale discount from Sivakasi, Tamil Nadu
          </p>
        </div>

        {/* Download & Export Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <button
            onClick={handleExportCSV}
            className="btn-secondary-dark"
            style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'var(--border-violet)' }}
            title="Download Spreadsheet for Excel / Google Sheets"
          >
            <FileSpreadsheet size={16} color="#34D399" />
            <span>Download Excel / CSV</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="btn-prime"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            title="Download or Print PDF Catalog"
          >
            <FileText size={16} />
            <span>Download Official PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn-secondary-dark"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Print Price List"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
        {/* Category Filter Pills */}
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
            placeholder="Search price list..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-prime"
            style={{ paddingLeft: 36, height: 38, fontSize: '0.85rem', borderRadius: 8 }}
          />
        </div>
      </div>

      {/* Price List Table */}
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
                <th style={{ padding: '14px 16px' }}>Cracker Item Name</th>
                <th style={{ padding: '14px 16px' }}>Category</th>
                <th style={{ padding: '14px 16px' }}>Retail MRP</th>
                <th style={{ padding: '14px 16px' }}>Wholesale Price ({discountPct}% Off)</th>
                <th style={{ padding: '14px 16px' }}>Your Savings</th>
                <th style={{ padding: '14px 16px' }}>Stock</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No cracker products match your search in this category.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => (
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
                      <div style={{ fontSize: '0.75rem', color: '#10B981' }}>Standard Sivakasi PESO Certified</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge-violet" style={{ fontSize: '0.75rem' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{p.mrp}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--violet-bright)', fontSize: '0.98rem' }}>
                      ₹{p.price}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge-rose" style={{ fontSize: '0.75rem' }}>
                        Save ₹{Math.round((p.mrp || 0) - (p.price || 0))}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        color: p.stock_quantity > 0 ? '#34D399' : '#F87171', 
                        fontWeight: 600,
                        fontSize: '0.82rem' 
                      }}>
                        {p.stock_quantity > 0 ? `${p.stock_quantity} in stock` : 'Sold Out'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleAdd(p.id)}
                        disabled={p.stock_quantity <= 0}
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
