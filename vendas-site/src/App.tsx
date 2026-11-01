import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Calculator,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleHelp,
  ClipboardCheck,
  FileText,
  GraduationCap,
  HeartPulse,
  Play,
  ShieldCheck,
  SlidersVertical,
  Sparkles,
  Stethoscope,
  UserCheck,
  X,
  Zap,
  Settings,
  Check,
  ExternalLink,
  Star,
  MessageSquare,
  ThumbsUp,
  BadgeCheck
} from 'lucide-react';

interface OfferPlan {
  id: string;
  name: string;
  badge?: string;
  description: string;
  price: string;
  installments: string;
  duration: string;
  features: string[];
  hotmartUrl: string;
  popular?: boolean;
}

interface BonusItem {
  id: string;
  title: string;
  description: string;
  value: string;
  img: string;
}

const DEFAULT_OFFERS: OfferPlan[] = [
  {
    id: 'pro',
    name: 'Acesso VET CALC PRO',
    badge: 'OFERTA ESPECIAL',
    description: 'Acesso completo a todas as ferramentas, calculadoras e biblioteca farmacológica.',
    price: 'R$ 27,90',
    installments: 'ou em até 3x no cartão',
    duration: 'Acesso completo imediato',
    features: [
      'Todas as calculadoras veterinárias',
      'Biblioteca farmacológica completa',
      'Fluidoterapia e Infusão Contínua',
      'Guia de exames e parâmetros',
      'Prontuário de pacientes',
      'Assistente IA veterinário',
      'Atualizações automáticas'
    ],
    hotmartUrl: 'https://mpago.li/1bku2Ff',
    popular: true
  }
];

const BONUSES: BonusItem[] = [
  {
    id: 'b1',
    title: 'Guia de Urgências e Emergências Clínicas',
    description: 'Manual digital prático com fluxograma de atendimento inicial para pacientes críticos em cães e gatos.',
    value: 'R$ 25,00',
    img: './media/bonus-guia.jpg'
  },
  {
    id: 'b2',
    title: 'Checklist de Anamnese e Exame Físico',
    description: 'Roteiro sistemático para não esquecer nenhum detalhe durante a consulta clínica diária.',
    value: 'R$ 25,00',
    img: './media/bonus-checklist.jpg'
  }
];

const CLINIC_PHOTOS = [
  { src: './media/foto-spitz.jpg', alt: 'Spitz alemão em observação na clínica' },
  { src: './media/foto-gatinho.jpg', alt: 'Gatinho branco e cinza olhando para a câmera' },
  { src: './media/foto-dalmata.jpg', alt: 'Cão malhado de língua de fora durante a consulta' },
  { src: './media/foto-labrador.jpg', alt: 'Filhote preto de língua de fora na clínica' },
  { src: './media/foto-chihuahua.jpg', alt: 'Chihuahua de pelo longo sobre a mesa de atendimento' },
  { src: './media/foto-golden-colar.jpg', alt: 'Golden retriever idoso com colar elizabetano' },
  { src: './media/foto-labrador-sofa.jpg', alt: 'Filhote preto deitado e sorridente' },
  { src: './media/foto-gato.jpg', alt: 'Gato cinza e branco sobre a mesa de atendimento' },
  { src: './media/foto-shihtzu.jpg', alt: 'Shih-tzu de roupinha sobre o tapete higiênico' },
  { src: './media/foto-filhote.jpg', alt: 'Filhote de olhos azuis sobre a mesa de inox' },
  { src: './media/foto-lhasa.jpg', alt: 'Lhasa apso recebendo carinho na consulta' },
  { src: './media/foto-bully.jpg', alt: 'Bully merle sobre a mesa de atendimento' },
  { src: './media/foto-gato-laranja.jpg', alt: 'Gato laranja no colo durante a consulta' },
  { src: './media/foto-chihuahua-idoso.jpg', alt: 'Chihuahua idoso de coleira vermelha' },
  { src: './media/foto-yorkshire-lacos.jpg', alt: 'Yorkshire com dois lacinhos no colo da tutora' },
  { src: './media/foto-yorkshire.jpg', alt: 'Yorkshire com lacinho rosa na clínica' },
  { src: './media/foto-lulu.jpg', alt: 'Lulu da Pomerânia em close' }
];

interface FeedbackScreenshot {
  src: string;
  alt: string;
  title: string;
  badge: string;
}

// Avaliações reais enviadas por usuários (nome e foto borrados, uso autorizado na conversa)
const FEEDBACK_SCREENSHOTS: FeedbackScreenshot[] = [
  {
    src: './media/avaliacao-1.jpg',
    alt: 'Conversa no Instagram em que um usuário elogia a parte de medicamentos e autoriza a publicação',
    title: 'Várias marcas e concentrações, fica bem mais fácil achar',
    badge: 'Biblioteca de Medicamentos'
  },
  {
    src: './media/avaliacao-2.jpg',
    alt: 'Conversa no Instagram em que um usuário elogia a parte de medicamentos, sugere um plano de IA avançado e autoriza a publicação',
    title: 'Várias marcas e concentrações; sugere um plano de IA avançado',
    badge: 'Medicamentos'
  },
  {
    src: './media/avaliacao-3.jpg',
    alt: 'Conversa no Instagram em que um usuário elogia as calculadoras, os medicamentos e as imagens ilustrativas e autoriza a publicação',
    title: 'Calculadoras, medicamentos e imagens ilustrativas',
    badge: 'Calculadoras'
  },
  {
    src: './media/avaliacao-4.jpg',
    alt: 'Conversa no Instagram em que um usuário elogia a calculadora, o assistente de IA, a parte de emergência e os bônus',
    title: 'A parte de emergência me salvou e os bônus são irados',
    badge: 'Emergência & Bônus'
  }
];

// Com poucas avaliações os prints ficam parados e centralizados; a partir de 4 viram carrossel em looping
const FEEDBACK_LOOP = FEEDBACK_SCREENSHOTS.length >= 4;

const FAQS = [
  {
    q: 'O que é o VET CALC PRO?',
    a: 'É uma plataforma online que reúne ferramentas de apoio aos cálculos, estudos e consultas relacionados à Medicina Veterinária.'
  },
  {
    q: 'Preciso instalar algum aplicativo?',
    a: 'Não. A plataforma funciona diretamente pelo navegador, em dispositivos compatíveis (celular, tablet e computador), sem ocupar memória.'
  },
  {
    q: 'Posso acessar pelo celular e computador?',
    a: 'Sim! O VET CALC PRO possui interface adaptável e moderna para qualquer tamanho de tela.'
  },
  {
    q: 'O aplicativo substitui um médico-veterinário?',
    a: 'Não. A plataforma é uma ferramenta de apoio e não substitui a avaliação clínica, conferência das informações farmacológicas, julgamento profissional ou prescrição do médico-veterinário responsável.'
  },
  {
    q: 'Como recebo meu acesso depois da compra?',
    a: 'Assim que o pagamento for confirmado pelo Mercado Pago, você recebe o seu código de acesso para liberar todas as ferramentas da plataforma.'
  },
  {
    q: 'Por quanto tempo terei acesso?',
    a: 'Você terá acesso completo e imediato conforme a oferta adquirida, com todas as ferramentas inclusas.'
  },
  {
    q: 'Quais são as formas de pagamento?',
    a: 'Você pode pagar via Pix, cartão de crédito (com opção de parcelamento em até 3x) ou cartão de débito, pelo ambiente 100% seguro do Mercado Pago.'
  },
  {
    q: 'Posso solicitar reembolso?',
    a: 'Sim! Você conta com garantia incondicional de 7 dias. Se não gostar por qualquer motivo, é só pedir o reembolso e seu dinheiro é devolvido sem burocracia.'
  },
  {
    q: 'Os medicamentos possuem diferentes marcas e concentrações?',
    a: 'A biblioteca é estruturada para apresentar os produtos cadastrados, incluindo princípios ativos, marcas comerciais, laboratórios e apresentações disponíveis (líquido, comprimido, gotas).'
  },
  {
    q: 'A plataforma recebe atualizações?',
    a: 'Sim, todas as melhorias contínuas, novas calculadoras e novos módulos são disponibilizados automaticamente sem nenhum custo adicional durante seu período de acesso.'
  }
];

function FeedbackPlaceholder({ badge }: { badge: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-5 text-center bg-gradient-to-b from-[#142743] to-[#0D172D] border-2 border-dashed border-[#00DFA2]/40 rounded-xl sm:rounded-[18px]">
      <div className="w-12 h-12 rounded-2xl bg-[#00DFA2]/15 text-[#00DFA2] flex items-center justify-center">
        <MessageSquare className="w-6 h-6" />
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#00DFA2]">{badge}</span>
      <span className="text-sm font-semibold text-white leading-snug">Espaço para avaliação de cliente</span>
    </div>
  );
}

export default function App() {
  const [offers, setOffers] = useState<OfferPlan[]>(() => {
    const saved = localStorage.getItem('vet_calc_offers_mp');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_OFFERS;
      }
    }
    return DEFAULT_OFFERS;
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<FeedbackScreenshot | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Intersection observer for smooth reveals
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      return;
    }
    const elements = document.querySelectorAll('main section:not(:first-child) h2, [data-reveal] > *');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el, i) => {
      el.classList.add('reveal');
      if (el.parentElement?.hasAttribute('data-reveal')) {
        (el as HTMLElement).style.transitionDelay = `${(i % 4) * 80}ms`;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToOffers = () => {
    const elem = document.getElementById('ofertas');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSaveOffers = () => {
    localStorage.setItem('vet_calc_offers_mp', JSON.stringify(offers));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowConfigModal(false);
    }, 900);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#0D172D] font-sans antialiased selection:bg-[#00DFA2] selection:text-[#0D172D]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0D172D] to-[#142743] text-white py-14 sm:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00DFA2_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#00DFA2]/10 border border-[#00DFA2]/30 text-[#00DFA2] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 animate-pulse">
            <Zap className="w-4 h-4" />
            <span>Plataforma Online para Medicina Veterinária</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-8 max-w-4xl mx-auto">
            Tudo o que você precisa para simplificar seus cálculos e estudos veterinários em{' '}
            <span className="text-[#00DFA2]">um só lugar!</span>
          </h1>

          {/* Hero App Mockup */}
          <div className="mb-10 -mx-2 sm:mx-auto max-w-3xl drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]">
            <img
              src="./media/hero-app-dose.webp"
              alt="Telas do app VET CALC PRO no celular"
              className="w-full h-auto object-cover rounded-2xl"
              loading="eager"
            />
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Conheça o <strong className="text-white font-semibold">VET CALC PRO</strong>, uma plataforma online
            desenvolvida para reunir calculadoras veterinárias, biblioteca farmacológica, protocolos de referência,
            consulta por sintomas, guia de exames, prontuários e assistência por inteligência artificial em uma única
            interface.
            <span className="block mt-3 text-sm text-[#00DFA2] font-medium">
              Acesse pelo celular, tablet ou computador, sem precisar instalar aplicativos.
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-2xl p-4 max-w-2xl mx-auto mb-10 backdrop-blur-sm">
            <span className="flex items-center gap-1.5">
              <CircleCheck className="w-4 h-4 text-[#00DFA2]" /> Praticidade
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <CircleCheck className="w-4 h-4 text-[#00DFA2]" /> Organização
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <CircleCheck className="w-4 h-4 text-[#00DFA2]" /> Agilidade
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <CircleCheck className="w-4 h-4 text-[#00DFA2]" /> Acesso Online
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToOffers}
              className="w-full sm:w-auto bg-[#00DFA2] hover:bg-[#00C896] text-[#0D172D] font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-xl hover:shadow-[#00DFA2]/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
            >
              <span>QUERO GARANTIR MEU ACESSO AGORA</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Video Presentation Section */}
      <section className="py-16 sm:py-24 bg-[#F3F7FB] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00C896] mb-2 block">
              Demonstração Real
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#0D172D] mb-4">
              Veja a Plataforma em Funcionamento
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Simples, intuitivo e desenvolvido sob medida para otimizar o seu tempo na clínica ou nos estudos.
            </p>
          </div>

          <div className="relative w-full max-w-[360px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-[0_30px_60px_-20px_rgba(13,23,45,0.5)] group border-4 border-white">
            <video
              ref={videoRef}
              src="./media/vet-calc-pro-5-coisas.mp4"
              poster="./media/vet-calc-pro-5-coisas-capa.jpg"
              controls={isVideoPlaying}
              playsInline
              preload="metadata"
              onEnded={() => setIsVideoPlaying(false)}
              className="w-full h-full object-cover"
            />
            {!isVideoPlaying && (
              <button
                type="button"
                onClick={() => {
                  setIsVideoPlaying(true);
                  videoRef.current?.play();
                }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 text-center cursor-pointer transition-opacity group-hover:bg-black/40"
              >
                <span className="w-20 h-20 rounded-full bg-[#00DFA2] text-[#0D172D] flex items-center justify-center shadow-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </span>
                <span className="text-white font-bold text-lg sm:text-xl">
                  Assistir Apresentação do VET CALC PRO
                </span>
                <span className="text-slate-300 text-xs sm:text-sm mt-1">
                  Veja o app funcionando em 35 segundos
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Intermediary CTA */}
      <section className="py-12 bg-white text-center border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={scrollToOffers}
            className="inline-flex items-center justify-center gap-3 bg-[#00DFA2] hover:bg-[#00C896] text-[#0D172D] font-bold text-base sm:text-lg px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-[#00DFA2]/30 hover:scale-[1.02] active:scale-95"
          >
            <span>QUERO GARANTIR MEU ACESSO AGORA</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Modules & Resources */}
      <section id="recursos" className="py-20 bg-[#F3F7FB] paw-texture px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00C896] mb-2 block">
              Módulos Exclusivos
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D172D] mb-4">
              Uma plataforma completa para acompanhar sua rotina veterinária.
            </h2>
            <p className="text-slate-600 text-base">
              Desenvolvido com rigor técnico para eliminar erros de cálculo e acelerar suas consultas.
            </p>
          </div>

          <div data-reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Calculadora de Medicamentos',
                desc: 'Cálculos de doses e quantidades para apresentações líquidas, comprimidos e gotas, considerando as informações farmacológicas cadastradas.',
                icon: Calculator
              },
              {
                title: 'Fluidoterapia Veterinária',
                desc: 'Ferramentas de apoio aos cálculos de manutenção, déficit hídrico e necessidades diárias de fluidos para pequenos animais.',
                icon: HeartPulse
              },
              {
                title: 'Infusão Contínua',
                desc: 'Cálculos precisos relacionados à preparação e às taxas de infusão de drogas vasoativas, analgésicas e anestésicas.',
                icon: Activity
              },
              {
                title: 'Transfusão Sanguínea',
                desc: 'Ferramentas auxiliares para estimativas de volumes transfusionais em cães e gatos conforme hematócrito.',
                icon: Zap
              },
              {
                title: 'Diluição de Medicamentos',
                desc: 'Cálculos matemáticos exatos de concentrações, reconstituições e diluições injetáveis.',
                icon: SlidersVertical
              },
              {
                title: 'Conversão de Porcentagem',
                desc: 'Conversão rápida entre diferentes unidades e formas de apresentação de concentrações farmacológicas (% para mg/mL).',
                icon: Sparkles
              },
              {
                title: 'Biblioteca Farmacológica',
                desc: 'Consulta ágil de medicamentos, princípios ativos, marcas comerciais, laboratórios e apresentações disponíveis.',
                icon: BookOpen
              },
              {
                title: 'Consulta por Sintomas',
                desc: 'Ferramenta de apoio à organização de hipóteses diagnósticas, perguntas de anamnese e exames complementares.',
                icon: CircleHelp
              },
              {
                title: 'Guia de Exames',
                desc: 'Consulta de parâmetros laboratoriais bioquímicos e hematológicos com informações de apoio à interpretação clínica.',
                icon: Stethoscope
              },
              {
                title: 'Prontuário de Pacientes',
                desc: 'Organização estruturada dos registros, histórico clínico, peso e evolução dos pacientes.',
                icon: FileText
              },
              {
                title: 'Assistente IA',
                desc: 'Interface de apoio especializada para dúvidas, consultas rápidas e conferência de cálculos veterinários.',
                icon: Brain
              }
            ].map((module, idx) => {
              const IconComp = module.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-200/80 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0D172D] text-[#00DFA2] flex items-center justify-center mb-5 group-hover:bg-[#00DFA2] group-hover:text-[#0D172D] transition-colors shadow-md">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0D172D] mb-2">{module.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{module.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#00C896]">
                    <span>Recurso incluso</span>
                    <CircleCheck className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section id="publico" className="py-20 bg-white paw-texture px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00C896] mb-2 block">
              Público-Alvo
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D172D] mb-4">
              O VET CALC PRO foi pensado para quem vive a Medicina Veterinária.
            </h2>
            <p className="text-slate-600 text-base">
              Desenvolvido para atender desde acadêmicos até profissionais experientes na rotina clínica.
            </p>
          </div>

          <div data-reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Estudantes de Medicina Veterinária',
                desc: 'Para quem deseja organizar os estudos, fixar conceitos e praticar cálculos veterinários com segurança.',
                icon: GraduationCap,
                img: './media/publico-estudantes.jpg'
              },
              {
                title: 'Estagiários',
                desc: 'Para quem está começando a acompanhar a rotina clínica e precisa consultar informações com rapidez e precisão.',
                icon: UserCheck,
                img: './media/publico-estagiarios.jpg'
              },
              {
                title: 'Médicos-Veterinários',
                desc: 'Para profissionais que buscam centralizar ferramentas ágeis de apoio à rotina e agilizar plantões e atendimentos.',
                icon: Stethoscope,
                img: './media/publico-veterinarios.jpg'
              },
              {
                title: 'Profissionais que buscam organização',
                desc: 'Para quem prefere reunir diferentes recursos veterinários em uma única plataforma online moderna e confiável.',
                icon: Award,
                img: './media/publico-organizacao.jpg'
              }
            ].map((target, idx) => {
              const IconTarget = target.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F3F7FB] rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={target.img}
                      alt={target.title}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D172D]/80 via-transparent to-transparent flex items-end p-4">
                      <div className="w-10 h-10 rounded-xl bg-[#00DFA2] text-[#0D172D] flex items-center justify-center font-bold shadow-md">
                        <IconTarget className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#0D172D] mb-2">{target.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{target.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Routine & Infinite Photo Carousel */}
      <section id="rotina" className="py-20 bg-[#F3F7FB] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00C896] mb-2 block">
              Da Rotina Clínica
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D172D] mb-4">
              Cada paciente pede um cálculo diferente.
            </h2>
            <p className="text-slate-600 text-base">
              Filhote, idoso, cão ou gato: a dose muda com o peso e a espécie, e o VET CALC PRO acompanha cada um deles.
            </p>
          </div>
        </div>

        <div className="photo-strip mt-6">
          <div className="photo-track flex gap-4 sm:gap-6 w-max py-6">
            {[...CLINIC_PHOTOS, ...CLINIC_PHOTOS].map((photo, idx) => (
              <figure
                key={idx}
                aria-hidden={idx >= CLINIC_PHOTOS.length}
                className={`shrink-0 w-44 sm:w-56 bg-white p-2 rounded-2xl sm:rounded-3xl shadow-[0_20px_40px_-18px_rgba(13,23,45,0.45)] transition-transform hover:scale-105 ${
                  idx % 2 ? 'rotate-1' : '-rotate-1'
                }`}
              >
                <img
                  src={photo.src}
                  alt={idx < CLINIC_PHOTOS.length ? photo.alt : ''}
                  decoding="async"
                  className="w-full aspect-[3/4] object-cover rounded-xl sm:rounded-[18px]"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section id="bonus" className="py-20 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00C896] mb-2 block">
              Presentes de Lançamento
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D172D] mb-4">
              E tem mais: confira os bônus que acompanham sua oferta!
            </h2>
            <p className="text-slate-600 text-base">
              Materiais complementares desenvolvidos para acelerar ainda mais o seu desenvolvimento profissional.
            </p>
          </div>

          <div data-reveal className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {BONUSES.map((bonus, idx) => (
              <div
                key={bonus.id}
                className="group bg-[#F3F7FB] rounded-2xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <img
                    src={bonus.img}
                    alt={bonus.title}
                    className={`w-full h-auto rounded-xl mb-6 shadow-[0_18px_40px_-12px_rgba(13,23,45,0.45)] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.02] ${
                      idx === 0 ? '-rotate-[1.5deg]' : 'rotate-[1.5deg]'
                    }`}
                  />
                  <div className="w-12 h-12 rounded-xl bg-[#0D172D] text-[#00DFA2] flex items-center justify-center mb-6 shadow-md">
                    {idx === 0 ? <HeartPulse className="w-6 h-6" /> : <ClipboardCheck className="w-6 h-6" />}
                  </div>
                  <h3 className="text-lg font-bold text-[#0D172D] mb-3">{bonus.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{bonus.description}</p>
                </div>

                <div>
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Valor separado:</span>
                    <span className="text-sm font-bold text-[#00C896] line-through">{bonus.value}</span>
                  </div>
                  <div className="mt-2 text-center bg-[#00DFA2]/20 text-[#0D172D] font-bold text-xs py-1.5 rounded-lg">
                    GRÁTIS NESTA OFERTA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Plan Section */}
      <section id="ofertas" className="py-24 bg-gradient-to-b from-[#0D172D] to-[#142743] text-white px-4 sm:px-6 relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00DFA2_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00DFA2] mb-2 block">
              Investimento no seu Futuro
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Escolha seu acesso ao VET CALC PRO.</h2>
            <p className="text-slate-300 text-base">
              Acesse agora mesmo todas as ferramentas e bônus exclusivos.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {offers.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-white text-[#0D172D] shadow-2xl scale-105 border-2 border-[#00DFA2]'
                    : 'bg-[#142743] text-white border border-slate-700 shadow-xl'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00DFA2] text-[#0D172D] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className={`text-2xl sm:text-3xl font-bold text-center mt-2 mb-5 ${plan.popular ? 'text-[#0D172D]' : 'text-white'}`}>
                    {plan.name}
                  </h3>

                  <div className="-mx-4 sm:-mx-6 mb-6 rounded-2xl bg-gradient-to-b from-[#E6FBF4] to-[#F3F7FB] px-3 pt-6 pb-3">
                    <img
                      src="./media/mockup-oferta.webp"
                      alt="App VET CALC PRO no celular com os bônus Guia de Urgências e Checklist de Anamnese"
                      className="w-full h-auto drop-shadow-[0_18px_24px_rgba(13,23,45,0.25)]"
                    />
                  </div>

                  <p className={`text-sm mb-6 text-center ${plan.popular ? 'text-slate-600' : 'text-slate-300'}`}>
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm">
                        <CircleCheck
                          className={`w-5 h-5 shrink-0 mt-0.5 ${
                            plan.popular ? 'text-[#00C896]' : 'text-[#00DFA2]'
                          }`}
                        />
                        <span className={plan.popular ? 'text-slate-700' : 'text-slate-200'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-6 pt-6 border-t border-slate-200 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-4xl sm:text-5xl font-bold ${plan.popular ? 'text-[#0D172D]' : 'text-white'}`}>
                        {plan.price}
                      </span>
                    </div>
                    <span className={`text-xs block mt-1 ${plan.popular ? 'text-slate-500' : 'text-slate-400'}`}>
                      {plan.installments}
                    </span>
                    <span className="text-xs font-semibold text-[#00C896] block mt-1">{plan.duration}</span>
                  </div>
                </div>

                <a
                  href={plan.hotmartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl font-bold text-center transition-all shadow-lg flex items-center justify-center gap-2 group bg-[#00DFA2] hover:bg-[#00C896] text-[#0D172D] text-base hover:scale-[1.02] active:scale-95"
                >
                  <span>QUERO GARANTIR MEU ACESSO</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="mt-4 text-center">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00C896]" /> Pagamento 100% seguro pelo Mercado Pago
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avaliações & Feedbacks dos Usuários - Estilo Idêntico à Rotina Clínica */}
      <section id="avaliacoes" className="py-20 bg-[#F3F7FB] paw-texture overflow-hidden border-t border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-yellow-500/10 border border-amber-400/50 px-5 py-2 rounded-full mb-3 shadow-sm hover:scale-105 transition-transform">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
              <span className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-amber-600 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(245,158,11,0.25)]">
                AVALIAÇÕES
              </span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D172D] mb-4">
              Avaliações de quem usa o VET CALC PRO.
            </h2>
            <p className="text-slate-600 text-base">
              Prints enviados por quem usa o app, publicados com autorização. Nome e foto foram borrados para preservar a privacidade.
            </p>
          </div>
        </div>

        {/* Carrossel de Prints no Mesmo Estilo da Rotina Clínica com Looping Infinito */}
        <div className={FEEDBACK_LOOP ? 'photo-strip' : 'px-4'}>
          <div className={FEEDBACK_LOOP ? 'photo-track flex gap-4 sm:gap-6 w-max py-6' : 'flex flex-wrap justify-center gap-6 py-6'}>
            {(FEEDBACK_LOOP ? [...FEEDBACK_SCREENSHOTS, ...FEEDBACK_SCREENSHOTS] : FEEDBACK_SCREENSHOTS).map((item, idx) => (
              <figure
                key={idx}
                aria-hidden={idx >= FEEDBACK_SCREENSHOTS.length}
                onClick={() => setSelectedScreenshot(item)}
                className={`shrink-0 w-52 sm:w-64 bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl shadow-[0_20px_40px_-18px_rgba(13,23,45,0.45)] transition-all duration-300 hover:scale-105 hover:rotate-0 hover:shadow-2xl cursor-pointer group ${
                  idx % 2 ? 'rotate-1' : '-rotate-1'
                }`}
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-[18px] bg-slate-900 aspect-[9/18]">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={idx < FEEDBACK_SCREENSHOTS.length ? item.alt : ''}
                      decoding="async"
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <FeedbackPlaceholder badge={item.badge} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                    <span className="text-[11px] font-semibold text-white bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      Clique para ampliar 🔍
                    </span>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-8 text-center">
          <button
            onClick={scrollToOffers}
            className="inline-flex items-center justify-center gap-2.5 bg-[#00DFA2] hover:bg-[#00C896] text-[#0D172D] font-bold text-sm sm:text-base px-8 py-4 rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-95"
          >
            <span>QUERO GARANTIR MEU ACESSO AGORA</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-[#F3F7FB] paw-texture px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-3xl bg-[#00DFA2]/20 text-[#00C896] flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-14 h-14" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00C896] block">
              Garantia Incondicional
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0D172D]">Sua compra com mais tranquilidade.</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Você tem até <strong className="text-[#0D172D]">7 dias</strong> após a confirmação do pagamento para testar todas as funcionalidades do VET CALC PRO. Se por qualquer motivo você não ficar satisfeito, poderá solicitar o reembolso integral de forma rápida e descomplicada.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00C896] mb-2 block">
              Dúvidas Frequentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D172D] mb-4">
              Perguntas Frequentes sobre o VET CALC PRO
            </h2>
            <p className="text-slate-600 text-base">
              Tudo o que você precisa saber antes de garantir seu acesso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 items-start">
            {(() => {
              const half = Math.ceil(FAQS.length / 2);
              const columns = [FAQS.slice(0, half), FAQS.slice(half)];

              return columns.map((colFaqs, colIdx) => (
                <div key={colIdx} className="border-t border-slate-200">
                  {colFaqs.map((faq, itemIdx) => {
                    const globalIdx = colIdx * half + itemIdx;
                    const isOpen = activeFaq === globalIdx;
                    return (
                      <div key={globalIdx} className="border-b border-slate-200">
                        <button
                          onClick={() => toggleFaq(globalIdx)}
                          aria-expanded={isOpen}
                          className="w-full py-5 text-left font-semibold text-[#0D172D] flex items-center justify-between gap-4 hover:text-[#00C896] transition-colors"
                        >
                          <span className="text-base">{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-[#00C896] shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="pb-5 pr-8 text-slate-600 text-sm sm:text-base leading-relaxed animate-fadeIn">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D172D] text-white py-16 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00DFA2] text-[#0D172D] flex items-center justify-center font-bold">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  VET CALC <span className="text-[#00DFA2]">PRO</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Plataforma online de apoio à Medicina Veterinária, cálculos precisos e consulta farmacológica ágil.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#recursos" className="hover:text-[#00DFA2] transition-colors">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#publico" className="hover:text-[#00DFA2] transition-colors">
                    Para Quem É
                  </a>
                </li>
                <li>
                  <a href="#rotina" className="hover:text-[#00DFA2] transition-colors">
                    Rotina Clínica
                  </a>
                </li>
                <li>
                  <a href="#ofertas" className="hover:text-[#00DFA2] transition-colors">
                    Planos de Acesso
                  </a>
                </li>
                <li>
                  <a href="#avaliacoes" className="hover:text-[#00DFA2] transition-colors">
                    Avaliações & Feedbacks
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#00DFA2] transition-colors">
                    Perguntas Frequentes
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal & Privacidade</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-[#00DFA2] transition-colors">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#00DFA2] transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#00DFA2] transition-colors">
                    Política de Reembolso
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="hover:text-[#00DFA2] transition-colors text-left flex items-center gap-1.5 mt-2 text-xs text-slate-400"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configurar link de pagamento</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Suporte & Contato</h4>
              <p className="text-sm text-slate-400 mb-2">Dúvidas sobre o acesso ou suporte técnico?</p>
              <p className="text-sm text-[#00DFA2] font-medium">suporte@vetcalcpro.app</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center space-y-4">
            <p className="text-xs text-slate-400 max-w-4xl mx-auto leading-relaxed">
              <strong>AVISO IMPORTANTE:</strong> O VET CALC PRO é uma ferramenta de apoio à Medicina Veterinária. As informações disponibilizadas não substituem a avaliação clínica, conferência de referências técnicas, julgamento profissional ou prescrição do médico-veterinário responsável.
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} VET CALC PRO. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Payment link configuration modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-[#0D172D] max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <SlidersVertical className="w-5 h-5 text-[#00C896]" />
                <span>Configurar link de pagamento</span>
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-2 text-slate-400 hover:text-[#0D172D] rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Insira abaixo o link de pagamento do Mercado Pago para o plano da sua página de vendas. Ele será salvo e vinculado aos botões de compra.
            </p>

            <div className="space-y-6">
              {offers.map((plan, index) => (
                <div key={plan.id} className="bg-[#F3F7FB] p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-[#0D172D]">
                    {plan.name} ({plan.price})
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Link de pagamento (Mercado Pago):
                    </label>
                    <input
                      type="text"
                      value={plan.hotmartUrl}
                      onChange={(e) => {
                        const updated = [...offers];
                        updated[index].hotmartUrl = e.target.value;
                        setOffers(updated);
                      }}
                      placeholder="https://mpago.li/..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#00C896] bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveOffers}
                className="bg-[#0D172D] hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-[#00DFA2]" /> Salvo!
                  </>
                ) : (
                  'Salvar e Fechar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal for Feedback Screenshot */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 cursor-pointer animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0D172D] border border-slate-700/80 rounded-3xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 shadow-2xl text-white relative cursor-default max-h-[92vh] flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <div>
                <span className="text-[11px] font-bold text-[#00DFA2] uppercase tracking-wider block">
                  {selectedScreenshot.badge}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {selectedScreenshot.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full rounded-2xl overflow-hidden bg-black shadow-inner max-h-[75vh] flex items-center justify-center">
              {selectedScreenshot.src ? (
                <img
                  src={selectedScreenshot.src}
                  alt={selectedScreenshot.alt}
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              ) : (
                <div className="w-full aspect-[9/16]">
                  <FeedbackPlaceholder badge={selectedScreenshot.badge} />
                </div>
              )}
            </div>

            <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1 text-[#00C896] text-xs font-semibold">
                <MessageSquare className="w-4 h-4" /> Avaliação
              </span>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-slate-300 hover:text-white underline text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
