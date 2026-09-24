import React, { useState, useEffect } from 'react';
import { Shield, FileText, Clock, Map, ListFilter, Home, Bot, Activity, Layers, ShieldCheck, Radio } from 'lucide-react';

export default function Header({ 
  activeTab, 
  onTabChange, 
  onOpenManifest, 
  horizon, 
  onHorizonChange,
  onOpenAIAssistant, 
  onOpenTelemetry, 
  onOpenGISUpload, 
  onOpenAudit,
  operationalMode = 'LIVE'
}) {
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
    <header style={{ background: '#0a1d35', borderBottom: '1px solid #1e3a5f' }}>
      {/* 1. Official Indian National Tricolor Bar */}
      <div className="gov-tricolor-bar"></div>

      {/* 2. Official Ministry & Department Header */}
      <div style={{
        padding: '10px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Left: National Emblem & Formal Identification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: '#071526',
            border: '1px solid #d97706',
            borderRadius: '4px',
            padding: '6px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '42px'
          }}>
            <Shield size={20} color="#d97706" />
            <span style={{ fontSize: '7px', color: '#f59e0b', fontWeight: 'bold', marginTop: '2px', letterSpacing: '0.4px' }}>
              सत्यमेव जयते
            </span>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', letterSpacing: '0.6px', textTransform: 'uppercase', fontWeight: '700' }}>
              भारत सरकार &bull; Government of India &bull; Ministry of Home Affairs
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '16.5px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.4px' }}>
                ResQGrid
              </h1>
              <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: '500' }}>
                National Proactive Relocation Intelligence Platform
              </span>
              <span style={{
                fontSize: '10px',
                background: 'rgba(217, 119, 6, 0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(217, 119, 6, 0.4)',
                padding: '1px 6px',
                borderRadius: '3px',
                fontWeight: '700'
              }}>
                SIH26191 (NDRF)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Operational Status, Clock & Essential Decision Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Status & Clock */}
          <div style={{ textAlign: 'right', paddingRight: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', fontSize: '11px', fontWeight: '700' }}>
              {operationalMode === 'LIVE' ? (
                <span className="badge-blue" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  <Radio size={11} />
                  <span>LIVE SENSOR TELEMETRY</span>
                </span>
              ) : (
                <span className="badge-amber" style={{ fontSize: '10px', padding: '2px 6px' }}>
                  <span>⚠️ SIMULATION MODE (WHAT-IF)</span>
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#94a3b8', marginTop: '3px', justifyContent: 'flex-end' }}>
              <Clock size={11} />
              <span>{timeStr}</span>
            </div>
          </div>

          {/* Action 1: Decision Support AI */}
          <button
            onClick={onOpenAIAssistant}
            className="gov-btn-secondary"
            title="Evidence-grounded operational guidance for District Authorities"
          >
            <Bot size={13} color="#93c5fd" />
            <span>Decision Support</span>
          </button>

          {/* Action 2: Data Provenance & Feeds */}
          <button
            onClick={onOpenTelemetry}
            className="gov-btn-secondary"
            title="Inspect live IMD AWS, satellite feeds, and data freshness"
          >
            <Activity size={13} color="#38bdf8" />
            <span>Data Provenance</span>
          </button>

          {/* Action 3: Upload GIS Layer */}
          <button
            onClick={onOpenGISUpload}
            className="gov-btn-secondary"
            title="Upload GeoJSON hazard zone boundaries or survey polygons"
          >
            <Layers size={13} color="#f59e0b" />
            <span>Upload GIS</span>
          </button>

          {/* Action 4: Draft Relocation Plan (Statutory Document) */}
          <button
            onClick={onOpenManifest}
            className="gov-btn-primary"
            title="Generate and review Draft Relocation Plan pending statutory approval"
          >
            <FileText size={13} />
            <span>Draft Relocation Plan</span>
          </button>

          {/* Action 5: Audit & Governance */}
          <button
            onClick={onOpenAudit}
            className="gov-btn-secondary"
            title="Statutory audit log of decision recommendations and data provenance"
          >
            <ShieldCheck size={13} color="#94a3b8" />
            <span>Audit</span>
          </button>
        </div>
      </div>

      {/* 3. Official Navigation & Planning Horizon Toolbar */}
      <div style={{
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#071526',
        borderBottom: '1px solid #163354',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {[
            { id: 'gis', label: 'Integrated GIS Command', icon: Map },
            { id: 'habitations', label: 'Habitations Risk Register', icon: ListFilter },
            { id: 'shelters', label: 'Relief Camps & Carrying Capacity', icon: Home }
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
                  padding: '9px 14px',
                  fontSize: '11.5px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? '#0f2744' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Icon size={13} color={isActive ? '#38bdf8' : '#64748b'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3-Tier Horizon Selector (SIH26191 Core Requirement) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0' }}>
          <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '600' }}>Relocation Horizon:</span>
          <div style={{ display: 'flex', background: '#0a1d35', padding: '2px', borderRadius: '4px', border: '1px solid #1e3a5f' }}>
            <button
              onClick={() => onHorizonChange('immediate')}
              style={{
                background: horizon === 'immediate' ? '#b91c1c' : 'transparent',
                color: horizon === 'immediate' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 9px',
                borderRadius: '3px',
                fontSize: '10.5px',
                fontWeight: horizon === 'immediate' ? '700' : '500',
                cursor: 'pointer'
              }}
              title="Immediate emergency evacuation to cyclone/flood shelters (0-48h)"
            >
              🚨 Immediate (0–48h)
            </button>
            <button
              onClick={() => onHorizonChange('short_term')}
              style={{
                background: horizon === 'short_term' ? '#b45309' : 'transparent',
                color: horizon === 'short_term' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 9px',
                borderRadius: '3px',
                fontSize: '10.5px',
                fontWeight: horizon === 'short_term' ? '700' : '500',
                cursor: 'pointer'
              }}
              title="Seasonal temporary relocation & relief staging"
            >
              ⚠️ Short-Term (Pre-Monsoon)
            </button>
            <button
              onClick={() => onHorizonChange('medium_term')}
              style={{
                background: horizon === 'medium_term' ? '#15803d' : 'transparent',
                color: horizon === 'medium_term' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 9px',
                borderRadius: '3px',
                fontSize: '10.5px',
                fontWeight: horizon === 'medium_term' ? '700' : '500',
                cursor: 'pointer'
              }}
              title="Permanent rehabilitation onto hazard-free tableland townships"
            >
              🏡 Medium-Term (Permanent)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
