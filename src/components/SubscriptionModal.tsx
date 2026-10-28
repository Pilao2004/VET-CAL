import React, { useState } from 'react';
import { Check, Crown, ExternalLink, Key, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHECKOUT_URL, FREE_FEATURES, isOwnerPreview, PREMIUM_FEATURES, PRICE_LABEL } from '../config/plans';

export const SubscriptionModal: React.FC = () => {
  const { isSubscriptionModalOpen, setIsSubscriptionModalOpen, subscription, isPremium, activateSubscriptionServer, deactivateSubscription } = useApp();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isSubscriptionModalOpen) return null;
  const close = () => setIsSubscriptionModalOpen(false);

  const activate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !email.trim()) return;
    setLoading(true);
    setFeedback(null);
    const res = await activateSubscriptionServer(code.trim(), email.trim());
    setLoading(false);
    setFeedback(res);
    if (res.success) setTimeout(close, 1500);
  };

  const inputCls =
    'w-full px-3.5 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-sm text-[var(--text-main)] focus:outline-none focus:border-amber-400';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Planos do VET CALC PRO" onClick={close}>
      <div className="w-full max-w-2xl bg-[var(--surface)] rounded-t-3xl sm:rounded-3xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-r from-[#0B1D3A] via-[#102A54] to-[#0B1D3A] p-6 text-white text-center">
          <button type="button" onClick={close} aria-label="Fechar" className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-full bg-slate-800/40 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center mx-auto mb-3">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">VET CALC PRO Premium</h2>
          <p className="text-xs text-slate-300 mt-1">Tudo o que você precisa no estágio, na clínica e no plantão.</p>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {isPremium ? (
            <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-2">
              <p className="font-bold text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" /> Premium ativo
              </p>
              {isOwnerPreview() ? (
                <p className="text-xs text-[var(--text-secondary)]">Versão de testes do proprietário (claude.ai): todos os recursos liberados.</p>
              ) : (
                <>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {subscription.email && <>Conta: {subscription.email} · </>}
                    {subscription.expiresAt && <>Válido até {subscription.expiresAt.split('-').reverse().join('/')}</>}
                  </p>
                  <button type="button" onClick={deactivateSubscription} className="text-xs text-[var(--text-secondary)] underline cursor-pointer">
                    Remover o Premium deste aparelho
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-[var(--border)] space-y-3">
                  <p className="font-bold text-[var(--text-main)]">Grátis</p>
                  <ul className="space-y-1.5">
                    {FREE_FEATURES.map((f) => (
                      <li key={f} className="text-xs text-[var(--text-secondary)] flex gap-2">
                        <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-400/5 space-y-3">
                  <p className="font-bold text-amber-300 flex items-center justify-between gap-2">
                    Premium {PRICE_LABEL && <span className="text-sm text-[var(--text-main)]">{PRICE_LABEL}</span>}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)]">Tudo do plano grátis, mais:</p>
                  <ul className="space-y-1.5">
                    {PREMIUM_FEATURES.map((f) => (
                      <li key={f} className="text-xs text-[var(--text-main)] flex gap-2">
                        <Check className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {CHECKOUT_URL ? (
                    <a
                      href={CHECKOUT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-extrabold flex items-center justify-center gap-2"
                    >
                      Assinar o Premium <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <p className="text-xs text-[var(--text-secondary)]">As vendas abrem em breve.</p>
                  )}
                </div>
              </div>

              <form onSubmit={activate} className="space-y-3 p-4 rounded-2xl border border-[var(--border)]">
                <p className="font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" /> Já comprei: ativar meu acesso
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Use o e-mail da compra e o código de acesso que você recebeu (formato VCP-…).</p>
                <input id="sub-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail usado na compra" className={inputCls} autoComplete="email" />
                <input id="sub-code" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de acesso" className={`${inputCls} font-mono uppercase`} />
                {feedback && <p className={`text-xs ${feedback.success ? 'text-emerald-300' : 'text-red-300'}`}>{feedback.message}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[var(--primary)] text-[#062C23] text-sm font-extrabold cursor-pointer disabled:opacity-60">
                  {loading ? 'Ativando…' : 'Ativar Premium'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
