import React from 'react';
import {
  Calculator,
  Pill,
  Stethoscope,
  FlaskConical,
  Users,
  Bot,
  ArrowRight,
  Sparkles,
  History,
  ShieldCheck,
  Star,
  Zap,
  Gift,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveView, CalculatorType } from '../types';
import { CALCULATORS_LIST } from '../data/calculators';
import { COMMERCIAL_PRODUCTS, CommercialProduct } from '../data/commercialProducts';
import { ProductImage } from './ProductImage';

export const HomeView: React.FC = () => {
  const {
    setCurrentView,
    setSelectedCalculator,
    calculationHistory,
    favoriteCalculators,
    setIsSearchOpen,
    favoriteDrugs,
    recentProductIds,
    openCalculatorWithCommercialProduct,
  } = useApp();

  // Atalhos: medicamentos favoritos primeiro, depois os usados por último (até 4)
  const shortcutProducts = [
    ...favoriteDrugs.map((id) => ({ id, fav: true })),
    ...recentProductIds.filter((id) => !favoriteDrugs.includes(id)).map((id) => ({ id, fav: false })),
  ]
    .map(({ id, fav }) => ({ prod: COMMERCIAL_PRODUCTS.find((p) => p.id === id), fav }))
    .filter((x): x is { prod: CommercialProduct; fav: boolean } => Boolean(x.prod))
    .slice(0, 4);

  // Calculadoras: favoritas, depois as usadas recentemente, completando com as principais
  const shortcutCalcs = Array.from(
    new Set<string>([...favoriteCalculators, ...calculationHistory.map((h) => h.type), ...CALCULATORS_LIST.map((c) => c.type)]),
  )
    .map((t) => CALCULATORS_LIST.find((c) => c.type === t))
    .filter((c): c is (typeof CALCULATORS_LIST)[number] => Boolean(c))
    .slice(0, 4);

  const mainButtons: {
    id: ActiveView;
    title: string;
    subtitle: string;
    icon: React.FC<any>;
    color: string;
    borderColor: string;
    tag?: string;
  }[] = [
    {
      id: 'calculators',
      title: '1. Calculadoras',
      subtitle: 'Doses em mg/kg, diluições, fluidoterapia, taxa de infusão e regra de 3',
      icon: Calculator,
      color: 'bg-[var(--primary)]/10 text-[var(--primary)]',
      borderColor: 'hover:border-[var(--primary)]',
      tag: '10 Ferramentas',
    },
    {
      id: 'drugs',
      title: '2. Medicamentos',
      subtitle: 'Doses de referência, princípios ativos, apresentações e botão Calcular Dose',
      icon: Pill,
      color: 'bg-[var(--secondary)]/10 text-[var(--secondary)]',
      borderColor: 'hover:border-[var(--secondary)]',
      tag: 'Farmacologia',
    },
    {
      id: 'symptoms',
      title: '3. Consulta por Sintomas',
      subtitle: 'Raciocínio clínico, diferenciais, perguntas de anamnese e sinais de alerta',
      icon: Stethoscope,
      color: 'bg-amber-500/10 text-amber-600',
      borderColor: 'hover:border-amber-500',
      tag: 'Decisão Clínica',
    },
    {
      id: 'labs',
      title: '4. Exames Laboratoriais',
      subtitle: 'Valores de referência por espécie (cães e gatos) e interpretador interativo',
      icon: FlaskConical,
      color: 'bg-purple-500/10 text-purple-600',
      borderColor: 'hover:border-purple-500',
      tag: 'Hemograma & Bioq.',
    },
    {
      id: 'patients',
      title: '5. Meus Pacientes',
      subtitle: 'Cadastro, histórico clínico, exame físico, prescrições e exportação em PDF',
      icon: Users,
      color: 'bg-teal-500/10 text-teal-600',
      borderColor: 'hover:border-teal-500',
      tag: 'Prontuário LGPD',
    },
    {
      id: 'assistant',
      title: '6. Assistente Veterinário IA',
      subtitle: 'Dúvidas fisiopatológicas, interpretação educacional e revisão de condutas',
      icon: Bot,
      color: 'bg-indigo-500/10 text-indigo-600',
      borderColor: 'hover:border-indigo-500',
      tag: 'Gemini + Groq',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--banner-from)] to-[var(--banner-to)] text-[var(--text-main)] p-6 sm:p-10 shadow-sm border border-[var(--border)] transition-colors">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-[var(--secondary)]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl flex-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Medicina Veterinária de Alta Precisão</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)]">
              Bem-vindo ao VET CALC PRO
            </h1>
            <p className="mt-3 text-base sm:text-lg text-[var(--text-secondary)] font-medium">
              Seu assistente para cálculos e consultas veterinárias.
            </p>

            <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Desenvolvido para estudantes, estagiários e médicos-veterinários. Fórmulas determinísticas, biblioteca farmacológica revisada e prontuário integrado com simplicidade e rapidez.
            </p>

            {/* Quick Search Bar directly in Hero */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex-1 flex items-center justify-between px-4 py-3 bg-[var(--surface)] hover:bg-[var(--border)] backdrop-blur-md border border-[var(--border)] rounded-2xl text-[var(--text-secondary)] text-sm transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-2.5">
                  <Calculator className="w-4 h-4 text-[var(--secondary)]" />
                  <span>O que você gostaria de calcular ou consultar agora?</span>
                </div>
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-[var(--bg-main)] text-[11px] font-mono font-semibold text-[var(--text-main)]">
                  Buscar
                </span>
              </button>
              <button
                onClick={() => {
                  setSelectedCalculator('dosage');
                  setCurrentView('calculators');
                }}
                className="px-6 py-3.5 rounded-2xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[#062C23] font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4 fill-[#062C23]" />
                <span>Calcular Dose Agora</span>
              </button>
            </div>
          </div>

          {/* Right Side: Professional Dog & Cat Illustration */}
          <div className="hidden lg:flex items-center justify-center relative shrink-0">
            <div className="relative w-[26rem] h-64 rounded-3xl overflow-hidden shadow-md border border-[var(--border)] group">
              <img
                src="./assets/home-labrador-gato.webp"
                alt="Filhote de labrador creme ao lado de um gatinho na grama"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060D1C]/60 via-transparent to-transparent flex items-end p-4">
                <div className="flex items-center space-x-2 text-white bg-[var(--primary)] px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-lg">
                  <Stethoscope className="w-4 h-4" />
                  <span>Clínica & Emergência</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus 01 Promo Card */}
      <div 
        onClick={() => setCurrentView('bonus')}
        className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 dark:from-emerald-950/40 dark:to-slate-900 rounded-3xl p-6 border-2 border-emerald-500/50 hover:border-emerald-500 shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-6 group"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <Gift className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold uppercase tracking-wider">
                Bônus 01
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                Bônus inclusos
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-main)] mt-1">
              Guia de Urgências e Emergências Clínicas
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-lg">
              Manual digital prático com fluxograma de atendimento inicial para pacientes críticos em cães e gatos.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block line-through">R$ 97,00</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Incluso na compra</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5">
            <span>Acessar Guia</span>
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* The 6 Main Navigation Buttons Requested */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--text-main)] tracking-tight">
              Módulos Principais
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Acesso direto com no máximo dois toques
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setCurrentView(btn.id)}
                className={`group relative p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between cursor-pointer`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${btn.color}`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    {btn.tag && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-main)] text-[var(--text-secondary)] font-mono">
                        {btn.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                    {btn.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {btn.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--primary)]">
                  <span>Acessar Ferramenta</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Calculator Cards & Calculation History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--surface)] rounded-3xl p-6 border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h3 className="font-bold text-base text-[var(--text-main)]">Seus atalhos</h3>
            </div>
            <button
              onClick={() => setCurrentView('calculators')}
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Todas as calculadoras →
            </button>
          </div>

          {shortcutProducts.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Medicamentos</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {shortcutProducts.map(({ prod, fav }) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => openCalculatorWithCommercialProduct(prod)}
                    className="p-2.5 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg-main)]/50 hover:bg-[var(--primary)]/10 transition-all cursor-pointer flex items-center gap-3 text-left"
                  >
                    <ProductImage product={prod} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-[var(--text-main)] truncate">{prod.brandName.split(' (')[0]}</span>
                      <span className="block text-[11px] text-[var(--text-secondary)] truncate">{prod.activePrinciple}</span>
                    </span>
                    {fav ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" /> : <History className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Calculadoras</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shortcutCalcs.map((calc) => (
              <div
                key={calc.type}
                onClick={() => {
                  setSelectedCalculator(calc.type);
                  setCurrentView('calculators');
                }}
                className="p-3.5 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg-main)]/50 hover:bg-[var(--primary)]/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-[var(--text-main)] group-hover:text-[var(--primary)]">
                    {calc.title}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--border)] text-[var(--text-secondary)]">
                    {calc.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                  {calc.shortDescription}
                </p>
              </div>
            ))}
          </div>
          {shortcutProducts.length === 0 && (
            <p className="mt-3 text-[11px] text-[var(--text-secondary)]">
              Dica: toque na estrela de um medicamento para fixá-lo aqui. Os que você usar aparecem sozinhos.
            </p>
          )}

          <div className="mt-5 p-3.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border)] flex items-start space-x-3 text-xs text-[var(--text-secondary)]">
            <ShieldCheck className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[var(--text-main)]">Apoio à Decisão Médica:</strong> Todas as fórmulas são determinísticas e testadas. Os cálculos e guias posológicos devem ser sempre supervisionados pelo médico-veterinário responsável.
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-3xl p-6 border border-[var(--border)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="font-bold text-base text-[var(--text-main)]">
                  Histórico Recente
                </h3>
              </div>
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                {calculationHistory.length} cálculo(s)
              </span>
            </div>

            {calculationHistory.length === 0 ? (
              <div className="py-8 text-center text-[var(--text-secondary)] text-xs">
                <p>Nenhum cálculo realizado ainda.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {calculationHistory.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-[var(--text-main)] mb-1">
                      <span>{item.title}</span>
                      <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="font-mono text-[var(--primary)] font-bold text-xs">
                      {item.resultSummary}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
