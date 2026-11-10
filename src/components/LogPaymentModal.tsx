import React, { useState, useEffect } from 'react';
import { X, Smartphone, AlertTriangle, ShieldCheck, Check, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Entry, EntryType, Group, Language, MemberSummary, ParsedMpesa } from '../types';
import { t } from '../i18n/translations';
import { storage } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  members: MemberSummary[];
  language: Language;
  onEntryLogged: (entry: Entry) => void;
  initialParsed?: ParsedMpesa | null;
  onOpenMpesaParser: () => void;
  isOnline: boolean;
}

export const LogPaymentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  group,
  members,
  language,
  onEntryLogged,
  initialParsed,
  onOpenMpesaParser,
  isOnline,
}) => {
  const [activeTab, setActiveTab] = useState<EntryType>('contribution');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [amount, setAmount] = useState<number>(group.expected_amount);
  const [note, setNote] = useState('');
  const [adjustmentDirection, setAdjustmentDirection] = useState<'credit' | 'debit'>('credit');
  const [validationError, setValidationError] = useState('');

  // Active members only for logging payments
  const activeMembers = members.filter((m) => m.membership.status === 'active');

  useEffect(() => {
    if (activeMembers.length > 0 && !selectedMemberId) {
      setSelectedMemberId(activeMembers[0].membership.id);
    }
  }, [activeMembers, selectedMemberId]);

  // When initialParsed changes (e.g. from M-Pesa SMS parser modal), populate fields
  useEffect(() => {
    if (initialParsed) {
      if (initialParsed.amount > 0) {
        setAmount(initialParsed.amount);
      }
      if (initialParsed.matchedMemberId) {
        setSelectedMemberId(initialParsed.matchedMemberId);
      }
      const noteParts: string[] = [];
      if (initialParsed.receiptCode) {
        noteParts.push(`M-PESA: ${initialParsed.receiptCode}`);
      }
      if (initialParsed.senderName) {
        noteParts.push(`From: ${initialParsed.senderName}`);
      }
      if (initialParsed.phone) {
        noteParts.push(`(${initialParsed.phone})`);
      }
      setNote(noteParts.join(' '));
      setActiveTab('contribution');
    }
  }, [initialParsed]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedMemberId) {
      setValidationError('Please select a member.');
      return;
    }

    if (amount <= 0 && activeTab !== 'adjustment') {
      setValidationError('Amount must be greater than zero.');
      return;
    }

    if (activeTab === 'adjustment' && !note.trim()) {
      setValidationError('A clear explanation note is required for ledger adjustments.');
      return;
    }

    // Client ID for idempotency across offline queues
    const client_id = `cid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    let finalAmount = Math.abs(amount);
    if (activeTab === 'adjustment') {
      finalAmount = adjustmentDirection === 'debit' ? -Math.abs(amount) : Math.abs(amount);
    }

    const newEntry = storage.appendEntry({
      client_id,
      group_id: group.id,
      member_id: selectedMemberId,
      type: activeTab,
      amount: finalAmount,
      note: note.trim() || `${activeTab.toUpperCase()} logged`,
      isOffline: !isOnline,
    });

    // Gentle celebration on successful contribution
    if (activeTab === 'contribution' && typeof confetti === 'function') {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#059669', '#10b981', '#f59e0b'],
        });
      } catch (err) {
        // Safe confetti fallback
      }
    }

    onEntryLogged(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('logPayment', language)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {group.name} · {group.plan}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Indicator in Modal */}
        {!isOnline && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <Clock className="w-4 h-4 shrink-0 text-amber-500 animate-spin" />
            <span>
              {t('offlineBannerText', language)}
            </span>
          </div>
        )}

        {/* Entry Type Selector Tabs */}
        <div className="mt-4 grid grid-cols-4 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('contribution');
              setAmount(group.expected_amount);
            }}
            className={`py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'contribution'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t('contribution', language)}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('fine');
              setAmount(200);
            }}
            className={`py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'fine'
                ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t('fine', language)}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('payout');
              setAmount(group.expected_amount * Math.max(1, activeMembers.length - 1));
            }}
            className={`py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'payout'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t('payout', language)}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('adjustment');
              setAmount(100);
            }}
            className={`py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'adjustment'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t('adjustment', language)}
          </button>
        </div>

        {/* Append-Only Notice */}
        <p className="mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t('appendOnlyNotice', language)}</span>
        </p>

        {/* M-Pesa SMS Trigger Button */}
        {activeTab === 'contribution' && (
          <div className="mt-3">
            <button
              type="button"
              onClick={onOpenMpesaParser}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
            >
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('parseMpesa', language)}</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Member Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('selectMember', language)} *
            </label>
            <select
              required
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            >
              {activeMembers.map((m) => (
                <option key={m.membership.id} value={m.membership.id}>
                  {m.user.name} ({m.user.phone}) — {m.membership.role.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Adjustment Direction Selector */}
          {activeTab === 'adjustment' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('adjustmentTypePrompt', language)} *
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAdjustmentDirection('credit')}
                  className={`p-2.5 rounded-xl border font-medium text-left transition ${
                    adjustmentDirection === 'credit'
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">+ Credit (Add to balance)</p>
                  <p className="text-[11px] opacity-75 mt-0.5">e.g. member overpaid or interest bonus</p>
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentDirection('debit')}
                  className={`p-2.5 rounded-xl border font-medium text-left transition ${
                    adjustmentDirection === 'debit'
                      ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <p className="font-semibold text-rose-600 dark:text-rose-400">- Debit (Deduct from balance)</p>
                  <p className="text-[11px] opacity-75 mt-0.5">e.g. reversing a mistake or manual debit</p>
                </button>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('enterAmount', language)} *
              </label>
              {activeTab === 'contribution' && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Expected: KSh {group.expected_amount.toLocaleString()} ({group.frequency})
                </span>
              )}
            </div>
            <input
              type="number"
              min="1"
              step="10"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-base font-bold tabular-nums rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Note / M-Pesa Receipt Code / Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {activeTab === 'adjustment'
                ? `${t('adjustmentReason', language)} *`
                : activeTab === 'fine'
                ? `${t('fineReason', language)} *`
                : t('enterNote', language)}
            </label>
            <input
              type="text"
              required={activeTab === 'adjustment'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                activeTab === 'adjustment'
                  ? 'e.g. Corrected over-payment recorded on last meeting'
                  : activeTab === 'fine'
                  ? 'e.g. Late arrival 30 mins to Sunday meeting'
                  : 'e.g. M-PESA Code QA12BC34DE / Cash receipt'
              }
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {validationError && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('logPayment', language)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
