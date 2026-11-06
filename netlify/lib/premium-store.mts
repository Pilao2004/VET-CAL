// Assinantes do Assistente IA Premium liberados automaticamente pelo webhook da Wiapy (Netlify Blobs).
import { getStore } from '@netlify/blobs';

export interface Assinante {
  ate: string | null; // AAAA-MM-DD: fim do Assistente IA Premium
  /** Comprou o app VET CALC PRO (liberado pelo webhook da Wiapy) */
  appLiberado?: boolean;
  origem: string;
  status: string;
  atualizadoEm: string;
  pagamentos: string[];
}

export const assinantes = () => getStore('ia-premium-assinantes');
export const hojeSP = () => new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
export const maiorData = (...d: (string | null | undefined)[]) => d.filter(Boolean).sort().pop() || null;

export async function lerAssinante(email: string): Promise<Assinante | null> {
  return ((await assinantes().get(email, { type: 'json' })) as Assinante | null) || null;
}
