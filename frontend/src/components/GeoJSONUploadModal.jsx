import React, { useState } from 'react';
import { Layers, Upload, CheckCircle2, AlertTriangle, X, FileCode } from 'lucide-react';
import { uploadHazardGeoJSON } from '../services/api';

const SAMPLE_WAYANAD_POLYGON = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [[
      [76.110, 11.530],
      [76.170, 11.530],
      [76.170, 11.570],
      [76.110, 11.570],
      [76.110, 11.530]
    ]]
  },
  properties: {
    source: "NRSC Sentinel-1 SAR Flood Inundation Delineation",
    risk_level: "CATASTROPHIC"
  }
};

export default function GeoJSONUploadModal({ isOpen, onClose, onLayerApplied }) {
  const [layerName, setLayerName] = useState('NRSC-SAR-Wayanad-Inundation-Zone-A');
  const [hazardType, setHazardType] = useState('FLASH_FLOOD');
  const [severity, setSeverity] = useState('RED');
  const [geojsonText, setGeojsonText] = useState(JSON.stringify(SAMPLE_WAYANAD_POLYGON, null, 2));
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    setUploading(true);
    setResult(null);

    try {
      const parsed = JSON.parse(geojsonText);
      const res = await uploadHazardGeoJSON({
        layer_name: layerName,
        hazard_type: hazardType,
        severity: severity,
        geojson: parsed
      });

      if (res) {
        setResult(res);
        if (onLayerApplied) onLayerApplied(res);
      }
    } catch (err) {
      alert("Invalid GeoJSON JSON syntax: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSample = () => {
    setLayerName('Chooralmala-Mundakkai-Landslide-Runout-Zone');
    setHazardType('LANDSLIDE_DEBRIS');
    setSeverity('RED');
    setGeojsonText(JSON.stringify(SAMPLE_WAYANAD_POLYGON, null, 2));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 10, 20, 0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#07192f',
        border: '1px solid #1e40af',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '740px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          background: 'linear-gradient(135deg, #091e3a, #0b2952)',
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={20} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Custom GIS Hazard Layer & Polygon Ingestion
              </h2>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Upload NRSC satellite inundation or GSI debris polygons to dynamically update risk zones
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Configure Hazard Polygon Layer:</span>
            <button
              type="button"
              onClick={handleLoadSample}
              style={{
                background: '#132e50',
                border: '1px solid #1e40af',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Load Sample Wayanad Polygon
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Layer Name:</label>
              <input
                type="text"
                value={layerName}
                onChange={(e) => setLayerName(e.target.value)}
                style={{
                  width: '100%',
                  background: '#091c33',
                  border: '1px solid #1e3a5f',
                  borderRadius: '5px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Hazard Type:</label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                style={{
                  width: '100%',
                  background: '#091c33',
                  border: '1px solid #1e3a5f',
                  borderRadius: '5px',
                  padding: '8px 10px',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
              >
                <option value="FLASH_FLOOD">Flash Flood</option>
                <option value="LANDSLIDE_DEBRIS">Landslide Debris</option>
                <option value="DAM_BREACH">Dam Breach</option>
                <option value="COASTAL_SURGE">Coastal Surge</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Severity Zone:</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                style={{
                  width: '100%',
                  background: '#091c33',
                  border: '1px solid #1e3a5f',
                  borderRadius: '5px',
                  padding: '8px 10px',
                  color: severity === 'RED' ? '#ef4444' : '#f97316',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                <option value="RED">RED (Evacuate)</option>
                <option value="ORANGE">ORANGE (Alert)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              GeoJSON Payload (RFC 7946 Polygon or Feature):
            </label>
            <textarea
              value={geojsonText}
              onChange={(e) => setGeojsonText(e.target.value)}
              rows={10}
              style={{
                width: '100%',
                background: '#051324',
                border: '1px solid #163354',
                borderRadius: '6px',
                padding: '12px',
                color: '#38bdf8',
                fontSize: '11.5px',
                fontFamily: 'monospace, monospace',
                resize: 'vertical'
              }}
            />
          </div>

          {result && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid #22c55e',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle2 size={20} color="#4ade80" />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#4ade80' }}>
                  Hazard Polygon Successfully Ingested!
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
                  Encompassed <b>{result.affected_habitations_count} habitations</b> ({result.affected_population?.toLocaleString()} citizens) & severed <b>{result.blocked_corridors_count} road corridors</b>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px',
          background: '#051324',
          borderTop: '1px solid #163354',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Calculates point-in-polygon ray-casting spatial intersections
          </span>
          <button
            onClick={handleApply}
            disabled={uploading}
            style={{
              background: 'linear-gradient(135deg, #1e40af, #2563eb)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 18px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Upload size={14} />
            {uploading ? 'Processing Layer...' : 'Apply Hazard Layer to Grid'}
          </button>
        </div>
      </div>
    </div>
  );
}
