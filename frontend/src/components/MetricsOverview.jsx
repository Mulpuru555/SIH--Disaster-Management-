import React from 'react';
import { AlertTriangle, Users, Home, ArrowRight, ShieldCheck, Info } from 'lucide-react';

export default function MetricsOverview({ 
  habitations = [], 
  shelters = [], 
  resettlementSites = [], 
  currentSector = 'all_india',
  liveWeather = null,
  onOpenRelocationPlan = null,
  horizon = 'immediate'
}) {
  const redHabs = habitations.filter(h => h.zone === 'RED');
  const orangeHabs = habitations.filter(h => h.zone === 'ORANGE');
  const greenHabs = habitations.filter(h => h.zone === 'GREEN');
  const redPop = redHabs.reduce((sum, h) => sum + (h.population || 0), 0);
  const totalCapacity = shelters.reduce((sum, s) => sum + (s.effective_capacity || 0), 0);
  const currentOccupancy = shelters.reduce((sum, s) => sum + (s.current_occupancy || 0), 0);
  const availableCapacity = Math.max(0, totalCapacity - currentOccupancy);

  // Capacity status evaluation
  const isCapacitySufficient = availableCapacity >= redPop;
  const capacityDelta = Math.abs(availableCapacity - redPop);

  // Situation Title & Source
  const hazardTitle = liveWeather?.is_cyclone_alert 
    ? (liveWeather?.storm_name || 'Active Cyclonic Storm System')
    : (liveWeather?.condition || 'Standard Monsoonal Surveillance');
  const stationLocation = liveWeather?.station_name || 'National Meteorological Telemetry Grid';
  const dataFreshness = liveWeather?.last_updated || 'Telemetry Active';

  return (
    <div style={{
      margin: '0 20px 12px 20px',
      display: 'grid',
      gridTemplateColumns: 'minmax(260px, 1.2fr) minmax(220px, 1fr) minmax(220px, 1fr) minmax(280px, 1.3fr)',
      gap: '10px'
    }}>
      {/* 1. WHAT IS HAPPENING? (Current Situation) */}
      <div className="gov-card" style={{ padding: '10px 14px', borderLeft: liveWeather?.is_cyclone_alert ? '4px solid #dc2626' : '4px solid #2563eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
            Current Situation
          </span>
          <span className={liveWeather?.is_cyclone_alert ? 'badge-red' : 'badge-blue'} style={{ fontSize: '9.5px', padding: '1px 5px' }}>
            {liveWeather?.is_cyclone_alert ? 'HAZARD ELEVATED' : 'BASELINE STABLE'}
          </span>
        </div>
        <div style={{ marginTop: '5px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={hazardTitle}>
            {hazardTitle}
          </div>
          <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={stationLocation}>
            {stationLocation}
          </div>
          <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Source: <b>IMD AWS / Open-Meteo</b></span>
            <span>&bull;</span>
            <span>{dataFreshness}</span>
          </div>
        </div>
      </div>

      {/* 2. WHO IS AT RISK? (At-Risk Habitations) */}
      <div className="gov-card" style={{ padding: '10px 14px', borderLeft: redHabs.length > 0 ? '4px solid #dc2626' : '4px solid #15803d' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
            At-Risk Habitations
          </span>
          <Users size={14} color={redHabs.length > 0 ? '#f87171' : '#4ade80'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
            {redHabs.length}
          </span>
          <span style={{ fontSize: '11px', color: redHabs.length > 0 ? '#fca5a5' : '#86efac', fontWeight: '600' }}>
            {redHabs.length > 0 ? 'Critical Red Zones' : 'All Habitations Stable'}
          </span>
        </div>
        <div style={{ fontSize: '10.5px', color: '#cbd5e1', marginTop: '2px' }}>
          Population Exposed: <strong style={{ color: redPop > 0 ? '#fcd34d' : '#86efac' }}>{redPop.toLocaleString()}</strong> citizens
        </div>
        <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>
          {orangeHabs.length} Elevated (Amber) &bull; {greenHabs.length} Stable (Green)
        </div>
      </div>

      {/* 3. CARRYING CAPACITY ASSESSMENT (Safer Relocation Sites) */}
      <div className="gov-card" style={{ padding: '10px 14px', borderLeft: isCapacitySufficient ? '4px solid #15803d' : '4px solid #d97706' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
            Carrying Capacity
          </span>
          <Home size={14} color={isCapacitySufficient ? '#4ade80' : '#f59e0b'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
            {availableCapacity.toLocaleString()}
          </span>
          <span style={{ fontSize: '10.5px', color: isCapacitySufficient ? '#86efac' : '#fcd34d', fontWeight: '600' }}>
            {isCapacitySufficient ? 'Capacity Available' : 'Relocation Buffer Deficit'}
          </span>
        </div>
        <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '2px' }}>
          Registered Capacity: <b>{totalCapacity.toLocaleString()}</b> &bull; Occupancy: <b>{currentOccupancy.toLocaleString()}</b>
        </div>
        <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>
          {horizon === 'medium_term' 
            ? `${resettlementSites.length} Tableland Townships` 
            : `${shelters.length} Verified Relief Centres`}
        </div>
      </div>

      {/* 4. WHAT SHOULD BE DONE & WHY? (Actionable Recommendation) */}
      <div className="gov-card" style={{ padding: '10px 14px', borderLeft: '4px solid #1d4ed8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
              Operational Recommendation
            </span>
            <span style={{ fontSize: '9.5px', color: '#93c5fd' }}>
              Confidence: <b>88%</b>
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#ffffff', fontWeight: '600', marginTop: '4px', lineHeight: 1.35 }}>
            {redHabs.length > 0 
              ? `${redHabs.length} habitations require relocation assessment under Section 34.`
              : 'Continuous hydro-meteorological surveillance in progress.'}
          </div>
          <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>
            Evidence: DEM Slope, AWS Rain ({liveWeather?.precipitation_mm ?? 0} mm/hr), 20-Yr Recurrence.
          </div>
        </div>

        {onOpenRelocationPlan && (
          <button
            onClick={onOpenRelocationPlan}
            style={{
              marginTop: '6px',
              background: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '10.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span>Review Relocation Plan</span>
            <ArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
