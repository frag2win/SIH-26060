'use client';

import React from 'react';
import { StationTelemetry } from '@/types/telemetry';
import { 
  Thermometer, 
  Wind, 
  Zap, 
  Fuel, 
  HeartPulse, 
  Wifi, 
  ShieldAlert, 
  Users, 
  Sparkles
} from 'lucide-react';
import { playSuccessChime } from '@/utils/audioAlerts';

interface StationOverviewProps {
  telemetry: StationTelemetry;
  onAutoMitigate: () => void;
  isMitigating: boolean;
}

export const StationOverview: React.FC<StationOverviewProps> = ({
  telemetry,
  onAutoMitigate,
  isMitigating
}) => {
  const isCritical = telemetry.overallStatus === 'critical';
  const isWarning = telemetry.overallStatus === 'warning';

  return (
    <div className="space-y-3">
      {/* Emergency Crisis Alert Banner (Sharp corners, high contrast pure monochrome) */}
      {(isCritical || isWarning) && (
        <div className={`p-3.5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
          isCritical 
            ? 'bg-white text-black border-2 border-white' 
            : 'bg-neutral-900 text-white border-2 border-neutral-400'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 ${isCritical ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest font-black">
                {isCritical ? 'CRITICAL POLAR THREAT DETECTED' : 'ELEVATED ENVIRONMENTAL / SYSTEM WARNING'}
              </div>
              <div className="text-sm font-semibold">
                {isCritical 
                  ? 'Active subsystem excursion threatens station life support or power grid. Immediate action required.' 
                  : 'Weather or sub-system parameters are deviating from nominal baseline envelope.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playSuccessChime();
              onAutoMitigate();
            }}
            disabled={isMitigating}
            className={`flex items-center gap-2 px-4 py-2 font-mono font-black text-xs transition-all uppercase tracking-wider self-stretch sm:self-auto justify-center border ${
              isCritical
                ? 'bg-black text-white hover:bg-neutral-800 border-black'
                : 'bg-white text-black hover:bg-neutral-200 border-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isMitigating ? 'Engaging Mitigations...' : 'AI Auto-Mitigate Crisis'}</span>
          </button>
        </div>
      )}

      {/* Vitals Summary Strip with Sparklines and Sharp Technical Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Metric 1: Outside Climate */}
        <div className="glass-panel p-3.5 flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle Sparkline behind numbers */}
          <div className="absolute right-0 bottom-0 w-24 h-10 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path d="M 0 25 Q 25 15, 50 30 T 100 18" fill="none" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-neutral-400 mb-1 z-10">
            <span className="text-[10.5px] font-normal tracking-wider font-mono">SURFACE TEMP</span>
            <Thermometer className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>

          <div className="z-10">
            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-black">
              {telemetry.environment.outsideTemp.toFixed(1)}°C
            </div>
            <div className="text-[11px] font-mono flex items-center justify-between mt-1 text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <span>Chill: <strong className="text-white font-bold">{telemetry.environment.windChill.toFixed(1)}°C</strong></span>
              <span className="text-neutral-500">Perma: {telemetry.environment.permafrostTemp}°C</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Wind & Blizzard */}
        <div className="glass-panel p-3.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-24 h-10 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path d="M 0 32 Q 20 8, 45 22 T 80 10 T 100 28" fill="none" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-neutral-400 mb-1 z-10">
            <span className="text-[10.5px] font-normal tracking-wider font-mono">KATABATIC WIND</span>
            <Wind className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>

          <div className="z-10">
            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-black flex items-baseline gap-1">
              <span>{telemetry.environment.windSpeed}</span>
              <span className="text-xs text-neutral-500 font-normal">km/h</span>
            </div>
            <div className="text-[11px] font-mono flex items-center justify-between mt-1 text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <span>Gust: <strong className="font-semibold text-white dark:text-white light:text-black">{telemetry.environment.windGust}</strong></span>
              <span className={`px-1.5 py-0.2 font-mono text-[9.5px] font-black uppercase ${
                telemetry.environment.blizzardStatus !== 'None' 
                  ? 'bg-white text-black' 
                  : 'bg-neutral-900 text-neutral-300 border border-neutral-700'
              }`}>
                {telemetry.environment.blizzardStatus !== 'None' ? 'BLIZZARD' : 'CALM'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Power Grid Output */}
        <div className="glass-panel p-3.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-24 h-10 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path d="M 0 18 Q 30 35, 60 12 T 100 24" fill="none" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-neutral-400 mb-1 z-10">
            <span className="text-[10.5px] font-normal tracking-wider font-mono">GRID LOAD</span>
            <Zap className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>

          <div className="z-10">
            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-black flex items-baseline gap-1">
              <span>{telemetry.power.totalConsumptionKw.toFixed(0)}</span>
              <span className="text-xs text-neutral-500 font-normal">/ {telemetry.power.totalGenerationKw.toFixed(0)} kW</span>
            </div>
            <div className="text-[11px] font-mono flex items-center justify-between mt-1 text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <span className="text-white font-bold">{telemetry.power.gridFrequencyHz.toFixed(2)} Hz</span>
              <span>Bat: <strong className="font-semibold text-white dark:text-white light:text-black">{telemetry.power.batteryCapacityPct}%</strong></span>
            </div>
          </div>
        </div>

        {/* Metric 4: Fuel Farm Runway */}
        <div className="glass-panel p-3.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-24 h-10 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path d="M 0 12 L 100 32" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-neutral-400 mb-1 z-10">
            <span className="text-[10.5px] font-normal tracking-wider font-mono">DIESEL RESERVE</span>
            <Fuel className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>

          <div className="z-10">
            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-black flex items-baseline gap-1">
              <span>{(telemetry.fuelLifeSupport.arcticDieselLiters / 1000).toFixed(1)}k</span>
              <span className="text-xs text-neutral-500 font-normal">L</span>
            </div>
            <div className="text-[11px] font-mono flex items-center justify-between mt-1 text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <span className="text-white font-bold">{telemetry.fuelLifeSupport.fuelDaysRemaining}d Runway</span>
              <span className={telemetry.fuelLifeSupport.fuelLineTemp < -15 ? 'bg-white text-black px-1 font-black' : 'text-neutral-300 font-semibold'}>
                {telemetry.fuelLifeSupport.fuelLineTemp.toFixed(1)}°C
              </span>
            </div>
          </div>
        </div>

        {/* Metric 5: Life Support Habitation */}
        <div className="glass-panel p-3.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-24 h-10 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path d="M 0 20 L 30 20 L 38 8 L 48 32 L 56 16 L 62 24 L 70 20 L 100 20" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-neutral-400 mb-1 z-10">
            <span className="text-[10.5px] font-normal tracking-wider font-mono">HAB ENVIRONMENT</span>
            <HeartPulse className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>

          <div className="z-10">
            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-black">
              +{telemetry.fuelLifeSupport.indoorTemp.toFixed(1)}°C
            </div>
            <div className="text-[11px] font-mono flex items-center justify-between mt-1 text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <span className="text-white font-bold">O₂ {telemetry.fuelLifeSupport.indoorOxygenPct}%</span>
              <span>CO₂ <strong className="font-semibold text-white dark:text-white light:text-black">{telemetry.fuelLifeSupport.indoorCo2Ppm}</strong></span>
            </div>
          </div>
        </div>

        {/* Metric 6: Comms & Crew */}
        <div className="glass-panel p-3.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 mb-1 z-10">
            <span className="text-[10.5px] font-normal tracking-wider font-mono">SAT LINK / CREW</span>
            <Wifi className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>

          <div className="z-10">
            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-black flex items-center justify-between">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 font-bold ${
                telemetry.comms.satelliteLinkStatus === 'locked'
                  ? 'bg-neutral-900 text-neutral-200 border border-neutral-700'
                  : 'bg-white text-black font-black'
              }`}>
                {telemetry.comms.satelliteLinkStatus}
              </span>
              <span className="text-xs font-mono text-white dark:text-white light:text-black flex items-center gap-1 font-semibold">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                {telemetry.activePersonnel} Pax
              </span>
            </div>
            <div className="text-[11px] font-mono flex items-center justify-between mt-1 text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <span>{telemetry.comms.latencyMs}ms RTT</span>
              <span className="text-white font-bold">{telemetry.comms.downlinkMbps} Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
