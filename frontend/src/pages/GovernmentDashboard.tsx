import React, { useEffect, useState } from 'react';
import { Layers, CheckCircle2, Clock, AlertTriangle, Receipt, Building2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const GovernmentDashboard: React.FC = () => {
  const kpis = {
    totalParcels: 500,
    verifiedParcels: 442,
    pendingVerifications: 45,
    activeDisputes: 13,
    activeMortgages: 71,
    taxPaid: 398,
    totalTaxCollectedINR: 42500000,
    totalTransactionsThisMonth: 148
  };

  const landUseData = [
    { name: 'Residential', value: 215, color: '#F59E0B' },
    { name: 'Commercial', value: 98, color: '#EC4899' },
    { name: 'Agricultural', value: 112, color: '#84CC16' },
    { name: 'Industrial', value: 45, color: '#6B7280' },
    { name: 'Special Zone', value: 30, color: '#3B82F6' }
  ];

  const transactionTrendData = [
    { month: 'Jan', transactions: 110, taxCollectionsLakhs: 32 },
    { month: 'Feb', transactions: 125, taxCollectionsLakhs: 38 },
    { month: 'Mar', transactions: 148, taxCollectionsLakhs: 42.5 },
    { month: 'Apr', transactions: 132, taxCollectionsLakhs: 39 },
    { month: 'May', transactions: 140, taxCollectionsLakhs: 41 }
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">Executive Land Governance Dashboard</h1>
          <p className="text-xs text-slate-400">Visakhapatnam District DPI Platform Overview | State of Andhra Pradesh</p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">Real-Time PostGIS Data Sync</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Land Parcels</p>
            <h3 className="text-2xl font-black text-white mt-1">{kpis.totalParcels}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold">100% ULPIN Mapped</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Verified RoR Pattadars</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{kpis.verifiedParcels}</h3>
            <p className="text-[11px] text-slate-400 mt-1">{kpis.pendingVerifications} Pending Verification</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Court Litigation</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{kpis.activeDisputes}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Title Disputes Flagged</p>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Tax Collected</p>
            <h3 className="text-2xl font-black text-white mt-1">₹4.25 Cr</h3>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold">{kpis.taxPaid} Parcels Up-to-Date</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Use Distribution Pie Chart */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-slate-100">Spatial Land Use Classification</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={landUseData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {landUseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF' }} />
                <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Trend Bar Chart */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-slate-100">Monthly Registration & Tax Collection Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionTrendData}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF' }} />
                <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Bar dataKey="transactions" fill="#10B981" name="Deed Registrations" radius={[4, 4, 0, 0]} />
                <Bar dataKey="taxCollectionsLakhs" fill="#3B82F6" name="Tax Revenue (Lakhs ₹)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
