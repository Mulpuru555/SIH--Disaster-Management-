import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Mountain, Globe } from 'lucide-react';
import { OPERATIONAL_SECTORS, NATIONAL_HOTSPOTS } from '../services/localEngine';

export default function TacticalMap({
  habitations,
  shelters,
  resettlementSites,
  evacuationPlan,
  horizon,
  currentSector,
  onSectorChange,
  onSelectHabitation,
  onOpen3DInspector,
  liveWeather,
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

  const [isPerspective3D, setIsPerspective3D] = useState(false); // 3D Perspective Tilt on Map
  const [radarPath, setRadarPath] = useState(null);
  const [radarTimestamp, setRadarTimestamp] = useState(null);

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

    // 1. National Alert Hotspots (ONLY displayed on All-India National Overview to prevent pin clumping!)
    if (currentSector === 'all_india') {
      NATIONAL_HOTSPOTS.forEach(spot => {
        const isRed = spot.alert_level === 'RED';
        const pulseColor = isRed ? '#dc2626' : '#ea580c';

        const nationalIcon = L.divIcon({
          className: 'gov-national-hotspot-pin',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: ${pulseColor}; opacity: 0.35;"></div>
                <div style="background: ${pulseColor}; color: white; border: 2px solid #ffffff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.6); z-index: 2;">
                  ${isRed ? '🚨' : '⚠️'}
                </div>
              </div>
              <div style="background: rgba(7, 25, 47, 0.95); color: #ffffff; border: 1px solid #1e3a5f; border-radius: 4px; padding: 2px 6px; font-size: 9.5px; font-weight: 700; white-space: nowrap; margin-top: 2px; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
                ${spot.district.split(' ')[0]} &bull; ${spot.alert_level}
              </div>
            </div>
          `,
          iconSize: [110, 46],
          iconAnchor: [55, 23]
        });

        const spotMarker = L.marker([spot.lat, spot.lng], { icon: nationalIcon, zIndexOffset: 500 });

        const spotPopup = `
          <div style="font-size: 12px; min-width: 250px; font-family: sans-serif; line-height: 1.4;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid ${pulseColor}; padding-bottom: 6px; margin-bottom: 8px;">
              <div>
                <strong style="color: #ffffff; font-size: 13px;">${spot.district}</strong>
                <div style="font-size: 10.5px; color: #94a3b8;">${spot.state}</div>
              </div>
              <span style="background: ${pulseColor}; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">${spot.alert_level} ALERT</span>
            </div>

            <div style="color: #cbd5e1; display: flex; flex-direction: column; gap: 3px;">
              <div>&bull; <b>Primary Threat:</b> <span style="color: #f87171;">${spot.hazard_type}</span></div>
              <div>&bull; <b>Precipitation / Runoff:</b> <strong style="color: #38bdf8;">${spot.rainfall_rate}</strong></div>
              <div>&bull; <b>River Basin / Catchment:</b> ${spot.river_basin}</div>
              <div>&bull; <b>At-Risk Population:</b> ${spot.population_at_risk.toLocaleString()} citizens (${spot.habitations_at_risk} habitations)</div>
              <div style="margin-top: 4px; padding: 4px 6px; background: rgba(30, 58, 95, 0.4); border-radius: 4px; font-size: 10.5px; color: #34d399;">
                &bull; <b>Status:</b> ${spot.status}
              </div>
            </div>

            ${spot.pilot_available ? `
              <button id="btn-zoom-sector-${spot.sector_key}" style="width: 100%; margin-top: 10px; background: #1d4ed8; color: white; border: 1px solid #3b82f6; padding: 7px 10px; border-radius: 4px; cursor: pointer; font-size: 11.5px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <span>Zoom to District Ground Command</span>
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
    // Automatically renders whenever live sensors report cyclonic conditions (pressure < 1002 hPa, gale gusts >= 48 km/h)
    // or when the user specifically selects the coastal storm testbed sector ('cyclone_arnab') or views all_india.
    const isStormActive = liveWeather ? Boolean(liveWeather.is_cyclone_alert) : false;
    const isStormSector = currentSector === 'cyclone_arnab';
    const isAllIndia = currentSector === 'all_india';

    // Condition to render cyclone layer:
    // 1) User is in 'cyclone_arnab' sector
    // 2) Live weather in CURRENT sector (any of the 36 states or GPS) triggers a cyclone alert
    // 3) On All-India overview when a storm is active
    if (isStormSector || isStormActive || isAllIndia) {
      const stormLat = isStormSector ? 18.330 : (isStormActive && liveWeather?.lat ? liveWeather.lat : 18.330);
      const stormLng = isStormSector ? 84.120 : (isStormActive && liveWeather?.lng ? liveWeather.lng : 84.120);
      const currentPressure = Number(liveWeather?.pressure_hpa ?? 991.7);
      const currentGusts = Number(liveWeather?.wind_gusts_kmh ?? 58.3);
      const currentWind = Number(liveWeather?.wind_speed_kmh ?? 34.6);
      const stormName = liveWeather?.storm_name || (isStormSector ? 'Deep Depression "Arnab"' : 'Active Coastal Depression');
      const stormCat = liveWeather?.storm_category || 'Deep Depression';
      const stationName = liveWeather?.station_name || 'Kalingapatnam / Srikakulam Coast, AP';

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
            <div>&bull; <b>Marine Wave Swell:</b> 3.5m - 4.5m (Rough to Very Rough)</div>
            <div style="margin-top: 5px; padding: 5px 8px; background: rgba(220, 38, 38, 0.2); border-left: 3px solid #ef4444; border-radius: 3px; font-size: 10.5px; color: #fecaca;">
              <b>Precautionary Action:</b> IMD coastal warning active. Preemptive evacuation into reinforced cyclone shelters ordered under Section 34. Total suspension of sea fishing.
            </div>
          </div>
          ${currentSector !== 'cyclone_arnab' ? `
            <button id="btn-zoom-cyclone-arnab" style="width: 100%; margin-top: 10px; background: #dc2626; color: white; border: 1px solid #f87171; padding: 7px 10px; border-radius: 4px; cursor: pointer; font-size: 11.5px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>Focus on Cyclone Landfall Ground Grid</span>
              <span>&rarr;</span>
            </button>
          ` : ''}
        </div>
      `;

      cycloneMarker.bindPopup(cyclonePopup);
      cycloneMarker.on('popupopen', () => {
        const btn = document.getElementById('btn-zoom-cyclone-arnab');
        if (btn && onSectorChange) {
          btn.onclick = () => {
            onSectorChange('cyclone_arnab');
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
            <div style="background: ${badgeBg}; color: white; border: 2px solid white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
              ${isRed ? '!' : isOrange ? '▲' : '✓'}
            </div>
            <div style="background: rgba(7, 25, 47, 0.95); color: white; border: 1px solid #1e3a5f; border-radius: 3px; padding: 1px 5px; font-size: 9.5px; font-weight: 600; white-space: nowrap; margin-top: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
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
          <div style="font-size: 12px; min-width: 260px; line-height: 1.45; font-family: sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid ${badgeBg}; padding-bottom: 5px; margin-bottom: 6px;">
              <strong style="color: #f8fafc; font-size: 13px;">${h.name}</strong>
              <span style="background: ${badgeBg}; color: white; padding: 2px 7px; border-radius: 3px; font-weight: bold; font-size: 10px;">${h.zone} ZONE</span>
            </div>
            
            <div style="color: #cbd5e1; font-size: 11px;">
              <div>&bull; <b>Population at Risk:</b> ${h.population.toLocaleString()} citizens (Census Record)</div>
              <div>&bull; <b>Vulnerable Groups:</b> ${h.elderly_count} Elderly &bull; ${h.infant_count} Infants &bull; ${h.pwd_count} PwD</div>
            </div>

            <!-- Explainable Hazard Section (Section 8 Mandate) -->
            <div style="background: ${isRed ? 'rgba(220,38,38,0.12)' : isOrange ? 'rgba(217,119,6,0.12)' : 'rgba(21,128,61,0.12)'}; border-left: 3px solid ${badgeBg}; padding: 5px 8px; margin: 6px 0; font-size: 10.5px; border-radius: 2px;">
              <b style="color: #ffffff;">HAZARD EVALUATION (WHY ${h.zone}?):</b>
              <div style="color: #cbd5e1; margin-top: 2px; line-height: 1.35;">
                &bull; <b>Slope &amp; Elevation:</b> ${h.slope_degrees}&deg; Gradient &bull; ${h.elevation_m || 8}m MSL<br/>
                &bull; <b>Slope Stability:</b> Factor of Safety = <strong style="color: ${h.factor_of_safety < 1.25 ? '#f87171' : '#4ade80'}">${h.factor_of_safety}</strong> (${h.factor_of_safety < 1.25 ? 'Critical Unstable' : 'Stable'})<br/>
                &bull; <b>Surge / High-Water Distance:</b> <span style="color: #f59e0b; font-weight: bold;">${h.river_distance_m || 65}m</span><br/>
                &bull; <b>Historical Recurrence:</b> ${h.historical_disaster_count || 4} Events (Past 20 Yrs)<br/>
                &bull; <b>Kutcha Housing:</b> ${h.kutcha_houses} Units (${Math.round((h.kutcha_houses / h.population) * 100)}%)
              </div>
            </div>

            <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">
              Relocation Priority Index: <b>${rawPriority}</b> (Urgency Score: <span style="color: ${isRed ? '#f87171' : '#fb923c'}; font-weight: bold;">${urgencyScore}/100</span>)
            </div>

            <button id="btn-xai-${h.id}" style="width: 100%; margin-top: 8px; background: #1d4ed8; color: white; border: 1px solid #3b82f6; padding: 5px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 600;">
              🔍 View Detailed Decision Rationale (SHAP)
            </button>
            <button id="btn-dem-${h.id}" style="width: 100%; margin-top: 5px; background: #065f46; color: white; border: 1px solid #10b981; padding: 5px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 5px;">
              <span>🏔️ 3D Slope &amp; Inundation Model</span>
            </button>
          </div>
        `;

        marker.bindPopup(popupHtml);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-xai-${h.id}`);
          if (btn && onSelectHabitation) btn.onclick = () => onSelectHabitation(h);
          const btnDem = document.getElementById(`btn-dem-${h.id}`);
          if (btnDem && onOpen3DInspector) btnDem.onclick = () => onOpen3DInspector(h);
        });

        layers.markers.addLayer(marker);
      });

      // 3. Relief Shelters
      shelters.forEach(s => {
        const fillPct = Math.round((s.current_occupancy / Math.max(1, s.effective_capacity)) * 100);
        const fillBadgeColor = fillPct >= 90 ? '#dc2626' : fillPct > 50 ? '#d97706' : '#15803d';

        const sMarker = L.marker([s.lat, s.lng], {
          icon: L.divIcon({
            className: 'gov-shelter-pin',
            html: `
              <div style="background: #0f3661; color: white; border: 1.5px solid #38bdf8; border-radius: 5px; padding: 3px 6px; font-size: 10px; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 4px;">
                <span>🏕️ ${s.name.split(' ')[0]}</span>
                <span style="background: ${fillBadgeColor}; color: white; padding: 1px 4px; border-radius: 3px; font-size: 9.5px;">${fillPct}%</span>
              </div>
            `,
            iconSize: [85, 26],
            iconAnchor: [42, 13]
          }),
          zIndexOffset: 400
        });

        const availableBuffer = Math.max(0, s.effective_capacity - s.current_occupancy);

        sMarker.bindPopup(`
          <div style="font-size: 12px; min-width: 240px; font-family: sans-serif; line-height: 1.45;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 5px; margin-bottom: 6px;">
              <strong style="color: #38bdf8; font-size: 13px;">🏕️ ${s.name}</strong>
              <span style="background: ${availableBuffer > 0 ? '#15803d' : '#b45309'}; color: white; padding: 1px 5px; border-radius: 3px; font-size: 9.5px; font-weight: bold;">
                ${availableBuffer > 0 ? 'CAPACITY AVAILABLE' : 'AT CAPACITY'}
              </span>
            </div>
            <div style="color: #cbd5e1; font-size: 11px;">
              <div>&bull; <b>Registered Capacity:</b> ${s.effective_capacity.toLocaleString()} persons</div>
              <div>&bull; <b>Allocated Occupancy:</b> ${s.current_occupancy.toLocaleString()} (${fillPct}%)</div>
              <div>&bull; <b>Available Buffer:</b> <strong style="color: ${availableBuffer > 0 ? '#86efac' : '#f87171'}">${availableBuffer.toLocaleString()} persons</strong></div>
              <div style="font-size: 10.5px; color: #94a3b8; border-top: 1px solid #1e3a5f; margin-top: 5px; padding-top: 4px;">
                <b>Sphere Verification:</b> Beds: ${s.beds} &bull; Water: ${s.water_liters.toLocaleString()}L &bull; Toilets: ${s.toilets_count}
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

      // 5. Evacuation Corridors (Zero-Overflow Routes)
      evacuationPlan.forEach((item, index) => {
        const fromH = habitations.find(h => h.id === item.from_id);
        const toS = (horizon === 'medium_term' ? resettlementSites : shelters).find(s => s.id === item.to_id);

        if (fromH && toS) {
          const midLat = (fromH.lat + toS.lat) / 2.0 + (index % 2 === 0 ? 0.007 : -0.007);
          const midLng = (fromH.lng + toS.lng) / 2.0 + (index % 2 === 0 ? -0.007 : 0.007);
          const latlngs = [[fromH.lat, fromH.lng], [midLat, midLng], [toS.lat, toS.lng]];
          const corridorColor = horizon === 'medium_term' ? '#15803d' : '#2563eb';

          const polyline = L.polyline(latlngs, {
            color: corridorColor,
            weight: 3.5,
            opacity: 0.9,
            dashArray: '6, 6'
          });

          polyline.bindPopup(`
            <div style="font-size: 12px; min-width: 210px; font-family: sans-serif;">
              <strong style="color: #38bdf8; font-size: 12.5px;">Official Evacuation Corridor</strong>
              <div style="margin-top: 5px; color: #cbd5e1; line-height: 1.4;">
                <div><b>Origin:</b> ${item.from_name}</div>
                <div><b>Destination:</b> ${item.to_name}</div>
                <div style="color: #f8fafc; font-weight: bold; margin-top: 3px;">Mobilizing: ${item.evacuee_count.toLocaleString()} citizens</div>
                <div><b>Route:</b> ${item.distance_km} km &bull; <b>ETA:</b> ${item.estimated_transit_mins} mins</div>
                <div style="margin-top: 5px; font-size: 10.5px; background: rgba(37,99,235,0.2); padding: 4px 6px; border-radius: 4px; color: #93c5fd;">
                  🚌 <b>Fleet:</b> ${item.recommended_convoy_type}
                </div>
              </div>
            </div>
          `);
          layers.routes.addLayer(polyline);
        }
      });
    }

  }, [habitations, shelters, resettlementSites, evacuationPlan, horizon, currentSector]);

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
      <div style={{
        background: '#07192f',
        borderBottom: '1px solid #1e3a5f',
        padding: '7px 12px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        zIndex: 10
      }}>
        {/* Left: Sector Jurisdiction Dropdown covering All 36 States & UTs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Quick Active Storm Shortcut Button */}
          <button
            onClick={() => onSectorChange && onSectorChange('cyclone_arnab')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '4px',
              border: currentSector === 'cyclone_arnab' ? '1.5px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.6)',
              background: currentSector === 'cyclone_arnab' ? 'linear-gradient(135deg, #991b1b, #dc2626)' : 'rgba(220, 38, 38, 0.22)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: currentSector === 'cyclone_arnab' ? '0 0 10px rgba(239, 68, 68, 0.6)' : 'none'
            }}
            title="Focus map on Active Cyclone Arnab / Kalingapatnam landfall corridor"
          >
            <span style={{ fontSize: '13px' }}>🌀</span>
            <span>Storm Arnab (AP/Odisha)</span>
            <span style={{ fontSize: '8.5px', background: '#dc2626', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>
              991 hPa
            </span>
          </button>

          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} color="#38bdf8" />
            Sector:
          </span>
          <select
            value={currentSector}
            onChange={e => onSectorChange && onSectorChange(e.target.value)}
            style={{
              background: '#0d2847',
              color: '#ffffff',
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11.5px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
              maxWidth: '300px'
            }}
          >
            <option value="all_india">🇮🇳 All-India Multi-Hazard Overview (36 States &amp; UTs)</option>
            <option value="cyclone_arnab">🌀 ACTIVE STORM ARNAB: Kalingapatnam / AP &amp; Odisha Landfall (991 hPa / 76 km/h)</option>
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
                background: '#1e3a5f',
                color: '#38bdf8',
                border: '1px solid #3b82f6',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
              title="Reset view to Pan-India Overview"
            >
              <span>🇮🇳 All-India Map</span>
            </button>
          )}

          {onDetectLocation && (
            <button
              onClick={onDetectLocation}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#071526',
                color: '#38bdf8',
                border: '1px solid #1e40af',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              title="Fly to your real-time GPS location and get live weather"
            >
              <span>📍</span>
              <span>My Location</span>
            </button>
          )}
        </div>

        {/* Center: Live Doppler Satellite Radar Weather Toggle & 3D Terrain DEM Inspector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={toggleRadar}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isRadarActive ? 'rgba(2, 132, 199, 0.25)' : '#071526',
              border: isRadarActive ? '1px solid #38bdf8' : '1px solid #1e3a5f',
              color: isRadarActive ? '#38bdf8' : '#94a3b8',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Toggle Regional Doppler Weather Clouds (Active at national/state scale)"
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isRadarActive ? '#22c55e' : '#64748b',
              boxShadow: isRadarActive ? '0 0 6px #22c55e' : 'none',
              display: 'inline-block'
            }}></span>
            <span>🛰️ Doppler Radar: {isRadarActive ? 'ON' : 'OFF'}</span>
            {radarTimestamp && isRadarActive && (
              <span style={{ fontSize: '9px', color: '#93c5fd', opacity: 0.9 }}>({radarTimestamp})</span>
            )}
          </button>

          {/* 3D Digital Elevation Model (DEM) & Inundation Inspector Trigger */}
          <button
            onClick={() => {
              const targetHab = habitations.find(h => h.zone === 'RED') || habitations[0];
              if (onOpen3DInspector) onOpen3DInspector(targetHab);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'linear-gradient(90deg, #065f46, #047857)',
              color: '#ffffff',
              border: '1px solid #10b981',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              transition: 'all 0.15s ease'
            }}
            title="Open Interactive 3D Digital Elevation Model (DEM) & Flood Inundation Simulator"
          >
            <Mountain size={13} />
            <span>🏔️ 3D Terrain DEM</span>
          </button>
        </div>

        {/* Center-Right: Simple Institutional Layer Controls (SIH26191 Section 7 Mandate) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#cbd5e1' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>LAYERS:</span>
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
        </div>

        {/* Right: High-Resolution Zero-Watermark Base Map Layer Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '600', marginRight: '2px' }}>
            Base:
          </span>
          <button
            onClick={() => switchBaseLayer('esri_streets')}
            style={{
              padding: '3px 7px',
              fontSize: '10.5px',
              fontWeight: '600',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              background: activeBaseLayer === 'esri_streets' ? '#1d4ed8' : '#0a1d35',
              color: activeBaseLayer === 'esri_streets' ? 'white' : '#94a3b8'
            }}
            title="Official High-Resolution Esri World Street GIS Map (Zero Watermarks)"
          >
            GIS Map
          </button>
          <button
            onClick={() => switchBaseLayer('satellite')}
            style={{
              padding: '3px 7px',
              fontSize: '10.5px',
              fontWeight: '600',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              background: activeBaseLayer === 'satellite' ? '#1d4ed8' : '#0a1d35',
              color: activeBaseLayer === 'satellite' ? 'white' : '#94a3b8'
            }}
            title="High-Resolution Esri World Satellite Imagery (Zero Watermarks)"
          >
            Satellite
          </button>
          <button
            onClick={() => switchBaseLayer('topo_3d')}
            style={{
              padding: '3px 7px',
              fontSize: '10.5px',
              fontWeight: '600',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              background: activeBaseLayer === 'topo_3d' ? '#1d4ed8' : '#0a1d35',
              color: activeBaseLayer === 'topo_3d' ? 'white' : '#94a3b8'
            }}
            title="3D Topographic Terrain Contours & Elevation Shading (OpenTopoMap)"
          >
            3D Topo
          </button>
          <button
            onClick={() => switchBaseLayer('standard')}
            style={{
              padding: '3px 7px',
              fontSize: '10.5px',
              fontWeight: '600',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              background: activeBaseLayer === 'standard' ? '#1d4ed8' : '#0a1d35',
              color: activeBaseLayer === 'standard' ? 'white' : '#94a3b8'
            }}
            title="OpenStreetMap Standard (Zero Watermarks)"
          >
            OSM
          </button>

          {/* 3D Perspective Tilt on Leaflet Map */}
          <button
            onClick={() => {
              setIsPerspective3D(!isPerspective3D);
              setTimeout(() => {
                if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
              }, 200);
            }}
            style={{
              padding: '3px 8px',
              fontSize: '10.5px',
              fontWeight: '700',
              borderRadius: '3px',
              border: isPerspective3D ? '1px solid #38bdf8' : '1px solid #1e3a5f',
              cursor: 'pointer',
              background: isPerspective3D ? 'rgba(2, 132, 199, 0.4)' : '#07172c',
              color: isPerspective3D ? '#38bdf8' : '#cbd5e1',
              marginLeft: '4px'
            }}
            title="Toggle 3D Perspective Tilt on Tactical Map"
          >
            {isPerspective3D ? '📐 2D View' : '🏔️ 3D Tilt'}
          </button>
        </div>
      </div>

      {/* 2. LEAFLET MAP CANVAS */}
      <div style={{ position: 'relative', flex: 1, minHeight: '520px', overflow: 'hidden' }}>
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '520px',
            transform: isPerspective3D ? 'perspective(1000px) rotateX(25deg)' : 'none',
            transformOrigin: '50% 80%',
            transition: 'transform 0.4s ease'
          }}
        />

        {/* 3. COLLAPSIBLE MAP LEGEND (Bottom Left) */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 1000,
          background: 'rgba(7, 25, 47, 0.95)',
          border: '1px solid #1e3a5f',
          borderRadius: '5px',
          padding: '8px 10px',
          fontSize: '10.5px',
          color: '#f8fafc',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
          maxWidth: '240px'
        }}>
          <div
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            style={{ fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <span>GIS Map Legend</span>
            <span style={{ fontSize: '9px', color: '#60a5fa' }}>{isLegendOpen ? '▲ Hide' : '▼ Show'}</span>
          </div>

          {isLegendOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px' }}>🚨/⚠️</span>
                <span>National Disaster Hotspots</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></span>
                <span>Red Zone (Evacuate 0-48h)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ea580c' }}></span>
                <span>Orange Zone (Standby)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#15803d' }}></span>
                <span>Green Zone (Stable)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', background: '#0284c7', borderRadius: '2px' }}></span>
                <span>🏕️ Relief Shelters (% Capacity)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '2px', borderTop: '2px dashed #2563eb' }}></span>
                <span>Convoy Corridors (Zero-Overflow)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
