import React, { useEffect, useRef, useState } from 'react';
import { Check, PawPrint, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

/** "Paciente da vez": escolhido no topo, preenche peso e espécie em todas as calculadoras e o nome na receita. */
export const PatientPicker: React.FC = () => {
  const { patients, activePatientId, selectActivePatient, setCurrentView } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = patients.find((p) => p.id === activePatientId) || null;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={active ? `Paciente da vez: ${active.name}. Trocar paciente` : 'Escolher paciente da vez'}
        className={`relative min-w-[44px] min-h-[44px] px-2.5 sm:px-3 rounded-xl flex items-center gap-2 cursor-pointer transition-colors border ${
          active ? 'border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--text-main)]' : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--input-bg)]'
        }`}
      >
        <PawPrint className={`w-5 h-5 shrink-0 ${active ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'}`} />
        <span className="hidden sm:block text-xs font-bold max-w-[140px] truncate">
          {active ? `${active.name} · ${active.weight} kg` : 'Paciente'}
        </span>
        {active && <span className="sm:hidden absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--primary)]" />}
      </button>

      {open && (
        <div className="fixed left-4 right-4 top-[68px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-bold text-[var(--text-main)]">Paciente da vez</p>
            <p className="text-[11px] text-[var(--text-secondary)]">Peso e espécie vão para todas as calculadoras e o nome vai para a receita.</p>
          </div>
          <ul className="max-h-72 overflow-y-auto py-1">
            {patients.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    selectActivePatient(p.id);
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 hover:bg-[var(--input-bg)] cursor-pointer"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[var(--text-main)] truncate">{p.name}</span>
                    <span className="block text-[11px] text-[var(--text-secondary)]">
                      {p.species} · {p.weight} kg{p.tutorName ? ` · ${p.tutorName}` : ''}
                    </span>
                  </span>
                  {p.id === activePatientId && <Check className="w-4 h-4 text-[var(--primary)] shrink-0" />}
                </button>
              </li>
            ))}
            {patients.length === 0 && <li className="px-4 py-3 text-xs text-[var(--text-secondary)]">Nenhum paciente cadastrado ainda.</li>}
          </ul>
          <div className="border-t border-[var(--border)] p-2 flex gap-2">
            {active && (
              <button
                type="button"
                onClick={() => {
                  selectActivePatient(null);
                  setOpen(false);
                }}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--input-bg)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" /> Sem paciente
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setCurrentView('patients');
                setOpen(false);
              }}
              className="flex-1 px-3 py-2 rounded-xl text-xs font-bold text-[var(--primary)] hover:bg-[var(--input-bg)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Novo paciente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
