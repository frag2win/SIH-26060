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
      const istDate = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      setTimeIst(istDate.toUTCString().slice(17, 25) + ' IST');
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
    <header className="border-b border-neutral-800 light:border-neutral-300 bg-black dark:bg-black light:bg-white sticky top-0 z-40 transition-colors">
      {/* Polar Industrial Accent Rule */}
      <div className="h-0.5 w-full bg-neutral-800 light:bg-neutral-300 flex">
        <div className="w-1/3 bg-white light:bg-black"></div>
        <div className="w-1/3 bg-[#f97316]"></div>
        <div className="w-1/3 bg-neutral-700 light:bg-neutral-400"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Ministry Branding & Project Title (Black & White + Industrial Amber Accent) */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 bg-black dark:bg-black light:bg-white border-2 border-white dark:border-white light:border-black text-white dark:text-white light:text-black">
            <Radio className="w-4 h-4" />
            {overallStatus !== 'nominal' && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full bg-[#f97316] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 bg-[#f97316]"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] tracking-widest font-mono uppercase px-1.5 py-0.2 bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white font-black">
                MoES • NCPOR
              </span>
              <span className="text-[9px] tracking-wider font-mono uppercase px-1.5 py-0.2 border border-[#f97316]/60 text-[#f97316] font-bold">
                SIH PS 26060
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white dark:text-white light:text-black flex items-center gap-1.5 font-mono">
              <span>PRITHVI-TWIN</span>
              <span className="text-[#f97316] font-mono text-xs">::</span>
              <span className="text-neutral-400 light:text-neutral-600 text-xs font-normal">ANTARCTIC NOC</span>
            </h1>
          </div>
        </div>

        {/* Center: Station Switcher (High Contrast Inverted Buttons) */}
        <div className="flex items-center gap-1 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 p-0.5 border border-neutral-800 light:border-neutral-300">
          <button
            onClick={() => handleStationChange('bharati')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold transition-all ${
              currentStation === 'bharati'
                ? 'bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white'
                : 'text-neutral-400 hover:text-white light:hover:text-black'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <div className="text-left leading-tight">
              <div>BHARATI</div>
              <div className="text-[8.5px] opacity-75">69°24′S 76°11′E</div>
            </div>
          </button>

          <button
            onClick={() => handleStationChange('maitri')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold transition-all ${
              currentStation === 'maitri'
                ? 'bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white'
                : 'text-neutral-400 hover:text-white light:hover:text-black'
            }`}
          >
            <Compass className="w-3 h-3" />
            <div className="text-left leading-tight">
              <div>MAITRI</div>
              <div className="text-[8.5px] opacity-75">70°46′S 11°44′E</div>
            </div>
          </button>
        </div>

        {/* Center-Right: Tri-Clock Display */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 text-[11px] font-mono">
          <Clock className="w-3.5 h-3.5 text-neutral-400 light:text-neutral-600" />
          <div className="text-neutral-200 dark:text-neutral-200 light:text-black font-bold">{mounted ? timeStation : '00:00 LOCAL'}</div>
          <span className="text-neutral-600 light:text-neutral-400">|</span>
          <div className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600">{mounted ? timeUtc : '00:00 UTC'}</div>
          <span className="text-neutral-600 light:text-neutral-400">|</span>
          <div className="text-white dark:text-white light:text-black font-black">{mounted ? timeIst : '00:00 IST'}</div>
        </div>

        {/* Right: Actions, Simulation Controls & Theme Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Quick Scenario Injector */}
          <button
            onClick={() => {
              playTacticalBlip(700, 50);
              onOpenScenarioModal();
            }}
            className="flex items-center gap-1 px-3 py-1.5 border border-white dark:border-white light:border-black text-white dark:text-white light:text-black text-xs font-mono font-bold transition-all hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black light:hover:bg-black light:hover:text-white uppercase"
            title="Inject Crisis Scenarios for SIH Presentation"
          >
            <Sliders className="w-3.5 h-3.5" />
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
                ? 'border-white text-white dark:border-white dark:text-white light:border-black light:text-black'
                : 'border-neutral-600 text-neutral-500 bg-neutral-900'
            }`}
            title={isStreaming ? 'Pause live telemetry feed' : 'Resume live telemetry feed'}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Stream Speed Selector */}
          <div className="flex items-center bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 p-0.5 text-[10px] font-mono">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  playTacticalBlip(800, 40);
                  onSetStreamSpeed(spd);
                }}
                className={`px-1.5 py-0.5 transition-all font-bold ${
                  streamSpeed === spd
                    ? 'bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white'
                    : 'text-neutral-400 hover:text-white light:hover:text-black'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="p-1.5 border border-neutral-800 light:border-neutral-300 text-neutral-300 light:text-neutral-700 hover:border-white light:hover:border-black transition-all"
            title={muted ? 'Unmute tactical audio' : 'Mute audio alerts'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-neutral-600" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Toggle (Strictly Black / White) */}
          <button
            onClick={() => {
              playTacticalBlip(650, 40);
              onToggleTheme();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black dark:bg-black light:bg-white border-2 border-white dark:border-white light:border-black text-xs font-mono font-black transition-all hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black light:hover:bg-black light:hover:text-white"
            title={isDarkTheme ? 'Switch to Pure White Mode' : 'Switch to Pure Black Mode'}
          >
            {isDarkTheme ? (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">BLACK</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">WHITE</span>
              </>
            )}
          </button>

          {/* SIH Pitch Guide Modal */}
          <button
            onClick={() => {
              playTacticalBlip(920, 70);
              onOpenPitchTour();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white text-xs font-mono font-black transition-all hover:opacity-85 uppercase"
            title="Open Pitch Tour Guide for Judges"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">SIH Tour</span>
          </button>
        </div>
      </div>

      {/* Domain Navigation Tabs Bar (Monochrome Underline) */}
      <div className="border-t border-neutral-800 light:border-neutral-300 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-0 overflow-x-auto scrollbar-none font-mono">
          {domainTabs.map((tab) => {
            const isActive = activeDomain === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playTacticalBlip(780, 40);
                  onSelectDomain(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-white dark:border-white light:border-black text-white dark:text-white light:text-black bg-neutral-900 dark:bg-neutral-900 light:bg-neutral-200'
                    : 'border-transparent text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-white light:hover:text-black'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
