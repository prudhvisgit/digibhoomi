import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertOctagon, BrainCircuit } from 'lucide-react';
import { AIRiskScore } from '../../types';
import { fetchAIRiskScore } from '../../services/api';

interface RiskScoreCardProps {
  ulpin: string;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ ulpin }) => {
  const [risk, setRisk] = useState<AIRiskScore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchAIRiskScore(ulpin).then((res) => {
      if (isMounted) {
        setRisk(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [ulpin]);

  if (loading) {
    return (
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 animate-pulse text-xs text-slate-400">
        Calculating Explainable AI Land Risk Score...
      </div>
    );
  }

  if (!risk) return null;

  const scoreColor = risk.category === 'LOW' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
    risk.category === 'MEDIUM' ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' : 'text-rose-400 border-rose-500/40 bg-rose-500/10';

  return (
    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-100">Explainable AI Land Governance Risk Score</h3>
        </div>
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${scoreColor}`}>
          {risk.category} RISK ({risk.score}/100)
        </span>
      </div>

      {/* Breakdown Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Positive Drivers */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
          <h4 className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">Positive Drivers</h4>
          {risk.positiveDrivers.map((driver, idx) => (
            <p key={idx} className="text-slate-300 text-[11px]">{driver}</p>
          ))}
        </div>

        {/* Risk Drivers */}
        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
          <h4 className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">Risk Factors Breakdown</h4>
          {risk.riskDrivers.length > 0 ? (
            risk.riskDrivers.map((driver, idx) => (
              <p key={idx} className="text-slate-300 text-[11px]">{driver}</p>
            ))
          ) : (
            <p className="text-slate-400 text-[11px]">No risk flags detected for this parcel.</p>
          )}
        </div>
      </div>
    </div>
  );
};
