'use client';

import React, { useState } from 'react';
import { StationTelemetry } from '@/types/telemetry';
import { 
  Zap, 
  BatteryCharging, 
  Gauge, 
  Activity, 
  Sliders, 
  Flame, 
  Sparkles
} from 'lucide-react';
import { playSuccessChime } from '@/utils/audioAlerts';

interface EnergyViewProps {
  telemetry: StationTelemetry;
  onAutoMitigate: () => void;
}

export const EnergyView: React.FC<EnergyViewProps> = ({ telemetry }) => {
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
      {/* Vitals Cards Row (Sharp Technical Boxes) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">TOTAL GENERATION</span>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-black">
            {telemetry.power.totalGenerationKw.toFixed(0)} <span className="text-xs text-neutral-400 font-normal">kW</span>
          </div>
          <div className="text-[10px] text-neutral-300 dark:text-neutral-300 light:text-neutral-600 font-mono mt-1 font-semibold">
            +4.2% Microgrid efficiency
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">CURRENT LOAD</span>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-black">
            {telemetry.power.totalConsumptionKw.toFixed(0)} <span className="text-xs text-neutral-400 font-normal">kW</span>
          </div>
          <div className="text-[10px] text-neutral-300 dark:text-neutral-300 light:text-neutral-600 font-mono mt-1 font-semibold">
            Grid Freq: {telemetry.power.gridFrequencyHz.toFixed(2)} Hz
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">BATTERY AUTONOMY</span>
            <BatteryCharging className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-black">
            {telemetry.power.batteryReserveKwh} <span className="text-xs text-neutral-400 font-normal">kWh</span>
          </div>
          <div className="text-[10px] text-neutral-400 font-mono mt-1">
            {telemetry.power.batteryCapacityPct}% ({telemetry.power.batteryAutonomyHours}h Autonomy)
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">HEAT RECOVERY</span>
            <Flame className="w-4 h-4 text-[#f97316]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-black">
            78.4 <span className="text-xs text-neutral-400 font-normal">kW Thermal</span>
          </div>
          <div className="text-[10px] text-neutral-300 dark:text-neutral-300 light:text-neutral-600 font-mono mt-1 font-semibold">
            Cogen Efficiency: 91.8%
          </div>
        </div>
      </div>

      {/* Main Grid: Generation Mix & 24H Load Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Multi-Source Generation Mix */}
        <div className="glass-panel p-5 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-neutral-900 border border-neutral-700 text-white">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white dark:text-white light:text-black">Microgrid Generation Mix</h3>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Multi-source polar renewable & diesel hybrid</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-100 border border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-black font-bold">
              415V 3-Phase Locked
            </span>
          </div>

          {/* Stacked generation bar (Sharp 0px radius) */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-200 dark:text-neutral-200 light:text-neutral-800 mb-1.5">
              <span>Generation Distribution</span>
              <span className="text-white dark:text-white light:text-black font-bold">{totalGen.toFixed(0)} kW Total</span>
            </div>
            <div className="w-full h-3 overflow-hidden flex bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-300">
              <div style={{ width: `${dieselShare}%` }} className="bg-[#f97316]" title={`Diesel: ${dieselShare}%`}></div>
              <div style={{ width: `${windShare}%` }} className="bg-white" title={`Wind: ${windShare}%`}></div>
              <div style={{ width: `${solarShare}%` }} className="bg-neutral-600" title={`Solar: ${solarShare}%`}></div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mt-1.5">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#f97316]"></span>
                Diesel ({dieselShare}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-white border border-neutral-500"></span>
                Wind Turbines ({windShare}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-neutral-600"></span>
                Solar PV ({solarShare}%)
              </span>
            </div>
          </div>

          {/* Generators Bay Subsystems */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-neutral-200 dark:text-neutral-200 light:text-neutral-800 uppercase tracking-wider font-mono">
              Generator Bay Status
            </div>

            {telemetry.power.generators.map((g) => (
              <div key={g.id} className="p-3 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white dark:text-white light:text-black flex items-center gap-2">
                    <span>{g.name}</span>
                    <span className={`text-[9.5px] font-mono px-1.5 py-0.5 uppercase font-black ${
                      g.status === 'fault' ? 'bg-[#f97316] text-black animate-pulse' : 'bg-neutral-900 text-white border border-neutral-700'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">
                    Runtime: {g.runtimeHours} hrs • Vibration: {g.vibrationMmS} mm/s
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-white dark:text-white light:text-black font-bold">{g.outputKw} kW ({g.loadPct}%)</div>
                  <div className={`text-[10.5px] ${g.coolantTemp > 90 ? 'text-[#f97316] font-black' : 'text-neutral-300 font-semibold'}`}>
                    Coolant: {g.coolantTemp}°C
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 24-Hour Load Profile & Predictive Plan */}
        <div className="glass-panel p-5 border border-neutral-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white dark:text-white light:text-black">24-Hour Station Power Demand Profile</h3>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Historical load trend with dynamic peak spikes</p>
              </div>
              <span className="text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 border border-neutral-700 font-bold">
                Peak: 124 kW
              </span>
            </div>

            {/* SVG Area Chart */}
            <div className="w-full h-44 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300 p-3 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                <path
                  d="M 0 85 Q 50 78, 100 82 T 200 65 T 300 50 T 400 68 T 500 55 L 500 120 L 0 120 Z"
                  fill="url(#energyGrad)"
                />
                <path
                  d="M 0 85 Q 50 78, 100 82 T 200 65 T 300 50 T 400 68 T 500 55"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <rect x="496" y="51" width="7" height="7" fill="#f97316" />
              </svg>

              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 mt-1">
                <span>00:00 UTC</span>
                <span>06:00 UTC</span>
                <span>12:00 UTC</span>
                <span>18:00 UTC</span>
                <span className="text-[#f97316] font-bold">CURRENT</span>
              </div>
            </div>
          </div>

          {/* 6-Hour Energy Intelligence Forecast Box */}
          <div className="p-3.5 bg-neutral-950/90 dark:bg-neutral-950/90 light:bg-neutral-50 border border-neutral-700 light:border-neutral-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white dark:text-white light:text-black font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
                <span>6-Hour Thermal & Power Demand Model</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Predictive</span>
            </div>

            <p className="text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
              Katabatic temperature drop predicted at 02:00 UTC (-6°C delta). Station heating demand is forecasted to rise by <strong>+18%</strong>. Battery reserves remain sufficient if non-vital science arrays are scheduled during the cold spike.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800 light:border-neutral-300">
              <span className="text-[10.5px] font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                Recommended SOP: <strong className="text-[#f97316]">PEAK-SHED-BRAVO</strong>
              </span>

              <button
                onClick={handleSimulatePlan}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-neutral-200 border border-white font-bold text-xs uppercase transition-all hover:scale-105"
              >
                <Sliders className="w-3.5 h-3.5 text-[#f97316]" />
                <span>Simulate Automated Plan</span>
              </button>
            </div>

            {simulationMessage && (
              <div className="p-2 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-100 border border-white text-white dark:text-white light:text-black text-xs font-mono animate-in fade-in">
                {simulationMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
