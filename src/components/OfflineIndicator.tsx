import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';

interface Props {
  isOnline: boolean;
  pendingCount: number;
  language: Language;
  onSync: () => void;
  isSimulatedOffline?: boolean;
}

export const OfflineIndicator: React.FC<Props> = ({
  isOnline,
  pendingCount,
  language,
  onSync,
  isSimulatedOffline,
}) => {
  if (isOnline && pendingCount === 0) return null;

  return (
    <aside
      aria-label="Offline status notification"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`p-3.5 rounded-2xl shadow-xl border backdrop-blur-md flex items-center justify-between gap-3 text-xs ${
          !isOnline
            ? 'bg-amber-950/90 border-amber-600/50 text-amber-100'
            : 'bg-emerald-950/90 border-emerald-600/50 text-emerald-100'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {!isOnline ? (
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}

          <div className="truncate">
            <p className="font-semibold leading-tight">
              {!isOnline
                ? isSimulatedOffline
                  ? `Offline Simulator Active`
                  : t('offlineMode', language)
                : 'Connection Restored'}
            </p>
            <p className="text-[11px] opacity-80 truncate">
              {pendingCount > 0
                ? `${pendingCount} ${t('waitingToSync', language).toLowerCase()}`
                : t('allCaughtUp', language)}
            </p>
          </div>
        </div>

        {pendingCount > 0 && isOnline && (
          <button
            onClick={onSync}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition shrink-0 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('syncNow', language)}</span>
          </button>
        )}
      </div>
    </aside>
  );
};
