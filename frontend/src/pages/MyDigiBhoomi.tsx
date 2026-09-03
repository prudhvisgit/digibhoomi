import React from 'react';
import { ShieldCheck, Layers, FileText, Send, Receipt, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { Person, ParcelFeature, ServiceRequest, DocumentRecord, UserNotification } from '../types';

interface MyDigiBhoomiProps {
  person: Person;
  myProperties: ParcelFeature[];
  myRequests: ServiceRequest[];
  myDocuments: DocumentRecord[];
  myNotifications: UserNotification[];
  totalTaxDueINR: number;
  onSelectParcel: (ulpin: string) => void;
}

export const MyDigiBhoomi: React.FC<MyDigiBhoomiProps> = ({
  person,
  myProperties,
  myRequests,
  myDocuments,
  myNotifications,
  totalTaxDueINR,
  onSelectParcel
}) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-slate-100 overflow-y-auto h-full">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Person Identity: {person.id}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome to MY DIGIBHOOMI, {person.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Person-Specific Citizen Dashboard | {person.address}
          </p>
        </div>
        <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-right">
          <p className="text-[11px] text-slate-400 font-medium">Total Property Tax Dues</p>
          <p className={`text-xl font-black ${totalTaxDueINR > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            ₹{totalTaxDueINR.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">My Land Properties</p>
            <h3 className="text-2xl font-black text-white mt-1">{myProperties.length}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold">100% Data Isolated</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">My Service Applications</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{myRequests.length}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Active Department REQs</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">My Land Documents</p>
            <h3 className="text-2xl font-black text-white mt-1">{myDocuments.length}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Verified Sale Deeds</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">My Notifications</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{myNotifications.length}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Direct Citizen Alerts</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: My Properties List */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>My Land Properties ({myProperties.length})</span>
        </h2>

        {myProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProperties.map((pf) => {
              const p = pf.properties;
              return (
                <div key={p.ulpin} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-emerald-400 font-extrabold text-sm">{p.ulpin}</span>
                      <p className="text-xs text-slate-300 font-semibold mt-0.5">Survey #{p.surveyNumber}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {p.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 border-t border-b border-slate-800/80 py-2">
                    <div>Extent: <span className="text-slate-200 font-semibold">{p.areaAcres} Acres</span></div>
                    <div>Zone: <span className="text-slate-200 font-semibold">{p.landUse}</span></div>
                    <div>Village: <span className="text-slate-200">{p.village}</span></div>
                    <div>District: <span className="text-slate-200">{p.district}</span></div>
                  </div>

                  <button
                    onClick={() => onSelectParcel(p.ulpin)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center space-x-1.5"
                  >
                    <span>View Complete Parcel Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            No registered land properties found for person {person.id}.
          </div>
        )}
      </div>

      {/* Grid: My Requests & My Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Service Applications */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <Send className="w-4 h-4 text-emerald-400" />
            <span>My Active Service Applications ({myRequests.length})</span>
          </h3>
          {myRequests.map((req) => (
            <div key={req.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-emerald-400 font-mono">{req.id}</span>
                <span className="text-amber-400">{req.status}</span>
              </div>
              <p className="font-semibold text-slate-200">{req.serviceType}</p>
              <p className="text-slate-400">Target Parcel: <span className="font-mono text-slate-300">{req.ulpin}</span></p>
            </div>
          ))}
        </div>

        {/* My Land Documents */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>My Verified Documents ({myDocuments.length})</span>
          </h3>
          {myDocuments.map((doc) => (
            <div key={doc.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-200">{doc.documentType}</p>
                <p className="text-slate-400 font-mono text-[11px]">{doc.documentNumber} ({doc.documentDate})</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                {doc.verificationStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
