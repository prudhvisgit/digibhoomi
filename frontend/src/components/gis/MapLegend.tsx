import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-sm text-slate-200 text-xs p-3 rounded-lg border border-slate-700 shadow-lg space-y-2 w-64">
      <h4 className="font-semibold text-slate-100 border-b border-slate-700 pb-1">GIS Symbology Legend</h4>
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/60 border border-emerald-400"></span>
          <span>Verified Parcel</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-amber-500/60 border border-amber-400"></span>
          <span>Pending Verification</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-red-600/70 border border-red-500"></span>
          <span>Litigation Dispute</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-purple-600/70 border border-purple-400"></span>
          <span>Master Plan Expansion</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-blue-500/60 border border-blue-400"></span>
          <span>Flood Zone Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-sm bg-yellow-500/60 border border-yellow-400"></span>
          <span>Residential Zone</span>
        </div>
      </div>
    </div>
  );
};
