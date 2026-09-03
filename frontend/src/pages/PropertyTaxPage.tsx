import React, { useState } from 'react';
import { Receipt, Search, DollarSign } from 'lucide-react';
import { FullParcelDataset } from '../types';

interface PropertyTaxPageProps {
  parcelsList: FullParcelDataset[];
  onSelectParcel: (ulpin: string) => void;
}

export const PropertyTaxPage: React.FC<PropertyTaxPageProps> = ({ parcelsList, onSelectParcel }) => {
  const [search, setSearch] = useState('');
  const [taxFilter, setTaxFilter] = useState('ALL');

  const filtered = parcelsList.filter((p) => {
    const props = p.parcel.properties;
    const matchSearch =
      props.ulpin.toLowerCase().includes(search.toLowerCase()) ||
      p.propertyTax.propertyId.toLowerCase().includes(search.toLowerCase()) ||
      p.ror.pattadarName.toLowerCase().includes(search.toLowerCase());

    const matchTax =
      taxFilter === 'ALL' ||
      (taxFilter === 'PENDING' && props.taxStatus === 'PENDING') ||
      (taxFilter === 'PAID' && props.taxStatus === 'PAID');

    return matchSearch && matchTax;
  });

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span>CDMA Municipal Property Tax Collection Registry</span>
          </h1>
          <p className="text-xs text-slate-400">Commissioner & Director of Municipal Administration Portal Sync</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <p className="text-[11px] text-slate-400 font-medium">Total Tax Collected</p>
          <p className="text-lg font-black text-emerald-400">₹4.25 Cr</p>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Property ID, Taxpayer, or ULPIN..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={taxFilter}
          onChange={(e) => setTaxFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">All Tax Records</option>
          <option value="PAID">Tax Paid Up-to-Date</option>
          <option value="PENDING">Outstanding Tax Dues</option>
        </select>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Property ID</th>
                <th className="p-3">ULPIN</th>
                <th className="p-3">Taxpayer Name</th>
                <th className="p-3">Annual Tax</th>
                <th className="p-3">Outstanding Dues</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 15).map((p) => {
                const tax = p.propertyTax;
                const isPending = p.parcel.properties.taxStatus === 'PENDING';
                return (
                  <tr key={tax.propertyId} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">{tax.propertyId}</td>
                    <td className="p-3 font-mono text-slate-200">{p.parcel.properties.ulpin}</td>
                    <td className="p-3 font-semibold text-slate-100">{p.ror.pattadarName}</td>
                    <td className="p-3 font-bold text-slate-200">₹{tax.annualTaxINR.toLocaleString()}</td>
                    <td className="p-3 font-bold text-rose-400">₹{tax.outstandingINR.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        isPending ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {p.parcel.properties.taxStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectParcel(p.parcel.properties.ulpin)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-[11px]"
                      >
                        Inspect Tax
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
