import React, { useState } from 'react';
import { Stamp, Search, ArrowRight, DollarSign } from 'lucide-react';
import { FullParcelDataset } from '../types';

interface RegistrationPageProps {
  parcelsList: FullParcelDataset[];
  onSelectParcel: (ulpin: string) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ parcelsList, onSelectParcel }) => {
  const [search, setSearch] = useState('');

  const filtered = parcelsList.filter((p) => {
    const reg = p.registration[0];
    if (!reg) return false;
    const match =
      reg.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.parcel.properties.ulpin.toLowerCase().includes(search.toLowerCase()) ||
      reg.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      reg.sellerName.toLowerCase().includes(search.toLowerCase());
    return match;
  });

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <Stamp className="w-6 h-6 text-emerald-400" />
            <span>Sub-Registrar Office Deed Registration Registry (CARD)</span>
          </h1>
          <p className="text-xs text-slate-400">Computer-aided Administration of Registration Department | Visakhapatnam SRO-1</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <p className="text-[11px] text-slate-400 font-medium">Deeds Synced Today</p>
          <p className="text-lg font-black text-emerald-400">148 Transactions</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Registration #, Buyer, Seller, or ULPIN..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Registration Deeds Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Deed Registration #</th>
                <th className="p-3">ULPIN</th>
                <th className="p-3">Transaction Type</th>
                <th className="p-3">Seller Name</th>
                <th className="p-3">Buyer Name</th>
                <th className="p-3">Consideration Value</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 15).map((p) => {
                const reg = p.registration[0];
                return (
                  <tr key={reg.registrationNumber} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">{reg.registrationNumber}</td>
                    <td className="p-3 font-mono font-semibold text-slate-200">{p.parcel.properties.ulpin}</td>
                    <td className="p-3 font-medium text-slate-300">{reg.transactionType}</td>
                    <td className="p-3 text-slate-400">{reg.sellerName}</td>
                    <td className="p-3 font-semibold text-slate-100">{reg.buyerName}</td>
                    <td className="p-3 font-bold text-emerald-400">₹{reg.considerationValueINR.toLocaleString()}</td>
                    <td className="p-3 text-slate-400">{reg.registrationDate}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectParcel(p.parcel.properties.ulpin)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-[11px]"
                      >
                        Inspect Deed & EC
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
