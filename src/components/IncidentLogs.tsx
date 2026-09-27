'use client';

import React, { useState } from 'react';
import { IncidentAlert, StationId } from '@/types/telemetry';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Search, 
  CheckCheck,
  ShieldAlert
} from 'lucide-react';
import { playTacticalBlip, playSuccessChime } from '@/utils/audioAlerts';

interface IncidentLogsProps {
  alerts: IncidentAlert[];
  currentStation: StationId;
  onClearAlerts: () => void;
  onResolveAlert: (id: string) => void;
  isDarkTheme?: boolean;
}

export const IncidentLogs: React.FC<IncidentLogsProps> = ({
  alerts,
  currentStation,
  onClearAlerts,
  onResolveAlert,
  isDarkTheme = true
}) => {
  const isDark = isDarkTheme;
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.sourceModule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const exportCsv = () => {
    playSuccessChime();
    const headers = ['Incident_ID', 'Timestamp_UTC', 'Station', 'Severity', 'Source_Module', 'Title', 'Message', 'Status'];
    const rows = filteredAlerts.map(a => [
      a.id,
      a.timestamp,
      a.stationId,
      a.severity,
      `"${a.sourceModule}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.message.replace(/"/g, '""')}"`,
      a.resolved ? 'RESOLVED' : 'ACTIVE_INCIDENT'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MoES_Antarctic_Incident_Audit_${currentStation}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityIcon = (sev: string, resolved?: boolean) => {
    if (resolved) {
      return <CheckCircle className={`w-4 h-4 shrink-0 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />;
    }
    switch (sev) {
      case 'critical':
        return <ShieldAlert className={`w-4 h-4 shrink-0 ${isDark ? 'text-white' : 'text-black'}`} />;
      case 'warning':
        return <AlertTriangle className={`w-4 h-4 shrink-0 ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`} />;
      case 'info':
      default:
        return <Info className={`w-4 h-4 shrink-0 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />;
    }
  };

  return (
    <div className="glass-panel p-5 border border-neutral-800">
      {/* Header & Export Actions */}
      <div className={`flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 border ${
            isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-neutral-100 border-neutral-300 text-black'
          }`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 font-mono ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              <span>National Polar NOC Incident Audit Register</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 uppercase border ${
                isDark ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-neutral-100 text-neutral-700 border-neutral-300'
              }`}>
                MoES Compliance
              </span>
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              ISO/IEC 27001 verifiable polar telemetry logging • Real-time event chronology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTacticalBlip(700, 40);
              onClearAlerts();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono font-semibold uppercase transition-colors ${
              isDark 
                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700' 
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
            }`}
          >
            <CheckCheck className={`w-3.5 h-3.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
            <span>Mark All Resolved</span>
          </button>

          <button
            onClick={exportCsv}
            className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono font-bold transition-all uppercase tracking-wide ${
              isDark
                ? 'bg-white text-black hover:bg-neutral-200 border-white'
                : 'bg-black text-white hover:bg-neutral-800 border-black'
            }`}
            title="Download Incident Audit Trail in CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className={`flex items-center gap-0.5 p-0.5 border text-xs font-mono ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
        }`}>
          {[
            { id: 'all', label: 'All Events' },
            { id: 'critical', label: 'Critical' },
            { id: 'warning', label: 'Warnings' },
            { id: 'info', label: 'Operational' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                playTacticalBlip(750, 40);
                setFilterSeverity(f.id);
              }}
              className={`px-3 py-1 text-[11px] font-bold transition-all ${
                filterSeverity === f.id
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`} />
          <input
            type="text"
            placeholder="Search incident ID, module, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border pl-8 pr-3 py-1.5 text-xs font-mono focus:outline-none ${
              isDark
                ? 'bg-black border-neutral-800 text-white placeholder-neutral-500 focus:border-white'
                : 'bg-white border-neutral-300 text-black placeholder-neutral-400 focus:border-black'
            }`}
          />
        </div>
      </div>

      {/* Alerts Chronology List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 border transition-all text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                alert.resolved
                  ? isDark 
                    ? 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 opacity-60' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                  : alert.severity === 'critical'
                  ? isDark
                    ? 'bg-white text-black border-2 border-white'
                    : 'bg-black text-white border-2 border-black'
                  : alert.severity === 'warning'
                  ? isDark
                    ? 'bg-neutral-900 border border-neutral-400 text-white'
                    : 'bg-neutral-100 border border-neutral-400 text-black'
                  : isDark
                  ? 'bg-black border border-neutral-800 text-neutral-200'
                  : 'bg-white border border-neutral-200 text-neutral-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(alert.severity, alert.resolved)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] uppercase font-bold">
                      [{alert.id}]
                    </span>
                    <span className="font-bold font-mono">{alert.title}</span>
                    <span className="text-[10px] font-mono opacity-70">
                      • {alert.sourceModule}
                    </span>
                  </div>
                  <p className="leading-relaxed text-[11.5px] font-mono opacity-90">{alert.message}</p>
                  {alert.mitigationProtocol && (
                    <div className={`mt-1 text-[10px] font-mono px-2 py-0.5 border inline-block font-semibold ${
                      isDark
                        ? 'bg-neutral-800 text-neutral-200 border-neutral-700'
                        : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                    }`}>
                      SOP: {alert.mitigationProtocol}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Resolve action */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-[10px] font-mono opacity-70">
                  {new Date(alert.timestamp).toTimeString().slice(0, 8)}
                </span>

                {alert.resolved ? (
                  <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 border font-bold uppercase ${
                    isDark
                      ? 'bg-neutral-900 text-neutral-300 border-neutral-700'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                    RESOLVED
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      playSuccessChime();
                      onResolveAlert(alert.id);
                    }}
                    className={`flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 font-bold uppercase transition-colors border ${
                      alert.severity === 'critical'
                        ? isDark
                          ? 'bg-black text-white hover:bg-neutral-800 border-black'
                          : 'bg-white text-black hover:bg-neutral-200 border-white'
                        : isDark
                        ? 'bg-neutral-900 hover:bg-white hover:text-black text-white border-neutral-700'
                        : 'bg-black hover:bg-neutral-800 text-white border-black'
                    }`}
                  >
                    <span>Acknowledge</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-neutral-500 font-mono text-xs">
            No incident alerts found matching current filter parameters.
          </div>
        )}
      </div>
    </div>
  );
};

