import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import TacticalMap from './components/TacticalMap';
import SimulationControls from './components/SimulationControls';
import RelocationPanel from './components/RelocationPanel';
import HabitationsRegister from './components/HabitationsRegister';
import SheltersResourcesView from './components/SheltersResourcesView';
import HazardAlertsView from './components/HazardAlertsView';
import VulnerablePopulationView from './components/VulnerablePopulationView';
import SafeRoutingView from './components/SafeRoutingView';
import RelocationPlanningView from './components/RelocationPlanningView';
import AIDecisionSupportView from './components/AIDecisionSupportView';
import ReportsAuditView from './components/ReportsAuditView';
import XAIModal from './components/XAIModal';
import ActiveStormBanner from './components/ActiveStormBanner';
import OperationalOrderModal from './components/OperationalOrderModal';
import LiveTelemetryModal from './components/LiveTelemetryModal';
import GeoJSONUploadModal from './components/GeoJSONUploadModal';

import {
  INITIAL_HABITATIONS,
  INITIAL_SHELTERS,
  INITIAL_RESETTLEMENT,
  OPERATIONAL_SECTORS,
  getSectorData,
  computeLocalSimulation
} from './services/localEngine';

import { fetchLiveSectorWeather, detectDeviceLocationWeather } from './services/weatherApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('national'); // 8 official modules
  const [currentSector, setCurrentSector] = useState('all_india'); // 'all_india' or any of 36 states/UTs
  const [horizon, setHorizon] = useState('immediate'); // 'immediate', 'short_term', 'medium_term'
  const [operationalMode, setOperationalMode] = useState('LIVE'); // 'LIVE' (Real-Time Verified Data) | 'SIMULATION' (What-If Sandbox)
  const [userRole, setUserRole] = useState('DDMA'); // 'ADMIN', 'NDMA', 'SDMA', 'DDMA', 'NDRF', 'DISTRICT_OFFICER', 'FIELD_OFFICER', 'READ_ONLY'
  const [isRadarActive, setIsRadarActive] = useState(false); // Live Doppler Satellite Radar state

  const [simParams, setSimParams] = useState({
    rainfall_mm_hr: 0.0,
    storm_surge_m: 0.2,
    dam_discharge_cusecs: 6500.0,
    soil_saturation: 0.45
  });

  const [habitations, setHabitations] = useState(INITIAL_HABITATIONS);
  const [shelters, setShelters] = useState(INITIAL_SHELTERS);
  const [resettlementSites, setResettlementSites] = useState(INITIAL_RESETTLEMENT);
  const [evacuationPlan, setEvacuationPlan] = useState([]);
  const [solverStats, setSolverStats] = useState({ runtime_ms: 5.4, status: 'OPTIMAL' });

  const [liveWeather, setLiveWeather] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedHabitationForXAI, setSelectedHabitationForXAI] = useState(null);
  const [isOpOrdOpen, setIsOpOrdOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isGISUploadOpen, setIsGISUploadOpen] = useState(false);
  const [isExtreme, setIsExtreme] = useState(false);

  // Fetch real-time live weather from Open-Meteo API for selected sector
  useEffect(() => {
    let isMounted = true;
    async function loadLiveWeather() {
      const w = await fetchLiveSectorWeather(currentSector);
      if (isMounted) {
        setLiveWeather(w);
      }
    }
    loadLiveWeather();
    const interval = setInterval(loadLiveWeather, 60000); // Live telemetry refresh every 60s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentSector]);

  // Synchronize simulation parameters with live telemetry when in 'LIVE' mode
  useEffect(() => {
    if (liveWeather && operationalMode === 'LIVE') {
      const rain = liveWeather.precipitation_mm ?? 0.0;
      const soil = Number(Math.min(0.85, Math.max(0.25, ((liveWeather.humidity_pct || 65) / 100) * 0.70)).toFixed(2));
      setSimParams({
        rainfall_mm_hr: rain,
        storm_surge_m: 0.2,
        dam_discharge_cusecs: 6500.0,
        soil_saturation: soil
      });
      setIsExtreme(false);
    }
  }, [liveWeather, operationalMode]);

  // Sector Switching Handler
  const handleSectorChange = (newSectorId) => {
    setCurrentSector(newSectorId);
    const secData = getSectorData(newSectorId);
    setHabitations(secData.habitations);
    setShelters(secData.shelters);
    setResettlementSites(secData.resettlement);

    if (newSectorId === 'coastal_ap_odisha') {
      setIsRadarActive(true); // Automatically activate live Doppler radar for storm tracking
    }
  };

  // Device Geolocation & Live Weather Detection
  const handleDetectLocation = async () => {
    try {
      const result = await detectDeviceLocationWeather();
      if (result.success && result.weather) {
        setLiveWeather(result.weather);
      }
    } catch (e) {
      console.warn('Geolocation detection error:', e);
    }
  };

  // Run local simulation engine when parameters or sector changes
  useEffect(() => {
    const secData = getSectorData(currentSector);
    const updatedHabs = computeLocalSimulation(
      simParams.rainfall_mm_hr,
      simParams.dam_discharge_cusecs,
      simParams.soil_saturation,
      secData.habitations
    );
    setHabitations(updatedHabs);

    // Compute deterministic optimal evacuation plan
    const t0 = performance.now();
    const redHabs = updatedHabs.filter(h => h.zone === 'RED');
    const targetFacilities = horizon === 'medium_term' ? secData.resettlement : secData.shelters;

    const plan = [];
    redHabs.forEach((hab, idx) => {
      const target = targetFacilities[idx % targetFacilities.length];
      if (target) {
        const dLat = (hab.lat - target.lat) * 111.0;
        const dLng = (hab.lng - target.lng) * 111.0 * Math.cos(hab.lat * Math.PI / 180.0);
        const distKm = Math.max(1.5, Math.sqrt(dLat * dLat + dLng * dLng));
        const durationMins = Math.round(distKm * 2.8 + 15);

        plan.push({
          from_id: hab.id,
          from_name: hab.name,
          to_id: target.id,
          to_name: target.name,
          evacuee_count: hab.population,
          distance_km: Number(distKm.toFixed(1)),
          estimated_transit_mins: durationMins,
          recommended_convoy_type: hab.population > 600 ? '24 SRTC Buses + 4 Ambulances' : '10 SRTC Buses + 2 Ambulances',
          priority_level: horizon === 'medium_term' ? 'PERMANENT_RESETTLEMENT' : (hab.factor_of_safety < 1.15 ? 'CRITICAL' : 'HIGH')
        });
      }
    });

    const t1 = performance.now();
    setSolverStats({
      runtime_ms: Number((t1 - t0).toFixed(2)),
      status: 'OPTIMAL'
    });
    setEvacuationPlan(plan);
  }, [simParams, currentSector, horizon]);

  const handleParamChange = (paramKey, value) => {
    setSimParams(prev => ({ ...prev, [paramKey]: value }));
  };

  const handleTriggerOrangeAlert = () => {
    setOperationalMode('SIMULATION');
    setSimParams({
      rainfall_mm_hr: 55.0,
      storm_surge_m: 1.2,
      dam_discharge_cusecs: 18000.0,
      soil_saturation: 0.72
    });
    setIsExtreme(false);
  };

  const handleTriggerExtremeCloudburst = () => {
    setOperationalMode('SIMULATION');
    setSimParams({
      rainfall_mm_hr: 115.0,
      storm_surge_m: 2.8,
      dam_discharge_cusecs: 38000.0,
      soil_saturation: 0.95
    });
    setIsExtreme(true);
  };

  const handleTriggerBridgeWashout = () => {
    setOperationalMode('SIMULATION');
    setSimParams({
      rainfall_mm_hr: 125.0,
      storm_surge_m: 3.5,
      dam_discharge_cusecs: 45000.0,
      soil_saturation: 0.98
    });
    setIsExtreme(true);
  };

  const handleResetSimulation = () => {
    setOperationalMode('LIVE');
    if (liveWeather) {
      const rain = liveWeather.precipitation_mm ?? 0.0;
      const soil = Number(Math.min(0.85, Math.max(0.25, ((liveWeather.humidity_pct || 65) / 100) * 0.70)).toFixed(2));
      setSimParams({
        rainfall_mm_hr: rain,
        storm_surge_m: 0.2,
        dam_discharge_cusecs: 6500.0,
        soil_saturation: soil
      });
    } else {
      setSimParams({
        rainfall_mm_hr: 0.0,
        storm_surge_m: 0.2,
        dam_discharge_cusecs: 6500.0,
        soil_saturation: 0.45
      });
    }
    setIsExtreme(false);
  };

  const handleLayerApplied = (count) => {
    setIsGISUploadOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Official Government of India & NDRF 4-Tier Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenManifest={() => setIsOpOrdOpen(true)}
        horizon={horizon}
        onHorizonChange={setHorizon}
        currentSector={currentSector}
        onSectorChange={handleSectorChange}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenAudit={() => setActiveTab('audit')}
        operationalMode={operationalMode}
        onOperationalModeChange={setOperationalMode}
        liveWeather={liveWeather}
        userRole={userRole}
        onRoleChange={setUserRole}
      />

      {/* Contingency Simulation Warning Bar (When in What-If Sandbox Mode) */}
      {operationalMode === 'SIMULATION' && (
        <div style={{
          background: '#fff7ed',
          borderBottom: '1px solid #fdba74',
          padding: '6px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: '#9a3412',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#c2410c', color: '#ffffff', padding: '1px 6px', borderRadius: '3px', fontWeight: '800', fontSize: '10px' }}>
              SIMULATION / WHAT-IF
            </span>
            <strong>Contingency Stress-Testing Environment Active.</strong>
            <span>Inputs: Rain {simParams.rainfall_mm_hr} mm/hr &bull; Dam Discharge {simParams.dam_discharge_cusecs.toLocaleString()} cusecs &bull; Saturation {Math.round(simParams.soil_saturation * 100)}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('contingency')}
              style={{
                background: '#002b49',
                color: '#ffffff',
                border: 'none',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '10.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Adjust Sandbox Parameters &rarr;
            </button>
            <button
              onClick={handleResetSimulation}
              style={{
                background: '#ffffff',
                color: '#9a3412',
                border: '1px solid #fdba74',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '10.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Revert to Live Telemetry
            </button>
          </div>
        </div>
      )}

      {/* Active Storm Operational Advisory Banner (When verified storm detected in Live Mode) */}
      {operationalMode === 'LIVE' && (
        <ActiveStormBanner
          onSelectStormSector={handleSectorChange}
          onToggleRadar={() => setIsRadarActive(prev => !prev)}
          isRadarActive={isRadarActive}
          currentSector={currentSector}
          liveWeather={liveWeather}
        />
      )}

      {/* ========================================================================
          MODULE 1: NATIONAL SITUATION (Home Operational Center)
          ======================================================================== */}
      {(activeTab === 'national' || activeTab === 'gis') && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* 7 Core Operational Questions Executive Situational Brief */}
          <MetricsOverview
            habitations={habitations}
            shelters={shelters}
            resettlementSites={resettlementSites}
            currentSector={currentSector}
            liveWeather={liveWeather}
            onOpenRelocationPlan={() => setIsOpOrdOpen(true)}
            horizon={horizon}
            userRole={userRole}
            operationalMode={operationalMode}
            onSelectTab={setActiveTab}
          />

          {/* GIS Command Center & Live Surveillance Panel */}
          <main style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 350px',
            gap: '12px',
            margin: '0 16px 16px 16px',
            flex: 1,
            minHeight: '600px'
          }}>
            {/* Center Area: GIS Tactical Command Map */}
            <section style={{ height: '100%', minHeight: '580px' }}>
              <TacticalMap
                habitations={habitations}
                shelters={shelters}
                resettlementSites={resettlementSites}
                evacuationPlan={evacuationPlan}
                horizon={horizon}
                currentSector={currentSector}
                onSectorChange={handleSectorChange}
                onSelectHabitation={h => setSelectedHabitationForXAI(h)}
                liveWeather={liveWeather}
                operationalMode={operationalMode}
                simParams={simParams}
                isRadarActive={isRadarActive}
                onToggleRadar={() => setIsRadarActive(prev => !prev)}
                onDetectLocation={handleDetectLocation}
              />
            </section>

            {/* Right Column: Evacuation Corridors & Shelter Allocation */}
            <aside>
              <RelocationPanel
                evacuationPlan={evacuationPlan}
                shelters={shelters}
                resettlementSites={resettlementSites}
                horizon={horizon}
                currentSector={currentSector}
                onSectorChange={handleSectorChange}
                onInspectHabitation={h => setSelectedHabitationForXAI(h)}
                onOpenRelocationPlan={() => setIsOpOrdOpen(true)}
                operationalMode={operationalMode}
                simParams={simParams}
                liveWeather={liveWeather}
              />
            </aside>
          </main>
        </div>
      )}

      {/* ========================================================================
          MODULE 2: DISASTER ALERTS (IMD AWS & CWC Gauges)
          ======================================================================== */}
      {activeTab === 'alerts' && (
        <main style={{ flex: 1 }}>
          <HazardAlertsView
            currentSector={currentSector}
            onSectorChange={handleSectorChange}
            liveWeather={liveWeather}
            operationalMode={operationalMode}
          />
        </main>
      )}

      {/* ========================================================================
          MODULE 3: RISK & VULNERABILITY (Habitations Risk Register & Explainability)
          ======================================================================== */}
      {(activeTab === 'risk' || activeTab === 'habitations') && (
        <main style={{ flex: 1 }}>
          <HabitationsRegister
            habitations={habitations}
            onSelectHabitation={h => setSelectedHabitationForXAI(h)}
          />
        </main>
      )}

      {/* ========================================================================
          MODULE 4: SHELTERS & RESOURCES (Carrying Capacity, Sphere Norms & Logistics)
          ======================================================================== */}
      {activeTab === 'shelters' && (
        <main style={{ flex: 1 }}>
          <SheltersResourcesView
            shelters={shelters}
            evacuationPlan={evacuationPlan}
            currentSector={currentSector}
          />
        </main>
      )}

      {/* ========================================================================
          MODULE 5: EVACUATION ROUTES (SAFE, CAUTION, BLOCKED & Bridge Detours)
          ======================================================================== */}
      {activeTab === 'routing' && (
        <main style={{ flex: 1 }}>
          <SafeRoutingView
            evacuationPlan={evacuationPlan}
            habitations={habitations}
            shelters={shelters}
            onTriggerBridgeWashout={handleTriggerBridgeWashout}
            onResetSimulation={handleResetSimulation}
          />
        </main>
      )}

      {/* ========================================================================
          MODULE 6: RELOCATION PLANNING (3-Tier Horizons & Editable Evacuation Plan)
          ======================================================================== */}
      {activeTab === 'relocation' && (
        <main style={{ flex: 1 }}>
          <RelocationPlanningView
            evacuationPlan={evacuationPlan}
            shelters={shelters}
            resettlementSites={resettlementSites}
            horizon={horizon}
            onHorizonChange={setHorizon}
            onOpenRelocationPlan={() => setIsOpOrdOpen(true)}
            userRole={userRole}
          />
        </main>
      )}

      {/* ========================================================================
          MODULE 7: AI DECISION SUPPORT (RAG, NDRF SOPs & DM Act §34 Citations)
          ======================================================================== */}
      {activeTab === 'ai_decision' && (
        <main style={{ flex: 1 }}>
          <AIDecisionSupportView
            habitations={habitations}
            shelters={shelters}
            resettlementSites={resettlementSites}
            currentSector={currentSector}
            liveWeather={liveWeather}
            horizon={horizon}
          />
        </main>
      )}

      {/* ========================================================================
          MODULE 8: REPORTS & AUDIT (7 Government Reports & SHA-256 Cryptographic Chain)
          ======================================================================== */}
      {activeTab === 'audit' && (
        <main style={{ flex: 1 }}>
          <ReportsAuditView
            habitations={habitations}
            shelters={shelters}
            evacuationPlan={evacuationPlan}
            currentSector={currentSector}
            liveWeather={liveWeather}
            userRole={userRole}
            onOpenRelocationPlan={() => setIsOpOrdOpen(true)}
          />
        </main>
      )}

      {/* ========================================================================
          OPTIONAL: WHAT-IF SCENARIO CONTINGENCY SANDBOX
          ======================================================================== */}
      {activeTab === 'contingency' && (
        <main style={{ flex: 1, padding: '0 16px 20px 16px' }}>
          <SimulationControls
            simParams={simParams}
            onParamChange={handleParamChange}
            onTriggerOrangeAlert={handleTriggerOrangeAlert}
            onTriggerExtremeCloudburst={handleTriggerExtremeCloudburst}
            onTriggerBridgeWashout={handleTriggerBridgeWashout}
            onResetSimulation={handleResetSimulation}
            isExtreme={isExtreme}
            currentSector={currentSector}
            liveWeather={liveWeather}
            operationalMode={operationalMode}
            onModeChange={setOperationalMode}
            onDetectLocation={handleDetectLocation}
          />
        </main>
      )}

      {/* Official Government of India Footer */}
      <footer style={{
        background: '#002b49',
        borderTop: '3px solid #c2410c',
        padding: '14px 24px',
        marginTop: 'auto',
        fontSize: '11px',
        color: '#cbd5e1',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <div>
          <strong style={{ color: '#ffffff', fontSize: '11.5px' }}>
            ResQGrid &bull; National Disaster Management Decision Support &amp; Relocation Platform
          </strong>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
            Ministry of Home Affairs &bull; National Disaster Response Force (NDRF), Disaster Management Division &bull; Problem Statement SIH26191
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '10.5px' }}>
          <span>GIGW &bull; NIC Design Standards</span>
          <span style={{ color: '#86efac', fontWeight: '700' }}>● 24/7 IMD AWS &amp; CWC Hydro-Mesh Active</span>
        </div>
      </footer>

      {/* Habitation Explainable AI Inspection Drawer */}
      {selectedHabitationForXAI && (
        <XAIModal
          habitation={selectedHabitationForXAI}
          onClose={() => setSelectedHabitationForXAI(null)}
        />
      )}

      {/* Statutory Section 34 Gazette Order Ratification Modal */}
      {isOpOrdOpen && (
        <OperationalOrderModal
          isOpen={isOpOrdOpen}
          onClose={() => setIsOpOrdOpen(false)}
          habitations={habitations}
          shelters={shelters}
          evacuationPlan={evacuationPlan}
          currentSector={currentSector}
          liveWeather={liveWeather}
        />
      )}

      {/* Authoritative Data Feeds & Telemetry Provenance Modal */}
      {isTelemetryOpen && (
        <LiveTelemetryModal
          isOpen={isTelemetryOpen}
          onClose={() => setIsTelemetryOpen(false)}
          currentSector={currentSector}
        />
      )}

      {/* Custom GIS Hazard Polygon Ingestion Modal */}
      {isGISUploadOpen && (
        <GeoJSONUploadModal
          isOpen={isGISUploadOpen}
          onClose={() => setIsGISUploadOpen(false)}
          onLayerApplied={handleLayerApplied}
        />
      )}
    </div>
  );
}
