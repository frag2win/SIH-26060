'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StationId, 
  StationTelemetry, 
  StationModule, 
  ScenarioPreset, 
  IncidentAlert, 
  AiPrediction,
  CommandDomain
} from '@/types/telemetry';
import { INITIAL_BHARATI_TELEMETRY, INITIAL_MAITRI_TELEMETRY } from '@/data/stationData';
import { Header } from '@/components/Header';
import { StationOverview } from '@/components/StationOverview';
import { StationMap } from '@/components/StationMap';
import { TelemetryGrid } from '@/components/TelemetryGrid';
import { PredictiveAiFeed } from '@/components/PredictiveAiFeed';
import { IncidentLogs } from '@/components/IncidentLogs';
import { ModuleDetailModal } from '@/components/ModuleDetailModal';
import { ScenarioSimulator } from '@/components/ScenarioSimulator';
import { PitchTourModal } from '@/components/PitchTourModal';
import { EnergyView } from '@/components/views/EnergyView';
import { EnvironmentView } from '@/components/views/EnvironmentView';
import { LogisticsView } from '@/components/views/LogisticsView';
import { playAlarmKlaxon, playWarningSound, playSuccessChime, playTacticalBlip } from '@/utils/audioAlerts';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentStation, setCurrentStation] = useState<StationId>('bharati');
  const [activeDomain, setActiveDomain] = useState<CommandDomain>('overview');
  const [telemetry, setTelemetry] = useState<StationTelemetry>(INITIAL_BHARATI_TELEMETRY);
  const [alerts, setAlerts] = useState<IncidentAlert[]>([]);
  const [activeScenario, setActiveScenario] = useState<ScenarioPreset>('nominal');
  const [selectedModule, setSelectedModule] = useState<StationModule | null>(null);

  // Streaming & Simulation state
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isMitigating, setIsMitigating] = useState(false);

  // Modals state
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isPitchTourOpen, setIsPitchTourOpen] = useState(false);

  // AI Prediction state
  const [aiPrediction, setAiPrediction] = useState<AiPrediction | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Track previous status to play audio cues on transitions
  const prevStatusRef = useRef<'nominal' | 'warning' | 'critical' | 'offline'>('nominal');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('moes_theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('moes_theme', next ? 'dark' : 'light');
      }
      return next;
    });
  };

  // Fetch telemetry tick from serverless API
  const fetchTelemetry = useCallback(async (stationId: StationId, scenario?: ScenarioPreset) => {
    try {
      const url = `/api/telemetry?station=${stationId}${scenario ? `&scenario=${scenario}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data.telemetry);
        setAlerts(data.alerts);
        if (data.activeScenario) {
          setActiveScenario(data.activeScenario);
        }

        // Check if status elevated to trigger sound
        const newStatus = data.telemetry.overallStatus;
        if (newStatus !== prevStatusRef.current) {
          if (newStatus === 'critical') {
            playAlarmKlaxon();
          } else if (newStatus === 'warning') {
            playWarningSound();
          }
          prevStatusRef.current = newStatus;
        }
      }
    } catch {
      setTelemetry((prev) => ({
        ...prev,
        timestamp: new Date().toISOString()
      }));
    }
  }, []);

  // Fetch AI prediction
  const fetchAiPrediction = useCallback(async (customKey?: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telemetry,
          apiKey: customKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiPrediction(data.prediction);
      }
    } catch (err) {
      console.warn('AI analysis failed:', err);
    } finally {
      setIsAiLoading(false);
    }
  }, [telemetry]);

  // Initial load
  useEffect(() => {
    fetchTelemetry(currentStation);
  }, [currentStation, fetchTelemetry]);

  // Initial AI Prediction run once telemetry is available
  useEffect(() => {
    if (telemetry && !aiPrediction) {
      fetchAiPrediction();
    }
  }, [telemetry, aiPrediction, fetchAiPrediction]);

  // Polling stream interval
  useEffect(() => {
    if (!isStreaming) return;
    const intervalMs = Math.max(800, 3000 / streamSpeed);

    const interval = setInterval(() => {
      fetchTelemetry(currentStation);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed, currentStation, fetchTelemetry]);

  // Station switch handler
  const handleSelectStation = (newStation: StationId) => {
    setCurrentStation(newStation);
    setSelectedModule(null);
    fetchTelemetry(newStation);
    setTimeout(() => {
      fetchAiPrediction();
    }, 400);
  };

  // Scenario injection handler
  const handleSelectScenario = async (scenario: ScenarioPreset) => {
    setActiveScenario(scenario);
    try {
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: currentStation,
          action: 'set_scenario',
          scenario
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTelemetry(data.telemetry);
        setAlerts(data.alerts);
        setTimeout(() => {
          fetchAiPrediction();
        }, 300);
      }
    } catch (err) {
      console.error('Failed to inject scenario:', err);
    }
  };

  // Auto-mitigation handler
  const handleAutoMitigate = async () => {
    setIsMitigating(true);
    playTacticalBlip(900, 50);

    try {
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: currentStation,
          action: 'auto_mitigate'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTelemetry(data.telemetry);
        setAlerts(data.alerts);
        setActiveScenario('nominal');
        playSuccessChime();
        setTimeout(() => {
          fetchAiPrediction();
        }, 500);
      }
    } catch (err) {
      console.error('Mitigation failed:', err);
    } finally {
      setIsMitigating(false);
    }
  };

  // Clear alerts
  const handleClearAlerts = async () => {
    try {
      const res = await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: currentStation,
          action: 'clear_alerts'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts);
      }
    } catch {
      setAlerts((prev) => prev.map((a) => ({ ...a, resolved: true })));
    }
  };

  // Resolve single alert
  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  // Quick launch for pitch demo
  const handleLaunchPitchDemo = () => {
    handleSelectScenario('gen1_overheat');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkTheme ? 'bg-[#020610] text-slate-100' : 'light-theme bg-slate-100 text-slate-900'}`}>
      {/* 1. Header with branding, station selector, domain tabs, audio & clocks */}
      <Header
        currentStation={currentStation}
        onSelectStation={handleSelectStation}
        activeDomain={activeDomain}
        onSelectDomain={setActiveDomain}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        streamSpeed={streamSpeed}
        onSetStreamSpeed={setStreamSpeed}
        isDarkTheme={isDarkTheme}
        onToggleTheme={handleToggleTheme}
        onOpenPitchTour={() => setIsPitchTourOpen(true)}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        overallStatus={telemetry.overallStatus}
        healthScore={telemetry.healthScore}
      />

      {/* Main Command Dashboard with Sharp Technical Panels */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Dynamic Vitals & Crisis Alert Banner */}
        <StationOverview
          telemetry={telemetry}
          onAutoMitigate={handleAutoMitigate}
          isMitigating={isMitigating}
        />

        {/* DOMAIN 1: EXECUTIVE NOC OVERVIEW (Master View) */}
        {activeDomain === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Interactive 2D Digital Twin Map */}
            <div className="w-full">
              <StationMap
                telemetry={telemetry}
                onSelectModule={setSelectedModule}
                selectedModuleId={selectedModule?.id}
              />
            </div>

            {/* Telemetry Stream Floating Modular Grid */}
            <div className="w-full">
              <TelemetryGrid telemetry={telemetry} />
            </div>

            {/* Gemini AI Autonomous Mission Overseer */}
            <div className="w-full">
              <PredictiveAiFeed
                prediction={aiPrediction}
                isLoading={isAiLoading}
                onRefreshPrediction={fetchAiPrediction}
                onAutoMitigate={handleAutoMitigate}
                isMitigating={isMitigating}
                telemetry={telemetry}
              />
            </div>

            {/* MoES Incident Audit Register */}
            <div className="w-full">
              <IncidentLogs
                alerts={alerts}
                currentStation={currentStation}
                onClearAlerts={handleClearAlerts}
                onResolveAlert={handleResolveAlert}
              />
            </div>
          </div>
        )}

        {/* DOMAIN 2: ARCHITECTURAL DIGITAL TWIN SCHEMATIC & SUBMODULES */}
        {activeDomain === 'twin' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-full">
              <StationMap
                telemetry={telemetry}
                onSelectModule={setSelectedModule}
                selectedModuleId={selectedModule?.id}
              />
            </div>

            {/* Modules Quick-Inspection Matrix with Sharp Boxes */}
            <div className="glass-panel p-5 border border-cyan-500/25">
              <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 mb-1">
                Station Modules Roster & Live Telemetry Sensors
              </h3>
              <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mb-4">
                Click any module card or map node to trigger remote actuator overrides.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {telemetry.modules.map((mod) => (
                  <div
                    key={mod.id}
                    onClick={() => {
                      playTacticalBlip(850, 40);
                      setSelectedModule(mod);
                    }}
                    className={`p-3.5 border cursor-pointer transition-all hover:scale-102 ${
                      mod.status === 'critical'
                        ? 'bg-red-950/80 border-red-500 text-red-200'
                        : mod.status === 'warning'
                        ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                        : 'bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-50 border-slate-800 light:border-slate-300 hover:border-cyan-400 text-slate-200 dark:text-slate-200 light:text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-black uppercase">{mod.id}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 font-black uppercase bg-slate-900 dark:bg-slate-900 light:bg-slate-200 border border-slate-800 light:border-slate-300">
                        {mod.status}
                      </span>
                    </div>
                    <div className="font-bold text-white dark:text-white light:text-slate-900 text-xs mb-1.5">{mod.name}</div>
                    <div className="text-[11px] font-mono flex items-center justify-between text-slate-300 dark:text-slate-300 light:text-slate-600">
                      <span>Health: <strong className="text-emerald-400 dark:text-emerald-300 light:text-emerald-700">{mod.health}%</strong></span>
                      <span>{mod.temperature}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN 3: ENERGY & MICROGRID INTELLIGENCE */}
        {activeDomain === 'energy' && (
          <div className="animate-in fade-in duration-200">
            <EnergyView telemetry={telemetry} onAutoMitigate={handleAutoMitigate} />
          </div>
        )}

        {/* DOMAIN 4: ENVIRONMENTAL & POLAR SENSORS */}
        {activeDomain === 'environment' && (
          <div className="animate-in fade-in duration-200">
            <EnvironmentView telemetry={telemetry} />
          </div>
        )}

        {/* DOMAIN 5: POLAR LOGISTICS & SURVIVAL RUNWAY */}
        {activeDomain === 'logistics' && (
          <div className="animate-in fade-in duration-200">
            <LogisticsView telemetry={telemetry} />
          </div>
        )}

        {/* DOMAIN 6: AI MISSION OVERSEER & COMPLIANCE AUDIT */}
        {activeDomain === 'ai_audit' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <PredictiveAiFeed
              prediction={aiPrediction}
              isLoading={isAiLoading}
              onRefreshPrediction={fetchAiPrediction}
              onAutoMitigate={handleAutoMitigate}
              isMitigating={isMitigating}
              telemetry={telemetry}
            />

            <IncidentLogs
              alerts={alerts}
              currentStation={currentStation}
              onClearAlerts={handleClearAlerts}
              onResolveAlert={handleResolveAlert}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 light:border-slate-300 bg-slate-950/90 light:bg-white py-4 px-4 sm:px-6 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PRITHVI-TWIN • Ministry of Earth Sciences (MoES) & NCPOR • Government of India
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>SIH Problem Statement PS 26060</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">Vercel Serverless Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs (Sharp Corners) */}
      {selectedModule && (
        <ModuleDetailModal
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          stationName={telemetry.stationName}
        />
      )}

      <ScenarioSimulator
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        onAutoMitigate={handleAutoMitigate}
      />

      <PitchTourModal
        isOpen={isPitchTourOpen}
        onClose={() => setIsPitchTourOpen(false)}
        onLaunchDemoScenario={handleLaunchPitchDemo}
      />
    </div>
  );
}
