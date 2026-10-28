import React, { useState } from 'react';
import { ScrollRow } from './ScrollRow';
import {
  Stethoscope,
  AlertTriangle,
  HelpCircle,
  FlaskConical,
  ShieldCheck,
  CheckSquare,
  Square,
  Info,
  ChevronRight,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { CLINICAL_SYMPTOMS } from '../data/symptoms';
import { SymptomInfo, VeterinarySpecies } from '../types';

// Só as espécies com conteúdo cadastrado em CLINICAL_SYMPTOMS
const SPECIES_OPTIONS: VeterinarySpecies[] = ['Canino', 'Felino'];

export const SymptomsView: React.FC = () => {
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>(['vomito']);
  const [activeDetailId, setActiveDetailId] = useState<string>('vomito');
  const [patientSpecies, setPatientSpecies] = useState<VeterinarySpecies>('Canino');

  const filteredSymptoms = CLINICAL_SYMPTOMS.filter(s => s.species.includes(patientSpecies));

  const toggleSymptom = (id: string) => {
    setSelectedSymptomIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      if (!exists) {
        setActiveDetailId(id);
      } else if (activeDetailId === id && next.length > 0) {
        setActiveDetailId(next[0]);
      }
      return next;
    });
  };

  const activeSymptom = CLINICAL_SYMPTOMS.find((s) => s.id === activeDetailId) || CLINICAL_SYMPTOMS[0];

  // Aggregated data when multiple symptoms are selected
  const selectedSymptomsList = CLINICAL_SYMPTOMS.filter((s) => selectedSymptomIds.includes(s.id));

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Title banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <Stethoscope className="w-6 h-6 text-amber-500" />
              <span>Consulta por Sintomas & Raciocínio Clínico</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Selecione os sintomas observados no paciente para estruturar hipóteses diagnósticas diferenciais, perguntas de anamnese e exames prioritários.
            </p>
          </div>

          {/* Species selector */}
          <div className="relative">
            <select
              value={patientSpecies}
              onChange={(e) => setPatientSpecies(e.target.value as VeterinarySpecies)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold py-2 pl-4 pr-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              {SPECIES_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-2">
          Conteúdo disponível para cães e gatos. Outras espécies serão adicionadas nas próximas versões.
        </p>

        {/* Symptoms Multi-Select Buttons */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Selecione um ou mais sintomas apresentados para {patientSpecies}:
          </span>
          <ScrollRow label="sintomas" className="flex flex-nowrap gap-2 pb-2">
            {filteredSymptoms.map((sym) => {
              const isSelected = selectedSymptomIds.includes(sym.id);
              return (
                <button
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 fill-slate-950 text-white" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>{sym.name.split(' (')[0]}</span>
                </button>
              );
            })}
          </ScrollRow>
        </div>
      </div>

      {/* Selected Symptoms Tab Navigation (if multiple) */}
      {selectedSymptomsList.length > 1 && (
        <ScrollRow label="sintomas selecionados" fade="from-[var(--bg-main)]" className="flex items-center space-x-2 pb-1">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Detalhando:</span>
          {selectedSymptomsList.map((sym) => (
            <button
              key={sym.id}
              onClick={() => setActiveDetailId(sym.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeDetailId === sym.id
                  ? 'bg-[#0B1D3A] text-white shadow'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {sym.name.split(' (')[0]}
            </button>
          ))}
        </ScrollRow>
      )}

      {/* Main Clinical Decision Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Differentials & Anamnesis */}
        <div className="lg:col-span-7 space-y-6">
          {/* Anamnesis Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <span>Perguntas Essenciais para a Anamnese</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Questione o tutor detalhadamente sobre a evolução temporal e fatores desencadeantes:
            </p>

            <div className="space-y-2 pt-1">
              {activeSymptom.anamnesisQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Differential Diagnoses Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-amber-500" />
                <span>Possíveis Diagnósticos Diferenciais</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Organizados por relevância epidemiológica e gravidade clínica:
              </p>
            </div>

            <div className="space-y-3">
              {activeSymptom.differentials.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {diff.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                        diff.category === 'Emergencial'
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                          : diff.category === 'Grave'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {diff.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {diff.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-1.5 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Exames-chave:</span>
                    {diff.recommendedExams.map((ex, i) => (
                      <span key={i} className="px-1.5 py-0.2 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Red Flags & Recommended Exams */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sinais de Alerta (Red Flags) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-red-500/40 dark:border-red-500/30 shadow-md space-y-3">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <Flame className="w-5 h-5 fill-red-500" />
              <h3 className="font-extrabold text-base tracking-tight">
                Sinais de Alerta (Emergência Médica)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A presença de qualquer um desses sinais requer intervenção imediata de suporte de vida e estabilização hemodinâmica:
            </p>

            <div className="space-y-2 pt-1">
              {activeSymptom.redFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-200 font-medium flex items-start space-x-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exames Complementares Recomendados com Justificativa */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <FlaskConical className="w-5 h-5 text-purple-500" />
              <span>Exames Complementares & Justificativas</span>
            </h3>

            <div className="space-y-3">
              {activeSymptom.recommendedExams.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/40 text-xs space-y-1"
                >
                  <div className="font-bold text-purple-900 dark:text-purple-300">
                    {ex.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    <strong>Por que solicitar:</strong> {ex.justification}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Apoio ao Raciocínio Clínico:</strong> Esta ferramenta não substitui a anamnese presencial, o exame físico minucioso e o julgamento técnico do médico-veterinário responsável.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
