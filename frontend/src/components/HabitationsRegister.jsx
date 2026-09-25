import React, { useState } from 'react';
import { Search, AlertTriangle, ShieldCheck, Download, FileText } from 'lucide-react';

export default function HabitationsRegister({ habitations, onSelectHabitation }) {
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
    <div style={{ margin: '14px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Official Section Title & Controls Bar */}
      <div className="gov-card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              District Disaster Management Authority (DDMA) &bull; Master Vulnerability Register
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              Habitations Multi-Hazard Risk &amp; Geotechnical Safety Register
            </h2>
            <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
              Statutory identification of habitations unsuitable for permanent habitation based on CartoDEM 30m Slope, Factor of Safety (Limit Equilibrium), live IMD AWS observations, and 20-Year Disaster History.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => window.print()}
              className="gov-btn-primary"
            >
              <Download size={13} />
              <span>Export DDMA Register (PDF)</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid #e2e8f0'
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '5px 10px',
            width: '280px',
            gap: '6px'
          }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search habitation name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                fontSize: '11.5px',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          {/* Zone Filter Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Filter Hazard Zone:</span>
            {[
              { id: 'ALL', label: `All (${habitations.length})`, bg: '#0b2545', text: '#ffffff' },
              { id: 'RED', label: `Red Zone (${redCount})`, bg: '#b91c1c', text: '#ffffff' },
              { id: 'ORANGE', label: `Orange Zone (${orangeCount})`, bg: '#c2410c', text: '#ffffff' },
              { id: 'GREEN', label: `Green Zone (${greenCount})`, bg: '#15803d', text: '#ffffff' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setZoneFilter(f.id)}
                style={{
                  padding: '4px 9px',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '3px',
                  border: zoneFilter === f.id ? `1px solid ${f.bg}` : '1px solid #cbd5e1',
                  background: zoneFilter === f.id ? f.bg : '#ffffff',
                  color: zoneFilter === f.id ? f.text : '#475569',
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
              <th>Census Population</th>
              <th>Slope &amp; Elevation</th>
              <th>Factor of Safety (FS)</th>
              <th>Historical Recurrence</th>
              <th>Hazard Classification</th>
              <th>Housing Structure</th>
              <th>Relocation Directive</th>
              <th style={{ textAlign: 'center' }}>Vulnerability Dossier</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(h => {
              const isRed = h.zone === 'RED';
              const isOrange = h.zone === 'ORANGE';

              return (
                <tr key={h.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12px' }}>{h.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>HAB-{h.id} &bull; {h.lat.toFixed(4)}°N, {h.lng.toFixed(4)}°E</div>
                  </td>

                  <td>
                    <span style={{ color: '#334155', fontSize: '11.5px' }}>
                      {h.taluk || (
                        h.id === 'H1' || h.id === 'H2' || h.id === 'H3' ? 'Meppadi / Vythiri' :
                        h.id === 'H4' || h.id === 'H5' ? 'Vythiri Central' :
                        h.id === 'H6' ? 'Kalpetta Municipality' :
                        (h.district ? `${h.district.split('&')[0].trim()} Sub-Division` : `${h.name.split(' ')[0]} Sub-Division`)
                      )}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{h.population.toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {h.elderly_count} elderly &bull; {h.infant_count} infants &bull; {h.pwd_count} PwD
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: h.slope_degrees > 30 ? '#b91c1c' : '#334155' }}>
                      {h.slope_degrees.toFixed(1)}° Gradient
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{h.elevation_m}m MSL</div>
                  </td>

                  <td>
                    <div style={{
                      fontWeight: '800',
                      color: h.factor_of_safety < 1.15 ? '#b91c1c' : h.factor_of_safety < 1.5 ? '#c2410c' : '#15803d'
                    }}>
                      {h.factor_of_safety.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#64748b' }}>
                      {h.factor_of_safety < 1.25 ? 'Unstable Slope' : 'Slope Stable'}
                    </div>
                  </td>

                  <td>
                    <div style={{ color: h.historical_disaster_count >= 4 ? '#b91c1c' : '#334155', fontWeight: '600' }}>
                      {h.historical_disaster_count} Events
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#64748b' }}>Past 20 Years</div>
                  </td>

                  <td>
                    {isRed && (
                      <span className="badge-red">
                        <AlertTriangle size={11} /> RED ZONE
                      </span>
                    )}
                    {isOrange && (
                      <span className="badge-amber">
                        ORANGE ALERT
                      </span>
                    )}
                    {!isRed && !isOrange && (
                      <span className="badge-green">
                        <ShieldCheck size={11} /> SAFE GREEN
                      </span>
                    )}
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#334155' }}>
                      {h.kutcha_houses} Kutcha Units
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#64748b' }}>
                      {Math.round((h.kutcha_houses / Math.max(1, h.population)) * 100)}% Vulnerable
                    </div>
                  </td>

                  <td>
                    {isRed ? (
                      <div style={{ color: '#b91c1c', fontWeight: '700', fontSize: '11px' }}>
                        🚨 Immediate Preemptive Relocation (0-48h)
                      </div>
                    ) : isOrange ? (
                      <div style={{ color: '#c2410c', fontWeight: '600', fontSize: '11px' }}>
                        ⚠️ Pre-Monsoon Evacuation Standby
                      </div>
                    ) : (
                      <div style={{ color: '#15803d', fontWeight: '600', fontSize: '11px' }}>
                        ✅ Safe In-Situ (Continuous Surveillance)
                      </div>
                    )}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => onSelectHabitation(h)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: '#0b2545',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      title="Inspect physical hazard rationale and demographic profile"
                    >
                      <FileText size={11} />
                      <span>Dossier</span>
                    </button>
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
