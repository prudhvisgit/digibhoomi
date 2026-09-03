import React, { useState } from 'react';
import { Building2, Search, Map, Compass } from 'lucide-react';
import { FullParcelDataset } from '../types';

interface PlanningPageProps {
  parcelsList: FullParcelDataset[];
  onSelectParcel: (ulpin: string) => void;
}

export const PlanningPage: React.FC<PlanningPageProps> = ({ parcelsList, onSelectParcel }) => {
  const [search, setSearch] = useState('');
  const [roadFilter, setRoadFilter] = useState('ALL');

  const filtered = parcelsList.filter((p) => {
    const props = p.parcel.properties;
    const matchSearch =
      props.ulpin.toLowerCase().includes(search.toLowerCase()) ||
      props.landUse.toLowerCase().includes(search.toLowerCase()) ||
      p.zoning.currentZoning.toLowerCase().includes(search.toLowerCase());

    const matchRoad =
      roadFilter === 'ALL' ||
      (roadFilter === 'AFFECTED' && p.zoning.futureRoadExpansion) ||
      (roadFilter === 'CLEAR' && !p.zoning.futureRoadExpansion);

    return matchSearch && matchRoad;
  });

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-purple-400" />
            <span>VMRDA Urban Master Plan & Zoning Registry</span>
          </h1>
          <p className="text-xs text-slate-400">Visakhapatnam Metropolitan Region Development Authority | Land Use & Road Corridors</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <p className="text-[11px] text-slate-400 font-medium">Road Expansion Affected</p>
          <p className="text-lg font-black text-purple-400">27 Parcels (18.5 Acres)</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Zoning Category, Land Use, or ULPIN..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={roadFilter}
          onChange={(e) => setRoadFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          <option value="ALL">All Master Plan Parcels</option>
          <option value="AFFECTED">Road Corridor Affected</option>
          <option value="CLEAR">Unffected Parcels</option>
        </select>
      </div>

      {/* Master Plan Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">ULPIN</th>
                <th className="p-3">Zoning Classification</th>
                <th className="p-3">Permitted Use</th>
                <th className="p-3">FAR Limit</th>
                <th className="p-3">Max Height</th>
                <th className="p-3">Road Expansion</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.slice(0, 15).map((p) => {
                const z = p.zoning;
                return (
                  <tr key={p.parcel.properties.ulpin} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-purple-400">{p.parcel.properties.ulpin}</td>
                    <td className="p-3 font-semibold text-slate-100">{z.currentZoning}</td>
                    <td className="p-3 text-slate-400">{z.permittedLandUse}</td>
                    <td className="p-3 font-bold text-emerald-400">{z.farLimit}</td>
                    <td className="p-3 text-slate-200">{z.maxBuildingHeightMeters} Meters</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        z.futureRoadExpansion ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {z.futureRoadExpansion ? `YES (${z.expansionDistanceMeters}m)` : 'NO'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectParcel(p.parcel.properties.ulpin)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded text-[11px]"
                      >
                        Inspect Zoning
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
