import React, { useState, useEffect } from 'react';
import { Shield, FileText, Clock, Map, ListFilter, Home, Activity, ShieldCheck, Radio, Sliders, AlertTriangle } from 'lucide-react';
import { OPERATIONAL_SECTORS } from '../services/localEngine';

export default function Header({
  activeTab,
  onTabChange,
  onOpenManifest,
  horizon,
  onHorizonChange,
  currentSector,
  onSectorChange,
  onOpenTelemetry,
  onOpenAudit,
  operationalMode = 'LIVE',
  liveWeather
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ', ' + now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{ background: '#0b2545', borderBottom: '1px solid #071729', color: '#ffffff' }}>
      {/* 1. Indian National Tricolor Header Ribbon */}
      <div className="gov-tricolor-bar"></div>

      {/* 2. Primary Government Identification Banner */}
      <div style={{
        padding: '8px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        {/* Left: National Emblem & Department Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '3px',
            padding: '4px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '38px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}>
            <Shield size={18} color="#b45309" />
            <span style={{ fontSize: '6.5px', color: '#78350f', fontWeight: '800', marginTop: '1px', letterSpacing: '0.3px' }}>
              सत्यमेव जयते
            </span>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: '700' }}>
              भारत सरकार &bull; Government of India &bull; Ministry of Home Affairs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.3px' }}>
                ResQGrid
              </span>
              <span style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: '500' }}>
                National Decision Support Platform for Hazard Red Zones &amp; Relocation Planning
              </span>
              <span style={{
                fontSize: '9.5px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '1px 5px',
                borderRadius: '3px',
                fontWeight: '700'
              }}>
                SIH26191 (NDRF)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Telemetry Status, Clock & Statutory Relocation Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Telemetry Badge & Time */}
          <div style={{ textAlign: 'right', paddingRight: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end', fontSize: '10px', fontWeight: '700' }}>
              {operationalMode === 'LIVE' ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#86efac',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}>
                  <Radio size={10} />
                  <span>VERIFIED SENSOR TELEMETRY</span>
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(234, 88, 12, 0.25)',
                  color: '#fdba74',
                  border: '1px solid rgba(234, 88, 12, 0.5)',
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}>
                  <AlertTriangle size={10} />
                  <span>CONTINGENCY MODELING</span>
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#94a3b8', marginTop: '2px', justifyContent: 'flex-end' }}>
              <Clock size={10} />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Action 1: Data Provenance */}
          <button
            onClick={onOpenTelemetry}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
              padding: '5px 9px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Inspect verified data sources and station timestamps"
          >
            <Activity size={12} />
            <span>Data Provenance</span>
          </button>

          {/* Action 2: Audit Integrity */}
          <button
            onClick={onOpenAudit}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
              padding: '5px 9px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Statutory Decision Integrity Register (SHA-256 Audit Trail)"
          >
            <ShieldCheck size={12} />
            <span>Audit Register</span>
          </button>

          {/* Action 3: Draft Relocation Plan (Statutory Document) */}
          <button
            onClick={onOpenManifest}
            style={{
              background: '#b91c1c',
              color: '#ffffff',
              border: '1px solid #991b1b',
              borderRadius: '3px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Review and generate statutory draft relocation order under Section 34 of DM Act 2005"
          >
            <FileText size={12} />
            <span>Draft Relocation Plan (DM Act §34)</span>
          </button>
        </div>
      </div>

      {/* 3. Operational Navigation, Jurisdiction Selector & Horizon Strip */}
      <div style={{
        padding: '4px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#071729',
        borderBottom: '1px solid #cbd5e1',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {[
            { id: 'gis', label: 'GIS Spatial Command', icon: Map },
            { id: 'habitations', label: 'Habitations Risk Register', icon: ListFilter },
            { id: 'shelters', label: 'Relief Shelters & Carrying Capacity', icon: Home },
            { id: 'contingency', label: 'Contingency Modeling (What-If)', icon: Sliders }
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
                  gap: '6px',
                  padding: '7px 12px',
                  fontSize: '11.5px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? '#0f2744' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Icon size={12} color={isActive ? '#38bdf8' : '#64748b'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center/Right: District Jurisdiction Selector & Relocation Horizon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Operational Jurisdiction Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10.5px', color: '#cbd5e1', fontWeight: '600' }}>Jurisdiction:</span>
            <select
              value={currentSector}
              onChange={e => onSectorChange(e.target.value)}
              style={{
                background: '#0b2545',
                color: '#ffffff',
                border: '1px solid #1e3a5f',
                borderRadius: '3px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '280px'
              }}
            >
              {OPERATIONAL_SECTORS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3-Tier Horizon Selector (SIH26191 Mandate) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10.5px', color: '#cbd5e1', fontWeight: '600' }}>Horizon:</span>
            <div style={{ display: 'flex', background: '#0b2545', padding: '2px', borderRadius: '3px', border: '1px solid #1e3a5f' }}>
              <button
                onClick={() => onHorizonChange('immediate')}
                style={{
                  background: horizon === 'immediate' ? '#b91c1c' : 'transparent',
                  color: horizon === 'immediate' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '2px',
                  fontSize: '10px',
                  fontWeight: horizon === 'immediate' ? '700' : '500',
                  cursor: 'pointer'
                }}
                title="Immediate evacuation to pre-positioned shelters (0-48h)"
              >
                Immediate (0–48h)
              </button>
              <button
                onClick={() => onHorizonChange('short_term')}
                style={{
                  background: horizon === 'short_term' ? '#b45309' : 'transparent',
                  color: horizon === 'short_term' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '2px',
                  fontSize: '10px',
                  fontWeight: horizon === 'short_term' ? '700' : '500',
                  cursor: 'pointer'
                }}
                title="Pre-monsoon temporary relocation & relief staging"
              >
                Short-Term
              </button>
              <button
                onClick={() => onHorizonChange('medium_term')}
                style={{
                  background: horizon === 'medium_term' ? '#15803d' : 'transparent',
                  color: horizon === 'medium_term' ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '2px',
                  fontSize: '10px',
                  fontWeight: horizon === 'medium_term' ? '700' : '500',
                  cursor: 'pointer'
                }}
                title="Permanent rehabilitation onto hazard-free tableland townships"
              >
                Medium-Term
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
