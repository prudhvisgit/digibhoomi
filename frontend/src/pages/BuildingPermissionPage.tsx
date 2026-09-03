import React, { useState } from 'react';
import { CheckSquare, Search, Building } from 'lucide-react';
import { FullParcelDataset } from '../types';

interface BuildingPermissionPageProps {
  parcelsList: FullParcelDataset[];
  onSelectParcel: (ulpin: string) => void;
}

export const BuildingPermissionPage: React.FC<BuildingPermissionPageProps> = ({ parcelsList, onSelectParcel }) => {
  const [search, setSearch] = useState('');

  const filtered = parcelsList.filter((p) => {
    const b = p.buildingPermission;
    const match =
      b.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      b.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      p.parcel.properties.ulpin.toLowerCase().includes(search.toLowerCase());
    return match;
  });

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Municipal Building Sanctions & Permits Registry</span>
          </h1>
          <p className="text-xs text-slate-400">Greater Visakhapatnam Municipal Corporation (GVMC) Sanction Approvals</p>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Application ID, Applicant, or ULPIN..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Application ID</th>
                <th className="p-3">ULPIN</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Building Type</th>
                <th className="p-3">Sanctioned Area</th>
                <th className="p-3">Permit Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 15).map((p) => {
                const b = p.buildingPermission;
                return (
                  <tr key={b.applicationId} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">{b.applicationId}</td>
                    <td className="p-3 font-mono text-slate-200">{p.parcel.properties.ulpin}</td>
                    <td className="p-3 font-semibold text-slate-100">{b.applicantName}</td>
                    <td className="p-3 text-slate-300">{b.buildingType} ({b.appliedFloors} Floors)</td>
                    <td className="p-3 font-bold text-slate-200">{b.approvedAreaSqft.toLocaleString()} sqft</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        b.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectParcel(p.parcel.properties.ulpin)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-[11px]"
                      >
                        Inspect Permit
                      </button>
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
