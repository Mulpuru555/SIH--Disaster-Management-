import React from 'react';
import { AlertTriangle, Home, Users, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { OPERATIONAL_SECTORS } from '../services/localEngine';

export default function MetricsOverview({
  habitations,
  shelters,
  resettlementSites: _resettlementSites,
  currentSector,
  liveWeather,
  onOpenRelocationPlan,
  horizon = 'immediate'
}) {
  const currentSectorObj = OPERATIONAL_SECTORS.find(s => s.id === currentSector);
  const sectorLabel = currentSectorObj?.label || 'Operational Ground Sector';

  // Counts by Zone
  const redHabs = habitations.filter(h => h.zone === 'RED');
  const orangeHabs = habitations.filter(h => h.zone === 'ORANGE');
  const greenHabs = habitations.filter(h => h.zone === 'GREEN');

  const redPop = redHabs.reduce((acc, h) => acc + (h.population || 0), 0);
  const totalShelterCap = shelters.reduce((acc, s) => acc + (s.effective_capacity || 0), 0);
  const currentOccupancy = shelters.reduce((acc, s) => acc + (s.current_occupancy || 0), 0);
  const availableBuffer = Math.max(0, totalShelterCap - currentOccupancy);

  // Weather Telemetry
  const rainRate = liveWeather?.precipitation_mm ?? 0.0;
  const windKmh = liveWeather?.wind_speed_kmh ?? 24.0;
  const pressureHpa = liveWeather?.pressure_hpa ?? 1008.0;
  const weatherCond = liveWeather?.condition || 'Normal Monsoonal Conditions';
  const isStorm = Boolean(liveWeather?.is_cyclone_alert);

  return (
    <div style={{
      margin: '10px 16px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '10px'
    }}>
      {/* 1. Current Hazard & Hydro-Meteorological Telemetry */}
      <div className="gov-card" style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: isStorm ? '4px solid #b91c1c' : '4px solid #1d4ed8' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.4px' }}>
            Operational Sector &bull; Hazard Status
          </span>
          {isStorm ? (
            <span className="badge-red" style={{ fontSize: '9.5px', padding: '1px 5px' }}>
              <AlertTriangle size={10} />
              <span>IMD RED ADVISORY</span>
            </span>
          ) : (
            <span className="badge-green" style={{ fontSize: '9.5px', padding: '1px 5px' }}>
              <CheckCircle2 size={10} />
              <span>NORMAL SURVEILLANCE</span>
            </span>
          )}
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
            {sectorLabel.split('(')[0].trim()}
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
            {weatherCond}
          </div>
        </div>

        <div style={{
          marginTop: '6px',
          paddingTop: '6px',
          borderTop: '1px solid #e2e8f0',
          fontSize: '10.5px',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Rain: <strong style={{ color: '#0f172a' }}>{rainRate} mm/hr</strong></span>
          <span>Wind: <strong style={{ color: '#0f172a' }}>{windKmh} km/h</strong></span>
          <span>MSLP: <strong style={{ color: '#0f172a' }}>{pressureHpa} hPa</strong></span>
        </div>
      </div>

      {/* 2. Habitations at Risk (SIH26191 Core) */}
      <div className="gov-card" style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: redHabs.length > 0 ? '4px solid #b91c1c' : '4px solid #15803d' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.4px' }}>
            Habitations Multi-Hazard Risk
          </span>
          <Users size={14} color="#64748b" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: redHabs.length > 0 ? '#b91c1c' : '#15803d' }}>
              {redHabs.length}
            </span>
            <span style={{ fontSize: '11.5px', color: '#334155', fontWeight: '600' }}>
              {redHabs.length === 0 ? 'Critical Red Zones (All Stable)' : 'Critical Red Zone Habitations'}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            {redHabs.length > 0
              ? `Immediate evacuation needed for ${redPop.toLocaleString()} citizens`
              : `Population exposed: ${redPop} citizens`}
          </div>
        </div>

        <div style={{
          marginTop: '6px',
          paddingTop: '6px',
          borderTop: '1px solid #e2e8f0',
          fontSize: '10.5px',
          display: 'flex',
          gap: '8px'
        }}>
          <span style={{ color: '#b91c1c', fontWeight: '700' }}>{redHabs.length} Red</span>
          <span style={{ color: '#c2410c', fontWeight: '600' }}>{orangeHabs.length} Orange</span>
          <span style={{ color: '#15803d', fontWeight: '600' }}>{greenHabs.length} Green</span>
        </div>
      </div>

      {/* 3. Relief Carrying Capacity (SIH26191 Core) */}
      <div className="gov-card" style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: availableBuffer > 0 ? '4px solid #15803d' : '4px solid #b91c1c' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.4px' }}>
            Relief Carrying Capacity
          </span>
          <Home size={14} color="#64748b" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
              {availableBuffer.toLocaleString()}
            </span>
            <span style={{ fontSize: '11.5px', color: '#15803d', fontWeight: '700' }}>
              Beds Available
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Registered Capacity: {totalShelterCap.toLocaleString()} &bull; Occupancy: {currentOccupancy.toLocaleString()}
          </div>
        </div>

        <div style={{
          marginTop: '6px',
          paddingTop: '6px',
          borderTop: '1px solid #e2e8f0',
          fontSize: '10.5px',
          color: '#15803d',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <CheckCircle2 size={11} color="#15803d" />
          <span>Sphere Norms Satisfied (15L Water / 1:20 Sanitation)</span>
        </div>
      </div>

      {/* 4. Action Directive & Statutory Relocation Trigger */}
      <div className="gov-card" style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #0b2545', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.4px' }}>
            Operational Recommendation
          </span>
          <ShieldAlert size={14} color="#0b2545" />
        </div>

        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', lineHeight: 1.3 }}>
            {redHabs.length > 0
              ? `Mobilize ${Math.ceil(redPop / 50)} evacuation transport units to cleared shelters.`
              : 'Continue 24/7 hydro-meteorological surveillance across local catchments.'}
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
            Relocation Horizon: <strong>{horizon.replace('_', ' ').toUpperCase()}</strong>
          </div>
        </div>

        <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={onOpenRelocationPlan}
            style={{
              width: '100%',
              background: '#0b2545',
              color: '#ffffff',
              border: 'none',
              borderRadius: '3px',
              padding: '5px 8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
          >
            <span>Review Relocation Plan</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
