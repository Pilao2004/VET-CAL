import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SearchModal } from './components/SearchModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { HomeView } from './components/HomeView';
import { CalculatorsView } from './components/CalculatorsView';
import { DrugsView } from './components/DrugsView';
import { SymptomsView } from './components/SymptomsView';
import { LabsView } from './components/LabsView';
import { PatientsView } from './components/PatientsView';
import { AssistantView } from './components/AssistantView';
import { BonusView } from './components/BonusView';
import { SupportView } from './components/SupportView';
import { ProfileView } from './components/ProfileView';
import { PremiumGate } from './components/PremiumGate';
import { LegalView } from './components/LegalView';
import { TermsConsent } from './components/TermsConsent';
import { LandingPage } from './components/LandingPage';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { isLandingPreview } from './config/plans';
import { ShieldCheck, Heart } from 'lucide-react';

const WELCOME_KEY = 'vetcalc_welcome';
const readWelcome = () => {
  try {
    return localStorage.getItem(WELCOME_KEY);
  } catch {
    return null;
  }
};

const AppContent: React.FC = () => {
  const { currentView, toast, setCurrentView, isPremium, accountUser } = useApp();
  // Tela de boas-vindas: entrar ou criar conta antes de usar (some depois de "Entrar no app" ou "Continuar sem conta")
  const [welcomeDone, setWelcomeDone] = React.useState(() => Boolean(readWelcome()));
  const hadAccount = React.useRef(false);
  React.useEffect(() => {
    // Ao sair da conta, a tela de entrada volta a aparecer
    if (accountUser) hadAccount.current = true;
    else if (hadAccount.current) {
      hadAccount.current = false;
      try {
        localStorage.removeItem(WELCOME_KEY);
      } catch {}
      setWelcomeDone(false);
    }
  }, [accountUser]);
  const finishWelcome = () => {
    try {
      localStorage.setItem(WELCOME_KEY, accountUser ? 'done' : 'skip');
    } catch {}
    setWelcomeDone(true);
  };

  // App inteiro pago: sem acesso liberado, mostra a página de vendas (os Termos continuam abertos)
  if (!isPremium || isLandingPreview()) {
    return currentView === 'legal' ? (
      <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] max-w-4xl mx-auto px-4 py-8 space-y-4">
        <button type="button" onClick={() => setCurrentView('home')} className="text-sm font-bold text-[var(--primary)] cursor-pointer">
          ← Voltar
        </button>
        <LegalView />
      </main>
    ) : (
      <>
        <LandingPage />
        {toast && (
          <div className="fixed bottom-6 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold">{toast}</div>
        )}
      </>
    );
  }

  if (!welcomeDone) {
    return (
      <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2.5 mb-6">
          <img src="./assets/aistudio/_cone_Vet_Calc_Pro_com_Patinha_Calculadora_42b4d775.png" alt="" className="w-10 h-10 rounded-xl" />
          <span className="font-extrabold tracking-tight">VET CALC PRO</span>
        </div>
        <ProfileView welcome onContinue={finishWelcome} />
        {toast && (
          <div className="fixed bottom-6 right-4 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold">{toast}</div>
        )}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col transition-colors selection:bg-emerald-500/20 selection:text-emerald-800">
      <Header />
      <BottomNav />
      <SearchModal />
      <SubscriptionModal />
      <TermsConsent />
      <OnboardingTutorial />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20">
        {currentView === 'home' && <HomeView />}
        {currentView === 'calculators' && <CalculatorsView />}
        {currentView === 'drugs' && <DrugsView />}
        {currentView === 'symptoms' && <SymptomsView />}
        {currentView === 'labs' && <LabsView />}
        {currentView === 'patients' && (
          <PremiumGate title="Prontuários e pacientes" description="Cadastre pacientes, registre consultas e evoluções por voz, exporte prontuários em PDF e consulte as fichas pela Assistente IA.">
            <PatientsView />
          </PremiumGate>
        )}
        {currentView === 'assistant' && (
          <PremiumGate title="Assistente IA" description="Converse como com um colega: doses calculadas pelo app, dúvidas clínicas e as fichas dos seus pacientes.">
            <AssistantView />
          </PremiumGate>
        )}
        {currentView === 'bonus' && <BonusView />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'support' && <SupportView />}
        {currentView === 'legal' && <LegalView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--border)] bg-[#071326] py-8 px-4 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center space-x-2 font-mono font-bold text-slate-200 text-sm">
            <span>VET CALC PRO</span>
            <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded font-mono">
              v1.0
            </span>
          </div>

          <p className="max-w-2xl mx-auto text-[11px] text-slate-400 leading-relaxed">
            Plataforma de apoio à Medicina Veterinária destinada a estudantes, estagiários e médicos-veterinários. Fórmulas matemáticas determinísticas validadas. Toda conduta clínica e prescrição deve ser realizada sob supervisão do médico-veterinário responsável (CFMV/CRMV).
          </p>

          <div className="pt-2 flex items-center justify-center space-x-1 text-[11px] text-slate-400">
            <span>Desenvolvido com excelência técnico-científica para a prática clínica veterinária.</span>
          </div>
          <button type="button" onClick={() => setCurrentView('legal')} className="text-[11px] text-slate-300 underline cursor-pointer">
            Termos de Uso e Política de Privacidade
          </button>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-slideUp border border-slate-700 dark:border-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 dark:text-slate-950 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
