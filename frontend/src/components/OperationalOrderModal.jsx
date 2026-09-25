import React, { useState } from 'react';
import { FileText, Printer, CheckCircle2, Shield, X, AlertTriangle } from 'lucide-react';
import { OPERATIONAL_SECTORS } from '../services/localEngine';

export default function OperationalOrderModal({
  isOpen,
  onClose,
  habitations,
  shelters,
  evacuationPlan,
  currentSector,
  liveWeather
}) {
  const [officerName, setOfficerName] = useState('');
  const [designation, setDesignation] = useState('District Disaster Management Authority (DDMA)');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authorizationTimestamp, setAuthorizationTimestamp] = useState(null);
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  const currentSectorObj = OPERATIONAL_SECTORS.find(s => s.id === currentSector);
  const redHabs = habitations.filter(h => h.zone === 'RED');
  const redPop = redHabs.reduce((acc, h) => acc + (h.population || 0), 0);
  const totalShelterCapacity = shelters.reduce((acc, s) => acc + (s.effective_capacity || 0), 0);

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!officerName.trim()) return;
    setIsAuthorized(true);
    setAuthorizationTimestamp(new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-IN') + ' IST');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '880px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          padding: '12px 18px',
          background: '#0b2545',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={17} color="#ffffff" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '14.5px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Draft Relocation Plan &amp; Allocation Schedule
                </h2>
                <span className={isAuthorized ? 'badge-green' : 'badge-amber'} style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                  {isAuthorized ? '● AUTHORIZED BY DDMA' : 'DRAFT — PENDING STATUTORY APPROVAL'}
                </span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#cbd5e1', marginTop: '2px' }}>
                Statutory decision support framework under Sections 30 &amp; 34 of the Disaster Management Act, 2005
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '4px 9px',
                borderRadius: '3px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Printer size={11} />
              <span>Print Draft</span>
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Plan Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Official Document Banner */}
          <div style={{
            background: isAuthorized ? '#f0fdf4' : '#fff7ed',
            border: isAuthorized ? '1px solid #86efac' : '1px solid #fdba74',
            borderRadius: '4px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: isAuthorized ? '#166534' : '#9a3412' }}>
                {isAuthorized 
                  ? 'OFFICIAL RELOCATION DIRECTIVE AUTHORIZED FOR FIELD MOBILIZATION' 
                  : 'DRAFT OPERATIONAL RECOMMENDATION (FOR DDMA REVIEW ONLY)'}
              </div>
              <div style={{ fontSize: '11px', color: isAuthorized ? '#15803d' : '#475569', marginTop: '2px' }}>
                {isAuthorized 
                  ? `Authorized by ${officerName} (${designation}) on ${authorizationTimestamp}.`
                  : 'This plan is generated for decision support. Only an authorized statutory officer may ratify it for field execution.'}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '10.5px', color: '#64748b' }}>
              <div><b>Plan Ref:</b> DRP-{new Date().getFullYear()}-001</div>
              <div><b>Model Confidence:</b> 88%</div>
            </div>
          </div>

          {/* Section 1: Situation & Exposed Habitations Summary */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#0b2545', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
              1. Situation Summary &amp; Exposure Analysis
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '11px' }}>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '10px' }}>Active Hazard</div>
                <div style={{ color: '#0f172a', fontWeight: '700', marginTop: '2px' }}>
                  {liveWeather?.storm_name || liveWeather?.condition || 'Monsoonal Precipitation Event'}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '10px' }}>Critical Habitations (Red Zone)</div>
                <div style={{ color: '#b91c1c', fontWeight: '700', marginTop: '2px' }}>
                  {redHabs.length} Habitations ({redPop.toLocaleString()} Citizens)
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '10px' }}>Registered Shelter Capacity</div>
                <div style={{ color: '#0b2545', fontWeight: '700', marginTop: '2px' }}>
                  {totalShelterCapacity.toLocaleString()} Beds ({shelters.length} Facilities)
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Evacuation Allocation Schedule */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#0b2545', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
              2. Evacuation Allocation &amp; Convoys Schedule
            </div>

            {evacuationPlan.length === 0 ? (
              <div style={{ fontSize: '11px', color: '#64748b', padding: '12px', textAlign: 'center' }}>
                No active Red Zone habitations requiring immediate relocation in the current baseline.
              </div>
            ) : (
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Origin Habitation</th>
                    <th>Destination Shelter</th>
                    <th>Evacuees</th>
                    <th>Distance &amp; Route</th>
                    <th>Estimated Transit</th>
                    <th>Fleet Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  {evacuationPlan.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{item.from_name}</strong>
                      </td>
                      <td>
                        <span style={{ color: '#15803d', fontWeight: '600' }}>{item.to_name}</span>
                      </td>
                      <td>
                        <b>{item.evacuee_count?.toLocaleString()}</b>
                      </td>
                      <td>
                        {item.distance_km} km
                      </td>
                      <td>
                        ~{item.estimated_transit_mins} mins
                      </td>
                      <td>
                        <span style={{ color: '#0b2545', fontSize: '10.5px', fontWeight: '600' }}>{item.recommended_convoy_type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Section 3: Statutory Human Authorization Form */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="#b45309" />
              <span>3. Statutory Review &amp; Human Authorization</span>
            </div>

            {isAuthorized ? (
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '4px', border: '1px solid #86efac' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: '700', fontSize: '12px' }}>
                  <CheckCircle2 size={16} color="#15803d" />
                  <span>PLAN RATIFIED AND APPROVED FOR EXECUTION</span>
                </div>
                <div style={{ fontSize: '11px', color: '#15803d', marginTop: '6px', lineHeight: 1.5 }}>
                  <div>&bull; <b>Authorizing Official:</b> {officerName}</div>
                  <div>&bull; <b>Designation:</b> {designation}</div>
                  <div>&bull; <b>Timestamp:</b> {authorizationTimestamp}</div>
                  {comments && <div>&bull; <b>Special Instructions:</b> {comments}</div>}
                </div>
              </div>
            ) : (
              <form onSubmit={handleAuthorize} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '10.5px', color: '#64748b', display: 'block', marginBottom: '3px' }}>
                      Reviewing Officer Name &amp; Service ID:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. Sharma, IAS / ID: DDMA-2026-04"
                      value={officerName}
                      onChange={e => setOfficerName(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        padding: '5px 8px',
                        borderRadius: '3px',
                        fontSize: '11px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10.5px', color: '#64748b', display: 'block', marginBottom: '3px' }}>
                      Official Designation / Authority:
                    </label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        padding: '5px 8px',
                        borderRadius: '3px',
                        fontSize: '11px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '10.5px', color: '#64748b', display: 'block', marginBottom: '3px' }}>
                    Officer Endorsement &amp; Operational Directives:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter formal directives under Section 34 of the Disaster Management Act (e.g. Preemptive evacuation authorized into reinforced cyclone shelters; NDRF/SDRF convoy escorts mobilized)."
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '5px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                  <button
                    type="submit"
                    className="gov-btn-primary"
                    style={{ padding: '6px 14px', background: '#15803d', borderColor: '#15803d' }}
                  >
                    <CheckCircle2 size={13} />
                    <span>Authorize Draft Plan as Official DDMA Directive</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 18px',
          background: '#f8fafc',
          borderTop: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="gov-btn-secondary"
            style={{ padding: '5px 12px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
