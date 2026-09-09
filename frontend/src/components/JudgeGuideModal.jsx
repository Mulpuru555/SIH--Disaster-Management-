import React, { useState } from 'react';
import { Award, ChevronRight, Play, Clock, X } from 'lucide-react';

export default function JudgeGuideModal({ onClose, onTriggerCloudburst, onReset, onSwitchSector, onOpenOrder }) {
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    {
      step: 1,
      time: "0:00 - 0:45",
      title: "Problem & Pan-India Real-Time Scope",
      pitch: "ResQGrid is India's first proactive decision-support portal for SIH26191 (NDRF / MHA), covering all 28 States and 8 Union Territories with real-time live Open-Meteo & IMD radar telemetry.",
      actionLabel: "Show All-India Telemetry",
      instruction: "Point out the live AWS Weather telemetry pill at the top and open the State Selector dropdown to prove full 36 State & UT coverage across the nation.",
      buttonAction: () => onSwitchSector && onSwitchSector('all_india')
    },
    {
      step: 2,
      time: "0:45 - 1:30",
      title: "Geotechnical Red Zone Identification & XAI",
      pitch: "Instead of static maps, ResQGrid dynamically calculates slope shear stability (Factor of Safety) and Social Vulnerability (SoVI). When rainfall exceeds 115 mm/hr, vulnerable habitations automatically turn to RED ZONES with full Explainable AI (SHAP) transparency.",
      actionLabel: "Trigger Cloudburst Red Alert (165 mm/hr)",
      instruction: "Click 'Simulate Extreme Cloudburst' on the left panel to demonstrate dynamic zone shifting, then click any 'XAI' button on the map or table to show the mathematical SHAP contribution chart.",
      buttonAction: () => onTriggerCloudburst && onTriggerCloudburst()
    },
    {
      step: 3,
      time: "1:30 - 2:15",
      title: "UN Sphere Carrying Capacity Audit",
      pitch: "Relief efforts often cause secondary disasters when camps overflow. ResQGrid audits relief camps against strict UN Sphere Humanitarian Standards (3.5 m² living space, 15L water/day, 1 toilet per 20 persons), identifying the exact bottleneck resource (Beds, Water, Sanitation).",
      actionLabel: "Inspect Relief Shelters Matrix",
      instruction: "Show the Relief Shelter Capacity meters in the right sidebar. Notice how each camp flags its bottleneck resource before saturation occurs.",
      buttonAction: null
    },
    {
      step: 4,
      time: "2:15 - 2:45",
      title: "Google OR-Tools MILP Zero-Overflow Optimization",
      pitch: "Using Mixed-Integer Linear Programming (MILP) solved via Google OR-Tools in under 6 milliseconds, ResQGrid generates optimal convoy fleet assignments with a mathematical guarantee of zero shelter overflow and minimized transit exposure.",
      actionLabel: "Open NDRF Official Dispatch Order",
      instruction: "Click the 'NDRF Official Order' button in the top header. Show the judges the generated statutory order with bus convoys, ambulance medical escorts, and precise travel ETAs.",
      buttonAction: () => onOpenOrder && onOpenOrder()
    },
    {
      step: 5,
      time: "2:45 - 3:00",
      title: "3-Tier Statutory Horizons & Permanent Resettlement",
      pitch: "ResQGrid bridges immediate evacuation with permanent rehabilitation. We provide 3 distinct statutory horizons: Immediate (0-48h), Short-Term (pre-monsoon staging), and Medium-Term (permanent hazard-free tableland townships with land bank carrying capacities).",
      actionLabel: "Reset to Normal Sensor Baseline",
      instruction: "Switch the Horizon toggle in the top-right header to 'Medium-Term (Permanent)' to showcase the permanent land bank townships.",
      buttonAction: () => onReset && onReset()
    }
  ];

  const current = STEPS[activeStep];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(3, 10, 20, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#07192f',
        border: '1px solid #3b82f6',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '680px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(90deg, #0d2847, #1e3a5f)',
          padding: '12px 18px',
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#fbbf24" />
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>
                ResQGrid &bull; 3-Minute Presentation Guide for Judges
              </h3>
              <div style={{ fontSize: '10.5px', color: '#93c5fd' }}>
                Smart India Hackathon 2026 &bull; Problem Statement SIH26191 (NDRF / MHA)
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
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div style={{
          display: 'flex',
          background: '#0a1d35',
          borderBottom: '1px solid #163354',
          padding: '8px 16px',
          gap: '6px',
          overflowX: 'auto'
        }}>
          {STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '11px',
                fontWeight: activeStep === idx ? '800' : '600',
                borderRadius: '4px',
                border: activeStep === idx ? '1px solid #3b82f6' : '1px solid transparent',
                background: activeStep === idx ? '#1e3a5f' : '#071526',
                color: activeStep === idx ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px'
              }}
            >
              <span style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: activeStep === idx ? '#3b82f6' : '#1e3a5f',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9.5px'
              }}>
                {s.step}
              </span>
              <span>Min {s.step}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Step Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #163354', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 7px', borderRadius: '4px', fontWeight: 'bold' }}>
                STEP {current.step} OF 5
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                {current.title}
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '11px' }}>
              <Clock size={13} />
              <span>{current.time}</span>
            </div>
          </div>

          {/* Script to speak */}
          <div style={{ background: '#0a1d35', border: '1px solid #1e3a5f', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', color: '#60a5fa', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
              🎙️ WHAT TO SAY TO THE JUDGES:
            </div>
            <p style={{ fontSize: '12.5px', color: '#f8fafc', lineHeight: '1.5', fontStyle: 'italic', margin: 0 }}>
              "{current.pitch}"
            </p>
          </div>

          {/* Action to take on screen */}
          <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', color: '#4ade80', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
              🎯 WHAT TO DO ON SCREEN:
            </div>
            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4', margin: 0 }}>
              {current.instruction}
            </p>

            {current.buttonAction && (
              <button
                onClick={current.buttonAction}
                style={{
                  marginTop: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#15803d',
                  color: 'white',
                  border: 'none',
                  padding: '7px 12px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Play size={13} fill="white" />
                <span>{current.actionLabel}</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          background: '#071526',
          borderTop: '1px solid #163354',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
            style={{
              background: '#0a1d35',
              color: activeStep === 0 ? '#475569' : '#cbd5e1',
              border: '1px solid #1e3a5f',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '11.5px',
              cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            &larr; Previous Step
          </button>

          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            Press Esc or Close when ready to present
          </div>

          {activeStep < STEPS.length - 1 ? (
            <button
              onClick={() => setActiveStep(prev => prev + 1)}
              style={{
                background: '#1d4ed8',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '11.5px',
                cursor: 'pointer',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Next Step</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '11.5px',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              ✓ Ready for Demonstration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
