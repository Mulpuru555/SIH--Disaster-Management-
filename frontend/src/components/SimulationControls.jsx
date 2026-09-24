import React from 'react';
import { CloudRain, Waves, Droplets, Zap, AlertTriangle, Radio, RefreshCw, Thermometer, Wind, Lock, Gauge, MapPin } from 'lucide-react';

export default function SimulationControls({
  simParams,
  onParamChange,
  onTriggerOrangeAlert,
  onTriggerExtremeCloudburst,
  onTriggerBridgeWashout,
  onResetSimulation,
  isExtreme,
  currentSector: _currentSector,
  liveWeather,
  operationalMode = 'LIVE',
  onModeChange,
  onDetectLocation
}) {
  const isCloudburst = simParams.rainfall_mm_hr >= 115;
  const isHeavyRain = simParams.rainfall_mm_hr >= 65;
  const isHighDischarge = simParams.dam_discharge_cusecs >= 30000;

  // Determine active threat level
  const threatLevel = isCloudburst ? 'CRITICAL_RED' : isHeavyRain ? 'WARNING_ORANGE' : 'STABLE_GREEN';

  const handleSliderChange = (key, val) => {
    if (operationalMode === 'LIVE' && onModeChange) {
      onModeChange('SIMULATION');
    }
    onParamChange(key, val);
  };

  return (
    <div className="gov-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '11px', height: '100%', overflowY: 'auto' }}>
      {/* 1. OPERATIONAL MODE SWITCHER (Live Telemetry vs What-If Sandbox) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4px',
        background: '#071526',
        padding: '3px',
        borderRadius: '6px',
        border: '1px solid #1e3a5f'
      }}>
        <button
          onClick={() => onModeChange && onModeChange('LIVE')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '7px 8px',
            borderRadius: '4px',
            border: 'none',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            background: operationalMode === 'LIVE' ? '#0284c7' : 'transparent',
            color: operationalMode === 'LIVE' ? '#ffffff' : '#94a3b8',
            boxShadow: operationalMode === 'LIVE' ? '0 2px 6px rgba(2, 132, 199, 0.4)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: operationalMode === 'LIVE' ? '#38bdf8' : '#64748b',
            boxShadow: operationalMode === 'LIVE' ? '0 0 6px #38bdf8' : 'none'
          }}></span>
          <span>🛰️ Live Telemetry</span>
        </button>

        <button
          onClick={() => onModeChange && onModeChange('SIMULATION')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '7px 8px',
            borderRadius: '4px',
            border: 'none',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            background: operationalMode === 'SIMULATION' ? '#ea580c' : 'transparent',
            color: operationalMode === 'SIMULATION' ? '#ffffff' : '#94a3b8',
            boxShadow: operationalMode === 'SIMULATION' ? '0 2px 6px rgba(234, 88, 12, 0.4)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Zap size={12} color={operationalMode === 'SIMULATION' ? '#fed7aa' : '#94a3b8'} />
          <span>⚡ What-If Sandbox</span>
        </button>
      </div>

      {/* 2. MODE STATUS BANNER */}
      {operationalMode === 'LIVE' ? (
        <div style={{
          background: 'rgba(2, 132, 199, 0.10)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '5px',
          padding: '6px 9px',
          fontSize: '10.5px',
          color: '#bae6fd',
          lineHeight: 1.4,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px'
        }}>
          <Radio size={13} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <b>REAL-TIME AWS SENSOR STREAM:</b> Parameters auto-synced with live IMD &amp; Open-Meteo telemetry ({liveWeather?.precipitation_mm ?? 0.0} mm/hr).
            <div style={{ color: '#7dd3fc', marginTop: '1px', fontSize: '9.5px' }}>
              Switch to <b>What-If Sandbox</b> to stress-test extreme flood/landslide scenarios.
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(180, 83, 9, 0.12))',
          border: '1px solid rgba(249, 115, 22, 0.5)',
          borderRadius: '6px',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#fed7aa', fontWeight: '800' }}>
              <Zap size={14} color="#f97316" />
              <span>WHAT-IF SANDBOX ACTIVE</span>
            </div>
            <span style={{ fontSize: '9px', background: 'rgba(249, 115, 22, 0.25)', color: '#fdba74', padding: '1px 5px', borderRadius: '3px', fontWeight: '700' }}>
              SIMULATION
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: 1.35 }}>
            Stress-testing carrying capacity and simulated detour rerouting.
          </div>
          <button
            onClick={() => onModeChange && onModeChange('LIVE')}
            style={{
              background: '#0d2847',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              padding: '5px 9px',
              borderRadius: '4px',
              fontSize: '10.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '2px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              transition: 'background 0.15s'
            }}
          >
            <RefreshCw size={12} />
            <span>Re-Sync Live Satellite Telemetry</span>
          </button>
        </div>
      )}

      {/* 3. Real-Time Live Weather Card (Open-Meteo & IMD Telemetry) */}
      <div style={{ background: '#0a1d35', border: '1px solid #1e3a5f', borderRadius: '6px', padding: '9px 11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>{liveWeather?.condition_icon || '🌧️'}</span>
            <div>
              <div style={{ fontWeight: '800', fontSize: '11.5px', color: '#ffffff' }}>
                {liveWeather?.condition || 'Monsoon Telemetry'}
              </div>
              <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>
                {liveWeather?.station_name || 'National AWS Network'}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '9px', color: '#60a5fa', fontFamily: 'monospace' }}>
            {liveWeather?.last_updated || 'Live Telemetry'}
          </span>
        </div>

        {/* Active Cyclone / Severe Weather Warning Callout */}
        {liveWeather?.is_cyclone_alert && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid #ef4444',
            borderRadius: '5px',
            padding: '6px 8px',
            marginBottom: '7px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px'
          }}>
            <span style={{ fontSize: '15px' }} className="spin-animate">🌀</span>
            <div style={{ fontSize: '10px', lineHeight: 1.35 }}>
              <strong style={{ color: '#ffffff', display: 'block' }}>
                {liveWeather.storm_name || 'Deep Depression / Cyclone Warning'}
              </strong>
              <span style={{ color: '#fca5a5' }}>
                Gale Gusts: <b>{liveWeather.wind_gusts_kmh ?? 55} km/h</b> &bull; Central Pressure: <b>{liveWeather.pressure_hpa} hPa</b>
              </span>
            </div>
          </div>
        )}

        {/* 6-Metric Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <div style={{ background: '#071526', padding: '5px 7px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Thermometer size={13} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>Temperature</div>
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#ffffff' }}>
                {liveWeather?.temperature_c ?? 28.5}&deg;C
              </div>
            </div>
          </div>

          <div style={{ background: '#071526', padding: '5px 7px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CloudRain size={13} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>Live Rainfall (AWS)</div>
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#38bdf8' }}>
                {liveWeather?.precipitation_mm ?? 0.0} mm
              </div>
            </div>
          </div>

          <div style={{ background: '#071526', padding: '5px 7px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wind size={13} color={(liveWeather?.wind_gusts_kmh > 45 ? '#f87171' : '#4ade80')} />
            <div>
              <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>Wind &amp; Gale Gusts</div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: (liveWeather?.wind_gusts_kmh > 45 ? '#fca5a5' : '#4ade80') }}>
                {liveWeather?.wind_speed_kmh ?? 12} km/h <span style={{ fontSize: '9px', color: '#cbd5e1' }}>({liveWeather?.wind_gusts_kmh ?? 25} g)</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#071526', padding: '5px 7px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={13} color={(liveWeather?.pressure_hpa < 1000 ? '#38bdf8' : '#cbd5e1')} />
            <div>
              <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>Barometric Pressure</div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: (liveWeather?.pressure_hpa < 1000 ? '#38bdf8' : '#cbd5e1') }}>
                {liveWeather?.pressure_hpa ?? 1008} hPa
              </div>
            </div>
          </div>

          <div style={{ background: '#071526', padding: '5px 7px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={13} color="#60a5fa" />
            <div>
              <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>Humidity</div>
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#60a5fa' }}>
                {liveWeather?.humidity_pct ?? 82}%
              </div>
            </div>
          </div>

          <div style={{ background: '#071526', padding: '5px 7px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Waves size={13} color="#fb923c" />
            <div>
              <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>Sea Swell / Wave</div>
              <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#fdba74' }}>
                {liveWeather?.is_cyclone_alert ? '3.5 - 4.5m Rough' : '0.5 - 1.2m Calm'}
              </div>
            </div>
          </div>
        </div>

        {/* Detect User's Real Device Location Weather Button */}
        {onDetectLocation && (
          <button
            onClick={onDetectLocation}
            style={{
              width: '100%',
              marginTop: '7px',
              background: '#071526',
              border: '1px solid #1e40af',
              color: '#38bdf8',
              padding: '5px 8px',
              borderRadius: '4px',
              fontSize: '10.5px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'all 0.15s'
            }}
          >
            <MapPin size={12} color="#38bdf8" />
            <span>Detect My Real-Time Location Weather</span>
          </button>
        )}
      </div>

      {/* 4. Current Hazard Severity Indicator */}
      <div style={{
        background: threatLevel === 'CRITICAL_RED' ? 'rgba(220, 38, 38, 0.15)' :
                    threatLevel === 'WARNING_ORANGE' ? 'rgba(234, 88, 12, 0.15)' : 'rgba(21, 128, 61, 0.15)',
        border: threatLevel === 'CRITICAL_RED' ? '1px solid #ef4444' :
                threatLevel === 'WARNING_ORANGE' ? '1px solid #f97316' : '1px solid #22c55e',
        borderRadius: '5px',
        padding: '7px 9px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={14} color={threatLevel === 'CRITICAL_RED' ? '#f87171' : threatLevel === 'WARNING_ORANGE' ? '#fb923c' : '#4ade80'} />
          <span style={{
            fontSize: '10.5px',
            fontWeight: '800',
            color: threatLevel === 'CRITICAL_RED' ? '#fecaca' : threatLevel === 'WARNING_ORANGE' ? '#fed7aa' : '#bbf7d0'
          }}>
            {threatLevel === 'CRITICAL_RED' ? '🚨 IMD RED ALERT: CLOUDBURST' :
             threatLevel === 'WARNING_ORANGE' ? '⚠️ ORANGE ALERT: HEAVY RAIN' : `✅ NORMAL BASELINE (${simParams.rainfall_mm_hr} mm/hr)`}
          </span>
        </div>
        <span style={{ fontSize: '9.5px', fontWeight: 'bold', color: '#94a3b8' }}>
          {threatLevel === 'STABLE_GREEN' ? 'FS > 1.8 (Stable)' : 'FS < 1.25 (Action)'}
        </span>
      </div>

      {/* 5. Multi-Hazard Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
            Hydrological &amp; Terrain Inputs:
          </span>
          {operationalMode === 'LIVE' && (
            <span style={{ fontSize: '9px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Lock size={9} /> Synced with AWS
            </span>
          )}
        </div>

        {/* Slider 1: Rainfall Rate */}
        <div style={{ background: '#0a1d35', padding: '7px 9px', borderRadius: '5px', border: '1px solid #163354' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '2px' }}>
            <span style={{ color: '#cbd5e1', fontWeight: '600' }}>Precipitation Rate:</span>
            <strong style={{
              color: isCloudburst ? '#ef4444' : isHeavyRain ? '#f97316' : '#38bdf8',
              fontSize: '11.5px'
            }}>
              {simParams.rainfall_mm_hr} mm/hr
            </strong>
          </div>
          <input
            type="range"
            min="0"
            max="220"
            step="1"
            value={simParams.rainfall_mm_hr}
            onChange={(e) => handleSliderChange('rainfall_mm_hr', Number(e.target.value))}
            style={{ width: '100%', accentColor: isCloudburst ? '#ef4444' : '#38bdf8', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', color: '#64748b', marginTop: '1px' }}>
            <span>0 mm (Dry)</span>
            <span>Warning (65)</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Cloudburst (&gt;115)</span>
          </div>
        </div>

        {/* Slider 2: Dam Discharge */}
        <div style={{ background: '#0a1d35', padding: '7px 9px', borderRadius: '5px', border: '1px solid #163354' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '2px' }}>
            <span style={{ color: '#cbd5e1', fontWeight: '600' }}>Barrage / Spillway Outflow:</span>
            <strong style={{ color: isHighDischarge ? '#ef4444' : '#06b6d4', fontSize: '11.5px' }}>
              {simParams.dam_discharge_cusecs.toLocaleString()} cusecs
            </strong>
          </div>
          <input
            type="range"
            min="2000"
            max="50000"
            step="1000"
            value={simParams.dam_discharge_cusecs}
            onChange={(e) => handleSliderChange('dam_discharge_cusecs', Number(e.target.value))}
            style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
          />
        </div>

        {/* Slider 3: Soil Moisture */}
        <div style={{ background: '#0a1d35', padding: '7px 9px', borderRadius: '5px', border: '1px solid #163354' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '2px' }}>
            <span style={{ color: '#cbd5e1', fontWeight: '600' }}>Soil Moisture Saturation:</span>
            <strong style={{ color: '#60a5fa', fontSize: '11.5px' }}>
              {Math.round(simParams.soil_saturation * 100)}%
            </strong>
          </div>
          <input
            type="range"
            min="0.10"
            max="1.0"
            step="0.05"
            value={simParams.soil_saturation}
            onChange={(e) => handleSliderChange('soil_saturation', Number(e.target.value))}
            style={{ width: '100%', accentColor: '#60a5fa', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* 6. One-Click Hackathon Presets for Demonstrations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: 'auto', paddingTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚡ 1-Click Disaster Scenarios:
          </span>
          <span style={{ fontSize: '9px', color: '#60a5fa' }}>Demonstration Modes</span>
        </div>

        {/* Preset 1: Extreme Cloudburst Red Alert */}
        <button
          onClick={onTriggerExtremeCloudburst}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            background: isExtreme ? '#b91c1c' : '#dc2626',
            color: 'white',
            border: 'none',
            padding: '6px 9px',
            borderRadius: '5px',
            fontSize: '10.5px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={13} />
            <span>1. Extreme Cloudburst (165 mm/hr)</span>
          </div>
          <span style={{ fontSize: '8.5px', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '3px' }}>RED ALERT</span>
        </button>

        {/* Preset 2: Orange Warning Alert */}
        <button
          onClick={onTriggerOrangeAlert}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            background: '#ea580c',
            color: 'white',
            border: 'none',
            padding: '6px 9px',
            borderRadius: '5px',
            fontSize: '10.5px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CloudRain size={13} />
            <span>2. Heavy Rain Warning (68 mm/hr)</span>
          </div>
          <span style={{ fontSize: '8.5px', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '3px' }}>ORANGE</span>
        </button>

        {/* Preset 3: Bridge Washout Roadblock Detour */}
        <button
          onClick={onTriggerBridgeWashout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            background: '#0d2847',
            color: '#fbbf24',
            border: '1px solid #d97706',
            padding: '6px 9px',
            borderRadius: '5px',
            fontSize: '10.5px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Waves size={12} color="#fbbf24" />
            <span>3. Bridge Washout (Highway Detour)</span>
          </div>
          <span style={{ fontSize: '8.5px', color: '#f59e0b' }}>REROUTE</span>
        </button>

        {/* Preset 4: Reset to Live Satellite Baseline */}
        <button
          onClick={onResetSimulation}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            background: '#0a1d35',
            color: '#93c5fd',
            border: '1px solid #1e3a5f',
            padding: '6px 9px',
            borderRadius: '5px',
            fontSize: '10.5px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <RefreshCw size={11} />
          <span>Reset to Live Satellite Readings</span>
        </button>
      </div>
    </div>
  );
}
