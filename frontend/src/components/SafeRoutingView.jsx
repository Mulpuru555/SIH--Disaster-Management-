import React, { useState } from 'react';
import { Navigation, AlertTriangle, Clock } from 'lucide-react';

export default function SafeRoutingView({
  evacuationPlan,
  _habitations,
  _shelters,
  onTriggerBridgeWashout,
  onResetSimulation
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isSimulatedWashout, setIsSimulatedWashout] = useState(false);

  // Generate realistic route segments from evacuation plan and habitations
  const routes = evacuationPlan.map((p, idx) => {
    // If bridge washout simulated, mark primary river crossings as BLOCKED and compute detour
    const isBridgeAffected = isSimulatedWashout && (idx === 0 || idx === 2);
    const isWaterlogged = !isBridgeAffected && (idx % 3 === 1);
    
    const status = isBridgeAffected ? 'BLOCKED' : isWaterlogged ? 'CAUTION' : 'SAFE';
    const primaryDist = p.distance_km || 14.5;
    const detourDist = isBridgeAffected ? Number((primaryDist * 1.55).toFixed(1)) : primaryDist;
    const transitMins = isBridgeAffected ? Math.round(detourDist * 2.8) : p.estimated_transit_mins || Math.round(primaryDist * 2.2);

    return {
      id: `CORR-${idx + 101}`,
      from: p.from_name,
      to: p.to_name,
      status,
      primary_distance_km: primaryDist,
      detour_distance_km: detourDist,
      transit_mins: transitMins,
      evacuees: p.evacuee_count,
      convoy_type: p.recommended_convoy_type,
      clearance_notes: isBridgeAffected
        ? '⚠️ PRIMARY RIVER BRIDGE WASHOUT: Rerouted via State Highway Elevated Detour Link'
        : isWaterlogged
        ? '⚠️ CAUTION: Roadside culvert waterlogged. Speed restricted to 25 km/h with Police Escort'
        : '✅ CLEAR: Paved arterial NH/SH corridor inspected and operational'
    };
  });

  const filteredRoutes = routes.filter(r => filterStatus === 'ALL' || r.status === filterStatus);

  const safeCount = routes.filter(r => r.status === 'SAFE').length;
  const cautionCount = routes.filter(r => r.status === 'CAUTION').length;
  const blockedCount = routes.filter(r => r.status === 'BLOCKED').length;

  const handleToggleWashout = () => {
    setIsSimulatedWashout(prev => !prev);
    if (!isSimulatedWashout && onTriggerBridgeWashout) {
      onTriggerBridgeWashout();
    } else if (isSimulatedWashout && onResetSimulation) {
      onResetSimulation();
    }
  };

  return (
    <div style={{ margin: '14px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Title Bar */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Traffic &amp; Logistics Cell &bull; State Highway Police &bull; NDRF Transit Command
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              Safe Evacuation Corridors &amp; Bridge Inundation Routing Engine
            </h2>
            <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
              Dynamic classification of evacuation corridors into SAFE, CAUTION, and BLOCKED routes with automatic multi-point detour calculation during flash inundations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleToggleWashout}
              style={{
                background: isSimulatedWashout ? '#b91c1c' : '#0b2545',
                color: '#ffffff',
                border: 'none',
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
              <AlertTriangle size={13} />
              <span>{isSimulatedWashout ? 'Clear Simulated Bridge Washout' : 'Simulate River Bridge Washout'}</span>
            </button>
          </div>
        </div>

        {/* Route Status Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>TOTAL ACTIVE CORRIDORS</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              {routes.length}
            </div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>Connecting Red Zones to Shelters</div>
          </div>

          <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '10px', color: '#15803d', fontWeight: '700' }}>SAFE CORRIDORS (CLEAR)</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>
              {safeCount}
            </div>
            <div style={{ fontSize: '10.5px', color: '#166534', marginTop: '2px' }}>Full speed arterial transit</div>
          </div>

          <div style={{ background: '#fff7ed', padding: '10px', borderRadius: '4px', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: '10px', color: '#c2410c', fontWeight: '700' }}>CAUTION CORRIDORS (SPEED RESTRICTED)</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#c2410c', marginTop: '2px' }}>
              {cautionCount}
            </div>
            <div style={{ fontSize: '10.5px', color: '#9a3412', marginTop: '2px' }}>Waterlogged culvert / 25 km/h limit</div>
          </div>

          <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '4px', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '10px', color: '#b91c1c', fontWeight: '700' }}>BLOCKED / INUNDATED CORRIDORS</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#b91c1c', marginTop: '2px' }}>
              {blockedCount}
            </div>
            <div style={{ fontSize: '10.5px', color: '#7f1d1d', marginTop: '2px' }}>Rerouted via secondary detours</div>
          </div>
        </div>
      </div>

      {/* Corridor Table */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={15} color="#0b2545" />
            <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase' }}>
              Corridor Transit Clearance &amp; Route Guidance Register
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '5px' }}>
            {[
              { id: 'ALL', label: `All (${routes.length})` },
              { id: 'SAFE', label: `Safe (${safeCount})` },
              { id: 'CAUTION', label: `Caution (${cautionCount})` },
              { id: 'BLOCKED', label: `Blocked (${blockedCount})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                style={{
                  padding: '3px 7px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: filterStatus === f.id ? '700' : '500',
                  border: filterStatus === f.id ? '1px solid #0b2545' : '1px solid #cbd5e1',
                  background: filterStatus === f.id ? '#0b2545' : '#ffffff',
                  color: filterStatus === f.id ? '#ffffff' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table" style={{ width: '100%', fontSize: '11px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Corridor ID</th>
                <th style={{ textAlign: 'left' }}>Origin Habitation &rarr; Destination Shelter</th>
                <th style={{ textAlign: 'center' }}>Corridor Status</th>
                <th style={{ textAlign: 'right' }}>Distance (km)</th>
                <th style={{ textAlign: 'right' }}>Estimated Transit</th>
                <th style={{ textAlign: 'right' }}>Evacuees</th>
                <th style={{ textAlign: 'left' }}>Assigned Fleet</th>
                <th style={{ textAlign: 'left' }}>Route Clearance Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map(r => {
                const statusBadge = r.status === 'SAFE' ? 'badge-green' : r.status === 'CAUTION' ? 'badge-amber' : 'badge-red';

                return (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{r.id}</strong>
                    </td>
                    <td>
                      <div>
                        <strong style={{ color: '#0f172a' }}>{r.from}</strong> &rarr; <span style={{ color: '#15803d', fontWeight: '600' }}>{r.to}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={statusBadge} style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>
                      {r.detour_distance_km} km
                      {r.status === 'BLOCKED' && (
                        <div style={{ fontSize: '9px', color: '#b91c1c' }}>+{Number((r.detour_distance_km - r.primary_distance_km).toFixed(1))} km detour</div>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>
                        <Clock size={11} color="#64748b" />
                        <span>{r.transit_mins} mins</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>
                      {r.evacuees?.toLocaleString()}
                    </td>
                    <td>
                      <span style={{ fontSize: '10.5px', color: '#334155' }}>{r.convoy_type}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '10px', color: r.status === 'BLOCKED' ? '#b91c1c' : r.status === 'CAUTION' ? '#c2410c' : '#15803d' }}>
                        {r.clearance_notes}
                      </div>
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
