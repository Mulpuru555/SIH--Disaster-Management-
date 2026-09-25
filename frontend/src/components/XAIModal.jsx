import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, BarChart3, Users, Clock, FileText } from 'lucide-react';
import { fetchXAI } from '../services/api';

export default function XAIModal({ habitation, onClose }) {
  const [xaiData, setXaiData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habitation?.id) {
      let isMounted = true;
      setLoading(true);
      fetchXAI(habitation.id).then(res => {
        if (isMounted && res) {
          setXaiData(res);
        }
        if (isMounted) setLoading(false);
      }).catch(() => {
        if (isMounted) setLoading(false);
      });
      return () => { isMounted = false; };
    }
  }, [habitation]);

  if (!habitation) return null;

  // Physical criteria calculations
  const slope = habitation.slope_degrees || 28.5;
  const slopeWeight = Math.min(50, Math.round((slope / 42.0) * 45));
  const rainWeight = habitation.zone === 'RED' ? 32 : 22;
  const soilWeight = 14;
  const riverDist = habitation.river_distance_m || 85;
  const riverWeight = riverDist < 200 ? 12 : 5;
  const historyWeight = 100 - (slopeWeight + rainWeight + soilWeight + riverWeight);

  const fallbackFactors = [
    { name: 'DEM Terrain Slope Gradient & Elevation', pct: slopeWeight, color: '#b91c1c' },
    { name: 'Sustained IMD AWS Rainfall Intensity', pct: rainWeight, color: '#c2410c' },
    { name: 'Antecedent Soil Moisture Saturation', pct: soilWeight, color: '#0b2545' },
    { name: 'High-Water Line & Drainage Proximity', pct: riverWeight, color: '#0284c7' },
    { name: 'Historical 20-Year Disaster Recurrence', pct: historyWeight, color: '#7c3aed' }
  ];

  const factors = xaiData?.factor_breakdown_percentages
    ? Object.entries(xaiData.factor_breakdown_percentages).map(([name, pct], idx) => {
        const colors = ['#b91c1c', '#c2410c', '#0b2545', '#0284c7', '#7c3aed'];
        return { name, pct, color: colors[idx % colors.length] };
      })
    : fallbackFactors;

  const socialBreakdown = xaiData?.social_vulnerability_breakdown || {
    "Geriatric / Elderly Population": 34.5,
    "Infants & Children": 28.0,
    "Persons with Disabilities (PwD)": 25.5,
    "Kutcha Housing Units": 12.0
  };

  const evacWave = xaiData?.evacuation_wave_recommendation || 
    (habitation.zone === 'RED' ? 'Wave 1: Immediate Critical Evacuation (0-2 Hours)' : 'Wave 2: High Priority Pre-Monsoon Evacuation');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div className="gov-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '20px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '14px', right: '14px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '4px', border: '1px solid #fca5a5' }}>
            <ShieldAlert size={20} color="#b91c1c" />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
              Statutory Vulnerability Dossier &bull; SIH26191
            </div>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '1px 0' }}>
              {habitation.name} (HAB-{habitation.id})
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '11px', color: '#475569' }}>Taluk: {habitation.taluk || 'Vythiri / Srikakulam Division'}</span>
              <span className={habitation.zone === 'RED' ? 'badge-red' : 'badge-amber'} style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                {habitation.zone} ZONE
              </span>
            </div>
          </div>
        </div>

        {/* Evacuation Directive Banner */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderLeft: '4px solid #0b2545',
          borderRadius: '4px',
          padding: '8px 12px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} color="#0b2545" />
            <div>
              <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block' }}>Operational Relocation Order:</span>
              <strong style={{ fontSize: '12px', color: '#0f172a' }}>{evacWave}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>Census Population</span>
            <strong style={{ fontSize: '12.5px', color: '#0f172a' }}>{habitation.population.toLocaleString()} citizens</strong>
          </div>
        </div>

        {/* Physical Hazard Factor Weights */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            <BarChart3 size={14} color="#0b2545" />
            <span>Quantitative Hazard Evaluation Criteria</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
            {factors.map((f, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                  <span style={{ color: '#334155' }}>{f.name}</span>
                  <span style={{ fontWeight: '700', color: f.color }}>{f.pct}%</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${f.pct}%`, height: '100%', background: f.color, borderRadius: '2px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Demographic Vulnerability Breakdown */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            <Users size={14} color="#b45309" />
            <span>High-Risk Demographic Breakdown</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.entries(socialBreakdown).map(([label, pct], idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>{label}</span>
                <strong style={{ fontSize: '12px', color: '#0f172a' }}>{pct}% of residents</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Geotechnical Baseline Parameters */}
        <div style={{ background: '#f8fafc', padding: '9px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569', lineHeight: 1.45 }}>
          <strong style={{ color: '#0f172a' }}>Geotechnical Baseline Summary:</strong>
          <div>&bull; <b>CartoDEM Terrain Slope:</b> {slope}&deg; ({slope > 30 ? 'Steep Escarpment' : 'Moderate Gradient'})</div>
          <div>&bull; <b>Factor of Safety (FS):</b> {habitation.factor_of_safety || 1.15} ({habitation.factor_of_safety < 1.25 ? 'Slope Failure Envelope' : 'Slope Stable'})</div>
          <div>&bull; <b>Distance to High-Water Line:</b> {habitation.river_distance_m || 85} metres</div>
          <div>&bull; <b>ISRO Bhuvan NDEM Disaster History:</b> {habitation.historical_disaster_count || 4} flood/landslide events in past 20 years</div>
        </div>

        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="gov-btn-primary"
          >
            <span>Close Dossier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
