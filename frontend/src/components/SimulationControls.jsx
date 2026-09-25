import React from 'react';
import { Sliders, Radio, AlertTriangle, RefreshCw, Activity, Compass, Wind } from 'lucide-react';
import { OPERATIONAL_SECTORS } from '../services/localEngine';

export default function SimulationControls({
  simParams,
  onParamChange,
  onTriggerOrangeAlert,
  onTriggerExtremeCloudburst,
  onTriggerBridgeWashout,
  onResetSimulation,
  isExtreme,
  currentSector,
  liveWeather,
  operationalMode = 'LIVE',
  onModeChange,
  onDetectLocation
}) {
  const currentSectorObj = OPERATIONAL_SECTORS.find(s => s.id === currentSector);
  const isLive = operationalMode === 'LIVE';

  return (
    <div className="gov-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '800px', margin: '14px auto' }}>
      {/* 1. Header & Operational Mode Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
            National Disaster Response Force (NDRF) &bull; Operational Simulator
          </div>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
            Hydro-Meteorological Scenario Contingency Modeling
          </h2>
        </div>

        {/* Live vs Simulation Toggle */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
          <button
            onClick={() => onResetSimulation && onResetSimulation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '3px',
              border: 'none',
              background: isLive ? '#0b2545' : 'transparent',
              color: isLive ? '#ffffff' : '#475569',
              fontSize: '11px',
              fontWeight: isLive ? '700' : '500',
              cursor: 'pointer'
            }}
          >
            <Radio size={12} />
            <span>Live Telemetry</span>
          </button>
          <button
            onClick={() => onModeChange && onModeChange('SIMULATION')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '3px',
              border: 'none',
              background: !isLive ? '#b45309' : 'transparent',
              color: !isLive ? '#ffffff' : '#475569',
              fontSize: '11px',
              fontWeight: !isLive ? '700' : '500',
              cursor: 'pointer'
            }}
          >
            <Sliders size={12} />
            <span>What-If Sandbox</span>
          </button>
        </div>
      </div>

      {/* 2. LIVE TELEMETRY VIEW */}
      {isLive ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px', padding: '10px 12px', fontSize: '11.5px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#15803d" />
            <div>
              <strong>LIVE TELEMETRY STREAM ACTIVE:</strong> Inputs locked to real-time IMD AWS observations. Switch to What-If Sandbox to test hypothetical failure thresholds.
            </div>
          </div>

          {/* Current Live Weather Matrix */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12.5px' }}>
                {currentSectorObj?.label || 'Active Ground Sector'}
              </div>
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                Source: IMD AWS / Open-Meteo Verified
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Temperature</span>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  {liveWeather?.temperature_c ?? 28.5}&deg;C
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Precipitation Rate</span>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0b2545' }}>
                  {simParams.rainfall_mm_hr} mm/hr
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Sustained Wind</span>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  {liveWeather?.wind_speed_kmh ?? 24} km/h
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Atmospheric MSLP</span>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  {liveWeather?.pressure_hpa ?? 1008} hPa
                </div>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Relative Humidity</span>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  {liveWeather?.humidity_pct ?? 70}%
                </div>
              </div>
            </div>

            {onDetectLocation && (
              <button
                onClick={onDetectLocation}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0b2545',
                  padding: '6px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Compass size={13} />
                <span>Synchronize with My Real-Time Device GPS Location</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 3. WHAT-IF CONTINGENCY SANDBOX */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '4px', padding: '10px 12px', fontSize: '11.5px', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#c2410c" />
            <div>
              <strong>CONTINGENCY SIMULATION MODE:</strong> Parameters adjusted here simulate hypothetical disaster scenarios to evaluate threshold failures.
            </div>
          </div>

          {/* Quick Scenario Triggers */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={onTriggerOrangeAlert}
              style={{
                flex: 1,
                minWidth: '160px',
                background: '#fff7ed',
                border: '1px solid #fdba74',
                color: '#9a3412',
                padding: '6px 10px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ⚠️ Heavy Monsoonal Rain (68 mm/hr)
            </button>
            <button
              onClick={onTriggerExtremeCloudburst}
              style={{
                flex: 1,
                minWidth: '160px',
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: '6px 10px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🚨 Extreme Cloudburst (165 mm/hr)
            </button>
            <button
              onClick={onTriggerBridgeWashout}
              style={{
                flex: 1,
                minWidth: '160px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#334155',
                padding: '6px 10px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              🌉 Bridge Washout Detour
            </button>
          </div>

          {/* Interactive Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>Precipitation Rate (mm/hr):</span>
                <strong style={{ color: simParams.rainfall_mm_hr > 100 ? '#b91c1c' : '#0b2545' }}>{simParams.rainfall_mm_hr} mm/hr</strong>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={simParams.rainfall_mm_hr}
                onChange={e => onParamChange('rainfall_mm_hr', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#0b2545' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>Spillway Outflow (cusecs):</span>
                <strong style={{ color: '#0b2545' }}>{simParams.dam_discharge_cusecs.toLocaleString()} cusecs</strong>
              </div>
              <input
                type="range"
                min="1000"
                max="60000"
                step="1000"
                value={simParams.dam_discharge_cusecs}
                onChange={e => onParamChange('dam_discharge_cusecs', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#0b2545' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ fontWeight: '600', color: '#0f172a' }}>Catchment Soil Saturation:</span>
                <strong style={{ color: simParams.soil_saturation > 0.8 ? '#b91c1c' : '#0b2545' }}>{Math.round(simParams.soil_saturation * 100)}%</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={simParams.soil_saturation}
                onChange={e => onParamChange('soil_saturation', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#0b2545' }}
              />
            </div>

            <button
              onClick={onResetSimulation}
              className="gov-btn-secondary"
              style={{ alignSelf: 'flex-start', marginTop: '6px' }}
            >
              <RefreshCw size={12} />
              <span>Reset to Verified Live Sensor Telemetry</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
