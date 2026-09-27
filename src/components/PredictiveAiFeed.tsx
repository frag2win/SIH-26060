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
  isDarkTheme?: boolean;
}

export const PredictiveAiFeed: React.FC<PredictiveAiFeedProps> = ({
  prediction,
  isLoading,
  onRefreshPrediction,
  onAutoMitigate,
  isMitigating,
  telemetry,
  isDarkTheme = true
}) => {
  const isDark = isDarkTheme;
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [mitigationDone, setMitigationDone] = useState(false);
  const [executedActions, setExecutedActions] = useState<number[]>([]);

  const getThreatBadge = (level?: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: isDark ? 'bg-white text-black font-black border-2 border-white' : 'bg-black text-white font-black border-2 border-black',
          dot: isDark ? 'bg-black' : 'bg-white',
          label: 'CRITICAL THREAT (LEVEL 4)',
          textClass: isDark ? 'text-white' : 'text-black'
        };
      case 'high':
        return {
          bg: isDark ? 'bg-neutral-900 text-neutral-100 border border-neutral-400 font-bold' : 'bg-neutral-100 text-neutral-900 border border-neutral-400 font-bold',
          dot: isDark ? 'bg-white' : 'bg-black',
          label: 'HIGH RISK (LEVEL 3)',
          textClass: isDark ? 'text-neutral-200' : 'text-neutral-800'
        };
      case 'moderate':
        return {
          bg: isDark ? 'bg-neutral-950 text-neutral-300 border border-neutral-600 font-bold' : 'bg-neutral-100 text-neutral-700 border border-neutral-400 font-bold',
          dot: 'bg-neutral-400',
          label: 'MODERATE RISK (LEVEL 2)',
          textClass: isDark ? 'text-neutral-300' : 'text-neutral-700'
        };
      case 'low':
      default:
        return {
          bg: isDark ? 'bg-black text-neutral-300 border border-neutral-700 font-bold' : 'bg-white text-neutral-700 border border-neutral-300 font-bold',
          dot: 'bg-neutral-400',
          label: 'STABLE BASELINE (LEVEL 1)',
          textClass: isDark ? 'text-neutral-300' : 'text-neutral-700'
        };
    }
  };

  const handleMitigateClick = () => {
    playSuccessChime();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#000000', '#aaaaaa']
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
    <div className="glass-panel p-5 border border-neutral-800 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-800 light:border-neutral-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-neutral-900 border border-neutral-700 text-white">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white dark:text-white light:text-black tracking-tight flex items-center gap-1.5 font-mono">
                <span>Gemini Autonomous Mission Overseer</span>
                <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-900 text-white border border-neutral-700 uppercase font-bold">
                Predictive AI Engine
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Deep telemetry correlation • Failure forecasting • Actionable protocol execution
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Read aloud voice */}
          <button
            onClick={handleSpeak}
            className="p-1.5 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-100 hover:bg-neutral-800 text-white border border-neutral-800 light:border-neutral-300 transition-colors"
            title="Read analysis out loud in Government Command Voice"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Gemini API Key Toggle */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-100 hover:bg-neutral-800 text-neutral-200 dark:text-neutral-200 light:text-black border border-neutral-800 light:border-neutral-300 text-xs font-mono transition-colors"
            title="Configure Custom Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">API Key</span>
          </button>

          {/* Refresh AI Analysis */}
          <button
            onClick={() => {
              playTacticalBlip(750, 40);
              onRefreshPrediction(customApiKey);
            }}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold transition-all uppercase"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'Re-Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showKeyInput && (
        <div className="mb-4 p-3 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white dark:text-white light:text-black font-semibold">Custom Google Gemini API Key (Optional)</span>
            <span className="text-[10px] text-neutral-400 font-mono">Defaults to Built-in Polar Expert Heuristic</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste your Gemini API key (AI Studio)"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="flex-1 bg-black border border-neutral-800 px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-mono"
            />
            <button
              onClick={() => {
                onRefreshPrediction(customApiKey);
                setShowKeyInput(false);
              }}
              className="px-3 py-1.5 bg-white text-black font-bold text-xs uppercase transition-colors font-mono"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10.5px] font-mono border uppercase flex items-center gap-1.5 ${threat.bg}`}>
                  <span className={`w-2 h-2 ${threat.dot}`}></span>
                  {threat.label}
                </span>
                <span className="text-xs font-mono text-neutral-400 font-semibold">
                  Confidence: {prediction.confidenceScore}%
                </span>
              </div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-black tracking-tight font-mono">{prediction.title}</h3>
              <p className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed font-normal">{prediction.summary}</p>
            </div>

            {/* Threat Gauge */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right">
                <div className="text-[10px] font-mono text-neutral-400">THREAT SCORE</div>
                <div className={`text-2xl font-black font-mono tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                  {prediction.threatScore}<span className="text-xs text-neutral-400">/100</span>
                </div>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <rect x="4" y="4" width="40" height="40" stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"} strokeWidth="3" fill="none" />
                  <rect
                    x="4"
                    y="4"
                    width="40"
                    height="40"
                    stroke={isDark ? "#ffffff" : "#000000"}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={160}
                    strokeDashoffset={160 - (160 * prediction.threatScore) / 100}
                  />
                </svg>
                <div className={`absolute text-[10px] font-mono font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {prediction.threatScore}%
                </div>
              </div>
            </div>
          </div>

          {/* Root Cause & Time to Impact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Root Cause Card */}
            <div className={`md:col-span-2 p-4 border ${isDark ? 'bg-neutral-950/70 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className={`text-[11px] font-mono font-bold mb-1 flex items-center gap-1.5 uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                <AlertTriangle className={`w-3.5 h-3.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                <span>ROOT CAUSE HYPOTHESIS</span>
              </div>
              <p className={`text-xs leading-relaxed font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{prediction.rootCause}</p>
              
              <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                <span>Affected Modules:</span>
                {prediction.affectedModules.map((m, idx) => (
                  <span key={idx} className={`px-1.5 py-0.5 border font-semibold ${
                    isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'
                  }`}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Time to Failure Card */}
            <div className={`p-4 border flex flex-col justify-between ${isDark ? 'bg-neutral-950/70 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div>
                <div className={`text-[11px] font-mono font-bold mb-1 flex items-center gap-1.5 uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                  <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                  <span>TIME TO IMPACT</span>
                </div>
                <div className={`text-2xl font-black font-mono mt-1 ${isDark ? 'text-white' : 'text-black'}`}>
                  {prediction.timeToImpactHours < 1
                    ? `${Math.round(prediction.timeToImpactHours * 60)} Mins`
                    : `${prediction.timeToImpactHours.toFixed(1)} Hours`}
                </div>
              </div>
              <div className="text-[10px] font-mono text-neutral-400">
                Protocol: <span className={`font-black ${isDark ? 'text-white' : 'text-black'}`}>{prediction.protocolCode}</span>
              </div>
            </div>
          </div>

          {/* ACTIONABLE PROTOCOLS: Make recommended actions clickable interactive buttons! */}
          <div className={`p-4 border ${isDark ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                <CheckCircle className={`w-4 h-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                <span>Actionable Mitigation Protocol (Click to Execute)</span>
              </div>

              {prediction.threatLevel !== 'low' && (
                <button
                  onClick={handleMitigateClick}
                  disabled={isMitigating || mitigationDone}
                  className={`flex items-center gap-2 px-3.5 py-1.5 font-mono font-bold text-xs transition-all uppercase tracking-wide border ${
                    isDark 
                      ? 'bg-white text-black hover:bg-neutral-200 border-white' 
                      : 'bg-black text-white hover:bg-neutral-800 border-black'
                  }`}
                >
                  {mitigationDone ? (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      <span>Protocol Executed!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
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
                    className={`flex items-center justify-between p-2.5 border text-xs cursor-pointer transition-all ${
                      isExecuted
                        ? isDark ? 'bg-neutral-900 border-neutral-600 text-white' : 'bg-neutral-200 border-neutral-400 text-black'
                        : isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200 hover:border-white' : 'bg-white border-neutral-200 text-black hover:border-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold border ${
                        isExecuted 
                          ? isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black' 
                          : isDark ? 'bg-neutral-900 text-neutral-300 border-neutral-700' : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                      }`}>
                        {isExecuted ? '✓' : i + 1}
                      </span>
                      <span className="leading-snug font-medium font-mono">{action}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold shrink-0 ml-3">
                      {isExecuted ? (
                        <span className={`font-mono font-bold px-1.5 py-0.5 border ${
                          isDark ? 'text-white bg-neutral-800 border-neutral-700' : 'text-black bg-neutral-100 border-neutral-300'
                        }`}>EXECUTED</span>
                      ) : (
                        <span className={`${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} flex items-center gap-1 hover:underline`}>
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
        <div className="py-12 text-center text-neutral-400 font-mono">
          <BrainCircuit className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
          <p className="text-sm font-semibold text-white">Awaiting Telemetry Stream Ingestion...</p>
          <p className="text-xs text-neutral-500 mt-1">Connecting to MoES Indian Antarctic Ground Link</p>
        </div>
      )}
    </div>
  );
};
