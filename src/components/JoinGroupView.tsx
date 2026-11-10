import React, { useState } from 'react';
import { UserPlus, Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Group, Language, User } from '../types';
import { t } from '../i18n/translations';
import { storage } from '../services/storage';

interface Props {
  currentUser: User;
  language: Language;
  onJoinSuccess: (group: Group) => void;
  onNavigateHome: () => void;
}

export const JoinGroupView: React.FC<Props> = ({
  currentUser,
  language,
  onJoinSuccess,
  onNavigateHome,
}) => {
  const [joinCode, setJoinCode] = useState('');
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [error, setError] = useState('');
  const [submittedGroup, setSubmittedGroup] = useState<Group | null>(null);

  const existingGroups = storage.getGroups();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const targetGroup = storage.getGroupByJoinCode(joinCode);
    if (!targetGroup) {
      setError(t('groupNotFound', language));
      return;
    }

    // Check if user is already a member
    const existingMembership = storage.getMembership(targetGroup.id, currentUser.id);
    if (existingMembership) {
      if (existingMembership.status === 'active') {
        setError(t('alreadyMember', language));
        return;
      }
      // If already pending, show state
      setSubmittedGroup(targetGroup);
      return;
    }

    // Update user profile details if modified
    if (name.trim() !== currentUser.name || phone.trim() !== currentUser.phone) {
      storage.updateUser({
        ...currentUser,
        name: name.trim(),
        phone: phone.trim(),
      });
    }

    // Create pending membership
    storage.createMembership({
      user_id: currentUser.id,
      group_id: targetGroup.id,
      role: 'member',
      status: 'pending',
    });

    setSubmittedGroup(targetGroup);
    onJoinSuccess(targetGroup);
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <UserPlus className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
          {t('joinGroup', language)}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Enter the unique 6-character code provided by your Chama Treasurer or Chairperson.
        </p>
      </div>

      {submittedGroup ? (
        /* Pending State Feedback Card */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7 animate-pulse" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              {t('waitingToSync', language) === 'Inasubiri Kusawazishwa' ? 'Inasubiri Uidhinishaji' : 'Waiting for Treasurer approval'}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-2">
              {submittedGroup.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {t('waitingApprovalNotice', language)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs text-left text-slate-600 dark:text-slate-300 space-y-1.5 border border-slate-100 dark:border-slate-800">
            <p className="flex justify-between">
              <span className="text-slate-400">Chama Plan:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{submittedGroup.plan}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">{t('targetAmount', language)}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                KSh {submittedGroup.expected_amount.toLocaleString()} ({submittedGroup.frequency})
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Applicant:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{name} ({phone})</span>
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 transition"
            >
              <span>Go to My Chamas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Join Form */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Quick Demo Code helper chips */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Available Demo Chama Codes (Tap to autofill):
            </p>
            <div className="flex flex-wrap gap-2">
              {existingGroups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setJoinCode(g.join_code)}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-emerald-500 transition"
                >
                  {g.join_code} ({g.name.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('enterJoinCode', language)} *
              </label>
              <input
                type="text"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. UMO-789"
                className="w-full px-3.5 py-2.5 text-base font-mono font-bold uppercase tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('enterYourName', language)} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mama Brian Wanjiku"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('enterYourPhone', language)} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712345678"
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('submitJoinRequest', language)}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
