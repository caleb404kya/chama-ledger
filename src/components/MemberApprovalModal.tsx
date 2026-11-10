import React from 'react';
import { X, CheckCircle, UserCheck, Clock } from 'lucide-react';
import { Language, MemberSummary } from '../types';
import { t } from '../i18n/translations';
import { storage } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pendingMembers: MemberSummary[];
  language: Language;
  onMemberApproved: (membershipId: string) => void;
}

export const MemberApprovalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pendingMembers,
  language,
  onMemberApproved,
}) => {
  if (!isOpen) return null;

  const handleApprove = (membershipId: string) => {
    storage.approveMembership(membershipId);
    onMemberApproved(membershipId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t('pendingApprovals', language)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pendingMembers.length} member(s) waiting
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

        <div className="mt-4 space-y-3">
          {pendingMembers.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              {t('noPendingRequests', language)}
            </div>
          ) : (
            pendingMembers.map((m) => (
              <div
                key={m.membership.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.user.avatar || '👤'}</span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {m.user.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {m.user.phone}
                  </p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Requested: {new Date(m.membership.joined_at).toLocaleDateString()}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleApprove(m.membership.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-xs transition shrink-0"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{t('approveMember', language)}</span>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
