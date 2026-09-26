import React from 'react';
import { Truck, Droplets, HeartPulse, Shield, Fuel, Package, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

export default function LogisticsResourcesView({
  evacuationPlan,
  shelters,
  currentSector
}) {
  const totalEvacuees = evacuationPlan.reduce((acc, p) => acc + (p.evacuee_count || 0), 0);
  const totalBuses = evacuationPlan.reduce((acc, p) => acc + Math.ceil((p.evacuee_count || 0) / 45), 0);
  const totalAmbulances = evacuationPlan.length * 2;
  const totalBoats = Math.ceil(totalEvacuees / 350); // NDRF Inflatable Motorized Rescue Boats

  // Relief commodities requirement (Sphere Minimum Humanitarian Norms: 15L water/day, 2 rations/day)
  const totalWaterLitersNeeded = totalEvacuees * 15 * 3; // 3-day buffer
  const totalRationPacketsNeeded = totalEvacuees * 2 * 3; // 3-day buffer
  const waterTankersNeeded = Math.ceil(totalWaterLitersNeeded / 12000); // 12,000L municipal tankers

  // Current stocked supplies in shelters
  const stockedWater = shelters.reduce((acc, s) => acc + (s.water_liters || 0), 0);
  const stockedRations = shelters.reduce((acc, s) => acc + (s.ration_packets || 0), 0);
  const totalMedics = shelters.reduce((acc, s) => acc + (s.medical_staff_count || 0), 0);

  return (
    <div style={{ margin: '14px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Title Bar */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              District Emergency Operation Centre (DEOC) &bull; Emergency Support Functions (ESF-7)
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              Logistics Mobilization &amp; Emergency Supply Inventory
            </h2>
            <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
              Statutory requisitioning and staging of transport fleet, water tankers, NDRF inflatable rescue boats, and Sphere-compliant relief rations.
            </p>
          </div>

          <button onClick={() => window.print()} className="gov-btn-primary">
            <Download size={13} />
            <span>Export ESF-7 Logistics Manifest</span>
          </button>
        </div>

        {/* Fleet & Resource KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>SRTC BUSES MOBILIZED</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0b2545', marginTop: '2px' }}>
              {totalBuses} Units
            </div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>45-seater State Transport</div>
          </div>

          <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '4px', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '10px', color: '#b91c1c', fontWeight: '700' }}>4x4 AMBULANCES DEPLOYED</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#b91c1c', marginTop: '2px' }}>
              {totalAmbulances} Units
            </div>
            <div style={{ fontSize: '10.5px', color: '#7f1d1d', marginTop: '2px' }}>Oxygen &amp; stretcher equipped</div>
          </div>

          <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '10px', color: '#1d4ed8', fontWeight: '700' }}>NDRF INFLATABLE BOATS (IRB)</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#1d4ed8', marginTop: '2px' }}>
              {totalBoats} Boats
            </div>
            <div style={{ fontSize: '10.5px', color: '#1e40af', marginTop: '2px' }}>For low-lying waterlogged hamlets</div>
          </div>

          <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '10px', color: '#15803d', fontWeight: '700' }}>WATER TANKERS REQUIRED</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>
              {waterTankersNeeded} Tankers
            </div>
            <div style={{ fontSize: '10.5px', color: '#166534', marginTop: '2px' }}>12,000L Municipal Potable Supply</div>
          </div>
        </div>
      </div>

      {/* Commodity Buffer vs. Need Comparison */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '12px' }}>
          Humanitarian Relief Commodity Sufficiency Audit (Sphere Project Standards)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table" style={{ width: '100%', fontSize: '11px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Relief Commodity / Resource</th>
                <th style={{ textAlign: 'left' }}>Sphere Humanitarian Norm</th>
                <th style={{ textAlign: 'right' }}>72-Hour Required Buffer</th>
                <th style={{ textAlign: 'right' }}>Currently Pre-Positioned</th>
                <th style={{ textAlign: 'center' }}>Sufficiency Status</th>
                <th style={{ textAlign: 'left' }}>Requisitioning Officer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style={{ color: '#0f172a' }}>Potable Drinking Water</strong>
                  <div style={{ fontSize: '9.5px', color: '#64748b' }}>RO filtered drinking supply</div>
                </td>
                <td>15 Liters / Person / Day</td>
                <td style={{ textAlign: 'right', fontWeight: '700' }}>{totalWaterLitersNeeded.toLocaleString()} L</td>
                <td style={{ textAlign: 'right', fontWeight: '700', color: stockedWater >= totalWaterLitersNeeded ? '#15803d' : '#b91c1c' }}>
                  {stockedWater.toLocaleString()} L
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={stockedWater >= totalWaterLitersNeeded ? 'badge-green' : 'badge-amber'} style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                    {stockedWater >= totalWaterLitersNeeded ? '✅ 100% SUFFICIENT' : '⚠️ SUPPLEMENTAL TANKERS ORDERED'}
                  </span>
                </td>
                <td style={{ color: '#475569' }}>Executive Engineer, Public Health Engineering (PHED)</td>
              </tr>

              <tr>
                <td>
                  <strong style={{ color: '#0f172a' }}>Emergency Ration Packets</strong>
                  <div style={{ fontSize: '9.5px', color: '#64748b' }}>Ready-to-eat NDRF high-calorie meal kits</div>
                </td>
                <td>2 Meals / Person / Day (2100 kcal)</td>
                <td style={{ textAlign: 'right', fontWeight: '700' }}>{totalRationPacketsNeeded.toLocaleString()} Kits</td>
                <td style={{ textAlign: 'right', fontWeight: '700', color: stockedRations >= totalRationPacketsNeeded ? '#15803d' : '#b91c1c' }}>
                  {stockedRations.toLocaleString()} Kits
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={stockedRations >= totalRationPacketsNeeded ? 'badge-green' : 'badge-amber'} style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                    {stockedRations >= totalRationPacketsNeeded ? '✅ 100% SUFFICIENT' : '⚠️ BUFFER DISPATCH ACTIVE'}
                  </span>
                </td>
                <td style={{ color: '#475569' }}>District Supply Officer (Civil Supplies)</td>
              </tr>

              <tr>
                <td>
                  <strong style={{ color: '#0f172a' }}>Medical Personnel &amp; Triage Staff</strong>
                  <div style={{ fontSize: '9.5px', color: '#64748b' }}>Doctors, Nurses, Paramedics</div>
                </td>
                <td>1 Medical Team per 500 Evacuees</td>
                <td style={{ textAlign: 'right', fontWeight: '700' }}>{Math.max(4, Math.ceil(totalEvacuees / 500))} Doctors/Nurses</td>
                <td style={{ textAlign: 'right', fontWeight: '700', color: '#15803d' }}>
                  {totalMedics} Medical Officers
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="badge-green" style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                    ✅ DEPLOYED &amp; ACTIVE
                  </span>
                </td>
                <td style={{ color: '#475569' }}>Chief Medical Officer (CMO), District Health Dept</td>
              </tr>

              <tr>
                <td>
                  <strong style={{ color: '#0f172a' }}>Emergency Fuel Reserve (Diesel)</strong>
                  <div style={{ fontSize: '9.5px', color: '#64748b' }}>For transport buses &amp; shelter gensets</div>
                </td>
                <td>48-Hour Uninterrupted Fuel Reserve</td>
                <td style={{ textAlign: 'right', fontWeight: '700' }}>15,000 Liters</td>
                <td style={{ textAlign: 'right', fontWeight: '700', color: '#15803d' }}>22,500 Liters</td>
                <td style={{ textAlign: 'center' }}>
                  <span className="badge-green" style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                    ✅ SECURED IN POL STAGING
                  </span>
                </td>
                <td style={{ color: '#475569' }}>IOCL / BPCL District Nodal Officer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
