import React, { useState } from 'react';
import { X, Lock, ShieldCheck, HelpCircle } from 'lucide-react';
import { ChamaPlan, Frequency, Group, Language } from '../types';
import { t } from '../i18n/translations';
import { storage } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (newGroup: Group) => void;
  language: Language;
}

export const CreateGroupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onGroupCreated,
  language,
}) => {
  const [name, setName] = useState('');
  const [expectedAmount, setExpectedAmount] = useState<number>(1500);
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [dueDay, setDueDay] = useState('Monday');
  const [plan, setPlan] = useState<ChamaPlan>('Merry-Go-Round');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || expectedAmount <= 0) return;

    const newGroup = storage.createGroup({
      name,
      expected_amount: expectedAmount,
      frequency,
      due_day: dueDay,
      plan,
      description,
    });

    onGroupCreated(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {t('createGroup', language)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('appTagline', language)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fixed Group Rule Banner */}
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{t('fixedRuleNotice', language)}</p>
            <p className="opacity-80 text-[11px] mt-0.5">
              Target contribution amount & frequency are locked at creation to maintain ledger consistency across all cycles.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chama Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Umoja Women Savings Group"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('targetAmount', language)} (KSh) *
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={expectedAmount}
                onChange={(e) => setExpectedAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm font-semibold tabular-nums rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('frequency', language)} *
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value="weekly">{t('weekly', language)}</option>
                <option value="monthly">{t('monthly', language)}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('dueDay', language)} *
              </label>
              <input
                type="text"
                required
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                placeholder={frequency === 'weekly' ? 'e.g. Every Monday' : 'e.g. 5th of each month'}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('planType', language)} *
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as ChamaPlan)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value="Merry-Go-Round">Merry-Go-Round (Mzunguko)</option>
                <option value="Investment">Investment Club (Wekeza)</option>
                <option value="Welfare/Table Banking">Welfare / Table Banking</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Purpose / Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Weekly table banking to support family businesses & emergency funds."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl shadow-sm transition"
            >
              {t('createGroup', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
