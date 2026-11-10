import React from 'react';
import { Calendar, CheckCircle2, AlertCircle, Shield, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Entry, Group, Language, MemberSummary } from '../types';
import { t } from '../i18n/translations';

interface Props {
  group: Group;
  summary: MemberSummary;
  personalEntries: Entry[];
  language: Language;
}

export const MemberStatsCard: React.FC<Props> = ({
  group,
  summary,
  personalEntries,
  language,
}) => {
  const isArrears = summary.amountOwed > 0;

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-3">
        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 dark:text-emerald-200">
          <p className="font-semibold">{t('memberRestrictedTitle', language)}</p>
          <p className="opacity-80 text-[11px] mt-0.5">
            {t('memberRestrictedSubtitle', language)}
          </p>
        </div>
      </div>

      {/* Main KPI Grid for Personal Member */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Your Total Contributed */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>{t('yourBalance', language)}</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-bold font-display tabular-nums text-slate-900 dark:text-white">
            KSh {summary.totalContributed.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {summary.entriesCount} payments recorded
          </p>
        </div>

        {/* Card 2: Amount Owed (Kiasi Unachodaiwa) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {t('amountOwed', language)}
            </span>
            {isArrears ? (
              <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <p
            className={`text-2xl font-bold font-display tabular-nums ${
              isArrears ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            KSh {summary.amountOwed.toLocaleString()}
          </p>
          <p className="text-xs font-medium mt-1">
            {isArrears ? (
              <span className="text-rose-600 dark:text-rose-400">{t('statusArrears', language)}</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">{t('statusGoodStanding', language)}</span>
            )}
          </p>
        </div>

        {/* Card 3: Next Due Date & Schedule */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>{t('nextDue', language)}</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xl font-bold font-display text-slate-900 dark:text-white truncate">
            {group.due_day}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Target: KSh {group.expected_amount.toLocaleString()} · {group.frequency}
          </p>
        </div>
      </div>

      {/* Personal Payment History Table (Restricted to this member only) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              {t('yourHistory', language)}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal payments & adjustments recorded by Treasurer
            </p>
          </div>
        </div>

        {personalEntries.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
            {t('noPersonalEntries', language)}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {personalEntries.map((e) => (
              <div key={e.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold capitalize ${
                        e.type === 'contribution'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : e.type === 'fine'
                          ? 'text-rose-600 dark:text-rose-400'
                          : e.type === 'payout'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {e.type === 'contribution'
                        ? t('contribution', language)
                        : e.type === 'fine'
                        ? t('fine', language)
                        : e.type === 'payout'
                        ? t('payout', language)
                        : t('adjustment', language)}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {new Date(e.timestamp).toLocaleDateString()}
                    </span>
                    {e.sync_status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        {t('waitingToSync', language)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] truncate mt-0.5">
                    {e.note}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-bold tabular-nums text-sm ${
                      e.type === 'payout' || e.amount < 0
                        ? 'text-slate-900 dark:text-white'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {e.amount > 0 ? '+' : ''}KSh {Math.abs(e.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
