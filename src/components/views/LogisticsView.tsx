'use client';

import React, { useState } from 'react';
import { StationTelemetry } from '@/types/telemetry';
import { 
  Fuel, 
  Droplet, 
  Utensils, 
  Cross, 
  Ship, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  PackageCheck
} from 'lucide-react';
import { playSuccessChime } from '@/utils/audioAlerts';

interface LogisticsViewProps {
  telemetry: StationTelemetry;
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({ telemetry }) => {
  const [manifestGenerated, setManifestGenerated] = useState(false);
  const log = telemetry.logistics;
  const fuel = telemetry.fuelLifeSupport;

  const handleGenerateManifest = () => {
    playSuccessChime();
    setManifestGenerated(true);
    setTimeout(() => setManifestGenerated(false), 5000);
  };

  return (
    <div className="space-y-4">
      {/* Vitals Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">ARCTIC DIESEL</span>
            <Fuel className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {fuel.fuelDaysRemaining} <span className="text-xs text-slate-400 font-normal">Days</span>
          </div>
          <div className="text-[10px] text-cyan-300 font-mono mt-1">
            {(fuel.arcticDieselLiters / 1000).toFixed(1)}k Liters Reserve
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">POTABLE WATER</span>
            <Droplet className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {log.potableWaterDaysProjected} <span className="text-xs text-slate-400 font-normal">Days</span>
          </div>
          <div className="text-[10px] text-slate-300 font-mono mt-1">
            Snowmelt: {fuel.snowmeltMeltRateLitersHr} L/hr
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">FOOD RATIONS</span>
            <Utensils className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {log.foodDaysProjected} <span className="text-xs text-slate-400 font-normal">Days</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            {log.foodReservePct}% Cryo-depot Stock
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">NEXT RESUPPLY</span>
            <Ship className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {log.nextResupplyVoyageDays} <span className="text-xs text-slate-400 font-normal">Days</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            Window: {log.resupplyWindowStatus}
          </div>
        </div>
      </div>

      {/* Main Grid: Resource Breakdown & Voyage Logistics AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Survival Runway Table */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Polar Station Survival Runway</h3>
              <p className="text-[11px] text-slate-400">Projected operational endurance before mandatory replenishment</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
              Crew: {telemetry.activePersonnel} Pax
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Aviation Turbine Fuel (ATF-50)',
                reserve: `${(fuel.arcticDieselLiters / 1000).toFixed(0)}k Liters`,
                pct: Math.round((fuel.arcticDieselLiters / fuel.fuelMaxCapacityLiters) * 100),
                runway: `${fuel.fuelDaysRemaining} Days`,
                color: 'from-blue-500 to-cyan-400'
              },
              {
                name: 'Glacial RO Potable Water',
                reserve: `${(fuel.potableWaterLiters / 1000).toFixed(1)}k Liters`,
                pct: Math.round((fuel.potableWaterLiters / fuel.waterMaxCapacityLiters) * 100),
                runway: `${log.potableWaterDaysProjected} Days`,
                color: 'from-teal-500 to-emerald-400'
              },
              {
                name: 'Dehydrated Food & MRE Rations',
                reserve: '18,500 Rations',
                pct: log.foodReservePct,
                runway: `${log.foodDaysProjected} Days`,
                color: 'from-amber-500 to-yellow-400'
              },
              {
                name: 'Medical Ward Supplies & Oxygen',
                reserve: 'Complete Surgical Stock',
                pct: log.medicalSuppliesPct,
                runway: 'Nominal',
                color: 'from-purple-500 to-indigo-400'
              }
            ].map((res, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <span className="font-semibold text-white">{res.name}</span>
                  <span className="text-cyan-300 font-bold">{res.runway}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${res.color}`} 
                    style={{ width: `${res.pct}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>Capacity: {res.pct}%</span>
                  <span>{res.reserve}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Resupply Window & Logistics AI Box */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">44th Indian Antarctic Expedition Resupply</h3>
                  <p className="text-[11px] text-slate-400">Maritime logistics window via Cape Town route</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Vessel:</span>
                <span className="text-white font-bold">{log.resupplyVesselName}</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Estimated Arrival:</span>
                <span className="text-cyan-300 font-bold">{log.nextResupplyVoyageDays} Days (Icebreaker Staging)</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Fast Ice Condition:</span>
                <span className="text-emerald-400 font-bold">1.4m Solid • Helo Deck Open</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Cargo Staged at Goa:</span>
                <span className="text-slate-300">220,000L Fuel, 2x Scania Injector Heads</span>
              </div>
            </div>
          </div>

          {/* Logistics AI Optimization Advisory */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Logistics Optimization Assistant (MoES AI)</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300">Active</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Based on projected katabatic fuel burn rates over winter and Scania generator maintenance cycle, the next voyage manifest should allocate priority volume to <strong>ATF-50 Low-Viscosity Polar Diesel</strong> and <strong>Generator 2 coolant heat-exchangers</strong>.
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                Manifest Code: <strong className="text-cyan-300">MOES-POLAR-44-PRIORITY</strong>
              </span>

              <button
                onClick={handleGenerateManifest}
                disabled={manifestGenerated}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all hover:scale-105"
              >
                {manifestGenerated ? (
                  <>
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Manifest Dispatched</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-3.5 h-3.5" />
                    <span>Draft Priority Manifest</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
