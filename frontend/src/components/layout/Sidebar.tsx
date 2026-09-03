import React from 'react';
import {
  LogIn, LayoutDashboard, Map, Layers, FileText, Stamp,
  ShieldCheck, Building2, CheckSquare, Receipt, Scale,
  Users, BrainCircuit, ShieldAlert, User, Globe
} from 'lucide-react';
import { UserRole } from '../../types';

export type ActiveTab =
  | 'login'
  | 'my-digibhoomi'
  | 'ap-state-overview'
  | 'dashboard'
  | 'gis-map'
  | 'parcel-details'
  | 'ownership-ror'
  | 'registration'
  | 'encumbrance'
  | 'landuse-masterplan'
  | 'building-permission'
  | 'property-tax'
  | 'disputes'
  | 'citizen-services'
  | 'ai-analytics'
  | 'admin-panel';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenLoginModal: () => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenLoginModal,
  userRole
}) => {
  // All navigation definitions
  const allNavItems: { id: ActiveTab; label: string; icon: any; action?: () => void; roles: UserRole[] }[] = [
    { id: 'login', label: '1. Role Identity Login', icon: LogIn, action: onOpenLoginModal, roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'REVENUE_OFFICER', 'REGISTRATION_OFFICER', 'MUNICIPAL_OFFICER', 'PLANNING_OFFICER', 'TAX_OFFICER', 'UTILITY_OFFICER', 'ENVIRONMENT_OFFICER', 'CITIZEN'] },
    { id: 'my-digibhoomi', label: '★ MY DIGIBHOOMI', icon: User, roles: ['CITIZEN', 'SUPER_ADMIN'] },
    { id: 'ap-state-overview', label: 'Andhra Pradesh Overview', icon: Globe, roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'REVENUE_OFFICER'] },
    { id: 'dashboard', label: 'Department Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'REVENUE_OFFICER', 'REGISTRATION_OFFICER', 'PLANNING_OFFICER', 'MUNICIPAL_OFFICER', 'TAX_OFFICER'] },
    { id: 'gis-map', label: 'GIS Land Map', icon: Map, roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'REVENUE_OFFICER', 'REGISTRATION_OFFICER', 'PLANNING_OFFICER', 'MUNICIPAL_OFFICER', 'TAX_OFFICER', 'CITIZEN'] },
    { id: 'ownership-ror', label: 'Land Records & RoR', icon: FileText, roles: ['SUPER_ADMIN', 'REVENUE_OFFICER', 'CITIZEN'] },
    { id: 'registration', label: 'Deed Registrations', icon: Stamp, roles: ['SUPER_ADMIN', 'REGISTRATION_OFFICER', 'CITIZEN'] },
    { id: 'encumbrance', label: 'Encumbrance (EC)', icon: ShieldCheck, roles: ['SUPER_ADMIN', 'REGISTRATION_OFFICER', 'REVENUE_OFFICER', 'CITIZEN'] },
    { id: 'landuse-masterplan', label: 'Land Use & Zoning', icon: Building2, roles: ['SUPER_ADMIN', 'PLANNING_OFFICER', 'CITIZEN'] },
    { id: 'building-permission', label: 'Building Permits', icon: CheckSquare, roles: ['SUPER_ADMIN', 'PLANNING_OFFICER', 'MUNICIPAL_OFFICER', 'CITIZEN'] },
    { id: 'property-tax', label: 'Property Tax', icon: Receipt, roles: ['SUPER_ADMIN', 'MUNICIPAL_OFFICER', 'TAX_OFFICER', 'CITIZEN'] },
    { id: 'disputes', label: 'Court Disputes', icon: Scale, roles: ['SUPER_ADMIN', 'REVENUE_OFFICER', 'CITIZEN'] },
    { id: 'citizen-services', label: 'Citizen Services', icon: Users, roles: ['SUPER_ADMIN', 'REVENUE_OFFICER', 'MUNICIPAL_OFFICER', 'CITIZEN'] },
    { id: 'ai-analytics', label: 'AI Risk & Anomalies', icon: BrainCircuit, roles: ['SUPER_ADMIN', 'REVENUE_OFFICER', 'REGISTRATION_OFFICER', 'PLANNING_OFFICER'] },
    { id: 'admin-panel', label: 'Admin & Integrations', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'STATE_ADMIN'] }
  ];

  // Dynamically filter items for the active role
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex justify-between items-center">
          <span>{userRole === 'CITIZEN' ? 'Citizen Navigation' : `${userRole.replace('_', ' ')} Scope`}</span>
          <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
            {navItems.length} Sections
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isCitizenHighlight = item.id === 'my-digibhoomi';
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold shadow-md'
                  : isCitizenHighlight
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : isCitizenHighlight ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center justify-between font-medium">
          <span>Active Role</span>
          <span className="text-emerald-400 font-bold">{userRole}</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">RBAC & Jurisdiction Enforced</p>
      </div>
    </aside>
  );
};
