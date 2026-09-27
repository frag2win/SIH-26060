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
          stroke: '#ef4444',
          fill: 'rgba(239, 68, 68, 0.25)',
          badge: 'bg-red-950 text-red-200 border-red-500 font-black',
          dot: 'bg-red-500',
          pulse: 'pulse-critical'
        };
      case 'warning':
        return {
          stroke: '#f59e0b',
          fill: 'rgba(245, 158, 11, 0.25)',
          badge: 'bg-amber-950 text-amber-200 border-amber-500 font-bold',
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
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold',
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
    <div className="glass-panel p-4 flex flex-col h-full relative overflow-hidden">
      {/* Schematic Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <span>Station Architectural Digital Twin</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-cyan-300 uppercase">
                Top-Down Node Graph
              </span>
            </h2>
            <p className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-600">
              Interactive 2D schematic • Hover node to isolate • Click for internal diagnostics
            </p>
          </div>
        </div>

        {/* Filter categories with sharp boxes */}
        <div className="flex items-center gap-1 bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 p-0.5 border border-slate-800 light:border-slate-300 text-xs font-mono">
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
              className={`px-2 py-1 text-[11px] font-semibold transition-all ${
                filterCategory === cat.id
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2D Schematic Canvas Container (Sharp Box) */}
      <div className="relative flex-1 min-h-[400px] w-full bg-slate-950/95 dark:bg-slate-950/95 light:bg-slate-900 border border-cyan-900/40 overflow-hidden polar-grid-bg">
        {/* Radar Scanner Sweep Effect */}
        <div className="radar-scanner opacity-30"></div>

        {/* Antarctic Compass & Katabatic Wind Vector Arrow */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 border border-cyan-800/40 text-[10px] font-mono text-cyan-300 shadow">
          <Wind className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>KATABATIC VECTOR: {telemetry.environment.windDirection} ({telemetry.environment.windSpeed} km/h)</span>
        </div>

        {/* Legend */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 border border-slate-800 text-[10px] font-mono text-slate-200 shadow">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500"></span>
            <span className="text-slate-300">Nominal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-400"></span>
            <span className="text-amber-300 font-bold">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-500 animate-ping"></span>
            <span className="text-red-400 font-black">Critical</span>
          </div>
        </div>

        {/* SVG Schematic Layer */}
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
            </pattern>

            <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Ice Shelf Contours & Bedrock Outcrops */}
          <path 
            d="M 50,550 Q 200,480 350,520 T 700,500 T 950,560" 
            fill="none" 
            stroke="rgba(147, 197, 253, 0.12)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />

          {/* REDUCED LINE NOISE: Lower opacity (20-25%) & thinner stroke width */}
          {/* Main corridor: Power -> Habitation -> Water -> Radar */}
          <path
            d="M 240,252 L 480,132 L 520,276 L 740,228 L 760,408"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeOpacity="0.25"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Trace heated Fuel lines: Fuel Farm -> Power Generation */}
          <path
            d="M 180,432 L 240,252"
            fill="none"
            stroke={telemetry.fuelLifeSupport.fuelLineTemp < -15 ? '#ef4444' : '#f59e0b'}
            strokeWidth="2"
            strokeOpacity="0.35"
            strokeDasharray="4 4"
          />

          {/* Comms Dish Fiber line */}
          <path
            d="M 440,492 L 480,132"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeOpacity="0.25"
            strokeDasharray="6 3"
          />

          {/* Emergency Bunker safety umbilical */}
          <path
            d="M 520,276 L 880,108"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeOpacity="0.2"
            strokeDasharray="4 4"
          />

          {/* Helipad representation (Sharp technical square) */}
          <g transform="translate(120, 100)">
            <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="-28" y="-28" width="56" height="56" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1" />
            <text x="0" y="8" textAnchor="middle" fill="#f59e0b" fontSize="20" fontWeight="bold" fontFamily="monospace">H</text>
            <text x="0" y="-32" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">HELI-PAD LZ-1</text>
          </g>

          {/* Render Modules as Interactive SVG Groups with SHARP CORNERS & FOCUS DIMMING */}
          {telemetry.modules.map((module) => {
            const isVisible = filterCategory === 'all' || module.category === filterCategory;
            const colors = getStatusColor(module.status);
            const isSelected = selectedModuleId === module.id;
            const isHovered = hoveredModule?.id === module.id;

            // Interactive focus: Dim other nodes when one is hovered
            let nodeOpacity = 1;
            if (!isVisible) {
              nodeOpacity = 0.15;
            } else if (hoveredModule) {
              nodeOpacity = isHovered ? 1 : 0.28;
            }
            
            const cx = (module.x / 100) * 1000;
            const cy = (module.y / 100) * 600;
            const width = isHovered ? 122 : 112;
            const height = isHovered ? 68 : 62;

            return (
              <g
                key={module.id}
                transform={`translate(${cx}, ${cy})`}
                opacity={nodeOpacity}
                className="cursor-pointer transition-all duration-200"
                onClick={() => {
                  playTacticalBlip(900, 80);
                  onSelectModule(module);
                }}
                onMouseEnter={() => setHoveredModule(module)}
                onMouseLeave={() => setHoveredModule(null)}
              >
                {/* Selection & Hover highlight frame with SHARP CORNERS */}
                {(isSelected || isHovered) && (
                  <rect
                    x={-(width / 2) - 6}
                    y={-(height / 2) - 6}
                    width={width + 12}
                    height={height + 12}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    filter="url(#nodeGlow)"
                  />
                )}

                {/* Base Module Pod Container (Sharp 0px radius) */}
                <rect
                  x={-(width / 2)}
                  y={-(height / 2)}
                  width={width}
                  height={height}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected || isHovered ? '2.5' : '1.8'}
                />

                {/* Top status indicator strip */}
                <rect
                  x={-(width / 2) + 2}
                  y={-(height / 2) + 2}
                  width={width - 4}
                  height="3.5"
                  fill={colors.stroke}
                />

                {/* Module ID */}
                <text
                  x={-(width / 2) + 8}
                  y={-(height / 2) + 20}
                  fill="#cbd5e1"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {module.id.toUpperCase()}
                </text>

                {/* Module Name */}
                <text
                  x={-(width / 2) + 8}
                  y={-(height / 2) + 34}
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="bold"
                >
                  {module.name.length > 16 ? module.name.slice(0, 15) + '…' : module.name}
                </text>

                {/* Mini Subsystem Telemetry Badge */}
                <text
                  x={-(width / 2) + 8}
                  y={-(height / 2) + 49}
                  fill="#38bdf8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {module.temperature}°C • {module.powerDrawKw}kW
                </text>

                {/* Status Indicator Square */}
                <rect
                  x={(width / 2) - 14}
                  y={-(height / 2) + 12}
                  width="7"
                  height="7"
                  fill={colors.stroke}
                  className={module.status === 'critical' ? 'animate-ping' : ''}
                />
                <rect
                  x={(width / 2) - 14}
                  y={-(height / 2) + 12}
                  width="7"
                  height="7"
                  fill={colors.stroke}
                />
              </g>
            );
          })}
        </svg>

        {/* Hovered Module Deep Diagnostics Floating Inspector (Sharp Technical Card) */}
        {hoveredModule && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-20 glass-panel bg-slate-900/98 p-3.5 border border-cyan-500/50 shadow-2xl max-w-sm pointer-events-none animate-in fade-in">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="p-1 bg-cyan-950 text-cyan-300">
                  {getCategoryIcon(hoveredModule.category)}
                </span>
                <span className="text-xs font-bold text-white">{hoveredModule.name}</span>
              </div>
              <span className={`text-[9.5px] font-mono px-2 py-0.5 border uppercase ${getStatusColor(hoveredModule.status).badge}`}>
                {hoveredModule.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">{hoveredModule.description}</p>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono bg-slate-950 p-2 border border-slate-800">
              <div>
                <span className="text-slate-400 block">HEALTH</span>
                <span className="text-emerald-400 font-bold text-xs">{hoveredModule.health}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">TEMP</span>
                <span className="text-cyan-300 font-bold text-xs">{hoveredModule.temperature}°C</span>
              </div>
              <div>
                <span className="text-slate-400 block">LOAD</span>
                <span className="text-amber-300 font-bold text-xs">{hoveredModule.powerDrawKw} kW</span>
              </div>
            </div>

            <div className="text-[9.5px] text-cyan-400 font-mono mt-1.5 flex items-center gap-1 font-semibold">
              <Crosshair className="w-3 h-3" />
              <span>CLICK TO ENGAGE REMOTE ACTUATOR OVERRIDES</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Polar Telemetry Mesh: Reduced line noise • Active node focus enabled</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span>Active Nodes: {filteredModules.length}</span>
        </div>
      </div>
    </div>
  );
};
