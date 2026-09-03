import React from 'react';
import { Network, CheckCircle2, AlertTriangle, RefreshCw, Server } from 'lucide-react';

export const IntegrationMonitor: React.FC = () => {
  const apis = [
    { name: 'Meebhoomi Land Records API', dept: 'Revenue Department', status: 'ONLINE', latency: '42 ms', synced: '14,250', failed: 0 },
    { name: 'CARD Deed Registration API', dept: 'Registration & Stamps', status: 'ONLINE', latency: '58 ms', synced: '8,920', failed: 2 },
    { name: 'VMRDA Master Plan API', dept: 'Urban Development', status: 'ONLINE', latency: '65 ms', synced: '4,310', failed: 0 },
    { name: 'CDMA Property Tax API', dept: 'Municipal Administration', status: 'ONLINE', latency: '38 ms', synced: '19,800', failed: 1 },
    { name: 'APEPDCL Utility API', dept: 'Energy & Water Board', status: 'ONLINE', latency: '72 ms', synced: '12,400', failed: 0 },
    { name: 'E-Courts Judicial Litigation API', dept: 'Law & Justice', status: 'DEGRADED', latency: '240 ms', synced: '1,850', failed: 14 }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <Network className="w-6 h-6 text-emerald-400" />
            <span>Interoperability & Integration Gateway Monitor</span>
          </h1>
          <p className="text-xs text-slate-400">Live Status & Sync Latency across Independent Departmental REST APIs</p>
        </div>
        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Refresh API Gateway</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apis.map((api) => (
          <div key={api.name} className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-slate-100">{api.name}</h3>
                <p className="text-xs text-slate-400">{api.dept}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                api.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {api.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
              <div><span className="text-slate-400">Latency:</span> <p className="font-mono text-emerald-400 font-bold">{api.latency}</p></div>
              <div><span className="text-slate-400">Synced Today:</span> <p className="font-bold text-slate-200">{api.synced}</p></div>
              <div><span className="text-slate-400">Failed Req:</span> <p className={api.failed > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>{api.failed}</p></div>
              <div><span className="text-slate-400">Canonical Mapping:</span> <p className="text-emerald-400 font-bold">ULPIN Active</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
