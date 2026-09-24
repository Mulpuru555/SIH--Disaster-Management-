import React, { useState, useEffect } from 'react';
import { 
  FileText, Shield, CheckCircle2, Clock, Printer, Download, 
  X, Check, AlertCircle, UserCheck, Truck, LifeBuoy, AlertTriangle
} from 'lucide-react';
import { fetchOperationalOrder, signOffOperationalOrder } from '../services/api';
import ndrfEmblem from '../assets/ndrf_emblem.png';

export default function OperationalOrderModal({ isOpen, onClose, currentSim, habitations, shelters }) {
  const [opOrd, setOpOrd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [officerName, setOfficerName] = useState('Dr. Meghana IAS (District Collector & DDMA Chairman)');
  const [designation, setDesignation] = useState('District Magistrate & Chairman, DDMA Wayanad');
  const [comments, setComments] = useState('Authorized for immediate field mobilization under Sec 34 of DM Act 2005.');

  useEffect(() => {
    if (isOpen) {
      loadOrder();
    }
  }, [isOpen]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await fetchOperationalOrder();
      if (data) {
        setOpOrd(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOff = async (e) => {
    e.preventDefault();
    if (!opOrd || isSigning) return;

    setIsSigning(true);
    try {
      const signed = await signOffOperationalOrder({
        op_ord_id: opOrd.op_ord_id,
        sign_off_officer: officerName,
        designation: designation,
        comments: comments
      });
      if (signed) {
        setOpOrd(signed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const isVerified = opOrd?.verification_status?.includes('VERIFIED') || opOrd?.verification_status?.includes('RATIFIED');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 10, 20, 0.88)',
      backdropFilter: 'blur(7px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#07192f',
        border: '1px solid #1e40af',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '960px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        overflow: 'hidden'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          padding: '14px 22px',
          background: 'linear-gradient(135deg, #091e3a, #0d2847)',
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={ndrfEmblem} 
              alt="NDRF Crest" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '15.5px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  NDRF Operational Relocation Order (OP-ORD)
                </h2>
                <span style={{
                  fontSize: '10px',
                  background: isVerified ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: isVerified ? '#4ade80' : '#fbbf24',
                  border: isVerified ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: '700'
                }}>
                  {isVerified ? '✓ RATIFIED BY DISTRICT MAGISTRATE' : '⚠️ DRAFT ADVISORY — PENDING SIGN-OFF'}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                IRS Form 201/202 Equivalent &bull; Statutory Authority: Disaster Management Act 2005 (Sec 30, 34, 65)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#132e50',
                border: '1px solid #1e40af',
                color: '#93c5fd',
                padding: '6px 12px',
                borderRadius: '5px',
                fontSize: '11.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Printer size={13} /> Print
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Quick Metrics Bar */}
          {opOrd && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px'
            }}>
              <div style={{ background: '#091c33', padding: '10px 14px', borderRadius: '6px', border: '1px solid #1e3a5f' }}>
                <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Mobilization</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
                  {opOrd.total_citizens_evacuated.toLocaleString()} <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 'normal' }}>Citizens</span>
                </div>
              </div>
              <div style={{ background: '#091c33', padding: '10px 14px', borderRadius: '6px', border: '1px solid #1e3a5f' }}>
                <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Active Corridors</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#22c55e', marginTop: '2px' }}>
                  {opOrd.total_convoys} <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 'normal' }}>Convoys</span>
                </div>
              </div>
              <div style={{ background: '#091c33', padding: '10px 14px', borderRadius: '6px', border: '1px solid #1e3a5f' }}>
                <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Fleet Allocation</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b', marginTop: '2px' }}>
                  {opOrd.total_vehicles} <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 'normal' }}>Buses</span>
                </div>
              </div>
              <div style={{ background: '#091c33', padding: '10px 14px', borderRadius: '6px', border: '1px solid #1e3a5f' }}>
                <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase' }}>Medical Shuttles</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#ec4899', marginTop: '2px' }}>
                  {opOrd.total_ambulances} <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 'normal' }}>Ambulances</span>
                </div>
              </div>
            </div>
          )}

          {/* Full Markdown Render Container */}
          {opOrd && (
            <div style={{
              background: '#051324',
              border: '1px solid #163354',
              borderRadius: '8px',
              padding: '24px',
              color: '#cbd5e1',
              fontSize: '12.5px',
              lineHeight: '1.6',
              fontFamily: 'monospace, monospace',
              whiteSpace: 'pre-wrap',
              maxHeight: '440px',
              overflowY: 'auto'
            }}>
              {opOrd.order_content_markdown}
            </div>
          )}

          {/* District Magistrate Human Verification Sign-off Box */}
          <div style={{
            background: isVerified ? 'rgba(34, 197, 94, 0.08)' : 'rgba(217, 119, 6, 0.08)',
            border: isVerified ? '1px solid #22c55e' : '1px solid #d97706',
            borderRadius: '8px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <UserCheck size={18} color={isVerified ? '#4ade80' : '#f59e0b'} />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                Incident Commander & District Magistrate Statutory Sign-off Block
              </span>
            </div>

            {isVerified ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '12px' }}>
                    ✓ OPERATIONAL ORDER RATIFIED FOR IMMEDIATE TACTICAL EXECUTION
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                    Authorized by: <b>{officerName}</b> &bull; {designation}
                  </div>
                </div>
                <div style={{
                  padding: '6px 14px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid #22c55e',
                  borderRadius: '5px',
                  color: '#4ade80',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}>
                  SEALED & COMMITTED TO DISPATCH
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignOff} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  Under the Incident Response System (IRS), automated algorithmic outputs remain <b>advisory</b> until confirmed and countersigned by the designated District Magistrate or Incident Commander.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Authorizing Officer Name:</label>
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#071629',
                        border: '1px solid #1e3a5f',
                        padding: '7px 10px',
                        color: '#ffffff',
                        fontSize: '11.5px',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Official Designation:</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#071629',
                        border: '1px solid #1e3a5f',
                        padding: '7px 10px',
                        color: '#ffffff',
                        fontSize: '11.5px',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="submit"
                    disabled={isSigning}
                    style={{
                      background: 'linear-gradient(135deg, #d97706, #b45309)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Check size={14} />
                    {isSigning ? 'Countersigning...' : 'Countersign & Ratify Relocation Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 22px',
          background: '#051324',
          borderTop: '1px solid #163354',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748b'
        }}>
          <div>National Disaster Management Authority &bull; IRS Form 201/202</div>
          <div>Cryptographic Watermark: RESQGRID-NDRF-SECURE-V1.1</div>
        </div>
      </div>
    </div>
  );
}
