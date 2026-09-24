import React, { useState } from 'react';
import { Wind, Gauge, Waves, AlertTriangle, Crosshair, Radar, MapPin, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function ActiveStormBanner({
  onSelectStormSector,
  onToggleRadar,
  isRadarActive,
  onDetectLocation,
  currentSector
}) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (isDismissed) {
    return (
      <div style={{
        margin: '0 16px 8px 16px',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={() => setIsDismissed(false)}
          style={{
            background: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '3px 9px',
            borderRadius: '4px',
            fontSize: '10.5px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span className="spin-animate">🌀</span>
          <span>Show Active Storm Arnab Alert (991 hPa / 76 km/h)</span>
        </button>
      </div>
    );
  }

  const isFocusingStorm = currentSector === 'cyclone_arnab';

  return (
    <div style={{
      margin: '0 16px 10px 16px',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(24, 24, 52, 0.98))',
      border: '1px solid #dc2626',
      borderLeft: '5px solid #ef4444',
      borderRadius: '8px',
      padding: '10px 16px',
      boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)',
      position: 'relative',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {/* Left: Active Cyclone Identification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 0 14px rgba(239, 68, 68, 0.6)',
            flexShrink: 0
          }}>
            🌀
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: '900',
                padding: '2px 7px',
                borderRadius: '4px',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                🚨 DEOC CYCLONE ALERT
              </span>
              <strong style={{ fontSize: '13px', color: '#ffffff', letterSpacing: '0.3px' }}>
                Deep Depression &quot;Arnab&quot; Weather System (Bay of Bengal)
              </strong>
              <span style={{ fontSize: '11px', color: '#fca5a5', fontWeight: '600' }}>
                &bull; Landfall Sector: Kalingapatnam (North Andhra &amp; South Odisha Coast)
              </span>
            </div>

            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '3px' }}>
              Deep depression active over Bay of Bengal with sub-1000 hPa central pressure and gale force gusts along the AP-Odisha coast. High swell warning active.
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelectStormSector('cyclone_arnab')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isFocusingStorm ? 'linear-gradient(135deg, #15803d, #16a34a)' : 'linear-gradient(135deg, #b91c1c, #dc2626)',
              color: '#ffffff',
              border: isFocusingStorm ? '1px solid #4ade80' : '1px solid #f87171',
              padding: '6px 12px',
              borderRadius: '5px',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
              transition: 'all 0.15s'
            }}
          >
            <Crosshair size={14} />
            <span>{isFocusingStorm ? '✓ Tracking Cyclone Arnab' : '🎯 Track Cyclone Arnab Live on Map'}</span>
          </button>

          <button
            onClick={onToggleRadar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isRadarActive ? 'rgba(2, 132, 199, 0.25)' : '#071526',
              color: isRadarActive ? '#38bdf8' : '#94a3b8',
              border: isRadarActive ? '1px solid #38bdf8' : '1px solid #1e3a5f',
              padding: '6px 11px',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <Radar size={14} color={isRadarActive ? '#38bdf8' : '#94a3b8'} />
            <span>{isRadarActive ? '🛰️ Radar Overlay ON' : '🛰️ View Doppler Radar'}</span>
          </button>

          {onDetectLocation && (
            <button
              onClick={onDetectLocation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: '#0d2847',
                color: '#38bdf8',
                border: '1px solid #1e40af',
                padding: '6px 10px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Detect live weather at your current device location"
            >
              <MapPin size={13} color="#38bdf8" />
              <span>My Location Weather</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title={isExpanded ? 'Collapse metrics' : 'Expand metrics'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Dismiss Alert Banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Expanded Live Meteorological Telemetry Pills */}
      {isExpanded && (
        <div style={{
          marginTop: '9px',
          paddingTop: '9px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '8px'
        }}>
          <div style={{
            background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '5px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Wind size={16} color="#f87171" />
            <div>
              <div style={{ fontSize: '9px', color: '#fca5a5', textTransform: 'uppercase', fontWeight: '700' }}>
                Live Gale Gusts (AWS)
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                55 &ndash; 76 km/h
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '5px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Gauge size={16} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '9px', color: '#bae6fd', textTransform: 'uppercase', fontWeight: '700' }}>
                Central Barometric Pressure
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8' }}>
                991.2 hPa <span style={{ fontSize: '10px', fontWeight: 'normal', color: '#93c5fd' }}>(Deep Depression)</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(234, 88, 12, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.35)',
            borderRadius: '5px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Waves size={16} color="#fb923c" />
            <div>
              <div style={{ fontSize: '9px', color: '#fed7aa', textTransform: 'uppercase', fontWeight: '700' }}>
                Coastal Sea Swell
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fdba74' }}>
                3.5 &ndash; 4.5m <span style={{ fontSize: '10px', fontWeight: 'normal' }}>(Rough Sea)</span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.35)',
            borderRadius: '5px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} color="#34d399" />
            <div>
              <div style={{ fontSize: '9px', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: '700' }}>
                Preemptive Evacuation
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#34d399' }}>
                8,600 Citizens <span style={{ fontSize: '10px', fontWeight: 'normal' }}>(12 Hamlets)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
