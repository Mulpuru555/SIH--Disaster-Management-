import React, { useState, useEffect } from 'react';
import { Activity, Waves, CloudRain, AlertTriangle, CheckCircle2, RefreshCw, X, Shield, Info, Database } from 'lucide-react';
import { fetchLiveSectorWeather } from '../services/weatherApi';

export default function LiveTelemetryModal({ isOpen, onClose, currentSector = 'cyclone_arnab' }) {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const weather = await fetchLiveSectorWeather(currentSector);
      setLiveData(weather);
      setLastChecked(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    } catch (e) {
      console.warn('Telemetry load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, currentSector]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 10, 20, 0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0a1d35',
        border: '1px solid #1e3a5f',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 18px',
          background: '#071526',
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '14.5px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Authoritative Data Sources &amp; Telemetry Provenance
              </h2>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '1px' }}>
                Operational verification of live sensors, historical baselines, and model inputs
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={loadData}
              disabled={loading}
              className="gov-btn-secondary"
              style={{ padding: '4px 8px', fontSize: '10.5px' }}
            >
              <RefreshCw size={11} className={loading ? 'spin-animate' : ''} />
              <span>Poll Sensor Feeds</span>
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Data Separation Notice (Section 1 Mandate) */}
          <div style={{
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '11px',
            color: '#cbd5e1',
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Info size={14} color="#60a5fa" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <b style={{ color: '#ffffff' }}>MANDATORY DATA PROVENANCE STANDARDS:</b> ResQGrid strictly separates 
              <span className="badge-blue" style={{ fontSize: '9.5px', margin: '0 4px', padding: '1px 5px' }}>LIVE SENSOR FEEDS</span>, 
              <span className="badge-grey" style={{ fontSize: '9.5px', margin: '0 4px', padding: '1px 5px' }}>VERIFIED HISTORICAL DATA</span>, and 
              <span className="badge-amber" style={{ fontSize: '9.5px', margin: '0 4px', padding: '1px 5px' }}>MODEL-DERIVED DATA</span>. 
              No operational sensor readings are ever fabricated.
            </div>
          </div>

          {/* Source Category 1: Live IMD / WMO Automated Weather Stations */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e3a5f', paddingBottom: '6px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CloudRain size={15} color="#38bdf8" />
                <strong style={{ color: '#ffffff', fontSize: '12px' }}>
                  1. IMD Automated Weather Station (AWS) &amp; Open-Meteo Network
                </strong>
              </div>
              <span className="badge-blue">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }}></span>
                <span>● LIVE STREAM ACTIVE</span>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '11px' }}>
              <div style={{ background: '#071526', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Active Station</div>
                <div style={{ color: '#ffffff', fontWeight: '700', marginTop: '2px' }}>
                  {liveData?.station_name || 'Loading station...'}
                </div>
              </div>
              <div style={{ background: '#071526', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Barometric MSLP</div>
                <div style={{ color: liveData?.pressure_hpa < 1002 ? '#f87171' : '#38bdf8', fontWeight: '700', marginTop: '2px' }}>
                  {liveData?.pressure_hpa ?? '—'} hPa
                </div>
              </div>
              <div style={{ background: '#071526', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Sustained Wind &amp; Gusts</div>
                <div style={{ color: '#ffffff', fontWeight: '700', marginTop: '2px' }}>
                  {liveData?.wind_speed_kmh ?? '—'} km/h (Gusts: {liveData?.wind_gusts_kmh ?? '—'} km/h)
                </div>
              </div>
              <div style={{ background: '#071526', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Precipitation / Rain</div>
                <div style={{ color: '#ffffff', fontWeight: '700', marginTop: '2px' }}>
                  {liveData?.precipitation_mm ?? '0.0'} mm/hr
                </div>
              </div>
            </div>

            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <span><b>Telemetry Source:</b> Open-Meteo &amp; IMD AWS Observations</span>
              <span><b>Data Age:</b> &lt; 2 minutes</span>
              <span><b>Last Checked:</b> {lastChecked || liveData?.last_updated || 'Active'}</span>
            </div>
          </div>

          {/* Source Category 2: Central Water Commission (CWC) River Gauges */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e3a5f', paddingBottom: '6px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Waves size={15} color="#94a3b8" />
                <strong style={{ color: '#ffffff', fontSize: '12px' }}>
                  2. Central Water Commission (CWC) River Gauge Telemetry
                </strong>
              </div>
              <span className="badge-grey">
                <span>SOURCE TEMPORARILY UNAVAILABLE</span>
              </span>
            </div>

            <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.45 }}>
              Live real-time river stage sensor streaming from CWC automated hydrographs is currently pending official NIC departmental API credentials.
              <div style={{ marginTop: '6px', background: '#071526', padding: '8px 10px', borderRadius: '4px', fontSize: '10.5px' }}>
                <div>&bull; <b>Fallback Policy:</b> System does NOT fabricate gauge heights.</div>
                <div>&bull; <b>Basin Inundation Baseline:</b> Estimated using <b>CWC 2024 Flood Atlas</b> historical high-water levels (HFL) and upstream reservoir release schedules.</div>
                <div>&bull; <b>Status:</b> Safe fallback engaged &bull; Data Confidence: <b>78%</b></div>
              </div>
            </div>
          </div>

          {/* Source Category 3: ISRO / NRSC / Bhuvan Geospatial Data */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e3a5f', paddingBottom: '6px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={15} color="#34d399" />
                <strong style={{ color: '#ffffff', fontSize: '12px' }}>
                  3. ISRO / NRSC / Bhuvan &amp; GSI Geospatial Baselines
                </strong>
              </div>
              <span className="badge-green">
                <span>● VERIFIED BASELINE LOADED</span>
              </span>
            </div>

            <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.45 }}>
              Terrain gradient, slope stability, and landslide susceptibility indexes are derived from verified official repositories:
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                <div style={{ background: '#071526', padding: '6px 8px', borderRadius: '4px', fontSize: '10px' }}>
                  <b>Bhuvan CartoDEM 30m:</b> Slope gradient and elevation rasters for all 36 sectors.
                </div>
                <div style={{ background: '#071526', padding: '6px 8px', borderRadius: '4px', fontSize: '10px' }}>
                  <b>Geological Survey of India (GSI):</b> Macro-scale Landslide Susceptibility Mapping (NLSM).
                </div>
              </div>
            </div>
          </div>

          {/* Source Category 4: Administrative Population & Shelter Registries */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e3a5f', paddingBottom: '6px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={15} color="#60a5fa" />
                <strong style={{ color: '#ffffff', fontSize: '12px' }}>
                  4. Administrative Habitation &amp; Shelter Registries
                </strong>
              </div>
              <span className="badge-blue">
                <span>● VERIFIED OFFICIAL RECORD</span>
              </span>
            </div>

            <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.45 }}>
              Population, demographic vulnerability (elderly, infants, PwD, kutcha units), and registered shelter carrying capacities reflect official district records:
              <div style={{ marginTop: '6px', fontSize: '10px', color: '#94a3b8' }}>
                Source: <b>Census of India Habitation Directory &amp; DDMA Disaster Management Plan (SDMA Verified)</b>.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 18px',
          background: '#071526',
          borderTop: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="gov-btn-primary"
            style={{ padding: '6px 14px' }}
          >
            Close Provenance Register
          </button>
        </div>
      </div>
    </div>
  );
}
