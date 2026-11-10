import React from 'react';
import { User as UserIcon, Globe, Moon, Sun, Smartphone, ShieldCheck, RefreshCw } from 'lucide-react';
import { Language, User } from '../types';
import { t } from '../i18n/translations';
import { storage } from '../services/storage';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  currentUser: User;
  onUserChanged: (user: User) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isOnline: boolean;
  onResetData: () => void;
}

export const ProfileView: React.FC<Props> = ({
  currentUser,
  onUserChanged,
  language,
  onLanguageChange,
  isDark,
  onToggleTheme,
  isOnline,
  onResetData,
}) => {
  const allUsers = storage.getUsers();

  const handleSelectUser = (user: User) => {
    storage.setCurrentUser(user.id);
    onUserChanged(user);
    if (user.language && user.language !== language) {
      onLanguageChange(user.language);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6 animate-in fade-in duration-200">
      {/* User Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
            {currentUser.avatar || '👤'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {currentUser.phone}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified M-Pesa Chama Member</span>
            </p>
          </div>
        </div>
      </div>

      {/* Switch Persona for Demo / Role Testing */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              {t('switchUser', language)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('switchUserDesc', language)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {allUsers.map((u) => {
            const isSelected = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                onClick={() => handleSelectUser(u)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg">{u.avatar || '👤'}</span>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {u.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">{u.phone}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language & Theme Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          App Preferences & Localization
        </h3>

        {/* Dual Language Toggle (English / Swahili) */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Language / Lugha
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                English or Kiswahili localization
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg transition ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('sw')}
              className={`px-3 py-1.5 rounded-lg transition ${
                language === 'sw'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Kiswahili
            </button>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {isDark ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Display Theme
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isDark ? 'Dark mode enabled' : 'Light mode enabled'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleTheme}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            {isDark ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* PWA Section */}
        <div className="pt-2">
          <PWAInstallButton language={language} variant="banner" />
        </div>
      </div>

      {/* Reset Data Helper */}
      <div className="p-5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Reset Demo Data
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            Restores initial Kenyan demo chamas, ledger entries, and users.
          </p>
        </div>
        <button
          onClick={onResetData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
