import React, { useState } from 'react';
import { 
  Bot, Shield, CheckCircle2, AlertTriangle, Copy, Check, Download, 
  Send, Sparkles, BookOpen, ExternalLink, X, RefreshCw 
} from 'lucide-react';
import { queryGenAIAssistant } from '../services/api';
import ndrfEmblem from '../assets/ndrf_emblem.png';

const QUICK_PROMPTS = [
  { label: "Night Convoy Speed Limits", query: "What are the rules for night evacuation convoys and speed limits in hill corridors under NDRF SOP?" },
  { label: "DM Act Requisition Powers", query: "What legal powers does the District Magistrate have to requisition private buses and premises under the Disaster Management Act 2005?" },
  { label: "Sphere Standards (Water/Area)", query: "What are the Sphere minimum standards for drinking water and covered living space per person in relief shelters?" },
  { label: "Helipad Landing Zone Specs", query: "What are the technical landing zone dimensions and requirements for IAF ALH Dhruv or MI-17 helicopters during air evacuation?" },
  { label: "Gemini Boat Flood Operations", query: "What are the NDRF operational guidelines for Gemini inflatable motorboats in flood inundation zones?" }
];

export default function AIAssistantModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setResponse(null);
    try {
      const res = await queryGenAIAssistant(query);
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setQuery(promptText);
    setLoading(true);
    setResponse(null);
    queryGenAIAssistant(promptText).then(res => {
      setResponse(res);
      setLoading(false);
    });
  };

  const copyToClipboard = () => {
    if (!response?.answer) return;
    navigator.clipboard.writeText(response.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportMarkdown = () => {
    if (!response?.answer) return;
    const text = `# NDRF Official Decision Support Advisory\n\n**Query:** ${query}\n**Model:** ${response.model_used}\n**Status:** ${response.verification_status}\n**Confidence:** ${Math.round((response.confidence_score || 0) * 100)}%\n\n---\n\n${response.answer}\n\n---\n## Citations:\n` +
      response.sources.map(s => `- **${s.title}** (${s.source})\n  *${s.excerpt}*`).join('\n\n');
    
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NDRF_Decision_Support_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
        maxWidth: '860px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 22px',
          background: 'linear-gradient(135deg, #091e3a, #0b2952)',
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src={ndrfEmblem} 
              alt="NDRF Crest" 
              style={{ width: '42px', height: '42px', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.4px', margin: 0 }}>
                  NDRF AI Decision Support Assistant
                </h2>
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Shield size={10} /> 100% SOP-GROUNDED
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                Ministry of Home Affairs &bull; Evidence-based retrieval strictly bounded by NDRF SOPs & DM Act 2005
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
              padding: '6px',
              borderRadius: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Quick Query Suggestions */}
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Suggested Operational Inquiries:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {QUICK_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(p.query)}
                  style={{
                    background: '#0d233e',
                    border: '1px solid #1e3a5f',
                    color: '#93c5fd',
                    padding: '5px 11px',
                    borderRadius: '5px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#132e50'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#1e3a5f'; e.currentTarget.style.background = '#0d233e'; }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask an operational or regulatory question (e.g., night convoy speed limits, requisition rules, water standards)..."
              style={{
                flex: 1,
                background: '#0a1d33',
                border: '1px solid #1e3a5f',
                borderRadius: '6px',
                padding: '11px 14px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#1e3a5f'}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              style={{
                background: loading ? '#1e3a5f' : 'linear-gradient(135deg, #1e40af, #2563eb)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0 18px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px'
              }}
            >
              {loading ? <RefreshCw size={15} className="spin-animate" /> : <Send size={15} />}
              <span>{loading ? 'Evaluating...' : 'Query'}</span>
            </button>
          </form>

          {/* Response Container */}
          {response && (
            <div style={{
              background: '#091c33',
              border: '1px solid #1e3a5f',
              borderRadius: '8px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {/* Status Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {response.is_grounded ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4ade80', fontSize: '11.5px', fontWeight: 'bold' }}>
                      <CheckCircle2 size={15} color="#22c55e" /> EVIDENCE GROUNDED &bull; VERIFIED
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f87171', fontSize: '11.5px', fontWeight: 'bold' }}>
                      <AlertTriangle size={15} color="#ef4444" /> UNVERIFIED / REFUSAL TO SPECULATE
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: '#64748b' }}>&bull;</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Engine: <b style={{ color: '#cbd5e1' }}>{response.model_used}</b> ({response.latency_ms} ms)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      background: 'transparent',
                      border: '1px solid #1e3a5f',
                      color: copied ? '#4ade80' : '#94a3b8',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={exportMarkdown}
                    style={{
                      background: 'transparent',
                      border: '1px solid #1e3a5f',
                      color: '#94a3b8',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Download size={12} />
                    Export
                  </button>
                </div>
              </div>

              {/* Confidence Meter */}
              {response.confidence_score > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>SOP Grounding Match:</span>
                  <div style={{ flex: 1, background: '#0a1d33', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.round(response.confidence_score * 100)}%`,
                      height: '100%',
                      background: response.confidence_score >= 0.75 ? '#22c55e' : '#f59e0b'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#38bdf8', fontWeight: 'bold' }}>
                    {Math.round(response.confidence_score * 100)}%
                  </span>
                </div>
              )}

              {/* Answer Content */}
              <div style={{
                color: '#e2e8f0',
                fontSize: '13px',
                lineHeight: '1.65',
                whiteSpace: 'pre-wrap',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                {response.answer}
              </div>

              {/* Citation Cards */}
              {response.sources && response.sources.length > 0 && (
                <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <BookOpen size={13} />
                    Authoritative Citations & Legal Excerpts:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {response.sources.map((src, i) => (
                      <div key={i} style={{
                        background: '#071629',
                        border: '1px solid #163354',
                        borderRadius: '6px',
                        padding: '10px 14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>
                            {src.title}
                          </span>
                          <span style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '3px' }}>
                            {src.source}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginTop: '5px', fontStyle: 'italic', lineHeight: '1.45' }}>
                          "{src.excerpt}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Idle Instructions */}
          {!response && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '30px 20px',
              color: '#64748b',
              fontSize: '12.5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Bot size={36} color="#334155" />
              <div>Enter an operational inquiry or select a suggested prompt above.</div>
              <div style={{ fontSize: '11px', color: '#475569', maxWidth: '500px' }}>
                Responses are strictly grounded in NDRF SOPs, NDMA Landslide & Flood guidelines, and the Disaster Management Act 2005. Hallucinations and unsupported speculations are automatically rejected.
              </div>
            </div>
          )}
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
          <div>
            Official Government AI Decision Support &bull; Security Level: <b>RESTRICTED</b>
          </div>
          <div>
            All queries cryptographically logged to NDRF Audit Trail
          </div>
        </div>
      </div>
    </div>
  );
}
