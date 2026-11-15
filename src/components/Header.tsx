import React from 'react';
import { Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import { Language, User } from '../types';
import { t } from '../i18n/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  currentTab: 'home' | 'join' | 'profile' | 'group';
  onNavigate: (tab: 'home' | 'join' | 'profile') => void;
  currentUser: User;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isOnline: boolean;
  onToggleSimulateOffline: () => void;
  forcedOffline: boolean;
}

export const Header: React.FC<Props> = ({
  currentTab,
  onNavigate,
  currentUser,
  language,
  onLanguageChange,
  isDark,
  onToggleTheme,
  isOnline,
  onToggleSimulateOffline,
  forcedOffline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left text-emerald-600 dark:text-emerald-400 font-bold text-lg tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-sm font-black text-sm">
            CL
          </div>
          <span className="text-slate-900 dark:text-white font-display font-bold">Chama Ledger</span>
        </button>

        {/* Zone 2: Single-line Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
              currentTab === 'home' || currentTab === 'group'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : ''
            }`}
          >
            {t('groups', language)}
          </button>
          <button
            onClick={() => onNavigate('join')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
              currentTab === 'join' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            {t('joinGroup', language)}
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
              currentTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            {t('profile', language)}
          </button>
        </nav>

        {/* Zone 3: Functional Utilities & Install Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Offline Simulator Test Trigger */}
          <button
            onClick={onToggleSimulateOffline}
            title={forcedOffline ? 'Turn off simulated offline' : 'Simulate offline mode for testing'}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              forcedOffline
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            )}
            <span className="hidden lg:inline text-[11px]">
              {forcedOffline ? 'Sim Offline' : 'Online'}
            </span>
          </button>

          {/* Dual Language Switcher (EN / SW) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md transition ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('sw')}
              className={`px-2 py-1 rounded-md transition ${
                language === 'sw'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              SW
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton language={language} variant="header" />

          {/* User Avatar badge for quick profile navigation */}
          <button
            onClick={() => onNavigate('profile')}
            title={`Logged in as ${currentUser.name}`}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm hover:ring-2 hover:ring-emerald-500 transition"
          >
            {currentUser.avatar || '👤'}
          </button>
        </div>
      </div>
    </header>
  );
};
