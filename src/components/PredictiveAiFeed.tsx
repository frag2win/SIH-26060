'use client';

import React, { useState } from 'react';
import { AiPrediction, StationTelemetry } from '@/types/telemetry';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  RotateCw, 
  Volume2, 
  Key, 
  Clock, 
  CheckCircle, 
  Flame,
  Zap,
  CheckCheck
} from 'lucide-react';
import { playTacticalBlip, playSuccessChime, speakTacticalVoice } from '@/utils/audioAlerts';
import confetti from 'canvas-confetti';

interface PredictiveAiFeedProps {
  prediction: AiPrediction | null;
  isLoading: boolean;
  onRefreshPrediction: (customKey?: string) => void;
  onAutoMitigate: () => void;
  isMitigating: boolean;
  telemetry: StationTelemetry;
}

export const PredictiveAiFeed: React.FC<PredictiveAiFeedProps> = ({
  prediction,
  isLoading,
  onRefreshPrediction,
  onAutoMitigate,
  isMitigating,
  telemetry
}) => {
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [mitigationDone, setMitigationDone] = useState(false);

  const getThreatBadge = (level?: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-rose-950/90 border-rose-500 text-rose-200',
          dot: 'bg-rose-500',
          label: 'CRITICAL THREAT (LEVEL 4)',
          textClass: 'text-rose-400'
        };
      case 'high':
        return {
          bg: 'bg-amber-950/90 border-amber-500 text-amber-200',
          dot: 'bg-amber-500',
          label: 'HIGH RISK (LEVEL 3)',
          textClass: 'text-amber-400'
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-950/80 border-yellow-500 text-yellow-200',
          dot: 'bg-yellow-400',
          label: 'MODERATE RISK (LEVEL 2)',
          textClass: 'text-yellow-400'
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-950/80 border-emerald-500 text-emerald-200',
          dot: 'bg-emerald-500',
          label: 'STABLE BASELINE (LEVEL 1)',
          textClass: 'text-emerald-400'
        };
    }
  };

  const handleMitigateClick = () => {
    playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setMitigationDone(true);
    onAutoMitigate();
    setTimeout(() => setMitigationDone(false), 5000);
  };

  const handleSpeak = () => {
    if (!prediction) return;
    playTacticalBlip(800, 40);
    const speechText = `${prediction.title}. Root cause: ${prediction.rootCause}. Recommended action: ${prediction.recommendedActions[0] || 'Observe system'}.`;
    speakTacticalVoice(speechText);
  };

  const threat = getThreatBadge(prediction?.threatLevel);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/25 relative overflow-hidden">
      {/* Background glowing aura based on threat score */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{
          backgroundColor: prediction?.threatLevel === 'critical' ? '#f43f5e' : prediction?.threatLevel === 'high' ? '#f59e0b' : '#10b981'
        }}
      ></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-900/40">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Gemini Autonomous Mission Overseer</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Predictive AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deep telemetry correlation • Failure forecasting • Automated protocol recommendations
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Read aloud voice */}
          <button
            onClick={handleSpeak}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition-colors"
            title="Read analysis out loud in Government Command Voice"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Gemini API Key Toggle */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-colors"
            title="Configure Custom Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          {/* Refresh AI Analysis */}
          <button
            onClick={() => {
              playTacticalBlip(750, 40);
              onRefreshPrediction(customApiKey);
            }}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-800 text-xs font-semibold transition-all hover:scale-105"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'Re-Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showKeyInput && (
        <div className="mb-4 p-3 rounded-xl bg-slate-950 border border-indigo-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Custom Google Gemini API Key (Optional)</span>
            <span className="text-[10px] text-slate-400 font-mono">Defaults to Built-in Polar Expert Heuristic</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste your Gemini API key (AI Studio)"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => {
                onRefreshPrediction(customApiKey);
                setShowKeyInput(false);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Save & Query
            </button>
          </div>
        </div>
      )}

      {/* Prediction Content */}
      {prediction ? (
        <div className="space-y-4">
          {/* Alert Title & Threat Gauge Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase flex items-center gap-1.5 ${threat.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${threat.dot} animate-ping`}></span>
                  {threat.label}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Confidence: {prediction.confidenceScore}%
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{prediction.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{prediction.summary}</p>
            </div>

            {/* Threat Gauge */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-500">THREAT SCORE</div>
                <div className={`text-2xl font-black font-mono tracking-tight ${threat.textClass}`}>
                  {prediction.threatScore}<span className="text-xs text-slate-500">/100</span>
                </div>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    stroke={prediction.threatLevel === 'critical' ? '#f43f5e' : prediction.threatLevel === 'high' ? '#f59e0b' : '#10b981'}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={113}
                    strokeDashoffset={113 - (113 * prediction.threatScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-[10px] font-mono font-bold text-white">
                  {prediction.threatScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Root Cause & Time to Impact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Root Cause Card */}
            <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-[11px] font-mono text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ROOT CAUSE HYPOTHESIS</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{prediction.rootCause}</p>
              
              <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="text-slate-500">Affected Modules:</span>
                {prediction.affectedModules.map((m, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Time to Failure Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>TIME TO IMPACT</span>
                </div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {prediction.timeToImpactHours < 1
                    ? `${Math.round(prediction.timeToImpactHours * 60)} Mins`
                    : `${prediction.timeToImpactHours.toFixed(1)} Hours`}
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Protocol: <span className="text-amber-300 font-bold">{prediction.protocolCode}</span>
              </div>
            </div>
          </div>

          {/* Recommended Actions Protocol & One-Click Mitigate */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-900/40">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Automated Mitigation Protocol (MoES SOP)</span>
              </div>

              {prediction.threatLevel !== 'low' && (
                <button
                  onClick={handleMitigateClick}
                  disabled={isMitigating || mitigationDone}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95 ${
                    mitigationDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-950'
                  }`}
                >
                  {mitigationDone ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-200" />
                      <span>Mitigation Executed!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>{isMitigating ? 'Executing Protocol...' : '1-Click Auto-Mitigate'}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-2">
              {prediction.recommendedActions.map((action, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/70 p-2 rounded-lg border border-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400">
          <BrainCircuit className="w-10 h-10 mx-auto text-slate-600 mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-slate-300">Awaiting Telemetry Stream Ingestion...</p>
          <p className="text-xs text-slate-500 mt-1">Connecting to MoES Indian Antarctic Ground Link</p>
        </div>
      )}
    </div>
  );
};
