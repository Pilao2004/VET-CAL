import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PREMIUM_FEATURES } from '../config/plans';

/** Mostra o conteúdo só para assinantes; para os demais, um convite ao Premium. */
export const PremiumGate: React.FC<{ title: string; description: string; children: React.ReactNode; compact?: boolean }> = ({
  title,
  description,
  children,
  compact,
}) => {
  const { isPremium, setIsSubscriptionModalOpen } = useApp();
  if (isPremium) return <>{children}</>;

  if (compact) {
    return (
      <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-3">
        <span className="text-xs text-amber-100 flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0 text-amber-400" />
          {title} é um recurso Premium.
        </span>
        <button
          type="button"
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-extrabold cursor-pointer"
        >
          Ver Premium
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-[var(--surface)] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
        <Crown className="w-7 h-7" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-extrabold text-[var(--text-main)]">{title}</h2>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
      <ul className="text-left space-y-2 max-w-sm mx-auto">
        {PREMIUM_FEATURES.map((f) => (
          <li key={f} className="text-xs text-[var(--text-main)] flex gap-2">
            <span className="text-amber-400 font-bold">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          type="button"
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-extrabold cursor-pointer"
        >
          Conhecer o Premium
        </button>
        <button
          type="button"
          onClick={() => setIsSubscriptionModalOpen(true)}
          className="px-5 py-3 rounded-xl border border-[var(--border)] text-[var(--text-main)] text-sm font-bold cursor-pointer hover:border-amber-400"
        >
          Já comprei: ativar
        </button>
      </div>
    </div>
  );
};
