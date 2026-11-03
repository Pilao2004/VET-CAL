import React, { useState } from 'react';
import { CheckCircle2, CloudOff, LogOut, RefreshCw, Save, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { loginWithGoogle } from '../lib/firebase';
import { loadLocalVetProfile, saveCloudProfile, saveLocalVetProfile, VetProfile } from '../services/cloudSync';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A11.6 11.6 0 0 0 12 0 12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9z" />
  </svg>
);

/** Perfil: login com a conta Google e dados do médico-veterinário, salvos no Firebase. */
export const ProfileView: React.FC = () => {
  const { accountUser, cloudSync, syncCloudNow, deactivateSubscription, showToast } = useApp();
  const [profile, setProfile] = useState<VetProfile>(loadLocalVetProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputCls =
    'w-full px-3.5 py-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]';

  const login = async () => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle();
    setLoading(false);
    if (!res.success) setError(res.message);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    saveLocalVetProfile(profile);
    if (!accountUser) return showToast('Perfil salvo neste aparelho.');
    try {
      await saveCloudProfile(accountUser, profile);
      showToast('Perfil salvo na sua conta.');
    } catch {
      showToast('Perfil salvo neste aparelho. Não foi possível enviar para a conta agora.');
    }
  };

  const syncLabel =
    cloudSync.status === 'syncing'
      ? 'Sincronizando…'
      : cloudSync.status === 'saved'
        ? `Prontuários salvos na conta${cloudSync.at ? ` às ${new Date(cloudSync.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : ''}`
        : cloudSync.status === 'too_big'
          ? 'Os prontuários passaram do limite da cópia na nuvem. Use "Fazer backup" em Pacientes.'
          : cloudSync.status === 'error'
            ? 'Sem conexão com a conta agora. Os dados continuam salvos neste aparelho.'
            : '';

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="bg-[var(--surface)] rounded-3xl p-6 border border-[var(--border)] space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <UserRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[var(--text-main)]">Meu perfil</h1>
            <p className="text-xs text-[var(--text-secondary)]">Entre com o Google para guardar seu perfil e seus prontuários na sua conta.</p>
          </div>
        </div>

        {accountUser ? (
          <div className="p-4 rounded-2xl border border-[var(--border)] flex flex-wrap items-center gap-4">
            {accountUser.photoURL ? (
              <img src={accountUser.photoURL} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--input-bg)] flex items-center justify-center">
                <UserRound className="w-6 h-6 text-[var(--text-secondary)]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[var(--text-main)] truncate">{accountUser.displayName || 'Conta Google'}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{accountUser.email}</p>
              {syncLabel && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${cloudSync.status === 'saved' ? 'text-emerald-400' : 'text-[var(--text-secondary)]'}`}>
                  {cloudSync.status === 'saved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : cloudSync.status === 'error' ? <CloudOff className="w-3.5 h-3.5" /> : null}
                  {syncLabel}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={syncCloudNow} className="px-3 py-2 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer hover:border-[var(--primary)]">
                <RefreshCw className="w-3.5 h-3.5" /> Sincronizar agora
              </button>
              <button type="button" onClick={deactivateSubscription} className="px-3 py-2 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5 cursor-pointer hover:border-red-400">
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              disabled={loading}
              onClick={login}
              className="w-full py-3 rounded-xl bg-white text-slate-900 border border-slate-300 text-sm font-bold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              {loading ? 'Abrindo o Google…' : 'Entrar com Google'}
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <p className="text-xs text-[var(--text-secondary)]">Sem entrar, o app funciona normalmente e guarda tudo só neste aparelho.</p>
          </div>
        )}
      </div>

      <form onSubmit={save} className="bg-[var(--surface)] rounded-3xl p-6 border border-[var(--border)] space-y-3">
        <p className="font-bold text-[var(--text-main)]">Dados para a receita</p>
        <input id="prof-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Seu nome (médico-veterinário)" className={inputCls} />
        <input id="prof-crmv" value={profile.crmv} onChange={(e) => setProfile({ ...profile, crmv: e.target.value })} placeholder="CRMV (ex.: SP 12345)" className={inputCls} />
        <input id="prof-clinic" value={profile.clinic} onChange={(e) => setProfile({ ...profile, clinic: e.target.value })} placeholder="Clínica ou hospital (opcional)" className={inputCls} />
        <button type="submit" className="w-full py-3 rounded-xl bg-[var(--primary)] text-[#062C23] text-sm font-extrabold cursor-pointer flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Salvar perfil
        </button>
        <p className="text-xs text-[var(--text-secondary)]">Esses dados aparecem na receita em PDF{accountUser ? ' e ficam guardados na sua conta Google.' : '.'}</p>
      </form>
    </div>
  );
};
