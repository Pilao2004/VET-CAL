import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Database,
  Cloud,
  RefreshCw,
  Download,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Key,
  LogOut,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSupabaseConfig } from '../lib/supabase';

export const ProfileView: React.FC = () => {
  const {
    user,
    session,
    isSupabaseReady,
    supabaseConnected,
    supabaseLatency,
    testConnection,
    saveConfig,
    clearConfig,
    signUpWithSupabase,
    signInWithSupabase,
    signOutWithSupabase,
    resetPasswordWithSupabase,
    localPatientsCount,
    migrateLocalPatients,
    exportLocalBackup,
    clearLocalMigratedData,
    showToast,
  } = useApp();

  // Auth form states
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Config modal/drawer state
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  // Migration states
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    const cfg = getSupabaseConfig();
    setSupabaseUrl(cfg.url);
    setSupabaseAnonKey(cfg.anonKey);
  }, [isConfigOpen]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    setIsSubmitting(true);

    if (!isSupabaseReady) {
      setAuthMessage({
        type: 'error',
        text: 'Configure o Supabase (URL e Chave Anon) abaixo antes de realizar o login.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (authMode === 'signup') {
        if (!name.trim()) {
          setAuthMessage({ type: 'error', text: 'Informe seu nome completo.' });
          setIsSubmitting(false);
          return;
        }
        const res = await signUpWithSupabase(email.trim(), password, name.trim());
        if (res.success) {
          setAuthMessage({ type: 'success', text: res.message });
          showToast('Cadastro realizado!');
        } else {
          setAuthMessage({ type: 'error', text: res.message });
        }
      } else if (authMode === 'signin') {
        const res = await signInWithSupabase(email.trim(), password);
        if (res.success) {
          setAuthMessage({ type: 'success', text: res.message });
          showToast('Login realizado com sucesso!');
        } else {
          setAuthMessage({ type: 'error', text: res.message });
        }
      } else if (authMode === 'forgot') {
        const res = await resetPasswordWithSupabase(email.trim());
        if (res.success) {
          setAuthMessage({ type: 'success', text: res.message });
          showToast('E-mail de recuperação enviado!');
        } else {
          setAuthMessage({ type: 'error', text: res.message });
        }
      }
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Erro inesperado.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    const res = await testConnection();
    setConnectionResult(res);
    setTestingConnection(false);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      showToast('Preencha a URL e a Anon Key do Supabase.');
      return;
    }
    saveConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
    showToast('Configurações salvas! Testando conexão...');
    handleTestConnection();
    setIsConfigOpen(false);
  };

  const handleRunMigration = async () => {
    if (!user) {
      showToast('Faça login primeiro para migrar os prontuários.');
      return;
    }
    setIsMigrating(true);
    setMigrationResult(null);
    try {
      const summary = await migrateLocalPatients();
      setMigrationResult(
        `Migração concluída: ${summary.migratedCount} prontuários importados para o banco de dados. (${summary.skippedCount} já existentes ignorados).`
      );
      showToast('Prontuários migrados com sucesso para o Supabase!');
    } catch (err: any) {
      setMigrationResult(`Falha na migração: ${err.message}`);
      showToast('Erro durante a migração dos dados.');
    } finally {
      setIsMigrating(false);
    }
  };

  const copySqlScript = () => {
    const sql = `-- VET CALC PRO Schema
-- Execute no SQL Editor do Supabase Dashboard:
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  crmv TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE SEQUENCE IF NOT EXISTS public.patient_public_code_seq START 100001;

CREATE OR REPLACE FUNCTION public.generate_patient_public_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_code IS NULL OR NEW.public_code = '' THEN
    NEW.public_code := 'VET-' || LPAD(nextval('public.patient_public_code_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  sub_species TEXT,
  breed TEXT DEFAULT 'SRD',
  sex TEXT NOT NULL DEFAULT 'Macho',
  is_neutered BOOLEAN DEFAULT TRUE,
  age TEXT DEFAULT 'Não informada',
  birth_date TEXT,
  weight NUMERIC(6,2) DEFAULT 0,
  microchip TEXT,
  tutor_name TEXT NOT NULL,
  tutor_phone TEXT,
  tutor_email TEXT,
  allergies TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_set_patient_code ON public.patients;
CREATE TRIGGER trigger_set_patient_code BEFORE INSERT ON public.patients FOR EACH ROW EXECUTE FUNCTION public.generate_patient_public_code();

CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_code TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  weight NUMERIC(6,2),
  chief_complaint TEXT,
  reported_symptoms JSONB DEFAULT '[]'::JSONB,
  physical_exam JSONB DEFAULT '{}'::JSONB,
  tentative_diagnosis TEXT,
  requested_exams JSONB DEFAULT '[]'::JSONB,
  prescriptions JSONB DEFAULT '[]'::JSONB,
  clinical_evolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.clinical_evolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evolution_text TEXT NOT NULL,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_evolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_policy" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "patients_policy" ON public.patients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "consultations_policy" ON public.consultations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "clinical_evolutions_policy" ON public.clinical_evolutions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "audit_logs_policy" ON public.audit_logs FOR ALL USING (auth.uid() = user_id);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    showToast('Script SQL copiado para a área de transferência!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Perfil & Banco de Dados Seguro</h1>
              <p className="text-xs text-slate-500">Autenticação real com Supabase Auth e PostgreSQL com Row Level Security (RLS).</p>
            </div>
          </div>

          {/* Database connection badge */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>Conexão Supabase</span>
            </button>
          </div>
        </div>

        {/* Database Status Alert Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-3 h-3 rounded-full shrink-0 ${
                supabaseConnected ? 'bg-emerald-500 animate-pulse' : isSupabaseReady ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                Status do Banco de Dados:{' '}
                {supabaseConnected
                  ? `Conectado ao PostgreSQL (${supabaseLatency}ms)`
                  : isSupabaseReady
                  ? 'Aguardando teste de conexão'
                  : 'Supabase não configurado'}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {supabaseConnected
                  ? 'Prontuários e consultas são salvos com segurança no PostgreSQL com controle de acesso RLS.'
                  : 'Insira as credenciais do seu projeto Supabase para habilitar autenticação centralizada e salvamento online.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>{testingConnection ? 'Testando...' : 'Testar Conexão'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsSqlModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Code2 className="w-3 h-3" />
              <span>Script SQL</span>
            </button>
          </div>
        </div>

        {connectionResult && (
          <div
            className={`p-3 rounded-xl text-xs font-medium border ${
              connectionResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
            }`}
          >
            {connectionResult.message}
          </div>
        )}

        {/* Configuration Drawer */}
        {isConfigOpen && (
          <form
            onSubmit={handleSaveConfig}
            className="p-5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span>Credenciais do Projeto Supabase</span>
              </h3>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Dashboard Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Encontre no Supabase em: <strong>Project Settings &gt; API</strong> (Project URL e Project API anon/public key).
            </p>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Project URL (https://xyz.supabase.co)
              </label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://seu-projeto.supabase.co"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                API Key Pública (anon / public)
              </label>
              <input
                type="text"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-[11px] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  clearConfig();
                  setSupabaseUrl('');
                  setSupabaseAnonKey('');
                  setIsConfigOpen(false);
                  showToast('Configurações do Supabase removidas.');
                }}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300"
              >
                Limpar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold shadow transition-colors cursor-pointer"
              >
                Salvar e Conectar
              </button>
            </div>
          </form>
        )}

        {/* User Account Section */}
        {user ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Conta Autenticada no Supabase</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Sessão ativa e protegida. Todos os prontuários, consultas e evoluções que você cadastrar são gravados no banco PostgreSQL com RLS.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">ID Único de Autenticação (UID):</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{user.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">E-mail Cadastrado:</span>
                <span className="font-bold text-slate-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Criado em:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={signOutWithSupabase}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Encerrar Sessão (Logout)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 space-x-4">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`text-xs font-bold pb-2 border-b-2 transition-colors cursor-pointer ${
                  authMode === 'signin'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Entrar com Conta Existente
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`text-xs font-bold pb-2 border-b-2 transition-colors cursor-pointer ${
                  authMode === 'signup'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Criar Nova Conta Profissional
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className={`text-xs font-bold pb-2 border-b-2 transition-colors cursor-pointer ${
                  authMode === 'forgot'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Recuperar Senha
              </button>
            </div>

            {authMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border ${
                  authMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                }`}
              >
                {authMessage.text}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo / Profissional
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Dra. Mariana Albuquerque"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail do Médico-Veterinário
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vet@clinica.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Senha de Acesso
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo de 6 caracteres"
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {authMode === 'signup'
                          ? 'Criar Conta no Supabase'
                          : authMode === 'signin'
                          ? 'Entrar no Sistema'
                          : 'Enviar Link de Recuperação'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Migration & Backup Card (Requirement 6) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Migração Segura de Prontuários Antigos</h2>
            <p className="text-xs text-slate-500">
              Importe seus pacientes e histórico de consultas do armazenamento local (localStorage) para o banco de dados online.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-300">
                {localPatientsCount > 0
                  ? `Foram encontrados ${localPatientsCount} prontuários salvos localmente neste navegador.`
                  : 'Nenhum prontuário pendente de migração no armazenamento local.'}
              </span>
              <p className="text-amber-700 dark:text-amber-400 mt-0.5 text-[11px]">
                Antes de migrar, recomendamos exportar um backup em formato JSON para garantir total segurança dos seus dados.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={exportLocalBackup}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Backup JSON</span>
              </button>

              <button
                type="button"
                onClick={handleRunMigration}
                disabled={isMigrating || !user || localPatientsCount === 0}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold shadow transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isMigrating ? 'animate-spin' : ''}`} />
                <span>{isMigrating ? 'Migrando...' : 'Migrar para Supabase'}</span>
              </button>
            </div>
          </div>

          {migrationResult && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs">
              {migrationResult}
            </div>
          )}

          {localPatientsCount > 0 && user && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={clearLocalMigratedData}
                className="text-[11px] text-slate-500 hover:text-red-500 underline transition-colors cursor-pointer"
              >
                Limpar dados do armazenamento local após confirmar a migração
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SQL Script Modal */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Script SQL do Supabase (schema.sql)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSqlModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Copie o código abaixo e execute-o no <strong>SQL Editor</strong> do seu projeto Supabase para criar as tabelas{' '}
              <code className="text-emerald-500">profiles</code>, <code className="text-emerald-500">patients</code>,{' '}
              <code className="text-emerald-500">consultations</code>, <code className="text-emerald-500">clinical_evolutions</code> e as políticas de segurança RLS.
            </p>

            <div className="flex-1 overflow-auto bg-slate-950 text-slate-200 p-4 rounded-2xl text-[11px] font-mono border border-slate-800 select-all max-h-80">
              <pre>{`-- Execute no SQL Editor do Supabase:
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  crmv TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  sub_species TEXT,
  breed TEXT DEFAULT 'SRD',
  sex TEXT NOT NULL DEFAULT 'Macho',
  is_neutered BOOLEAN DEFAULT TRUE,
  age TEXT DEFAULT 'Não informada',
  birth_date TEXT,
  weight NUMERIC(6,2) DEFAULT 0,
  microchip TEXT,
  tutor_name TEXT NOT NULL,
  tutor_phone TEXT,
  tutor_email TEXT,
  allergies TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultation_code TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  weight NUMERIC(6,2),
  chief_complaint TEXT,
  reported_symptoms JSONB DEFAULT '[]'::JSONB,
  physical_exam JSONB DEFAULT '{}'::JSONB,
  tentative_diagnosis TEXT,
  requested_exams JSONB DEFAULT '[]'::JSONB,
  prescriptions JSONB DEFAULT '[]'::JSONB,
  clinical_evolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_policy" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "patients_policy" ON public.patients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "consultations_policy" ON public.consultations FOR ALL USING (auth.uid() = user_id);`}</pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-500">O arquivo completo também está salvo em /supabase/schema.sql</span>
              <button
                type="button"
                onClick={copySqlScript}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow transition-colors cursor-pointer"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copiado!' : 'Copiar Script SQL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
