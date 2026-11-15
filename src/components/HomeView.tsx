import React from 'react';
import { Plus, Users, ArrowRight, Shield, Wallet, Clock, Sparkles } from 'lucide-react';
import { Group, Language, User } from '../types';
import { t } from '../i18n/translations';
import { storage } from '../services/storage';

interface Props {
  groups: Group[];
  currentUser: User;
  language: Language;
  onSelectGroup: (groupId: string) => void;
  onOpenCreateGroup: () => void;
  onNavigateJoin: () => void;
}

export const HomeView: React.FC<Props> = ({
  groups,
  currentUser,
  language,
  onSelectGroup,
  onOpenCreateGroup,
  onNavigateJoin,
}) => {
  const memberships = storage.getMemberships();

  // Compute stats across groups the user is member of
  const myMemberships = memberships.filter(
    (m) => m.user_id === currentUser.id && m.status === 'active'
  );

  let totalPersonalContributed = 0;
  let totalPersonalOwed = 0;

  for (const m of myMemberships) {
    const grp = groups.find((g) => g.id === m.group_id);
    if (grp) {
      const summary = storage.computeMemberSummary(m, grp);
      totalPersonalContributed += summary.totalContributed;
      totalPersonalOwed += summary.amountOwed;
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome & Summary Strip */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Habari, {currentUser.name.split(' ')[0]}!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-display">
            {t('appName', language)}
          </h2>
          <p className="mt-1 text-sm text-emerald-100/80">
            {t('appTagline', language)}
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-700/50">
            <div>
              <p className="text-xs text-emerald-200/70">{t('yourBalance', language)}</p>
              <p className="text-xl sm:text-2xl font-bold font-display tabular-nums mt-0.5">
                KSh {totalPersonalContributed.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-emerald-200/70">{t('amountOwed', language)}</p>
              <p className={`text-xl sm:text-2xl font-bold font-display tabular-nums mt-0.5 ${totalPersonalOwed > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                KSh {totalPersonalOwed.toLocaleString()}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-emerald-200/70">Joined Chamas</p>
              <p className="text-xl sm:text-2xl font-bold font-display tabular-nums mt-0.5">
                {myMemberships.length} Active
              </p>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-emerald-600/10 pointer-events-none blur-2xl" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            {t('groups', language)}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a chama to view member ledger, log payments, or view your stats
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateJoin}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('joinGroup', language)}</span>
          </button>

          <button
            onClick={onOpenCreateGroup}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('createGroup', language)}</span>
          </button>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {groups.map((group) => {
          const groupMemberships = storage.getMembershipsForGroup(group.id);
          const activeCount = groupMemberships.filter((m) => m.status === 'active').length;
          const pendingCount = groupMemberships.filter((m) => m.status === 'pending').length;
          const userMembership = groupMemberships.find((m) => m.user_id === currentUser.id);

          const financials = storage.computeGroupFinancials(group.id);

          return (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className="group cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {group.plan}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {group.frequency === 'weekly' ? t('weekly', language) : t('monthly', language)}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {group.name}
                  </h4>
                </div>

                {userMembership ? (
                  <span
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full shrink-0 ${
                      userMembership.role === 'admin'
                        ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                        : userMembership.role === 'treasurer'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {userMembership.role.toUpperCase()}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Not Joined
                  </span>
                )}
              </div>

              {/* Dynamic computed total pot */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {t('totalBalance', language)} (Group Pot)
                  </span>
                  <span className="text-xl font-bold font-display tabular-nums text-slate-900 dark:text-white">
                    KSh {financials.totalBalance.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {t('targetAmount', language)}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    KSh {group.expected_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Footer row with members count, pending badge, and chevron */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{activeCount} {t('activeMembers', language)}</span>
                  </span>
                  {pendingCount > 0 && userMembership && (userMembership.role === 'admin' || userMembership.role === 'treasurer') && (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                      <Clock className="w-3 h-3" />
                      {pendingCount} pending
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
