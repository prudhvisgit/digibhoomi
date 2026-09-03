import React from 'react';
import { ShieldAlert, Users, Network, History, FolderGit2, CheckCircle2 } from 'lucide-react';
import { IntegrationMonitor } from './IntegrationMonitor';
import { DataQualityDashboard } from './DataQualityDashboard';

export const AdminPanelPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            <span>DigiBhoomi DPI Administration & Interoperability Center</span>
          </h1>
          <p className="text-xs text-slate-400">System Configuration, User RBAC Roles, Departmental API Gateway & Audit Logs</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold">
          SUPER_ADMIN SCOPE
        </span>
      </div>

      {/* System Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">PostGIS Geometry Database</p>
          <p className="text-lg font-bold text-emerald-400 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>HEALTHY (500 Polygons)</span>
          </p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Departmental REST APIs</p>
          <p className="text-lg font-bold text-emerald-400 flex items-center space-x-1.5">
            <Network className="w-4 h-4" />
            <span>6 / 6 APIs CONNECTED</span>
          </p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">Security & RBAC Policy</p>
          <p className="text-lg font-bold text-emerald-400 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>DATA ISOLATION ENFORCED</span>
          </p>
        </div>
      </div>

      {/* Integration Monitor Embedded */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden">
        <IntegrationMonitor />
      </div>

      {/* Data Quality Embedded */}
      <div className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden">
        <DataQualityDashboard />
      </div>
    </div>
  );
};
