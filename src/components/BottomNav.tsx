import React from 'react';
import { Home, UserPlus, User as UserIcon } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';

interface Props {
  currentTab: 'home' | 'join' | 'profile' | 'group';
  onNavigate: (tab: 'home' | 'join' | 'profile') => void;
  language: Language;
}

export const BottomNav: React.FC<Props> = ({ currentTab, onNavigate, language }) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="grid grid-cols-3 items-center h-16 max-w-md mx-auto px-4">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'home' || currentTab === 'group'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] tracking-tight mt-1">{t('home', language)}</span>
        </button>

        <button
          onClick={() => onNavigate('join')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'join'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          <span className="text-[11px] tracking-tight mt-1">{t('joinGroup', language)}</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'profile'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[11px] tracking-tight mt-1">{t('profile', language)}</span>
        </button>
      </div>
    </nav>
  );
};
