import React, { useState } from 'react';
import { KeyRound, LogOut, MailCheck, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isVerified, loginWithEmail, loginWithGoogle, reloadUser, resendVerification, resetPassword, signUpWithEmail } from '../lib/firebase';

type Feedback = { success: boolean; message: string } | null;

/** Login com Google ou e-mail/senha e situação da liberação do acesso. */
export const AccountAccess: React.FC<{ preview?: boolean }> = ({ preview }) => {
  const { accountUser, accessChecking, isPremium, refreshAccount, deactivateSubscription } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const inputCls =
    'w-full px-3.5 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]';
  const run = async (fn: () => Promise<Feedback>) => {
    if (preview) {
      setFeedback({ success: true, message: 'Prévia: no site, aqui a pessoa entra com Google ou e-mail e o app confere a liberação.' });
      return;
    }
    setLoading(true);
    setFeedback(null);
    setFeedback(await fn());
    setLoading(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    run(() => (mode === 'login' ? loginWithEmail(email, password) : signUpWithEmail(email, password)));
  };

  const feedbackLine = feedback && <p className={`text-xs ${feedback.success ? 'text-emerald-400' : 'text-red-400'}`}>{feedback.message}</p>;

  if (accountUser && !preview) {
    const account = accountUser.email || '';
    const signOutLink = (
      <button type="button" onClick={deactivateSubscription} className="text-xs text-[var(--text-secondary)] underline cursor-pointer inline-flex items-center gap-1">
        <LogOut className="w-3.5 h-3.5" /> Sair e usar outra conta
      </button>
    );

    if (!isVerified(accountUser)) {
      return (
        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <p className="font-extrabold flex items-center gap-2">
            <MailCheck className="w-5 h-5 text-[var(--primary)]" /> Confirme o seu e-mail
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Enviamos um link de confirmação para <strong className="text-[var(--text-main)]">{account}</strong>. Abra o e-mail, toque no link e depois volte aqui.
          </p>
          {feedbackLine}
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              run(async () => {
                const u = await reloadUser().catch(() => null);
                refreshAccount();
                return isVerified(u) ? { success: true, message: 'E-mail confirmado. Conferindo a sua compra…' } : { success: false, message: 'Ainda não aparece como confirmado. Abra o link do e-mail e tente de novo.' };
              })
            }
            className="w-full py-3 rounded-xl bg-[var(--primary)] text-[#062C23] text-sm font-extrabold cursor-pointer disabled:opacity-60"
          >
            Já confirmei
          </button>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <button type="button" disabled={loading} onClick={() => run(resendVerification)} className="text-xs text-[var(--text-secondary)] underline cursor-pointer">
              Reenviar o link
            </button>
            {signOutLink}
          </div>
        </div>
      );
    }

    if (!isPremium) {
      return (
        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
          <p className="font-extrabold flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[var(--primary)]" /> {accessChecking ? 'Conferindo a sua compra…' : 'Conta conectada'}
          </p>
          {!accessChecking && (
            <p className="text-sm text-[var(--text-secondary)]">
              A conta <strong className="text-[var(--text-main)]">{account}</strong> ainda não está liberada. Use o <strong>mesmo e-mail da compra</strong>: assim que o
              pagamento for confirmado, o acesso é liberado e o app abre sozinho aqui. Se já pagou e não liberou, fale com o suporte:
              suporte.vetcalcpro@gmail.com.
            </p>
          )}
          <button type="button" onClick={refreshAccount} className="text-xs text-[var(--text-secondary)] underline cursor-pointer inline-flex items-center gap-1 mr-4">
            <RefreshCw className="w-3.5 h-3.5" /> Conferir de novo
          </button>
          {signOutLink}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
      <p className="font-extrabold flex items-center gap-2">
        <KeyRound className="w-5 h-5 text-[var(--primary)]" /> Já comprei: entrar no app
      </p>
      <p className="text-xs text-[var(--text-secondary)]">Entre com o mesmo e-mail que você usou na compra.</p>
      <button
        type="button"
        disabled={loading}
        onClick={() => run(loginWithGoogle)}
        className="w-full py-3 rounded-xl bg-white text-slate-900 border border-slate-300 text-sm font-bold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
          <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A11.6 11.6 0 0 0 12 0 12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z" />
        </svg>
        Entrar com Google
      </button>
      <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
        <span className="flex-1 h-px bg-[var(--border)]" /> ou com e-mail e senha <span className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input id="acc-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail usado na compra" className={inputCls} autoComplete="email" />
        <input
          id="acc-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === 'login' ? 'Senha' : 'Crie uma senha (mínimo 6 caracteres)'}
          className={inputCls}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        {feedbackLine}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[var(--primary)] text-[#062C23] text-sm font-extrabold cursor-pointer disabled:opacity-60">
          {loading ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setFeedback(null); }} className="text-xs text-[var(--text-secondary)] underline cursor-pointer">
          {mode === 'login' ? 'Primeiro acesso? Criar conta' : 'Já tenho conta: entrar'}
        </button>
        {mode === 'login' && (
          <button
            type="button"
            onClick={() => (email.trim() ? run(() => resetPassword(email)) : setFeedback({ success: false, message: 'Digite o seu e-mail acima para receber o link.' }))}
            className="text-xs text-[var(--text-secondary)] underline cursor-pointer"
          >
            Esqueci a senha
          </button>
        )}
      </div>
    </div>
  );
};
