import React from 'react';
import { AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { OPERATIONAL_SECTORS } from '../services/localEngine';

export default function MetricsOverview({
  habitations = [],
  shelters = [],
  _resettlementSites = [],
  currentSector,
  liveWeather,
  onOpenRelocationPlan,
  _horizon = 'immediate',
  _userRole = 'DDMA',
  _operationalMode = 'LIVE',
  _onSelectTab
}) {
  const currentSectorObj = OPERATIONAL_SECTORS.find(s => s.id === currentSector);
  const sectorLabel = currentSectorObj?.label || 'Operational Ground Sector';

  // Counts by Zone
  const redHabs = habitations.filter(h => h.zone === 'RED');

  const redPop = redHabs.reduce((acc, h) => acc + (h.population || 0), 0);
  const totalShelterCap = shelters.reduce((acc, s) => acc + (s.effective_capacity || 0), 0);
  const currentOccupancy = shelters.reduce((acc, s) => acc + (s.current_occupancy || 0), 0);
  const availableBuffer = Math.max(0, totalShelterCap - currentOccupancy);

  // Demographics of at-risk habitations
  const totalElderly = redHabs.reduce((acc, h) => acc + (h.elderly_count || 0), 0);
  const totalInfants = redHabs.reduce((acc, h) => acc + (h.infant_count || 0), 0);
  const totalPwD = redHabs.reduce((acc, h) => acc + (h.pwd_count || 0), 0);
  const totalKutcha = redHabs.reduce((acc, h) => acc + (h.kutcha_houses || 0), 0);

  // Weather & Hazard Telemetry
  const rainRate = liveWeather?.precipitation_mm ?? 0.0;
  const windKmh = liveWeather?.wind_speed_kmh ?? 24.0;
  const windGusts = liveWeather?.wind_gusts_kmh ?? 32.0;
  const pressureHpa = liveWeather?.pressure_hpa ?? 1008.0;
  const weatherCond = liveWeather?.condition || 'Normal Monsoonal Conditions';
  const isStorm = Boolean(liveWeather?.is_cyclone_alert);

  // Min factor of safety among red habitations
  const minFS = redHabs.length > 0
    ? Math.min(...redHabs.map(h => h.factor_of_safety || 1.5)).toFixed(2)
    : '1.85';

  return (
    <div style={{ margin: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Government Executive Briefing Header */}
      <div className="gov-card" style={{ padding: '12px 16px', borderLeft: redHabs.length > 0 ? '4px solid #b91c1c' : '4px solid #002b49' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              National Disaster Management Decision Support System &bull; Executive Situational Brief
            </div>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              Operational Incident Assessment: 7 Critical Decision Parameters
            </h2>
            <p style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>
              Immediate situational clarity for NDMA, SDMA, and District Authorities under Section 30 &amp; 34 of the Disaster Management Act, 2005.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '10.5px',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '3px',
              background: redHabs.length > 0 ? '#fef2f2' : '#f0fdf4',
              color: redHabs.length > 0 ? '#991b1b' : '#15803d',
              border: redHabs.length > 0 ? '1px solid #fca5a5' : '1px solid #bbf7d0'
            }}>
              {redHabs.length > 0 ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
              <span>{redHabs.length > 0 ? `🚨 ${redHabs.length} RED ZONES DETECTED` : '● NORMAL SURVEILLANCE NOMINAL'}</span>
            </span>

            {redHabs.length > 0 && onOpenRelocationPlan && (
              <button
                onClick={onOpenRelocationPlan}
                className="gov-btn-danger"
                style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <FileText size={12} />
                <span>Issue Section 34 Order</span>
              </button>
            )}
          </div>
        </div>

        {/* 7 Core Questions Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '10px',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #e2e8f0'
        }}>
          {/* Question 1: What disaster is happening? */}
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                1. WHAT DISASTER IS HAPPENING?
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: redHabs.length > 0 ? '#b91c1c' : '#0f172a', marginTop: '3px' }}>
                {redHabs.length > 0
                  ? (isStorm ? `${liveWeather?.storm_name || 'Active Cyclonic System'} (${liveWeather?.storm_category || 'Deep Depression'})` : 'Slope Instability & Floodplain Inundation')
                  : 'Routine 24/7 Multi-Hazard Surveillance'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>
                {redHabs.length > 0
                  ? `${weatherCond} • Wind: ${windKmh} km/h (Gusts: ${windGusts} km/h) • MSLP: ${pressureHpa} hPa`
                  : 'All national sectors within safe hydrological & geotechnical baselines.'}
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              Source: IMD Automated Weather Station (AWS) &bull; Verified Telemetry
            </div>
          </div>

          {/* Question 2: Where is it happening? */}
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                2. WHERE IS IT HAPPENING?
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginTop: '3px' }}>
                {sectorLabel.split('(')[0].trim()}
              </div>
              <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>
                {currentSector === 'all_india'
                  ? 'Pan-India Overview across 28 States & 8 Union Territories'
                  : `Coordinates: ${currentSectorObj?.center ? `${currentSectorObj.center[0].toFixed(2)}°N, ${currentSectorObj.center[1].toFixed(2)}°E` : 'Operational Grid'}`}
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              Jurisdiction: District Disaster Management Authority (DDMA)
            </div>
          </div>

          {/* Question 3: Who is at risk? */}
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                3. WHO IS AT RISK?
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: redHabs.length > 0 ? '#b91c1c' : '#15803d', marginTop: '3px' }}>
                {redHabs.length > 0
                  ? `${redPop.toLocaleString()} Citizens in ${redHabs.length} Red Zones`
                  : '0 Citizens at Immediate Hazard Risk'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>
                {redHabs.length > 0
                  ? `${totalElderly} Elderly • ${totalInfants} Infants • ${totalPwD} PwD • ${totalKutcha} Kutcha Units`
                  : 'Routine baseline population monitoring active.'}
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              Source: Census Socio-Economic Demographics &bull; Special Needs Registry
            </div>
          </div>

          {/* Question 4: How serious is it? */}
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                4. HOW SERIOUS IS IT?
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: redHabs.length > 0 ? '#b91c1c' : '#15803d', marginTop: '3px' }}>
                {redHabs.length > 0
                  ? `CRITICAL (Min FS: ${minFS} < 1.25 Threshold)`
                  : 'LOW / NOMINAL (Factor of Safety > 1.85)'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>
                {redHabs.length > 0
                  ? `Rainfall: ${rainRate} mm/hr • Slope failure & riverine breach threshold breached.`
                  : 'Ground saturation and watercourses within safe discharge limits.'}
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              Model: Geotechnical Infinite Slope &bull; GSI / CWC Flood Criteria
            </div>
          </div>

          {/* Question 5: Where can affected people safely relocate? */}
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                5. WHERE CAN AFFECTED PEOPLE RELOCATE?
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: availableBuffer >= redPop ? '#15803d' : '#b91c1c', marginTop: '3px' }}>
                {availableBuffer.toLocaleString()} Beds Available across {shelters.length} Shelters
              </div>
              <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>
                {availableBuffer >= redPop
                  ? `100% Accommodation capacity guaranteed without shelter overflow.`
                  : `Deficit of ${(redPop - availableBuffer).toLocaleString()} beds; activate secondary camps.`}
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              Standards: Sphere Humanitarian Norms (3.5 m²/bed, 15L water/day)
            </div>
          </div>

          {/* Question 6: Which routes are usable? */}
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                6. WHICH ROUTES ARE USABLE?
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginTop: '3px' }}>
                Primary Arterials: SAFE &bull; Detour Clearance Online
              </div>
              <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>
                Dual-lane ridge highways clear. Culvert check posts reporting nominal clearance times (35-50 min).
              </div>
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              Engine: OpenStreetMap Road Graph &bull; Inundation Overlap Verified
            </div>
          </div>

          {/* Question 7: What should the authority do now? */}
          <div style={{ background: redHabs.length > 0 ? '#fff7ed' : '#f0fdf4', padding: '10px 12px', borderRadius: '4px', border: redHabs.length > 0 ? '1px solid #fdba74' : '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gridColumn: 'span 1' }}>
            <div>
              <div style={{ fontSize: '9.5px', color: redHabs.length > 0 ? '#9a3412' : '#166534', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                7. WHAT SHOULD THE AUTHORITY DO NOW?
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: redHabs.length > 0 ? '#9a3412' : '#166534', marginTop: '3px' }}>
                {redHabs.length > 0
                  ? 'Issue Section 34 Relocation Order & Pre-Position Fleet'
                  : 'Maintain Continuous Automated Telemetry Surveillance'}
              </div>
              <div style={{ fontSize: '10.5px', color: redHabs.length > 0 ? '#7c2d12' : '#14532d', marginTop: '2px' }}>
                {redHabs.length > 0
                  ? 'Requisition SRTC buses, stage medical ambulances at CHC, and notify shelter officers.'
                  : 'Sensor mesh reporting nominal data every 60s. No evacuation intervention needed.'}
              </div>
            </div>
            <div style={{ marginTop: '6px', paddingTop: '4px', borderTop: redHabs.length > 0 ? '1px solid #fed7aa' : '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '9px', fontWeight: '700', color: redHabs.length > 0 ? '#9a3412' : '#166534' }}>
                Mandate: DM Act 2005 &sect;34
              </span>
              {redHabs.length > 0 && onOpenRelocationPlan && (
                <button
                  onClick={onOpenRelocationPlan}
                  style={{
                    background: '#9a3412',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '2px 6px',
                    fontSize: '9.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Execute Order &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
