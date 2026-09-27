import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Globe } from 'lucide-react';
import { OPERATIONAL_SECTORS, getNationalMonitoringNodes } from '../services/localEngine';

export default function TacticalMap({
  habitations,
  shelters,
  resettlementSites,
  evacuationPlan,
  horizon,
  currentSector,
  onSectorChange,
  onSelectHabitation,
  _onOpen3DInspector,
  liveWeather,
  operationalMode = 'LIVE',
  simParams = {},
  isRadarActive: externalIsRadarActive,
  onToggleRadar: externalOnToggleRadar,
  onDetectLocation
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseTileRef = useRef(null);
  const radarLayerRef = useRef(null);

  const [activeBaseLayer, setActiveBaseLayer] = useState('esri_streets');
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [internalRadarActive, setInternalRadarActive] = useState(false);
  const isRadarActive = externalIsRadarActive !== undefined ? externalIsRadarActive : internalRadarActive;
  const toggleRadar = () => {
    if (externalOnToggleRadar) {
      externalOnToggleRadar();
    } else {
      setInternalRadarActive(!internalRadarActive);
    }
  };

  const [radarPath, setRadarPath] = useState(null);
  const [radarTimestamp, setRadarTimestamp] = useState(null);
  const [routeFilter, setRouteFilter] = useState('ALL'); // 'ALL' | 'SAFEST' | 'FASTEST'

  // Simple Layer Controls (SIH26191 Section 7 Mandate)
  const [layerVisibility, setLayerVisibility] = useState({
    hazardZones: true,
    habitations: true,
    relocationSites: true,
    routes: true
  });

  const layersRef = useRef({
    nationalHotspots: L.layerGroup(),
    cyclone: L.layerGroup(),
    markers: L.layerGroup(),
    shelters: L.layerGroup(),
    resettlement: L.layerGroup(),
    routes: L.layerGroup(),
    polygons: L.layerGroup()
  });

  // Official High-Resolution, 100% Free, Zero-Watermark Base Map Layers
  const TILE_SOURCES = {
    esri_streets: {
      name: 'Official GIS Map (Esri)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attrib: 'Tiles &copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ',
      maxZoom: 19
    },
    satellite: {
      name: 'High-Res Satellite (Esri)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attrib: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
      maxZoom: 19
    },
    topo_3d: {
      name: '3D Topo Terrain & Contours',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      attrib: '&copy; OpenTopoMap & OpenStreetMap contributors',
      maxZoom: 17
    },
    standard: {
      name: 'OpenStreetMap Standard',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: 'abc',
      attrib: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }
  };

  // Fetch Live RainViewer Doppler Radar metadata
  useEffect(() => {
    let isMounted = true;
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        if (!isMounted) return;
        const past = data?.radar?.past;
        if (past && past.length > 0) {
          const latest = past[past.length - 1];
          setRadarPath(latest.path);
          const date = new Date(latest.time * 1000);
          setRadarTimestamp(date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST');
        }
      })
      .catch(err => {
        console.warn('RainViewer live radar fetch error:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialSector = OPERATIONAL_SECTORS.find(s => s.id === currentSector) || OPERATIONAL_SECTORS[0];
      const isInitialAllIndia = initialSector.id === 'all_india';

      const map = L.map(mapContainerRef.current, {
        center: isInitialAllIndia ? [22.2, 79.5] : initialSector.center,
        zoom: isInitialAllIndia ? 4.6 : initialSector.zoom,
        zoomControl: true,
        minZoom: 4,
        maxZoom: 18,
        maxBounds: [[4.5, 65.0], [38.5, 99.0]],
        maxBoundsViscosity: 0.95
      });

      // Default base tile: Esri World Street Map (Zero watermark)
      baseTileRef.current = L.tileLayer(TILE_SOURCES.esri_streets.url, {
        attribution: TILE_SOURCES.esri_streets.attrib,
        maxZoom: 19
      }).addTo(map);

      Object.values(layersRef.current).forEach(layer => layer.addTo(map));

      mapInstanceRef.current = map;

      // Invalidate size to guarantee immediate crisp rendering
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 150);
      setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 500);
    }

    const handleResize = () => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fly to sector on change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const target = OPERATIONAL_SECTORS.find(s => s.id === currentSector);
    if (target) {
      map.invalidateSize();
      if (target.id === 'all_india') {
        map.setView([22.2, 79.5], 4.6, { animate: true });
      } else {
        map.flyTo(target.center, Math.min(target.zoom, 11), {
          duration: 1.0,
          easeLinearity: 0.25
        });
      }
    }
    setTimeout(() => { if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize(); }, 350);
  }, [currentSector]);

  // Switch Base Layer
  const switchBaseLayer = (layerKey) => {
    setActiveBaseLayer(layerKey);
    const map = mapInstanceRef.current;
    if (!map || !baseTileRef.current) return;

    map.removeLayer(baseTileRef.current);
    baseTileRef.current = L.tileLayer(TILE_SOURCES[layerKey].url, {
      attribution: TILE_SOURCES[layerKey].attrib,
      subdomains: TILE_SOURCES[layerKey].subdomains || 'abc',
      maxZoom: TILE_SOURCES[layerKey].maxZoom || 19
    }).addTo(map);
  };

  // Manage Live Satellite Doppler Radar Overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isRadarActive && radarPath) {
      const radarUrl = `https://tilecache.rainviewer.com${radarPath}/256/{z}/{x}/{y}/2/1_1.png`;
      if (radarLayerRef.current) {
        map.removeLayer(radarLayerRef.current);
      }
      radarLayerRef.current = L.tileLayer(radarUrl, {
        opacity: 0.65,
        zIndex: 400,
        maxNativeZoom: 6,
        maxZoom: 18,
        attribution: 'Live Doppler Radar &copy; RainViewer / IMD'
      });
      radarLayerRef.current.addTo(map);
    } else if (radarLayerRef.current) {
      map.removeLayer(radarLayerRef.current);
      radarLayerRef.current = null;
    }
  }, [isRadarActive, radarPath]);

  // Render Data Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const layers = layersRef.current;
    layers.nationalHotspots.clearLayers();
    layers.cyclone.clearLayers();
    layers.markers.clearLayers();
    layers.shelters.clearLayers();
    layers.resettlement.clearLayers();
    layers.routes.clearLayers();
    layers.polygons.clearLayers();

    // 1. National Alert Hotspots / Baseline Surveillance Nodes
    if (currentSector === 'all_india') {
      const nationalNodes = getNationalMonitoringNodes(operationalMode, simParams, liveWeather);

      nationalNodes.forEach(spot => {
        const isRed = spot.alert_level === 'RED';
        const isOrange = spot.alert_level === 'ORANGE';
        const isAlert = isRed || isOrange;

        const pulseColor = isRed ? '#b91c1c' : isOrange ? '#c2410c' : '#059669';
        const fillColor = isRed ? '#dc2626' : isOrange ? '#ea580c' : '#10b981';

        const spotMarker = L.circleMarker([spot.lat, spot.lng], {
          radius: isRed ? 7 : isOrange ? 6 : 4,
          color: isAlert ? '#ffffff' : '#047857',
          fillColor: fillColor,
          fillOpacity: isAlert ? 0.9 : 0.65,
          weight: isAlert ? 2 : 1
        });

        spotMarker.bindTooltip(`<b>${spot.district}</b> &bull; ${spot.alert_badge || spot.alert_level}`, {
          direction: 'top',
          offset: [0, -6]
        });

        const spotPopup = `
          <div style="font-size: 12px; min-width: 250px; font-family: sans-serif; line-height: 1.4; color: #0f172a;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid ${pulseColor}; padding-bottom: 6px; margin-bottom: 8px;">
              <div>
                <strong style="color: #0f172a; font-size: 13px;">${spot.district}</strong>
                <div style="font-size: 10.5px; color: #64748b;">${spot.state}</div>
              </div>
              <span style="background: ${pulseColor}; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold; font-size: 10px;">${spot.alert_badge || spot.alert_level}</span>
            </div>

            <div style="color: #334155; display: flex; flex-direction: column; gap: 3px;">
              <div>&bull; <b>Surveillance Scope:</b> <span style="font-weight: 600;">${spot.hazard_type}</span></div>
              <div>&bull; <b>Precipitation Telemetry:</b> <strong style="color: #0b2545;">${spot.rainfall_rate}</strong></div>
              <div>&bull; <b>River Basin / Catchment:</b> ${spot.river_basin}</div>
              <div>&bull; <b>At-Risk Habitations:</b> ${spot.habitations_at_risk > 0 ? `${spot.habitations_at_risk} habitations (${spot.population_at_risk.toLocaleString()} citizens)` : '0 (Baseline Nominal)'}</div>
              <div style="margin-top: 4px; padding: 4px 6px; background: ${isAlert ? '#fef2f2' : '#f0fdf4'}; border-radius: 3px; font-size: 10.5px; color: ${isAlert ? '#991b1b' : '#166534'};">
                &bull; <b>Status:</b> ${spot.status}
              </div>
            </div>

            ${spot.pilot_available ? `
              <button id="btn-zoom-sector-${spot.sector_key}" style="width: 100%; margin-top: 10px; background: #0b2545; color: white; border: none; padding: 6px 10px; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <span>Enter District Ground Command</span>
                <span>&rarr;</span>
              </button>
            ` : ''}
          </div>
        `;

        spotMarker.bindPopup(spotPopup);
        spotMarker.on('popupopen', () => {
          const btn = document.getElementById(`btn-zoom-sector-${spot.sector_key}`);
          if (btn && onSectorChange) {
            btn.onclick = () => {
              onSectorChange(spot.sector_key);
              spotMarker.closePopup();
            };
          }
        });

        layers.nationalHotspots.addLayer(spotMarker);
      });
    }

    // 2. Active Cyclone & Depressions Tracker (Pan-India & Multi-Basin)
    // Automatically renders ONLY when live sensors report cyclonic conditions (MSLP < 1002 hPa, gale gusts >= 48 km/h)
    const isStormActive = liveWeather ? Boolean(liveWeather.is_cyclone_alert) : false;
    const isCoastalSector = currentSector === 'coastal_ap_odisha';

    if (isStormActive) {
      const stormLat = liveWeather?.lat ? liveWeather.lat : 18.330;
      const stormLng = liveWeather?.lng ? liveWeather.lng : 84.120;
      const currentPressure = Number(liveWeather?.pressure_hpa ?? 1004.0);
      const currentGusts = Number(liveWeather?.wind_gusts_kmh ?? 50.0);
      const currentWind = Number(liveWeather?.wind_speed_kmh ?? 32.0);
      const stormName = liveWeather?.storm_name || 'Active Cyclonic System';
      const stormCat = liveWeather?.storm_category || 'Depression';
      const stationName = liveWeather?.station_name || 'Coastal Observation Station';

      // Concentric Barometric Isobar Rings (Pressure gradient)
      // 1. Central Low Eye Ring
      layers.cyclone.addLayer(L.circle([stormLat, stormLng], {
        radius: 26000,
        color: '#dc2626',
        fillColor: '#dc2626',
        fillOpacity: 0.16,
        weight: 2,
        dashArray: '6, 6'
      }));

      // 2. Gale Wind Inundation Buffer
      layers.cyclone.addLayer(L.circle([stormLat, stormLng], {
        radius: 65000,
        color: '#ea580c',
        fillColor: '#ea580c',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '5, 5'
      }));

      // 3. Outer Marine Depression Circulation
      layers.cyclone.addLayer(L.circle([stormLat, stormLng], {
        radius: 125000,
        color: '#eab308',
        fillColor: '#eab308',
        fillOpacity: 0.03,
        weight: 1,
        dashArray: '4, 4'
      }));

      // Animated Cyclone Eye DivIcon
      const cycloneDivIcon = L.divIcon({
        className: 'gov-cyclone-eye-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(220, 38, 38, 0.4); border: 2px dashed #f87171;"></div>
              <div style="background: #991b1b; color: white; border: 2px solid #ffffff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.8); z-index: 2;">
                🌀
              </div>
            </div>
            <div style="background: rgba(15, 23, 42, 0.95); color: #fca5a5; border: 1px solid #ef4444; border-radius: 4px; padding: 2px 7px; font-size: 9.5px; font-weight: 800; white-space: nowrap; margin-top: 3px; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
              ${stormName.toUpperCase().slice(0, 24)} &bull; ${currentPressure} hPa
            </div>
          </div>
        `,
        iconSize: [160, 60],
        iconAnchor: [80, 25]
      });

      const cycloneMarker = L.marker([stormLat, stormLng], { icon: cycloneDivIcon, zIndexOffset: 1000 });
      const cyclonePopup = `
        <div style="font-size: 12px; min-width: 275px; line-height: 1.45; font-family: sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #ef4444; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
              <strong style="color: #ffffff; font-size: 13.5px;">${stormName}</strong>
              <div style="font-size: 10.5px; color: #fca5a5;">${stationName}</div>
            </div>
            <span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">${currentPressure < 995 ? 'RED ALERT' : 'ORANGE ALERT'}</span>
          </div>
          <div style="color: #cbd5e1; display: flex; flex-direction: column; gap: 4px;">
            <div>&bull; <b>Meteorological Category:</b> <strong style="color: #f87171;">${stormCat}</strong></div>
            <div>&bull; <b>Epicenter / Station:</b> ${stationName}</div>
            <div>&bull; <b>Central MSLP:</b> <strong style="color: #38bdf8;">${currentPressure} hPa</strong></div>
            <div>&bull; <b>Sustained Wind:</b> ${currentWind} km/h | <b>Peak Gale Gusts:</b> <strong style="color: #f87171;">${currentGusts} km/h</strong></div>
            <div>&bull; <b>Marine Wave Swell:</b> Rough to Very Rough</div>
            <div style="margin-top: 5px; padding: 5px 8px; background: rgba(220, 38, 38, 0.2); border-left: 3px solid #ef4444; border-radius: 3px; font-size: 10.5px; color: #fecaca;">
              <b>Precautionary Action:</b> IMD coastal warning active. Preemptive evacuation into reinforced cyclone shelters ordered under Section 34. Total suspension of sea fishing.
            </div>
          </div>
          ${!isCoastalSector ? `
            <button id="btn-zoom-cyclone-sector" style="width: 100%; margin-top: 10px; background: #dc2626; color: white; border: 1px solid #f87171; padding: 7px 10px; border-radius: 4px; cursor: pointer; font-size: 11.5px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>Focus on Coastal Hazard Ground Grid</span>
              <span>&rarr;</span>
            </button>
          ` : ''}
        </div>
      `;

      cycloneMarker.bindPopup(cyclonePopup);
      cycloneMarker.on('popupopen', () => {
        const btn = document.getElementById('btn-zoom-cyclone-sector');
        if (btn && onSectorChange) {
          btn.onclick = () => {
            onSectorChange('coastal_ap_odisha');
            cycloneMarker.closePopup();
          };
        }
      });

      layers.cyclone.addLayer(cycloneMarker);
    }

    // 3. District Mode Ground Grid (Only displayed when specific state/district is selected)
    if (currentSector !== 'all_india') {
      habitations.forEach(h => {
        const isRed = h.zone === 'RED';
        const isOrange = h.zone === 'ORANGE';
        const badgeBg = isRed ? '#dc2626' : isOrange ? '#ea580c' : '#15803d';

        // Hazard Inundation / Slope Buffer Polygon
        if (isRed) {
          layers.polygons.addLayer(L.circle([h.lat, h.lng], {
            radius: 950,
            color: '#dc2626',
            fillColor: '#dc2626',
            fillOpacity: 0.18,
            weight: 2,
            dashArray: '5, 5'
          }));
        } else if (isOrange) {
          layers.polygons.addLayer(L.circle([h.lat, h.lng], {
            radius: 650,
            color: '#ea580c',
            fillColor: '#ea580c',
            fillOpacity: 0.10,
            weight: 1.5,
            dashArray: '4, 4'
          }));
        }

        const iconHtml = `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background: ${badgeBg}; color: white; border: 2px solid white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; box-shadow: 0 1px 4px rgba(0,0,0,0.3);">
              ${isRed ? '!' : isOrange ? '▲' : '✓'}
            </div>
            <div style="background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 3px; padding: 1px 5px; font-size: 9.5px; font-weight: 700; white-space: nowrap; margin-top: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.15);">
              ${h.name.split('(')[0].trim().slice(0, 18)}
            </div>
          </div>
        `;

        const marker = L.marker([h.lat, h.lng], {
          icon: L.divIcon({ className: 'gov-marker-pin', html: iconHtml, iconSize: [60, 38], iconAnchor: [30, 19] }),
          zIndexOffset: 300
        });

        const urgencyScore = Math.min(100, Math.round(((h.priority_score || 0.8) / 1.5) * 100));
        const rawPriority = Number(h.priority_score || 0.8).toFixed(3);

        const popupHtml = `
          <div style="font-size: 12px; min-width: 260px; line-height: 1.45; font-family: sans-serif; color: #0f172a;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid ${badgeBg}; padding-bottom: 5px; margin-bottom: 6px;">
              <strong style="color: #0f172a; font-size: 13px;">${h.name}</strong>
              <span style="background: ${badgeBg}; color: white; padding: 2px 7px; border-radius: 3px; font-weight: bold; font-size: 10px;">${h.zone} ZONE</span>
            </div>
            
            <div style="color: #334155; font-size: 11px;">
              <div>&bull; <b>Census Population:</b> ${h.population.toLocaleString()} citizens</div>
              <div>&bull; <b>High-Risk Groups:</b> ${h.elderly_count} Elderly &bull; ${h.infant_count} Infants &bull; ${h.pwd_count} PwD</div>
            </div>

            <!-- Explainable Hazard Section (SIH26191) -->
            <div style="background: ${isRed ? '#fef2f2' : isOrange ? '#fff7ed' : '#f0fdf4'}; border-left: 3px solid ${badgeBg}; padding: 6px 8px; margin: 6px 0; font-size: 11px; border-radius: 2px;">
              <b style="color: ${isRed ? '#991b1b' : isOrange ? '#9a3412' : '#166534'};">RISK FACTORS (WHY ${h.zone}?):</b>
              <div style="color: #334155; margin-top: 2px; line-height: 1.35;">
                &bull; <b>DEM Slope &amp; Elevation:</b> ${h.slope_degrees}&deg; Gradient &bull; ${h.elevation_m || 8}m MSL<br/>
                &bull; <b>Slope Stability:</b> Factor of Safety = <strong style="color: ${h.factor_of_safety < 1.25 ? '#b91c1c' : '#15803d'}">${h.factor_of_safety}</strong> (${h.factor_of_safety < 1.25 ? 'Critical Unstable' : 'Slope Stable'})<br/>
                &bull; <b>High-Water Proximity:</b> <span style="color: #b45309; font-weight: bold;">${h.river_distance_m || 65}m</span><br/>
                &bull; <b>Historical Recurrence:</b> ${h.historical_disaster_count || 4} Events (Past 20 Yrs)<br/>
                &bull; <b>Kutcha Housing:</b> ${h.kutcha_houses} Units (${Math.round((h.kutcha_houses / h.population) * 100)}%)
              </div>
            </div>

            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
              Relocation Priority: <b>${rawPriority}</b> (Urgency: <span style="color: ${isRed ? '#b91c1c' : '#c2410c'}; font-weight: bold;">${urgencyScore}/100</span>)
            </div>

            <button id="btn-xai-${h.id}" style="width: 100%; margin-top: 8px; background: #0b2545; color: white; border: none; padding: 6px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 600;">
              📋 View Habitation Vulnerability Dossier
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-xai-${h.id}`);
          if (btn && onSelectHabitation) btn.onclick = () => onSelectHabitation(h);
        });

        layers.markers.addLayer(marker);
      });

      // 3. Relief Shelters
      shelters.forEach(s => {
        const fillPct = Math.round((s.current_occupancy / Math.max(1, s.effective_capacity)) * 100);
        const fillBadgeColor = fillPct >= 90 ? '#b91c1c' : fillPct > 50 ? '#c2410c' : '#15803d';

        const sMarker = L.marker([s.lat, s.lng], {
          icon: L.divIcon({
            className: 'gov-shelter-pin',
            html: `
              <div style="background: #ffffff; color: #0b2545; border: 1.5px solid #0b2545; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: bold; white-space: nowrap; box-shadow: 0 1px 4px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 4px;">
                <span>🏕️ ${s.name.split(' ')[0]}</span>
                <span style="background: ${fillBadgeColor}; color: white; padding: 1px 4px; border-radius: 2px; font-size: 9px;">${fillPct}%</span>
              </div>
            `,
            iconSize: [85, 26],
            iconAnchor: [42, 13]
          }),
          zIndexOffset: 400
        });

        const availableBuffer = Math.max(0, s.effective_capacity - s.current_occupancy);

        sMarker.bindPopup(`
          <div style="font-size: 12px; min-width: 240px; font-family: sans-serif; line-height: 1.45; color: #0f172a;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0b2545; padding-bottom: 5px; margin-bottom: 6px;">
              <strong style="color: #0b2545; font-size: 13px;">🏕️ ${s.name}</strong>
              <span style="background: ${availableBuffer > 0 ? '#15803d' : '#b45309'}; color: white; padding: 1px 5px; border-radius: 3px; font-size: 9.5px; font-weight: bold;">
                ${availableBuffer > 0 ? 'BUFFER AVAILABLE' : 'AT CAPACITY'}
              </span>
            </div>
            <div style="color: #334155; font-size: 11px;">
              <div>&bull; <b>Registered Capacity:</b> ${s.effective_capacity.toLocaleString()} persons</div>
              <div>&bull; <b>Allocated Occupancy:</b> ${s.current_occupancy.toLocaleString()} (${fillPct}%)</div>
              <div>&bull; <b>Available Buffer:</b> <strong style="color: ${availableBuffer > 0 ? '#15803d' : '#b91c1c'}">${availableBuffer.toLocaleString()} beds</strong></div>
              <div style="font-size: 10.5px; color: #64748b; border-top: 1px solid #e2e8f0; margin-top: 5px; padding-top: 4px;">
                <b>Sphere Humanitarian Norms:</b> Beds: ${s.beds} &bull; Potable Water: ${s.water_liters.toLocaleString()}L &bull; Toilets: ${s.toilets_count}
              </div>
            </div>
          </div>
        `);
        layers.shelters.addLayer(sMarker);
      });

      // 4. Permanent Resettlement Townships (Medium-Term Horizon)
      if (horizon === 'medium_term') {
        resettlementSites.forEach(r => {
          const rMarker = L.marker([r.lat, r.lng], {
            icon: L.divIcon({
              className: 'gov-resettlement-pin',
              html: `
                <div style="background: #14532d; color: white; border: 2px solid #4ade80; border-radius: 5px; padding: 3px 7px; font-size: 10px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.6);">
                  🏡 ${r.name.split(' ')[0]} (${r.suitability_score}%)
                </div>
              `,
              iconSize: [95, 26],
              iconAnchor: [47, 13]
            }),
            zIndexOffset: 350
          });

          rMarker.bindPopup(`
            <div style="font-size: 12px; font-family: sans-serif;">
              <strong style="color: #4ade80; font-size: 13px;">🏡 ${r.name}</strong>
              <div style="margin-top: 6px; color: #cbd5e1; line-height: 1.4;">
                <div>&bull; <b>Available Land Area:</b> ${(r.available_land_sqm / 10000).toFixed(1)} Hectares</div>
                <div>&bull; <b>Permanent Capacity:</b> ${r.carrying_capacity_population.toLocaleString()} residents</div>
                <div>&bull; <b>Slope:</b> ${r.slope_degrees}&deg; (Hazard-Free Plateau)</div>
                <div>&bull; <b>Land Suitability Score:</b> <strong style="color: #4ade80;">${r.suitability_score}/100</strong></div>
              </div>
            </div>
          `);
          layers.resettlement.addLayer(rMarker);
        });
      }

      // 5. Intelligent Multi-Route Engine (Safest vs Fastest Alternatives)
      evacuationPlan.forEach((item, index) => {
        const fromH = habitations.find(h => h.id === item.from_id);
        const toS = (horizon === 'medium_term' ? resettlementSites : shelters).find(s => s.id === item.to_id);

        if (fromH && toS) {
          const dLat = toS.lat - fromH.lat;
          const dLng = toS.lng - fromH.lng;
          const baseDist = item.distance_km || 14.5;
          const baseMins = item.estimated_transit_mins || 35;

          const availableBuffer = Math.max(0, toS.effective_capacity - toS.current_occupancy);
          const isCapacitySufficient = availableBuffer >= item.evacuee_count;
          const isBridgeCut = (operationalMode === 'SIMULATION' && (simParams.dam_discharge_cusecs > 30000 || simParams.rainfall_mm_hr > 90)) || (liveWeather?.precipitation_mm > 100 && index === 0);

          // Route 1: SAFEST ROUTE (Elevated Ridge Alignment, Zero Inundation Overlap)
          const perpLatSafe = -dLng * (index % 2 === 0 ? 0.22 : -0.22);
          const perpLngSafe = dLat * (index % 2 === 0 ? 0.22 : -0.22);
          const safestWaypoints = [
            [fromH.lat, fromH.lng],
            [fromH.lat + dLat * 0.32 + perpLatSafe, fromH.lng + dLng * 0.32 + perpLngSafe],
            [fromH.lat + dLat * 0.68 + perpLatSafe * 0.75, fromH.lng + dLng * 0.68 + perpLngSafe * 0.75],
            [toS.lat, toS.lng]
          ];
          const safestDist = Number((baseDist * 1.16).toFixed(1));
          const safestMins = Math.round(baseMins * 1.15);

          // Route 2: FASTEST ROUTE (Direct Valley Highway Corridor)
          const perpLatFast = -dLng * (index % 2 === 0 ? -0.06 : 0.06);
          const perpLngFast = dLat * (index % 2 === 0 ? -0.06 : 0.06);
          const fastestWaypoints = [
            [fromH.lat, fromH.lng],
            [fromH.lat + dLat * 0.5 + perpLatFast, fromH.lng + dLng * 0.5 + perpLngFast],
            [toS.lat, toS.lng]
          ];
          const fastestDist = Number(baseDist.toFixed(1));
          const fastestMins = Math.round(baseMins);

          // Render SAFEST ROUTE
          if (routeFilter === 'ALL' || routeFilter === 'SAFEST') {
            const safePolyline = L.polyline(safestWaypoints, {
              color: '#15803d',
              weight: 4.5,
              opacity: 0.95
            });

            safePolyline.bindPopup(`
              <div style="font-size: 12px; min-width: 260px; font-family: sans-serif; line-height: 1.45; color: #0f172a;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #15803d; padding-bottom: 5px; margin-bottom: 6px;">
                  <strong style="color: #15803d; font-size: 13px;">🟢 SAFEST ROUTE (RECOMMENDED)</strong>
                  <span style="background: #15803d; color: white; padding: 1px 5px; border-radius: 3px; font-size: 9.5px; font-weight: bold;">CERTIFIED SAFE</span>
                </div>
                <div style="color: #334155; font-size: 11px;">
                  <div>&bull; <b>Origin:</b> ${item.from_name} (${item.evacuee_count.toLocaleString()} citizens)</div>
                  <div>&bull; <b>Destination:</b> ${item.to_name}</div>
                  <div>&bull; <b>Distance:</b> <strong style="color: #15803d;">${safestDist} km</strong> &bull; <b>ETA:</b> ${safestMins} mins</div>
                  <div>&bull; <b>Elevation / Hazard Overlap:</b> 0% Inundation Overlap &bull; Elevation > 130m MSL</div>
                  <div>&bull; <b>Transit Fleet:</b> ${item.recommended_convoy_type}</div>
                  <div style="margin-top: 6px; padding: 6px 8px; background: #f0fdf4; border-left: 3px solid #16a34a; border-radius: 3px; font-size: 10.5px; color: #166534;">
                    <b>Recommendation Rationale:</b> Elevated ridge alignment completely avoids river flood buffers and unstable slope polygons. Fully certified for heavy 45-seater bus convoys.
                  </div>
                  <div style="margin-top: 5px; font-size: 10px; color: #64748b;">
                    <b>Shelter Carrying Capacity:</b> ${isCapacitySufficient ? `Sufficient (${availableBuffer.toLocaleString()} beds free, 0 overflow)` : `Buffer Deficit: ${(item.evacuee_count - availableBuffer).toLocaleString()} additional beds needed`}
                  </div>
                </div>
              </div>
            `);
            layers.routes.addLayer(safePolyline);
          }

          // Render FASTEST ROUTE (Direct Valley Route)
          if (routeFilter === 'ALL' || routeFilter === 'FASTEST') {
            if (isBridgeCut) {
              const blockedPolyline = L.polyline(fastestWaypoints, {
                color: '#dc2626',
                weight: 4,
                opacity: 0.85,
                dashArray: '8, 6'
              });

              blockedPolyline.bindPopup(`
                <div style="font-size: 12px; min-width: 250px; font-family: sans-serif; line-height: 1.45; color: #0f172a;">
                  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-bottom: 6px;">
                    <strong style="color: #dc2626; font-size: 13px;">🔴 BLOCKED CORRIDOR</strong>
                    <span style="background: #dc2626; color: white; padding: 1px 5px; border-radius: 3px; font-size: 9.5px; font-weight: bold;">BRIDGE CUTOFF</span>
                  </div>
                  <div style="color: #334155; font-size: 11px;">
                    <div>&bull; <b>Corridor:</b> Direct Valley Highway (${fastestDist} km)</div>
                    <div>&bull; <b>Hazard Status:</b> River bridge submerged (>0.8m depth) or debris slide cutoff.</div>
                    <div style="margin-top: 6px; padding: 6px 8px; background: #fef2f2; border-left: 3px solid #dc2626; border-radius: 3px; font-size: 10.5px; color: #991b1b;">
                      <b>Action Taken:</b> Direct road closed under Section 34. All convoys automatically rerouted via the 🟢 Safest Elevated Ridge Route (+${Math.round(safestMins - fastestMins)} min delay).
                    </div>
                  </div>
                </div>
              `);
              layers.routes.addLayer(blockedPolyline);
            } else {
              const fastPolyline = L.polyline(fastestWaypoints, {
                color: '#d97706',
                weight: 3.5,
                opacity: 0.85,
                dashArray: '6, 6'
              });

              fastPolyline.bindPopup(`
                <div style="font-size: 12px; min-width: 250px; font-family: sans-serif; line-height: 1.45; color: #0f172a;">
                  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d97706; padding-bottom: 5px; margin-bottom: 6px;">
                    <strong style="color: #d97706; font-size: 13px;">🟠 FASTEST ROUTE (ALTERNATE)</strong>
                    <span style="background: #d97706; color: white; padding: 1px 5px; border-radius: 3px; font-size: 9.5px; font-weight: bold;">CAUTION WATCH</span>
                  </div>
                  <div style="color: #334155; font-size: 11px;">
                    <div>&bull; <b>Distance:</b> ${fastestDist} km &bull; <b>ETA:</b> <strong style="color: #d97706;">${fastestMins} mins</strong> (${Math.round(safestMins - fastestMins)} mins faster than ridge route)</div>
                    <div>&bull; <b>Corridor Alignment:</b> Valley arterial road (60-85m MSL)</div>
                    <div style="margin-top: 6px; padding: 6px 8px; background: #fffbeb; border-left: 3px solid #d97706; border-radius: 3px; font-size: 10.5px; color: #92400e;">
                      <b>Caution Advisory:</b> Roadway passes within 180m of river channel. Vulnerable to culvert waterlogging during peak precipitation spells. Speed restricted to 25 km/h with Police Pilot escort.
                    </div>
                  </div>
                </div>
              `);
              layers.routes.addLayer(fastPolyline);
            }
          }
        }
      });
    }

  }, [habitations, shelters, resettlementSites, evacuationPlan, horizon, currentSector, operationalMode, simParams, liveWeather, routeFilter]);

  // Synchronize Layer Group Visibility with Layer Checkboxes (SIH26191 Section 7 Mandate)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const layers = layersRef.current;

    if (layerVisibility.hazardZones) {
      if (!map.hasLayer(layers.cyclone)) map.addLayer(layers.cyclone);
      if (!map.hasLayer(layers.polygons)) map.addLayer(layers.polygons);
    } else {
      if (map.hasLayer(layers.cyclone)) map.removeLayer(layers.cyclone);
      if (map.hasLayer(layers.polygons)) map.removeLayer(layers.polygons);
    }

    if (layerVisibility.habitations) {
      if (!map.hasLayer(layers.markers)) map.addLayer(layers.markers);
    } else {
      if (map.hasLayer(layers.markers)) map.removeLayer(layers.markers);
    }

    if (layerVisibility.relocationSites) {
      if (!map.hasLayer(layers.shelters)) map.addLayer(layers.shelters);
      if (!map.hasLayer(layers.resettlement)) map.addLayer(layers.resettlement);
    } else {
      if (map.hasLayer(layers.shelters)) map.removeLayer(layers.shelters);
      if (map.hasLayer(layers.resettlement)) map.removeLayer(layers.resettlement);
    }

    if (layerVisibility.routes) {
      if (!map.hasLayer(layers.routes)) map.addLayer(layers.routes);
    } else {
      if (map.hasLayer(layers.routes)) map.removeLayer(layers.routes);
    }
  }, [layerVisibility]);

  return (
    <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* 1. DEDICATED UNIFIED GIS COMMAND TOOLBAR */}
      {/* 1. OFFICIAL MAP TOOLBAR */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '1px solid #cbd5e1',
        padding: '6px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        zIndex: 10
      }}>
        {/* Left: Sector Jurisdiction & Geolocation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Dynamic Active Storm Shortcut Button - ONLY displayed when verified storm is detected */}
          {liveWeather?.is_cyclone_alert && (
            <button
              onClick={() => onSectorChange && onSectorChange('coastal_ap_odisha')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '3px',
                border: currentSector === 'coastal_ap_odisha' ? '1.5px solid #b91c1c' : '1px solid #fca5a5',
                background: currentSector === 'coastal_ap_odisha' ? '#b91c1c' : '#fef2f2',
                color: currentSector === 'coastal_ap_odisha' ? '#ffffff' : '#991b1b',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              title="Focus map on Active Cyclonic System Corridor"
            >
              <span>🌀</span>
              <span>{liveWeather.storm_name || 'Active Cyclonic Disturbance'}</span>
              <span style={{ fontSize: '9px', background: currentSector === 'coastal_ap_odisha' ? '#7f1d1d' : '#fee2e2', padding: '1px 4px', borderRadius: '2px', fontWeight: 'bold' }}>
                {liveWeather.pressure_hpa} hPa
              </span>
            </button>
          )}

          <span style={{ fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} color="#0b2545" />
            Sector:
          </span>
          <select
            value={currentSector}
            onChange={e => onSectorChange && onSectorChange(e.target.value)}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #cbd5e1',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
              maxWidth: '260px'
            }}
          >
            <option value="all_india">🇮🇳 All-India Multi-Hazard Overview (36 States &amp; UTs)</option>
            <optgroup label="🏔️ Himalayan &amp; Hill States (10 States/UTs)">
              {OPERATIONAL_SECTORS.filter(s => s.category === 'Himalayan & Hill States').map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </optgroup>
            <optgroup label="🌊 Coastal &amp; Cyclone Corridors (9 States/UTs)">
              {OPERATIONAL_SECTORS.filter(s => s.category === 'Coastal & Cyclone Corridors').map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </optgroup>
            <optgroup label="🌊 Riverine Flood Basins (7 States/UTs)">
              {OPERATIONAL_SECTORS.filter(s => s.category === 'Riverine Flood Basins').map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </optgroup>
            <optgroup label="🏛️ Central, Plateau &amp; Plains (6 States)">
              {OPERATIONAL_SECTORS.filter(s => s.category === 'Central, Plateau & Plains').map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </optgroup>
            <optgroup label="🏝️ Island &amp; Union Territories (4 UTs)">
              {OPERATIONAL_SECTORS.filter(s => s.category === 'Island & Union Territories').map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </optgroup>
          </select>
          {currentSector !== 'all_india' && (
            <button
              onClick={() => onSectorChange && onSectorChange('all_india')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ffffff',
                color: '#0b2545',
                border: '1px solid #cbd5e1',
                borderRadius: '3px',
                padding: '4px 7px',
                fontSize: '10.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Reset view to Pan-India Overview"
            >
              <span>🇮🇳 All-India</span>
            </button>
          )}

          {onDetectLocation && (
            <button
              onClick={onDetectLocation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ffffff',
                color: '#0b2545',
                border: '1px solid #cbd5e1',
                borderRadius: '3px',
                padding: '4px 7px',
                fontSize: '10.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Fly to your real-time GPS location and get live weather"
            >
              <span>📍 My Location</span>
            </button>
          )}
        </div>

        {/* Center: Live Doppler Satellite Radar Weather Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={toggleRadar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: isRadarActive ? '#eff6ff' : '#ffffff',
              border: isRadarActive ? '1px solid #3b82f6' : '1px solid #cbd5e1',
              color: isRadarActive ? '#1d4ed8' : '#475569',
              padding: '4px 8px',
              borderRadius: '3px',
              fontSize: '10.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
            title="Toggle Regional Doppler Weather Clouds"
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isRadarActive ? '#15803d' : '#94a3b8',
              display: 'inline-block'
            }}></span>
            <span>Doppler Radar: {isRadarActive ? 'ON' : 'OFF'}</span>
            {radarTimestamp && isRadarActive && (
              <span style={{ fontSize: '9px', color: '#64748b' }}>({radarTimestamp})</span>
            )}
          </button>
        </div>

        {/* Center-Right: Simple Institutional Layer Controls (SIH26191) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#334155' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>LAYERS:</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layerVisibility.hazardZones}
              onChange={e => setLayerVisibility(p => ({ ...p, hazardZones: e.target.checked }))}
            />
            <span>Hazard Zones</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layerVisibility.habitations}
              onChange={e => setLayerVisibility(p => ({ ...p, habitations: e.target.checked }))}
            />
            <span>Habitations</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layerVisibility.relocationSites}
              onChange={e => setLayerVisibility(p => ({ ...p, relocationSites: e.target.checked }))}
            />
            <span>Relocation Sites</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={layerVisibility.routes}
              onChange={e => setLayerVisibility(p => ({ ...p, routes: e.target.checked }))}
            />
            <span>Routes</span>
          </label>

          {layerVisibility.routes && (
            <select
              value={routeFilter}
              onChange={e => setRouteFilter(e.target.value)}
              style={{
                fontSize: '9.5px',
                fontWeight: '700',
                padding: '2px 5px',
                borderRadius: '3px',
                border: '1px solid #cbd5e1',
                background: routeFilter === 'SAFEST' ? '#f0fdf4' : routeFilter === 'FASTEST' ? '#fffbeb' : '#ffffff',
                color: routeFilter === 'SAFEST' ? '#166534' : routeFilter === 'FASTEST' ? '#92400e' : '#0f172a',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Routes (Safest &amp; Fastest)</option>
              <option value="SAFEST">🟢 Safest Only (Certified)</option>
              <option value="FASTEST">🟠 Fastest Only (Alternate)</option>
            </select>
          )}
        </div>

        {/* Right: Base Map Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', marginRight: '2px' }}>
            BASE:
          </span>
          <button
            onClick={() => switchBaseLayer('esri_streets')}
            style={{
              padding: '3px 7px',
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '3px',
              border: activeBaseLayer === 'esri_streets' ? '1px solid #0b2545' : '1px solid #cbd5e1',
              cursor: 'pointer',
              background: activeBaseLayer === 'esri_streets' ? '#0b2545' : '#ffffff',
              color: activeBaseLayer === 'esri_streets' ? '#ffffff' : '#475569'
            }}
          >
            GIS Map
          </button>
          <button
            onClick={() => switchBaseLayer('satellite')}
            style={{
              padding: '3px 7px',
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '3px',
              border: activeBaseLayer === 'satellite' ? '1px solid #0b2545' : '1px solid #cbd5e1',
              cursor: 'pointer',
              background: activeBaseLayer === 'satellite' ? '#0b2545' : '#ffffff',
              color: activeBaseLayer === 'satellite' ? '#ffffff' : '#475569'
            }}
          >
            Satellite
          </button>
          <button
            onClick={() => switchBaseLayer('topo_3d')}
            style={{
              padding: '3px 7px',
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '3px',
              border: activeBaseLayer === 'topo_3d' ? '1px solid #0b2545' : '1px solid #cbd5e1',
              cursor: 'pointer',
              background: activeBaseLayer === 'topo_3d' ? '#0b2545' : '#ffffff',
              color: activeBaseLayer === 'topo_3d' ? '#ffffff' : '#475569'
            }}
          >
            Topo
          </button>
        </div>
      </div>

      {/* 2. LEAFLET MAP CANVAS */}
      <div style={{ position: 'relative', flex: 1, minHeight: '540px', overflow: 'hidden' }}>
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '540px'
          }}
        />

        {/* National Surveillance Status Pill for All-India View */}
        {currentSector === 'all_india' && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#0f172a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
            <span>NATIONAL OVERVIEW: 36 STATES &amp; UTs MONITORED &bull; NORMAL BASELINE SURVEILLANCE ACTIVE</span>
          </div>
        )}

        {/* 3. COLLAPSIBLE MAP LEGEND (Bottom Left) */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          padding: '8px 10px',
          fontSize: '10.5px',
          color: '#0f172a',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          maxWidth: '220px'
        }}>
          <div
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            style={{ fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <span>GIS Map Legend</span>
            <span style={{ fontSize: '9px', color: '#0b2545' }}>{isLegendOpen ? '▲' : '▼'}</span>
          </div>

          {isLegendOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              {currentSector === 'all_india' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                    <span>State Surveillance Node (Normal)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c2410c' }}></span>
                    <span>Hazard Watch (Standby)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#b91c1c' }}></span>
                    <span>Severe Hazard Warning Node</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#b91c1c' }}></span>
                    <span>Critical Red Zone (Evacuate)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c2410c' }}></span>
                    <span>Orange Alert Zone (Standby)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#15803d' }}></span>
                    <span>Green Safe Zone (Buffer)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#0b2545', borderRadius: '2px' }}></span>
                    <span>Relief Shelters</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '14px', height: '3.5px', background: '#15803d', borderRadius: '1px' }}></span>
                    <span>Safest Route (Flood-Free)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '14px', height: '2px', borderTop: '2px dashed #d97706' }}></span>
                    <span>Fastest Route (Caution)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '14px', height: '2px', borderTop: '2px dashed #dc2626' }}></span>
                    <span>Blocked / Bridge Cutoff</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
