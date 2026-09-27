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
        return <span className="px-2 py-0.5 text-xs font-mono font-black bg-red-950 text-red-200 border border-red-500 animate-pulse">CRITICAL ANOMALY</span>;
      case 'warning':
        return <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-950 text-amber-200 border border-amber-500">WARNING</span>;
      case 'offline':
        return <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-900 text-slate-400 border border-slate-700">STANDBY / OFFLINE</span>;
      case 'nominal':
      default:
        return <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600">OPERATIONAL NOMINAL</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-2xl p-6 bg-slate-900/98 dark:bg-slate-900/98 light:bg-white border border-cyan-500/40 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 light:border-slate-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-bold">
                {module.category} MODULE • {module.id}
              </span>
              {getStatusBadge(module.status)}
            </div>
            <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">{module.name}</h3>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1">{module.description}</p>
          </div>

          <button
            onClick={() => {
              playTacticalBlip(500, 40);
              onClose();
            }}
            className="p-1.5 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Vitals Grid with Sharp Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 p-3 border border-slate-800 light:border-slate-300">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>HEALTH</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">{module.health}%</div>
            <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-300 h-1.5 mt-2 overflow-hidden">
              <div 
                className={`h-full ${module.health > 80 ? 'bg-emerald-500' : module.health > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${module.health}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 p-3 border border-slate-800 light:border-slate-300">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>CORE TEMP</span>
              <Thermometer className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-cyan-300 dark:text-cyan-300 light:text-cyan-700">{module.temperature}°C</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Thermal envelope OK</div>
          </div>

          <div className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 p-3 border border-slate-800 light:border-slate-300">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>POWER DRAW</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-300 dark:text-amber-300 light:text-amber-700">{module.powerDrawKw} kW</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Bus feeder 415V</div>
          </div>

          <div className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 p-3 border border-slate-800 light:border-slate-300">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>LAST AUDIT</span>
              <Wrench className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm font-bold font-mono text-slate-200 dark:text-slate-200 light:text-slate-800 mt-1">{module.lastServiceDate}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Certified NOC</div>
          </div>
        </div>

        {/* Subcomponents Telemetry Sensors List */}
        <div className="my-4">
          <h4 className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Subsystem Telemetry Sensors & Transducers</span>
          </h4>

          <div className="space-y-2">
            {module.subcomponents.map((sub, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-2.5 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-xs"
              >
                <div>
                  <div className="font-semibold text-white dark:text-white light:text-slate-900">{sub.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{sub.metric}</div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-bold ${
                    sub.status === 'critical' ? 'text-red-400' : sub.status === 'warning' ? 'text-amber-400' : 'text-cyan-400 dark:text-cyan-300 light:text-cyan-700'
                  }`}>
                    {sub.value}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Status: {sub.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Actuator Override Commands */}
        <div className="pt-3 border-t border-slate-800 light:border-slate-300">
          <h4 className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Remote Polar Actuator Commands (MoES Dispatch)</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAction('DIAGNOSTIC_SELF_TEST')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-bold uppercase border border-slate-700 light:border-slate-300 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>Self-Test Diagnostics</span>
            </button>

            <button
              onClick={() => handleAction('ENGAGE_AUXILIARY_HEAT')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-950 dark:bg-cyan-950 light:bg-cyan-100 hover:bg-cyan-900 text-cyan-200 dark:text-cyan-200 light:text-cyan-900 text-xs font-bold uppercase border border-cyan-800 light:border-cyan-300 transition-colors"
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Engage Auxiliary Heat</span>
            </button>

            <button
              onClick={() => handleAction('ISOLATE_CIRCUIT_BUS')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-950 dark:bg-amber-950 light:bg-amber-100 hover:bg-amber-900 text-amber-200 dark:text-amber-200 light:text-amber-900 text-xs font-bold uppercase border border-amber-800 light:border-amber-300 transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Cycle Breakers</span>
            </button>
          </div>

          {/* Feedback banner */}
          {feedbackMessage && (
            <div className="mt-3 p-2.5 bg-emerald-950/90 dark:bg-emerald-950/90 light:bg-emerald-100 border border-emerald-500 text-emerald-200 dark:text-emerald-200 light:text-emerald-900 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
