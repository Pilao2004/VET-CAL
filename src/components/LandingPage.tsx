import React, { useEffect, useRef, useState } from 'react';
import { Calculator, Check, ChevronDown, ClipboardList, FileText, KeyRound, MessageCircle, Pill, ShieldCheck, Siren, Smartphone, Stethoscope } from 'lucide-react';
import { AccountAccess } from './AccountAccess';
import { useApp } from '../context/AppContext';
import { APP_FEATURES, HOTMART_URL, isLandingPreview, KIWIFY_URL, PRICE_FROM_LABEL, PRICE_LABEL } from '../config/plans';

const PREVIEW = isLandingPreview();

const LOGO = './assets/aistudio/_cone_Vet_Calc_Pro_com_Patinha_Calculadora_42b4d775.png';

const HIGHLIGHTS = [
  { icon: Calculator, title: 'Doses sem erro', text: 'Dose em mg e volume em mL, com a memória de cálculo para conferir.' },
  { icon: Siren, title: 'Plantão e emergência', text: 'Tabela por peso com PCR, convulsão e reversores prontos para usar.' },
  { icon: MessageCircle, title: 'Assistente IA', text: 'Pergunte como a um colega: doses, condutas e fichas dos seus pacientes.' },
  { icon: Pill, title: '+500 apresentações', text: 'Biblioteca de medicamentos com concentração e doses de referência.' },
  { icon: ClipboardList, title: 'Prontuários', text: 'Pacientes, consultas e evolução clínica ditada por voz.' },
  { icon: FileText, title: 'Receita em PDF', text: 'Gere a receita e envie ao tutor pelo WhatsApp.' },
];

const FAQ = [
  { q: 'É assinatura?', a: 'Não. É uma compra única: você paga uma vez e usa para sempre, sem mensalidade.' },
  { q: 'Como recebo o acesso?', a: 'Depois da aprovação do pagamento, toque em "Já comprei" e entre com o mesmo e-mail da compra (pela conta Google ou criando uma senha). Assim que a compra for confirmada, o app abre sozinho.' },
  { q: 'Funciona no celular?', a: 'Sim. Funciona no navegador do celular, tablet ou computador, e pode ser instalado na tela inicial. As calculadoras funcionam até sem internet.' },
  { q: 'E se eu não gostar?', a: 'Você tem 7 dias de garantia: é só pedir o reembolso. Com o reembolso, o acesso é encerrado.' },
  { q: 'Substitui o médico-veterinário?', a: 'Não. O VET CALC PRO é uma ferramenta de apoio; a decisão clínica é sempre do profissional responsável.' },
];

/** Página de vendas: aparece para quem ainda não liberou o app. */
export const LandingPage: React.FC = () => {
  const { setCurrentView, accountUser } = useApp();
  const [showClaim, setShowClaim] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const claimRef = useRef<HTMLDivElement>(null);

  const openClaim = () => {
    setShowClaim(true);
    setTimeout(() => claimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  // Página de obrigado do checkout pode redirecionar para ?ativar=1
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('ativar')) openClaim();
  }, []);

  // Na prévia, mostra os botões mesmo sem os links configurados
  const kiwifyUrl = KIWIFY_URL || (PREVIEW ? '#comprar' : '');
  const hotmartUrl = HOTMART_URL || (PREVIEW ? '#comprar' : '');
  const hasCheckout = Boolean(kiwifyUrl || hotmartUrl);
  const BuyButtons = () =>
    hasCheckout ? (
      <div className="flex flex-col sm:flex-row gap-2.5 w-full">
        {kiwifyUrl && (
          <a href={kiwifyUrl} target={PREVIEW ? undefined : '_blank'} rel="noopener noreferrer" className="flex-1 py-3.5 px-5 rounded-xl bg-[var(--primary)] hover:brightness-110 text-[#062C23] text-sm font-extrabold text-center">
            Comprar agora{hotmartUrl ? ' (Kiwify)' : ''}
          </a>
        )}
        {hotmartUrl && (
          <a href={hotmartUrl} target={PREVIEW ? undefined : '_blank'} rel="noopener noreferrer" className={`flex-1 py-3.5 px-5 rounded-xl text-sm font-extrabold text-center ${kiwifyUrl ? 'border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10' : 'bg-[var(--primary)] text-[#062C23] hover:brightness-110'}`}>
            Comprar agora{kiwifyUrl ? ' (Hotmart)' : ''}
          </a>
        )}
      </div>
    ) : (
      <p className="text-sm text-[var(--text-secondary)]">As vendas abrem em breve.</p>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      <header className="sticky top-0 z-30 bg-[var(--bg-main)]/90 backdrop-blur border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={LOGO} alt="" className="w-9 h-9 rounded-xl" />
            <span className="font-extrabold tracking-tight truncate">VET CALC PRO</span>
          </div>
          <button type="button" onClick={openClaim} className="shrink-0 px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-bold hover:border-[var(--primary)] cursor-pointer">
            Já comprei
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 pt-10 sm:pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1.5 rounded-full">
            <Stethoscope className="w-4 h-4" /> Para estudantes, estagiários e médicos-veterinários
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Cálculos e consultas veterinárias em segundos, <span className="text-[var(--primary)]">sem medo de errar a dose.</span>
          </h1>
          <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
            Calculadoras clínicas, tabela de emergência, biblioteca de medicamentos, prontuários e uma assistente IA, tudo num só app. Pague uma vez e use para sempre.
          </p>
          <div className="max-w-md space-y-3">
            <BuyButtons />
            <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--primary)]" /> Compra única · 7 dias de garantia · acesso imediato
            </p>
          </div>
        </div>
        <img src="./assets/home-labrador-gato.webp" alt="Labrador e gato" className="w-full aspect-[4/3] object-cover rounded-3xl border border-[var(--border)]" />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">O que você leva</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <Icon className="w-6 h-6 text-[var(--primary)]" />
              <p className="font-bold">{title}</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8">Como funciona</h2>
        <ol className="grid sm:grid-cols-3 gap-4">
          {[
            ['Compre', 'Pague por Pix ou cartão, em ambiente seguro.'],
            ['Entre', 'Toque em "Já comprei" e entre com o mesmo e-mail da compra.'],
            ['Use', 'Acesso permanente no celular, tablet e computador.'],
          ].map(([title, text], i) => (
            <li key={title} className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-[#062C23] font-extrabold flex items-center justify-center">{i + 1}</span>
              <p className="font-bold">{title}</p>
              <p className="text-sm text-[var(--text-secondary)]">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="comprar" className="max-w-xl mx-auto px-4 py-12">
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border-2 border-[var(--primary)] space-y-5">
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-[var(--primary)]">VET CALC PRO completo · compra única</p>
            {PRICE_FROM_LABEL && <p className="text-sm text-[var(--text-secondary)] line-through">{PRICE_FROM_LABEL}</p>}
            {(PRICE_LABEL || PREVIEW) && <p className="text-4xl font-extrabold">{PRICE_LABEL || 'R$ 97,00'}</p>}
            <p className="text-xs text-[var(--text-secondary)]">Pagamento único. Sem mensalidade.</p>
          </div>
          <ul className="space-y-2">
            {APP_FEATURES.map((f) => (
              <li key={f} className="text-sm flex gap-2">
                <Check className="w-4 h-4 shrink-0 text-[var(--primary)] mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <BuyButtons />
          <p className="text-xs text-center text-[var(--text-secondary)] flex items-center justify-center gap-1.5">
            <Smartphone className="w-4 h-4" /> Funciona no navegador e pode ser instalado na tela inicial
          </p>
        </div>
      </section>

      <section ref={claimRef} className="max-w-xl mx-auto px-4 py-6">
        {showClaim || accountUser ? (
          <AccountAccess preview={PREVIEW} />
        ) : (
          <button type="button" onClick={openClaim} className="w-full p-4 rounded-2xl border border-dashed border-[var(--border)] text-sm font-bold hover:border-[var(--primary)] cursor-pointer">
            Já comprei: liberar meu acesso
          </button>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6">Perguntas frequentes</h2>
        <div className="space-y-2">
          {FAQ.map(({ q, a }, i) => (
            <div key={q} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-4 flex items-center justify-between gap-3 text-left font-bold text-sm cursor-pointer" aria-expanded={openFaq === i}>
                {q}
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="px-4 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">{a}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8 px-4 text-center text-xs text-[var(--text-secondary)] space-y-2">
        <p>VET CALC PRO é uma ferramenta de apoio. Toda conduta clínica deve ser realizada pelo médico-veterinário responsável (CFMV/CRMV).</p>
        <button type="button" onClick={() => setCurrentView('legal')} className="underline cursor-pointer">
          Termos de Uso e Política de Privacidade
        </button>
      </footer>
    </div>
  );
};
