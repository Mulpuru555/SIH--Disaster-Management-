import React, { useState } from 'react';
import { AlertTriangle, Crosshair, Radar, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function ActiveStormBanner({
  onSelectStormSector,
  onToggleRadar,
  isRadarActive,
  currentSector,
  liveWeather
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Auto-deactivation logic:
  // If the storm has passed (pressure >= 1002 hPa, gusts < 48 km/h) and user is not explicitly inspecting the storm sector,
  // the emergency banner automatically hides itself so the platform remains clean during normal weather.
  const isStormActive = liveWeather ? Boolean(liveWeather.is_cyclone_alert) : false;
  if (!isStormActive && currentSector !== 'cyclone_arnab') {
    return null;
  }

  if (isDismissed) {
    return (
      <div style={{ margin: '0 20px 6px 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setIsDismissed(false)}
          className="badge-red"
          style={{ cursor: 'pointer', padding: '3px 8px' }}
        >
          <span>🚨 Show Cyclone Advisory ({liveWeather?.pressure_hpa ?? 996.1} hPa &bull; {liveWeather?.wind_gusts_kmh ?? 56.9} km/h)</span>
        </button>
      </div>
    );
  }

  const isFocusingStorm = currentSector === 'cyclone_arnab';
  const stormName = liveWeather?.storm_name || 'Active Cyclonic System';
  const pressureVal = liveWeather?.pressure_hpa ?? 996.1;
  const gustsVal = liveWeather?.wind_gusts_kmh ?? 56.9;
  const windsVal = liveWeather?.wind_speed_kmh ?? 34.5;
  const seaCondition = liveWeather?.sea_condition || 'Rough to Very Rough (3.0m - 4.5m Wave Swell)';

  return (
    <div style={{
      margin: '0 20px 10px 20px',
      background: 'rgba(220, 38, 38, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      borderRadius: '4px',
      padding: '8px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      {/* Left: Hazard Advisory Description */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: '#dc2626',
          color: '#ffffff',
          borderRadius: '3px',
          padding: '3px 6px',
          fontSize: '10px',
          fontWeight: '800',
          letterSpacing: '0.4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <AlertTriangle size={12} />
          <span>IMD ADVISORY</span>
        </div>

        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
            {stormName} &bull; Landfall &amp; Coastal Surge Sector Active
          </div>
          <div style={{ fontSize: '10.5px', color: '#cbd5e1', marginTop: '1px' }}>
            Central MSLP: <b>{pressureVal} hPa</b> &bull; Sustained Wind: <b>{windsVal} km/h</b> (Gusts: <b>{gustsVal} km/h</b>) &bull; Sea State: {seaCondition}
          </div>
        </div>
      </div>

      {/* Right: Operational GIS Shortcuts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!isFocusingStorm && onSelectStormSector && (
          <button
            onClick={() => onSelectStormSector('cyclone_arnab')}
            style={{
              background: '#b91c1c',
              color: '#ffffff',
              border: '1px solid #ef4444',
              borderRadius: '3px',
              padding: '4px 9px',
              fontSize: '10.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Crosshair size={11} />
            <span>Focus Storm Sector</span>
          </button>
        )}

        <button
          onClick={onToggleRadar}
          style={{
            background: isRadarActive ? '#15803d' : '#0f2744',
            color: '#ffffff',
            border: isRadarActive ? '1px solid #22c55e' : '1px solid #1e3a5f',
            borderRadius: '3px',
            padding: '4px 9px',
            fontSize: '10.5px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Radar size={11} />
          <span>{isRadarActive ? 'Doppler Radar Active' : 'Enable Doppler Radar'}</span>
        </button>

        <button
          onClick={() => setIsDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Dismiss advisory"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
