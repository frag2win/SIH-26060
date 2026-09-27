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
    <header className={`border-b sticky top-0 z-40 transition-colors ${
      isDarkTheme ? 'border-neutral-800 bg-black text-white' : 'border-neutral-300 bg-white text-black'
    }`}>
      {/* Polar Industrial Accent Rule */}
      <div className={`h-0.5 w-full flex ${isDarkTheme ? 'bg-neutral-800' : 'bg-neutral-300'}`}>
        <div className={`w-1/3 ${isDarkTheme ? 'bg-white' : 'bg-black'}`}></div>
        <div className="w-1/3 bg-[#f97316]"></div>
        <div className={`w-1/3 ${isDarkTheme ? 'bg-neutral-700' : 'bg-neutral-400'}`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Ministry Branding & Project Title */}
        <div className="flex items-center gap-3">
          <div className={`relative flex items-center justify-center w-8 h-8 border-2 ${
            isDarkTheme ? 'bg-black border-white text-white' : 'bg-white border-black text-black'
          }`}>
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
              <span className={`text-[9px] tracking-widest font-mono uppercase px-1.5 py-0.5 font-black ${
                isDarkTheme ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                MoES • NCPOR
              </span>
              <span className="text-[9px] tracking-wider font-mono uppercase px-1.5 py-0.5 border border-[#f97316]/60 text-[#f97316] font-bold">
                SIH PS 26060
              </span>
            </div>
            <h1 className={`text-sm font-bold tracking-tight flex items-center gap-1.5 font-mono ${
              isDarkTheme ? 'text-white' : 'text-black'
            }`}>
              <span>PRITHVI-TWIN</span>
              <span className="text-[#f97316] font-mono text-xs">::</span>
              <span className={`text-xs font-normal ${isDarkTheme ? 'text-neutral-400' : 'text-neutral-600'}`}>ANTARCTIC NOC</span>
            </h1>
          </div>
        </div>

        {/* Center: Station Switcher */}
        <div className={`flex items-center gap-1 p-0.5 border ${
          isDarkTheme ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
        }`}>
          <button
            onClick={() => handleStationChange('bharati')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold transition-all ${
              currentStation === 'bharati'
                ? isDarkTheme ? 'bg-white text-black' : 'bg-black text-white'
                : isDarkTheme ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
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
                ? isDarkTheme ? 'bg-white text-black' : 'bg-black text-white'
                : isDarkTheme ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
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
        <div className={`hidden lg:flex items-center gap-2.5 px-3 py-1.5 border text-[11px] font-mono ${
          isDarkTheme ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-neutral-100 border-neutral-300 text-neutral-800'
        }`}>
          <Clock className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-neutral-400' : 'text-neutral-600'}`} />
          <div className="font-bold">{mounted ? timeStation : '00:00 LOCAL'}</div>
          <span className="opacity-40">|</span>
          <div className={isDarkTheme ? 'text-neutral-400' : 'text-neutral-600'}>{mounted ? timeUtc : '00:00 UTC'}</div>
          <span className="opacity-40">|</span>
          <div className={`font-black ${isDarkTheme ? 'text-white' : 'text-black'}`}>{mounted ? timeIst : '00:00 IST'}</div>
        </div>

        {/* Right: Actions, Simulation Controls & Theme Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Quick Scenario Injector */}
          <button
            onClick={() => {
              playTacticalBlip(700, 50);
              onOpenScenarioModal();
            }}
            className={`flex items-center gap-1 px-3 py-1.5 border text-xs font-mono font-bold transition-all uppercase ${
              isDarkTheme 
                ? 'border-white text-white hover:bg-white hover:text-black' 
                : 'border-black text-black hover:bg-black hover:text-white'
            }`}
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
                ? isDarkTheme ? 'border-white text-white' : 'border-black text-black'
                : isDarkTheme ? 'border-neutral-700 text-neutral-500 bg-neutral-900' : 'border-neutral-300 text-neutral-400 bg-neutral-100'
            }`}
            title={isStreaming ? 'Pause live telemetry feed' : 'Resume live telemetry feed'}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Stream Speed Selector */}
          <div className={`flex items-center border p-0.5 text-[10px] font-mono ${
            isDarkTheme ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
          }`}>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  playTacticalBlip(800, 40);
                  onSetStreamSpeed(spd);
                }}
                className={`px-1.5 py-0.5 transition-all font-bold ${
                  streamSpeed === spd
                    ? isDarkTheme ? 'bg-white text-black' : 'bg-black text-white'
                    : isDarkTheme ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
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
              isDarkTheme 
                ? 'border-neutral-800 text-neutral-300 hover:border-white' 
                : 'border-neutral-300 text-neutral-700 hover:border-black'
            }`}
            title={muted ? 'Unmute tactical audio' : 'Mute audio alerts'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 opacity-50" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Toggle (Strictly Black / White) */}
          <button
            onClick={() => {
              playTacticalBlip(650, 40);
              onToggleTheme();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border-2 text-xs font-mono font-black transition-all ${
              isDarkTheme 
                ? 'bg-black border-white text-white hover:bg-white hover:text-black' 
                : 'bg-white border-black text-black hover:bg-black hover:text-white'
            }`}
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
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-black transition-all uppercase ${
              isDarkTheme ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
            }`}
            title="Open Pitch Tour Guide for Judges"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">SIH Tour</span>
          </button>
        </div>
      </div>

      {/* Domain Navigation Tabs Bar */}
      <div className={`border-t px-4 sm:px-6 ${
        isDarkTheme ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-neutral-100'
      }`}>
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
                    ? isDarkTheme 
                      ? 'border-white text-white bg-neutral-900' 
                      : 'border-black text-black bg-neutral-200'
                    : isDarkTheme 
                      ? 'border-transparent text-neutral-400 hover:text-white' 
                      : 'border-transparent text-neutral-600 hover:text-black'
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
