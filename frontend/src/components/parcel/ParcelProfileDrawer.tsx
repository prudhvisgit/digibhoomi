import React, { useState } from 'react';
import {
  X, ShieldCheck, AlertTriangle, FileText, UserCheck, Stamp, Scale,
  Building, Zap, ShieldAlert, Clock, CheckCircle2, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { FullParcelDataset, UserRole } from '../../types';
import { RiskScoreCard } from '../ai/RiskScoreCard';

interface ParcelProfileDrawerProps {
  dataset: FullParcelDataset | null;
  onClose: () => void;
  userRole: UserRole;
  onVerifyOwnership: (ulpin: string) => void;
  onRequestVerification: (ulpin: string) => void;
}

export type ParcelTab =
  | 'overview'
  | 'ownership'
  | 'ror'
  | 'registration'
  | 'encumbrance'
  | 'zoning'
  | 'building'
  | 'tax'
  | 'utilities'
  | 'environment'
  | 'disputes'
  | 'timeline';

export const ParcelProfileDrawer: React.FC<ParcelProfileDrawerProps> = ({
  dataset,
  onClose,
  userRole,
  onVerifyOwnership,
  onRequestVerification
}) => {
  const [activeTab, setActiveTab] = useState<ParcelTab>('overview');

  if (!dataset) return null;

  const p = dataset.parcel.properties;
  const isRevenueOfficer = userRole === 'REVENUE_OFFICER' || userRole === 'SUPER_ADMIN';

  const tabs: { id: ParcelTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'ownership', label: 'Ownership' },
    { id: 'ror', label: 'Record of Rights (Adangal)' },
    { id: 'registration', label: 'Deed Registration' },
    { id: 'encumbrance', label: 'Encumbrance' },
    { id: 'zoning', label: 'Zoning & Master Plan' },
    { id: 'building', label: 'Building Permission' },
    { id: 'tax', label: 'Property Tax' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'environment', label: 'Environment' },
    { id: 'disputes', label: 'Court Disputes' },
    { id: 'timeline', label: 'Timeline & Audit' }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-3xl bg-slate-900 text-slate-100 shadow-2xl border-l border-slate-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold tracking-tight text-white">{p.ulpin}</h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
              Survey #{p.surveyNumber}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {p.village}, {p.mandal}, {p.district}, AP | {p.areaAcres} Acres ({p.areaSqMeters} sq.m)
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Verification Status Badges Bar */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Ownership Badge */}
          <span className={`px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1 ${
            p.ownershipVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ownership: {p.ownershipVerified ? 'VERIFIED' : 'PENDING'}</span>
          </span>

          {/* Mortgage Badge */}
          <span className={`px-2.5 py-1 rounded-md font-semibold ${
            p.mortgageStatus === 'NONE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            Mortgage: {p.mortgageStatus}
          </span>

          {/* Tax Badge */}
          <span className={`px-2.5 py-1 rounded-md font-semibold ${
            p.taxStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            Tax: {p.taxStatus}
          </span>

          {/* Dispute Badge */}
          <span className={`px-2.5 py-1 rounded-md font-semibold ${
            p.disputeStatus === 'NONE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            Dispute: {p.disputeStatus}
          </span>
        </div>

        {/* Action Button */}
        {isRevenueOfficer && !p.ownershipVerified && (
          <button
            onClick={() => onVerifyOwnership(p.ulpin)}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-md shadow text-xs transition"
          >
            Verify Ownership Record
          </button>
        )}
        {userRole === 'CITIZEN' && (
          <button
            onClick={() => onRequestVerification(p.ulpin)}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-md shadow text-xs transition"
          >
            Request Verification
          </button>
        )}
      </div>

      {/* Tabs Horizontal Scroll */}
      <div className="bg-slate-950 px-4 border-b border-slate-800 flex space-x-1 overflow-x-auto text-xs font-medium shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400 font-semibold bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <RiskScoreCard ulpin={p.ulpin} />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Parcel Metadata</h4>
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><dt className="text-slate-400">ULPIN:</dt><dd className="font-mono text-emerald-400 font-bold">{p.ulpin}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Survey #:</dt><dd className="text-slate-200">{p.surveyNumber}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Land Use Zone:</dt><dd className="text-slate-200">{p.landUse}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Total Area:</dt><dd className="text-slate-200">{p.areaAcres} Acres ({p.areaSqMeters} sq.m)</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Village:</dt><dd className="text-slate-200">{p.village}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Mandal:</dt><dd className="text-slate-200">{p.mandal}</dd></div>
                </dl>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Primary Pattadar / Owner</h4>
                {dataset.owners[0] ? (
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-slate-100 text-sm">{dataset.owners[0].personName}</p>
                    <p className="text-slate-400">Ownership Type: <span className="text-slate-200">{dataset.owners[0].ownershipType} ({dataset.owners[0].ownershipShare}%)</span></p>
                    <p className="text-slate-400">Date Acquired: <span className="text-slate-200">{dataset.owners[0].startDate}</span></p>
                    <p className="text-slate-400">Deed Doc: <span className="text-emerald-400 font-mono">{dataset.owners[0].sourceDocument}</span></p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No owner recorded</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ownership' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Pattadar Ownership Records</h3>
            {dataset.owners.map((o) => (
              <div key={o.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-sm text-emerald-400">{o.personName}</h4>
                  <p className="text-slate-400 mt-1">Ownership Type: {o.ownershipType} | Share: {o.ownershipShare}%</p>
                  <p className="text-slate-400">Acquired Date: {o.startDate}</p>
                  <p className="text-slate-400 font-mono mt-1 text-[11px]">{o.sourceDocument}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  {o.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ror' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">Record of Rights (Adangal 1B Extract)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-slate-400">Khata Number:</span> <p className="font-mono text-emerald-400 font-bold">{dataset.ror.khataNumber}</p></div>
              <div><span className="text-slate-400">Pattadar Name:</span> <p className="font-semibold text-slate-100">{dataset.ror.pattadarName}</p></div>
              <div><span className="text-slate-400">Classification:</span> <p className="text-slate-200">{dataset.ror.landType}</p></div>
              <div><span className="text-slate-400">Extent:</span> <p className="text-slate-200">{dataset.ror.extentAcres} Acres</p></div>
              <div><span className="text-slate-400">Mutation Status:</span> <p className="text-emerald-400 font-semibold">{dataset.ror.mutationStatus}</p></div>
              <div><span className="text-slate-400">Last Records Update:</span> <p className="text-slate-200">{new Date(dataset.ror.lastUpdated).toLocaleDateString()}</p></div>
            </div>
          </div>
        )}

        {activeTab === 'registration' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Sub-Registrar Office Deed History</h3>
            {dataset.registration.map((reg) => (
              <div key={reg.registrationNumber} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-400 font-mono">{reg.registrationNumber}</span>
                  <span className="text-slate-300">{reg.transactionType}</span>
                </div>
                <p className="text-slate-400">Registration Date: <span className="text-slate-200">{reg.registrationDate}</span></p>
                <p className="text-slate-400">Seller: <span className="text-slate-200">{reg.sellerName}</span> | Buyer: <span className="text-slate-200">{reg.buyerName}</span></p>
                <p className="text-slate-400">Consideration Value: <span className="text-emerald-400 font-bold">₹{reg.considerationValueINR.toLocaleString()}</span></p>
                <p className="text-slate-500 text-[11px]">{reg.subRegistrarOffice}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'encumbrance' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-100">Encumbrance Certificate (EC) Status</h3>
            {dataset.encumbrance.length > 0 ? (
              dataset.encumbrance.map((enc) => (
                <div key={enc.id} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 space-y-1">
                  <p className="font-bold">{enc.type} - {enc.institution}</p>
                  <p>Encumbrance Amount: ₹{enc.amountINR?.toLocaleString()}</p>
                  <p>Lien Start Date: {enc.startDate}</p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 flex items-center space-x-2 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>✓ Clear Encumbrance Certificate (No Active Bank Mortgages or Liens)</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'zoning' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-100">Master Plan & Zoning Guidelines</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-slate-400">Current Zoning:</span> <p className="font-semibold text-slate-100">{dataset.zoning.currentZoning}</p></div>
              <div><span className="text-slate-400">Floor Area Ratio (FAR):</span> <p className="text-emerald-400 font-bold">{dataset.zoning.farLimit}</p></div>
              <div><span className="text-slate-400">Max Height Limit:</span> <p className="text-slate-200">{dataset.zoning.maxBuildingHeightMeters} Meters</p></div>
              <div><span className="text-slate-400">Planned Road Expansion:</span> <p className={dataset.zoning.futureRoadExpansion ? 'text-purple-400 font-bold' : 'text-emerald-400'}>{dataset.zoning.futureRoadExpansion ? `YES (${dataset.zoning.expansionDistanceMeters}m)` : 'NO'}</p></div>
            </div>
          </div>
        )}

        {activeTab === 'building' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h3 className="text-sm font-bold text-slate-100">Building Permission & Construction Sanctions</h3>
            <p className="text-slate-400">Application ID: <span className="font-mono text-emerald-400">{dataset.buildingPermission.applicationId}</span></p>
            <p className="text-slate-400">Building Type: <span className="text-slate-200">{dataset.buildingPermission.buildingType} ({dataset.buildingPermission.appliedFloors} Floors)</span></p>
            <p className="text-slate-400">Permit Status: <span className="font-bold text-emerald-400">{dataset.buildingPermission.status}</span></p>
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-100">Municipal Property Tax Records</h3>
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div>
                <p className="text-slate-400">Annual Tax: ₹{dataset.propertyTax.annualTaxINR.toLocaleString()}</p>
                <p className="text-slate-400">Outstanding: <span className="text-rose-400 font-bold">₹{dataset.propertyTax.outstandingINR.toLocaleString()}</span></p>
              </div>
              <span className={`px-3 py-1 rounded font-bold ${dataset.propertyTax.taxStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {dataset.propertyTax.taxStatus}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'utilities' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h3 className="text-sm font-bold text-slate-100">Linked Infrastructure & Utilities</h3>
            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div>Electricity Grid: <span className="text-emerald-400 font-bold">{dataset.utilities.electricity}</span></div>
              <div>Water Supply: <span className="text-emerald-400 font-bold">{dataset.utilities.water}</span></div>
              <div>Sewerage Network: <span className="text-emerald-400 font-bold">{dataset.utilities.sewerage}</span></div>
              <div>Telecom Fiber: <span className="text-emerald-400 font-bold">{dataset.utilities.telecomFiber}</span></div>
            </div>
          </div>
        )}

        {activeTab === 'environment' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h3 className="text-sm font-bold text-slate-100">Environmental & Flood Restrictions</h3>
            <p className="text-slate-400">100-Yr Flood Risk Zone: <span className="font-bold text-slate-200">{dataset.environment.floodZone ? 'YES' : 'NO'}</span></p>
            <p className="text-slate-400">Coastal Regulation Zone (CRZ): <span className="font-bold text-slate-200">{dataset.environment.coastalRegulationZone ? 'YES' : 'NO'}</span></p>
            <p className="text-slate-400">Forest Reserve Distance: <span className="text-slate-200">{dataset.environment.forestZoneDistanceKm} KM</span></p>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Judicial Court Litigation Records</h3>
            {dataset.disputes.length > 0 ? (
              dataset.disputes.map((d) => (
                <div key={d.caseId} className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs space-y-1 text-red-200">
                  <div className="flex justify-between font-bold">
                    <span>Case #{d.caseId}</span>
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px]">{d.riskLevel} RISK</span>
                  </div>
                  <p className="text-red-300 font-semibold">{d.courtName}</p>
                  <p>Parties: {d.parties}</p>
                  <p>Status: {d.status} (Next Hearing: {d.nextHearingDate})</p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 flex items-center space-x-2 font-medium text-xs">
                <CheckCircle2 className="w-5 h-5" />
                <span>✓ Zero Active Litigation or Civil Court Disputes Recorded</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100">Multi-System Chronological Timeline</h3>
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
              {dataset.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900"></span>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between font-bold text-slate-200">
                      <span>{event.title}</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{event.date}</span>
                    </div>
                    <p className="text-slate-400 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
