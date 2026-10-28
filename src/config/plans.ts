// Oferta: compra única, acesso permanente a todo o app.
import { CalculatorType } from '../types';

export const PREMIUM_CALCULATORS: CalculatorType[] = ['emergency', 'cri', 'transfusion', 'bsa'];

const env = (import.meta as any).env || {};

/** Links de compra (compra única). Configure no Netlify. */
export const KIWIFY_URL: string = env.VITE_KIWIFY_CHECKOUT_URL || env.VITE_CHECKOUT_URL || '';
export const HOTMART_URL: string = env.VITE_HOTMART_CHECKOUT_URL || '';
/** Preço exibido na página de vendas, ex.: "R$ 97,00". */
export const PRICE_LABEL: string = env.VITE_PRICE_LABEL || '';
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

/** Dentro do claude.ai o app é a versão de testes do dono: tudo liberado. */
export const isOwnerPreview = () => Boolean((window as any).claude);

const SUB_KEY = 'vet_calc_pro_sub';

/** Token do Premium enviado à IA do servidor. */
export function premiumHeaders(): Record<string, string> {
  try {
    const token = JSON.parse(localStorage.getItem(SUB_KEY) || '{}').token;
    return token ? { 'x-vcp-token': token } : {};
  } catch {
    return {};
  }
}
