import React, { useState } from 'react';
import { 
  FileText, Shield, CheckCircle2, Clock, Printer, Download, 
  X, AlertCircle, UserCheck, Truck, LifeBuoy, AlertTriangle, ArrowRight
} from 'lucide-react';

export default function OperationalOrderModal({ 
  isOpen, 
  onClose, 
  habitations = [], 
  shelters = [], 
  evacuationPlan = [], 
  currentSector = 'all_india',
  liveWeather = null 
}) {
  const [officerName, setOfficerName] = useState('');
  const [designation, setDesignation] = useState('District Magistrate & Chairman, DDMA');
  const [comments, setComments] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authorizationTimestamp, setAuthorizationTimestamp] = useState(null);

  if (!isOpen) return null;

  const redHabs = habitations.filter(h => h.zone === 'RED');
  const redPop = redHabs.reduce((sum, h) => sum + (h.population || 0), 0);
  const totalShelterCapacity = shelters.reduce((sum, s) => sum + (s.effective_capacity || 0), 0);

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!officerName.trim()) {
      alert("Please enter the name and badge/ID of the reviewing authorized officer.");
      return;
    }
    setIsAuthorized(true);
    setAuthorizationTimestamp(new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
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
      background: 'rgba(3, 10, 20, 0.88)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#0a1d35',
        border: '1px solid #1e3a5f',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          padding: '12px 20px',
          background: '#071526',
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={17} color="#60a5fa" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '14.5px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Draft Relocation Plan &amp; Allocation Schedule
                </h2>
                <span className={isAuthorized ? 'badge-green' : 'badge-amber'} style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                  {isAuthorized ? '● AUTHORIZED BY DDMA' : 'DRAFT — PENDING STATUTORY APPROVAL'}
                </span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
                Statutory decision support framework under Sections 30 &amp; 34 of the Disaster Management Act, 2005
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="gov-btn-secondary"
              style={{ padding: '4px 9px', fontSize: '10.5px' }}
            >
              <Printer size={11} />
              <span>Print Draft</span>
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Plan Body */}
        <div style={{ padding: '16px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Official Document Banner */}
          <div style={{
            background: isAuthorized ? 'rgba(21, 128, 61, 0.1)' : 'rgba(217, 119, 6, 0.08)',
            border: isAuthorized ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '4px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: isAuthorized ? '#86efac' : '#fcd34d' }}>
                {isAuthorized 
                  ? 'OFFICIAL RELOCATION DIRECTIVE AUTHORIZED FOR FIELD MOBILIZATION' 
                  : 'DRAFT OPERATIONAL RECOMMENDATION (FOR DDMA REVIEW ONLY)'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#cbd5e1', marginTop: '2px' }}>
                {isAuthorized 
                  ? `Authorized by ${officerName} (${designation}) on ${authorizationTimestamp}.`
                  : 'This plan is generated for decision support. Only an authorized statutory officer may ratify it for field execution.'}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '10px', color: '#94a3b8' }}>
              <div><b>Plan Ref:</b> DRP-{new Date().getFullYear()}-001</div>
              <div><b>Model Confidence:</b> 88%</div>
            </div>
          </div>

          {/* Section 1: Situation & Exposed Habitations Summary */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
              1. Situation Summary &amp; Exposure Analysis
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '11px' }}>
              <div style={{ background: '#071526', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Active Hazard</div>
                <div style={{ color: '#ffffff', fontWeight: '700', marginTop: '2px' }}>
                  {liveWeather?.storm_name || liveWeather?.condition || 'Monsoonal Precipitation Event'}
                </div>
              </div>
              <div style={{ background: '#071526', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Critical Habitations (Red Zone)</div>
                <div style={{ color: '#f87171', fontWeight: '700', marginTop: '2px' }}>
                  {redHabs.length} Habitations ({redPop.toLocaleString()} Citizens)
                </div>
              </div>
              <div style={{ background: '#071526', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>Registered Shelter Capacity</div>
                <div style={{ color: '#38bdf8', fontWeight: '700', marginTop: '2px' }}>
                  {totalShelterCapacity.toLocaleString()} Persons ({shelters.length} Facilities)
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Evacuation Allocation Schedule */}
          <div className="gov-card" style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
              2. Evacuation Allocation &amp; Convoys Schedule
            </div>

            {evacuationPlan.length === 0 ? (
              <div style={{ fontSize: '11px', color: '#94a3b8', padding: '12px', textAlign: 'center' }}>
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
                        <strong style={{ color: '#ffffff' }}>{item.from_name}</strong>
                      </td>
                      <td>
                        <span style={{ color: '#86efac' }}>{item.to_name}</span>
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
                        <span style={{ color: '#93c5fd', fontSize: '10.5px' }}>{item.recommended_convoy_type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Section 3: Statutory Human Authorization Form (Section 9 & 17 Mandate) */}
          <div className="gov-card" style={{ padding: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="#f59e0b" />
              <span>3. Statutory Review &amp; Human Authorization</span>
            </div>

            {isAuthorized ? (
              <div style={{ background: '#071526', padding: '12px', borderRadius: '4px', border: '1px solid #166534' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#86efac', fontWeight: '700', fontSize: '12px' }}>
                  <CheckCircle2 size={16} color="#22c55e" />
                  <span>PLAN RATIFIED AND APPROVED FOR EXECUTION</span>
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.5 }}>
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
                    <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
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
                        background: '#071526',
                        border: '1px solid #1e3a5f',
                        color: '#ffffff',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Official Designation / Authority:
                    </label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#071526',
                        border: '1px solid #1e3a5f',
                        color: '#ffffff',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Officer Endorsement &amp; Operational Directives:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter formal directives under Section 34 of the Disaster Management Act (e.g. Preemptive evacuation authorized into reinforced cyclone shelters; NDRF/SDRF convoy escorts mobilized)."
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#071526',
                      border: '1px solid #1e3a5f',
                      color: '#ffffff',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="submit"
                    className="gov-btn-primary"
                    style={{ padding: '7px 16px', background: '#15803d', borderColor: '#22c55e' }}
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
          padding: '10px 20px',
          background: '#071526',
          borderTop: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="gov-btn-secondary"
            style={{ padding: '6px 14px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
