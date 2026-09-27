'use client';

import React from 'react';
import { ScenarioPreset } from '@/types/telemetry';
import { 
  X, 
  Wind, 
  Zap, 
  Flame, 
  Radio, 
  CheckCircle2, 
  Sliders, 
  Play, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { playAlarmKlaxon, playTacticalBlip, playSuccessChime } from '@/utils/audioAlerts';

interface ScenarioSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenario: ScenarioPreset;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  onAutoMitigate: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  isOpen,
  onClose,
  activeScenario,
  onSelectScenario,
  onAutoMitigate
}) => {
  if (!isOpen) return null;

  const scenarios: {
    id: ScenarioPreset;
    title: string;
    badge: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    impact: string;
    pitchNarrative: string;
  }[] = [
    {
      id: 'nominal',
      title: 'Nominal Polar Baseline',
      badge: 'STABLE BASELINE',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 hover:border-emerald-400',
      description: 'Standard calm Antarctic operational day. All generators, life support, and satellite uplinks nominal.',
      impact: 'Wind: 38 km/h • Gen 1: 62% • Fuel Line: +8.4°C • SatCom: Locked (540ms)',
      pitchNarrative: 'Use this as your starting demo state before demonstrating emergency disruptions.'
    },
    {
      id: 'cat5_blizzard',
      title: 'Category 5 Katabatic Blizzard',
      badge: 'EXTREME WEATHER',
      icon: <Wind className="w-5 h-5 text-cyan-400 animate-spin" />,
      color: 'border-cyan-500/40 hover:border-cyan-400',
      description: 'Severe continental katabatic blast hitting the coast with 138+ km/h sustained winds and -76°C windchill.',
      impact: 'Wind: 138 km/h • Chill: -76°C • Radome De-icing: Stressed • Packet Loss: 14.8%',
      pitchNarrative: 'Shows how the Digital Twin predicts structural wind loading and activates high-velocity radome hot-air blowers.'
    },
    {
      id: 'gen1_overheat',
      title: 'Generator 1 Coolant Boiling & Cavitation',
      badge: 'CRITICAL FAILURE',
      icon: <Zap className="w-5 h-5 text-rose-400 animate-pulse" />,
      color: 'border-rose-500/40 hover:border-rose-400',
      description: 'Primary Scania 100 kVA generator coolant spikes to 99.4°C due to heat exchanger blockage. Thermal trip in 42 mins.',
      impact: 'Coolant: 99.4°C • Vibration: 7.4 mm/s • Failure Horizon: <45 mins • Health: 52%',
      pitchNarrative: 'Demonstrates AI automated bus transfer to Cold Standby Gen 3 before station heat collapse.'
    },
    {
      id: 'fuel_line_waxing',
      title: 'Fuel Line Freeze & Waxing Risk',
      badge: 'LIFE SUPPORT THREAT',
      icon: <Flame className="w-5 h-5 text-amber-400 animate-bounce" />,
      color: 'border-amber-500/40 hover:border-amber-400',
      description: 'Trace heating breaker trips in -50°C ground cold. Aviation turbine fuel plunges below -15°C waxing threshold.',
      impact: 'Fuel Line: -19.4°C (Limit -15°C) • Wax Crystals Active • Burn Drop • Total Blackout Threat',
      pitchNarrative: 'Demonstrates remote actuator trace heat breaker reset and bypass loop recirculation.'
    },
    {
      id: 'satellite_blackout',
      title: 'Geomagnetic Storm (Kp 8.6) Comms Blackout',
      badge: 'SPACE WEATHER',
      icon: <Radio className="w-5 h-5 text-purple-400 animate-pulse" />,
      color: 'border-purple-500/40 hover:border-purple-400',
      description: 'Intense coronal mass ejection induces auroral electrojet scintillation, severing primary Ku/X-band transponder lock.',
      impact: 'Kp Index: 8.6 • SatCom: DOWN • Latency: 2400ms • Packet Loss: 86.4%',
      pitchNarrative: 'Proves edge-computing autonomy: station safely functions even when disconnected from MoES New Delhi.'
    }
  ];

  const handleSelect = (scenario: ScenarioPreset) => {
    if (scenario === 'gen1_overheat' || scenario === 'fuel_line_waxing') {
      playAlarmKlaxon();
    } else {
      playTacticalBlip(850, 60);
    }
    onSelectScenario(scenario);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-3xl rounded-2xl p-6 bg-slate-900/95 border border-cyan-500/30 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold uppercase">
                  SIH Presentation Controller
                </span>
                <span className="text-xs text-slate-400">PS 26060 Live Testbed</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Crisis Scenario Injector & Simulator</h3>
              <p className="text-xs text-slate-400">
                Trigger real-world Antarctic failure scenarios to test the Digital Twin and showcase predictive AI live to judges.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTacticalBlip(500, 40);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="space-y-3 my-5">
          {scenarios.map((sc) => {
            const isActive = activeScenario === sc.id;
            return (
              <div
                key={sc.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${sc.color} ${
                  isActive ? 'bg-slate-800/90 ring-2 ring-cyan-500' : 'bg-slate-950/70'
                }`}
                onClick={() => handleSelect(sc.id)}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {sc.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{sc.title}</span>
                        {isActive && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                            CURRENTLY RUNNING
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-bold uppercase">
                    {sc.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2">{sc.description}</p>

                {/* Telemetry Impact Badge */}
                <div className="text-[11px] font-mono bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-cyan-300 mb-2">
                  <span className="text-slate-400 mr-1.5 font-bold">TELEMETRY IMPACT:</span>
                  {sc.impact}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-amber-400/90">
                    💡 Pitch Tip: {sc.pitchNarrative}
                  </span>
                  <div className="flex items-center gap-1 text-cyan-400 font-bold hover:underline">
                    <span>Inject State</span>
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Quick Mitigate */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Powered by Next.js Serverless Anomaly Simulation Engine
          </span>

          <button
            onClick={() => {
              playSuccessChime();
              onAutoMitigate();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Reset / Auto-Mitigate to Nominal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
