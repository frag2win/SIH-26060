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
}

export const IncidentLogs: React.FC<IncidentLogsProps> = ({
  alerts,
  currentStation,
  onClearAlerts,
  onResolveAlert
}) => {
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

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="glass-panel p-5 border border-cyan-500/25">
      {/* Header & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800 light:border-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <span>National Polar NOC Incident Audit Register</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-300 uppercase">
                MoES Compliance
              </span>
            </h3>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 hover:bg-slate-800 text-slate-200 dark:text-slate-200 light:text-slate-800 border border-slate-800 light:border-slate-300 text-xs font-semibold uppercase transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark All Resolved</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950 dark:bg-cyan-950 light:bg-cyan-100 hover:bg-cyan-900 text-cyan-200 dark:text-cyan-200 light:text-cyan-900 border border-cyan-800 light:border-cyan-300 text-xs font-bold transition-all hover:scale-105 uppercase tracking-wide"
            title="Download Incident Audit Trail in CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with Sharp Boxes */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-0.5 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 p-0.5 border border-slate-800 light:border-slate-300 text-xs font-mono">
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
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident ID, module, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 dark:bg-slate-950 light:bg-white border border-slate-800 light:border-slate-300 pl-8 pr-3 py-1.5 text-xs text-white dark:text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
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
                  ? 'bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border-slate-800/80 light:border-slate-200 opacity-80'
                  : alert.severity === 'critical'
                  ? 'bg-red-950/80 dark:bg-red-950/80 light:bg-red-50 border-red-500 text-red-200 light:text-red-900'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/80 dark:bg-amber-950/80 light:bg-amber-50 border-amber-500 text-amber-200 light:text-amber-900'
                  : 'bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border-cyan-900/40 light:border-slate-300 text-slate-200 dark:text-slate-200 light:text-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-black">
                      [{alert.id}]
                    </span>
                    <span className="font-bold text-white dark:text-white light:text-slate-900">{alert.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-500">
                      • {alert.sourceModule}
                    </span>
                  </div>
                  <p className="text-slate-200 dark:text-slate-200 light:text-slate-700 leading-relaxed text-[11.5px]">{alert.message}</p>
                  {alert.mitigationProtocol && (
                    <div className="mt-1 text-[10px] font-mono text-amber-300 dark:text-amber-300 light:text-amber-800 bg-amber-950/50 dark:bg-amber-950/50 light:bg-amber-100 px-2 py-0.5 border border-amber-800/50 light:border-amber-300 inline-block font-semibold">
                      SOP: {alert.mitigationProtocol}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Resolve action */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(alert.timestamp).toTimeString().slice(0, 8)}
                </span>

                {alert.resolved ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 light:bg-emerald-100 light:text-emerald-900 border border-emerald-800 font-bold uppercase">
                    <CheckCircle className="w-3 h-3" />
                    RESOLVED
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      playSuccessChime();
                      onResolveAlert(alert.id);
                    }}
                    className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 text-slate-200 dark:text-slate-200 light:text-slate-800 border border-slate-700 light:border-slate-300 font-bold uppercase transition-colors"
                  >
                    <span>Acknowledge</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-400 font-mono text-xs">
            No incident alerts found matching current filter parameters.
          </div>
        )}
      </div>
    </div>
  );
};
