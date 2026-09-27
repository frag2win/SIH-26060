'use client';

import React, { useState } from 'react';
import { StationTelemetry } from '@/types/telemetry';
import { 
  Zap, 
  Wind, 
  Sun, 
  BatteryCharging, 
  Gauge, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  Flame, 
  ArrowUpRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { playTacticalBlip, playSuccessChime } from '@/utils/audioAlerts';

interface EnergyViewProps {
  telemetry: StationTelemetry;
  onAutoMitigate: () => void;
}

export const EnergyView: React.FC<EnergyViewProps> = ({ telemetry, onAutoMitigate }) => {
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  const totalGen = telemetry.power.totalGenerationKw;
  const dieselShare = Math.round((telemetry.power.dieselKw / totalGen) * 100) || 75;
  const windShare = Math.round((telemetry.power.windKw / totalGen) * 100) || 20;
  const solarShare = Math.max(0, 100 - dieselShare - windShare);

  const handleSimulatePlan = () => {
    playSuccessChime();
    setSimulationActive(true);
    setSimulationMessage('Automation Protocol Active: Pre-staging battery output (+15 kW) • Throttling auxiliary heating loops • Preserving 48L/day Arctic diesel.');
    setTimeout(() => {
      setSimulationActive(false);
    }, 6000);
  };

  return (
    <div className="space-y-4">
      {/* Vitals Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">TOTAL GENERATION</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {telemetry.power.totalGenerationKw.toFixed(0)} <span className="text-xs text-slate-400 font-normal">kW</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            +4.2% Microgrid efficiency
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">CURRENT LOAD</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {telemetry.power.totalConsumptionKw.toFixed(0)} <span className="text-xs text-slate-400 font-normal">kW</span>
          </div>
          <div className="text-[10px] text-cyan-300 font-mono mt-1">
            Grid Freq: {telemetry.power.gridFrequencyHz.toFixed(2)} Hz
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">BATTERY AUTONOMY</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {telemetry.power.batteryReserveKwh} <span className="text-xs text-slate-400 font-normal">kWh</span>
          </div>
          <div className="text-[10px] text-slate-300 font-mono mt-1">
            {telemetry.power.batteryCapacityPct}% ({telemetry.power.batteryAutonomyHours}h Autonomy)
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">HEAT RECOVERY</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            78.4 <span className="text-xs text-slate-400 font-normal">kW Thermal</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            Cogen Efficiency: 91.8%
          </div>
        </div>
      </div>

      {/* Main Grid: Generation Mix & 24H Load Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Multi-Source Generation Mix */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Microgrid Generation Mix</h3>
                <p className="text-[11px] text-slate-400">Multi-source polar renewable & diesel hybrid</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
              Synchronized 415V 3-Phase
            </span>
          </div>

          {/* Stacked generation bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span>Generation Distribution</span>
              <span className="text-cyan-400">{totalGen.toFixed(0)} kW Total</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
              <div style={{ width: `${dieselShare}%` }} className="bg-amber-500" title={`Diesel: ${dieselShare}%`}></div>
              <div style={{ width: `${windShare}%` }} className="bg-cyan-400" title={`Wind: ${windShare}%`}></div>
              <div style={{ width: `${solarShare}%` }} className="bg-emerald-400" title={`Solar: ${solarShare}%`}></div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Diesel ({dieselShare}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Wind Turbines ({windShare}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Solar PV ({solarShare}%)
              </span>
            </div>
          </div>

          {/* Generators Bay Subsystems */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Generator Bay Status
            </div>

            {telemetry.power.generators.map((g) => (
              <div key={g.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{g.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                      g.status === 'fault' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Runtime: {g.runtimeHours} hrs • Vibration: {g.vibrationMmS} mm/s
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-white font-bold">{g.outputKw} kW ({g.loadPct}%)</div>
                  <div className={`text-[10px] ${g.coolantTemp > 90 ? 'text-rose-400 font-bold' : 'text-cyan-300'}`}>
                    Coolant: {g.coolantTemp}°C
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 24-Hour Load Profile & Predictive Plan */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white">24-Hour Station Power Demand Profile</h3>
                <p className="text-[11px] text-slate-400">Historical load trend with dynamic peak spikes</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Peak: 124 kW
              </span>
            </div>

            {/* SVG Area Chart */}
            <div className="w-full h-44 bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                {/* Area path */}
                <path
                  d="M 0 85 Q 50 78, 100 82 T 200 65 T 300 50 T 400 68 T 500 55 L 500 120 L 0 120 Z"
                  fill="url(#energyGrad)"
                />
                {/* Line path */}
                <path
                  d="M 0 85 Q 50 78, 100 82 T 200 65 T 300 50 T 400 68 T 500 55"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />
                {/* Live pulse dot at end */}
                <circle cx="500" cy="55" r="4" fill="#38bdf8" className="animate-ping" />
                <circle cx="500" cy="55" r="3" fill="#38bdf8" />
              </svg>

              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span>00:00 UTC</span>
                <span>06:00 UTC</span>
                <span>12:00 UTC</span>
                <span>18:00 UTC</span>
                <span className="text-cyan-400 font-bold">CURRENT</span>
              </div>
            </div>
          </div>

          {/* 6-Hour Energy Intelligence Forecast Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>6-Hour Thermal & Power Demand Model</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300">Predictive</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Katabatic temperature drop predicted at 02:00 UTC (-6°C delta). Station heating demand is forecasted to rise by <strong>+18%</strong>. Battery reserves remain sufficient if non-vital science arrays are scheduled during the cold spike.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400">
                Recommended SOP: <strong className="text-amber-300">PEAK-SHED-BRAVO</strong>
              </span>

              <button
                onClick={handleSimulatePlan}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all hover:scale-105"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Automated Plan</span>
              </button>
            </div>

            {simulationMessage && (
              <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono animate-in fade-in">
                {simulationMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
