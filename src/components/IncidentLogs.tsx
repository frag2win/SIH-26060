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
        return <ShieldAlert className="w-4 h-4 text-white shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-neutral-300 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-neutral-400 shrink-0" />;
    }
  };

  return (
    <div className="glass-panel p-5 border border-neutral-800">
      {/* Header & Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-800 light:border-neutral-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-neutral-900 border border-neutral-700 text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white dark:text-white light:text-black flex items-center gap-2 font-mono">
              <span>National Polar NOC Incident Audit Register</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-800 text-neutral-300 uppercase">
                MoES Compliance
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-mono font-semibold uppercase transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Mark All Resolved</span>
          </button>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-neutral-200 border border-white text-xs font-mono font-bold transition-all uppercase tracking-wide"
            title="Download Incident Audit Trail in CSV format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with Sharp Boxes */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-0.5 bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-100 p-0.5 border border-neutral-800 light:border-neutral-300 text-xs font-mono">
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
                  ? 'bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white'
                  : 'text-neutral-400 hover:text-white light:hover:text-black'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident ID, module, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-neutral-800 pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-mono"
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
                  ? 'bg-neutral-950/60 border-neutral-800 opacity-60 text-neutral-400'
                  : alert.severity === 'critical'
                  ? 'bg-white text-black border-2 border-white'
                  : alert.severity === 'warning'
                  ? 'bg-neutral-900 border border-neutral-400 text-white'
                  : 'bg-black border border-neutral-800 text-neutral-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
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
                    <div className="mt-1 text-[10px] font-mono bg-neutral-800 text-white px-2 py-0.5 border border-neutral-700 inline-block font-semibold">
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
                  <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-neutral-900 text-neutral-300 border border-neutral-700 font-bold uppercase">
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
                        ? 'bg-black text-white hover:bg-neutral-800 border-black'
                        : 'bg-neutral-900 hover:bg-white hover:text-black text-white border-neutral-700'
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
