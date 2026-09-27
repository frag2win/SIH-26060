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
  Filter,
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
        return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20">
      {/* Header & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>National Polar NOC Incident Audit Register</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                MoES Compliance
              </span>
            </h3>
            <p className="text-xs text-slate-400">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark All Resolved</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-800 text-xs font-semibold transition-all hover:scale-105"
            title="Download Incident Audit Trail in CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
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
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                filterSeverity === f.id
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident ID, module, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Alerts Chronology List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border transition-all text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                alert.resolved
                  ? 'bg-slate-950/50 border-slate-800/80 opacity-75'
                  : alert.severity === 'critical'
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                  : 'bg-slate-950/70 border-cyan-900/40 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">
                      [{alert.id}]
                    </span>
                    <span className="font-bold text-white">{alert.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      • {alert.sourceModule}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11.5px]">{alert.message}</p>
                  {alert.mitigationProtocol && (
                    <div className="mt-1 text-[10px] font-mono text-amber-300/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 inline-block">
                      SOP: {alert.mitigationProtocol}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Resolve action */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(alert.timestamp).toTimeString().slice(0, 8)}
                </span>

                {alert.resolved ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <CheckCircle className="w-3 h-3" />
                    RESOLVED
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      playSuccessChime();
                      onResolveAlert(alert.id);
                    }}
                    className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <span>Acknowledge</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            No incident alerts found matching current filter parameters.
          </div>
        )}
      </div>
    </div>
  );
};
