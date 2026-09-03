import React from 'react';
import { ShieldCheck, UserCheck, Bell, Search, Globe, LogIn } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  currentState: string;
  onStateChange: (stateCode: string) => void;
  currentRole: UserRole;
  userName: string;
  onOpenLoginModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentState,
  onStateChange,
  currentRole,
  userName,
  onOpenLoginModal,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-xl shadow-inner border border-emerald-400">
            భూ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wide text-lg text-white">DIGIBHOOMI</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                SIH26014 DPI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">One Parcel. One Identity. Connected Governance.</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
              placeholder="Universal Search by ULPIN (e.g. AP-VSKP-000123), Survey #, Owner, REQ-ID..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-24 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              onClick={onSearchSubmit}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* State Config Switcher & Role Login */}
        <div className="flex items-center space-x-3">
          {/* State Config Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentState}
              onChange={(e) => onStateChange(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="AP" className="bg-slate-800 text-white">Andhra Pradesh (Visakhapatnam)</option>
              <option value="TN" className="bg-slate-800 text-white">Tamil Nadu (Chennai)</option>
              <option value="KA" className="bg-slate-800 text-white">Karnataka (Bengaluru)</option>
              <option value="TS" className="bg-slate-800 text-white">Telangana (Hyderabad)</option>
              <option value="MH" className="bg-slate-800 text-white">Maharashtra (Pune)</option>
            </select>
          </div>

          {/* Active User Session & Login Button */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center space-x-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left hidden sm:block">
              <p className="text-[11px] leading-tight font-bold text-white">{userName}</p>
              <p className="text-[10px] leading-tight text-emerald-400">{currentRole}</p>
            </div>
            <LogIn className="w-3.5 h-3.5 ml-1 text-slate-400" />
          </button>

          {/* Notification Icon */}
          <div className="relative cursor-pointer p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
