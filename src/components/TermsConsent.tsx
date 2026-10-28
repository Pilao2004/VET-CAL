import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TERMS_VERSION } from './LegalView';

const KEY = 'vetcalc_terms_accepted';

export function termsAlreadyAccepted() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}').version === TERMS_VERSION;
  } catch {
    return false;
  }
}

/** Aceite dos Termos e da Política de Privacidade no primeiro uso (e a cada nova versão). */
export const TermsConsent: React.FC = () => {
  const { setCurrentView, currentView } = useApp();
  const [accepted, setAccepted] = useState(termsAlreadyAccepted);
  const [checked, setChecked] = useState(false);
  if (accepted || currentView === 'legal') return null;

  const confirm = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: TERMS_VERSION, at: new Date().toISOString() }));
    } catch {}
    setAccepted(true);
    window.dispatchEvent(new Event('vetcalc:terms-accepted'));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4" role="dialog" aria-modal="true" aria-label="Termos de uso">
      <div className="w-full sm:max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-t-3xl sm:rounded-3xl p-6 space-y-4">
        <div className="w-11 h-11 rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-extrabold text-[var(--text-main)]">Antes de começar</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          O VET CALC PRO é uma ferramenta de apoio. Cálculos e respostas da IA não substituem o exame clínico nem a decisão do médico-veterinário responsável.
        </p>
        <label className="flex items-start gap-3 text-sm text-[var(--text-main)] cursor-pointer">
          <input id="terms-check" type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-1 w-4 h-4 accent-emerald-500" />
          <span>
            Li e concordo com os{' '}
            <button type="button" onClick={() => setCurrentView('legal')} className="text-[var(--primary)] underline cursor-pointer">
              Termos de Uso e a Política de Privacidade
            </button>
            .
          </span>
        </label>
        <button
          type="button"
          onClick={confirm}
          disabled={!checked}
          className="w-full py-3 rounded-xl bg-[var(--primary)] text-[#062C23] font-extrabold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Concordo e quero continuar
        </button>
      </div>
    </div>
  );
};
