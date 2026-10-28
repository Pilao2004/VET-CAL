import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, Check, ClipboardList, PawPrint, Search, Siren, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';
import { termsAlreadyAccepted } from './TermsConsent';

const KEY = 'vetcalc_tutorial_done';
const VERSION = 1;
export const OPEN_TUTORIAL_EVENT = 'vetcalc:open-tutorial';

/** Abre o tutorial de novo (menu > Ver tutorial). */
export const openTutorial = () => window.dispatchEvent(new Event(OPEN_TUTORIAL_EVENT));

function alreadyDone() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}').version === VERSION;
  } catch {
    return false;
  }
}

interface Step {
  view: ActiveView;
  icon: React.FC<{ className?: string }>;
  title: string;
  intro: string;
  where?: string;
  items: React.ReactNode[];
  tip?: string;
}

const STEPS: Step[] = [
  {
    view: 'home',
    icon: PawPrint,
    title: 'Bem-vindo ao VET CALC PRO',
    intro: 'Em 1 minuto você vai saber usar tudo. São 6 passos curtos, e o app vai mostrando cada tela no fundo.',
    items: [
      <>Para trocar de área, use a <strong>barra de navegação</strong>: fica embaixo no celular e no topo no computador.</>,
      <>Toque na <strong>patinha</strong> no topo para escolher o <strong>Paciente da vez</strong>: o peso e a espécie dele preenchem todas as calculadoras e o nome vai para a receita. Sem paciente, o peso que você digitar numa calculadora vale para as outras.</>,
      <>Os botões <strong>Próximo</strong> e <strong>Voltar</strong> ficam no rodapé deste quadro.</>,
      <>Você pode rever este tutorial quando quiser no menu <strong>⋯</strong> &gt; <strong>Ver tutorial</strong>.</>,
    ],
  },
  {
    view: 'calculators',
    icon: Calculator,
    title: 'Calcular uma dose',
    intro: 'A Calculadora de Medicamentos é a primeira aba de Calculadoras.',
    where: 'Barra de navegação > Calculadoras',
    items: [
      <>Digite o <strong>nome comercial ou o princípio ativo</strong> e toque no produto: concentração e dose de referência são preenchidas sozinhas.</>,
      <>Escolha a forma (<strong>Líquido, Comprimidos ou Gotas</strong>), a espécie e digite o <strong>peso em kg</strong>.</>,
      <>Toque em <strong>CALCULAR</strong>. O resultado mostra a dose, o volume e a <strong>memória de cálculo</strong> passo a passo para você conferir.</>,
      <>Logo abaixo, gere a <strong>receita em PDF</strong> ou envie direto pelo <strong>WhatsApp</strong>.</>,
    ],
    tip: 'Se aparecer um quadro amarelo ou vermelho, é um alerta de segurança para aquela espécie. Leia antes de prescrever.',
  },
  {
    view: 'calculators',
    icon: Siren,
    title: 'Emergência e outras calculadoras',
    intro: 'Na mesma tela, a fileira de abas no topo leva às outras calculadoras.',
    where: 'Calculadoras > abas no topo (arraste para o lado para ver todas)',
    items: [
      <><strong>Tabela de Emergência por Peso</strong>: escolha cão ou gato, digite o peso e veja o volume de cada fármaco (PCR, convulsão, reversores). Dá para baixar em PDF.</>,
      <><strong>Fluidoterapia, Infusão Contínua, Transfusão, Diluição</strong> e outras: preencha os campos e o resultado aparece com a conta explicada.</>,
      <>Se a ampola for diferente, toque na <strong>concentração</strong> e ajuste: o volume é recalculado na hora.</>,
      <>Em parada, toque em <strong>Iniciar cronômetro de RCP</strong>: ele avisa a cada 2 minutos a troca de massagista e o ciclo da adrenalina, já com o volume para o peso.</>,
    ],
  },
  {
    view: 'drugs',
    icon: Search,
    title: 'Consultar medicamentos, sintomas e exames',
    intro: 'Três áreas de consulta rápida, todas na barra de navegação.',
    items: [
      <><strong>Medicamentos</strong>: mais de 500 apresentações. Pesquise pelo nome e toque em <strong>Ver marcas e doses</strong> para ver laboratórios, concentrações e doses de referência.</>,
      <><strong>Sintomas</strong>: marque os sinais do paciente e veja perguntas de anamnese, diferenciais, exames e sinais de alerta.</>,
      <><strong>Exames</strong>: valores de referência para cão e gato e um interpretador onde você digita o resultado do paciente.</>,
      <>Para achar qualquer coisa, use a <strong>lupa</strong> no topo (no computador, <strong>Ctrl + K</strong>).</>,
      <>Toque na <strong>estrela</strong> de um medicamento para fixá-lo em <strong>Seus atalhos</strong>, na tela inicial. Os últimos que você usou também aparecem lá.</>,
    ],
  },
  {
    view: 'patients',
    icon: ClipboardList,
    title: 'Pacientes e Assistente IA',
    intro: 'Organize seus atendimentos e tire dúvidas como se falasse com um colega.',
    where: 'Barra de navegação > Pacientes e Assistente IA',
    items: [
      <><strong>Novo Paciente</strong> cadastra o animal. Dentro da ficha, use <strong>Nova Consulta</strong>, <strong>Criar Evolução</strong> (pode ditar por voz) e <strong>Exportar PDF</strong>.</>,
      <>Os prontuários ficam salvos <strong>neste aparelho</strong>. Toque em <strong>Fazer backup</strong> com frequência para não perder nada.</>,
      <>Na <strong>Assistente IA</strong>, escreva normalmente, por exemplo: <em>"meloxicam, cão, 12 kg"</em>. Ela calcula com o motor do app e também consulta as fichas dos seus pacientes.</>,
    ],
    tip: 'A IA ajuda, mas não substitui o seu julgamento: confira sempre doses e condutas antes de aplicar.',
  },
  {
    view: 'home',
    icon: Sparkles,
    title: 'Pronto! Últimas dicas',
    intro: 'Tudo o que fica no menu ⋯ (canto superior direito):',
    items: [
      <><strong>Minha compra</strong>: mostra o seu acesso. <strong>Modo claro / escuro</strong>: troca as cores (no computador, também pelo botão de sol e lua no topo).</>,
      <><strong>Bônus</strong>: baixe o Guia de Urgências e o Checklist de Anamnese em PDF.</>,
      <><strong>Instale no celular</strong>: no navegador, toque em <strong>Compartilhar</strong> ou <strong>⋮</strong> &gt; <strong>Adicionar à tela inicial</strong>. As calculadoras funcionam até sem internet.</>,
      <>Ficou alguma dúvida? Menu ⋯ &gt; <strong>Suporte</strong>.</>,
    ],
  },
];

/** Tutorial em pop-up no primeiro acesso (depois do aceite dos Termos). */
export const OnboardingTutorial: React.FC = () => {
  const { setCurrentView } = useApp();
  const [open, setOpen] = useState(() => termsAlreadyAccepted() && !alreadyDone());
  const [step, setStep] = useState(0);

  useEffect(() => {
    const start = () => {
      setStep(0);
      setOpen(true);
    };
    const afterTerms = () => {
      if (!alreadyDone()) start();
    };
    window.addEventListener(OPEN_TUTORIAL_EVENT, start);
    window.addEventListener('vetcalc:terms-accepted', afterTerms);
    return () => {
      window.removeEventListener(OPEN_TUTORIAL_EVENT, start);
      window.removeEventListener('vetcalc:terms-accepted', afterTerms);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setCurrentView(STEPS[step].view);
      window.scrollTo({ top: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  const finish = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: VERSION, at: new Date().toISOString() }));
    } catch {}
    setOpen(false);
    setCurrentView('home');
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
      if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, STEPS.length - 1));
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-slate-950/45 p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <div className="w-full sm:max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between px-5 pt-5">
          <span className="text-xs font-bold text-[var(--text-secondary)]">
            Passo {step + 1} de {STEPS.length}
          </span>
          <button type="button" onClick={finish} className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-main)] flex items-center gap-1 cursor-pointer p-1">
            Pular tutorial <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1.5 px-5 pt-3" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-[var(--primary)]' : 'bg-[var(--input-bg)]'}`} />
          ))}
        </div>

        <div className="px-5 sm:px-6 py-5 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <h2 id="tutorial-title" className="text-lg sm:text-xl font-extrabold text-[var(--text-main)] leading-tight">
              {current.title}
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{current.intro}</p>
          {current.where && (
            <p className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/25 rounded-xl px-3 py-2">
              Onde fica: {current.where}
            </p>
          )}
          <ol className="space-y-2.5">
            {current.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-[var(--text-main)] leading-relaxed">
                <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--input-bg)] border border-[var(--border)] text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          {current.tip && (
            <p className="text-xs text-amber-700 dark:text-amber-200 bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-xl px-3 py-2 leading-relaxed">
              {current.tip}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 px-5 pb-5 pt-1">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-4 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <button
            type="button"
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
            className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-[#062C23] text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
            autoFocus
          >
            {isLast ? (
              <>
                Começar a usar <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Próximo <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
