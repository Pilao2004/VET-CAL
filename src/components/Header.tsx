import React, { useState } from 'react';
import {
  Calculator,
  Pill,
  Stethoscope,
  FlaskConical,
  Users,
  Bot,
  Search,
  Crown,
  Home,
  ShieldCheck,
  Gift,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';
import { Sidebar } from './Sidebar';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsSearchOpen,
    isDarkMode,
    toggleTheme,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.FC<any> }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'calculators', label: 'Calculadoras', icon: Calculator },
    { id: 'drugs', label: 'Medicamentos', icon: Pill },
    { id: 'symptoms', label: 'Sintomas', icon: Stethoscope },
    { id: 'labs', label: 'Exames', icon: FlaskConical },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'assistant', label: 'Assistente IA', icon: Bot },
    { id: 'bonus', label: 'Bônus Exclusivos', icon: Gift },
  ];

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] text-[var(--text-main)] shadow-sm border-b border-[var(--border)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform bg-white">
                <img
                  src="./assets/aistudio/_cone_Vet_Calc_Pro_com_Patinha_Calculadora_42b4d775.png"
                  alt="VET CALC PRO"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold tracking-tight text-lg text-[var(--text-main)] font-mono">
                    VET CALC
                  </span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[var(--primary)] text-[#062C23] uppercase tracking-wider font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] font-medium hidden sm:block">
                  Apoio à Medicina Veterinária
                </p>
              </div>
            </button>

            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-[var(--text-secondary)] bg-[var(--input-bg)] hover:bg-[var(--border)] border border-[var(--border)] rounded-xl shadow-inner transition-colors group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-[var(--secondary)] group-hover:scale-110 transition-transform" />
                  <span className="text-[var(--text-secondary)]">Buscar cálculos, fármacos, sintomas...</span>
                </div>
                <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--surface)] rounded border border-[var(--border)]">
                  Ctrl + K
                </kbd>
              </button>
            </div>

            <div className="flex items-center space-x-1.5 sm:space-x-3">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--input-bg)] rounded-xl md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-colors"
                title="Pesquisar"
                aria-label="Abrir busca"
              >
                <Search className="w-5 h-5 text-[var(--secondary)]" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--input-bg)] rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer transition-colors"
                title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
                aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[var(--secondary)]" />}
              </button>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--input-bg)] rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                title="Menu"
                aria-label="Abrir menu"
              >
                <span className="text-xl font-bold tracking-widest text-[var(--text-secondary)]">...</span>
              </button>
            </div>
          </div>
        </div>

        <nav className="hidden md:block bg-[var(--header-bg)] border-t border-[var(--border)] px-2 sm:px-6 lg:px-8 overflow-x-scroll">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 py-1.5 min-w-max md:min-w-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer min-h-[38px] shrink-0 ${
                    isActive
                      ? 'bg-[var(--primary)] text-[#062C23] font-bold shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--input-bg)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#062C23]' : 'text-[var(--secondary)]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
};
