'use client';

import React, { useState, useEffect } from 'react';
import { StationId, CommandDomain } from '@/types/telemetry';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  HelpCircle, 
  Play, 
  Pause, 
  Compass, 
  Clock, 
  MapPin, 
  Sliders,
  Layers,
  Zap,
  CloudSnow,
  Fuel,
  BrainCircuit
} from 'lucide-react';
import { playTacticalBlip, setSoundMuted, getSoundMuted } from '@/utils/audioAlerts';

interface HeaderProps {
  currentStation: StationId;
  onSelectStation: (station: StationId) => void;
  activeDomain: CommandDomain;
  onSelectDomain: (domain: CommandDomain) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  streamSpeed: number;
  onSetStreamSpeed: (speed: number) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenPitchTour: () => void;
  onOpenScenarioModal: () => void;
  overallStatus: 'nominal' | 'warning' | 'critical' | 'offline';
  healthScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStation,
  onSelectStation,
  activeDomain,
  onSelectDomain,
  isStreaming,
  onToggleStreaming,
  streamSpeed,
  onSetStreamSpeed,
  isDarkTheme,
  onToggleTheme,
  onOpenPitchTour,
  onOpenScenarioModal,
  overallStatus,
  healthScore
}) => {
  const [muted, setMuted] = useState(false);
  const [timeUtc, setTimeUtc] = useState('');
  const [timeStation, setTimeStation] = useState('');
  const [timeIst, setTimeIst] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMuted(getSoundMuted());
    const updateClocks = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');

      // IST is UTC+5:30
      const istDate = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      setTimeIst(istDate.toUTCString().slice(17, 25) + ' IST');

      // Station local time: Bharati is approx UTC+5, Maitri is approx UTC+0
      const stationOffset = currentStation === 'bharati' ? 5 : 0;
      const stationDate = new Date(now.getTime() + (stationOffset * 60 * 60 * 1000));
      setTimeStation(stationDate.toUTCString().slice(17, 25) + ' LOCAL');
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [currentStation]);

  const handleMuteToggle = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setSoundMuted(nextMuted);
    if (!nextMuted) playTacticalBlip(600, 60);
  };

  const handleStationChange = (st: StationId) => {
    playTacticalBlip(880, 80);
    onSelectStation(st);
  };

  const domainTabs: { id: CommandDomain; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Executive NOC', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'twin', label: 'Digital Twin', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'energy', label: 'Energy & Power', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'environment', label: 'Environment', icon: <CloudSnow className="w-3.5 h-3.5" /> },
    { id: 'logistics', label: 'Logistics Runway', icon: <Fuel className="w-3.5 h-3.5" /> },
    { id: 'ai_audit', label: 'AI Mission Overseer', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="border-b border-cyan-500/25 dark:border-cyan-500/25 light:border-slate-300 bg-slate-950/95 dark:bg-slate-950/95 light:bg-white backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Indian National Tricolor Accent Ribbon */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" title="Saffron - Strength & Courage"></div>
        <div className="flex-1 bg-white" title="White - Peace & Truth"></div>
        <div className="flex-1 bg-[#138808]" title="Green - Fertility & Growth"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Ministry Branding & Project Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-cyan-600 to-blue-900 border border-cyan-400/50 shadow-md">
            <Radio className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full ${overallStatus === 'critical' ? 'bg-red-400' : overallStatus === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex h-2.5 w-2.5 ${overallStatus === 'critical' ? 'bg-red-500' : overallStatus === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] tracking-widest font-mono uppercase px-1.5 py-0.2 bg-cyan-950 text-cyan-300 dark:bg-cyan-950 dark:text-cyan-300 light:bg-cyan-100 light:text-cyan-900 border border-cyan-800 light:border-cyan-300 font-bold">
                MoES • NCPOR
              </span>
              <span className="text-[9px] tracking-wider font-mono uppercase px-1.5 py-0.2 bg-amber-950 text-amber-300 dark:bg-amber-950 dark:text-amber-300 light:bg-amber-100 light:text-amber-900 border border-amber-800/80 light:border-amber-300 font-bold">
                SIH PS 26060
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white dark:text-white light:text-slate-900 flex items-center gap-1.5">
              <span>PRITHVI-TWIN</span>
              <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-mono text-xs font-normal">:: Antarctic NOC</span>
            </h1>
          </div>
        </div>

        {/* Center: Station Switcher with Sharp Technical Boxes */}
        <div className="flex items-center gap-1 bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 p-1 border border-cyan-500/25 light:border-slate-300 shadow-inner">
          <button
            onClick={() => handleStationChange('bharati')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-all ${
              currentStation === 'bharati'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800 light:hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3 h-3 text-cyan-200" />
            <div className="text-left leading-tight">
              <div className="font-bold text-[11px]">BHARATI</div>
              <div className="text-[8.5px] font-mono opacity-85">69°24′S 76°11′E</div>
            </div>
          </button>

          <button
            onClick={() => handleStationChange('maitri')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-all ${
              currentStation === 'maitri'
                ? 'bg-cyan-600 text-white font-bold shadow-sm'
                : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800 light:hover:bg-slate-200'
            }`}
          >
            <Compass className="w-3 h-3 text-cyan-200" />
            <div className="text-left leading-tight">
              <div className="font-bold text-[11px]">MAITRI</div>
              <div className="text-[8.5px] font-mono opacity-85">70°46′S 11°44′E</div>
            </div>
          </button>
        </div>

        {/* Center-Right: Tri-Clock Display */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-[11px] font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-400 light:text-cyan-700" />
          <div className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-semibold">{mounted ? timeStation : '00:00 LOCAL'}</div>
          <span className="text-slate-600 light:text-slate-400">|</span>
          <div className="text-slate-400 dark:text-slate-400 light:text-slate-600">{mounted ? timeUtc : '00:00 UTC'}</div>
          <span className="text-slate-600 light:text-slate-400">|</span>
          <div className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-bold">{mounted ? timeIst : '00:00 IST'}</div>
        </div>

        {/* Right: Actions, Simulation Controls & Theme Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Quick Scenario Injector */}
          <button
            onClick={() => {
              playTacticalBlip(700, 50);
              onOpenScenarioModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 dark:text-amber-300 light:text-amber-800 border border-amber-500/40 text-xs font-bold transition-all hover:scale-105 uppercase tracking-wide"
            title="Inject Crisis Scenarios for SIH Presentation"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400 dark:text-amber-400 light:text-amber-700" />
            <span className="hidden sm:inline">Simulate Crisis</span>
          </button>

          {/* Stream Pause/Play */}
          <button
            onClick={() => {
              playTacticalBlip(500, 50);
              onToggleStreaming();
            }}
            className={`p-1.5 border transition-all ${
              isStreaming
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/70 border-red-500/50 text-red-300'
            }`}
            title={isStreaming ? 'Pause live telemetry feed' : 'Resume live telemetry feed'}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Stream Speed Selector */}
          <div className="flex items-center bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 p-0.5 text-[10px] font-mono">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  playTacticalBlip(800, 40);
                  onSetStreamSpeed(spd);
                }}
                className={`px-1.5 py-0.5 transition-all ${
                  streamSpeed === spd
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className={`p-1.5 border transition-all ${
              muted
                ? 'bg-slate-900 border-slate-800 text-slate-500'
                : 'bg-slate-900 border-cyan-500/40 text-cyan-400 hover:bg-cyan-950'
            }`}
            title={muted ? 'Unmute tactical audio' : 'Mute audio alerts'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Toggle (Black / White) */}
          <button
            onClick={() => {
              playTacticalBlip(650, 40);
              onToggleTheme();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs font-mono font-bold transition-all hover:scale-105"
            title={isDarkTheme ? 'Switch to Crisp White Ops Theme' : 'Switch to Tactical Black NOC Theme'}
          >
            {isDarkTheme ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline text-[10px] text-amber-300 font-bold">BLACK NOC</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline text-[10px] text-blue-800 font-bold">WHITE OPS</span>
              </>
            )}
          </button>

          {/* SIH Pitch Guide Modal */}
          <button
            onClick={() => {
              playTacticalBlip(920, 70);
              onOpenPitchTour();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all hover:scale-105 uppercase tracking-wide"
            title="Open Pitch Tour Guide for Judges"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden md:inline">SIH Tour</span>
          </button>
        </div>
      </div>

      {/* Domain Navigation Tabs Bar (Clearly Differentiated as Active Tabs) */}
      <div className="border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 bg-slate-950 dark:bg-slate-950 light:bg-slate-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto scrollbar-none">
          {domainTabs.map((tab) => {
            const isActive = activeDomain === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playTacticalBlip(780, 40);
                  onSelectDomain(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-400 dark:text-cyan-300 light:text-cyan-700 bg-cyan-950/40 dark:bg-cyan-950/50 light:bg-cyan-100/60 font-bold shadow-sm'
                    : 'border-transparent text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-900/40 light:hover:bg-slate-200/50'
                }`}
              >
                <span className={isActive ? 'text-cyan-400 dark:text-cyan-300 light:text-cyan-700' : 'text-slate-500 dark:text-slate-500 light:text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
