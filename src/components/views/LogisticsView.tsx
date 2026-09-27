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
  isDarkTheme?: boolean;
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({ 
  telemetry,
  isDarkTheme = true
}) => {
  const isDark = isDarkTheme;
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
        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">ARCTIC DIESEL</span>
            <Fuel className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-black'}`}>
            {fuel.fuelDaysRemaining} <span className="text-xs text-neutral-400 font-normal">Days</span>
          </div>
          <div className={`text-[10.5px] font-mono mt-1 font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {(fuel.arcticDieselLiters / 1000).toFixed(1)}k Liters Reserve
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">POTABLE WATER</span>
            <Droplet className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-black'}`}>
            {log.potableWaterDaysProjected} <span className="text-xs text-neutral-400 font-normal">Days</span>
          </div>
          <div className={`text-[10.5px] font-mono mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Snowmelt: {fuel.snowmeltMeltRateLitersHr} L/hr
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">FOOD RATIONS</span>
            <Utensils className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-black'}`}>
            {log.foodDaysProjected} <span className="text-xs text-neutral-400 font-normal">Days</span>
          </div>
          <div className={`text-[10.5px] font-mono mt-1 font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
            {log.foodReservePct}% Cryo-depot Stock
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">NEXT RESUPPLY</span>
            <Ship className="w-4 h-4 text-[#f97316]" />
          </div>
          <div className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-black'}`}>
            {log.nextResupplyVoyageDays} <span className="text-xs text-neutral-400 font-normal">Days</span>
          </div>
          <div className="text-[10.5px] text-[#f97316] font-mono mt-1 font-semibold">
            Window: {log.resupplyWindowStatus}
          </div>
        </div>
      </div>

      {/* Main Grid: Resource Breakdown & Voyage Logistics AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Survival Runway Table */}
        <div className="glass-panel p-5 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>Polar Station Survival Runway</h3>
              <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Projected operational endurance before mandatory replenishment</p>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
              isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'
            }`}>
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
                color: 'bg-[#f97316]'
              },
              {
                name: 'Glacial RO Potable Water',
                reserve: `${(fuel.potableWaterLiters / 1000).toFixed(1)}k Liters`,
                pct: Math.round((fuel.potableWaterLiters / fuel.waterMaxCapacityLiters) * 100),
                runway: `${log.potableWaterDaysProjected} Days`,
                color: isDark ? 'bg-white' : 'bg-black'
              },
              {
                name: 'Dehydrated Food & MRE Rations',
                reserve: '18,500 Rations',
                pct: log.foodReservePct,
                runway: `${log.foodDaysProjected} Days`,
                color: 'bg-neutral-400'
              },
              {
                name: 'Medical Ward Supplies & Oxygen',
                reserve: 'Complete Surgical Stock',
                pct: log.medicalSuppliesPct,
                runway: 'Nominal',
                color: 'bg-neutral-600'
              }
            ].map((res, i) => (
              <div key={i} className={`p-3 border text-xs ${isDark ? 'bg-neutral-950/70 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{res.name}</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{res.runway}</span>
                </div>
                <div className={`w-full ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} h-2 overflow-hidden`}>
                  <div 
                    className={`h-full ${res.color}`} 
                    style={{ width: `${res.pct}%` }}
                  ></div>
                </div>
                <div className={`flex items-center justify-between text-[11px] font-mono mt-1 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  <span>Capacity: <strong className="font-semibold">{res.pct}%</strong></span>
                  <span>{res.reserve}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Resupply Window & Logistics AI Box */}
        <div className="glass-panel p-5 border border-neutral-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 border ${isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-100 border-neutral-300'} text-[#f97316]`}>
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-black'}`}>44th Indian Antarctic Expedition Resupply</h3>
                  <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Maritime logistics window via Cape Town route</p>
                </div>
              </div>
            </div>

            <div className={`p-3.5 border space-y-2 text-xs ${isDark ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className={`flex items-center justify-between font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Vessel:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{log.resupplyVesselName}</span>
              </div>
              <div className={`flex items-center justify-between font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Estimated Arrival:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{log.nextResupplyVoyageDays} Days (Icebreaker Staging)</span>
              </div>
              <div className={`flex items-center justify-between font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Fast Ice Condition:</span>
                <span className={`font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>1.4m Solid • Helo Deck Open</span>
              </div>
              <div className={`flex items-center justify-between font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Cargo Staged at Goa:</span>
                <span className={`font-medium ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>220,000L Fuel, 2x Scania Injector Heads</span>
              </div>
            </div>
          </div>

          {/* Logistics AI Optimization Advisory */}
          <div className={`p-3.5 border space-y-2 ${isDark ? 'bg-neutral-950/90 border-neutral-700' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold font-mono flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-black'}`}>
                <PackageCheck className="w-3.5 h-3.5 text-[#f97316]" />
                <span>Logistics Optimization Assistant (MoES AI)</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Active</span>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Based on projected katabatic fuel burn rates over winter and Scania generator maintenance cycle, the next voyage manifest should allocate priority volume to <strong>ATF-50 Low-Viscosity Polar Diesel</strong> and <strong>Generator 2 coolant heat-exchangers</strong>.
            </p>

            <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <span className={`text-[10.5px] font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Manifest Code: <strong className={isDark ? 'text-white' : 'text-black'}>MOES-POLAR-44-PRIORITY</strong>
              </span>

              <button
                onClick={handleGenerateManifest}
                disabled={manifestGenerated}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs uppercase border transition-all hover:scale-105 ${
                  isDark ? 'bg-white text-black hover:bg-neutral-200 border-white' : 'bg-black text-white hover:bg-neutral-800 border-black'
                }`}
              >
                {manifestGenerated ? (
                  <>
                    <PackageCheck className="w-3.5 h-3.5 text-[#f97316]" />
                    <span>Manifest Dispatched</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-3.5 h-3.5 text-[#f97316]" />
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
