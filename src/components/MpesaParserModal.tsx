import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, Smartphone, ArrowRight } from 'lucide-react';
import { Language, MemberSummary, ParsedMpesa } from '../types';
import { t } from '../i18n/translations';
import { parseMpesaSms, SAMPLE_MPESA_MESSAGES } from '../utils/mpesaParser';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  members: MemberSummary[];
  language: Language;
  onApplyParsed: (parsed: ParsedMpesa) => void;
}

export const MpesaParserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  members,
  language,
  onApplyParsed,
}) => {
  const [smsText, setSmsText] = useState('');
  const [parsed, setParsed] = useState<ParsedMpesa | null>(null);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setSmsText(text);
    if (text.trim().length > 10) {
      const result = parseMpesaSms(text, members);
      setParsed(result);
    } else {
      setParsed(null);
    }
  };

  const handleSelectSample = (sampleText: string) => {
    handleTextChange(sampleText);
  };

  const handleApply = () => {
    if (parsed) {
      onApplyParsed(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t('pasteSmsTitle', language)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Safaricom M-Pesa SMS Regex Parser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('trySampleSms', language)}:</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_MPESA_MESSAGES.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(s.text)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 rounded-lg transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t('pasteSmsDesc', language)}
          </label>
          <textarea
            rows={4}
            value={smsText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={t('pastePlaceholder', language)}
            className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Live Parse Preview Card */}
        {parsed && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('parseSuccess', language)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t('detectedReceipt', language)}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {parsed.receiptCode || 'N/A'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t('detectedAmount', language)}
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  KSh {parsed.amount.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t('detectedSender', language)}
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {parsed.senderName ? `${parsed.senderName} (${parsed.phone})` : parsed.phone || 'N/A'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {t('matchedMember', language)}
                </span>
                <span className={`font-semibold ${parsed.matchedMemberName ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {parsed.matchedMemberName || 'Select manually in form'}
                </span>
              </div>
            </div>
          </div>
        )}

        {smsText.trim().length > 10 && !parsed && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{t('parseError', language)}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            {t('cancel', language)}
          </button>
          <button
            type="button"
            disabled={!parsed}
            onClick={handleApply}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl shadow-sm transition ${
              parsed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{t('applyToForm', language)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
