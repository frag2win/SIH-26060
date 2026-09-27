'use client';

import React, { useState } from 'react';
import { AiPrediction, StationTelemetry } from '@/types/telemetry';
import { 
  BrainCircuit, 
  Sparkles, 
  AlertTriangle, 
  RotateCw, 
  Volume2, 
  Key, 
  Clock, 
  CheckCircle, 
  Play,
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
  const [executedActions, setExecutedActions] = useState<number[]>([]);

  const getThreatBadge = (level?: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-950 text-red-200 border-red-500 font-black',
          dot: 'bg-red-500',
          label: 'CRITICAL THREAT (LEVEL 4)',
          textClass: 'text-red-400'
        };
      case 'high':
        return {
          bg: 'bg-amber-950 text-amber-200 border-amber-500 font-bold',
          dot: 'bg-amber-500',
          label: 'HIGH RISK (LEVEL 3)',
          textClass: 'text-amber-400'
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-950 text-yellow-200 border-yellow-500 font-bold',
          dot: 'bg-yellow-400',
          label: 'MODERATE RISK (LEVEL 2)',
          textClass: 'text-yellow-400'
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold',
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

  const handleExecuteSingleAction = (index: number) => {
    playTacticalBlip(950, 60);
    setExecutedActions((prev) => [...prev, index]);
    if (!mitigationDone) {
      handleMitigateClick();
    }
  };

  const handleSpeak = () => {
    if (!prediction) return;
    playTacticalBlip(800, 40);
    const speechText = `${prediction.title}. Root cause: ${prediction.rootCause}. Recommended protocol: ${prediction.protocolCode}.`;
    speakTacticalVoice(speechText);
  };

  const threat = getThreatBadge(prediction?.threatLevel);

  return (
    <div className="glass-panel p-5 border border-cyan-500/30 relative overflow-hidden">
      {/* Background glowing aura based on threat score */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 blur-3xl pointer-events-none opacity-20"
        style={{
          backgroundColor: prediction?.threatLevel === 'critical' ? '#ef4444' : prediction?.threatLevel === 'high' ? '#f59e0b' : '#10b981'
        }}
      ></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800 light:border-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Gemini Autonomous Mission Overseer</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase font-bold">
                Predictive AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600">
              Deep telemetry correlation • Failure forecasting • Actionable protocol execution
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Read aloud voice */}
          <button
            onClick={handleSpeak}
            className="p-1.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 hover:bg-slate-800 text-cyan-400 border border-slate-800 light:border-slate-300 transition-colors"
            title="Read analysis out loud in Government Command Voice"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Gemini API Key Toggle */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 hover:bg-slate-800 text-slate-200 dark:text-slate-200 light:text-slate-800 border border-slate-800 light:border-slate-300 text-xs font-mono transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950 dark:bg-indigo-950 light:bg-indigo-100 hover:bg-indigo-900 text-indigo-200 dark:text-indigo-200 light:text-indigo-900 border border-indigo-800 light:border-indigo-300 text-xs font-bold transition-all hover:scale-105 uppercase"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'Re-Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showKeyInput && (
        <div className="mb-4 p-3 bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border border-indigo-900/50 light:border-indigo-300 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-semibold">Custom Google Gemini API Key (Optional)</span>
            <span className="text-[10px] text-slate-400 font-mono">Defaults to Built-in Polar Expert Heuristic</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste your Gemini API key (AI Studio)"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="flex-1 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 light:border-slate-300 px-3 py-1.5 text-xs text-white dark:text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              onClick={() => {
                onRefreshPrediction(customApiKey);
                setShowKeyInput(false);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase transition-colors"
            >
              Save & Query
            </button>
          </div>
        </div>
      )}

      {/* Prediction Content */}
      {prediction ? (
        <div className="space-y-4">
          {/* Alert Title & Threat Gauge Row (Sharp Box) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 light:border-slate-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10.5px] font-mono border uppercase flex items-center gap-1.5 ${threat.bg}`}>
                  <span className={`w-2 h-2 ${threat.dot} animate-ping`}></span>
                  {threat.label}
                </span>
                <span className="text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-600 font-semibold">
                  Confidence: {prediction.confidenceScore}%
                </span>
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 tracking-tight">{prediction.title}</h3>
              <p className="text-xs text-slate-200 dark:text-slate-200 light:text-slate-700 leading-relaxed font-normal">{prediction.summary}</p>
            </div>

            {/* Threat Gauge */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400">THREAT SCORE</div>
                <div className={`text-2xl font-black font-mono tracking-tight ${threat.textClass}`}>
                  {prediction.threatScore}<span className="text-xs text-slate-400">/100</span>
                </div>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <rect x="4" y="4" width="40" height="40" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                  <rect
                    x="4"
                    y="4"
                    width="40"
                    height="40"
                    stroke={prediction.threatLevel === 'critical' ? '#ef4444' : prediction.threatLevel === 'high' ? '#f59e0b' : '#10b981'}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={160}
                    strokeDashoffset={160 - (160 * prediction.threatScore) / 100}
                  />
                </svg>
                <div className="absolute text-[10px] font-mono font-bold text-white dark:text-white light:text-slate-900">
                  {prediction.threatScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Root Cause & Time to Impact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Root Cause Card */}
            <div className="md:col-span-2 p-4 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-300">
              <div className="text-[11px] font-mono text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-bold mb-1 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>ROOT CAUSE HYPOTHESIS</span>
              </div>
              <p className="text-xs text-slate-200 dark:text-slate-200 light:text-slate-700 leading-relaxed">{prediction.rootCause}</p>
              
              <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-600">
                <span className="text-slate-400">Affected Modules:</span>
                {prediction.affectedModules.map((m, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-200 border border-slate-800 light:border-slate-300 text-cyan-300 dark:text-cyan-300 light:text-cyan-900 font-semibold">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Time to Failure Card */}
            <div className="p-4 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-300 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono text-amber-400 dark:text-amber-400 light:text-amber-700 font-bold mb-1 flex items-center gap-1.5 uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>TIME TO IMPACT</span>
                </div>
                <div className="text-2xl font-black font-mono text-white dark:text-white light:text-slate-900 mt-1">
                  {prediction.timeToImpactHours < 1
                    ? `${Math.round(prediction.timeToImpactHours * 60)} Mins`
                    : `${prediction.timeToImpactHours.toFixed(1)} Hours`}
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                Protocol: <span className="text-amber-300 dark:text-amber-300 light:text-amber-700 font-black">{prediction.protocolCode}</span>
              </div>
            </div>
          </div>

          {/* ACTIONABLE PROTOCOLS: Make recommended actions clickable interactive buttons! */}
          <div className="p-4 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-cyan-900/40 light:border-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="text-xs font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Actionable Mitigation Protocol (Click to Execute)</span>
              </div>

              {prediction.threatLevel !== 'low' && (
                <button
                  onClick={handleMitigateClick}
                  disabled={isMitigating || mitigationDone}
                  className={`flex items-center gap-2 px-3.5 py-1.5 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 uppercase tracking-wide ${
                    mitigationDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                  }`}
                >
                  {mitigationDone ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-200" />
                      <span>Protocol Executed!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>{isMitigating ? 'Executing...' : '1-Click Auto-Mitigate All'}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Clickable Action Protocol Items */}
            <div className="space-y-2">
              {prediction.recommendedActions.map((action, i) => {
                const isExecuted = executedActions.includes(i) || mitigationDone;
                return (
                  <div 
                    key={i} 
                    onClick={() => handleExecuteSingleAction(i)}
                    className={`flex items-center justify-between p-2.5 border text-xs cursor-pointer transition-all hover:border-cyan-400 ${
                      isExecuted
                        ? 'bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50 border-emerald-600/60 text-emerald-200 light:text-emerald-900'
                        : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border-slate-800 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold ${
                        isExecuted ? 'bg-emerald-600 text-white' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}>
                        {isExecuted ? '✓' : i + 1}
                      </span>
                      <span className="leading-snug font-medium">{action}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold shrink-0 ml-3">
                      {isExecuted ? (
                        <span className="text-emerald-400 dark:text-emerald-300 light:text-emerald-700">EXECUTED</span>
                      ) : (
                        <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700 flex items-center gap-1 hover:underline">
                          <span>Dispatch</span>
                          <Play className="w-2.5 h-2.5 fill-current" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400">
          <BrainCircuit className="w-10 h-10 mx-auto text-slate-500 mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-slate-200">Awaiting Telemetry Stream Ingestion...</p>
          <p className="text-xs text-slate-400 mt-1">Connecting to MoES Indian Antarctic Ground Link</p>
        </div>
      )}
    </div>
  );
};
