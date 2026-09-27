'use client';

import React from 'react';
import { StationTelemetry } from '@/types/telemetry';
import { 
  Zap, 
  Fuel, 
  HeartPulse, 
  Radio, 
  Flame, 
  BatteryCharging, 
  Droplet
} from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

interface TelemetryGridProps {
  telemetry: StationTelemetry;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ telemetry }) => {
  const gen0 = telemetry.power.generators[0];
  const gen1 = telemetry.power.generators[1];
  const gen2 = telemetry.power.generators[2];

  const fuelPct = ((telemetry.fuelLifeSupport.arcticDieselLiters / telemetry.fuelLifeSupport.fuelMaxCapacityLiters) * 100).toFixed(1);
  const waterPct = ((telemetry.fuelLifeSupport.potableWaterLiters / telemetry.fuelLifeSupport.waterMaxCapacityLiters) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. POWER & MICROGRID */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-cyan-500/25">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-slate-100 light:text-slate-900">
                Power & Generation
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800 font-bold">
              {telemetry.power.gridFrequencyHz.toFixed(2)} Hz
            </span>
          </div>

          {/* Generator 1 */}
          <div className="space-y-2.5">
            <div className={`p-2.5 border text-xs transition-colors ${
              gen0.status === 'fault' 
                ? 'bg-red-950/90 border-red-500 text-red-200 animate-pulse' 
                : 'bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border-slate-800 light:border-slate-300 text-slate-200 light:text-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white dark:text-white light:text-slate-900">{gen0.name}</span>
                <span className={`text-[9.5px] font-mono px-1.5 py-0.2 font-black uppercase ${
                  gen0.status === 'fault' ? 'bg-red-600 text-white' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {gen0.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span>Output: <strong className="font-semibold">{gen0.outputKw.toFixed(0)} kW</strong> ({gen0.loadPct}%)</span>
                <span className={gen0.coolantTemp > 90 ? 'text-red-400 font-black' : 'text-cyan-400 font-semibold'}>
                  Coolant: {gen0.coolantTemp.toFixed(1)}°C
                </span>
              </div>
              {/* Load progress bar (Sharp 0px radius) */}
              <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-300 h-1.5 mt-1.5 overflow-hidden">
                <div 
                  className={`h-full ${gen0.loadPct > 90 ? 'bg-red-500' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, gen0.loadPct)}%` }}
                ></div>
              </div>
            </div>

            {/* Generator 2 */}
            <div className="p-2.5 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white dark:text-white light:text-slate-900">{gen1.name}</span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.2 font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {gen1.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span>Output: <strong className="font-semibold">{gen1.outputKw.toFixed(0)} kW</strong> ({gen1.loadPct}%)</span>
                <span className="text-cyan-400 font-semibold">Coolant: {gen1.coolantTemp.toFixed(1)}°C</span>
              </div>
              <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-300 h-1.5 mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-cyan-400"
                  style={{ width: `${Math.min(100, gen1.loadPct)}%` }}
                ></div>
              </div>
            </div>

            {/* Generator 3 (Standby) */}
            <div className="p-2.5 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white dark:text-white light:text-slate-900">{gen2.name}</span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.2 font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {gen2.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span>Output: {gen2.outputKw.toFixed(0)} kW</span>
                <span className="text-slate-400 dark:text-slate-400 light:text-slate-600">Standby Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Battery storage footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 light:border-slate-300 flex items-center justify-between text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
          <div className="flex items-center gap-1.5 text-slate-400">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>Battery Bank:</span>
          </div>
          <span className="text-emerald-400 dark:text-emerald-300 light:text-emerald-700 font-bold">{telemetry.power.batteryReserveKwh} kWh ({telemetry.power.batteryCapacityPct}%)</span>
        </div>
      </div>

      {/* 2. FUEL & THERMAL RECOVERY */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-cyan-500/25">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Fuel className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-slate-100 light:text-slate-900">
                Fuel & Trace Heating
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 border border-cyan-800 font-bold">
              ATF-50 Polar
            </span>
          </div>

          <div className="space-y-3">
            {/* Storage level gauge */}
            <div className="p-3 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-300">
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-slate-300 dark:text-slate-300 light:text-slate-600">Total Reserve:</span>
                {/* Hydration safe formatted number */}
                <span className="text-white dark:text-white light:text-slate-900 font-bold">
                  {formatNumber(telemetry.fuelLifeSupport.arcticDieselLiters)} L
                </span>
              </div>
              <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-300 h-2 overflow-hidden">
                <div 
                  className="h-full bg-cyan-400"
                  style={{ width: `${fuelPct}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700 mt-1">
                <span>{fuelPct}% Capacity</span>
                <span className="text-emerald-400 dark:text-emerald-300 light:text-emerald-700 font-bold">{telemetry.fuelLifeSupport.fuelDaysRemaining}d Runway</span>
              </div>
            </div>

            {/* Fuel Line Temperature & Waxing Warning */}
            <div className={`p-3 border transition-colors ${
              telemetry.fuelLifeSupport.fuelLineTemp < -15
                ? 'bg-red-950/90 border-red-500 text-red-200 animate-pulse'
                : 'bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border-slate-800 light:border-slate-300 text-slate-200 light:text-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
                  <Flame className={`w-3.5 h-3.5 ${telemetry.fuelLifeSupport.fuelLineHeaterActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  Trace Heat Conduit
                </span>
                <span className={`text-[9.5px] font-mono px-1.5 py-0.2 font-black uppercase ${
                  telemetry.fuelLifeSupport.fuelLineHeaterActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-600 text-white'
                }`}>
                  {telemetry.fuelLifeSupport.fuelLineHeaterActive ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span>Line Temperature:</span>
                <span className={`font-bold ${telemetry.fuelLifeSupport.fuelLineTemp < -15 ? 'text-red-400' : 'text-cyan-400'}`}>
                  {telemetry.fuelLifeSupport.fuelLineTemp.toFixed(1)}°C
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
                {telemetry.fuelLifeSupport.fuelLineTemp < -15 
                  ? 'CRITICAL: Below -15°C waxing threshold!' 
                  : 'Safe Margin (> -15°C crystallization)'}
              </div>
            </div>

            {/* Burn rate */}
            <div className="flex items-center justify-between text-[11px] font-mono bg-slate-950/50 dark:bg-slate-950/50 light:bg-slate-100 p-2 border border-slate-800 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-800">
              <span className="text-slate-400">Burn Rate:</span>
              <span className="text-amber-400 dark:text-amber-300 light:text-amber-600 font-bold">{telemetry.fuelLifeSupport.fuelBurnRateLitersHr} L/hr</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800 light:border-slate-300 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>Tank Insulation: R-60 Arctic</span>
          <span className="text-cyan-400 font-semibold">Auto-purge Ready</span>
        </div>
      </div>

      {/* 3. WATER & HABITATION LIFE SUPPORT */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-cyan-500/25">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-slate-100 light:text-slate-900">
                Life Support (ECLSS)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800 font-bold">
              Crew: {telemetry.activePersonnel}
            </span>
          </div>

          <div className="space-y-3">
            {/* Water reserve */}
            <div className="p-3 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-300">
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-slate-300 dark:text-slate-300 light:text-slate-600 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-cyan-400" />
                  Potable Water:
                </span>
                {/* Hydration safe formatted number */}
                <span className="text-white dark:text-white light:text-slate-900 font-bold">
                  {formatNumber(telemetry.fuelLifeSupport.potableWaterLiters)} L
                </span>
              </div>
              <div className="w-full bg-slate-800 dark:bg-slate-800 light:bg-slate-300 h-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-400"
                  style={{ width: `${waterPct}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700 mt-1">
                <span>{waterPct}% Storage</span>
                <span className="text-cyan-400 font-semibold">{telemetry.fuelLifeSupport.snowmeltMeltRateLitersHr} L/hr</span>
              </div>
            </div>

            {/* Atmosphere readings */}
            <div className="p-3 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-300 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Indoor Temp:</span>
                <span className="text-emerald-400 dark:text-emerald-300 light:text-emerald-700 font-bold">+{telemetry.fuelLifeSupport.indoorTemp.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Oxygen Content:</span>
                <span className="text-cyan-400 dark:text-cyan-300 light:text-cyan-700 font-bold">{telemetry.fuelLifeSupport.indoorOxygenPct}%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Carbon Dioxide:</span>
                <span className="text-slate-200 dark:text-slate-200 light:text-slate-900 font-bold">{telemetry.fuelLifeSupport.indoorCo2Ppm} ppm</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Relative Humidity:</span>
                <span className="text-slate-200 dark:text-slate-200 light:text-slate-900 font-bold">{telemetry.fuelLifeSupport.indoorHumidityPct}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800 light:border-slate-300 text-[10px] font-mono text-emerald-400 flex items-center justify-between">
          <span>HEPA + Active Charcoal OK</span>
          <span>Pressurization Nominal</span>
        </div>
      </div>

      {/* 4. SATELLITE COMMS & SPACE WEATHER */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-cyan-500/25">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-slate-100 light:text-slate-900">
                SatCom & Space Link
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase font-bold ${
              telemetry.comms.satelliteLinkStatus === 'locked' 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                : 'bg-red-600 text-white animate-pulse'
            }`}>
              {telemetry.comms.satelliteLinkStatus}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-300 space-y-2">
              <div className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600 font-semibold truncate">
                {telemetry.comms.primaryTransponder}
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Downlink:</span>
                <span className="text-cyan-400 font-bold">{telemetry.comms.downlinkMbps} Mbps</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Uplink:</span>
                <span className="text-cyan-400 font-bold">{telemetry.comms.uplinkMbps} Mbps</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Round Trip Latency:</span>
                <span className="text-amber-400 font-bold">{telemetry.comms.latencyMs} ms</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
                <span className="text-slate-400">Packet Loss:</span>
                <span className={`font-bold ${telemetry.comms.packetLossPct > 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {telemetry.comms.packetLossPct}%
                </span>
              </div>
            </div>

            {/* Radome De-icing */}
            <div className="p-2.5 bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border border-slate-800 light:border-slate-300 space-y-1 text-[11px] font-mono text-slate-300 dark:text-slate-300 light:text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Antenna De-Icer:</span>
                <span className={`font-bold ${telemetry.comms.antennaDeIcerActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {telemetry.comms.antennaDeIcerActive ? 'ACTIVE (Hot Air 42°C)' : 'STANDBY'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Geomagnetic Kp:</span>
                <span className={`font-bold ${telemetry.environment.geomagneticKp > 6 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                  {telemetry.environment.geomagneticKp} Kp ({telemetry.environment.geomagneticKp > 6 ? 'Storm' : 'Quiet'})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800 light:border-slate-300 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>ISRO Polar Ground Link</span>
          <span className="text-emerald-400 font-semibold">Bit Error &lt; 10⁻⁷</span>
        </div>
      </div>
    </div>
  );
};
