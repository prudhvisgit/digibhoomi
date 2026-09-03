import { useState } from 'react';
import { Shield, X, CheckCircle2, User, Key } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: UserRole; personId?: string; department: string }) => void;
}

export const DEMO_ACCOUNTS: { name: string; email: string; role: UserRole; personId?: string; department: string; pass: string }[] = [
  // Government Officers
  { name: 'Admin System Manager', email: 'admin@digibhoomi.gov.in', role: 'SUPER_ADMIN', department: 'DPI Governance (Statewide AP)', pass: 'admin123' },
  { name: 'K. Venkatesh (Tahsildar)', email: 'revenue@digibhoomi.gov.in', role: 'REVENUE_OFFICER', department: 'Revenue & Land Records (Adangal 1B)', pass: 'revenue123' },
  { name: 'S. Anitha (Sub-Registrar)', email: 'registration@digibhoomi.gov.in', role: 'REGISTRATION_OFFICER', department: 'Registration & Stamps (CARD System)', pass: 'reg123' },
  { name: 'M. Chaitanya (Town Planner)', email: 'planning@digibhoomi.gov.in', role: 'PLANNING_OFFICER', department: 'VMRDA Master Plan & Urban Zoning', pass: 'plan123' },
  { name: 'P. Suresh (Tax Collector)', email: 'municipality@digibhoomi.gov.in', role: 'MUNICIPAL_OFFICER', department: 'Municipal Revenue & Property Tax', pass: 'muni123' },

  // 10+ Pre-Seeded Citizens mapped to specific Person IDs for Data Isolation testing
  { name: 'Arjun Rao (Citizen 1 - PER-001)', email: 'citizen1@digibhoomi.gov.in', role: 'CITIZEN', personId: 'PER-001', department: 'Citizen Portal (Owns Parcels 001, 007)', pass: 'citizen123' },
  { name: 'Sravani Devi (Citizen 2 - PER-002)', email: 'citizen2@digibhoomi.gov.in', role: 'CITIZEN', personId: 'PER-002', department: 'Citizen Portal (Owns Parcels 002, 009, 012)', pass: 'citizen123' },
  { name: 'Kiran Kumar (Citizen 3 - PER-003)', email: 'citizen3@digibhoomi.gov.in', role: 'CITIZEN', personId: 'PER-003', department: 'Citizen Portal (Owns Parcel 003)', pass: 'citizen123' },
  { name: 'Vijay Sharma (Citizen 4 - PER-004)', email: 'citizen4@digibhoomi.gov.in', role: 'CITIZEN', personId: 'PER-004', department: 'Citizen Portal (Owns Parcels 004, 011)', pass: 'citizen123' },
  { name: 'Anitha Reddy (Citizen 5 - PER-005)', email: 'citizen5@digibhoomi.gov.in', role: 'CITIZEN', personId: 'PER-005', department: 'Citizen Portal (Owns Parcels 005, 015)', pass: 'citizen123' },
  { name: 'Satyanarayana Raju (Citizen 6 - PER-006)', email: 'citizen6@digibhoomi.gov.in', role: 'CITIZEN', personId: 'PER-006', department: 'Citizen Portal (Owns Parcels 006, 018)', pass: 'citizen123' }
];

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const [selectedAcc, setSelectedAcc] = useState(DEMO_ACCOUNTS[5]); // Default: Citizen 1 (Arjun Rao)
  const [email, setEmail] = useState(DEMO_ACCOUNTS[5].email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS[5].pass);

  if (!isOpen) return null;

  const handleSelectAccount = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedAcc(acc);
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: selectedAcc.name,
      email: selectedAcc.email,
      role: selectedAcc.role,
      personId: selectedAcc.personId,
      department: selectedAcc.department
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">DigiBhoomi Identity & RBAC Login</h3>
              <p className="text-xs text-slate-400">Select Citizen Person or Government Department Officer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Quick Department / Citizen Picker */}
          <div className="space-y-2">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">
              1. Select Identity Scope
            </label>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((acc) => {
                const isSelected = selectedAcc.email === acc.email;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className={`w-full text-left p-2.5 rounded-xl border transition ${
                      isSelected
                        ? 'bg-emerald-600/20 border-emerald-500 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{acc.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{acc.department}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <label className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block">
                2. Authenticate Session
              </label>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Official Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-[11px]">
                Role Scope: <b>{selectedAcc.role}</b><br/>
                {selectedAcc.personId ? `Person ID: ${selectedAcc.personId}` : `Department: ${selectedAcc.department}`}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Login & Enforce Data Isolation</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
