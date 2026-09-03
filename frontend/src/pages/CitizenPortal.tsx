import React, { useState } from 'react';
import { Search, ShieldCheck, FileText, Send, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';
import { ServiceRequest } from '../types';

interface CitizenPortalProps {
  onSearchParcel: (ulpin: string) => void;
  serviceRequests: ServiceRequest[];
  onSubmitRequest: (req: { ulpin: string; serviceType: string; applicantName: string }) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  onSearchParcel,
  serviceRequests,
  onSubmitRequest
}) => {
  const [searchUlpin, setSearchUlpin] = useState('');
  const [newUlpin, setNewUlpin] = useState('AP-VSKP-000123');
  const [serviceType, setServiceType] = useState('Ownership Verification');
  const [applicantName, setApplicantName] = useState('Ramesh Kumar');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUlpin || !applicantName) return;

    onSubmitRequest({
      ulpin: newUlpin.toUpperCase(),
      serviceType,
      applicantName
    });

    setSubmittedMessage(`Service Request for ${newUlpin} submitted successfully! Ref: REQ-2026-NEW`);
    setTimeout(() => setSubmittedMessage(''), 5000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 text-slate-100 overflow-y-auto h-full">
      {/* Hero Search Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>BhoomiSetu Citizen Public Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Transparent Land Records & Parcel Verification
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Instantly verify ownership, check encumbrance status, view master plan zoning, and submit citizen service requests indexed by ULPIN.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1.5 shadow-inner">
          <Search className="w-5 h-5 text-slate-400 ml-3" />
          <input
            type="text"
            value={searchUlpin}
            onChange={(e) => setSearchUlpin(e.target.value)}
            placeholder="Enter ULPIN (e.g. AP-VSKP-000123) or Survey #"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => onSearchParcel(searchUlpin || 'AP-VSKP-000123')}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs rounded-lg transition"
          >
            Locate Parcel on GIS
          </button>
        </div>
      </div>

      {/* Grid: Submit Service Request & Service Request Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form: Submit Citizen Request */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Send className="w-5 h-5 text-emerald-400" />
            <span>Submit Citizen Land Service Request</span>
          </h2>
          {submittedMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold">
              {submittedMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Target Parcel ULPIN</label>
              <input
                type="text"
                value={newUlpin}
                onChange={(e) => setNewUlpin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Service Request Category</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Ownership Verification">Ownership Record Verification</option>
                <option value="Mutation Request">Land Mutation Request (Adangal 1B)</option>
                <option value="Building Permit Status">Building Permit Approval Inquiry</option>
                <option value="Property Tax Query">Property Tax Assessment Correction</option>
                <option value="Record Correction">Cadastral Boundary Record Correction</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Applicant Name</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow mt-2"
            >
              Submit Request to Department
            </button>
          </form>
        </div>

        {/* Live Service Request Tracker */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Track Live Service Applications</span>
          </h2>

          <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
            {serviceRequests.map((req) => (
              <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-400 font-mono">{req.id}</span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    {req.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-200">{req.serviceType}</p>
                <p className="text-slate-400">ULPIN: <span className="font-mono text-slate-300">{req.ulpin}</span> | Applicant: <span className="text-slate-300">{req.applicantName}</span></p>
                <p className="text-slate-500 text-[11px]">Assigned: {req.assignedDepartment} (Submitted: {req.submittedDate})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
