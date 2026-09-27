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
  isDarkTheme?: boolean;
}

export const StationMap: React.FC<StationMapProps> = ({
  telemetry,
  onSelectModule,
  selectedModuleId,
  isDarkTheme = true
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [hoveredModule, setHoveredModule] = useState<StationModule | null>(null);
  const isDark = isDarkTheme !== false;

  const getStatusColor = (status: SubsystemStatus) => {
    switch (status) {
      case 'critical':
        return {
          stroke: '#f97316',
          fill: isDark ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.12)',
          badge: 'bg-[#f97316] text-black font-black border border-[#f97316]',
          dot: 'bg-[#f97316]',
          pulse: 'pulse-critical'
        };
      case 'warning':
        return {
          stroke: '#f97316',
          fill: isDark ? 'rgba(249, 115, 22, 0.08)' : 'rgba(249, 115, 22, 0.06)',
          badge: isDark ? 'bg-neutral-900 text-[#f97316] border border-[#f97316]' : 'bg-neutral-100 text-[#ea580c] border border-[#ea580c]',
          dot: 'bg-[#f97316]',
          pulse: 'pulse-warning'
        };
      case 'offline':
        return {
          stroke: isDark ? '#404040' : '#d4d4d4',
          fill: isDark ? 'rgba(0, 0, 0, 0.5)' : '#f5f5f5',
          badge: isDark ? 'bg-neutral-950 text-neutral-500 border border-neutral-800' : 'bg-neutral-100 text-neutral-500 border border-neutral-300',
          dot: 'bg-neutral-500',
          pulse: ''
        };
      case 'nominal':
      default:
        return {
          stroke: isDark ? '#737373' : '#000000',
          fill: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
          badge: isDark ? 'bg-black text-neutral-300 border border-neutral-700 font-bold' : 'bg-white text-black border border-neutral-300 font-bold',
          dot: isDark ? 'bg-neutral-400' : 'bg-neutral-600',
          pulse: ''
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'power':
        return <Zap className="w-3.5 h-3.5 text-white" />;
      case 'life_support':
        return <HeartPulse className="w-3.5 h-3.5 text-white" />;
      case 'science':
        return <FlaskConical className="w-3.5 h-3.5 text-white" />;
      case 'comms':
        return <Radio className="w-3.5 h-3.5 text-white" />;
      case 'fuel':
        return <Fuel className="w-3.5 h-3.5 text-white" />;
      case 'logistics':
      default:
        return <Truck className="w-3.5 h-3.5 text-white" />;
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
          <div className={`p-1.5 border ${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}>
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-sm font-bold flex items-center gap-2 font-mono ${isDark ? 'text-white' : 'text-black'}`}>
              <span>Station Architectural Digital Twin</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 uppercase font-bold border ${
                isDark ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-neutral-100 text-neutral-800 border-neutral-300'
              }`}>
                Top-Down Node Graph
              </span>
            </h2>
            <p className={`text-[11px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Interactive 2D schematic • Hover node to isolate • Click for internal diagnostics
            </p>
          </div>
        </div>

        {/* Filter categories with sharp boxes */}
        <div className={`flex items-center gap-1 p-0.5 border text-xs font-mono ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
        }`}>
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
              className={`px-2 py-1 text-[11px] font-bold transition-all ${
                filterCategory === cat.id
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2D Schematic Canvas Container (Sharp Box) */}
      <div className={`relative flex-1 min-h-[400px] w-full border overflow-hidden polar-grid-bg ${
        isDark ? 'bg-black border-neutral-800' : 'bg-neutral-50 border-neutral-300'
      }`}>
        {/* Radar Scanner Sweep Effect */}
        <div className="radar-scanner opacity-25"></div>

        {/* Antarctic Compass & Katabatic Wind Vector Arrow */}
        <div className={`absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1.5 border text-[10px] font-mono shadow-sm ${
          isDark ? 'bg-black/90 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-300 text-black'
        }`}>
          <Wind className={`w-3.5 h-3.5 ${isDark ? 'text-white' : 'text-black'}`} />
          <span>KATABATIC VECTOR: {telemetry.environment.windDirection} ({telemetry.environment.windSpeed} km/h)</span>
        </div>

        {/* Legend (Monochrome) */}
        <div className={`absolute top-3 right-3 z-10 flex items-center gap-2.5 px-2.5 py-1.5 border text-[10px] font-mono shadow-sm ${
          isDark ? 'bg-black/90 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-300 text-black'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 ${isDark ? 'bg-neutral-500' : 'bg-neutral-400'}`}></span>
            <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Nominal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-[#f97316] bg-[#f97316]/20"></span>
            <span className={isDark ? 'text-neutral-200 font-bold' : 'text-black font-bold'}>Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#f97316]"></span>
            <span className={isDark ? 'text-white font-black' : 'text-black font-black'}>Critical</span>
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
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)"} strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Ice Shelf Contours & Bedrock Outcrops */}
          <path 
            d="M 50,550 Q 200,480 350,520 T 700,500 T 950,560" 
            fill="none" 
            stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.15)"} 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />

          {/* Main corridor: Power -> Habitation -> Water -> Radar */}
          <path
            d="M 240,252 L 480,132 L 520,276 L 740,228 L 760,408"
            fill="none"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="2"
            strokeOpacity={isDark ? "0.2" : "0.3"}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Trace heated Fuel lines: Fuel Farm -> Power Generation */}
          <path
            d="M 180,432 L 240,252"
            fill="none"
            stroke={isDark ? "#a3a3a3" : "#525252"}
            strokeWidth="1.5"
            strokeOpacity={isDark ? "0.3" : "0.4"}
            strokeDasharray="4 4"
          />

          {/* Comms Dish Fiber line */}
          <path
            d="M 440,492 L 480,132"
            fill="none"
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth="1.5"
            strokeOpacity={isDark ? "0.2" : "0.3"}
            strokeDasharray="6 3"
          />

          {/* Emergency Bunker safety umbilical */}
          <path
            d="M 520,276 L 880,108"
            fill="none"
            stroke={isDark ? "#737373" : "#737373"}
            strokeWidth="1.5"
            strokeOpacity={isDark ? "0.2" : "0.3"}
            strokeDasharray="4 4"
          />

          {/* Helipad representation (Sharp technical square) */}
          <g transform="translate(120, 100)">
            <rect x="-40" y="-40" width="80" height="80" fill="none" stroke={isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"} strokeWidth="1" strokeDasharray="4 4" />
            <rect x="-28" y="-28" width="56" height="56" fill={isDark ? "rgba(0, 0, 0, 0.8)" : "#ffffff"} stroke={isDark ? "rgba(255, 255, 255, 0.4)" : "#000000"} strokeWidth="1.5" />
            <text x="0" y="8" textAnchor="middle" fill={isDark ? "#ffffff" : "#000000"} fontSize="20" fontWeight="bold" fontFamily="monospace">H</text>
            <text x="0" y="-32" textAnchor="middle" fill={isDark ? "#a3a3a3" : "#525252"} fontSize="8.5" fontFamily="monospace">HELI-PAD LZ-1</text>
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
                    stroke={isDark ? "#ffffff" : "#000000"}
                    strokeWidth="2"
                    strokeDasharray="4 2"
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
                  fill={isDark ? "#a3a3a3" : "#525252"}
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
                  fill={isDark ? "#ffffff" : "#000000"}
                  fontSize="9.5"
                  fontWeight="bold"
                >
                  {module.name.length > 16 ? module.name.slice(0, 15) + '…' : module.name}
                </text>

                {/* Mini Subsystem Telemetry Badge */}
                <text
                  x={-(width / 2) + 8}
                  y={-(height / 2) + 49}
                  fill={isDark ? "#d4d4d4" : "#171717"}
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
                />
              </g>
            );
          })}
        </svg>

        {/* Hovered Module Deep Diagnostics Floating Inspector (Sharp Technical Card) */}
        {hoveredModule && (
          <div className={`absolute bottom-3 left-3 right-3 sm:right-auto z-20 glass-panel p-3.5 border-2 shadow-2xl max-w-sm pointer-events-none animate-in fade-in ${
            isDark ? 'bg-black border-white' : 'bg-white border-black'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`p-1 border ${isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}>
                  {getCategoryIcon(hoveredModule.category)}
                </span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-black'}`}>{hoveredModule.name}</span>
              </div>
              <span className={`text-[9.5px] font-mono px-2 py-0.5 border uppercase ${getStatusColor(hoveredModule.status).badge}`}>
                {hoveredModule.status}
              </span>
            </div>

            <p className={`text-[11px] mb-2 leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{hoveredModule.description}</p>

            <div className={`grid grid-cols-3 gap-2 text-[10px] font-mono p-2 border ${
              isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
            }`}>
              <div>
                <span className={isDark ? 'text-neutral-400 block' : 'text-neutral-500 block'}>HEALTH</span>
                <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-black'}`}>{hoveredModule.health}%</span>
              </div>
              <div>
                <span className={isDark ? 'text-neutral-400 block' : 'text-neutral-500 block'}>TEMP</span>
                <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-black'}`}>{hoveredModule.temperature}°C</span>
              </div>
              <div>
                <span className={isDark ? 'text-neutral-400 block' : 'text-neutral-500 block'}>LOAD</span>
                <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-black'}`}>{hoveredModule.powerDrawKw} kW</span>
              </div>
            </div>

            <div className={`text-[9.5px] font-mono mt-1.5 flex items-center gap-1 font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
              <Crosshair className="w-3 h-3" />
              <span>CLICK TO ENGAGE REMOTE ACTUATOR OVERRIDES</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-neutral-300" />
          <span>Polar Telemetry Mesh: Reduced line noise • Active node focus enabled</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-300">
          <span>Active Nodes: {filteredModules.length}</span>
        </div>
      </div>
    </div>
  );
};
