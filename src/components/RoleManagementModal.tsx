import React, { useState } from 'react';
import { X, Shield, AlertTriangle, Check, UserCog } from 'lucide-react';
import { Language, MemberSummary, Role } from '../types';
import { t } from '../i18n/translations';
import { storage } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  members: MemberSummary[];
  language: Language;
  onRoleUpdated: () => void;
}

export const RoleManagementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  members,
  language,
  onRoleUpdated,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const activeMembers = members.filter((m) => m.membership.status === 'active');

  const handleRoleChange = (membershipId: string, newRole: Role) => {
    setErrorMessage('');
    setSuccessMessage('');

    const res = storage.updateMemberRole(membershipId, newRole);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to update role.');
    } else {
      setSuccessMessage('Member role updated successfully.');
      onRoleUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserCog className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t('manageRoles', language)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('assignTreasurer', language)} & RBAC permissions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule reminder */}
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
          <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p>{t('keepOneAdminNotice', language)}</p>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto">
          {activeMembers.map((m) => (
            <div
              key={m.membership.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {m.user.name}
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {m.user.phone}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  value={m.membership.role}
                  onChange={(e) => handleRoleChange(m.membership.id, e.target.value as Role)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="admin">{t('roleAdmin', language)}</option>
                  <option value="treasurer">{t('roleTreasurer', language)}</option>
                  <option value="member">{t('roleMember', language)}</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
