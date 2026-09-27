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
        return <span className="px-2 py-0.5 text-xs font-mono font-black bg-black text-[#f97316] border border-[#f97316] animate-pulse">CRITICAL ANOMALY</span>;
      case 'warning':
        return <span className="px-2 py-0.5 text-xs font-mono font-bold bg-neutral-900 text-[#f97316] border border-[#f97316]/50">WARNING</span>;
      case 'offline':
        return <span className="px-2 py-0.5 text-xs font-mono font-bold bg-neutral-900 text-neutral-400 border border-neutral-700">STANDBY / OFFLINE</span>;
      case 'nominal':
      default:
        return <span className="px-2 py-0.5 text-xs font-mono font-bold bg-neutral-900 text-white border border-neutral-600">OPERATIONAL NOMINAL</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-2xl p-6 bg-black/95 dark:bg-black/95 light:bg-white border border-neutral-700 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800 light:border-neutral-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 text-white border border-neutral-700 uppercase font-bold">
                {module.category} MODULE • {module.id}
              </span>
              {getStatusBadge(module.status)}
            </div>
            <h3 className="text-xl font-bold text-white dark:text-white light:text-black tracking-tight">{module.name}</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1">{module.description}</p>
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

        {/* Telemetry Vitals Grid with Sharp Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 p-3 border border-neutral-800 light:border-neutral-300">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>HEALTH</span>
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div className={`text-xl font-bold font-mono ${module.health > 80 ? 'text-white' : 'text-[#f97316]'}`}>{module.health}%</div>
            <div className="w-full bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-300 h-1.5 mt-2 overflow-hidden">
              <div 
                className={`h-full ${module.health > 80 ? 'bg-white' : 'bg-[#f97316]'}`}
                style={{ width: `${module.health}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 p-3 border border-neutral-800 light:border-neutral-300">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>CORE TEMP</span>
              <Thermometer className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold font-mono text-white dark:text-white light:text-black">{module.temperature}°C</div>
            <div className="text-[10px] text-neutral-400 font-mono mt-1">Thermal envelope OK</div>
          </div>

          <div className="bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 p-3 border border-neutral-800 light:border-neutral-300">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>POWER DRAW</span>
              <Zap className="w-4 h-4 text-[#f97316]" />
            </div>
            <div className="text-xl font-bold font-mono text-white dark:text-white light:text-black">{module.powerDrawKw} kW</div>
            <div className="text-[10px] text-neutral-400 font-mono mt-1">Bus feeder 415V</div>
          </div>

          <div className="bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 p-3 border border-neutral-800 light:border-neutral-300">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>LAST AUDIT</span>
              <Wrench className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-sm font-bold font-mono text-white dark:text-white light:text-black mt-1">{module.lastServiceDate}</div>
            <div className="text-[10px] text-neutral-300 font-mono mt-1">Certified NOC</div>
          </div>
        </div>

        {/* Subcomponents Telemetry Sensors List */}
        <div className="my-4">
          <h4 className="text-xs font-bold text-neutral-200 dark:text-neutral-200 light:text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
            <Cpu className="w-3.5 h-3.5 text-white" />
            <span>Subsystem Telemetry Sensors & Transducers</span>
          </h4>

          <div className="space-y-2">
            {module.subcomponents.map((sub, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-2.5 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300 text-xs"
              >
                <div>
                  <div className="font-semibold text-white dark:text-white light:text-black">{sub.name}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">{sub.metric}</div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-bold ${
                    sub.status === 'critical' ? 'text-[#f97316]' : sub.status === 'warning' ? 'text-[#f97316]' : 'text-white dark:text-white light:text-black'
                  }`}>
                    {sub.value}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">
                    Status: {sub.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Actuator Override Commands */}
        <div className="pt-3 border-t border-neutral-800 light:border-neutral-300">
          <h4 className="text-xs font-bold text-neutral-200 dark:text-neutral-200 light:text-neutral-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
            <Sliders className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Remote Polar Actuator Commands (MoES Dispatch)</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAction('DIAGNOSTIC_SELF_TEST')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-200 hover:bg-neutral-800 text-white dark:text-white light:text-black text-xs font-bold uppercase border border-neutral-700 light:border-neutral-300 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>Self-Test Diagnostics</span>
            </button>

            <button
              onClick={() => handleAction('ENGAGE_AUXILIARY_HEAT')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-100 hover:bg-neutral-800 text-white dark:text-white light:text-black text-xs font-bold uppercase border border-neutral-700 hover:border-[#f97316] light:border-neutral-300 transition-colors"
            >
              <Thermometer className="w-3.5 h-3.5 text-[#f97316]" />
              <span>Engage Auxiliary Heat</span>
            </button>

            <button
              onClick={() => handleAction('ISOLATE_CIRCUIT_BUS')}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-100 hover:bg-neutral-800 text-white dark:text-white light:text-black text-xs font-bold uppercase border border-neutral-700 hover:border-[#f97316] light:border-neutral-300 transition-colors"
            >
              <Power className="w-3.5 h-3.5 text-[#f97316]" />
              <span>Cycle Breakers</span>
            </button>
          </div>

          {/* Feedback banner */}
          {feedbackMessage && (
            <div className="mt-3 p-2.5 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-100 border border-white text-white dark:text-white light:text-black text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#f97316] shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
