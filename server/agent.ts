// Uma rodada da Assistente IA no servidor: tenta o Gemini (plano gratuito) e, se a cota acabar,
// o Groq (plano gratuito). As ferramentas rodam no navegador; aqui só repassamos as chamadas.
import { GoogleGenAI } from '@google/genai';

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

export interface AgentReply {
  text?: string;
  toolCalls?: AgentToolCall[];
  provider: 'gemini' | 'groq';
}

export class AgentError extends Error {
  constructor(public code: 'quota' | 'unconfigured' | 'upstream', message: string) {
    super(message);
  }
}

const isQuotaError = (err: any) =>
  err?.status === 429 || /429|RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(String(err?.message || err));

let callSeq = 0;
const newCallId = () => `call_${Date.now().toString(36)}_${(callSeq++).toString(36)}`;

// ---------- Gemini ----------

function toGeminiContents(history: AgentMessage[]) {
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

async function askGemini(system: string, history: AgentMessage[], tools: AgentToolSchema[]): Promise<AgentReply> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AgentError('unconfigured', 'GEMINI_API_KEY não configurada.');
  const client = new GoogleGenAI({ apiKey });
  const models = (process.env.GEMINI_MODELS || 'gemini-flash-latest,gemini-flash-lite-latest').split(',').map((s) => s.trim());
  let lastErr: any = null;
  for (const model of models) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: toGeminiContents(history),
        config: {
          systemInstruction: system,
          temperature: 0.4,
          ...(tools.length
            ? { tools: [{ functionDeclarations: tools.map((t) => ({ name: t.name, description: t.description, ...(t.inputSchema ? { parameters: t.inputSchema } : {}) })) }] }
            : {}),
        },
      });
      const calls = response.functionCalls || [];
      if (calls.length) {
        const parts: any[] = response.candidates?.[0]?.content?.parts || [];
        const text = parts.map((p) => p.text || '').join('').trim();
        return {
          provider: 'gemini',
          text: text || undefined,
          toolCalls: calls.map((c: any) => ({ id: c.id || newCallId(), name: c.name, args: c.args || {} })),
        };
      }
      return { provider: 'gemini', text: response.text || '' };
    } catch (err) {
      lastErr = err;
      if (!isQuotaError(err)) console.warn(`Gemini ${model} falhou:`, (err as any)?.message || err);
    }
  }
  throw new AgentError(isQuotaError(lastErr) ? 'quota' : 'upstream', String(lastErr?.message || lastErr));
}

// ---------- Groq (API compatível com OpenAI) ----------

function toOpenAIMessages(system: string, history: AgentMessage[]) {
  const msgs: any[] = [{ role: 'system', content: system }];
  for (const m of history) {
    if (m.role === 'user') msgs.push({ role: 'user', content: m.text });
    else if (m.role === 'assistant') {
      msgs.push({
        role: 'assistant',
        content: m.text || null,
        ...(m.toolCalls?.length
          ? { tool_calls: m.toolCalls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: JSON.stringify(c.args) } })) }
          : {}),
      });
    } else msgs.push({ role: 'tool', tool_call_id: m.id, content: JSON.stringify(m.result) });
  }
  return msgs;
}

async function askGroq(system: string, history: AgentMessage[], tools: AgentToolSchema[]): Promise<AgentReply> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new AgentError('unconfigured', 'GROQ_API_KEY não configurada.');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.4,
      messages: toOpenAIMessages(system, history),
      ...(tools.length
        ? {
            tools: tools.map((t) => ({
              type: 'function',
              function: { name: t.name, description: t.description, parameters: t.inputSchema || { type: 'object', properties: {} } },
            })),
          }
        : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new AgentError(res.status === 429 ? 'quota' : 'upstream', `Groq ${res.status}: ${body.slice(0, 300)}`);
  }
  const data: any = await res.json();
  const msg = data?.choices?.[0]?.message || {};
  const calls = (msg.tool_calls || []).map((c: any) => {
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(c.function?.arguments || '{}');
    } catch {}
    return { id: c.id || newCallId(), name: c.function?.name, args };
  });
  return calls.length ? { provider: 'groq', text: msg.content || undefined, toolCalls: calls } : { provider: 'groq', text: msg.content || '' };
}

export type AgentProvider = 'auto' | 'gemini' | 'groq';

/** Uma rodada. 'auto': Gemini primeiro e Groq quando o Gemini estiver sem cota, sem chave ou fora do ar. */
export async function runAgentRound(
  system: string,
  history: AgentMessage[],
  tools: AgentToolSchema[],
  provider: AgentProvider = 'auto',
): Promise<AgentReply> {
  const asAgentError = (err: unknown) => (err instanceof AgentError ? err : new AgentError('upstream', String(err)));
  if (provider === 'gemini' || provider === 'groq') {
    try {
      return await (provider === 'gemini' ? askGemini : askGroq)(system, history, tools);
    } catch (err) {
      throw asAgentError(err);
    }
  }
  let geminiErr: AgentError | null = null;
  try {
    return await askGemini(system, history, tools);
  } catch (err) {
    geminiErr = err instanceof AgentError ? err : new AgentError('upstream', String(err));
  }
  try {
    return await askGroq(system, history, tools);
  } catch (err) {
    const groqErr = err instanceof AgentError ? err : new AgentError('upstream', String(err));
    // Sem nenhuma IA configurada, ou as duas sem cota: devolve o motivo mais útil para a tela
    if (geminiErr.code === 'unconfigured' && groqErr.code === 'unconfigured') throw geminiErr;
    if ([geminiErr.code, groqErr.code].every((c) => c === 'quota' || c === 'unconfigured')) {
      throw new AgentError('quota', 'Cota gratuita esgotada.');
    }
    throw new AgentError('upstream', `${geminiErr.message} | ${groqErr.message}`);
  }
}
