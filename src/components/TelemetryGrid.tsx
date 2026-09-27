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
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-neutral-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-neutral-900 border border-neutral-700 text-white">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Power & Generation
              </h3>
            </div>
            <span className="text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 border border-neutral-700 font-bold">
              {telemetry.power.gridFrequencyHz.toFixed(2)} Hz
            </span>
          </div>

          {/* Generator 1 */}
          <div className="space-y-2.5">
            <div className={`p-2.5 border text-xs transition-colors ${
              gen0.status === 'fault' 
                ? 'bg-white text-black border-2 border-white font-black' 
                : 'bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border-neutral-800 light:border-neutral-300 text-neutral-200 light:text-neutral-800'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white dark:text-white light:text-black">{gen0.name}</span>
                <span className={`text-[9.5px] font-mono px-1.5 py-0.2 font-black uppercase ${
                  gen0.status === 'fault' ? 'bg-black text-white' : 'bg-neutral-900 text-neutral-200 border border-neutral-700'
                }`}>
                  {gen0.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono opacity-80">
                <span>Output: <strong className="font-semibold">{gen0.outputKw.toFixed(0)} kW</strong> ({gen0.loadPct}%)</span>
                <span className={gen0.coolantTemp > 90 ? 'font-black underline' : 'font-semibold'}>
                  Coolant: {gen0.coolantTemp.toFixed(1)}°C
                </span>
              </div>
              {/* Load progress bar (Sharp 0px radius) */}
              <div className="w-full bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-300 h-1.5 mt-1.5 overflow-hidden">
                <div 
                  className={`h-full ${gen0.status === 'fault' ? 'bg-black dark:bg-white' : 'bg-white'}`}
                  style={{ width: `${Math.min(100, gen0.loadPct)}%` }}
                ></div>
              </div>
            </div>

            {/* Generator 2 */}
            <div className="p-2.5 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white dark:text-white light:text-black">{gen1.name}</span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.2 font-black uppercase bg-neutral-900 text-neutral-200 border border-neutral-700">
                  {gen1.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span>Output: <strong className="font-semibold">{gen1.outputKw.toFixed(0)} kW</strong> ({gen1.loadPct}%)</span>
                <span className="font-semibold">Coolant: {gen1.coolantTemp.toFixed(1)}°C</span>
              </div>
              <div className="w-full bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-300 h-1.5 mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-white"
                  style={{ width: `${Math.min(100, gen1.loadPct)}%` }}
                ></div>
              </div>
            </div>

            {/* Generator 3 (Standby) */}
            <div className="p-2.5 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white dark:text-white light:text-black">{gen2.name}</span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.2 font-black uppercase bg-neutral-900 text-neutral-400 border border-neutral-800">
                  {gen2.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                <span>Output: {gen2.outputKw.toFixed(0)} kW</span>
                <span>Standby Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Battery storage footer */}
        <div className="mt-3 pt-2.5 border-t border-neutral-800 light:border-neutral-300 flex items-center justify-between text-[11px] font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <BatteryCharging className="w-3.5 h-3.5 text-white" />
            <span>Battery Bank:</span>
          </div>
          <span className="text-white font-bold">{telemetry.power.batteryReserveKwh} kWh ({telemetry.power.batteryCapacityPct}%)</span>
        </div>
      </div>

      {/* 2. FUEL & THERMAL RECOVERY */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-neutral-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-neutral-900 border border-neutral-700 text-white">
                <Fuel className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Fuel & Trace Heating
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-300 bg-neutral-900 px-2 py-0.5 border border-neutral-700 font-bold">
              ATF-50 Polar
            </span>
          </div>

          <div className="space-y-3">
            {/* Storage level gauge */}
            <div className="p-3 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300">
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-neutral-400">Total Reserve:</span>
                <span className="text-white dark:text-white light:text-black font-bold">
                  {formatNumber(telemetry.fuelLifeSupport.arcticDieselLiters)} L
                </span>
              </div>
              <div className="w-full bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-300 h-2 overflow-hidden">
                <div 
                  className="h-full bg-white"
                  style={{ width: `${fuelPct}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mt-1">
                <span>{fuelPct}% Capacity</span>
                <span className="text-white font-bold">{telemetry.fuelLifeSupport.fuelDaysRemaining}d Runway</span>
              </div>
            </div>

            {/* Fuel Line Temperature & Waxing Warning */}
            <div className={`p-3 border transition-colors ${
              telemetry.fuelLifeSupport.fuelLineTemp < -15
                ? 'bg-white text-black border-2 border-white'
                : 'bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border-neutral-800 light:border-neutral-300 text-neutral-200 light:text-neutral-800'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-white dark:text-white light:text-black flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-neutral-400" />
                  Trace Heat Conduit
                </span>
                <span className={`text-[9.5px] font-mono px-1.5 py-0.2 font-black uppercase ${
                  telemetry.fuelLifeSupport.fuelLineHeaterActive ? 'bg-neutral-900 text-white border border-neutral-700' : 'bg-white text-black'
                }`}>
                  {telemetry.fuelLifeSupport.fuelLineHeaterActive ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span>Line Temperature:</span>
                <span className={`font-bold ${telemetry.fuelLifeSupport.fuelLineTemp < -15 ? 'text-black dark:text-black font-black' : 'text-white'}`}>
                  {telemetry.fuelLifeSupport.fuelLineTemp.toFixed(1)}°C
                </span>
              </div>
              <div className="text-[10px] font-mono text-neutral-400 mt-1">
                {telemetry.fuelLifeSupport.fuelLineTemp < -15 
                  ? 'CRITICAL: Below -15°C waxing threshold!' 
                  : 'Safe Margin (> -15°C crystallization)'}
              </div>
            </div>

            {/* Burn rate */}
            <div className="flex items-center justify-between text-[11px] font-mono bg-neutral-950/50 dark:bg-neutral-950/50 light:bg-neutral-100 p-2 border border-neutral-800 light:border-neutral-300 text-neutral-300 dark:text-neutral-300 light:text-neutral-800">
              <span className="text-neutral-400">Burn Rate:</span>
              <span className="text-white font-bold">{telemetry.fuelLifeSupport.fuelBurnRateLitersHr} L/hr</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-neutral-800 light:border-neutral-300 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
          <span>Tank Insulation: R-60 Arctic</span>
          <span className="text-neutral-300 font-semibold">Auto-purge Ready</span>
        </div>
      </div>

      {/* 3. WATER & HABITATION LIFE SUPPORT */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-neutral-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-neutral-900 border border-neutral-700 text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Life Support (ECLSS)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-white bg-neutral-900 px-2 py-0.5 border border-neutral-700 font-bold">
              Crew: {telemetry.activePersonnel}
            </span>
          </div>

          <div className="space-y-3">
            {/* Water reserve */}
            <div className="p-3 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300">
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-white" />
                  Potable Water:
                </span>
                <span className="text-white dark:text-white light:text-black font-bold">
                  {formatNumber(telemetry.fuelLifeSupport.potableWaterLiters)} L
                </span>
              </div>
              <div className="w-full bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-300 h-2 overflow-hidden">
                <div 
                  className="h-full bg-white"
                  style={{ width: `${waterPct}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mt-1">
                <span>{waterPct}% Storage</span>
                <span className="text-neutral-400 font-semibold">{telemetry.fuelLifeSupport.snowmeltMeltRateLitersHr} L/hr</span>
              </div>
            </div>

            {/* Atmosphere readings */}
            <div className="p-3 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span className="text-neutral-400">Indoor Temp:</span>
                <span className="text-white font-bold">+{telemetry.fuelLifeSupport.indoorTemp.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span className="text-neutral-400">Oxygen Content:</span>
                <span className="text-white font-bold">{telemetry.fuelLifeSupport.indoorOxygenPct}%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span className="text-neutral-400">Carbon Dioxide:</span>
                <span className="text-white dark:text-white light:text-black font-bold">{telemetry.fuelLifeSupport.indoorCo2Ppm} ppm</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span className="text-neutral-400">Relative Humidity:</span>
                <span className="text-white dark:text-white light:text-black font-bold">{telemetry.fuelLifeSupport.indoorHumidityPct}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-neutral-800 light:border-neutral-300 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
          <span>HEPA + Active Charcoal OK</span>
          <span>Pressurization Nominal</span>
        </div>
      </div>

      {/* 4. SATELLITE COMMS & SPACE WEATHER */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-neutral-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-neutral-900 border border-neutral-700 text-white">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                SatCom & Space Link
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase font-bold ${
              telemetry.comms.satelliteLinkStatus === 'locked' 
                ? 'bg-neutral-900 text-neutral-200 border-neutral-700' 
                : 'bg-white text-black font-black'
            }`}>
              {telemetry.comms.satelliteLinkStatus}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 space-y-2">
              <div className="text-[11px] text-neutral-300 dark:text-neutral-300 light:text-neutral-600 font-semibold truncate font-mono">
                {telemetry.comms.primaryTransponder}
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span className="text-neutral-400">Downlink:</span>
                <span className="text-white font-bold">{telemetry.comms.downlinkMbps} Mbps</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span className="text-neutral-400">Uplink:</span>
                <span className="text-white font-bold">{telemetry.comms.uplinkMbps} Mbps</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span className="text-neutral-400">Round Trip Latency:</span>
                <span className="text-white font-bold">{telemetry.comms.latencyMs} ms</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
                <span className="text-neutral-400">Packet Loss:</span>
                <span className={`font-bold ${telemetry.comms.packetLossPct > 5 ? 'bg-white text-black px-1 font-black' : 'text-white'}`}>
                  {telemetry.comms.packetLossPct}%
                </span>
              </div>
            </div>

            {/* Radome De-icing */}
            <div className="p-2.5 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 space-y-1 text-[11px] font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Antenna De-Icer:</span>
                <span className="font-bold text-white">
                  {telemetry.comms.antennaDeIcerActive ? 'ACTIVE (Hot Air 42°C)' : 'STANDBY'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Geomagnetic Kp:</span>
                <span className={`font-bold ${telemetry.environment.geomagneticKp > 6 ? 'bg-white text-black px-1 font-black' : 'text-white'}`}>
                  {telemetry.environment.geomagneticKp} Kp ({telemetry.environment.geomagneticKp > 6 ? 'Storm' : 'Quiet'})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-neutral-800 light:border-neutral-300 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
          <span>ISRO Polar Ground Link</span>
          <span className="text-white font-semibold">Bit Error &lt; 10⁻⁷</span>
        </div>
      </div>
    </div>
  );
};
