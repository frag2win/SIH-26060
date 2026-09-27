'use client';

import React, { useState } from 'react';
import { StationTelemetry } from '@/types/telemetry';
import { 
  Fuel, 
  Droplet, 
  Utensils, 
  Ship, 
  Truck,
  PackageCheck
} from 'lucide-react';
import { playSuccessChime } from '@/utils/audioAlerts';
import { formatNumber } from '@/utils/formatters';

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
      {/* Vitals Row (Sharp Technical Boxes) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 border border-cyan-500/25">
          <div className="flex items-center justify-between text-slate-300 dark:text-slate-300 light:text-slate-600 text-xs mb-1">
            <span className="font-mono">ARCTIC DIESEL</span>
            <Fuel className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900">
            {fuel.fuelDaysRemaining} <span className="text-xs text-slate-400 font-normal">Days</span>
          </div>
          <div className="text-[10.5px] text-cyan-400 dark:text-cyan-300 light:text-cyan-700 font-mono mt-1 font-semibold">
            {(fuel.arcticDieselLiters / 1000).toFixed(1)}k Liters Reserve
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-cyan-500/25">
          <div className="flex items-center justify-between text-slate-300 dark:text-slate-300 light:text-slate-600 text-xs mb-1">
            <span className="font-mono">POTABLE WATER</span>
            <Droplet className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900">
            {log.potableWaterDaysProjected} <span className="text-xs text-slate-400 font-normal">Days</span>
          </div>
          <div className="text-[10.5px] text-slate-200 dark:text-slate-200 light:text-slate-700 font-mono mt-1">
            Snowmelt: {fuel.snowmeltMeltRateLitersHr} L/hr
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-cyan-500/25">
          <div className="flex items-center justify-between text-slate-300 dark:text-slate-300 light:text-slate-600 text-xs mb-1">
            <span className="font-mono">FOOD RATIONS</span>
            <Utensils className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900">
            {log.foodDaysProjected} <span className="text-xs text-slate-400 font-normal">Days</span>
          </div>
          <div className="text-[10.5px] text-emerald-400 dark:text-emerald-300 light:text-emerald-700 font-mono mt-1 font-semibold">
            {log.foodReservePct}% Cryo-depot Stock
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-cyan-500/25">
          <div className="flex items-center justify-between text-slate-300 dark:text-slate-300 light:text-slate-600 text-xs mb-1">
            <span className="font-mono">NEXT RESUPPLY</span>
            <Ship className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-slate-900">
            {log.nextResupplyVoyageDays} <span className="text-xs text-slate-400 font-normal">Days</span>
          </div>
          <div className="text-[10.5px] text-emerald-400 dark:text-emerald-300 light:text-emerald-700 font-mono mt-1 font-semibold">
            Window: {log.resupplyWindowStatus}
          </div>
        </div>
      </div>

      {/* Main Grid: Resource Breakdown & Voyage Logistics AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Survival Runway Table */}
        <div className="glass-panel p-5 border border-cyan-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">Polar Station Survival Runway</h3>
              <p className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600">Projected operational endurance before mandatory replenishment</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 font-bold">
              Crew: {telemetry.activePersonnel} Pax
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Aviation Turbine Fuel (ATF-50)',
                reserve: `${formatNumber(Math.round(fuel.arcticDieselLiters / 1000))}k Liters`,
                pct: Math.round((fuel.arcticDieselLiters / fuel.fuelMaxCapacityLiters) * 100),
                runway: `${fuel.fuelDaysRemaining} Days`,
                color: 'bg-cyan-400'
              },
              {
                name: 'Glacial RO Potable Water',
                reserve: `${(fuel.potableWaterLiters / 1000).toFixed(1)}k Liters`,
                pct: Math.round((fuel.potableWaterLiters / fuel.waterMaxCapacityLiters) * 100),
                runway: `${log.potableWaterDaysProjected} Days`,
                color: 'bg-emerald-400'
              },
              {
                name: 'Dehydrated Food & MRE Rations',
                reserve: '18,500 Rations',
                pct: log.foodReservePct,
                runway: `${log.foodDaysProjected} Days`,
                color: 'bg-amber-400'
              },
              {
                name: 'Medical Ward Supplies & Oxygen',
                reserve: 'Complete Surgical Stock',
                pct: log.medicalSuppliesPct,
                runway: 'Nominal',
                color: 'bg-indigo-400'
              }
            ].map((res, i) => (
              <div key={i} className="p-3 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border border-slate-800 light:border-slate-300 text-xs">
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <span className="font-semibold text-white dark:text-white light:text-slate-900">{res.name}</span>
                  <span className="text-cyan-400 dark:text-cyan-300 light:text-cyan-700 font-bold">{res.runway}</span>
                </div>
                <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-300 h-2 overflow-hidden">
                  <div 
                    className={`h-full ${res.color}`} 
                    style={{ width: `${res.pct}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700 mt-1">
                  <span>Capacity: <strong className="font-semibold">{res.pct}%</strong></span>
                  <span>{res.reserve}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Resupply Window & Logistics AI Box */}
        <div className="glass-panel p-5 border border-cyan-500/25 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-950 border border-indigo-800 text-indigo-400">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">44th Indian Antarctic Expedition Resupply</h3>
                  <p className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600">Maritime logistics window via Cape Town route</p>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 light:border-slate-300 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Vessel:</span>
                <span className="text-white dark:text-white light:text-slate-900 font-bold">{log.resupplyVesselName}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Estimated Arrival:</span>
                <span className="text-cyan-400 dark:text-cyan-300 light:text-cyan-700 font-bold">{log.nextResupplyVoyageDays} Days (Icebreaker Staging)</span>
              </div>
              <div className="flex items-center justify-between font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Fast Ice Condition:</span>
                <span className="text-emerald-400 dark:text-emerald-300 light:text-emerald-700 font-bold">1.4m Solid • Helo Deck Open</span>
              </div>
              <div className="flex items-center justify-between font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Cargo Staged at Goa:</span>
                <span className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-medium">220,000L Fuel, 2x Scania Injector Heads</span>
              </div>
            </div>
          </div>

          {/* Logistics AI Optimization Advisory */}
          <div className="p-3.5 bg-slate-950/90 dark:bg-slate-950/90 light:bg-slate-50 border border-indigo-900/40 light:border-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 font-mono flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Logistics Optimization Assistant (MoES AI)</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">Active</span>
            </div>

            <p className="text-xs text-slate-200 dark:text-slate-200 light:text-slate-700 leading-relaxed">
              Based on projected katabatic fuel burn rates over winter and Scania generator maintenance cycle, the next voyage manifest should allocate priority volume to <strong>ATF-50 Low-Viscosity Polar Diesel</strong> and <strong>Generator 2 coolant heat-exchangers</strong>.
            </p>

            <div className="pt-2 border-t border-slate-800 light:border-slate-300 flex items-center justify-between">
              <span className="text-[10.5px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                Manifest Code: <strong className="text-cyan-400 dark:text-cyan-300 light:text-cyan-700">MOES-POLAR-44-PRIORITY</strong>
              </span>

              <button
                onClick={handleGenerateManifest}
                disabled={manifestGenerated}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase transition-all hover:scale-105"
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
