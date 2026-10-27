import React from 'react';
import {
  Calculator,
  Pill,
  Stethoscope,
  FlaskConical,
  Users,
  Bot,
  Home,
  Gift,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const navItems: { id: ActiveView; label: string; icon: React.FC<any> }[] = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'calculators', label: 'Calculadoras', icon: Calculator },
    { id: 'drugs', label: 'Medicamentos', icon: Pill },
    { id: 'symptoms', label: 'Sintomas', icon: Stethoscope },
    { id: 'labs', label: 'Exames', icon: FlaskConical },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'assistant', label: 'Assistente IA', icon: Bot },
    { id: 'bonus', label: 'Bônus', icon: Gift },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--header-bg)] border-t border-[var(--border)] z-40 overflow-x-auto scrollbar-none pb-safe">
      <div className="flex items-center justify-around py-2 px-2 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center space-y-0.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all min-h-[48px] min-w-[50px] cursor-pointer ${
                isActive
                  ? 'text-[var(--primary)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
