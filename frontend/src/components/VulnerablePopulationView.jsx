import React, { useState } from 'react';
import { Users, Search, Download, AlertTriangle, ShieldCheck, HeartPulse, Home } from 'lucide-react';

export default function VulnerablePopulationView({ habitations, onSelectHabitation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filtered = habitations.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (h.taluk && h.taluk.toLowerCase().includes(searchTerm.toLowerCase()));
    const isCritical = h.priority_score >= 0.85 || h.zone === 'RED';
    const matchesPriority = priorityFilter === 'ALL' ||
                            (priorityFilter === 'CRITICAL' && isCritical) ||
                            (priorityFilter === 'PWD' && (h.pwd_count || 0) > 20) ||
                            (priorityFilter === 'KUTCHA' && (h.kutcha_houses || 0) > 100);
    return matchesSearch && matchesPriority;
  });

  const totalPop = habitations.reduce((acc, h) => acc + (h.population || 0), 0);
  const totalElderly = habitations.reduce((acc, h) => acc + (h.elderly_count || 0), 0);
  const totalInfants = habitations.reduce((acc, h) => acc + (h.infant_count || 0), 0);
  const totalPwd = habitations.reduce((acc, h) => acc + (h.pwd_count || 0), 0);
  const totalKutcha = habitations.reduce((acc, h) => acc + (h.kutcha_houses || 0), 0);

  return (
    <div style={{ margin: '14px 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Title Bar */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '700' }}>
              Ministry of Home Affairs &bull; Census &amp; Socio-Economic Vulnerability Index (SoVI)
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              Vulnerable Demographics &amp; Special Needs Evacuation Registry
            </h2>
            <p style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
              Statutory identification of high-vulnerability citizens (PwD, elderly, infants, and kutcha dwelling inhabitants) requiring prioritized evacuation transport.
            </p>
          </div>

          <button onClick={() => window.print()} className="gov-btn-primary">
            <Download size={13} />
            <span>Export Vulnerability Register</span>
          </button>
        </div>

        {/* Demographic KPI Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>TOTAL MONITORED CITIZENS</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              {totalPop.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>Across {habitations.length} habitations</div>
          </div>

          <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '4px', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: '10px', color: '#b91c1c', fontWeight: '700' }}>PERSONS WITH DISABILITIES (PwD)</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#b91c1c', marginTop: '2px' }}>
              {totalPwd.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: '#7f1d1d', marginTop: '2px' }}>Requires wheelchair ambulance transit</div>
          </div>

          <div style={{ background: '#fff7ed', padding: '10px', borderRadius: '4px', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: '10px', color: '#c2410c', fontWeight: '700' }}>ELDERLY CITIZENS (&gt;60 YRS)</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#c2410c', marginTop: '2px' }}>
              {totalElderly.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: '#9a3412', marginTop: '2px' }}>High medical fragility index</div>
          </div>

          <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '10px', color: '#1d4ed8', fontWeight: '700' }}>INFANTS &amp; TODDLERS (&lt;5 YRS)</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#1d4ed8', marginTop: '2px' }}>
              {totalInfants.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: '#1e40af', marginTop: '2px' }}>Pediatric nutrition priority</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700' }}>KUTCHA / MUD HOUSES</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
              {totalKutcha.toLocaleString()}
            </div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '2px' }}>High structural collapse hazard</div>
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="gov-card" style={{ padding: '14px 18px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '12px'
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '4px 10px',
            minWidth: '260px'
          }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search habitation name, ID, or mandal..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '11.5px',
                color: '#0f172a',
                width: '100%'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `All (${habitations.length})` },
              { id: 'CRITICAL', label: 'Priority Red Zones' },
              { id: 'PWD', label: 'High PwD Density' },
              { id: 'KUTCHA', label: 'High Kutcha Housing' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setPriorityFilter(f.id)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: priorityFilter === f.id ? '700' : '500',
                  border: priorityFilter === f.id ? '1px solid #0b2545' : '1px solid #cbd5e1',
                  background: priorityFilter === f.id ? '#0b2545' : '#ffffff',
                  color: priorityFilter === f.id ? '#ffffff' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table" style={{ width: '100%', fontSize: '11px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Habitation &amp; Taluk</th>
                <th style={{ textAlign: 'center' }}>Hazard Zone</th>
                <th style={{ textAlign: 'right' }}>Total Pop</th>
                <th style={{ textAlign: 'right' }}>PwD Count</th>
                <th style={{ textAlign: 'right' }}>Elderly (&gt;60)</th>
                <th style={{ textAlign: 'right' }}>Infants (&lt;5)</th>
                <th style={{ textAlign: 'right' }}>Kutcha Houses</th>
                <th style={{ textAlign: 'center' }}>SoVI Score</th>
                <th style={{ textAlign: 'center' }}>Evac Priority</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(h => {
                const isRed = h.zone === 'RED';
                const isOrange = h.zone === 'ORANGE';
                const zoneBadge = isRed ? 'badge-red' : isOrange ? 'badge-amber' : 'badge-green';
                const priorityBadge = h.priority_score >= 1.0 ? 'badge-red' : h.priority_score >= 0.7 ? 'badge-amber' : 'badge-green';

                return (
                  <tr key={h.id}>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{h.name}</strong>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>{h.id} &bull; {h.taluk || h.district}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={zoneBadge} style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                        {h.zone}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>{h.population?.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', color: (h.pwd_count || 0) > 20 ? '#b91c1c' : '#475569', fontWeight: (h.pwd_count || 0) > 20 ? '700' : '400' }}>
                      {h.pwd_count || 0}
                    </td>
                    <td style={{ textAlign: 'right', color: (h.elderly_count || 0) > 100 ? '#c2410c' : '#475569' }}>
                      {h.elderly_count || 0}
                    </td>
                    <td style={{ textAlign: 'right', color: '#1d4ed8' }}>
                      {h.infant_count || 0}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      {h.kutcha_houses || 0}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: '700' }}>{Number(h.sovi_score || 0.5).toFixed(2)}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={priorityBadge} style={{ fontSize: '9.5px', padding: '2px 5px' }}>
                        {h.priority_score >= 1.0 ? 'P1 IMMEDIATE' : h.priority_score >= 0.7 ? 'P2 HIGH' : 'P3 NORMAL'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {onSelectHabitation && (
                        <button
                          onClick={() => onSelectHabitation(h)}
                          style={{
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            padding: '3px 7px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          XAI Audit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
