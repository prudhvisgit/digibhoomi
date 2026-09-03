import React, { useEffect, useState } from 'react';
import { FolderGit2, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { DataAnomaly } from '../types';
import { fetchAnomalies } from '../services/api';

export const DataQualityDashboard: React.FC = () => {
  const [anomalies, setAnomalies] = useState<DataAnomaly[]>([]);

  useEffect(() => {
    fetchAnomalies().then(setAnomalies);
  }, []);

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <FolderGit2 className="w-6 h-6 text-emerald-400" />
            <span>AI Data Quality & Anomaly Detection Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400">Automated Cross-Validation between RoR Adangal, Registration Deeds & PostGIS Geometry</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <p className="text-[11px] text-slate-400 font-medium">Overall Data Quality Score</p>
          <p className="text-xl font-black text-emerald-400">94.2%</p>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200">Detected Record Anomalies ({anomalies.length})</h2>
        {anomalies.map((anom) => (
          <div key={anom.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-start text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-emerald-400">{anom.ulpin}</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold text-[10px] border border-rose-500/30">
                  {anom.type}
                </span>
              </div>
              <p className="text-slate-300">{anom.description}</p>
              <p className="text-slate-500 text-[11px]">Detected At: {new Date(anom.detectedAt).toLocaleString()}</p>
            </div>
            <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-slate-200 rounded-lg">
              Create Officer Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
