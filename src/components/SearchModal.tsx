import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Calculator,
  Pill,
  Stethoscope,
  FlaskConical,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { CALCULATORS_LIST } from '../data/calculators';
import { INITIAL_DRUGS } from '../data/drugs';
import { COMMERCIAL_PRODUCTS, CommercialProduct } from '../data/commercialProducts';
import { CLINICAL_SYMPTOMS } from '../data/symptoms';
import { LAB_PARAMETERS } from '../data/labTests';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    setCurrentView,
    setSelectedCalculator,
    openCalculatorWithDrug,
    openCalculatorWithCommercialProduct,
    setSelectedPatientId,
    patients,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter Calculators
  const filteredCalculators = cleanQuery
    ? CALCULATORS_LIST.filter(
        (c) =>
          c.title.toLowerCase().includes(cleanQuery) ||
          c.shortDescription.toLowerCase().includes(cleanQuery) ||
          c.category.toLowerCase().includes(cleanQuery)
      )
    : CALCULATORS_LIST.slice(0, 4);

  // Filter Commercial Products (500+ items)
  const filteredCommercialProducts = cleanQuery
    ? COMMERCIAL_PRODUCTS.filter(
        (p) =>
          p.brandName.toLowerCase().includes(cleanQuery) ||
          p.activePrinciple.toLowerCase().includes(cleanQuery) ||
          (p.manufacturer && p.manufacturer.toLowerCase().includes(cleanQuery)) ||
          p.category.toLowerCase().includes(cleanQuery)
      ).slice(0, 5)
    : COMMERCIAL_PRODUCTS.slice(0, 4);

  // Filter Symptoms
  const filteredSymptoms = cleanQuery
    ? CLINICAL_SYMPTOMS.filter(
        (s) =>
          s.name.toLowerCase().includes(cleanQuery) ||
          s.description.toLowerCase().includes(cleanQuery) ||
          s.differentials.some((d) => d.name.toLowerCase().includes(cleanQuery))
      )
    : CLINICAL_SYMPTOMS.slice(0, 3);

  // Filter Labs
  const filteredLabs = cleanQuery
    ? LAB_PARAMETERS.filter(
        (l) =>
          l.name.toLowerCase().includes(cleanQuery) ||
          l.category.toLowerCase().includes(cleanQuery) ||
          l.clinicalSignificance.toLowerCase().includes(cleanQuery)
      )
    : LAB_PARAMETERS.slice(0, 3);

  // Filter Patients
  const filteredPatients = cleanQuery
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.tutorName.toLowerCase().includes(cleanQuery) ||
          p.breed.toLowerCase().includes(cleanQuery)
      )
    : [];

  const handleSelectCalculator = (calcType: any) => {
    setSelectedCalculator(calcType);
    setCurrentView('calculators');
    setIsSearchOpen(false);
  };

  const handleSelectDrug = (drug: any) => {
    openCalculatorWithDrug(drug);
    setIsSearchOpen(false);
  };

  const handleSelectSymptom = () => {
    setCurrentView('symptoms');
    setIsSearchOpen(false);
  };

  const handleSelectLab = () => {
    setCurrentView('labs');
    setIsSearchOpen(false);
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentView('patients');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3 bg-slate-50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-emerald-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para buscar cálculos, medicamentos, sintomas, exames ou pacientes..."
            className="w-full bg-transparent border-0 text-[#0F172A] dark:text-slate-100 placeholder:text-[#64748B] dark:placeholder:text-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Search Results Container */}
        <div className="overflow-y-auto p-4 space-y-5 text-sm">
          {/* Calculators Results */}
          {filteredCalculators.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <Calculator className="w-3.5 h-3.5 text-emerald-500" />
                <span>Calculadoras Clínicas</span>
              </div>
              <div className="space-y-1.5">
                {filteredCalculators.map((calc) => (
                  <button
                    key={calc.type}
                    onClick={() => handleSelectCalculator(calc.type)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-emerald-200 dark:hover:border-slate-700 text-left transition-colors group cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                        {calc.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {calc.shortDescription}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Commercial Products Results */}
          {filteredCommercialProducts.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <Pill className="w-3.5 h-3.5 text-blue-500" />
                <span>Biblioteca Farmacológica ({COMMERCIAL_PRODUCTS.length}+ Formulações)</span>
              </div>
              <div className="space-y-1.5">
                {filteredCommercialProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      openCalculatorWithCommercialProduct(prod);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-blue-200 dark:hover:border-slate-700 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                    <ProductImage product={prod} size={40} />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {prod.brandName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                          {prod.manufacturer || 'Oficial'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {prod.activePrinciple} • {prod.doseRangeText}
                      </p>
                    </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded shrink-0 ml-2">
                      Calcular Dose
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms Results */}
          {filteredSymptoms.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <Stethoscope className="w-3.5 h-3.5 text-amber-500" />
                <span>Consulta por Sintomas</span>
              </div>
              <div className="space-y-1.5">
                {filteredSymptoms.map((sym) => (
                  <button
                    key={sym.id}
                    onClick={handleSelectSymptom}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-amber-200 dark:hover:border-slate-700 text-left transition-colors group cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {sym.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {sym.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lab Tests */}
          {filteredLabs.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
                <span>Exames Laboratoriais</span>
              </div>
              <div className="space-y-1.5">
                {filteredLabs.map((lab) => (
                  <button
                    key={lab.id}
                    onClick={handleSelectLab}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-purple-200 dark:hover:border-slate-700 text-left transition-colors group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {lab.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {lab.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {lab.clinicalSignificance}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Patients */}
          {filteredPatients.length > 0 && (
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 text-teal-500" />
                <span>Pacientes Cadastrados</span>
              </div>
              <div className="space-y-1.5">
                {filteredPatients.map((pat) => (
                  <button
                    key={pat.id}
                    onClick={() => handleSelectPatient(pat.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-teal-200 dark:hover:border-slate-700 text-left transition-colors group cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {pat.name} ({pat.species} - {pat.weight} kg)
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Tutor: {pat.tutorName} • {pat.tutorPhone}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Dica: selecione qualquer item para abrir diretamente.</span>
          <span className="font-mono">VET CALC PRO</span>
        </div>
      </div>
    </div>
  );
};
