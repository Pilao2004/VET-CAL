// Oferta: compra única, acesso permanente a todo o app.
import { CalculatorType } from '../types';

export const PREMIUM_CALCULATORS: CalculatorType[] = ['emergency', 'cri', 'transfusion', 'bsa'];

const env = (import.meta as any).env || {};

/** Link de compra (compra única). Pode ser trocado por VITE_CHECKOUT_URL no build. */
export const KIWIFY_URL: string = env.VITE_KIWIFY_CHECKOUT_URL || env.VITE_CHECKOUT_URL || 'https://pay.wiapy.com/FODzV1BcUGdN';
export const HOTMART_URL: string = env.VITE_HOTMART_CHECKOUT_URL || '';
/** Preço exibido na página de vendas, ex.: "R$ 97,00". */
export const PRICE_LABEL: string = env.VITE_PRICE_LABEL || 'R$ 27,90';
/** Preço "de", riscado (opcional), ex.: "R$ 197,00". */
export const PRICE_FROM_LABEL: string = env.VITE_PRICE_FROM_LABEL || '';

export const APP_FEATURES = [
  'Calculadora de medicamentos com memória de cálculo',
  'Fluidoterapia, diluição, gotejamento, infusão contínua, transfusão e superfície corporal',
  'Tabela de emergência por peso (PCR, convulsão, reversores)',
  'Biblioteca com mais de 500 apresentações comerciais',
  'Assistente IA: doses, dúvidas clínicas e fichas dos pacientes',
  'Prontuários, consultas e evolução clínica por voz',
  'Receita em PDF e envio pelo WhatsApp',
  'Consulta por sintomas, interpretação de exames e alertas por espécie',
  'Bônus: Guia de Urgências e Checklist de Anamnese em PDF',
];

/** Mantido para os avisos internos de recursos. */
export const PREMIUM_FEATURES = APP_FEATURES;

/** Prévia da página de vendas (aba fixada no claude.ai): a página definida com window.__VCP_LANDING__. */
export const isLandingPreview = () => Boolean((window as any).__VCP_LANDING__);

/** Build com acesso livre (VITE_FREE_ACCESS=true): o app abre direto, sem login nem página de vendas. */
export const FREE_ACCESS: boolean = env.VITE_FREE_ACCESS === 'true';

/** Dentro do claude.ai o app é a versão de testes do dono: tudo liberado. */
export const isOwnerPreview = () => FREE_ACCESS || Boolean((window as any).claude);

/** Assistente IA Premium: assinatura mensal vendida à parte (order bump recorrente na Wiapy). */
export const IA_PREMIUM_CHECKOUT_URL: string = env.VITE_IA_PREMIUM_CHECKOUT_URL || '';
export const IA_PREMIUM_PRICE_LABEL = 'R$ 19,90/mês';
/** Perguntas por mês incluídas no Premium. */
export const IA_PREMIUM_LIMIT = 300;
/** Servidor do Premium (projeto vet-calc-pro-ia). Vazio = ainda não ligado: o Premium usa a IA gratuita. */
export const IA_PREMIUM_ENDPOINT: string = env.VITE_IA_PREMIUM_ENDPOINT || '';
