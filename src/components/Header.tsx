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
  Activity,
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

  useEffect(() => {
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
    <header className="border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Indian Tricolor Ribbon */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" title="Saffron - Strength & Courage"></div>
        <div className="flex-1 bg-white" title="White - Peace & Truth"></div>
        <div className="flex-1 bg-[#138808]" title="Green - Fertility & Growth"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Ministry Branding & Project Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-900 border border-cyan-400/40 shadow-lg shadow-cyan-900/30">
            <Radio className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${overallStatus === 'critical' ? 'bg-rose-400' : overallStatus === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${overallStatus === 'critical' ? 'bg-rose-500' : overallStatus === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] tracking-widest font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                MoES • NCPOR
              </span>
              <span className="text-[9px] tracking-wider font-mono uppercase px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 font-semibold">
                SIH PS 26060
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>PRITHVI-TWIN</span>
              <span className="text-cyan-400 font-mono text-xs font-normal">:: Antarctic NOC</span>
            </h1>
          </div>
        </div>

        {/* Center: Station Switcher with Coordinates */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-cyan-500/20 shadow-inner">
          <button
            onClick={() => handleStationChange('bharati')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentStation === 'bharati'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3 h-3 text-cyan-300" />
            <div className="text-left leading-tight">
              <div className="font-semibold text-[11px]">BHARATI</div>
              <div className="text-[8.5px] font-mono opacity-80">69°24′S 76°11′E</div>
            </div>
          </button>

          <button
            onClick={() => handleStationChange('maitri')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              currentStation === 'maitri'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3 h-3 text-cyan-300" />
            <div className="text-left leading-tight">
              <div className="font-semibold text-[11px]">MAITRI</div>
              <div className="text-[8.5px] font-mono opacity-80">70°46′S 11°44′E</div>
            </div>
          </button>
        </div>

        {/* Clocks */}
        <div className="hidden lg:flex items-center gap-2.5 px-2.5 py-1 rounded-lg bg-slate-900/70 border border-slate-800 text-[10.5px] font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <div className="text-slate-300">{timeStation}</div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-400">{timeUtc}</div>
          <span className="text-slate-600">|</span>
          <div className="text-emerald-400 font-semibold">{timeIst}</div>
        </div>

        {/* Right: Actions, Simulation Controls & Presentation Mode */}
        <div className="flex items-center gap-1.5">
          {/* Quick Scenario Injector */}
          <button
            onClick={() => {
              playTacticalBlip(700, 50);
              onOpenScenarioModal();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-105"
            title="Inject Crisis Scenarios for SIH Presentation"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Simulate Crisis</span>
          </button>

          {/* Stream Pause/Play */}
          <button
            onClick={() => {
              playTacticalBlip(500, 50);
              onToggleStreaming();
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              isStreaming
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
            }`}
            title={isStreaming ? 'Pause live telemetry feed' : 'Resume live telemetry feed'}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Stream Speed Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px] font-mono">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  playTacticalBlip(800, 40);
                  onSetStreamSpeed(spd);
                }}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  streamSpeed === spd
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className={`p-1.5 rounded-lg border transition-all ${
              muted
                ? 'bg-slate-900 border-slate-800 text-slate-500'
                : 'bg-slate-900 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950'
            }`}
            title={muted ? 'Unmute tactical audio' : 'Mute audio alerts'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              playTacticalBlip(650, 40);
              onToggleTheme();
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
            title={isDarkTheme ? 'Switch to Light Ops Theme' : 'Switch to Dark NOC Theme'}
          >
            {isDarkTheme ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
          </button>

          {/* SIH Pitch Guide Modal */}
          <button
            onClick={() => {
              playTacticalBlip(920, 70);
              onOpenPitchTour();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition-all hover:scale-105"
            title="Open Pitch Tour Guide for Judges"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden md:inline">SIH Tour</span>
          </button>
        </div>
      </div>

      {/* Domain Navigation Tabs Row */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
          {domainTabs.map((tab) => {
            const isActive = activeDomain === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playTacticalBlip(780, 40);
                  onSelectDomain(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
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
