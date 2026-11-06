// Assistente IA Premium do VET CALC PRO (função da Netlify, em /api/ia-premium).
// 1. Confere o login do cliente no Firebase do app (vet-calc-pro).
// 2. Confere se a assinatura está paga: acessos/{e-mail}.iaPremiumAte, lido com o próprio login do cliente.
// 3. Conta as perguntas do mês (limite mensal) no Netlify Blobs.
// 4. Chama a API da OpenAI com a chave OPENAI_API_KEY, que fica só na Netlify.
// As ferramentas (biblioteca, calculadora, prontuários) continuam rodando no aparelho do cliente.
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { getStore } from '@netlify/blobs';
import { lerAssinante, maiorData } from '../lib/premium-store.mts';

const APP_PROJECT = 'vet-calc-pro';
const LIMIT = 300;
const MODELS = ['gpt-6-luna', 'gpt-5.4-nano'];
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

type Msg =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text?: string; toolCalls?: { id: string; name: string; args: Record<string, unknown> }[] }
  | { role: 'tool'; id: string; name: string; result: unknown };

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const hojeSP = () => new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);

function toOpenAI(system: string | undefined, history: Msg[]) {
  const out: any[] = system ? [{ role: 'system', content: system }] : [];
  for (const m of history) {
    if (m.role === 'user') out.push({ role: 'user', content: String(m.text || '') });
    else if (m.role === 'assistant') {
      out.push({
        role: 'assistant',
        content: m.text || null,
        ...(m.toolCalls?.length ? { tool_calls: m.toolCalls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: JSON.stringify(c.args || {}) } })) } : {}),
      });
    } else out.push({ role: 'tool', tool_call_id: m.id, content: typeof m.result === 'string' ? m.result : JSON.stringify(m.result ?? null) });
  }
  return out;
}

/** Lê acessos/{e-mail} no Firestore do app com o login do próprio cliente (as regras só deixam ele ler o dele). */
async function premiumAte(email: string, idToken: string): Promise<string | null> {
  const url = `https://firestore.googleapis.com/v1/projects/${APP_PROJECT}/databases/(default)/documents/acessos/${encodeURIComponent(email)}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
  if (!r.ok) return null;
  const doc: any = await r.json();
  return doc?.fields?.iaPremiumAte?.stringValue || null;
}

export default async (req: Request) => {
  if (req.method !== 'POST' && req.method !== 'GET') return json(405, { code: 'method' });
  const key = process.env.OPENAI_API_KEY;
  if (!key && req.method === 'POST') return json(503, { code: 'unconfigured' });

  const idToken = String(req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  let claims: any;
  try {
    ({ payload: claims } = await jwtVerify(idToken, JWKS, { issuer: `https://securetoken.google.com/${APP_PROJECT}`, audience: APP_PROJECT }));
  } catch {
    return json(401, { code: 'login' });
  }
  const email = String(claims.email || '').trim().toLowerCase();
  const uid = String(claims.sub || '');
  if (!email || !uid || claims.email_verified !== true) return json(401, { code: 'login' });

  // Premium liberado à mão no Firebase ou sozinho pelo webhook da Wiapy: vale a data mais distante
  const [ateFirebase, assinante] = await Promise.all([premiumAte(email, idToken), lerAssinante(email)]);
  const ate = maiorData(ateFirebase, assinante?.ate);
  if (req.method === 'GET') return json(200, { iaPremiumAte: ate, appLiberado: Boolean(assinante?.appLiberado) });
  if (!ate || ate < hojeSP()) return json(403, { code: 'not_premium' });

  const raw = await req.text();
  if (raw.length > 300_000) return json(400, { code: 'bad_request' });
  let body: { system?: string; history?: Msg[]; tools?: any[] };
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { code: 'bad_request' });
  }
  const history = Array.isArray(body.history) ? body.history.slice(-40) : [];
  if (!history.length) return json(400, { code: 'bad_request' });

  // Conta 1 pergunta quando a última mensagem é do cliente (as voltas das ferramentas não contam)
  const store = getStore('ia-premium-uso');
  const mes = hojeSP().slice(0, 7);
  const usoKey = `${mes}/${uid}`;
  const uso = ((await store.get(usoKey, { type: 'json' })) as { perguntas?: number } | null) || {};
  let perguntas = Number(uso.perguntas) || 0;
  if (history[history.length - 1].role === 'user') {
    if (perguntas >= LIMIT) return json(429, { code: 'limit', perguntas: LIMIT, limite: LIMIT });
    perguntas += 1;
    await store.setJSON(usoKey, { perguntas, email, atualizadoEm: new Date().toISOString() });
  }

  const tools = (body.tools || []).map((t: any) => ({
    type: 'function',
    function: { name: t.name, description: t.description, parameters: t.inputSchema || { type: 'object', properties: {} } },
  }));
  let lastErr = '';
  for (const model of MODELS) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: toOpenAI(body.system, history),
        ...(tools.length ? { tools } : {}),
        reasoning_effort: 'none',
        max_completion_tokens: 2000,
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      lastErr = `${model}: ${r.status} ${data?.error?.message || ''}`;
      console.warn('OpenAI falhou', lastErr);
      if (r.status === 429 && /quota|billing|credit/i.test(lastErr)) return json(503, { code: 'no_credit' });
      continue;
    }
    const msg = data.choices?.[0]?.message || {};
    return json(200, {
      text: msg.content || '',
      toolCalls: (msg.tool_calls || []).map((c: any) => {
        let args = {};
        try {
          args = JSON.parse(c.function?.arguments || '{}');
        } catch {}
        return { id: c.id, name: c.function?.name, args };
      }),
      provider: 'chatgpt',
      perguntas,
      limite: LIMIT,
    });
  }
  console.error('Premium sem resposta', lastErr);
  return json(502, { code: 'upstream' });
};

export const config = { path: '/api/ia-premium' };
