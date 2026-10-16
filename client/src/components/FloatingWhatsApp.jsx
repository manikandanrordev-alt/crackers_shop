import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp({ whatsappNumber, shopConfig }) {
  const rawNumber = shopConfig?.whatsapp_number || whatsappNumber || '919842154321';
  const number = rawNumber.replace(/\D/g, '');
  const shopName = shopConfig?.shop_name || 'Wholesale Fireworks';
  const message = encodeURIComponent(`Hello ${shopName}, I would like to inquire about Diwali 2026 wholesale cracker orders and delivery!`);
  const whatsappUrl = `https://wa.me/${number}?text=${message}`;

  return (
    <aside aria-label="Quick WhatsApp Support">
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: 9999,
          textDecoration: 'none',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
          transition: 'all 0.3s ease',
          fontWeight: 700,
          fontSize: '0.88rem'
        }}
        className="float-animation"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle size={22} fill="#FFF" color="#128C7E" />
        </div>
        <span className="d-none-sm">Wholesale Chat</span>
      </a>
    </aside>
  );
}
