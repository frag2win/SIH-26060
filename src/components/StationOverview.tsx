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
  ShieldCheck, 
  Users, 
  ArrowUpRight,
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
      {/* Emergency Crisis Alert Banner (Appears dynamically if status is not nominal) */}
      {(isCritical || isWarning) && (
        <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg transition-all animate-pulse ${
          isCritical 
            ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-rose-950/50' 
            : 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-amber-950/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isCritical ? 'bg-rose-900 text-rose-200' : 'bg-amber-900 text-amber-200'}`}>
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider font-bold">
                {isCritical ? 'CRITICAL POLAR THREAT DETECTED' : 'ELEVATED ENVIRONMENTAL / SYSTEM WARNING'}
              </div>
              <div className="text-sm font-medium">
                {isCritical 
                  ? 'Active subsystem excursion threatens station life support/power. Immediate action required.' 
                  : 'Weather or sub-system parameters are deviating from nominal baseline.'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playSuccessChime();
              onAutoMitigate();
            }}
            disabled={isMitigating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-950 transition-all hover:scale-105 active:scale-95 whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isMitigating ? 'Engaging Mitigations...' : 'AI Auto-Mitigate Crisis'}</span>
          </button>
        </div>
      )}

      {/* Vitals Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Metric 1: Outside Climate */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">SURFACE TEMP</span>
            <Thermometer className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tracking-tight text-white">
              {telemetry.environment.outsideTemp.toFixed(1)}°C
            </div>
            <div className="text-[10px] text-cyan-300 font-mono flex items-center justify-between">
              <span>Chill: {telemetry.environment.windChill.toFixed(1)}°C</span>
              <span>Perma: {telemetry.environment.permafrostTemp}°C</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Wind & Blizzard */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">KATABATIC WIND</span>
            <Wind className={`w-4 h-4 ${telemetry.environment.windSpeed > 90 ? 'text-rose-400 animate-spin' : 'text-cyan-400'} group-hover:scale-110 transition-transform`} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tracking-tight text-white flex items-baseline gap-1">
              <span>{telemetry.environment.windSpeed}</span>
              <span className="text-xs text-slate-400 font-normal">km/h</span>
            </div>
            <div className="text-[10px] font-mono flex items-center justify-between">
              <span className="text-slate-400">Gust: {telemetry.environment.windGust} km/h</span>
              <span className={`px-1 py-0.2 rounded font-semibold ${
                telemetry.environment.blizzardStatus !== 'None' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400'
              }`}>
                {telemetry.environment.blizzardStatus !== 'None' ? 'BLIZZARD' : 'CALM'}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Power Grid Output */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">GRID LOAD</span>
            <Zap className={`w-4 h-4 ${isCritical ? 'text-rose-400' : 'text-amber-400'} group-hover:scale-110 transition-transform`} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tracking-tight text-white flex items-baseline gap-1">
              <span>{telemetry.power.totalConsumptionKw.toFixed(0)}</span>
              <span className="text-xs text-slate-400 font-normal">/ {telemetry.power.totalGenerationKw.toFixed(0)} kW</span>
            </div>
            <div className="text-[10px] font-mono flex items-center justify-between text-slate-400">
              <span className="text-emerald-400">{telemetry.power.gridFrequencyHz.toFixed(2)} Hz</span>
              <span>Bat: {telemetry.power.batteryCapacityPct}%</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Fuel Farm Runway */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">DIESEL RESERVE</span>
            <Fuel className={`w-4 h-4 ${telemetry.fuelLifeSupport.fuelLineTemp < -15 ? 'text-rose-400' : 'text-cyan-400'} group-hover:scale-110 transition-transform`} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tracking-tight text-white flex items-baseline gap-1">
              <span>{(telemetry.fuelLifeSupport.arcticDieselLiters / 1000).toFixed(1)}k</span>
              <span className="text-xs text-slate-400 font-normal">Liters</span>
            </div>
            <div className="text-[10px] font-mono flex items-center justify-between">
              <span className="text-emerald-400">{telemetry.fuelLifeSupport.fuelDaysRemaining} Days Runway</span>
              <span className={`${telemetry.fuelLifeSupport.fuelLineTemp < -15 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                {telemetry.fuelLifeSupport.fuelLineTemp.toFixed(1)}°C Line
              </span>
            </div>
          </div>
        </div>

        {/* Metric 5: Life Support Habitation */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">HAB ENVIRONMENT</span>
            <HeartPulse className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tracking-tight text-white">
              +{telemetry.fuelLifeSupport.indoorTemp.toFixed(1)}°C
            </div>
            <div className="text-[10px] font-mono flex items-center justify-between text-slate-400">
              <span className="text-emerald-300">O₂ {telemetry.fuelLifeSupport.indoorOxygenPct}%</span>
              <span>CO₂ {telemetry.fuelLifeSupport.indoorCo2Ppm}ppm</span>
            </div>
          </div>
        </div>

        {/* Metric 6: Comms & Crew */}
        <div className="glass-panel rounded-xl p-3 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium tracking-wide">SAT LINK / CREW</span>
            <Wifi className={`w-4 h-4 ${telemetry.comms.satelliteLinkStatus === 'locked' ? 'text-emerald-400' : 'text-rose-400'} group-hover:scale-110 transition-transform`} />
          </div>
          <div>
            <div className="text-xl font-bold font-mono tracking-tight text-white flex items-center justify-between">
              <span className="text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {telemetry.comms.satelliteLinkStatus}
              </span>
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                {telemetry.activePersonnel} Pax
              </span>
            </div>
            <div className="text-[10px] font-mono flex items-center justify-between text-slate-400 mt-1">
              <span>{telemetry.comms.latencyMs}ms RTT</span>
              <span>{telemetry.comms.downlinkMbps} Mbps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
