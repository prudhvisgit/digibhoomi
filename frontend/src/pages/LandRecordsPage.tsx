import React, { useState } from 'react';
import { FileText, Search, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { FullParcelDataset, UserRole } from '../types';

interface LandRecordsPageProps {
  parcelsList: FullParcelDataset[];
  onSelectParcel: (ulpin: string) => void;
  userRole: UserRole;
  onVerifyOwnership: (ulpin: string) => void;
}

export const LandRecordsPage: React.FC<LandRecordsPageProps> = ({
  parcelsList,
  onSelectParcel,
  userRole,
  onVerifyOwnership
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = parcelsList.filter((p) => {
    const props = p.parcel.properties;
    const matchSearch =
      props.ulpin.toLowerCase().includes(search.toLowerCase()) ||
      props.surveyNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.ror.pattadarName.toLowerCase().includes(search.toLowerCase()) ||
      p.ror.khataNumber.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'VERIFIED' && props.ownershipVerified) ||
      (statusFilter === 'PENDING' && !props.ownershipVerified);

    return matchSearch && matchStatus;
  });

  const isRevenueOfficer = userRole === 'REVENUE_OFFICER' || userRole === 'SUPER_ADMIN';

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Land Records & Record of Rights (Adangal 1B)</span>
          </h1>
          <p className="text-xs text-slate-400">Pattadar Ownership Records & Revenue Mutation Registry | Visakhapatnam District</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <p className="text-[11px] text-slate-400 font-medium">Verified RoR Extent</p>
          <p className="text-lg font-black text-emerald-400">96.2%</p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by Khata #, Pattadar Name, Survey #, or ULPIN..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <label className="text-slate-400 font-medium whitespace-nowrap">Verification Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Records</option>
            <option value="VERIFIED">Verified Pattadars</option>
            <option value="PENDING">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* RoR Records Data Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">ULPIN / Khata #</th>
                <th className="p-3">Pattadar Name</th>
                <th className="p-3">Survey #</th>
                <th className="p-3">Classification</th>
                <th className="p-3">Extent (Acres)</th>
                <th className="p-3">Mutation</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 15).map((p) => {
                const props = p.parcel.properties;
                return (
                  <tr key={props.ulpin} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {props.ulpin}<br />
                      <span className="text-[10px] text-slate-500">{p.ror.khataNumber}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-100">{p.ror.pattadarName}</td>
                    <td className="p-3 font-medium text-slate-300">{props.surveyNumber}</td>
                    <td className="p-3 text-slate-400">{p.ror.landType}</td>
                    <td className="p-3 font-bold text-slate-200">{props.areaAcres} Acres</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[11px]">
                        {p.ror.mutationStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        props.ownershipVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {props.ownershipVerified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => onSelectParcel(props.ulpin)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-[11px]"
                      >
                        Inspect ULPIN
                      </button>
                      {isRevenueOfficer && !props.ownershipVerified && (
                        <button
                          onClick={() => onVerifyOwnership(props.ulpin)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[11px]"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
