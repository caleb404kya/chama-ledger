import React, { useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Plus,
  Smartphone,
  Shield,
  Users,
  FileText,
  Clock,
  UserCheck,
  UserCog,
  AlertCircle,
} from 'lucide-react';
import { Group, Language, MemberSummary, ParsedMpesa, User } from '../types';
import { t } from '../i18n/translations';
import { storage } from '../services/storage';
import { exportLedgerToCsv } from '../utils/csvExport';
import { MemberStatsCard } from './MemberStatsCard';
import { LedgerTable } from './LedgerTable';
import { LogPaymentModal } from './LogPaymentModal';
import { MpesaParserModal } from './MpesaParserModal';
import { MemberApprovalModal } from './MemberApprovalModal';
import { RoleManagementModal } from './RoleManagementModal';

interface Props {
  group: Group;
  currentUser: User;
  language: Language;
  onBack: () => void;
  isOnline: boolean;
}

export const GroupDetailView: React.FC<Props> = ({
  group,
  currentUser,
  language,
  onBack,
  isOnline,
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'ledger' | 'my_card'>('members');
  const [isLogPaymentOpen, setIsLogPaymentOpen] = useState(false);
  const [isMpesaParserOpen, setIsMpesaParserOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [parsedDataForForm, setParsedDataForForm] = useState<ParsedMpesa | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [, setRefreshKey] = useState(0);

  const forceRefresh = () => setRefreshKey((k) => k + 1);

  // Compute live data
  const memberships = storage.getMembershipsForGroup(group.id);
  const currentMembership = memberships.find((m) => m.user_id === currentUser.id);

  const memberSummaries = storage.getGroupMemberSummaries(group.id);
  const activeMembers = memberSummaries.filter((m) => m.membership.status === 'active');
  const pendingMembers = memberSummaries.filter((m) => m.membership.status === 'pending');

  const financials = storage.computeGroupFinancials(group.id);
  const entries = storage.getEntriesForGroup(group.id);
  const users = storage.getUsers();

  // Role permissions
  const role = currentMembership?.role || 'member';
  const isMemberActive = currentMembership?.status === 'active';
  const isAdmin = isMemberActive && role === 'admin';
  const isTreasurer = isMemberActive && (role === 'treasurer' || role === 'admin');
  const isRegularMemberOnly = isMemberActive && role === 'member';

  // My personal stats summary
  const mySummary = currentMembership
    ? storage.computeMemberSummary(currentMembership, group)
    : undefined;
  const myPersonalEntries = currentMembership
    ? storage.getEntriesForMember(currentMembership.id)
    : [];

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(group.join_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportCsv = () => {
    if (!isAdmin) return;
    exportLedgerToCsv(group, entries, memberships, users);
  };

  const handleApplyParsedSms = (parsed: ParsedMpesa) => {
    setParsedDataForForm(parsed);
    setIsLogPaymentOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Quick Back Button */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('groups', language)}</span>
        </button>

        {/* Join Code Chip with 1-click Copy */}
        <button
          onClick={handleCopyJoinCode}
          title={t('copyCode', language)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 transition"
        >
          <span className="text-[11px] font-sans font-normal text-slate-400">Code:</span>
          <span>{group.join_code}</span>
          {copiedCode ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Group Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {group.plan}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {group.frequency === 'weekly' ? t('weekly', language) : t('monthly', language)}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Due: {group.due_day}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display mt-1 tracking-tight">
              {group.name}
            </h2>

            {group.description && (
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                {group.description}
              </p>
            )}

            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Your Role:</span>
              <span
                className={`font-semibold capitalize px-2.5 py-0.5 rounded-full text-[11px] ${
                  role === 'admin'
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                    : role === 'treasurer'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {role}
              </span>
              {!isMemberActive && (
                <span className="text-amber-600 text-[11px] font-semibold">
                  ({t('statusPending', language)})
                </span>
              )}
            </div>
          </div>

          {/* Group Financial Summary (Computed dynamically: SUM(entries)) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-6 shrink-0">
            <div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                {t('totalBalance', language)} (Group Pot)
              </p>
              <p className="text-2xl sm:text-3xl font-bold font-display tabular-nums text-emerald-950 dark:text-emerald-100 mt-0.5">
                KSh {financials.totalBalance.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">
                Sum of {financials.entriesCount} ledger transactions
              </p>
            </div>

            <div className="hidden sm:block border-l border-emerald-200 dark:border-emerald-800 pl-6 text-xs text-slate-600 dark:text-slate-400">
              <p className="text-[11px] text-slate-400">{t('targetAmount', language)}</p>
              <p className="text-base font-bold font-display tabular-nums text-slate-900 dark:text-white mt-0.5">
                KSh {group.expected_amount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 capitalize">{group.frequency}</p>
            </div>
          </div>
        </div>

        {/* Action Controls for Admin & Treasurer */}
        {isTreasurer && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setParsedDataForForm(null);
                  setIsLogPaymentOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-xs transition whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('logPayment', language)}</span>
              </button>

              <button
                onClick={() => setIsMpesaParserOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl transition whitespace-nowrap"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('parseMpesa', language)}</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setIsApprovalOpen(true)}
                    className="relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition whitespace-nowrap"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{t('approveMember', language)}</span>
                    {pendingMembers.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                        {pendingMembers.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setIsRoleModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition whitespace-nowrap"
                  >
                    <UserCog className="w-3.5 h-3.5" />
                    <span>{t('manageRoles', language)}</span>
                  </button>
                </>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('exportCsv', language)}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main View Area: Role-Based Access Control (RBAC) */}
      {!isMemberActive ? (
        /* Pending User View */
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            {t('statusPending', language)}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {t('waitingApprovalNotice', language)}
          </p>
        </div>
      ) : isRegularMemberOnly ? (
        /* Regular Member View: Restricted strictly to personal card per RBAC rule */
        mySummary ? (
          <MemberStatsCard
            group={group}
            summary={mySummary}
            personalEntries={myPersonalEntries}
            language={language}
          />
        ) : null
      ) : (
        /* Admin & Treasurer Full View */
        <div className="space-y-4">
          {/* Segmented Control Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition ${
                activeTab === 'members'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('members', language)} ({activeMembers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition ${
                activeTab === 'ledger'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('ledger', language)} ({entries.length})</span>
            </button>

            {mySummary && (
              <button
                onClick={() => setActiveTab('my_card')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition ${
                  activeTab === 'my_card'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>My Personal Stats</span>
              </button>
            )}
          </div>

          {activeTab === 'members' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                    {t('activeMembers', language)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Contribution totals and computed arrears
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] font-medium">
                      <th className="py-2.5 px-3">Member</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3 text-right">Contributed</th>
                      <th className="py-2.5 px-3 text-right">{t('amountOwed', language)}</th>
                      <th className="py-2.5 px-3 text-right">{t('totalBalance', language)}</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {activeMembers.map((m) => {
                      const isArrears = m.amountOwed > 0;
                      return (
                        <tr
                          key={m.membership.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                        >
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{m.user.avatar || '👤'}</span>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {m.user.name}
                                </p>
                                <p className="text-[11px] font-mono text-slate-400">
                                  {m.user.phone}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                m.membership.role === 'admin'
                                  ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                  : m.membership.role === 'treasurer'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {m.membership.role}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap font-bold tabular-nums text-slate-900 dark:text-white">
                            KSh {m.totalContributed.toLocaleString()}
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap font-bold tabular-nums">
                            <span
                              className={
                                isArrears
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }
                            >
                              KSh {m.amountOwed.toLocaleString()}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right whitespace-nowrap font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                            KSh {m.computedBalance.toLocaleString()}
                          </td>

                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {isArrears ? (
                              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                                {t('statusArrears', language)}
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                {t('statusGoodStanding', language)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <LedgerTable
              entries={entries}
              members={memberSummaries}
              users={users}
              language={language}
            />
          )}

          {activeTab === 'my_card' && mySummary && (
            <MemberStatsCard
              group={group}
              summary={mySummary}
              personalEntries={myPersonalEntries}
              language={language}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <LogPaymentModal
        isOpen={isLogPaymentOpen}
        onClose={() => setIsLogPaymentOpen(false)}
        group={group}
        members={memberSummaries}
        language={language}
        onEntryLogged={() => forceRefresh()}
        initialParsed={parsedDataForForm}
        onOpenMpesaParser={() => {
          setIsLogPaymentOpen(false);
          setIsMpesaParserOpen(true);
        }}
        isOnline={isOnline}
      />

      <MpesaParserModal
        isOpen={isMpesaParserOpen}
        onClose={() => setIsMpesaParserOpen(false)}
        members={memberSummaries}
        language={language}
        onApplyParsed={handleApplyParsedSms}
      />

      <MemberApprovalModal
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        pendingMembers={pendingMembers}
        language={language}
        onMemberApproved={() => forceRefresh()}
      />

      <RoleManagementModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        members={memberSummaries}
        language={language}
        onRoleUpdated={() => forceRefresh()}
      />
    </div>
  );
};
