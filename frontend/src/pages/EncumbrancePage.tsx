import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { FullParcelDataset } from '../types';

interface EncumbrancePageProps {
  parcelsList: FullParcelDataset[];
  onSelectParcel: (ulpin: string) => void;
}

export const EncumbrancePage: React.FC<EncumbrancePageProps> = ({ parcelsList, onSelectParcel }) => {
  const [search, setSearch] = useState('');
  const [ecFilter, setEcFilter] = useState('ALL');

  const filtered = parcelsList.filter((p) => {
    const props = p.parcel.properties;
    const matchSearch =
      props.ulpin.toLowerCase().includes(search.toLowerCase()) ||
      p.ror.pattadarName.toLowerCase().includes(search.toLowerCase());

    const matchEc =
      ecFilter === 'ALL' ||
      (ecFilter === 'MORTGAGED' && props.mortgageStatus === 'ACTIVE_MORTGAGE') ||
      (ecFilter === 'CLEAR' && props.mortgageStatus === 'NONE');

    return matchSearch && matchEc;
  });

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Encumbrance Certificate (EC) & Mortgage Lien Registry</span>
          </h1>
          <p className="text-xs text-slate-400">Bank Mortgages, Liens, Court Attachments & Government Restrictions</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <p className="text-[11px] text-slate-400 font-medium">Clear EC Ratio</p>
          <p className="text-lg font-black text-emerald-400">85.8% Clear</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ULPIN or Pattadar Name..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={ecFilter}
          onChange={(e) => setEcFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">All EC Statuses</option>
          <option value="CLEAR">Clear EC (Zero Liens)</option>
          <option value="MORTGAGED">Active Mortgage Liens</option>
        </select>
      </div>

      {/* EC Records Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">ULPIN</th>
                <th className="p-3">Pattadar Name</th>
                <th className="p-3">Encumbrance Type</th>
                <th className="p-3">Financial Institution</th>
                <th className="p-3">Lien Amount</th>
                <th className="p-3">EC Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 15).map((p) => {
                const enc = p.encumbrance[0];
                const isMortgaged = p.parcel.properties.mortgageStatus === 'ACTIVE_MORTGAGE';
                return (
                  <tr key={p.parcel.properties.ulpin} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">{p.parcel.properties.ulpin}</td>
                    <td className="p-3 font-semibold text-slate-100">{p.ror.pattadarName}</td>
                    <td className="p-3 text-slate-300">{enc ? enc.type : 'None'}</td>
                    <td className="p-3 text-slate-400">{enc ? enc.institution : 'N/A'}</td>
                    <td className="p-3 font-bold text-amber-400">{enc && enc.amountINR ? `₹${enc.amountINR.toLocaleString()}` : '₹0'}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        isMortgaged ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isMortgaged ? 'ACTIVE MORTGAGE' : 'CLEAR EC'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectParcel(p.parcel.properties.ulpin)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-[11px]"
                      >
                        Inspect EC
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
