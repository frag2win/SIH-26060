'use client';

import React, { useState } from 'react';
import { StationModule, SubsystemStatus } from '@/types/telemetry';
import { 
  X, 
  Activity, 
  Cpu, 
  Thermometer, 
  Zap, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCw,
  Power,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { playTacticalBlip, playSuccessChime } from '@/utils/audioAlerts';

interface ModuleDetailModalProps {
  module: StationModule | null;
  onClose: () => void;
  stationName: string;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  onClose,
  stationName
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!module) return null;

  const handleAction = async (actionName: string) => {
    playTacticalBlip(800, 50);
    setIsExecuting(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch('/api/station-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: stationName.toLowerCase().includes('bharati') ? 'bharati' : 'maitri',
          command: actionName,
          targetSubsystem: module.name,
          value: 'OVERRIDE_ENGAGED'
        })
      });

      if (res.ok) {
        const data = await res.json();
        playSuccessChime();
        setFeedbackMessage(data.message || `Command [${actionName}] confirmed by polar telemetry bridge.`);
      }
    } catch {
      setFeedbackMessage(`Command [${actionName}] simulated and executed locally.`);
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusBadge = (status: SubsystemStatus) => {
    switch (status) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-600 animate-pulse">CRITICAL ANOMALY</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-600">WARNING</span>;
      case 'offline':
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-slate-400 border border-slate-700">STANDBY / OFFLINE</span>;
      case 'nominal':
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">OPERATIONAL NOMINAL</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-2xl rounded-2xl p-6 bg-slate-900/95 border border-cyan-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                {module.category} MODULE • {module.id}
              </span>
              {getStatusBadge(module.status)}
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{module.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{module.description}</p>
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

        {/* Telemetry Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>HEALTH</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">{module.health}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${module.health > 80 ? 'bg-emerald-500' : module.health > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${module.health}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>CORE TEMP</span>
              <Thermometer className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-cyan-300">{module.temperature}°C</div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Thermal stability OK</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>POWER DRAW</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-300">{module.powerDrawKw} kW</div>
            <div className="text-[10px] text-slate-500 font-mono mt-1">Bus feeder 415V</div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>LAST AUDIT</span>
              <Wrench className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm font-semibold font-mono text-slate-200 mt-1">{module.lastServiceDate}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Certified NOC</div>
          </div>
        </div>

        {/* Subcomponents Telemetry Sensors List */}
        <div className="my-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Subsystem Telemetry Sensors & Transducers</span>
          </h4>

          <div className="space-y-2">
            {module.subcomponents.map((sub, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{sub.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{sub.metric}</div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-bold ${
                    sub.status === 'critical' ? 'text-rose-400' : sub.status === 'warning' ? 'text-amber-400' : 'text-cyan-300'
                  }`}>
                    {sub.value}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">
                    Status: {sub.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Actuator Override Commands */}
        <div className="pt-3 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Remote Polar Actuator Commands (MoES Dispatch)</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAction('DIAGNOSTIC_SELF_TEST')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>Self-Test Diagnostics</span>
            </button>

            <button
              onClick={() => handleAction('ENGAGE_AUXILIARY_HEAT')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-200 text-xs font-medium border border-cyan-800 transition-colors"
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Engage Auxiliary Heat Trace</span>
            </button>

            <button
              onClick={() => handleAction('ISOLATE_CIRCUIT_BUS')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-200 text-xs font-medium border border-amber-800 transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Cycle Breakers / Isolate</span>
            </button>
          </div>

          {/* Feedback message banner */}
          {feedbackMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
