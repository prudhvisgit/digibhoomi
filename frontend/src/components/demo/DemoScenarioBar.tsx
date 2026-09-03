import React from 'react';
import { Play, ShieldCheck, MapPin, AlertOctagon } from 'lucide-react';

interface DemoScenarioBarProps {
  onRunScenario: (scenarioNumber: 1 | 2 | 3) => void;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({ onRunScenario }) => {
  return (
    <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
      <div className="flex items-center space-x-2 font-bold text-emerald-400">
        <Play className="w-3.5 h-3.5 fill-current" />
        <span className="uppercase tracking-wider text-[11px]">SIH 2026 Judge Walkthrough Scenarios:</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onRunScenario(1)}
          className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-lg font-semibold transition"
        >
          Scenario 1: Citizen Land Buyer Journey (AP-VSKP-000123)
        </button>
        <button
          onClick={() => onRunScenario(2)}
          className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 rounded-lg font-semibold transition"
        >
          Scenario 2: Master Plan Road Corridor Impact
        </button>
        <button
          onClick={() => onRunScenario(3)}
          className="px-3 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 rounded-lg font-semibold transition"
        >
          Scenario 3: AI Data Anomaly Resolution
        </button>
      </div>
    </div>
  );
};
