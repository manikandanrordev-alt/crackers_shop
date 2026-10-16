import React, { useState } from 'react';
import { X, User, Lock, Mail, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, onDemoLogin }) {
  if (!isOpen) return null;

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== passwordConfirmation) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await onRegister(email, password, passwordConfirmation);
      } else {
        await onLogin(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    try {
      await onDemoLogin(role);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content-prime"
        style={{ maxWidth: 440, padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
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

          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--violet-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Flame size={24} color="#FFFFFF" />
          </div>

          <h3 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isRegister ? 'Sign up to track orders in real-time and place wholesale bookings' : 'Sign in to access your cart, orders & wholesale prices'}
          </p>

          {/* Quick Demo Switchers */}
          <div style={{ marginTop: 16, padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 10, border: '1px dashed var(--border-violet)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
              Quick One-Click Test Login
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleDemo('admin')}
                style={{ flex: 1, padding: '7px 10px', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', borderRadius: 6, cursor: 'pointer' }}
              >
                👑 1-Click Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemo('customer')}
                style={{ flex: 1, padding: '7px 10px', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(168, 85, 247, 0.15)', border: '1px solid #A855F7', color: 'var(--violet-bright)', borderRadius: 6, cursor: 'pointer' }}
              >
                👤 1-Click Customer
              </button>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: 8, color: '#F87171', fontSize: '0.85rem', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-prime"
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: isRegister ? 14 : 20 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-prime"
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          {isRegister && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="input-prime"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-prime"
            style={{ width: '100%', padding: '12px', fontSize: '1rem', marginBottom: 16 }}
          >
            {loading ? 'Processing...' : (isRegister ? 'Create My Account' : 'Sign In to Account')}
          </button>

          {/* Switch Tab */}
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isRegister ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--violet-bright)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--violet-bright)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create One
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
