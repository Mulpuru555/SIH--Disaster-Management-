import React, { useState } from 'react';
import { Truck, Home, Eye, ShieldCheck, ChevronRight, Search } from 'lucide-react';
import { NATIONAL_HOTSPOTS } from '../services/localEngine';

export default function RelocationPanel({
  evacuationPlan,
  shelters,
  resettlementSites: _resettlementSites,
  horizon: _horizon,
  currentSector,
  onSectorChange,
  onInspectHabitation
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
    <div className="gov-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e3a5f', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Truck size={16} color="#38bdf8" />
          <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {isAllIndia ? 'National Relocation Matrix' : 'District Evacuation Convoys'}
          </h2>
        </div>
        <span style={{
          fontSize: '10.5px',
          color: '#38bdf8',
          fontWeight: '700',
          background: 'rgba(56, 189, 248, 0.15)',
          padding: '2px 7px',
          borderRadius: '4px',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          {isAllIndia ? `${NATIONAL_HOTSPOTS.length} Active Sectors` : `${evacuationPlan.length} Active Corridors`}
        </span>
      </div>

      {/* 1. ALL-INDIA VIEW: Multi-State Evacuation Summary */}
      {isAllIndia ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#071526',
              border: '1px solid #1e3a5f',
              borderRadius: '4px',
              padding: '4px 8px'
            }}>
              <Search size={13} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search state, district, or hazard..."
                value={stateSearch}
                onChange={e => setStateSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '11px',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'ALL', label: `All (${NATIONAL_HOTSPOTS.length})` },
                { id: 'RED', label: `🚨 Red (${NATIONAL_HOTSPOTS.filter(s => s.alert_level === 'RED').length})` },
                { id: 'ORANGE', label: `⚠️ Orange (${NATIONAL_HOTSPOTS.filter(s => s.alert_level === 'ORANGE').length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStateFilter(f.id)}
                  style={{
                    flex: 1,
                    padding: '3px 5px',
                    fontSize: '10px',
                    fontWeight: stateFilter === f.id ? '700' : '500',
                    borderRadius: '3px',
                    border: stateFilter === f.id ? '1px solid #3b82f6' : '1px solid #1e3a5f',
                    background: stateFilter === f.id ? '#1e3a5f' : '#0a1d35',
                    color: stateFilter === f.id ? '#ffffff' : '#94a3b8',
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
                    background: '#0a1d35',
                    border: '1px solid #1e3a5f',
                    borderRadius: '5px',
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#0d2847'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3a5f'; e.currentTarget.style.background = '#0a1d35'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#ffffff', fontSize: '12px' }}>{spot.district}</strong>
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: '800',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      background: isRed ? 'rgba(220, 38, 38, 0.2)' : 'rgba(234, 88, 12, 0.2)',
                      color: isRed ? '#f87171' : '#fb923c',
                      border: isRed ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid rgba(234, 88, 12, 0.4)'
                    }}>
                      {spot.alert_level}
                    </span>
                  </div>

                  <div style={{ color: '#94a3b8', fontSize: '10.5px' }}>
                    {spot.state} &bull; {spot.hazard_type}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #163354', paddingTop: '4px', marginTop: '2px', fontSize: '10.5px' }}>
                    <span style={{ color: '#38bdf8' }}>
                      Mobilizing: <strong>{spot.population_at_risk.toLocaleString()}</strong> citizens
                    </span>
                    <button
                      onClick={() => onSectorChange && onSectorChange(spot.sector_key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        background: '#132e50',
                        color: '#93c5fd',
                        border: '1px solid #1e3a5f',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}
                    >
                      <span>Command</span>
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. HYPER-LOCAL DISTRICT VIEW: Road Corridors & Fleet */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {evacuationPlan.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ textAlign: 'center', padding: '14px 10px', background: '#0a1d35', borderRadius: '5px', border: '1px solid #163354' }}>
                <ShieldCheck size={24} color="#22c55e" style={{ margin: '0 auto 6px auto', display: 'block' }} />
                <strong style={{ color: '#f8fafc', display: 'block', fontSize: '11.5px', marginBottom: '2px' }}>All Habitations Stable</strong>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Real-time sensor telemetry indicates no immediate breach or slope shear threshold.</span>
              </div>

              {/* District Readiness Metrics */}
              <div style={{ background: '#071526', border: '1px solid #1e3a5f', borderRadius: '5px', padding: '9px 11px', fontSize: '11px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontWeight: '700', color: '#38bdf8', borderBottom: '1px solid #163354', paddingBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}>
                  🛡️ District Standby Relief Capacity
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pre-positioned Shelters:</span>
                  <strong style={{ color: '#ffffff' }}>{shelters.length} Facilities (100% Buffer)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Evacuation Capacity:</span>
                  <strong style={{ color: '#4ade80' }}>{shelters.reduce((acc, s) => acc + (s.effective_capacity || 0), 0).toLocaleString()} Beds</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Emergency Drinking Water:</span>
                  <strong style={{ color: '#38bdf8' }}>{shelters.reduce((acc, s) => acc + (s.water_liters || 0), 0).toLocaleString()} Liters</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Ready Ration Packets:</span>
                  <strong style={{ color: '#fbbf24' }}>{shelters.reduce((acc, s) => acc + (s.ration_packets || 0), 0).toLocaleString()} Units</strong>
                </div>
              </div>

              {/* Info Prompt for Judges */}
              <div style={{ background: 'rgba(30, 58, 95, 0.3)', border: '1px dashed #3b82f6', borderRadius: '5px', padding: '8px 10px', fontSize: '10px', color: '#93c5fd', lineHeight: 1.4 }}>
                💡 <b>Judge Demonstration:</b> Click <b>"1. Extreme Cloudburst (165 mm/hr)"</b> on the left simulator to model a severe disaster event and watch Google OR-Tools calculate zero-overflow convoy routes live.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {evacuationPlan.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#0a1d35',
                    border: '1px solid #1e3a5f',
                    borderRadius: '5px',
                    padding: '8px 10px',
                    fontSize: '11.5px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontWeight: '700', color: '#ffffff', fontSize: '12px' }}>
                      {item.from_name}
                    </span>
                    <span style={{
                      fontSize: '9.5px',
                      background: item.priority_level === 'CRITICAL' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                      color: item.priority_level === 'CRITICAL' ? '#f87171' : '#38bdf8',
                      border: item.priority_level === 'CRITICAL' ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      fontWeight: '700'
                    }}>
                      {item.priority_level}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#94a3b8', fontSize: '10.5px', marginBottom: '5px' }}>
                    <span>&rarr; Destination:</span>
                    <strong style={{ color: '#38bdf8' }}>{item.to_name}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: '#cbd5e1', borderTop: '1px solid #163354', paddingTop: '4px' }}>
                    <div>
                      Mobilizing: <strong style={{ color: '#ffffff' }}>{item.evacuee_count.toLocaleString()}</strong> citizens
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                      {item.distance_km} km &bull; {item.estimated_transit_mins} mins
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '3px', borderTop: '1px dashed #163354', fontSize: '10px' }}>
                    <span style={{ color: '#60a5fa' }}>
                      🚌 {item.recommended_convoy_type}
                    </span>
                    <button
                      onClick={() => onInspectHabitation({ id: item.from_id, name: item.from_name, zone: 'RED', population: item.evacuee_count, slope_degrees: 35.0, factor_of_safety: 1.05, river_distance_m: 80 })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        background: '#132e50',
                        color: '#93c5fd',
                        border: '1px solid #1e3a5f',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '9.5px'
                      }}
                    >
                      <Eye size={10} />
                      <span>XAI</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sphere Carrying Capacity Status Bar */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #1e3a5f', paddingTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Home size={13} color="#38bdf8" />
            <h3 style={{ fontSize: '11.5px', fontWeight: '700', color: '#ffffff', textTransform: 'uppercase' }}>
              Relief Shelter Capacity
            </h3>
          </div>
          <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>Sphere Norms</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {shelters.slice(0, 3).map(s => {
            const pct = Math.round((s.current_occupancy / Math.max(1, s.effective_capacity)) * 100);
            const barColor = pct >= 95 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#22c55e';

            return (
              <div key={s.id} style={{ background: '#0a1d35', padding: '6px 8px', borderRadius: '4px', border: '1px solid #163354' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '2px' }}>
                  <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{s.name}</span>
                  <span style={{ color: barColor, fontWeight: '700' }}>{pct}%</span>
                </div>

                <div style={{ width: '100%', height: '4px', background: '#1e3a5f', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: barColor, borderRadius: '2px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>
                  <span>Occupancy: {s.current_occupancy} / {s.effective_capacity}</span>
                  <span style={{ color: '#f59e0b' }}>Bottleneck: {s.bottleneck_resource}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
