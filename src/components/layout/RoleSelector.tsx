import React from 'react';
import { UserRole } from '../../types';
import { UserCog, ShieldCheck, Briefcase, UserCheck, User } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onSelectRole }) => {
  const roles: { id: UserRole; label: string; icon: any; desc: string }[] = [
    { id: 'consultant', label: 'HR Consultant', icon: Briefcase, desc: 'Multi-client practice view' },
    { id: 'super_admin', label: 'Super Admin', icon: ShieldCheck, desc: 'Full platform management' },
    { id: 'company_admin', label: 'Client Admin', icon: UserCog, desc: 'Single company HR lead' },
    { id: 'manager', label: 'Manager', icon: UserCheck, desc: 'Team & leave approver' },
    { id: 'employee', label: 'Employee ESS', icon: User, desc: 'Self-service portal' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-2 px-1">
        <span>Active User Perspective:</span>
        <span className="text-emerald-400 font-mono capitalize">{currentRole.replace('_', ' ')}</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {roles.map(r => {
          const Icon = r.icon;
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={r.desc}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
