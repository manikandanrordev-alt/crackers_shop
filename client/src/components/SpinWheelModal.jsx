import React, { useState } from 'react';
import { X, Sparkles, Gift, Copy, Check, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const SEGMENTS = [
  { label: '10% OFF', code: 'DIWALI10', color: '#A855F7', text: '#FFFFFF' },
  { label: '₹100 CASH', code: 'CASH100', color: '#F43F5E', text: '#FFFFFF' },
  { label: 'FREE SPARKLER', code: 'FREESPARK', color: '#10B981', text: '#FFFFFF' },
  { label: '15% VIP', code: 'VIP15', color: '#C084FC', text: '#050508' },
  { label: '+50 POINTS', code: 'POINTS50', color: '#38BDF8', text: '#050508' },
  { label: '5% BONUS', code: 'BOOM5', color: '#7E22CE', text: '#FFFFFF' }
];

export default function SpinWheelModal({ isOpen, onClose, onApplyPrize }) {
  if (!isOpen) return null;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    try {
      // Call API
      const res = await api.spinWheel().catch(() => ({
        prize: SEGMENTS[Math.floor(Math.random() * SEGMENTS.length)]
      }));

      const prizeIndex = Math.floor(Math.random() * SEGMENTS.length);
      const selectedPrize = res.prize || SEGMENTS[prizeIndex];

      // Calculate degrees: 5 full rotations (1800 deg) + offset for segment
      const segmentAngle = 360 / SEGMENTS.length;
      const targetAngle = 1800 + (360 - (prizeIndex * segmentAngle) - segmentAngle / 2);

      setRotation((prev) => prev + targetAngle);

      setTimeout(() => {
        setIsSpinning(false);
        setWonPrize(selectedPrize);
      }, 4200);
    } catch (e) {
      setIsSpinning(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyNow = () => {
    if (wonPrize?.code) {
      onApplyPrize(wonPrize);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-prime"
        style={{ maxWidth: 540, textAlign: 'center', padding: '30px 24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <span className="badge-violet" style={{ marginBottom: 8 }}>
          <Sparkles size={14} /> DIWALI DHAMAKA LUCK WHEEL
        </span>
        <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', marginBottom: 6 }}>
          Spin & Win Festive Rewards!
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
          Win up to 15% wholesale discount, bonus cash & complimentary sparkler boxes.
        </p>

        {/* Wheel Container */}
        <div style={{ position: 'relative', width: 300, height: 300, margin: '0 auto 24px' }}>
          {/* Wheel Pointer Arrow */}
          <div style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '24px solid var(--violet-light)',
            filter: 'drop-shadow(0 3px 8px rgba(168, 85, 247, 0.7))'
          }} />

          {/* Rotating SVG Wheel */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '6px solid var(--violet-light)',
              boxShadow: '0 0 35px rgba(168, 85, 247, 0.45), inset 0 0 20px rgba(0,0,0,0.8)',
              overflow: 'hidden',
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
              background: '#050508'
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: 'block' }}>
              {SEGMENTS.map((seg, idx) => {
                const angle = 360 / SEGMENTS.length;
                const startAngle = idx * angle;
                const endAngle = startAngle + angle;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);

                const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const textAngle = startAngle + angle / 2;
                const textRad = (textAngle * Math.PI) / 180;
                const tx = 50 + 32 * Math.cos(textRad);
                const ty = 50 + 32 * Math.sin(textRad);

                return (
                  <g key={idx}>
                    <path d={d} fill={seg.color} stroke="rgba(5, 5, 8, 0.9)" strokeWidth="1.5" />
                    <text
                      x={tx}
                      y={ty}
                      fill={seg.text}
                      fontSize="4.5"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                      fontFamily="var(--font-heading)"
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #E9D5FF 0%, #7E22CE 100%)',
            border: '3px solid #FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.8), 0 0 15px rgba(168, 85, 247, 0.5)',
            cursor: isSpinning ? 'not-allowed' : 'pointer',
            zIndex: 5
          }} onClick={handleSpin}>
            <Sparkles size={22} color="#050508" />
          </div>
        </div>

        {/* Won Prize Banner */}
        {wonPrize && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(16, 185, 129, 0.2))',
            border: '1px solid var(--violet-light)',
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 20,
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--violet-bright)', fontWeight: 700, textTransform: 'uppercase' }}>
              🎉 CONGRATULATIONS! YOU WON:
            </div>
            <div className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', margin: '4px 0 8px' }}>
              {wonPrize.label || wonPrize.description}
            </div>

            {wonPrize.code && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}>
                <span style={{ padding: '6px 14px', background: 'rgba(5, 5, 8, 0.85)', border: '1px dashed var(--violet-light)', borderRadius: 8, fontSize: '0.95rem', fontWeight: 800, color: 'var(--violet-bright)', letterSpacing: '0.08em' }}>
                  {wonPrize.code}
                </span>
                <button
                  onClick={() => handleCopyCode(wonPrize.code)}
                  className="btn-secondary-dark"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}

            <div style={{ marginTop: 14 }}>
              <button
                onClick={handleApplyNow}
                className="btn-prime"
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                <span>Apply To Cart Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Spin Action */}
        {!wonPrize && (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="btn-prime"
            style={{ padding: '14px 40px', fontSize: '1.05rem', margin: '0 auto' }}
          >
            <Sparkles size={18} />
            <span>{isSpinning ? 'Spinning the Wheel...' : 'Spin the Wheel Now!'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
