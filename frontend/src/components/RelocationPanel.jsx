import React, { useState } from 'react';
import { Truck, Home, ShieldCheck, ChevronRight, Search, FileText } from 'lucide-react';
import { NATIONAL_HOTSPOTS } from '../services/localEngine';

export default function RelocationPanel({
  evacuationPlan,
  shelters,
  resettlementSites: _resettlementSites,
  horizon: _horizon,
  currentSector,
  onSectorChange,
  onInspectHabitation,
  onOpenRelocationPlan
}) {
  const isAllIndia = currentSector === 'all_india';
  const [stateSearch, setStateSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  const filteredSpots = NATIONAL_HOTSPOTS.filter(spot => {
    const matchesAlert = stateFilter === 'ALL' || spot.alert_level === stateFilter;
    const matchesSearch = spot.state.toLowerCase().includes(stateSearch.toLowerCase()) ||
                          spot.district.toLowerCase().includes(stateSearch.toLowerCase()) ||
                          spot.hazard_type.toLowerCase().includes(stateSearch.toLowerCase());
    return matchesAlert && matchesSearch;
  });

  return (
    <div className="gov-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflowY: 'auto' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Truck size={15} color="#0b2545" />
          <h2 style={{ fontSize: '12.5px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {isAllIndia ? 'National Alert Hotspots' : 'Evacuation & Relocation Convoys'}
          </h2>
        </div>
        <span style={{
          fontSize: '10px',
          color: '#0b2545',
          fontWeight: '700',
          background: '#f1f5f9',
          padding: '2px 6px',
          borderRadius: '3px',
          border: '1px solid #cbd5e1'
        }}>
          {isAllIndia ? `${NATIONAL_HOTSPOTS.length} Monitored Sectors` : `${evacuationPlan.length} Active Corridors`}
        </span>
      </div>

      {/* 1. ALL-INDIA VIEW: Clean National Hotspot Registry */}
      {isAllIndia ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '4px 8px'
            }}>
              <Search size={13} color="#64748b" />
              <input
                type="text"
                placeholder="Search state, district, or hazard..."
                value={stateSearch}
                onChange={e => setStateSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0f172a',
                  fontSize: '11px',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'ALL', label: `All (${NATIONAL_HOTSPOTS.length})` },
                { id: 'RED', label: `Red (${NATIONAL_HOTSPOTS.filter(s => s.alert_level === 'RED').length})` },
                { id: 'ORANGE', label: `Orange (${NATIONAL_HOTSPOTS.filter(s => s.alert_level === 'ORANGE').length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStateFilter(f.id)}
                  style={{
                    flex: 1,
                    padding: '3px 4px',
                    fontSize: '10px',
                    fontWeight: stateFilter === f.id ? '700' : '500',
                    borderRadius: '3px',
                    border: stateFilter === f.id ? '1px solid #0b2545' : '1px solid #cbd5e1',
                    background: stateFilter === f.id ? '#0b2545' : '#ffffff',
                    color: stateFilter === f.id ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredSpots.map(spot => {
              const isRed = spot.alert_level === 'RED';

              return (
                <div
                  key={spot.id}
                  onClick={() => onSectorChange && onSectorChange(spot.sector_key)}
                  style={{
                    background: '#ffffff',
                    border: isRed ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                    borderLeft: isRed ? '3px solid #b91c1c' : '3px solid #c2410c',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#0f172a', fontSize: '11.5px' }}>{spot.district}</strong>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: '700',
                      padding: '1px 5px',
                      borderRadius: '2px',
                      background: isRed ? '#fef2f2' : '#fff7ed',
                      color: isRed ? '#991b1b' : '#9a3412',
                      border: isRed ? '1px solid #fca5a5' : '1px solid #fdba74'
                    }}>
                      {spot.alert_level}
                    </span>
                  </div>

                  <div style={{ color: '#64748b', fontSize: '10px' }}>
                    {spot.state} &bull; {spot.hazard_type}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '4px', marginTop: '2px', fontSize: '10px' }}>
                    <span style={{ color: '#334155' }}>
                      At Risk: <strong>{spot.population_at_risk.toLocaleString()}</strong> citizens
                    </span>
                    <button
                      onClick={() => onSectorChange && onSectorChange(spot.sector_key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        background: '#f1f5f9',
                        color: '#0b2545',
                        border: '1px solid #cbd5e1',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '9.5px',
                        fontWeight: '700'
                      }}
                    >
                      <span>Command</span>
                      <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. DISTRICT VIEW: Convoys & Shelter Carrying Capacity */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {evacuationPlan.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ textAlign: 'center', padding: '12px 10px', background: '#f0fdf4', borderRadius: '4px', border: '1px solid #86efac' }}>
                <ShieldCheck size={22} color="#15803d" style={{ margin: '0 auto 4px auto', display: 'block' }} />
                <strong style={{ color: '#166534', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>All Habitations Stable</strong>
                <span style={{ fontSize: '10px', color: '#15803d' }}>Real-time sensor telemetry indicates no immediate breach or slope shear threshold.</span>
              </div>

              {/* District Readiness Metrics */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '9px 11px', fontSize: '11px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontWeight: '700', color: '#0b2545', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}>
                  District Standby Relief Capacity
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pre-positioned Shelters:</span>
                  <strong style={{ color: '#0f172a' }}>{shelters.length} Facilities (Buffer Available)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Evacuation Capacity:</span>
                  <strong style={{ color: '#15803d' }}>{shelters.reduce((acc, s) => acc + (s.effective_capacity || 0), 0).toLocaleString()} Beds</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Drinking Water Stock:</span>
                  <strong style={{ color: '#0b2545' }}>{shelters.reduce((acc, s) => acc + (s.water_liters || 0), 0).toLocaleString()} Litres</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Ready Ration Packets:</span>
                  <strong style={{ color: '#b45309' }}>{shelters.reduce((acc, s) => acc + (s.ration_packets || 0), 0).toLocaleString()} Units</strong>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {evacuationPlan.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: item.priority_level === 'CRITICAL' ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                    borderLeft: item.priority_level === 'CRITICAL' ? '3px solid #b91c1c' : '3px solid #1d4ed8',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    fontSize: '11px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '11.5px' }}>
                      {item.from_name}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      background: item.priority_level === 'CRITICAL' ? '#fef2f2' : '#eff6ff',
                      color: item.priority_level === 'CRITICAL' ? '#991b1b' : '#1e40af',
                      border: item.priority_level === 'CRITICAL' ? '1px solid #fca5a5' : '1px solid #93c5fd',
                      padding: '1px 5px',
                      borderRadius: '2px',
                      fontWeight: '700'
                    }}>
                      {item.priority_level}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '10.5px', marginBottom: '4px' }}>
                    <span>&rarr; Destination:</span>
                    <strong style={{ color: '#0b2545' }}>{item.to_name}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '3px' }}>
                    <div>
                      Evacuees: <strong style={{ color: '#0f172a' }}>{item.evacuee_count.toLocaleString()}</strong>
                    </div>
                    <div>
                      {item.distance_km} km &bull; {item.estimated_transit_mins} mins
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '3px', paddingTop: '3px', borderTop: '1px dashed #f1f5f9', fontSize: '9.5px' }}>
                    <span style={{ color: '#0b2545', fontWeight: '600' }}>
                      🚌 {item.recommended_convoy_type}
                    </span>
                    <button
                      onClick={() => onInspectHabitation({ id: item.from_id, name: item.from_name, zone: 'RED', population: item.evacuee_count, slope_degrees: 35.0, factor_of_safety: 1.05, river_distance_m: 80 })}
                      style={{
                        background: '#f1f5f9',
                        color: '#0b2545',
                        border: '1px solid #cbd5e1',
                        padding: '1px 5px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '9px',
                        fontWeight: '600'
                      }}
                    >
                      Dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sphere Carrying Capacity Status Bar */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Home size={12} color="#0b2545" />
            <h3 style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase' }}>
              Relief Shelter Capacity
            </h3>
          </div>
          <span style={{ fontSize: '9.5px', color: '#64748b' }}>Sphere Norms</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {shelters.slice(0, 3).map(s => {
            const pct = Math.round((s.current_occupancy / Math.max(1, s.effective_capacity)) * 100);
            const barColor = pct >= 95 ? '#b91c1c' : pct > 50 ? '#c2410c' : '#15803d';

            return (
              <div key={s.id} style={{ background: '#f8fafc', padding: '5px 7px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '2px' }}>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>{s.name}</span>
                  <span style={{ color: barColor, fontWeight: '700' }}>{pct}% Occupied</span>
                </div>

                <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: barColor, borderRadius: '2px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                  <span>Occupancy: {s.current_occupancy} / {s.effective_capacity} beds</span>
                  <span style={{ color: '#334155' }}>Water: {s.water_liters?.toLocaleString()} L</span>
                </div>
              </div>
            );
          })}
        </div>

        {onOpenRelocationPlan && (
          <button
            onClick={onOpenRelocationPlan}
            style={{
              width: '100%',
              marginTop: '8px',
              background: '#0b2545',
              color: '#ffffff',
              border: 'none',
              borderRadius: '3px',
              padding: '6px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <FileText size={11} />
            <span>Generate Relocation Plan (DM Act §34)</span>
          </button>
        )}
      </div>
    </div>
  );
}
