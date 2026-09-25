import React, { useState } from 'react';
import { Search, Download, CheckCircle2, AlertTriangle, Home } from 'lucide-react';

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

  const totalCapacity = shelters.reduce((acc, s) => acc + (s.effective_capacity || 0), 0);
  const totalOccupied = shelters.reduce((acc, s) => acc + (s.current_occupancy || 0), 0);
  const totalArea = shelters.reduce((acc, s) => acc + (s.usable_area_sqm || 0), 0);
  const totalWater = shelters.reduce((acc, s) => acc + (s.water_liters || 0), 0);
  const totalToilets = shelters.reduce((acc, s) => acc + (s.toilets_count || 0), 0);
  const totalMedics = shelters.reduce((acc, s) => acc + (s.medical_staff_count || 0), 0);

  return (
    <div style={{ margin: '14px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Official Section Title & Controls Bar */}
      <div className="gov-card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Relief &amp; Rehabilitation Cell &bull; Sphere Humanitarian Minimum Standards
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              Relief Shelters Carrying Capacity &amp; Resource Sufficiency Audit
            </h2>
            <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
              Statutory verification of shelter suitability: Floor Space (3.5 m²/person), Drinking Water (15 L/day/person), Sanitation (1 toilet per 20 persons), and Medical Support.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => window.print()}
              className="gov-btn-primary"
            >
              <Download size={13} />
              <span>Export Sphere Audit (PDF)</span>
            </button>
          </div>
        </div>

        {/* Sphere Resource Audit Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '10px',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Total Floor Space</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              {totalArea.toLocaleString()} m²
            </div>
            <div style={{ fontSize: '9.5px', color: '#15803d' }}>3.5 m² Sphere Norm</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Potable Water Stock</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0b2545', marginTop: '2px' }}>
              {(totalWater / 1000).toFixed(0)}k Litres
            </div>
            <div style={{ fontSize: '9.5px', color: '#64748b' }}>15 L/day Emergency Standard</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Sanitation Facilities</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>
              {totalToilets} Latrines
            </div>
            <div style={{ fontSize: '9.5px', color: '#15803d' }}>1 : 20 Ratio Verified</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Medical Officers</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#b45309', marginTop: '2px' }}>
              {totalMedics} Staff Assigned
            </div>
            <div style={{ fontSize: '9.5px', color: '#64748b' }}>First Aid &amp; Trauma Posts</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Carrying Capacity Buffer</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>
              {(totalCapacity - totalOccupied).toLocaleString()} Beds
            </div>
            <div style={{ fontSize: '9.5px', color: '#15803d' }}>
              {totalCapacity > 0 ? `${Math.round(((totalCapacity - totalOccupied) / totalCapacity) * 100)}% Buffer Available` : 'Ready'}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '4px 10px',
            width: '280px',
            gap: '6px'
          }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search shelter facility name or ID..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Filter Operational Status:</span>
            {[
              { id: 'ALL', label: `All Facilities (${shelters.length})` },
              { id: 'STANDBY', label: `Standby Buffer (${shelters.filter(s => s.current_occupancy === 0).length})` },
              { id: 'OCCUPIED', label: `Active Shelters (${shelters.filter(s => s.current_occupancy > 0).length})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: '4px 9px',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '3px',
                  border: statusFilter === f.id ? '1px solid #0b2545' : '1px solid #cbd5e1',
                  background: statusFilter === f.id ? '#0b2545' : '#ffffff',
                  color: statusFilter === f.id ? '#ffffff' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Official Shelters Table */}
      <div className="gov-card" style={{ overflowX: 'auto' }}>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Shelter ID &amp; Facility Name</th>
              <th>Facility Type</th>
              <th>Floor Space</th>
              <th>Registered Capacity</th>
              <th>Current Occupancy</th>
              <th>Available Buffer</th>
              <th>Drinking Water</th>
              <th>Sanitation (Latrines)</th>
              <th>Medical Posts</th>
              <th>Carrying Capacity Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const available = Math.max(0, s.effective_capacity - s.current_occupancy);
              const fillPct = Math.round((s.current_occupancy / Math.max(1, s.effective_capacity)) * 100);
              const isFull = available === 0;

              return (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '12px' }}>{s.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{s.id} &bull; {s.lat.toFixed(4)}°N, {s.lng.toFixed(4)}°E</div>
                  </td>

                  <td>
                    <span style={{ color: '#334155', fontSize: '11.5px' }}>
                      {s.type || 'Government Relief Facility'}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{s.usable_area_sqm?.toLocaleString()} m²</div>
                    <div style={{ fontSize: '9.5px', color: '#64748b' }}>{(s.usable_area_sqm / Math.max(1, s.effective_capacity)).toFixed(1)} m²/bed</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{s.effective_capacity.toLocaleString()} beds</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '700', color: isFull ? '#b91c1c' : '#334155' }}>
                      {s.current_occupancy.toLocaleString()} ({fillPct}%)
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '700', color: available > 0 ? '#15803d' : '#b91c1c' }}>
                      {available.toLocaleString()} beds
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#0b2545' }}>{s.water_liters?.toLocaleString()} L</div>
                    <div style={{ fontSize: '9.5px', color: '#64748b' }}>Sphere: 15L/day</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#15803d' }}>{s.toilets_count} Units</div>
                    <div style={{ fontSize: '9.5px', color: '#64748b' }}>1 : 20 Ratio</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: '600', color: '#b45309' }}>{s.medical_staff_count} Staff</div>
                  </td>

                  <td>
                    {available > 0 ? (
                      <span className="badge-green">
                        <CheckCircle2 size={11} /> BUFFER AVAILABLE
                      </span>
                    ) : (
                      <span className="badge-red">
                        <AlertTriangle size={11} /> AT FULL CAPACITY
                      </span>
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
