import React, { useState, useEffect } from 'react';
import { 
  Activity, Waves, CloudRain, AlertTriangle, CheckCircle2, 
  ArrowUpRight, ArrowDownRight, RefreshCw, X, Shield 
} from 'lucide-react';
import { fetchCWCGauges, fetchIMDRainfall } from '../services/api';

export default function LiveTelemetryModal({ isOpen, onClose }) {
  const [cwcGauges, setCwcGauges] = useState([]);
  const [imdReadings, setImdReadings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTelemetry();
    }
  }, [isOpen]);

  const loadTelemetry = async () => {
    setLoading(true);
    try {
      const [cwc, imd] = await Promise.all([fetchCWCGauges(), fetchIMDRainfall()]);
      if (cwc) setCwcGauges(cwc);
      if (imd) setImdReadings(imd);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 10, 20, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#07192f',
        border: '1px solid #1e40af',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '840px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          background: 'linear-gradient(135deg, #091e3a, #0b2952)',
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Live Hydro-Meteorological Sensor Telemetry
              </h2>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Central Water Commission (CWC) River Gauges &bull; India Meteorological Department (IMD) AWS Feeds
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={loadTelemetry}
              disabled={loading}
              style={{
                background: '#132e50',
                border: '1px solid #1e40af',
                color: '#93c5fd',
                padding: '6px 12px',
                borderRadius: '5px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RefreshCw size={12} className={loading ? 'spin-animate' : ''} />
              <span>Refresh Feeds</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CWC Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Waves size={16} color="#38bdf8" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc', textTransform: 'uppercase' }}>
                Central Water Commission (CWC) River Gauges
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '12px' }}>
              {cwcGauges.map((g, idx) => {
                const isDanger = g.current_water_level_m >= g.danger_level_m;
                const isWarning = g.current_water_level_m >= g.warning_level_m;
                const statusColor = isDanger ? '#ef4444' : (isWarning ? '#f59e0b' : '#22c55e');

                return (
                  <div key={idx} style={{
                    background: '#091c33',
                    border: `1px solid ${isDanger ? '#ef4444' : '#1e3a5f'}`,
                    borderRadius: '8px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{g.station_name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{g.river_basin} &bull; `{g.station_id}`</div>
                      </div>
                      <span style={{
                        fontSize: '10px',
                        background: `${statusColor}22`,
                        color: statusColor,
                        border: `1px solid ${statusColor}55`,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        {g.flood_status || (isDanger ? 'DANGER' : (isWarning ? 'WARNING' : 'NORMAL'))}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#061324', padding: '10px', borderRadius: '5px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Current Water Level:</div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: statusColor }}>
                          {g.current_water_level_m} m
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Danger Mark / HFL:</div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>
                          {g.danger_level_m}m / {g.high_flood_level_m}m
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                      <span>Discharge: <b>{Number(g.discharge_cusecs || 15000).toLocaleString()} cusecs</b></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: g.trend === 'RISING' ? '#f87171' : '#4ade80' }}>
                        {g.trend === 'RISING' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        Trend: {g.trend || 'STEADY'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* IMD Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CloudRain size={16} color="#60a5fa" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc', textTransform: 'uppercase' }}>
                India Meteorological Department (IMD) Radar & AWS
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '12px' }}>
              {imdReadings.map((r, idx) => {
                const alertColor = r.alert_level === 'RED' ? '#ef4444' : (r.alert_level === 'ORANGE' ? '#f97316' : '#22c55e');

                return (
                  <div key={idx} style={{
                    background: '#091c33',
                    border: `1px solid ${r.alert_level === 'RED' ? '#ef4444' : '#1e3a5f'}`,
                    borderRadius: '8px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{r.station_name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Station Code: `{r.station_id}`</div>
                      </div>
                      <span style={{
                        fontSize: '10px',
                        background: `${alertColor}22`,
                        color: alertColor,
                        border: `1px solid ${alertColor}55`,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        {r.alert_level} ALERT
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#061324', padding: '10px', borderRadius: '5px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Hourly Intensity:</div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: alertColor }}>
                          {r.rainfall_last_hour_mm} mm/hr
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>24h Cumulative:</div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#cbd5e1' }}>
                          {r.rainfall_cumulative_24h_mm} mm
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '4px' }}>
                      "{r.forecast_nowcast_text}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px',
          background: '#051324',
          borderTop: '1px solid #163354',
          fontSize: '11px',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>CWC Hydrograph & IMD AWS Ingestion Pipeline Active</span>
          <span>Automatic Hazard Trigger Threshold: Rain &gt; 45 mm/hr | River &gt; Danger Mark</span>
        </div>
      </div>
    </div>
  );
}
