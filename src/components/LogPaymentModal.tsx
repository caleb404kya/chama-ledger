import React, { useState, useEffect } from 'react';
import { X, Smartphone, AlertTriangle, ShieldCheck, Check, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Entry, EntryType, Group, Language, MemberSummary, ParsedMpesa } from '../types';
import { t } from '../i18n/translations';

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Block a second entry for an M-Pesa code that is already recorded
    const finalNote = note.trim() || `${activeTab.toUpperCase()} logged`;
    
    // Check for duplicate receipt code using note text
    const codeMatch = finalNote.match(/M-PESA:\s*([A-Z0-9]{10})\b/i);
    if (codeMatch) {
      // Check if any entry has this receipt code in the note
      const { getEntriesForGroup } = await import('../services/api');
      const entries = await getEntriesForGroup(group.id);
      const hasDuplicate = entries.some((e) => {
        const noteMatch = e.note.match(/M-PESA:\s*([A-Z0-9]{10})\b/i);
        return noteMatch && noteMatch[1] === codeMatch[1];
      });
      if (hasDuplicate) {
        setValidationError('This M-Pesa code is already recorded in the ledger. It was not saved again.');
        return;
      }
    }

    // Client ID for idempotency across offline queues
    const client_id = crypto.randomUUID();

    let finalAmount = Math.abs(amount);

    if (activeTab === 'adjustment') {
      if (!note.trim()) {
        setValidationError('A clear explanation note is required for ledger adjustments.');
        return;
      }
      finalAmount = adjustmentDirection === 'credit' ? Math.abs(amount) : -Math.abs(amount);
    }

    // Use the current user from the group's context or default
    const currentUserId = 'user_sarah'; // Default to Sarah (admin)
    
    const entryData: {
      client_id: string;
      group_id: string;
      member_id: string;
      type: 'contribution' | 'fine' | 'payout' | 'adjustment';
      amount: number;
      note: string;
      logged_by: string;
    } = {
      client_id,
      group_id: group.id,
      member_id: selectedMemberId,
      type: activeTab === 'adjustment' ? 'adjustment' : (activeTab === 'fine' ? 'fine' : 'contribution'),
      amount: finalAmount,
      note,
      logged_by: currentUserId,
    };

    try {
      const { appendEntry } = await import('../services/api');
      const savedEntry = await appendEntry(entryData);
      onEntryLogged(savedEntry);
      onClose();
    } catch (error: any) {
      if (error.message?.includes('unique constraint') || error.message?.includes('duplicate key')) {
        setValidationError('This M-Pesa code is already recorded in the ledger. It was not saved again.');
      } else {
        setValidationError('Error saving entry: ' + error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {t('logPayment', language)}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 dark:hover:bg-slate-100 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t('activeMember', language)}
            </span>
          </div>
        </div>

        {/* Active members only for logging payments */}
        {activeMembers.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
            <div>
              <p className="font-semibold">{t('chamaName', language)}</p>
              <p className="opacity-80 text-[11px] mt-0.5">
                Target contribution amount & frequency are locked at creation to maintain ledger consistency across all cycles.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chama Name *
            </label>
            <input
              type="text"
              required
              value={group.name}
              placeholder="e.g. Umoja Women Savings Group"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('enterAmount', language)} *
            </label>
            <input
              type="number"
              min="1"
              step="10"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-base font-bold tabular-nums rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            {activeTab === 'contribution' && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Expected: KSh {group.expected_amount.toLocaleString()} ({group.frequency})
              </span>
            )}
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
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
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
