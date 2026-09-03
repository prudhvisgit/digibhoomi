import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';

export interface LayerState {
  parcelBoundaries: boolean;
  ulpinLabels: boolean;
  ownershipStatus: boolean;
  landUseZoning: boolean;
  masterPlanRoads: boolean;
  buildingPermits: boolean;
  propertyTax: boolean;
  utilities: boolean;
  environmentalZones: boolean;
  floodZones: boolean;
  courtDisputes: boolean;
}

interface LayerControlProps {
  layers: LayerState;
  onLayerToggle: (layerKey: keyof LayerState) => void;
  baseMap: 'street' | 'satellite' | 'dark';
  onBaseMapChange: (baseMap: 'street' | 'satellite' | 'dark') => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  onLayerToggle,
  baseMap,
  onBaseMapChange
}) => {
  const layerDefinitions: { key: keyof LayerState; label: string; group: string }[] = [
    { key: 'parcelBoundaries', label: 'Parcel Boundaries', group: 'Base Cadastral' },
    { key: 'ulpinLabels', label: 'ULPIN Identifiers', group: 'Base Cadastral' },
    { key: 'ownershipStatus', label: 'Ownership & Pattadar Status', group: 'Governance' },
    { key: 'landUseZoning', label: 'Land Use & Zoning', group: 'Governance' },
    { key: 'masterPlanRoads', label: 'Master Plan Road Expansion', group: 'Governance' },
    { key: 'buildingPermits', label: 'Building Permissions', group: 'Governance' },
    { key: 'propertyTax', label: 'Property Tax Collection', group: 'Use Case' },
    { key: 'utilities', label: 'Utilities & Infrastructure Grid', group: 'Use Case' },
    { key: 'environmentalZones', label: 'Coastal & Forest Buffers', group: 'Use Case' },
    { key: 'floodZones', label: '100-Year Flood Risk Zones', group: 'Use Case' },
    { key: 'courtDisputes', label: 'Active Court Disputes', group: 'Governance' }
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-slate-100 p-4 rounded-xl border border-slate-700/80 shadow-2xl w-80 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
        <Layers className="w-4 h-4 text-emerald-400" />
        <h3 className="font-semibold text-sm">GIS Layer Control</h3>
      </div>

      {/* Base Map Selector */}
      <div className="my-3">
        <label className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">Base Map View</label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['street', 'satellite', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onBaseMapChange(mode)}
              className={`py-1 px-2 text-xs rounded-md capitalize font-medium transition ${
                baseMap === mode
                  ? 'bg-emerald-600 text-white font-semibold shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-3 mt-4">
        <label className="text-[11px] font-semibold uppercase text-slate-400 block">Layer Visibility</label>
        {layerDefinitions.map(({ key, label }) => {
          const isChecked = layers[key];
          return (
            <label
              key={key}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 cursor-pointer transition text-xs border border-transparent hover:border-slate-700"
            >
              <span className="flex items-center space-x-2 font-medium text-slate-200">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onLayerToggle(key)}
                  className="rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-slate-800"
                />
                <span>{label}</span>
              </span>
              {isChecked ? (
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};
