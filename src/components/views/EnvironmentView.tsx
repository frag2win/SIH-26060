'use client';

import React from 'react';
import { StationTelemetry } from '@/types/telemetry';
import { 
  Thermometer, 
  Wind, 
  Eye, 
  Radio, 
  Activity, 
  Navigation
} from 'lucide-react';

interface EnvironmentViewProps {
  telemetry: StationTelemetry;
}

export const EnvironmentView: React.FC<EnvironmentViewProps> = ({ telemetry }) => {
  const env = telemetry.environment;

  return (
    <div className="space-y-4">
      {/* Vitals Grid (Sharp Technical Boxes) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">SURFACE TEMP</span>
            <Thermometer className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-black">
            {env.outsideTemp.toFixed(1)}°C
          </div>
          <div className="text-[10.5px] text-neutral-400 font-mono mt-1 font-semibold">
            Wind Chill: {env.windChill.toFixed(1)}°C
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">KATABATIC WIND</span>
            <Wind className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-black">
            {env.windSpeed} <span className="text-xs text-neutral-400 font-normal">km/h</span>
          </div>
          <div className="text-[10.5px] text-neutral-400 font-mono mt-1">
            Gusts: {env.windGust} km/h • {env.windDirection}
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">OPTICAL VISIBILITY</span>
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-black">
            {env.visibilityKm} <span className="text-xs text-neutral-400 font-normal">km</span>
          </div>
          <div className="text-[10.5px] text-neutral-300 dark:text-neutral-300 light:text-neutral-600 font-mono mt-1 font-semibold">
            Status: {env.visibilityKm > 5 ? 'VFR Clear' : 'Instrument Whiteout'}
          </div>
        </div>

        <div className="glass-panel p-3.5 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-mono">AURORAL KP INDEX</span>
            <Radio className="w-4 h-4 text-[#f97316]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white dark:text-white light:text-black">
            {env.geomagneticKp} <span className="text-xs text-neutral-400 font-normal">Kp</span>
          </div>
          <div className={`text-[10.5px] font-mono mt-1 font-semibold ${env.geomagneticKp > 6 ? 'text-[#f97316] animate-pulse font-black' : 'text-neutral-400'}`}>
            {env.geomagneticKp > 6 ? 'Extreme Auroral Storm' : 'Quiet Ionosphere'}
          </div>
        </div>
      </div>

      {/* Main Grid: 24h Temperature Curve & Weather Anemometer / Sensor Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: 24H Temperature & Wind Chill SVG Chart */}
        <div className="glass-panel p-5 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white dark:text-white light:text-black">24-Hour Polar Meteorology Trend</h3>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Ambient Surface Temperature vs Wind Chill</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-100 border border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-black font-bold">
              Barometer: {env.barometricPressure} hPa
            </span>
          </div>

          <div className="w-full h-48 bg-neutral-950/80 dark:bg-neutral-950/80 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300 p-3 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
              <line x1="0" y1="35" x2="500" y2="35" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <line x1="0" y1="105" x2="500" y2="105" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

              {/* Surface Temp Curve (White) */}
              <path
                d="M 0 55 Q 80 48, 160 62 T 320 72 T 420 58 T 500 64"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
              />

              {/* Wind Chill Curve (Industrial Amber Dashed) */}
              <path
                d="M 0 85 Q 80 80, 160 98 T 320 108 T 420 92 T 500 100"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            </svg>

            <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400 mt-1">
              <span>00:00 (-41°C)</span>
              <span>06:00 (-43°C)</span>
              <span>12:00 (-39°C)</span>
              <span>18:00 (-44°C)</span>
              <span className="text-[#f97316] font-bold">CURRENT</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-white"></span>
              Surface Temp ({env.outsideTemp}°C)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#f97316]"></span>
              Wind Chill Index ({env.windChill}°C)
            </span>
            <span>Permafrost: {env.permafrostTemp}°C</span>
          </div>
        </div>

        {/* Right: Sensor Clusters Network (Sharp Boxes) */}
        <div className="glass-panel p-5 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-neutral-900 border border-neutral-700 text-white">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white dark:text-white light:text-black">Active Polar Sensor Network</h3>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-400 light:text-neutral-600">Autonomous scientific transducer clusters</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 text-white border border-neutral-700 font-bold uppercase">
              100% ONLINE
            </span>
          </div>

          <div className="space-y-2">
            {env.sensorClusters?.map((sc, idx) => (
              <div key={idx} className="p-3 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-neutral-50 border border-neutral-800 light:border-neutral-300 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white dark:text-white light:text-black">{sc.name}</div>
                  <div className="text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">{sc.metric}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 text-white border border-neutral-700 uppercase font-black">
                  {sc.status}
                </span>
              </div>
            ))}
          </div>

          {/* Katabatic Vector Advisory */}
          <div className="p-3 bg-neutral-950/90 dark:bg-neutral-950/90 light:bg-neutral-50 border border-neutral-700 light:border-neutral-300 flex items-start gap-2.5">
            <Navigation className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white dark:text-white light:text-black block">Katabatic Drainage Wind Advisory</span>
              <span className="text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                Cold air cascade from 3,000m high polar plateau draining downhill towards Larsemann Hills at {env.windSpeed} km/h. Structural stilt aerodynamic loading is within nominal safety bounds.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
