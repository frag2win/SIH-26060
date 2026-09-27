'use client';

import React from 'react';
import { StationTelemetry } from '@/types/telemetry';
import { 
  Thermometer, 
  Wind, 
  Compass, 
  Eye, 
  Radio, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  CloudSnow,
  Navigation
} from 'lucide-react';

interface EnvironmentViewProps {
  telemetry: StationTelemetry;
}

export const EnvironmentView: React.FC<EnvironmentViewProps> = ({ telemetry }) => {
  const env = telemetry.environment;

  return (
    <div className="space-y-4">
      {/* Vitals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">SURFACE TEMP</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {env.outsideTemp.toFixed(1)}°C
          </div>
          <div className="text-[10px] text-cyan-300 font-mono mt-1">
            Wind Chill: {env.windChill.toFixed(1)}°C
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">KATABATIC WIND</span>
            <Wind className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {env.windSpeed} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <div className="text-[10px] text-slate-300 font-mono mt-1">
            Gusts: {env.windGust} km/h • {env.windDirection}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">OPTICAL VISIBILITY</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {env.visibilityKm} <span className="text-xs text-slate-400 font-normal">km</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            Status: {env.visibilityKm > 5 ? 'VFR Clear' : 'Instrument Whiteout'}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-cyan-500/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-mono">AURORAL KP INDEX</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {env.geomagneticKp} <span className="text-xs text-slate-400 font-normal">Kp</span>
          </div>
          <div className={`text-[10px] font-mono mt-1 ${env.geomagneticKp > 6 ? 'text-rose-400 font-bold' : 'text-cyan-300'}`}>
            {env.geomagneticKp > 6 ? 'Extreme Auroral Storm' : 'Quiet Ionosphere'}
          </div>
        </div>
      </div>

      {/* Main Grid: 24h Temperature Curve & Weather Anemometer / Sensor Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: 24H Temperature & Wind Chill SVG Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">24-Hour Polar Meteorology Trend</h3>
              <p className="text-[11px] text-slate-400">Ambient Surface Temperature vs Wind Chill</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
              Barometer: {env.barometricPressure} hPa
            </span>
          </div>

          <div className="w-full h-48 bg-slate-950/80 rounded-xl border border-slate-800/80 p-3 relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="35" x2="500" y2="35" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="105" x2="500" y2="105" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

              {/* Surface Temp Curve */}
              <path
                d="M 0 55 Q 80 48, 160 62 T 320 72 T 420 58 T 500 64"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />

              {/* Wind Chill Curve (Deeper drop) */}
              <path
                d="M 0 85 Q 80 80, 160 98 T 320 108 T 420 92 T 500 100"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            </svg>

            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1">
              <span>00:00 (-41°C)</span>
              <span>06:00 (-43°C)</span>
              <span>12:00 (-39°C)</span>
              <span>18:00 (-44°C)</span>
              <span className="text-cyan-400 font-bold">CURRENT</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-cyan-400 rounded"></span>
              Surface Temp ({env.outsideTemp}°C)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-indigo-500 rounded"></span>
              Wind Chill Index ({env.windChill}°C)
            </span>
            <span>Permafrost: {env.permafrostTemp}°C</span>
          </div>
        </div>

        {/* Right: Sensor Clusters Network */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Active Polar Sensor Network</h3>
                <p className="text-[11px] text-slate-400">Autonomous scientific transducer clusters</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              100% ONLINE
            </span>
          </div>

          <div className="space-y-2">
            {env.sensorClusters?.map((sc, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{sc.name}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{sc.metric}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-bold">
                  {sc.status}
                </span>
              </div>
            ))}
          </div>

          {/* Katabatic Vector Advisory */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-900/40 flex items-start gap-2.5">
            <Navigation className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block">Katabatic Drainage Wind Advisory</span>
              <span className="text-slate-300">
                Cold air cascade from 3,000m high polar plateau draining downhill towards Larsemann Hills at {env.windSpeed} km/h. Structural stilt aerodynamic loading is within nominal safety bounds.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
