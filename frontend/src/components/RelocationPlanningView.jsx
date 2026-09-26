import React from 'react';
import { Truck, Home, Calendar, Clock, Download, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function RelocationPlanningView({
  evacuationPlan,
  shelters,
  resettlementSites,
  horizon,
  onHorizonChange,
  onOpenRelocationPlan
}) {
  const totalEvacuees = evacuationPlan.reduce((acc, p) => acc + (p.evacuee_count || 0), 0);
  const totalBuses = evacuationPlan.reduce((acc, p) => acc + Math.ceil((p.evacuee_count || 0) / 45), 0);
  const totalAmbulances = evacuationPlan.length * 2;

  return (
    <div style={{ margin: '14px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Title Bar */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              National Disaster Response Force (NDRF) &bull; DM Act 2005 Section 34 Mandate
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              Proactive Relocation &amp; Resettlement Operational Master Plan
            </h2>
            <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
              Multi-tiered evacuation planning supporting 0-24h Immediate Evacuation, 24-72h Short-Term Relief Staging, and Medium-Term Permanent Township Rehabilitation.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onOpenRelocationPlan}
              style={{
                background: '#b91c1c',
                color: '#ffffff',
                border: '1px solid #991b1b',
                borderRadius: '3px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileText size={13} />
              <span>Draft Relocation Plan (DM Act §34)</span>
            </button>
          </div>
        </div>

        {/* 3-Tier Horizon Switcher */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: '700' }}>Planning Horizon:</span>
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <button
              onClick={() => onHorizonChange('immediate')}
              style={{
                background: horizon === 'immediate' ? '#b91c1c' : 'transparent',
                color: horizon === 'immediate' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: horizon === 'immediate' ? '700' : '500',
                cursor: 'pointer'
              }}
            >
              Immediate Relocation (0–24h)
            </button>
            <button
              onClick={() => onHorizonChange('short_term')}
              style={{
                background: horizon === 'short_term' ? '#b45309' : 'transparent',
                color: horizon === 'short_term' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: horizon === 'short_term' ? '700' : '500',
                cursor: 'pointer'
              }}
            >
              Short-Term Relief Staging (24–72h)
            </button>
            <button
              onClick={() => onHorizonChange('medium_term')}
              style={{
                background: horizon === 'medium_term' ? '#15803d' : 'transparent',
                color: horizon === 'medium_term' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: horizon === 'medium_term' ? '700' : '500',
                cursor: 'pointer'
              }}
            >
              Medium-Term Permanent Resettlement
            </button>
          </div>
        </div>

        {/* Horizon KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          marginTop: '12px'
        }}>
          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>TOTAL EVACUEES SCHEDULED</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              {totalEvacuees.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>Across {evacuationPlan.length} active convoys</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>FLEET ALLOCATION (BUSES)</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0b2545', marginTop: '2px' }}>
              {totalBuses} Buses
            </div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>45-seater State Transport Fleet</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>MEDICAL ESCORTS</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#b91c1c', marginTop: '2px' }}>
              {totalAmbulances} Ambulances
            </div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>Pre-positioned for PwD &amp; geriatric cases</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>TARGET FACILITIES</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>
              {horizon === 'medium_term' ? `${resettlementSites.length} Townships` : `${shelters.length} Shelters`}
            </div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>100% Zero-Overflow Constraint</div>
          </div>
        </div>
      </div>

      {/* Convoy Schedule Table */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Truck size={15} color="#0b2545" />
            <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>
              {horizon === 'medium_term' ? 'Permanent Resettlement Allocation Matrix' : 'Staged Convoy Movement & Dispatch Schedule'}
            </h3>
          </div>
          <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '600' }}>
            {evacuationPlan.length} Convoys Authorized
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table" style={{ width: '100%', fontSize: '11px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Wave</th>
                <th style={{ textAlign: 'left' }}>Origin Habitation (Red Zone)</th>
                <th style={{ textAlign: 'left' }}>Target Facility</th>
                <th style={{ textAlign: 'right' }}>Evacuees</th>
                <th style={{ textAlign: 'right' }}>Distance</th>
                <th style={{ textAlign: 'right' }}>Transit Duration</th>
                <th style={{ textAlign: 'left' }}>Convoy Composition</th>
                <th style={{ textAlign: 'center' }}>Statutory Priority</th>
              </tr>
            </thead>
            <tbody>
              {evacuationPlan.map((p, idx) => {
                const wave = `Wave ${idx + 1}`;
                const priorityBadge = p.priority_level === 'CRITICAL' ? 'badge-red' : p.priority_level === 'PERMANENT_RESETTLEMENT' ? 'badge-green' : 'badge-amber';

                return (
                  <tr key={idx}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{wave}</strong>
                      <div style={{ fontSize: '9px', color: '#64748b' }}>T+{(idx * 45)} mins</div>
                    </td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{p.from_name}</strong>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>ID: {p.from_id}</div>
                    </td>
                    <td>
                      <strong style={{ color: '#15803d' }}>{p.to_name}</strong>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>ID: {p.to_id}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>
                      {p.evacuee_count?.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>{p.distance_km} km</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>
                        <Clock size={11} color="#64748b" />
                        <span>{p.estimated_transit_mins} mins</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '10.5px', color: '#334155' }}>{p.recommended_convoy_type}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={priorityBadge} style={{ fontSize: '9px', padding: '2px 5px' }}>
                        {p.priority_level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
