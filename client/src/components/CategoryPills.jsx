import React from 'react';
import { Sparkles, Flame, Zap, Package, Compass, Disc3, ShieldAlert } from 'lucide-react';

const CATEGORY_META = {
  'Sparklers': { icon: Sparkles, color: '#C084FC', subtitle: 'Electric & Crackling' },
  'Ground Chakkars': { icon: Disc3, color: '#F472B6', subtitle: 'Deluxe Spinning' },
  'Flower Pots': { icon: Flame, color: '#A855F7', subtitle: 'Jumbo Fountains' },
  'Rockets': { icon: Zap, color: '#38BDF8', subtitle: 'Aerial Missiles' },
  'Sky Shots': { icon: Sparkles, color: '#E879F9', subtitle: 'Multi-Color Cakes' },
  'Sound Crackers': { icon: ShieldAlert, color: '#FB7185', subtitle: 'Red Garlands & Bombs' },
  'Gift Boxes': { icon: Package, color: '#34D399', subtitle: 'Family Hampers' }
};

export default function CategoryPills({ categories, activeCategory, onSelectCategory }) {
  const allCategories = ['All', ...(categories || [])];

  return (
    <div style={{ margin: '30px 0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <span className="badge-violet">COLLECTIONS</span>
          <h2 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', marginTop: 4 }}>
            Browse By Fireworks Category
          </h2>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 12, 
        overflowX: 'auto', 
        paddingBottom: 12,
        scrollbarWidth: 'thin'
      }}>
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const meta = CATEGORY_META[cat];
          const IconComponent = meta?.icon || Compass;

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 20px',
                borderRadius: 9999,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: isActive 
                  ? 'var(--violet-gradient)' 
                  : 'rgba(19, 16, 34, 0.75)',
                color: isActive ? '#FFFFFF' : '#E2E8F0',
                border: isActive 
                  ? '1px solid #D8B4FE' 
                  : '1px solid var(--border-subtle)',
                fontWeight: isActive ? 800 : 600,
                boxShadow: isActive ? '0 4px 20px rgba(168, 85, 247, 0.45)' : 'none',
                transform: isActive ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: isActive ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent size={15} color={isActive ? '#FFFFFF' : (meta?.color || 'var(--violet-primary)')} />
              </div>
              <span style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
