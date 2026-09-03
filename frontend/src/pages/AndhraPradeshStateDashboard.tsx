import React from 'react';
import { Globe, MapPin, Layers, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

interface StateDashboardProps {
  onDrilldownVisakhapatnam: () => void;
}

export const AndhraPradeshStateDashboard: React.FC<StateDashboardProps> = ({ onDrilldownVisakhapatnam }) => {
  const districts = [
    { code: 'VSKP', name: 'Visakhapatnam', parcels: '14,500', verified: '96.2%', disputes: 13, taxCr: '42.5', isDetailedDemo: true },
    { code: 'VJWD', name: 'Vijayawada (NTR)', parcels: '12,200', verified: '93.4%', disputes: 18, taxCr: '31.2', isDetailedDemo: false },
    { code: 'GNTR', name: 'Guntur', parcels: '10,800', verified: '91.8%', disputes: 22, taxCr: '24.8', isDetailedDemo: false },
    { code: 'TRPT', name: 'Tirupati', parcels: '9,100', verified: '90.5%', disputes: 15, taxCr: '19.4', isDetailedDemo: false },
    { code: 'KRNL', name: 'Kurnool', parcels: '8,900', verified: '89.2%', disputes: 28, taxCr: '16.1', isDetailedDemo: false },
    { code: 'NLLR', name: 'Nellore (SPSR)', parcels: '7,600', verified: '88.7%', disputes: 19, taxCr: '14.5', isDetailedDemo: false }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 overflow-y-auto h-full">
      {/* Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-2">
            <Globe className="w-4 h-4" />
            <span>State Digital Public Infrastructure (DPI)</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Andhra Pradesh Land Stack Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Statewide Land Governance Integration across 26 Districts | ULPIN Interoperability Engine
          </p>
        </div>
        <button
          onClick={onDrilldownVisakhapatnam}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center space-x-2"
        >
          <span>Drilldown into Visakhapatnam Detailed GIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* State-wide KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Statewide ULPIN Mapped Parcels</p>
          <h3 className="text-2xl font-black text-white mt-1">142,500</h3>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">100% PostGIS Georeferenced</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Average RoR Verified Pattadars</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">92.4%</h3>
          <p className="text-[11px] text-slate-400 mt-1">Adangal 1B Verified</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Statewide Property Tax Revenue</p>
          <h3 className="text-2xl font-black text-white mt-1">₹148.5 Cr</h3>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">CDMA Municipal Portal Sync</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Active Departmental APIs</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">6 / 6</h3>
          <p className="text-[11px] text-slate-400 mt-1">Revenue, Reg, Plan, Tax, Infra, Courts</p>
        </div>
      </div>

      {/* District Grid */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>Andhra Pradesh Districts Demonstration Breakdown</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Visakhapatnam = Detailed Demo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {districts.map((d) => (
            <div
              key={d.code}
              onClick={() => { if (d.isDetailedDemo) onDrilldownVisakhapatnam(); }}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                d.isDetailedDemo
                  ? 'bg-slate-950 border-emerald-500 shadow-md hover:border-emerald-400'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
                    <span>{d.name}</span>
                    {d.isDetailedDemo && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-500/40">
                        DETAILED DEMO
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">District Code: {d.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3 mt-3">
                <div>Parcels: <span className="text-slate-200 font-semibold">{d.parcels}</span></div>
                <div>RoR Verified: <span className="text-emerald-400 font-semibold">{d.verified}</span></div>
                <div>Disputes: <span className="text-rose-400 font-semibold">{d.disputes}</span></div>
                <div>Tax: <span className="text-slate-200 font-semibold">₹{d.taxCr} Cr</span></div>
              </div>

              {d.isDetailedDemo && (
                <div className="mt-3 text-right">
                  <span className="text-[11px] text-emerald-400 font-bold hover:underline inline-flex items-center space-x-1">
                    <span>Open Interactive GIS Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
