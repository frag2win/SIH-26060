'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ArrowRight, 
  Award, 
  Zap,
  Globe2
} from 'lucide-react';
import { playTacticalBlip } from '@/utils/audioAlerts';

interface PitchTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemoScenario: () => void;
}

export const PitchTourModal: React.FC<PitchTourModalProps> = ({
  isOpen,
  onClose,
  onLaunchDemoScenario
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'architecture' | 'checklist'>('flow');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-3xl p-6 bg-black/95 dark:bg-black/95 light:bg-white border border-neutral-700 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800 light:border-neutral-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-900 border border-[#f97316]/50 text-[#f97316] shadow-md">
              <Award className="w-6 h-6 text-[#f97316]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 text-white border border-neutral-700 font-bold uppercase">
                  SIH Problem Statement PS 26060
                </span>
                <span className="text-xs text-[#f97316] font-mono font-bold">Judge Pitch Walkthrough</span>
              </div>
              <h3 className="text-lg font-bold text-white dark:text-white light:text-black tracking-tight">
                MoES Antarctic Digital Twin Presentation Guide
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                How to deliver a winning pitch demonstration to Ministry of Earth Sciences evaluators.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTacticalBlip(500, 40);
              onClose();
            }}
            className="p-1.5 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-200 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 border-b border-neutral-800 light:border-neutral-300 my-4 text-xs font-mono font-bold uppercase">
          <button
            onClick={() => {
              playTacticalBlip(700, 30);
              setActiveTab('flow');
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'flow'
                ? 'border-[#f97316] text-[#f97316] font-black'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            5-Minute Pitch Script
          </button>

          <button
            onClick={() => {
              playTacticalBlip(700, 30);
              setActiveTab('architecture');
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'architecture'
                ? 'border-[#f97316] text-[#f97316] font-black'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Vercel Serverless Architecture
          </button>

          <button
            onClick={() => {
              playTacticalBlip(700, 30);
              setActiveTab('checklist');
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'checklist'
                ? 'border-[#f97316] text-[#f97316] font-black'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            SIH PS 26060 Success Criteria
          </button>
        </div>

        {/* Tab 1: 5-Minute Pitch Script */}
        {activeTab === 'flow' && (
          <div className="space-y-3.5 my-3">
            <div className="p-3.5 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300">
              <div className="flex items-center gap-2 text-xs font-bold text-[#f97316] uppercase mb-1 font-mono">
                <span>Phase 1: The Context & Problem (60 Seconds)</span>
              </div>
              <p className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                Explain to judges: <em>&ldquo;India operates two extreme polar stations in Antarctica: Bharati and Maitri. In sub -50°C blizzards and 6 months of polar darkness, a 30-minute power or fuel failure is fatal. MoES command in New Delhi needs unified real-time telemetry, predictive failure forecasting, and automated mitigation authority.&rdquo;</em>
              </p>
              <div className="mt-2 text-[11px] font-mono text-[#f97316] font-bold">
                👉 Demo Action: Toggle between Bharati and Maitri in top bar to show instantaneous zero-reload switching.
              </div>
            </div>

            <div className="p-3.5 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300">
              <div className="flex items-center gap-2 text-xs font-bold text-[#f97316] uppercase mb-1 font-mono">
                <span>Phase 2: The Anomaly Shock (90 Seconds)</span>
              </div>
              <p className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                Click <strong>&ldquo;Simulate Crisis&rdquo;</strong> and select <strong>&ldquo;Generator 1 Coolant Boiling & Cavitation&rdquo;</strong>:
              </p>
              <ul className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 space-y-1 list-disc list-inside mt-1 font-medium">
                <li>Top-down station schematic pulses on Primary Power Generation Plant.</li>
                <li>NOC tactical klaxon sounds; incident log registers high priority telemetry event.</li>
                <li>Coolant spikes to 99.4°C and vibration jumps to 7.4 mm/s.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-700 light:border-neutral-300">
              <div className="flex items-center gap-2 text-xs font-bold text-white dark:text-white light:text-black uppercase mb-1 font-mono">
                <span>Phase 3: The Gemini AI Predictive Wow Factor (90 Seconds)</span>
              </div>
              <p className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                Showcase the <strong>Gemini Autonomous Mission Overseer</strong> panel:
              </p>
              <ul className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 space-y-1 list-disc list-inside mt-1 font-medium">
                <li>AI computes threat score (94/100) and predicts <strong>Time to Impact: 42 Minutes</strong> before thermal trip.</li>
                <li>AI derives root cause: Secondary heat exchanger cavitation.</li>
                <li>AI proposes <strong>PROTOCOL-BRAVO</strong> (pre-lubricating Standby Gen 3 and transferring 45 kW bus).</li>
              </ul>
            </div>

            <div className="p-3.5 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-700 light:border-neutral-300">
              <div className="flex items-center gap-2 text-xs font-bold text-white dark:text-white light:text-black uppercase mb-1 font-mono">
                <span>Phase 4: One-Click Autonomous Mitigation & MoES Audit (60 Seconds)</span>
              </div>
              <p className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                Click the <strong>&ldquo;1-Click Auto-Mitigate&rdquo;</strong> button. The system transmits remote actuator commands, shifts the load to Generator 3, normalizes temperatures, rings celebration chime, and enters the action into the <strong>MoES Incident Audit Register</strong>.
              </p>
              <div className="mt-2 text-[11px] font-mono text-white dark:text-white light:text-black font-bold">
                👉 Demo Action: Click &ldquo;Export Audit Trail&rdquo; to demonstrate ISO/IEC regulatory compliance download for government review.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-3.5 my-3 text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
            <div className="p-3.5 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300">
              <div className="text-xs font-bold text-white dark:text-white light:text-black uppercase mb-2 flex items-center gap-1.5 font-mono">
                <Globe2 className="w-4 h-4 text-[#f97316]" />
                <span>Next.js App Router + Vercel Serverless Edge</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="bg-neutral-900 dark:bg-neutral-900 light:bg-white p-2.5 border border-neutral-800 light:border-neutral-300">
                  <span className="text-white font-bold block mb-1">/api/telemetry</span>
                  <span className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Generates real-time polar telemetry physics engine with multi-station persistence.</span>
                </div>
                <div className="bg-neutral-900 dark:bg-neutral-900 light:bg-white p-2.5 border border-neutral-800 light:border-neutral-300">
                  <span className="text-[#f97316] font-bold block mb-1">/api/ai-analysis</span>
                  <span className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Google Gemini API integration with deep polar failure heuristic fallback.</span>
                </div>
                <div className="bg-neutral-900 dark:bg-neutral-900 light:bg-white p-2.5 border border-neutral-800 light:border-neutral-300">
                  <span className="text-white font-bold block mb-1">/api/station-control</span>
                  <span className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Simulates satellite Earth link remote actuator commands with execution IDs.</span>
                </div>
                <div className="bg-neutral-900 dark:bg-neutral-900 light:bg-white p-2.5 border border-neutral-800 light:border-neutral-300">
                  <span className="text-[#f97316] font-bold block mb-1">Polar Monolithic UI</span>
                  <span className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Sharp 0px Leica instrumentation + Web Audio synthesizer + SVG digital twin.</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300">
              <div className="text-xs font-bold text-white dark:text-white light:text-black uppercase mb-2 flex items-center gap-1.5 font-mono">
                <Zap className="w-4 h-4 text-[#f97316]" />
                <span>Zero Deployment Friction</span>
              </div>
              <p className="leading-relaxed">
                Optimized 100% for Vercel deployment without heavy database infrastructure dependencies. Evaluators can access the live URL on any browser, laptop, or mobile tablet with zero latency.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Success Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-2.5 my-3 text-xs">
            {[
              {
                title: 'Instant Zero-Latency NOC Dashboard',
                desc: 'Client-side microgrid polling with speed throttles (1x, 2x, 5x, pause).'
              },
              {
                title: 'Dual Station Remote Management',
                desc: 'Bharati (Larsemann Hills) and Maitri (Schirmacher Oasis) unique architectures.'
              },
              {
                title: 'Interactive 2D Architectural Digital Twin Map',
                desc: 'Top-down SVG schematic with status pulses and contextual click-to-diagnose modal.'
              },
              {
                title: 'Gemini AI Threat Forecasting (SIH X-Factor)',
                desc: 'Predictive time-to-failure calculation and SOP protocols before catastrophic breakdown.'
              },
              {
                title: 'Remote Actuator Autonomous Mitigation',
                desc: '1-Click resolution of emergency anomalies with audible NOC feedback.'
              },
              {
                title: 'Official Government Readiness',
                desc: 'MoES & NCPOR branding, Indian tricolor ribbon, and downloadable audit trail CSV.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white dark:text-white light:text-black">{item.title}</div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 light:border-neutral-300 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-neutral-400 font-mono">
            Smart India Hackathon • Problem Statement PS 26060
          </span>

          <button
            onClick={() => {
              playTacticalBlip(800, 50);
              onLaunchDemoScenario();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all hover:scale-105 uppercase tracking-wide border border-white"
          >
            <span>Launch Presentation Demo</span>
            <ArrowRight className="w-4 h-4 text-[#f97316]" />
          </button>
        </div>
      </div>
    </div>
  );
};
