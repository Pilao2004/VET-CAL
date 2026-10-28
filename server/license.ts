// Licenças Premium sem banco de dados: cada código é uma assinatura HMAC do e-mail do comprador e
// da validade, feita com LICENSE_SECRET (variável de ambiente do Netlify, nunca no código).
// Formato do código: VCP-AAAAMMDD-XXXXXXXXXXXX
import crypto from 'crypto';

const KEY_PATTERN = /^VCP-(\d{8})-([0-9A-F]{12})$/;

const secret = () => process.env.LICENSE_SECRET || '';
export const licensingConfigured = () => secret().length >= 16;

export const normalizeEmail = (email: unknown) => String(email || '').trim().toLowerCase();

const hmac = (data: string) => crypto.createHmac('sha256', secret()).update(data).digest('hex');

const todayStamp = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');

export const stampToIso = (stamp: string) => `${stamp.slice(0, 4)}-${stamp.slice(4, 6)}-${stamp.slice(6, 8)}`;

/** AAAAMMDD daqui a `days` dias. */
export function expiryFromDays(days: number) {
  const d = new Date(Date.now() + days * 86400000);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

export function signLicense(email: string, expiry: string) {
  const sig = hmac(`license|${normalizeEmail(email)}|${expiry}`).slice(0, 12).toUpperCase();
  return `VCP-${expiry}-${sig}`;
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/** Códigos promocionais opcionais: PROMO_KEYS="LANCAMENTO:20261231,ESTUDANTE:20270630". */
function promoExpiry(code: string): string | null {
  for (const entry of (process.env.PROMO_KEYS || '').split(',')) {
    const [name, expiry] = entry.split(':').map((s) => s.trim());
    if (name && /^\d{8}$/.test(expiry || '') && name.toUpperCase() === code) return expiry;
  }
  return null;
}

export type LicenseCheck = { ok: true; expiry: string } | { ok: false; reason: 'invalid' | 'expired' | 'unconfigured' };

export function verifyLicense(email: string, rawKey: string): LicenseCheck {
  const key = String(rawKey || '').trim().toUpperCase();
  const promo = promoExpiry(key);
  const match = key.match(KEY_PATTERN);
  if (!promo && !match) return { ok: false, reason: 'invalid' };
  if (promo) return promo < todayStamp() ? { ok: false, reason: 'expired' } : { ok: true, expiry: promo };
  if (!licensingConfigured()) return { ok: false, reason: 'unconfigured' };
  const expiry = match![1];
  if (!safeEqual(signLicense(email, expiry), key)) return { ok: false, reason: 'invalid' };
  if (expiry < todayStamp()) return { ok: false, reason: 'expired' };
  return { ok: true, expiry };
}

export type TokenSource = 'buy' | 'lic';
export interface TokenData {
  email: string;
  expiry: string;
  source: TokenSource;
  licenseExpiry: string;
}

const TOKEN_DAYS = 7;
const REFRESH_GRACE_DAYS = 120;

/** Token guardado no aparelho e enviado ao servidor para provar o acesso. Vale 7 dias e é renovado sempre que o app abre com internet. */
export function issueToken(email: string, licenseExpiry: string, source: TokenSource) {
  const shortExpiry = expiryFromDays(TOKEN_DAYS);
  const payloadObj = { e: normalizeEmail(email), x: shortExpiry < licenseExpiry ? shortExpiry : licenseExpiry, s: source, l: licenseExpiry };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  return { token: `${payload}.${hmac(`token|${payload}`).slice(0, 32)}`, tokenExpiry: payloadObj.x };
}

function readToken(token: unknown): TokenData | null {
  if (!licensingConfigured() || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!safeEqual(hmac(`token|${payload}`).slice(0, 32), sig || '')) return null;
  try {
    const { e, x, s, l } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof x !== 'string') return null;
    return { email: String(e), expiry: x, source: s === 'buy' ? 'buy' : 'lic', licenseExpiry: typeof l === 'string' ? l : x };
  } catch {
    return null;
  }
}

/** Token válido e dentro da validade (exigido pelas rotas de IA). */
export function verifyToken(token: unknown): TokenData | null {
  const data = readToken(token);
  return data && data.expiry >= todayStamp() ? data : null;
}

/** Token autêntico, mesmo vencido há até 120 dias (para renovar quem ficou um tempo offline). */
export function verifyTokenForRefresh(token: unknown): TokenData | null {
  const data = readToken(token);
  return data && data.expiry >= expiryFromDays(-REFRESH_GRACE_DAYS) ? data : null;
}

export const LIFETIME_EXPIRY = '20991231';
export { todayStamp };
