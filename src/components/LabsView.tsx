import React, { useState } from 'react';
import {
  FlaskConical,
  Search,
  Activity,
  Droplet,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { LAB_PARAMETERS } from '../data/labTests';
import { LabParameter } from '../types';

export const LabsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');

  // Interactive quick interpreter
  const [selectedParamId, setSelectedParamId] = useState<string>('creatinina');
  const [inputValue, setInputValue] = useState<string>('2.5');

  const categories = ['Hemograma', 'Bioquímica', 'Urinálise'];

  const filteredParams = LAB_PARAMETERS.filter((param) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      param.name.toLowerCase().includes(q) ||
      param.clinicalSignificance.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'all' || param.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const activeParam = LAB_PARAMETERS.find((p) => p.id === selectedParamId) || LAB_PARAMETERS[0];
  const activeRef = species === 'dog' ? activeParam.referenceDog : activeParam.referenceCat;

  // Interpret entered value
  const numVal = parseFloat(inputValue.replace(',', '.'));
  let interpretationStatus: 'low' | 'normal' | 'high' | 'invalid' = 'normal';
  if (isNaN(numVal)) {
    interpretationStatus = 'invalid';
  } else if (numVal < activeRef.min) {
    interpretationStatus = 'low';
  } else if (numVal > activeRef.max) {
    interpretationStatus = 'high';
  } else {
    interpretationStatus = 'normal';
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Title & Species Toggle */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <FlaskConical className="w-6 h-6 text-purple-500" />
              <span>Guia de Exames Laboratoriais & Valores de Referência</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Consulte valores de referência específicos por espécie e interprete os significados clínicos de valores alterados.
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 self-start sm:self-center">
            <button
              onClick={() => setSpecies('dog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                species === 'dog'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Cão (Canino)
            </button>
            <button
              onClick={() => setSpecies('cat')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                species === 'cat'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Gato (Felino)
            </button>
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar parâmetro (ex: ALT, Creatinina, Hematócrito, Densidade)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#0F172A] dark:text-white text-xs placeholder:text-[#64748B] dark:placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-6 flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Quick Interpreter Card */}
      <div className="bg-gradient-to-r from-purple-900/90 via-[#0B1D3A] to-purple-900/90 text-white rounded-3xl p-6 shadow-xl border border-purple-800/50 space-y-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base tracking-tight">
            Interpretador Clínico Interativo de Resultados
          </h3>
        </div>
        <p className="text-xs text-purple-200">
          Selecione um analito e digite o valor obtido do exame do paciente para ver a interpretação fisiopatológica automática:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-bold text-purple-200 uppercase tracking-wider mb-1">
              Parâmetro Laboratorial
            </label>
            <select
              value={selectedParamId}
              onChange={(e) => {
                setSelectedParamId(e.target.value);
                const p = LAB_PARAMETERS.find((item) => item.id === e.target.value);
                if (p) {
                  const ref = species === 'dog' ? p.referenceDog : p.referenceCat;
                  setInputValue(String(ref.max * 1.2)); // set sample high
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 border border-purple-500/40 text-white text-xs font-medium focus:ring-2 focus:ring-purple-400"
            >
              {LAB_PARAMETERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-purple-200 uppercase tracking-wider mb-1">
              Valor Obtido do Paciente ({activeParam.unit})
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 border border-purple-500/40 text-white text-sm font-mono focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="text-[11px] font-mono text-purple-300 text-center py-2 bg-purple-950/60 rounded-xl border border-purple-800/60">
              Ref: {activeRef.min} a {activeRef.max}
            </div>
          </div>
        </div>

        {/* Dynamic Interpretation Box */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/30 text-xs space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {interpretationStatus === 'low' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] sm:text-xs font-bold break-words">
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                <span>VALOR DIMINUÍDO (ABAIXO DO NORMAL)</span>
              </span>
            )}
            {interpretationStatus === 'high' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-bold break-words">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                <span>VALOR AUMENTADO (ACIMA DO NORMAL)</span>
              </span>
            )}
            {interpretationStatus === 'normal' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs font-bold break-words">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>DENTRO DA FAIXA DE REFERÊNCIA NORMAL</span>
              </span>
            )}
          </div>

          <p className="text-slate-200 text-xs leading-relaxed pt-1">
            {interpretationStatus === 'high' && activeParam.highMeaning}
            {interpretationStatus === 'low' && activeParam.lowMeaning}
            {interpretationStatus === 'normal' &&
              `O valor informado de ${inputValue} ${activeParam.unit} está fisiologicamente normal para ${species === 'dog' ? 'cães' : 'gatos'} (${activeRef.min} a ${activeRef.max} ${activeParam.unit}).`}
          </p>

          <p className="text-[11px] text-purple-300/80 pt-1 border-t border-purple-900/60">
            <strong>Relevância Clínica:</strong> {activeParam.clinicalSignificance}
          </p>
        </div>
      </div>

      {/* Reference Tables Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Tabela Completa de Parâmetros ({species === 'dog' ? 'Valores para Cães' : 'Valores para Gatos'})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredParams.map((param) => {
            const ref = species === 'dog' ? param.referenceDog : param.referenceCat;
            return (
              <div
                key={param.id}
                onClick={() => {
                  setSelectedParamId(param.id);
                  setInputValue(String(ref.max));
                }}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {param.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {param.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400">
                      {ref.min} - {ref.max} {param.unit}
                    </div>
                    {ref.text && (
                      <span className="text-[10px] text-slate-400 font-mono">{ref.text}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Importância:</span> {param.clinicalSignificance}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-semibold pt-1">
                  <span>Interpretar neste paciente →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
