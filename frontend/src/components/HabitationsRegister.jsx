import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, Download, Eye, Mountain } from 'lucide-react';

export default function HabitationsRegister({ habitations, onSelectHabitation, onOpen3DInspector }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');

  const filtered = habitations.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          h.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === 'ALL' || h.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const redCount = habitations.filter(h => h.zone === 'RED').length;
  const orangeCount = habitations.filter(h => h.zone === 'ORANGE').length;
  const greenCount = habitations.filter(h => h.zone === 'GREEN').length;

  return (
    <div style={{ margin: '0 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Official Section Title & Controls Bar */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>
              District Disaster Management Authority (DDMA) &bull; Master Vulnerability Register
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
              Habitations Multi-Hazard Risk &amp; Geotechnical Safety Register
            </h2>
            <p style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>
              Standardized classification based on DEM 12.5m Slope, Factor of Safety (Limit Equilibrium), IMD AWS real-time rainfall, and 20-Year Disaster Recurrence.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1e3a5f',
                color: '#f8fafc',
                border: '1px solid #3b82f6',
                padding: '7px 12px',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Download size={14} color="#38bdf8" />
              <span>Export DDMA Report</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #1e3a5f'
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#071526',
            border: '1px solid #1e3a5f',
            borderRadius: '5px',
            padding: '6px 12px',
            width: '320px',
            gap: '8px'
          }}>
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search habitation name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          {/* Zone Filter Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Filter Hazard Zone:</span>
            {[
              { id: 'ALL', label: `All Habitations (${habitations.length})`, bg: '#1e3a5f', text: '#ffffff' },
              { id: 'RED', label: `🚨 Red Zone (${redCount})`, bg: '#dc2626', text: '#ffffff' },
              { id: 'ORANGE', label: `⚠️ Orange Zone (${orangeCount})`, bg: '#ea580c', text: '#ffffff' },
              { id: 'GREEN', label: `✅ Green Zone (${greenCount})`, bg: '#15803d', text: '#ffffff' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setZoneFilter(f.id)}
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  border: zoneFilter === f.id ? `1px solid #60a5fa` : '1px solid transparent',
                  background: zoneFilter === f.id ? f.bg : '#0a1d35',
                  color: zoneFilter === f.id ? f.text : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Official Master Table */}
      <div className="gov-card" style={{ overflowX: 'auto' }}>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Habitation ID &amp; Name</th>
              <th>Taluk / Sub-Division</th>
              <th>Population</th>
              <th>Slope &amp; Elevation</th>
              <th>Factor of Safety (FS)</th>
              <th>Historical Recurrence</th>
              <th>Hazard Score</th>
              <th>Hazard Zone</th>
              <th>SoVI Vulnerability</th>
              <th>Action Directive</th>
              <th style={{ textAlign: 'center' }}>XAI Audit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => {
              const isRed = h.zone === 'RED';
              const isOrange = h.zone === 'ORANGE';

              return (
                <tr key={h.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '12.5px' }}>{h.name}</div>
                    <div style={{ fontSize: '10.5px', color: '#60a5fa', fontFamily: 'monospace' }}>HAB-{h.id} &bull; {h.lat.toFixed(4)}°N, {h.lng.toFixed(4)}°E</div>
                  </td>

                  <td>
                    <span style={{ color: '#cbd5e1', fontSize: '11.5px' }}>
                      {h.taluk || (
                        h.id === 'H1' || h.id === 'H2' || h.id === 'H3' ? 'Meppadi / Vythiri' :
                        h.id === 'H4' || h.id === 'H5' ? 'Vythiri Central' :
                        h.id === 'H6' ? 'Kalpetta Municipality' :
                        (h.district ? `${h.district.split('&')[0].trim()} Sub-Division` : `${h.name.split(' ')[0]} Sub-Division`)
                      )}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: '700', color: '#ffffff' }}>{h.population.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {h.elderly_count} elderly &bull; {h.infant_count} infants &bull; {h.pwd_count} PwD
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: h.slope_degrees > 30 ? '#f87171' : '#e2e8f0' }}>
                      {h.slope_degrees.toFixed(1)}° Gradient
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{h.elevation_m}m MSL</div>
                  </td>

                  <td>
                    <div style={{
                      fontWeight: '800',
                      fontFamily: 'monospace',
                      color: h.factor_of_safety < 1.15 ? '#ef4444' : h.factor_of_safety < 1.5 ? '#f59e0b' : '#22c55e'
                    }}>
                      {h.factor_of_safety.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>
                      {h.factor_of_safety < 1.25 ? 'Unstable Slope' : 'Slope Stable'}
                    </div>
                  </td>

                  <td>
                    <div style={{ color: h.historical_disaster_count >= 4 ? '#f87171' : '#cbd5e1', fontWeight: '600' }}>
                      {h.historical_disaster_count} Events
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Past 20 Years</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '700', color: '#ffffff' }}>
                      {(h.hazard_score * 100).toFixed(0)} / 100
                    </div>
                    <div style={{ width: '60px', height: '4px', background: '#1e3a5f', borderRadius: '2px', marginTop: '3px' }}>
                      <div style={{
                        width: `${Math.min(100, h.hazard_score * 100)}%`,
                        height: '100%',
                        background: isRed ? '#ef4444' : isOrange ? '#f97316' : '#22c55e',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </td>

                  <td>
                    {isRed && (
                      <span className="badge-red">
                        <AlertTriangle size={12} /> RED ZONE
                      </span>
                    )}
                    {isOrange && (
                      <span className="badge-orange">
                        ⚠️ ORANGE
                      </span>
                    )}
                    {!isRed && !isOrange && (
                      <span className="badge-green">
                        <ShieldCheck size={12} /> SAFE GREEN
                      </span>
                    )}
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#e2e8f0' }}>
                      {(h.sovi_score * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>{h.kutcha_houses} Kutcha Units</div>
                  </td>

                  <td>
                    {isRed ? (
                      <div style={{ color: '#f87171', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🚨 Immediate Preemptive Relocation (0-48h)
                      </div>
                    ) : isOrange ? (
                      <div style={{ color: '#fb923c', fontWeight: '600', fontSize: '11px' }}>
                        ⏳ Pre-Monsoon Evacuation Standby
                      </div>
                    ) : (
                      <div style={{ color: '#4ade80', fontWeight: '600', fontSize: '11px' }}>
                        ✅ In-Situ Continuous AWS Monitoring
                      </div>
                    )}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <button
                        onClick={() => onSelectHabitation(h)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: '#0d2847',
                          border: '1px solid #3b82f6',
                          color: '#60a5fa',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                        title="View SHAP Explainable AI Rationale"
                      >
                        <Eye size={12} />
                        <span>SHAP</span>
                      </button>
                      {onOpen3DInspector && (
                        <button
                          onClick={() => onOpen3DInspector(h)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#064e3b',
                            border: '1px solid #10b981',
                            color: '#a7f3d0',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                          title="Inspect in 3D Digital Elevation & Inundation Model"
                        >
                          <Mountain size={12} />
                          <span>3D DEM</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
