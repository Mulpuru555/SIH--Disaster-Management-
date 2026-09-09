import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export default function AlertBanner({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isWarning = notification.type === 'warning' || notification.type === 'danger';

  return (
    <div style={{
      margin: '0 16px 12px 16px',
      background: isWarning ? 'linear-gradient(90deg, #7f1d1d, #991b1b)' : 'linear-gradient(90deg, #14532d, #166534)',
      border: isWarning ? '1px solid #ef4444' : '1px solid #22c55e',
      borderRadius: '6px',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#ffffff',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
      animation: 'fadeIn 0.3s ease-in-out',
      zIndex: 1500
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isWarning ? (
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '4px' }}>
            <AlertTriangle size={18} color="#fecaca" />
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '4px' }}>
            <CheckCircle2 size={18} color="#bbf7d0" />
          </div>
        )}
        <div>
          <div style={{ fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#fef08a' }}>
            {notification.title || 'DEOC Operational Flash Advisory'}
          </div>
          <div style={{ fontSize: '11.5px', color: '#f8fafc', marginTop: '1px' }}>
            {notification.message}
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
