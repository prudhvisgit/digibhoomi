import React, { useState } from 'react';
import { Scale, Search, AlertTriangle } from 'lucide-react';
import { FullParcelDataset } from '../types';

interface DisputesPageProps {
  parcelsList: FullParcelDataset[];
  onSelectParcel: (ulpin: string) => void;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({ parcelsList, onSelectParcel }) => {
  const [search, setSearch] = useState('');

  const litigatedParcels = parcelsList.filter(p => p.disputes.length > 0 || p.parcel.properties.disputeStatus === 'ACTIVE_DISPUTE');
  const filtered = litigatedParcels.filter((p) => {
    const d = p.disputes[0];
    const match =
      p.parcel.properties.ulpin.toLowerCase().includes(search.toLowerCase()) ||
      p.ror.pattadarName.toLowerCase().includes(search.toLowerCase()) ||
      (d && (d.caseId.toLowerCase().includes(search.toLowerCase()) || d.parties.toLowerCase().includes(search.toLowerCase())));
    return match;
  });

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <Scale className="w-6 h-6 text-rose-400" />
            <span>E-Courts Civil Judicial Litigation & Disputes Registry</span>
          </h1>
          <p className="text-xs text-slate-400">Junior & Senior Civil Judge Courts Litigation Tracking | Visakhapatnam Jurisdiction</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <p className="text-[11px] text-slate-400 font-medium">Active Litigated Parcels</p>
          <p className="text-lg font-black text-rose-400">{litigatedParcels.length} Active Cases</p>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Case #, Litigating Parties, or ULPIN..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Case ID</th>
                <th className="p-3">ULPIN</th>
                <th className="p-3">Judicial Court Name</th>
                <th className="p-3">Suit Classification</th>
                <th className="p-3">Litigating Parties</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => {
                const d = p.disputes[0] || { caseId: 'OS-102/2024', courtName: 'Junior Civil Judge Court', caseType: 'Title Dispute', parties: `${p.ror.pattadarName} vs K. Appala Naidu`, riskLevel: 'HIGH' };
                return (
                  <tr key={p.parcel.properties.ulpin} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-rose-400">{d.caseId}</td>
                    <td className="p-3 font-mono text-slate-200">{p.parcel.properties.ulpin}</td>
                    <td className="p-3 text-slate-300">{d.courtName}</td>
                    <td className="p-3 font-medium text-slate-400">{d.caseType}</td>
                    <td className="p-3 font-semibold text-slate-100">{d.parties}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 text-[10px]">
                        {d.riskLevel} RISK
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectParcel(p.parcel.properties.ulpin)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-[11px]"
                      >
                        Inspect Litigation
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
