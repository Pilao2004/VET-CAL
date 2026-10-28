// Compras recebidas da Kiwify e da Hotmart. No Netlify ficam no Netlify Blobs (gratuito);
// rodando localmente, ficam na memória. Compra única: acesso permanente até reembolso/chargeback.
import crypto from 'crypto';
import { getStore } from '@netlify/blobs';
import { normalizeEmail } from './license';

export type Platform = 'kiwify' | 'hotmart';

export interface PurchaseRecord {
  email: string;
  status: 'active' | 'revoked';
  platform: Platform;
  orders: string[];
  updatedAt: string;
  lastEvent: string;
}

export interface WebhookLogEntry {
  at: string;
  platform: Platform;
  event: string;
  email: string;
  order: string;
  result: string;
}

// ---------- armazenamento ----------

const memory = new Map<string, unknown>();

function store() {
  // Sem o ambiente do Netlify (ex.: rodando no computador), getStore falha e usamos a memória
  try {
    return getStore('vetcalc-purchases');
  } catch {
    return null;
  }
}

async function readJson<T>(key: string): Promise<T | null> {
  const s = store();
  if (!s) return (memory.get(key) as T) ?? null;
  return ((await s.get(key, { type: 'json' })) as T) ?? null;
}

async function writeJson(key: string, value: unknown) {
  const s = store();
  if (!s) memory.set(key, value);
  else await s.setJSON(key, value);
}

const purchaseKey = (email: string) => `purchase/${crypto.createHash('sha256').update(normalizeEmail(email)).digest('hex')}`;

export const getPurchase = (email: string) => readJson<PurchaseRecord>(purchaseKey(email));

async function appendLog(entry: WebhookLogEntry) {
  const log = (await readJson<WebhookLogEntry[]>('log')) || [];
  await writeJson('log', [entry, ...log].slice(0, 100));
}

export const getWebhookLog = async () => (await readJson<WebhookLogEntry[]>('log')) || [];

// ---------- interpretação dos avisos ----------

export interface ParsedEvent {
  email: string;
  order: string;
  event: string;
  action: 'grant' | 'revoke' | 'ignore';
}

const pick = (obj: any, paths: string[]): string => {
  for (const path of paths) {
    const value = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return '';
};

const GRANT = /order_approved|^paid$|approved|purchase_complete|complete/i;
const REVOKE = /refund|chargeback|charged_back|purchase_canceled|cancel/i;

export function parseKiwify(body: any): ParsedEvent {
  const event = pick(body, ['webhook_event_type', 'order_status', 'event']);
  const status = pick(body, ['order_status', 'status']);
  const email = normalizeEmail(pick(body, ['Customer.email', 'customer.email', 'Customer.Email', 'buyer.email', 'email']));
  const order = pick(body, ['order_id', 'order_ref', 'Order.id', 'id']);
  const text = `${event} ${status}`;
  return { email, order, event: event || status, action: REVOKE.test(text) ? 'revoke' : GRANT.test(text) ? 'grant' : 'ignore' };
}

export function parseHotmart(body: any): ParsedEvent {
  const event = pick(body, ['event', 'status']);
  const status = pick(body, ['data.purchase.status', 'status']);
  const email = normalizeEmail(pick(body, ['data.buyer.email', 'buyer.email', 'email']));
  const order = pick(body, ['data.purchase.transaction', 'transaction', 'data.purchase.order_id']);
  const text = `${event} ${status}`;
  return { email, order, event: event || status, action: REVOKE.test(text) ? 'revoke' : GRANT.test(text) ? 'grant' : 'ignore' };
}

/** Aplica um aviso de venda ao registro do comprador. */
export async function applyPurchaseEvent(platform: Platform, parsed: ParsedEvent): Promise<string> {
  let result: string;
  if (!parsed.email.includes('@')) {
    result = 'sem e-mail do comprador';
  } else if (parsed.action === 'ignore') {
    result = 'evento ignorado';
  } else {
    const current = await getPurchase(parsed.email);
    const orders = Array.from(new Set([...(current?.orders || []), ...(parsed.order ? [parsed.order] : [])]));
    const record: PurchaseRecord = {
      email: parsed.email,
      platform,
      orders,
      status: parsed.action === 'grant' ? 'active' : 'revoked',
      updatedAt: new Date().toISOString(),
      lastEvent: parsed.event,
    };
    await writeJson(purchaseKey(parsed.email), record);
    result = parsed.action === 'grant' ? 'acesso liberado' : 'acesso bloqueado';
  }
  await appendLog({ at: new Date().toISOString(), platform, event: parsed.event, email: parsed.email, order: parsed.order, result });
  return result;
}

// ---------- autenticação dos avisos ----------

const safeEqual = (a: string, b: string) => {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

/** Kiwify: assinatura HMAC-SHA1 do corpo com o token do webhook, no parâmetro ?signature= */
export function kiwifyAuthorized(rawBody: Buffer | undefined, signature: unknown) {
  const token = process.env.KIWIFY_TOKEN || '';
  if (!token || !rawBody || typeof signature !== 'string') return false;
  const expected = crypto.createHmac('sha1', token).update(rawBody).digest('hex');
  return safeEqual(expected, signature.toLowerCase());
}

/** Hotmart: o "hottok" da conta chega no cabeçalho X-HOTMART-HOTTOK (ou no corpo, na versão 1). */
export function hotmartAuthorized(headerToken: unknown, body: any) {
  const hottok = process.env.HOTMART_HOTTOK || '';
  const received = String(headerToken || body?.hottok || '');
  return Boolean(hottok) && safeEqual(hottok, received);
}
