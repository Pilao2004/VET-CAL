// Assistente IA pelo Firebase AI Logic (Gemini Developer API, plano gratuito).
// Substitui a IA do servidor: as ferramentas continuam rodando no navegador.
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { firebaseApp } from '../lib/firebase';

const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });

/** Modelos tentados em ordem; o primeiro que responder é usado. */
const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-flash-lite-latest'];

export interface AgentToolSchema {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
}

export type AgentMessage =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text?: string; toolCalls?: AgentToolCall[] }
  | { role: 'tool'; id: string; name: string; result: unknown };

export interface AgentToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export type FirebaseAIErrorCode = 'quota' | 'upstream';

const isQuotaError = (err: any) => /429|RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(String(err?.message || err));
const aiError = (code: FirebaseAIErrorCode, cause: unknown) => Object.assign(new Error(code), { code, cause });

let callSeq = 0;
const newCallId = () => `call_${Date.now().toString(36)}_${(callSeq++).toString(36)}`;

function toContents(history: AgentMessage[]) {
  const contents: { role: 'user' | 'model'; parts: any[] }[] = [];
  for (const m of history) {
    if (m.role === 'user') {
      contents.push({ role: 'user', parts: [{ text: m.text }] });
    } else if (m.role === 'assistant') {
      const parts: any[] = [];
      if (m.text) parts.push({ text: m.text });
      for (const c of m.toolCalls || []) parts.push({ functionCall: { name: c.name, args: c.args } });
      if (parts.length) contents.push({ role: 'model', parts });
    } else {
      const part = { functionResponse: { name: m.name, response: { result: m.result } } };
      const last = contents[contents.length - 1];
      // Respostas de várias ferramentas da mesma rodada vão juntas num único turno
      if (last && last.role === 'user' && last.parts.every((p) => p.functionResponse)) last.parts.push(part);
      else contents.push({ role: 'user', parts: [part] });
    }
  }
  return contents;
}

/** Tenta cada modelo até um responder; devolve a resposta bruta do primeiro que funcionar. */
async function generate(params: { system?: string; tools?: any[]; temperature: number }, contents: any[]) {
  let lastErr: unknown = null;
  for (const model of MODELS) {
    try {
      const m = getGenerativeModel(ai, {
        model,
        ...(params.system ? { systemInstruction: params.system } : {}),
        ...(params.tools?.length ? { tools: params.tools } : {}),
        generationConfig: { temperature: params.temperature },
      });
      const result = await m.generateContent({ contents });
      return result.response;
    } catch (err) {
      lastErr = err;
      if (!isQuotaError(err)) console.warn(`Firebase AI ${model} falhou:`, (err as any)?.message || err);
    }
  }
  throw aiError(isQuotaError(lastErr) ? 'quota' : 'upstream', lastErr);
}

/** Uma rodada da Assistente conversacional, com as ferramentas declaradas. */
export async function agentRound(system: string, history: AgentMessage[], tools: AgentToolSchema[]) {
  const declarations = tools.map((t) => ({ name: t.name, description: t.description, ...(t.inputSchema ? { parameters: t.inputSchema as any } : {}) }));
  const response = await generate({ system, tools: declarations.length ? [{ functionDeclarations: declarations }] : [], temperature: 0.4 }, toContents(history.slice(-40)));
  const calls = response.functionCalls() || [];
  if (calls.length) {
    const parts: any[] = response.candidates?.[0]?.content?.parts || [];
    const text = parts.map((p) => p.text || '').join('').trim();
    return {
      provider: 'gemini',
      text: text || undefined,
      toolCalls: calls.map((c: any) => ({ id: c.id || newCallId(), name: c.name, args: (c.args as Record<string, unknown>) || {} })),
    };
  }
  return { provider: 'gemini', text: response.text() || '' };
}

/** Texto livre com pesquisa no Google (usado pelo chat clínico e pela busca de medicamentos fora da base). */
export async function generateGrounded(system: string | undefined, prompt: string, temperature: number): Promise<string> {
  const contents = [{ role: 'user', parts: [{ text: prompt }] }];
  try {
    return (await generate({ system, tools: [{ googleSearch: {} }], temperature }, contents)).text() || '';
  } catch {
    // Sem a pesquisa no Google, responde só com o conhecimento do modelo
    return (await generate({ system, temperature }, contents)).text() || '';
  }
}
