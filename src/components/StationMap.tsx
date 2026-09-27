'use client';

import React, { useState } from 'react';
import { StationModule, StationTelemetry, SubsystemStatus } from '@/types/telemetry';
import { 
  Zap, 
  HeartPulse, 
  FlaskConical, 
  Radio, 
  Fuel, 
  Truck, 
  Layers, 
  Crosshair, 
  Info,
  Maximize2,
  Wind
} from 'lucide-react';
import { playTacticalBlip } from '@/utils/audioAlerts';

interface StationMapProps {
  telemetry: StationTelemetry;
  onSelectModule: (module: StationModule) => void;
  selectedModuleId?: string;
}

export const StationMap: React.FC<StationMapProps> = ({
  telemetry,
  onSelectModule,
  selectedModuleId
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [hoveredModule, setHoveredModule] = useState<StationModule | null>(null);

  const getStatusColor = (status: SubsystemStatus) => {
    switch (status) {
      case 'critical':
        return {
          stroke: '#f43f5e',
          fill: 'rgba(244, 63, 94, 0.25)',
          badge: 'bg-rose-950 text-rose-300 border-rose-600',
          dot: 'bg-rose-500',
          pulse: 'pulse-critical'
        };
      case 'warning':
        return {
          stroke: '#f59e0b',
          fill: 'rgba(245, 158, 11, 0.25)',
          badge: 'bg-amber-950 text-amber-300 border-amber-600',
          dot: 'bg-amber-500',
          pulse: 'pulse-warning'
        };
      case 'offline':
        return {
          stroke: '#64748b',
          fill: 'rgba(100, 116, 139, 0.2)',
          badge: 'bg-slate-900 text-slate-400 border-slate-700',
          dot: 'bg-slate-500',
          pulse: ''
        };
      case 'nominal':
      default:
        return {
          stroke: '#10b981',
          fill: 'rgba(16, 185, 129, 0.15)',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-600',
          dot: 'bg-emerald-500',
          pulse: 'pulse-nominal'
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'power':
        return <Zap className="w-3.5 h-3.5" />;
      case 'life_support':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'science':
        return <FlaskConical className="w-3.5 h-3.5" />;
      case 'comms':
        return <Radio className="w-3.5 h-3.5" />;
      case 'fuel':
        return <Fuel className="w-3.5 h-3.5" />;
      case 'logistics':
      default:
        return <Truck className="w-3.5 h-3.5" />;
    }
  };

  const filteredModules = telemetry.modules.filter(
    m => filterCategory === 'all' || m.category === filterCategory
  );

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col h-full relative overflow-hidden">
      {/* Schematic Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Station Architectural Digital Twin</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                Top-Down Layout
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive 2D telemetry schematic • Click any module for real-time diagnostics
            </p>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'power', label: 'Power' },
            { id: 'life_support', label: 'Life Support' },
            { id: 'science', label: 'Science' },
            { id: 'fuel', label: 'Fuel' },
            { id: 'comms', label: 'Comms' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                playTacticalBlip(750, 40);
                setFilterCategory(cat.id);
              }}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                filterCategory === cat.id
                  ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2D Schematic Canvas Container */}
      <div className="relative flex-1 min-h-[380px] w-full rounded-xl bg-slate-950/90 border border-cyan-900/40 overflow-hidden polar-grid-bg">
        {/* Radar Scanner Sweep Effect */}
        <div className="radar-scanner opacity-40"></div>

        {/* Antarctic Compass & Katabatic Wind Vector Arrow */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-cyan-800/40 text-[10px] font-mono text-cyan-300 shadow">
          <Wind className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>KATABATIC WIND VECTOR: {telemetry.environment.windDirection} ({telemetry.environment.windSpeed} km/h)</span>
        </div>

        {/* Legend */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 shadow">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Nominal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            <span>Critical</span>
          </div>
        </div>

        {/* SVG Schematic Layer */}
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Blueprint Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
            </pattern>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Ice Shelf Contours & Bedrock Outcrops */}
          <path 
            d="M 50,550 Q 200,480 350,520 T 700,500 T 950,560" 
            fill="none" 
            stroke="rgba(147, 197, 253, 0.15)" 
            strokeWidth="2" 
            strokeDasharray="4 4" 
          />
          <path 
            d="M 20,400 Q 250,340 500,380 T 980,360" 
            fill="none" 
            stroke="rgba(147, 197, 253, 0.12)" 
            strokeWidth="1.5" 
          />

          {/* Umbilical Conduits & Interconnecting Corridor Tunnels */}
          {/* Main corridor: Power -> Habitation -> Water -> Radar */}
          <path
            d="M 240,252 L 480,132 L 520,276 L 740,228 L 760,408"
            fill="none"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner corridor core */}
          <path
            d="M 240,252 L 480,132 L 520,276 L 740,228 L 760,408"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Trace heated Fuel lines: Fuel Farm -> Power Generation */}
          <path
            d="M 180,432 L 240,252"
            fill="none"
            stroke={telemetry.fuelLifeSupport.fuelLineTemp < -15 ? '#f43f5e' : '#f59e0b'}
            strokeWidth="4"
            strokeDasharray="4 4"
            className="animate-pulse"
          />

          {/* Comms Dish Fiber line */}
          <path
            d="M 440,492 L 480,132"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="8 4"
          />

          {/* Emergency Bunker safety umbilical */}
          <path
            d="M 520,276 L 880,108"
            fill="none"
            stroke="rgba(16, 185, 129, 0.3)"
            strokeWidth="3"
            strokeDasharray="5 5"
          />

          {/* Helipad representation */}
          <g transform="translate(120, 100)">
            <circle cx="0" cy="0" r="45" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="0" cy="0" r="32" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1.5" />
            <text x="0" y="8" textAnchor="middle" fill="#f59e0b" fontSize="22" fontWeight="bold" fontFamily="monospace">H</text>
            <text x="0" y="-38" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">HELI-PAD LZ-1</text>
          </g>

          {/* Render Modules as Interactive SVG Groups */}
          {telemetry.modules.map((module) => {
            const isVisible = filterCategory === 'all' || module.category === filterCategory;
            const colors = getStatusColor(module.status);
            const isSelected = selectedModuleId === module.id;
            const isHovered = hoveredModule?.id === module.id;
            
            // Map percentage coordinates (0-100) to SVG canvas (0-1000, 0-600)
            const cx = (module.x / 100) * 1000;
            const cy = (module.y / 100) * 600;
            const width = 110;
            const height = 64;

            return (
              <g
                key={module.id}
                transform={`translate(${cx}, ${cy})`}
                opacity={isVisible ? 1 : 0.25}
                className="cursor-pointer transition-all duration-300"
                onClick={() => {
                  playTacticalBlip(900, 80);
                  onSelectModule(module);
                }}
                onMouseEnter={() => setHoveredModule(module)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                {/* Selection & Hover highlight halo */}
                {(isSelected || isHovered) && (
                  <rect
                    x={-(width / 2) - 8}
                    y={-(height / 2) - 8}
                    width={width + 16}
                    height={height + 16}
                    rx="14"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                    filter="url(#glow)"
                  />
                )}

                {/* Base Module Pod Container */}
                <rect
                  x={-(width / 2)}
                  y={-(height / 2)}
                  width={width}
                  height={height}
                  rx="10"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? '2.5' : '1.8'}
                  className="shadow-2xl"
                />

                {/* Top status indicator strip */}
                <rect
                  x={-(width / 2) + 2}
                  y={-(height / 2) + 2}
                  width={width - 4}
                  height="4"
                  rx="2"
                  fill={colors.stroke}
                />

                {/* Module Icon and ID */}
                <text
                  x={-(width / 2) + 10}
                  y={-(height / 2) + 22}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {module.id.toUpperCase()}
                </text>

                {/* Module Name (Truncated/Multi-line) */}
                <text
                  x={-(width / 2) + 10}
                  y={-(height / 2) + 36}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {module.name.length > 15 ? module.name.slice(0, 14) + '…' : module.name}
                </text>

                {/* Mini Subsystem Telemetry Badge */}
                <text
                  x={-(width / 2) + 10}
                  y={-(height / 2) + 52}
                  fill="#38bdf8"
                  fontSize="9.5"
                  fontFamily="monospace"
                >
                  {module.temperature}°C • {module.powerDrawKw}kW
                </text>

                {/* Status Pulsing Dot */}
                <circle
                  cx={(width / 2) - 12}
                  cy={-(height / 2) + 16}
                  r="4.5"
                  fill={colors.stroke}
                  className={module.status === 'critical' ? 'animate-ping' : ''}
                />
                <circle
                  cx={(width / 2) - 12}
                  cy={-(height / 2) + 16}
                  r="3.5"
                  fill={colors.stroke}
                />
              </g>
            );
          })}
        </svg>

        {/* Hovered Module Telemetry Tooltip Inspector */}
        {hoveredModule && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 glass-panel bg-slate-900/95 p-3 rounded-xl border border-cyan-500/40 shadow-xl max-w-sm pointer-events-none">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded bg-cyan-950 text-cyan-300">
                  {getCategoryIcon(hoveredModule.category)}
                </span>
                <span className="text-xs font-bold text-white">{hoveredModule.name}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${getStatusColor(hoveredModule.status).badge}`}>
                {hoveredModule.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mb-2">{hoveredModule.description}</p>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block">HEALTH</span>
                <span className="text-emerald-400 font-bold">{hoveredModule.health}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">TEMP</span>
                <span className="text-cyan-300 font-bold">{hoveredModule.temperature}°C</span>
              </div>
              <div>
                <span className="text-slate-500 block">POWER</span>
                <span className="text-amber-300 font-bold">{hoveredModule.powerDrawKw} kW</span>
              </div>
            </div>

            <div className="text-[9px] text-cyan-400 font-mono mt-1.5 flex items-center gap-1">
              <Crosshair className="w-3 h-3" />
              <span>CLICK MODULE TO OPEN DEEP DIAGNOSTIC INSPECTOR</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Synchronized with Indian Polar SatCom Earth Station telemetry bus</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Active Modules: {filteredModules.length}</span>
        </div>
      </div>
    </div>
  );
};
