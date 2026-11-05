// Assistente IA Premium do VET CALC PRO: roda no projeto separado "vet-calc-pro-ia" (plano pago).
// 1. Confere o login do cliente no projeto do app (vet-calc-pro).
// 2. Confere se a assinatura está paga: acessos/{e-mail}.iaPremiumAte, lido com o próprio login do cliente.
// 3. Conta as perguntas do mês (limite mensal) e chama o Gemini com a chave guardada no Secret Manager.
// As ferramentas (biblioteca, calculadora, prontuários) continuam rodando no aparelho do cliente.
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const APP_PROJECT = 'vet-calc-pro';
const LIMIT = 300;
const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
const ORIGINS = ['https://vetcalculatorpro.netlify.app', 'https://vet-calc-pro.web.app', 'https://vet-calc-pro.firebaseapp.com', 'http://localhost:5173'];

initializeApp(); // projeto do Premium: contador de uso
const appAuth = getAuth(initializeApp({ projectId: APP_PROJECT }, 'app')); // valida o login do app
const db = getFirestore();

type Msg =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text?: string; toolCalls?: { id: string; name: string; args: Record<string, unknown> }[] }
  | { role: 'tool'; id: string; name: string; result: unknown };

function toContents(history: Msg[]) {
  const contents: { role: 'user' | 'model'; parts: any[] }[] = [];
  for (const m of history) {
    if (m.role === 'user') contents.push({ role: 'user', parts: [{ text: String(m.text || '') }] });
    else if (m.role === 'assistant') {
      const parts: any[] = [];
      if (m.text) parts.push({ text: m.text });
      for (const c of m.toolCalls || []) parts.push({ functionCall: { name: c.name, args: c.args } });
      if (parts.length) contents.push({ role: 'model', parts });
    } else {
      const part = { functionResponse: { name: m.name, response: { result: m.result } } };
      const last = contents[contents.length - 1];
      if (last && last.role === 'user' && last.parts.every((p) => p.functionResponse)) last.parts.push(part);
      else contents.push({ role: 'user', parts: [part] });
    }
  }
  return contents;
}

const hojeSP = () => new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);

/** Lê acessos/{e-mail} no Firestore do app com o login do próprio cliente (as regras só deixam ele ler o dele). */
async function premiumAte(email: string, idToken: string): Promise<string | null> {
  const url = `https://firestore.googleapis.com/v1/projects/${APP_PROJECT}/databases/(default)/documents/acessos/${encodeURIComponent(email)}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
  if (!r.ok) return null;
  const doc: any = await r.json();
  return doc?.fields?.iaPremiumAte?.stringValue || null;
}

export const premiumRound = onRequest(
  { region: 'southamerica-east1', secrets: [GEMINI_API_KEY], cors: ORIGINS, maxInstances: 5, timeoutSeconds: 120, memory: '256MiB' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ code: 'method' });
      return;
    }
    const idToken = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    let user;
    try {
      user = await appAuth.verifyIdToken(idToken);
    } catch {
      res.status(401).json({ code: 'login' });
      return;
    }
    const email = String(user.email || '').trim().toLowerCase();
    if (!email || !user.email_verified) {
      res.status(401).json({ code: 'login' });
      return;
    }
    const ate = await premiumAte(email, idToken);
    if (!ate || ate < hojeSP()) {
      res.status(403).json({ code: 'not_premium' });
      return;
    }

    const { system, history, tools } = (req.body || {}) as { system?: string; history?: Msg[]; tools?: any[] };
    if (!Array.isArray(history) || !history.length || JSON.stringify(req.body).length > 300_000) {
      res.status(400).json({ code: 'bad_request' });
      return;
    }

    // Conta 1 pergunta quando a última mensagem é do cliente (as voltas das ferramentas não contam)
    const mes = hojeSP().slice(0, 7);
    const ref = db.doc(`uso/${user.uid}_${mes}`);
    let perguntas = 0;
    try {
      perguntas = await db.runTransaction(async (t) => {
        const cur = Number((await t.get(ref)).get('perguntas')) || 0;
        if (history[history.length - 1].role !== 'user') return cur;
        if (cur >= LIMIT) throw Object.assign(new Error('limit'), { code: 'limit' });
        t.set(ref, { perguntas: FieldValue.increment(1), email, mes, atualizadoEm: FieldValue.serverTimestamp() }, { merge: true });
        return cur + 1;
      });
    } catch (e: any) {
      if (e?.code === 'limit') {
        res.status(429).json({ code: 'limit', perguntas: LIMIT, limite: LIMIT });
        return;
      }
      throw e;
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY.value() });
    const declarations = (tools || []).map((t: any) => ({ name: t.name, description: t.description, ...(t.inputSchema ? { parameters: t.inputSchema } : {}) }));
    let lastErr: unknown = null;
    for (const model of MODELS) {
      try {
        const r = await ai.models.generateContent({
          model,
          contents: toContents(history.slice(-40)),
          config: {
            ...(system ? { systemInstruction: system } : {}),
            ...(declarations.length ? { tools: [{ functionDeclarations: declarations }] } : {}),
            temperature: 0.4,
          },
        });
        const calls = r.functionCalls || [];
        res.json({
          text: r.text || '',
          toolCalls: calls.map((c, i) => ({ id: `call_${Date.now().toString(36)}_${i}`, name: c.name, args: c.args || {} })),
          provider: 'gemini',
          perguntas,
          limite: LIMIT,
        });
        return;
      } catch (e) {
        lastErr = e;
        console.warn(`Gemini ${model} falhou:`, (e as any)?.message || e);
      }
    }
    console.error('Premium sem resposta', lastErr);
    res.status(502).json({ code: 'upstream' });
  },
);
