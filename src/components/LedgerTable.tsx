import React, { useState } from 'react';
import { Clock, ShieldCheck, Search, Filter } from 'lucide-react';
import { Entry, EntryType, Language, MemberSummary, User } from '../types';
import { t } from '../i18n/translations';

interface Props {
  entries: Entry[];
  members: MemberSummary[];
  users: User[];
  language: Language;
}

export const LedgerTable: React.FC<Props> = ({
  entries,
  members,
  users,
  language,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const memberMap = new Map<string, MemberSummary>(
    members.map((m) => [m.membership.id, m])
  );
  const userMap = new Map<string, User>(users.map((u) => [u.id, u]));

  const filteredEntries = entries.filter((e) => {
    if (filterType !== 'all' && e.type !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const mem = memberMap.get(e.member_id);
      const name = mem?.user.name.toLowerCase() || '';
      const phone = mem?.user.phone || '';
      const note = e.note.toLowerCase();
      return name.includes(q) || phone.includes(q) || note.includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('allEntries', language)}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
              {entries.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t('appendOnlyNotice', language)}</span>
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, phone, note..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 w-44 sm:w-52"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('contribution')}
              className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${
                filterType === 'contribution'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t('contribution', language)}
            </button>
            <button
              onClick={() => setFilterType('fine')}
              className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${
                filterType === 'fine'
                  ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t('fine', language)}
            </button>
            <button
              onClick={() => setFilterType('adjustment')}
              className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${
                filterType === 'adjustment'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t('adjustment', language)}
            </button>
          </div>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('emptyLedger', language)}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs mt-3">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] font-medium">
                <th className="py-2.5 px-3">{t('date', language)}</th>
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">{t('type', language)}</th>
                <th className="py-2.5 px-3 text-right">{t('amount', language)}</th>
                <th className="py-2.5 px-3">M-Pesa Code / Reason / Note</th>
                <th className="py-2.5 px-3">Logged By</th>
                <th className="py-2.5 px-3 text-center">Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredEntries.map((e) => {
                const mem = memberMap.get(e.member_id);
                const loggedByUser = userMap.get(e.logged_by);

                return (
                  <tr
                    key={e.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {new Date(e.timestamp).toLocaleDateString()}{' '}
                      <span className="text-[10px] text-slate-400">
                        {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {mem?.user.name || 'Member'}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {mem?.user.phone}
                      </p>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block font-semibold capitalize ${
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
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap font-bold tabular-nums">
                      <span
                        className={
                          e.type === 'fine'
                            ? 'text-rose-600 dark:text-rose-400'
                            : e.type === 'payout'
                            ? 'text-amber-600 dark:text-amber-400'
                            : e.amount < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }
                      >
                        {e.amount > 0 ? '+' : ''}KSh {Math.abs(e.amount).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {e.note}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {loggedByUser?.name || 'Treasurer'}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {e.sync_status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold text-[10px]">
                          <Clock className="w-2.5 h-2.5 animate-spin" />
                          {t('waitingToSync', language)}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Synced
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
