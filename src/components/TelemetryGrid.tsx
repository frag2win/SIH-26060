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
  isDarkTheme?: boolean;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ 
  telemetry,
  isDarkTheme = true 
}) => {
  const isDark = isDarkTheme;
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
              <div className={`p-1 border ${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}>
                <Zap className="w-4 h-4" />
              </div>
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                Power & Generation
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
              isDark ? 'text-white bg-neutral-900 border-neutral-700' : 'text-black bg-neutral-100 border-neutral-300'
            }`}>
              {telemetry.power.gridFrequencyHz.toFixed(2)} Hz
            </span>
          </div>

          {/* Generator 1 */}
          <div className="space-y-2.5">
            <div className={`p-2.5 border text-xs transition-colors ${
              gen0.status === 'fault' 
                ? isDark 
                  ? 'bg-white text-black border-2 border-white font-black' 
                  : 'bg-black text-white border-2 border-black font-black'
                : isDark
                ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{gen0.name}</span>
                <span className={`text-[9.5px] font-mono px-1.5 py-0.5 font-black uppercase border ${
                  gen0.status === 'fault' 
                    ? isDark ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                    : isDark ? 'bg-neutral-900 text-neutral-200 border-neutral-700' : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                }`}>
                  {gen0.status}
                </span>
              </div>
              <div className={`flex items-center justify-between text-[11px] font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <span>Output: <strong className="font-semibold">{gen0.outputKw.toFixed(0)} kW</strong> ({gen0.loadPct}%)</span>
                <span className={gen0.coolantTemp > 90 ? 'font-black underline text-[#f97316]' : 'font-semibold'}>
                  Coolant: {gen0.coolantTemp.toFixed(1)}°C
                </span>
              </div>
              {/* Load progress bar (Sharp 0px radius) */}
              <div className={`w-full ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} h-1.5 mt-1.5 overflow-hidden`}>
                <div 
                  className={`h-full ${gen0.status === 'fault' ? (isDark ? 'bg-black' : 'bg-white') : (isDark ? 'bg-white' : 'bg-black')}`}
                  style={{ width: `${Math.min(100, gen0.loadPct)}%` }}
                ></div>
              </div>
            </div>

            {/* Generator 2 */}
            <div className={`p-2.5 border text-xs ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{gen1.name}</span>
                <span className={`text-[9.5px] font-mono px-1.5 py-0.5 font-black uppercase border ${
                  isDark ? 'bg-neutral-900 text-neutral-200 border-neutral-700' : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                }`}>
                  {gen1.status}
                </span>
              </div>
              <div className={`flex items-center justify-between text-[11px] font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <span>Output: <strong className="font-semibold">{gen1.outputKw.toFixed(0)} kW</strong> ({gen1.loadPct}%)</span>
                <span className="font-semibold">Coolant: {gen1.coolantTemp.toFixed(1)}°C</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} h-1.5 mt-1.5 overflow-hidden`}>
                <div 
                  className={`h-full ${isDark ? 'bg-white' : 'bg-black'}`}
                  style={{ width: `${Math.min(100, gen1.loadPct)}%` }}
                ></div>
              </div>
            </div>

            {/* Generator 3 (Standby) */}
            <div className={`p-2.5 border text-xs ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{gen2.name}</span>
                <span className={`text-[9.5px] font-mono px-1.5 py-0.5 font-black uppercase border ${
                  isDark ? 'bg-neutral-900 text-neutral-400 border-neutral-700' : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                }`}>
                  {gen2.status}
                </span>
              </div>
              <div className={`flex items-center justify-between text-[11px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                <span>Output: {gen2.outputKw.toFixed(0)} kW</span>
                <span>Standby Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Battery storage footer */}
        <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] font-mono ${
          isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-700'
        }`}>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <BatteryCharging className={`w-3.5 h-3.5 ${isDark ? 'text-white' : 'text-black'}`} />
            <span>Battery Bank:</span>
          </div>
          <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.power.batteryReserveKwh} kWh ({telemetry.power.batteryCapacityPct}%)</span>
        </div>
      </div>

      {/* 2. FUEL & THERMAL RECOVERY */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-neutral-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1 border ${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}>
                <Fuel className="w-4 h-4" />
              </div>
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                Fuel & Trace Heating
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
              isDark ? 'text-neutral-300 bg-neutral-900 border-neutral-700' : 'text-neutral-700 bg-neutral-100 border-neutral-300'
            }`}>
              ATF-50 Polar
            </span>
          </div>

          <div className="space-y-3">
            {/* Storage level gauge */}
            <div className={`p-3 border ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-neutral-400">Total Reserve:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {formatNumber(telemetry.fuelLifeSupport.arcticDieselLiters)} L
                </span>
              </div>
              <div className={`w-full ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} h-2 overflow-hidden`}>
                <div 
                  className={`h-full ${isDark ? 'bg-white' : 'bg-black'}`}
                  style={{ width: `${fuelPct}%` }}
                ></div>
              </div>
              <div className={`flex items-center justify-between text-[11px] font-mono mt-1 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <span>{fuelPct}% Capacity</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.fuelLifeSupport.fuelDaysRemaining}d Runway</span>
              </div>
            </div>

            {/* Fuel Line Temperature & Waxing Warning */}
            <div className={`p-3 border transition-colors ${
              telemetry.fuelLifeSupport.fuelLineTemp < -15
                ? isDark 
                  ? 'bg-white text-black border-2 border-white'
                  : 'bg-black text-white border-2 border-black'
                : isDark
                ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-black'}`}>
                  <Flame className="w-3.5 h-3.5 text-[#f97316]" />
                  Trace Heat Conduit
                </span>
                <span className={`text-[9.5px] font-mono px-1.5 py-0.5 font-black uppercase border ${
                  telemetry.fuelLifeSupport.fuelLineHeaterActive 
                    ? isDark ? 'bg-neutral-900 text-white border-neutral-700' : 'bg-neutral-100 text-black border-neutral-300'
                    : isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
                }`}>
                  {telemetry.fuelLifeSupport.fuelLineHeaterActive ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
              <div className={`flex items-center justify-between text-[11px] font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <span>Line Temperature:</span>
                <span className={`font-bold ${telemetry.fuelLifeSupport.fuelLineTemp < -15 ? 'text-[#f97316] font-black' : isDark ? 'text-white' : 'text-black'}`}>
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
            <div className={`flex items-center justify-between text-[11px] font-mono p-2 border ${
              isDark ? 'bg-neutral-950/50 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
            }`}>
              <span className="text-neutral-400">Burn Rate:</span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.fuelLifeSupport.fuelBurnRateLitersHr} L/hr</span>
            </div>
          </div>
        </div>

        <div className={`mt-3 pt-2.5 border-t text-[10px] font-mono flex items-center justify-between ${
          isDark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-500'
        }`}>
          <span>Tank Insulation: R-60 Arctic</span>
          <span className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Auto-purge Ready</span>
        </div>
      </div>

      {/* 3. WATER & HABITATION LIFE SUPPORT */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-neutral-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1 border ${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}>
                <HeartPulse className="w-4 h-4" />
              </div>
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                Life Support (ECLSS)
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
              isDark ? 'text-white bg-neutral-900 border-neutral-700' : 'text-black bg-neutral-100 border-neutral-300'
            }`}>
              Crew: {telemetry.activePersonnel}
            </span>
          </div>

          <div className="space-y-3">
            {/* Water reserve */}
            <div className={`p-3 border ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Droplet className={`w-3 h-3 ${isDark ? 'text-white' : 'text-black'}`} />
                  Potable Water:
                </span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {formatNumber(telemetry.fuelLifeSupport.potableWaterLiters)} L
                </span>
              </div>
              <div className={`w-full ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} h-2 overflow-hidden`}>
                <div 
                  className={`h-full ${isDark ? 'bg-white' : 'bg-black'}`}
                  style={{ width: `${waterPct}%` }}
                ></div>
              </div>
              <div className={`flex items-center justify-between text-[11px] font-mono mt-1 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <span>{waterPct}% Storage</span>
                <span className="text-neutral-400 font-semibold">{telemetry.fuelLifeSupport.snowmeltMeltRateLitersHr} L/hr</span>
              </div>
            </div>

            {/* Atmosphere readings */}
            <div className={`p-3 border space-y-2 ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Indoor Temp:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>+{telemetry.fuelLifeSupport.indoorTemp.toFixed(1)}°C</span>
              </div>
              <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Oxygen Content:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.fuelLifeSupport.indoorOxygenPct}%</span>
              </div>
              <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Carbon Dioxide:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.fuelLifeSupport.indoorCo2Ppm} ppm</span>
              </div>
              <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Relative Humidity:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.fuelLifeSupport.indoorHumidityPct}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-3 pt-2.5 border-t text-[10px] font-mono flex items-center justify-between ${
          isDark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-500'
        }`}>
          <span>HEPA + Active Charcoal OK</span>
          <span>Pressurization Nominal</span>
        </div>
      </div>

      {/* 4. SATELLITE COMMS & SPACE WEATHER */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden border border-neutral-800">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1 border ${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}>
                <Radio className="w-4 h-4" />
              </div>
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-black'}`}>
                SatCom & Space Link
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase font-bold ${
              telemetry.comms.satelliteLinkStatus === 'locked' 
                ? isDark ? 'bg-neutral-900 text-neutral-200 border-neutral-700' : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                : isDark ? 'bg-white text-black font-black' : 'bg-black text-white font-black'
            }`}>
              {telemetry.comms.satelliteLinkStatus}
            </span>
          </div>

          <div className="space-y-3">
            <div className={`p-3 border space-y-2 ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
              <div className={`text-[11px] font-semibold truncate font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {telemetry.comms.primaryTransponder}
              </div>
              <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Downlink:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.comms.downlinkMbps} Mbps</span>
              </div>
              <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Uplink:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.comms.uplinkMbps} Mbps</span>
              </div>
              <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Round Trip Latency:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>{telemetry.comms.latencyMs} ms</span>
              </div>
              <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span className="text-neutral-400">Packet Loss:</span>
                <span className={`font-bold ${telemetry.comms.packetLossPct > 5 ? 'text-[#f97316] font-black' : isDark ? 'text-white' : 'text-black'}`}>
                  {telemetry.comms.packetLossPct}%
                </span>
              </div>
            </div>

            {/* Radome De-icing */}
            <div className={`p-2.5 border space-y-1 text-[11px] font-mono ${
              isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Antenna De-Icer:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {telemetry.comms.antennaDeIcerActive ? 'ACTIVE (Hot Air 42°C)' : 'STANDBY'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Geomagnetic Kp:</span>
                <span className={`font-bold ${telemetry.environment.geomagneticKp > 6 ? 'text-[#f97316] font-black' : isDark ? 'text-white' : 'text-black'}`}>
                  {telemetry.environment.geomagneticKp} Kp ({telemetry.environment.geomagneticKp > 6 ? 'Storm' : 'Quiet'})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-3 pt-2.5 border-t text-[10px] font-mono flex items-center justify-between ${
          isDark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-500'
        }`}>
          <span>ISRO Polar Ground Link</span>
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Bit Error &lt; 10⁻⁷</span>
        </div>
      </div>
    </div>
  );
};
