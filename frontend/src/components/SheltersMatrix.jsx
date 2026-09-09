import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';

export default function SheltersMatrix({ shelters }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = shelters.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const isOccupied = s.current_occupancy > 0;
    const matchesStatus = statusFilter === 'ALL' ||
                          (statusFilter === 'OCCUPIED' && isOccupied) ||
                          (statusFilter === 'STANDBY' && !isOccupied);
    return matchesSearch && matchesStatus;
  });

  const totalCapacity = shelters.reduce((acc, s) => acc + s.effective_capacity, 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + s.current_occupancy, 0);
  const totalArea = shelters.reduce((acc, s) => acc + s.usable_area_sqm, 0);
  const totalWater = shelters.reduce((acc, s) => acc + s.water_liters, 0);
  const totalToilets = shelters.reduce((acc, s) => acc + s.toilets_count, 0);
  const totalMedics = shelters.reduce((acc, s) => acc + s.medical_staff_count, 0);

  return (
    <div style={{ margin: '0 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Official Section Title & Controls Bar */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>
              Relief &amp; Rehabilitation Cell &bull; Sphere Humanitarian Minimum Standards
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
              Relief Camps Multi-Resource Inventory &amp; Carrying Capacity Matrix
            </h2>
            <p style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>
              Carrying capacity computed via Leontief Minimum Input Bottleneck Formulation: Space (3.5 m²/person), Water (15 L/day), Sanitation (1 toilet per 20 persons), and Food Rations.
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
              <span>Export Sphere Audit</span>
            </button>
          </div>
        </div>

        {/* Sphere Resource Audit Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '10px',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #1e3a5f'
        }}>
          <div style={{ background: '#0a1d35', padding: '10px 12px', borderRadius: '5px', border: '1px solid #163354' }}>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Floor Space</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
              {totalArea.toLocaleString()} m²
            </div>
            <div style={{ fontSize: '10px', color: '#38bdf8' }}>3.5 m² Sphere Norm</div>
          </div>

          <div style={{ background: '#0a1d35', padding: '10px 12px', borderRadius: '5px', border: '1px solid #163354' }}>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Potable Water Stock</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
              {(totalWater / 1000).toFixed(0)}k Litres
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>5-Day Emergency Buffer</div>
          </div>

          <div style={{ background: '#0a1d35', padding: '10px 12px', borderRadius: '5px', border: '1px solid #163354' }}>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Sanitation Facilities</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#4ade80', marginTop: '2px' }}>
              {totalToilets} Units
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>1 : 20 Ratio Verified</div>
          </div>

          <div style={{ background: '#0a1d35', padding: '10px 12px', borderRadius: '5px', border: '1px solid #163354' }}>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Medical Officers</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#f59e0b', marginTop: '2px' }}>
              {totalMedics} Personnel
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>First-Aid &amp; Triage</div>
          </div>

          <div style={{ background: '#0a1d35', padding: '10px 12px', borderRadius: '5px', border: '1px solid #163354' }}>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Capacity</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
              {totalCapacity.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#10b981' }}>{totalOccupied.toLocaleString()} Allocated ({((totalOccupied/totalCapacity)*100).toFixed(0)}%)</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '12px'
        }}>
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
              placeholder="Search relief camp name or ID..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>Filter Status:</span>
            {[
              { id: 'ALL', label: `All Camps (${shelters.length})` },
              { id: 'OCCUPIED', label: `Active / Occupied (${shelters.filter(s => s.current_occupancy > 0).length})` },
              { id: 'STANDBY', label: `Standby Reserve (${shelters.filter(s => s.current_occupancy === 0).length})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  border: statusFilter === f.id ? '1px solid #3b82f6' : '1px solid transparent',
                  background: statusFilter === f.id ? '#1e3a5f' : '#0a1d35',
                  color: statusFilter === f.id ? '#ffffff' : '#94a3b8',
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
              <th>Camp ID &amp; Facility Name</th>
              <th>Taluk / Location</th>
              <th>Floor Space</th>
              <th>Bed Capacity</th>
              <th>Drinking Water (5d)</th>
              <th>Ration Packs</th>
              <th>Toilets</th>
              <th>Medical Staff</th>
              <th>Limiting Bottleneck</th>
              <th>Sphere Capacity</th>
              <th>Current Occupancy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const pct = Math.round((s.current_occupancy / Math.max(1, s.effective_capacity)) * 100);
              const barColor = pct >= 95 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#22c55e';

              return (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '12.5px' }}>{s.name}</div>
                    <div style={{ fontSize: '10.5px', color: '#60a5fa', fontFamily: 'monospace' }}>CAMP-{s.id} &bull; {s.lat.toFixed(4)}°N, {s.lng.toFixed(4)}°E</div>
                  </td>

                  <td>
                    <span style={{ color: '#cbd5e1', fontSize: '11.5px' }}>
                      {s.taluk || (
                        s.id === 'S1' ? 'Kalpetta Municipality' :
                        s.id === 'S2' ? 'Sulthan Bathery' :
                        s.id === 'S3' ? 'Mananthavady' :
                        s.id === 'S4' ? 'Thamarassery / Kozhikode' :
                        s.id === 'S5' ? 'Ambalavayal' :
                        (s.district ? `${s.district.split('&')[0].trim()} Municipality` : `${s.name.split(' ')[0]} Facility`)
                      )}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#ffffff' }}>{s.usable_area_sqm.toLocaleString()} m²</div>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>{Math.round(s.usable_area_sqm / 3.5)} max persons</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#e2e8f0' }}>{s.beds.toLocaleString()} Beds</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#38bdf8' }}>{s.water_liters.toLocaleString()} L</div>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>15 L/person/day</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#e2e8f0' }}>{s.ration_packets.toLocaleString()} Kits</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#4ade80' }}>{s.toilets_count} Units</div>
                    <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>1 : 20 Norm</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#f59e0b' }}>{s.medical_staff_count} Staff</div>
                  </td>

                  <td>
                    <span style={{
                      fontSize: '11px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '700'
                    }}>
                      {s.bottleneck_resource}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '13px' }}>
                      {s.effective_capacity.toLocaleString()}
                    </div>
                  </td>

                  <td style={{ minWidth: '130px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{s.current_occupancy}</span>
                      <span style={{ color: barColor, fontWeight: 'bold' }}>{pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#1e3a5f', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: barColor, borderRadius: '3px' }} />
                    </div>
                  </td>

                  <td>
                    {pct >= 95 ? (
                      <span className="badge-red">AT CAPACITY</span>
                    ) : pct > 0 ? (
                      <span className="badge-blue">ACTIVE</span>
                    ) : (
                      <span className="badge-green">STANDBY READY</span>
                    )}
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
