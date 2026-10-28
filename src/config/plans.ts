// O que é grátis e o que é Premium. Ajuste aqui para mudar a oferta.
import { CalculatorType } from '../types';

export const PREMIUM_CALCULATORS: CalculatorType[] = ['emergency', 'cri', 'transfusion', 'bsa'];

/** Link da página de compra (Hotmart, Kiwify...). Configure VITE_CHECKOUT_URL no Netlify. */
export const CHECKOUT_URL: string = (import.meta as any).env?.VITE_CHECKOUT_URL || '';
/** Texto do preço exibido no app, ex.: "R$ 19,90/mês". Configure VITE_PRICE_LABEL no Netlify. */
export const PRICE_LABEL: string = (import.meta as any).env?.VITE_PRICE_LABEL || '';

export const FREE_FEATURES = [
  'Calculadora de medicamentos com memória de cálculo',
  'Fluidoterapia, diluição, gotejamento, déficit hídrico e regra de três',
  'Biblioteca com 541 apresentações comerciais',
  'Consulta por sintomas e interpretação de exames',
  'Alertas de segurança por espécie',
];

export const PREMIUM_FEATURES = [
  'Assistente IA: doses, dúvidas clínicas e fichas dos pacientes',
  'Prontuários, consultas e evolução clínica por voz',
  'Receita em PDF e envio pelo WhatsApp',
  'Tabela de emergência por peso (PCR, convulsão, reversores)',
  'Infusão contínua, transfusão e superfície corporal',
  'Bônus: Guia de Urgências e Checklist de Anamnese em PDF',
];

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
