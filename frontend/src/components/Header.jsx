import React, { useState, useEffect } from 'react';
import {
  Shield, FileText, Clock, Map, Home,
  Radio, Sliders, AlertTriangle, Navigation, Truck, Bot, Globe
} from 'lucide-react';
import { OPERATIONAL_SECTORS } from '../services/localEngine';

export default function Header({
  activeTab,
  onTabChange,
  onOpenManifest,
  horizon,
  onHorizonChange,
  currentSector,
  onSectorChange,
  _onOpenTelemetry,
  _onOpenAudit,
  operationalMode = 'LIVE',
  onOperationalModeChange,
  _liveWeather,
  userRole = 'DDMA',
  onRoleChange
}) {
  const [timeStr, setTimeStr] = useState('');
  const [fontSizeScale, setFontSizeScale] = useState(1);
  const [language, setLanguage] = useState('EN'); // 'EN' | 'HI'

  // Exact 8 Core Decision Modules mandated by SIH26191 Government Specification
  const NAV_MODULES = [
    { id: 'national', label: language === 'HI' ? 'होम / डैशबोर्ड' : 'Home / Dashboard', icon: Map, title: 'National Situation Briefing, 7 Critical Decision Parameters & Pan-India Overview' },
    { id: 'alerts', label: language === 'HI' ? 'आपदा स्थिति (लाइव)' : 'Live Disaster Situation', icon: AlertTriangle, title: 'Real-time IMD Automated Weather Stations (AWS) & CWC River Stage Gauges' },
    { id: 'gis', label: language === 'HI' ? 'जीआईएस एवं सुरक्षित मार्ग' : 'GIS & Safe Routes', icon: Navigation, title: 'Interactive GIS Tactical Command Map with Safest & Fastest Evacuation Routes' },
    { id: 'ai_decision', label: language === 'HI' ? 'एआई निर्णय समर्थन' : 'AI Decision Support', icon: Bot, title: 'Grounded Gen-AI Copilot, NDRF SOPs & Statutory Decision Recommendations' },
    { id: 'shelters', label: language === 'HI' ? 'राहत आश्रय एवं क्षमता' : 'Relief Shelters & Capacity', icon: Home, title: 'Shelters Carrying Capacity, Sphere Humanitarian Norms & Logistics Fleet' },
    { id: 'relocation', label: language === 'HI' ? 'निकासी एवं पुनर्वास योजना' : 'Evacuation / Relocation Plans', icon: Truck, title: '11-Column Master Evacuation Registry, 3-Tier Horizons & Editable Plan' },
    { id: 'reports', label: language === 'HI' ? 'सरकारी रिपोर्ट' : 'Reports', icon: FileText, title: 'Official SITREP, Risk Assessment & Resource Mobilization Reports' },
    { id: 'audit', label: language === 'HI' ? 'डेटा स्रोत एवं ऑडिट' : 'Data Sources / Audit', icon: Shield, title: 'Section 34 DM Act Orders, Cryptographic SHA-256 Ledger & Data Lineage' }
  ];

  // Adjust font size dynamically for GIGW accessibility compliance
  const handleFontSizeChange = (scale) => {
    setFontSizeScale(scale);
    if (scale === 0.9) document.documentElement.style.fontSize = '12px';
    else if (scale === 1) document.documentElement.style.fontSize = '13px';
    else if (scale === 1.15) document.documentElement.style.fontSize = '14.5px';
  };

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
    <header style={{ borderBottom: '1px solid #cbd5e1' }}>
      {/* ========================================================================
          TIER 1: TOP ACCESSIBILITY & APEX MINISTRY STRIP (NIC / GIGW Standard)
          ======================================================================== */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '3px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#334155'
      }}>
        {/* Left: Apex Government Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>भारत सरकार</span>
            <span style={{ color: '#94a3b8' }}>|</span>
            <span style={{ fontWeight: '600', color: '#334155' }}>GOVERNMENT OF INDIA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>गृह मंत्रालय</span>
            <span style={{ color: '#94a3b8' }}>|</span>
            <span style={{ fontWeight: '600', color: '#334155' }}>MINISTRY OF HOME AFFAIRS</span>
          </div>
        </div>

        {/* Right: Accessibility Controls, Language & Role Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Skip to Main Content */}
          <a
            href="#main-content"
            style={{ color: '#002b49', textDecoration: 'none', fontWeight: '600', fontSize: '10.5px' }}
          >
            Skip to main content
          </a>

          <span style={{ color: '#cbd5e1' }}>|</span>

          {/* Font Resize Accessibility Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={() => handleFontSizeChange(0.9)}
              style={{
                background: fontSizeScale === 0.9 ? '#002b49' : '#f1f5f9',
                color: fontSizeScale === 0.9 ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                padding: '1px 5px',
                borderRadius: '2px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSizeChange(1)}
              style={{
                background: fontSizeScale === 1 ? '#002b49' : '#f1f5f9',
                color: fontSizeScale === 1 ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                padding: '1px 5px',
                borderRadius: '2px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              title="Normal Font Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontSizeChange(1.15)}
              style={{
                background: fontSizeScale === 1.15 ? '#002b49' : '#f1f5f9',
                color: fontSizeScale === 1.15 ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                padding: '1px 5px',
                borderRadius: '2px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <span style={{ color: '#cbd5e1' }}>|</span>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(l => l === 'EN' ? 'HI' : 'EN')}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              padding: '1px 6px',
              fontSize: '10.5px',
              fontWeight: '700',
              color: '#002b49',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Globe size={11} />
            <span>{language === 'EN' ? 'हिन्दी' : 'English'}</span>
          </button>

          <span style={{ color: '#cbd5e1' }}>|</span>

          {/* Role-Based Access Control Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>ROLE:</span>
            <select
              value={userRole}
              onChange={e => onRoleChange && onRoleChange(e.target.value)}
              style={{
                background: '#ffffff',
                color: '#002b49',
                border: '1px solid #002b49',
                borderRadius: '2px',
                padding: '2px 5px',
                fontSize: '10.5px',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="DDMA">DDMA / District Magistrate (Sign-Off)</option>
              <option value="NDMA">NDMA (National Executive Committee)</option>
              <option value="SDMA">SDMA (State Relief Commissioner)</option>
              <option value="NDRF">NDRF (Battalion Commander)</option>
              <option value="DISTRICT_OFFICER">District Officer / DEOC Operator</option>
              <option value="FIELD_OFFICER">Field Officer (QRT Transit)</option>
              <option value="ADMIN">System Administrator</option>
              <option value="READ_ONLY">Public / Observer (Read-Only)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================
          TIER 2: PRIMARY NDRF BRAND BANNER (Deep Navy #002b49 Institutional)
          ======================================================================== */}
      <div style={{
        background: '#002b49',
        padding: '12px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        color: '#ffffff'
      }}>
        {/* Left: National Lion Emblem + NDRF Force Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Emblem Container */}
          <div style={{
            background: '#ffffff',
            borderRadius: '4px',
            padding: '5px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '42px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            <Shield size={20} color="#b45309" />
            <span style={{ fontSize: '7px', color: '#78350f', fontWeight: '800', marginTop: '2px', letterSpacing: '0.4px' }}>
              सत्यमेव जयते
            </span>
          </div>

          <div>
            <div style={{ fontSize: '11.5px', color: '#fed7aa', fontWeight: '700', letterSpacing: '0.4px' }}>
              राष्ट्रीय आपदा प्रबंधन निर्णय समर्थन एवं पूर्व-निकासी प्रणाली
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.4px' }}>
                ResQGrid
              </span>
              <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: '500' }}>
                National Disaster Management Decision Support &amp; Relocation Platform
              </span>
              <span style={{
                fontSize: '9.5px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '1px 6px',
                borderRadius: '3px',
                fontWeight: '700'
              }}>
                SIH26191 &bull; MHA / NDRF
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
              Ministry of Home Affairs &bull; National Disaster Response Force (NDRF) &bull; DM Division
            </div>
          </div>
        </div>

        {/* Right: NDRF Motto, Environment Mode Toggle & Live Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* NDRF Official Motto */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12.5px', color: '#fed7aa', fontWeight: '800', letterSpacing: '0.5px' }}>
              आपदा सेवा सदैव सर्वत्र
            </div>
            <div style={{ fontSize: '10px', color: '#cbd5e1', fontStyle: 'italic' }}>
              Saving Lives &amp; Beyond
            </div>
          </div>

          {/* Environment Mode Separator (Live Verified vs Simulation) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '3px',
            display: 'flex',
            gap: '2px'
          }}>
            <button
              onClick={() => onOperationalModeChange && onOperationalModeChange('LIVE')}
              style={{
                background: operationalMode === 'LIVE' ? '#15803d' : 'transparent',
                color: operationalMode === 'LIVE' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '3px',
                fontSize: '10.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Operating strictly on verified live sensor feeds (IMD AWS & CWC)"
            >
              <Radio size={11} />
              <span>LIVE VERIFIED DATA</span>
            </button>

            <button
              onClick={() => onOperationalModeChange && onOperationalModeChange('SIMULATION')}
              style={{
                background: operationalMode === 'SIMULATION' ? '#c2410c' : 'transparent',
                color: operationalMode === 'SIMULATION' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '3px',
                fontSize: '10.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Contingency What-If simulation mode for stress-testing"
            >
              <Sliders size={11} />
              <span>SIMULATION / WHAT-IF</span>
            </button>
          </div>

          {/* Clock */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '10.5px',
            color: '#e2e8f0',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Clock size={11} color="#fed7aa" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================
          TIER 3: SAFFRON OPERATIONAL & JURISDICTION SUB-STRIP (#c2410c Accent)
          ======================================================================== */}
      <div style={{
        background: '#c2410c',
        padding: '5px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        color: '#ffffff',
        fontSize: '11px'
      }}>
        {/* Left: Operational Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '800', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            OPERATIONAL COMMAND:
          </span>
          <span style={{ color: '#fed7aa', fontWeight: '500' }}>
            Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment &amp; Immediate Relocation Needs
          </span>
        </div>

        {/* Right: Operational Jurisdiction & Horizon Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Jurisdiction Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '700', color: '#ffffff' }}>Jurisdiction:</span>
            <select
              value={currentSector}
              onChange={e => onSectorChange(e.target.value)}
              style={{
                background: '#ffffff',
                color: '#002b49',
                border: 'none',
                borderRadius: '3px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '700',
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '240px'
              }}
            >
              {OPERATIONAL_SECTORS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Horizon Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '700', color: '#ffffff' }}>Horizon:</span>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '1px', borderRadius: '3px' }}>
              <button
                onClick={() => onHorizonChange('immediate')}
                style={{
                  background: horizon === 'immediate' ? '#ffffff' : 'transparent',
                  color: horizon === 'immediate' ? '#c2410c' : '#ffffff',
                  border: 'none',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                0–24h
              </button>
              <button
                onClick={() => onHorizonChange('short_term')}
                style={{
                  background: horizon === 'short_term' ? '#ffffff' : 'transparent',
                  color: horizon === 'short_term' ? '#c2410c' : '#ffffff',
                  border: 'none',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                24–72h
              </button>
              <button
                onClick={() => onHorizonChange('medium_term')}
                style={{
                  background: horizon === 'medium_term' ? '#ffffff' : 'transparent',
                  color: horizon === 'medium_term' ? '#c2410c' : '#ffffff',
                  border: 'none',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Medium-Term
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          TIER 4: MAIN NAVIGATION BAR (Clean White Government Navigation)
          ======================================================================== */}
      <nav id="main-content" style={{
        background: '#ffffff',
        borderBottom: '2px solid #002b49',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
      }}>
        {/* Nav Tabs */}
        <div style={{ display: 'flex', gap: '2px', overflowX: 'auto', paddingBottom: '0' }}>
          {NAV_MODULES.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id || (tab.id === 'national' && activeTab === 'gis');

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                title={tab.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontWeight: isActive ? '800' : '600',
                  color: isActive ? '#002b49' : '#475569',
                  background: isActive ? '#f1f5f9' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #c2410c' : '3px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={isActive ? '#c2410c' : '#64748b'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Action Button: Draft Relocation Plan (DM Act §34) */}
        {onOpenManifest && (
          <button
            onClick={onOpenManifest}
            style={{
              background: '#002b49',
              color: '#ffffff',
              border: 'none',
              borderRadius: '3px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
            title="Generate and review statutory draft relocation plan under Section 34 of DM Act, 2005"
          >
            <FileText size={12} color="#fed7aa" />
            <span>Draft Relocation Plan (&sect;34)</span>
          </button>
        )}
      </nav>
    </header>
  );
}
