import React, { useState, useEffect } from 'react';
import { Shield, FileText, Clock, Map, ListFilter, Home, Compass } from 'lucide-react';

export default function Header({ activeTab, onTabChange, onOpenManifest, horizon, onHorizonChange }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{ background: '#07192f', borderBottom: '1px solid #1e3a5f' }}>
      {/* 1. Indian National Tricolor Bar */}
      <div className="gov-tricolor-bar"></div>

      {/* 2. Official Government Branding Header */}
      <div style={{
        padding: '10px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Left: National Emblem & Department Identification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Emblem Icon */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a5f, #0d2847)',
            border: '1px solid #d97706',
            borderRadius: '6px',
            padding: '8px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '46px'
          }}>
            <Shield size={22} color="#d97706" />
            <span style={{ fontSize: '7.5px', color: '#f59e0b', fontWeight: 'bold', marginTop: '2px', letterSpacing: '0.5px' }}>
              सत्यमेव जयते
            </span>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: '700' }}>
              भारत सरकार &bull; Government of India &bull; Ministry of Home Affairs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
              <h1 style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>
                ResQGrid
              </h1>
              <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: '500' }}>
                National Proactive Relocation Intelligence Platform
              </span>
              <span style={{ fontSize: '10.5px', background: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', border: '1px solid rgba(217, 119, 6, 0.5)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                SIH26191 (NDRF)
              </span>
              <span style={{ fontSize: '10.5px', background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', border: '1px solid rgba(37, 99, 235, 0.5)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                Team 16: BharatBytes
              </span>
            </div>
          </div>
        </div>

        {/* Right: Operational Status & Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', fontSize: '11px', color: '#34d399', fontWeight: 'bold' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              DEOC RELOCATION CELL &bull; ACTIVE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10.5px', color: '#94a3b8', marginTop: '2px', justifyContent: 'flex-end' }}>
              <Clock size={12} />
              <span>{timeStr}</span>
            </div>
          </div>

          <button
            onClick={onOpenManifest}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #1e3a5f, #1e40af)',
              color: '#ffffff',
              border: '1px solid #3b82f6',
              padding: '7px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              transition: 'background 0.2s'
            }}
          >
            <FileText size={15} color="#38bdf8" />
            <span>NDRF Official Order</span>
          </button>
        </div>
      </div>

      {/* 3. Official Navigation Tabs Bar */}
      <div style={{
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0a1d35',
        borderBottom: '1px solid #163354'
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'gis', label: 'Integrated GIS Command', icon: Map },
            { id: 'habitations', label: 'Habitations Risk Register', icon: ListFilter },
            { id: 'shelters', label: 'Relief Camps & Capacity Matrix', icon: Home },
            { id: 'resettlement', label: 'Permanent Resettlement Townships', icon: Compass }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '11px 16px',
                  fontSize: '12px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? '#132e50' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <Icon size={14} color={isActive ? '#38bdf8' : '#64748b'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3-Tier Horizon Selector (NDRF Mandate) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Relocation Horizon:</span>
          <div style={{ display: 'flex', background: '#071526', padding: '2px', borderRadius: '5px', border: '1px solid #1e3a5f' }}>
            <button
              onClick={() => onHorizonChange('immediate')}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: horizon === 'immediate' ? '#dc2626' : 'transparent',
                color: horizon === 'immediate' ? 'white' : '#94a3b8'
              }}
            >
              🚨 Immediate (0-48h)
            </button>
            <button
              onClick={() => onHorizonChange('short_term')}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: horizon === 'short_term' ? '#ea580c' : 'transparent',
                color: horizon === 'short_term' ? 'white' : '#94a3b8'
              }}
            >
              ⏳ Short-Term (Pre-Monsoon)
            </button>
            <button
              onClick={() => onHorizonChange('medium_term')}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: horizon === 'medium_term' ? '#15803d' : 'transparent',
                color: horizon === 'medium_term' ? 'white' : '#94a3b8'
              }}
            >
              🏡 Medium-Term (Permanent)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
