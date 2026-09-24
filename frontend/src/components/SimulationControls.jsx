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

  const threatLevel = isCloudburst ? 'CRITICAL_RED' : isHeavyRain ? 'WARNING_ORANGE' : 'STABLE_GREEN';

  const handleSliderChange = (key, val) => {
    if (operationalMode === 'LIVE' && onModeChange) {
      onModeChange('SIMULATION');
    }
    onParamChange(key, val);
  };

  return (
    <div className="gov-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflowY: 'auto' }}>
      
      {/* 1. OPERATIONAL MODE SWITCHER */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4px',
        background: '#071526',
        padding: '3px',
        borderRadius: '4px',
        border: '1px solid #1e3a5f'
      }}>
        <button
          onClick={() => onModeChange && onModeChange('LIVE')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '6px 8px',
            borderRadius: '3px',
            border: 'none',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            background: operationalMode === 'LIVE' ? '#1d4ed8' : 'transparent',
            color: operationalMode === 'LIVE' ? '#ffffff' : '#94a3b8'
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: operationalMode === 'LIVE' ? '#38bdf8' : '#64748b'
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
            padding: '6px 8px',
            borderRadius: '3px',
            border: 'none',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            background: operationalMode === 'SIMULATION' ? '#b45309' : 'transparent',
            color: operationalMode === 'SIMULATION' ? '#ffffff' : '#94a3b8'
          }}
        >
          <Zap size={11} color={operationalMode === 'SIMULATION' ? '#fcd34d' : '#94a3b8'} />
          <span>⚡ What-If Sandbox</span>
        </button>
      </div>

      {/* 2. MODE STATUS BANNER */}
      {operationalMode === 'LIVE' ? (
        <div style={{
          background: 'rgba(37, 99, 235, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          borderRadius: '4px',
          padding: '6px 9px',
          fontSize: '10.5px',
          color: '#cbd5e1',
          lineHeight: 1.4,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px'
        }}>
          <Radio size={13} color="#60a5fa" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <b style={{ color: '#ffffff' }}>LIVE TELEMETRY STREAM:</b> Inputs locked to real-time IMD AWS observations ({liveWeather?.precipitation_mm ?? 0.0} mm/hr).
            <div style={{ color: '#94a3b8', fontSize: '9.5px', marginTop: '1px' }}>
              Switch to <b>What-If Sandbox</b> to evaluate hypothetical failure thresholds.
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(217, 119, 6, 0.10)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          borderRadius: '4px',
          padding: '7px 9px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10.5px', color: '#fcd34d', fontWeight: '800' }}>
              ⚠️ SIMULATION MODE — NOT FOR OPERATIONAL USE
            </span>
          </div>
          <div style={{ fontSize: '9.5px', color: '#cbd5e1', lineHeight: 1.35 }}>
            Synthetically adjusted parameters for stress-testing carrying capacity and detour routes.
          </div>
          <button
            onClick={() => onModeChange && onModeChange('LIVE')}
            className="gov-btn-secondary"
            style={{ fontSize: '10px', padding: '3px 6px', marginTop: '2px', justifyContent: 'center' }}
          >
            <RefreshCw size={10} />
            <span>Restore Real-Time Sensor Feeds</span>
          </button>
        </div>
      )}

      {/* 3. Live Weather Telemetry Summary Card */}
      <div style={{ background: '#071526', border: '1px solid #1e3a5f', borderRadius: '4px', padding: '8px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '15px' }}>{liveWeather?.condition_icon || '🌧️'}</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '11px', color: '#ffffff' }}>
                {liveWeather?.condition || 'Monsoon Telemetry'}
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                {liveWeather?.station_name || 'National AWS Network'}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '9px', color: '#93c5fd' }}>
            {liveWeather?.last_updated || 'Live'}
          </span>
        </div>

        {/* 6-Metric Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <div style={{ background: '#0a1d35', padding: '5px 7px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Thermometer size={12} color="#f59e0b" />
            <div>
              <div style={{ fontSize: '8px', color: '#94a3b8' }}>Temperature</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>
                {liveWeather?.temperature_c ?? 27.0}&deg;C
              </div>
            </div>
          </div>

          <div style={{ background: '#0a1d35', padding: '5px 7px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CloudRain size={12} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '8px', color: '#94a3b8' }}>Live Rainfall</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8' }}>
                {liveWeather?.precipitation_mm ?? 0.0} mm
              </div>
            </div>
          </div>

          <div style={{ background: '#0a1d35', padding: '5px 7px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wind size={12} color={liveWeather?.wind_gusts_kmh > 48 ? '#f87171' : '#4ade80'} />
            <div>
              <div style={{ fontSize: '8px', color: '#94a3b8' }}>Wind &amp; Gusts</div>
              <div style={{ fontSize: '10.5px', fontWeight: '700', color: liveWeather?.wind_gusts_kmh > 48 ? '#fca5a5' : '#86efac' }}>
                {liveWeather?.wind_speed_kmh ?? 15} km/h <span style={{ fontSize: '8.5px', color: '#cbd5e1' }}>({liveWeather?.wind_gusts_kmh ?? 25} g)</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#0a1d35', padding: '5px 7px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gauge size={12} color={liveWeather?.pressure_hpa < 1002 ? '#38bdf8' : '#cbd5e1'} />
            <div>
              <div style={{ fontSize: '8px', color: '#94a3b8' }}>MSLP Pressure</div>
              <div style={{ fontSize: '10.5px', fontWeight: '700', color: liveWeather?.pressure_hpa < 1002 ? '#38bdf8' : '#cbd5e1' }}>
                {liveWeather?.pressure_hpa ?? 1008} hPa
              </div>
            </div>
          </div>

          <div style={{ background: '#0a1d35', padding: '5px 7px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={12} color="#60a5fa" />
            <div>
              <div style={{ fontSize: '8px', color: '#94a3b8' }}>Rel. Humidity</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#60a5fa' }}>
                {liveWeather?.humidity_pct ?? 82}%
              </div>
            </div>
          </div>

          <div style={{ background: '#0a1d35', padding: '5px 7px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Waves size={12} color="#fb923c" />
            <div>
              <div style={{ fontSize: '8px', color: '#94a3b8' }}>Marine Swell</div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#fcd34d' }}>
                {liveWeather?.is_cyclone_alert ? '3.0 - 4.5m Rough' : '0.5 - 1.2m Calm'}
              </div>
            </div>
          </div>
        </div>

        {onDetectLocation && (
          <button
            onClick={onDetectLocation}
            className="gov-btn-secondary"
            style={{ width: '100%', marginTop: '6px', fontSize: '10px', padding: '4px', justifyContent: 'center' }}
            title="Read browser GPS coordinates and pull real-time local weather"
          >
            <MapPin size={11} color="#38bdf8" />
            <span>Detect My Real-Time Location Weather</span>
          </button>
        )}
      </div>

      {/* 4. Hazard Severity Status */}
      <div style={{
        background: threatLevel === 'CRITICAL_RED' ? 'var(--status-red-bg)' :
                    threatLevel === 'WARNING_ORANGE' ? 'var(--status-amber-bg)' : 'var(--status-green-bg)',
        border: threatLevel === 'CRITICAL_RED' ? '1px solid var(--status-red-border)' :
                threatLevel === 'WARNING_ORANGE' ? '1px solid var(--status-amber-border)' : '1px solid var(--status-green-border)',
        borderRadius: '4px',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <AlertTriangle size={13} color={threatLevel === 'CRITICAL_RED' ? '#f87171' : threatLevel === 'WARNING_ORANGE' ? '#fb923c' : '#4ade80'} />
          <span style={{
            fontSize: '10px',
            fontWeight: '700',
            color: threatLevel === 'CRITICAL_RED' ? '#fca5a5' : threatLevel === 'WARNING_ORANGE' ? '#fcd34d' : '#86efac'
          }}>
            {threatLevel === 'CRITICAL_RED' ? 'IMD RED ALERT THRESHOLD EXCEEDED' :
             threatLevel === 'WARNING_ORANGE' ? 'IMD ORANGE ALERT THRESHOLD' : `NORMAL BASELINE (${simParams.rainfall_mm_hr} mm/hr)`}
          </span>
        </div>
        <span style={{ fontSize: '9px', color: '#94a3b8' }}>
          {threatLevel === 'STABLE_GREEN' ? 'FS > 1.30 (Stable)' : 'FS < 1.15 (Unstable)'}
        </span>
      </div>

      {/* 5. Hydrological & Geotechnical Parameter Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
            Model Inputs:
          </span>
          {operationalMode === 'LIVE' && (
            <span style={{ fontSize: '9px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Lock size={9} /> Locked to AWS Feed
            </span>
          )}
        </div>

        {/* Precipitation Slider */}
        <div style={{ background: '#071526', padding: '6px 8px', borderRadius: '4px', border: '1px solid #163354' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', marginBottom: '2px' }}>
            <span style={{ color: '#cbd5e1' }}>Precipitation Rate:</span>
            <strong style={{ color: isCloudburst ? '#ef4444' : isHeavyRain ? '#f97316' : '#38bdf8' }}>
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
            style={{ width: '100%', accentColor: isCloudburst ? '#ef4444' : '#2563eb', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#64748b' }}>
            <span>0 mm</span>
            <span>Warning (65)</span>
            <span style={{ color: '#ef4444' }}>Cloudburst (&gt;115)</span>
          </div>
        </div>

        {/* Barrage Discharge */}
        <div style={{ background: '#071526', padding: '6px 8px', borderRadius: '4px', border: '1px solid #163354' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', marginBottom: '2px' }}>
            <span style={{ color: '#cbd5e1' }}>Spillway Outflow:</span>
            <strong style={{ color: isHighDischarge ? '#ef4444' : '#38bdf8' }}>
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
            style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
          />
        </div>

        {/* Soil Moisture */}
        <div style={{ background: '#071526', padding: '6px 8px', borderRadius: '4px', border: '1px solid #163354' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', marginBottom: '2px' }}>
            <span style={{ color: '#cbd5e1' }}>Soil Saturation:</span>
            <strong style={{ color: '#93c5fd' }}>
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
            style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* 6. Standard Simulation Scenarios (For Stress-Testing Only) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto', paddingTop: '4px' }}>
        <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
          Stress-Testing Scenarios (Simulation):
        </div>

        <button
          onClick={onTriggerExtremeCloudburst}
          className="gov-btn-danger"
          style={{ padding: '5px 8px', fontSize: '10px', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <AlertTriangle size={11} />
            <span>Extreme Cloudburst (165 mm/hr)</span>
          </div>
          <span style={{ fontSize: '8.5px', background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: '2px' }}>RED</span>
        </button>

        <button
          onClick={onTriggerOrangeAlert}
          style={{
            background: '#b45309',
            color: '#ffffff',
            border: '1px solid #f59e0b',
            borderRadius: '4px',
            padding: '5px 8px',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CloudRain size={11} />
            <span>Heavy Rain Warning (68 mm/hr)</span>
          </div>
          <span style={{ fontSize: '8.5px', background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: '2px' }}>ORANGE</span>
        </button>

        <button
          onClick={onTriggerBridgeWashout}
          className="gov-btn-secondary"
          style={{ padding: '5px 8px', fontSize: '10px', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Waves size={11} color="#f59e0b" />
            <span>Roadway / Bridge Cutoff Detour</span>
          </div>
          <span style={{ fontSize: '8.5px', color: '#f59e0b' }}>DETOUR</span>
        </button>

        <button
          onClick={onResetSimulation}
          className="gov-btn-secondary"
          style={{ padding: '5px 8px', fontSize: '10px', justifyContent: 'center', marginTop: '2px' }}
        >
          <RefreshCw size={10} />
          <span>Restore Live Sensor Readings</span>
        </button>
      </div>
    </div>
  );
}
