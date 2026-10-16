import React, { useState, useEffect } from 'react';
import { Award, Clock, ArrowRight, Zap, FileSpreadsheet, Truck, Sparkles } from 'lucide-react';

export default function HeroBanner({ shopConfig, onExplore, onOpenPriceList, onOpenTracking }) {
  // Diwali 2026 Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 24);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const discountPct = shopConfig?.default_discount_percentage || 70;
  const shopName = shopConfig?.shop_name || 'Raksh Crackers';

  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '36px 20px 28px' }}>
      {/* Decorative Glow Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(126, 34, 206, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          
          {/* Left Column: Headlines & CTA */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 9999, marginBottom: 14 }}>
              <Sparkles size={13} color="var(--violet-light)" className="sparkle-pulse" />
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--violet-light)', letterSpacing: '0.04em' }}>
                Direct Sivakasi Factory Wholesale • 2026 Season
              </span>
            </div>

            <h1 className="font-display" style={{ fontSize: 'clamp(1.25rem, 1.8vw, 1.6rem)', fontWeight: 700, lineHeight: 1.3, marginBottom: 12, color: '#FFFFFF' }}>
              Direct From Sivakasi: <span className="violet-gradient-text">Genuine Green Crackers</span> At Factory Wholesale Rates
            </h1>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 22, maxWidth: 520 }}>
              Shop authentic Sivakasi fireworks direct from the factory floor at flat <strong style={{ color: 'var(--violet-light)' }}>{discountPct}% wholesale discount</strong>. Certified Green Crackers delivered via transport with real-time LR tracking.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
              <button 
                onClick={onExplore}
                className="btn-prime"
                style={{ padding: '10px 22px', fontSize: '0.88rem' }}
              >
                <span>Shop Catalog</span>
                <ArrowRight size={15} />
              </button>

              <button 
                onClick={onOpenTracking}
                className="btn-outline-violet"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <Truck size={15} />
                <span>Track Parcel LR</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--violet-light)', fontFamily: 'var(--font-heading)' }}>
                  Flat {discountPct}% Off
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Direct Factory Wholesale</div>
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34D399', fontFamily: 'var(--font-heading)' }}>
                  100% Safe
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>CSIR-NEERI Certified Green</div>
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>
                  Pan-India LR
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Live Transport Tracking</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Countdown & Hero Card */}
          <div>
            <div className="glass-panel" style={{ padding: 26, border: '1px solid var(--border-violet)', background: 'linear-gradient(180deg, rgba(19, 16, 34, 0.9) 0%, rgba(12, 10, 20, 0.98) 100%)', boxShadow: '0 20px 45px rgba(0,0,0,0.65), 0 0 25px rgba(168, 85, 247, 0.15)' }}>
              
              {/* Card Header with Countdown */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span className="badge-violet" style={{ marginBottom: 8, fontSize: '0.72rem' }}>
                  <Clock size={13} /> Diwali Booking Window
                </span>
                <h3 className="font-heading" style={{ fontSize: '1.2rem', color: '#FFF', fontWeight: 700 }}>
                  Pre-Diwali Factory Booking Open
                </h3>
              </div>

              {/* Countdown Numbers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center', marginBottom: 22 }}>
                {[
                  { val: timeLeft.days, unit: 'Days' },
                  { val: timeLeft.hours, unit: 'Hours' },
                  { val: timeLeft.minutes, unit: 'Mins' },
                  { val: timeLeft.seconds, unit: 'Secs' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(5, 5, 8, 0.85)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 10, padding: '10px 4px' }}>
                    <div className="font-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--violet-light)', lineHeight: 1 }}>
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>
                      {item.unit}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sivakasi Wholesale Stamp Banner */}
              <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px dashed rgba(168, 85, 247, 0.35)', borderRadius: 12, padding: '14px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--violet-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Award size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--violet-light)', fontSize: '0.88rem' }}>
                    Authentic Sivakasi Guarantee
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    Directly packed at certified Sivakasi factories. Fresh batch manufacturing for 2026.
                  </div>
                </div>
              </div>

              {/* Express Booking Callout */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 8, fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#34D399' }}>
                  <Zap size={15} />
                  <span>Daily Dispatch via VRL, ARC & Kranti</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>LR SMS on Booking</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
