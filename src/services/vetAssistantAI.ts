// Assistente conversacional: usa o Claude do visualizador (capability `sample`) quando o app
// roda como artifact no claude.ai. As doses saem sempre do motor de cálculo do app, via ferramentas.
import { COMMERCIAL_PRODUCTS, CommercialProduct } from '../data/commercialProducts';
import { calculateDeterministicDosage, calculateTabletDosage, calculateDropsDosage } from '../utils/calculatorEngine';
import { PatientRecord } from '../types';
import { speciesSafetyAlerts } from '../utils/safetyRules';
import { premiumHeaders } from '../config/plans';

export interface AITurn {
  role: 'user' | 'assistant';
  content: string;
}

type SampleFn = (input: AITurn[], options: Record<string, unknown>) => Promise<{ text: string; truncated: boolean }>;

let samplePromise: Promise<SampleFn | null> | null = null;

/** Resolve o Claude do visualizador, ou null fora do claude.ai (ex.: site no Netlify). */
export function getClaudeSample(): Promise<SampleFn | null> {
  if (!samplePromise) {
    const claude = (window as any).claude;
    samplePromise = claude?.use
      ? Promise.resolve(claude.use('sample')).catch(() => null)
      : Promise.resolve(null);
  }
  return samplePromise;
}

const normalize = (s: string) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const speciesKey = (species: string) => normalize(species).replace(/\s+/g, '');

const FREQ_PER_DAY: Record<string, number> = { SID: 1, BID: 2, TID: 3, QID: 4, 'Dose Única': 1 };

function productSummary(p: CommercialProduct) {
  return {
    id: p.id,
    marca: p.brandName,
    principio_ativo: p.activePrinciple,
    categoria: p.category,
    forma: p.formType,
    concentracao_mg_ml: p.concentrationMgMl ?? null,
    comprimido_mg: p.tabletMg ?? null,
    gotas_por_ml: p.formType === 'drops' ? p.dropsPerMl || 20 : null,
    apresentacao: p.presentationText ?? null,
    especies: p.species,
    dose_padrao_mg_kg: p.defaultDoseMgKg,
    faixa_de_dose: p.doseRangeText,
    via: p.defaultRoute,
    frequencia: p.defaultFrequency,
    protocolos: (p.protocols || []).map((pr) => ({ id: pr.id, nome: pr.label, dose_mg_kg: pr.doseMgKg, regra_bula: pr.bulaRuleText })),
    observacoes: p.clinicalNotes ? p.clinicalNotes.slice(0, 240) : undefined,
  };
}

function searchProducts(term: string, species?: string) {
  const words = normalize(term).split(/[^a-z0-9]+/).filter((w) => w.length > 2);
  if (words.length === 0) return [];
  const sp = species ? normalize(species) : '';
  return COMMERCIAL_PRODUCTS.map((p) => {
    const hay = normalize(`${p.brandName} ${p.activePrinciple} ${p.category} ${p.manufacturer || ''}`);
    let score = words.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
    if (score > 0 && sp && p.species.some((s) => normalize(s) === sp)) score += 0.5;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((x) => productSummary(x.p));
}

function calculateDose(input: Record<string, unknown>) {
  const product = COMMERCIAL_PRODUCTS.find((p) => p.id === String(input.produto_id));
  if (!product) throw new Error('Produto não encontrado. Use buscar_medicamento e passe o id exato.');
  const species = String(input.especie || '').trim();
  const weightKg = Number(input.peso_kg);
  if (!species) throw new Error('Falta a espécie do paciente.');
  if (!(weightKg > 0)) throw new Error('Falta o peso do paciente em kg.');

  const key = speciesKey(species);
  const protocol = product.protocols?.find((pr) => pr.id === String(input.protocolo_id || ''));
  let doseMgKg = Number(input.dose_mg_kg) || protocol?.doseMgKg[key] || product.defaultDoseMgKg[key];
  if (!doseMgKg) {
    throw new Error(`O cadastro de ${product.brandName} não tem dose para ${species}. Peça a dose em mg/kg ao veterinário.`);
  }
  const perDay = Number(input.vezes_ao_dia) || FREQ_PER_DAY[product.defaultFrequency] || 1;
  const days = Number(input.dias) || undefined;
  // Doses do cadastro são por tomada: comprimidos e gotas recebem frequência 1 (o motor divide pela frequência)
  const base = { species, weightKg, doseMgKg, frequencyTimesPerDay: 1, drugName: product.brandName };

  let resultado: string;
  let passos: { label: string; expression: string; result: string }[];
  let alertas: string[];
  if (product.formType === 'tablet' && product.tabletMg) {
    const r = calculateTabletDosage({ ...base, tabletMg: product.tabletMg });
    if (!r.isValid) throw new Error(r.errorMessage || 'Cálculo inválido.');
    resultado = `${r.formattedTabletsStr} por tomada (${r.totalMgPerTake.toFixed(2)} mg)`;
    passos = r.steps;
    alertas = [...r.safetyWarnings, ...(r.fractionWarning ? [r.fractionWarning] : [])];
  } else if (product.formType === 'drops' && product.concentrationMgMl) {
    const r = calculateDropsDosage({ ...base, concentrationMgMl: product.concentrationMgMl, dropsPerMl: product.dropsPerMl || 20 });
    if (!r.isValid) throw new Error(r.errorMessage || 'Cálculo inválido.');
    resultado = `${r.formattedDropsStr} por tomada (${r.totalMgPerTake.toFixed(2)} mg; ${r.volumeMlPerTake.toFixed(2)} mL)`;
    passos = r.steps;
    alertas = r.safetyWarnings;
  } else if (product.concentrationMgMl) {
    const r = calculateDeterministicDosage({ ...base, frequencyTimesPerDay: perDay, treatmentDays: days, doseRegime: 'per-dose', concentrationMgMl: product.concentrationMgMl });
    if (!r.isValid) throw new Error(r.errorMessage || 'Cálculo inválido.');
    resultado = `${r.formattedVolumeStr} por aplicação (${r.totalMgPerTake.toFixed(2)} mg)`;
    passos = r.steps;
    alertas = r.safetyWarnings;
  } else {
    throw new Error(`${product.brandName} não tem concentração cadastrada para cálculo (forma: ${product.formType}).`);
  }

  return {
    produto: product.brandName,
    principio_ativo: product.activePrinciple,
    especie: species,
    peso_kg: weightKg,
    dose_mg_kg: doseMgKg,
    origem_da_dose: Number(input.dose_mg_kg) ? 'informada pelo usuário' : protocol ? `protocolo: ${protocol.label}` : 'dose padrão do cadastro',
    resultado,
    via: product.defaultRoute,
    frequencia: `${product.defaultFrequency} (${perDay}x/dia)`,
    regra_bula: protocol?.bulaRuleText,
    passos: passos.map((s) => `${s.label}: ${s.expression} = ${s.result}`),
    alertas,
    alertas_de_seguranca: speciesSafetyAlerts({ activePrinciple: product.activePrinciple, name: product.brandName, species, doseMgKg, product }).map(
      (a) => `${a.level === 'danger' ? 'PERIGO' : 'Atenção'}: ${a.text}`,
    ),
  };
}

function patientBrief(p: PatientRecord) {
  const last = [...(p.consultations || [])].sort((a, b) => b.date.localeCompare(a.date))[0];
  return {
    nome: p.name,
    codigo: p.publicCode,
    especie: p.species,
    raca: p.breed,
    peso_kg: p.weight,
    ultima_consulta: last ? `${last.date.slice(0, 10)}: ${last.tentativeDiagnosis || last.chiefComplaint}` : 'nenhuma',
  };
}

function findPatient(patients: PatientRecord[], query: string) {
  const q = normalize(query).trim();
  if (!q) return null;
  return (
    patients.find((p) => normalize(p.publicCode || '') === q) ||
    patients.find((p) => normalize(p.name) === q) ||
    patients.find((p) => normalize(p.name).includes(q) || q.includes(normalize(p.name).split(' ')[0])) ||
    null
  );
}

function patientRecord(p: PatientRecord) {
  const consultations = [...(p.consultations || [])].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return {
    ...patientBrief(p),
    sexo: p.sex,
    castrado: p.isNeutered,
    idade: p.age,
    alergias: p.allergies || 'nenhuma registrada',
    consultas_mais_recentes_primeiro: consultations.map((c) => ({
      data: c.date.slice(0, 16).replace('T', ' '),
      peso_kg: c.weight,
      queixa: c.chiefComplaint,
      sintomas: c.reportedSymptoms,
      exame_fisico: c.physicalExam,
      hipotese: c.tentativeDiagnosis,
      exames_solicitados: c.requestedExams,
      prescricao: c.prescriptions,
      evolucao: c.clinicalEvolution,
    })),
    evolucoes_registradas: (p.evolutions || []).slice(-5).map((e) => ({ data: e.createdAt.slice(0, 10), texto: e.evolutionText })),
  };
}

export function buildRules(patients: PatientRecord[]) {
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const hour = new Date().getHours();
  return `Você é a Assistente do VET CALC PRO, um app de apoio à Medicina Veterinária usado por médicos-veterinários, estagiários e estudantes no Brasil. Hoje é ${today}, ${hour}h.

COMO CONVERSAR
- Fale português do Brasil, de forma natural e cordial, como uma colega veterinária experiente conversando no plantão. Responda cumprimentos ("bom dia", "boa noite", "tudo bem?") de forma simpática e breve, usando a saudação certa para o horário.
- Seja prática e direta: responda primeiro o que foi perguntado, depois detalhe só o necessário. Prefira respostas curtas; use listas apenas quando ajudarem.
- Lembre do que já foi dito na conversa (paciente, espécie, peso, medicamento) e use isso nas perguntas seguintes sem pedir de novo.
- Se faltar um dado essencial (espécie, peso, qual apresentação), pergunte de forma objetiva.
- Formatação: texto simples. Pode usar **negrito** e listas com "- ". Não use tabelas nem títulos com #.

DOSES E MEDICAMENTOS
- Para qualquer dose, volume, número de comprimidos ou gotas, NUNCA calcule de cabeça: use buscar_medicamento para achar o produto e calcular_dose para obter o resultado. Informe o produto, a concentração, a dose em mg/kg usada, o resultado, a via e a frequência.
- Se houver várias apresentações (injetável, comprimido, gotas) e o usuário não disse qual usa, pergunte, citando as opções mais prováveis.
- Se o medicamento não estiver na biblioteca, diga isso claramente e dê a faixa de dose de referência da literatura veterinária, avisando que não foi calculado pelo app e deve ser conferido na bula.
- Sempre repasse ao usuário os itens de alertas_de_seguranca retornados por calcular_dose, destacando os de PERIGO no início da resposta.
- Alerte sobre contraindicações e cuidados relevantes para a espécie (ex.: AINEs em gatos, paracetamol em gatos, ivermectina em raças sensíveis ao MDR1).

PACIENTES
- O app tem ${patients.length} paciente(s) cadastrado(s). Quando o usuário citar um paciente pelo nome ou código (ex.: VET-100001), use ficha_paciente e responda com base na ficha: histórico, última consulta, sinais vitais, diagnóstico, prescrição e evolução.
- Para "como ele está?" ou "como está se sentindo?", interprete a evolução e os sinais vitais mais recentes registrados e diga claramente que é o que consta na ficha.
- Use listar_pacientes quando perguntarem quais pacientes existem. Nunca invente dados de paciente.

DÚVIDAS CLÍNICAS
- Para casos e sintomas, organize o raciocínio: conduta imediata, diferenciais principais, exames prioritários e sinais de alerta, de forma enxuta.
- Você apoia o raciocínio, mas a decisão e a prescrição são do médico-veterinário responsável. Lembre isso só quando for relevante, sem repetir em toda resposta.`;
}

export function buildTools(getPatients: () => PatientRecord[], onProgress: (label: string) => void) {
  return [
    {
      name: 'buscar_medicamento',
      description:
        'Busca na biblioteca do app (541 apresentações comerciais) por marca, princípio ativo ou categoria. Retorna até 10 produtos com id, concentração ou mg por comprimido, doses padrão por espécie, protocolos da bula, via e frequência.',
      inputSchema: {
        type: 'object',
        properties: {
          termo: { type: 'string', description: 'Marca ou princípio ativo, ex.: "meloxicam", "Agemoxi", "dipirona gotas"' },
          especie: { type: 'string', description: 'Opcional: Canino, Felino, Equino, Bovino...' },
        },
        required: ['termo'],
      },
      execute: (input: Record<string, unknown>) => {
        onProgress('Consultando a biblioteca de medicamentos…');
        const found = searchProducts(String(input.termo || ''), input.especie ? String(input.especie) : undefined);
        return found.length ? found : 'Nenhum produto encontrado na biblioteca do app para esse termo.';
      },
    },
    {
      name: 'calcular_dose',
      description:
        'Calcula a dose com o motor de cálculo validado do app para um produto da biblioteca. Retorna mg, volume em mL, comprimidos ou gotas por tomada, passo a passo e alertas. Sem dose_mg_kg, usa o protocolo indicado ou a dose padrão do cadastro para a espécie.',
      inputSchema: {
        type: 'object',
        properties: {
          produto_id: { type: 'string', description: 'id retornado por buscar_medicamento' },
          especie: { type: 'string', description: 'Canino, Felino, Equino, Bovino, Ovino, Caprino, Suíno...' },
          peso_kg: { type: 'number' },
          dose_mg_kg: { type: 'number', description: 'Opcional: dose escolhida pelo veterinário' },
          protocolo_id: { type: 'string', description: 'Opcional: id de um protocolo do produto' },
          vezes_ao_dia: { type: 'number', description: 'Opcional: frequência diária' },
          dias: { type: 'number', description: 'Opcional: duração do tratamento' },
        },
        required: ['produto_id', 'especie', 'peso_kg'],
      },
      execute: (input: Record<string, unknown>) => {
        onProgress('Calculando a dose…');
        return calculateDose(input);
      },
    },
    {
      name: 'listar_pacientes',
      description: 'Lista os pacientes cadastrados no app com código, espécie, raça, peso e a última consulta (sem dados pessoais do tutor).',
      execute: () => {
        onProgress('Consultando os pacientes…');
        const ps = getPatients();
        return ps.length ? ps.map(patientBrief) : 'Nenhum paciente cadastrado.';
      },
    },
    {
      name: 'ficha_paciente',
      description:
        'Abre a ficha completa de um paciente pelo nome ou pelo código (ex.: VET-100001): dados, alergias, consultas recentes com exame físico, hipótese, prescrição e evolução.',
      inputSchema: {
        type: 'object',
        properties: { nome_ou_codigo: { type: 'string' } },
        required: ['nome_ou_codigo'],
      },
      execute: (input: Record<string, unknown>) => {
        onProgress('Abrindo a ficha do paciente…');
        const p = findPatient(getPatients(), String(input.nome_ou_codigo || ''));
        if (!p) throw new Error('Paciente não encontrado. Use listar_pacientes para ver os nomes cadastrados.');
        return patientRecord(p);
      },
    },
  ];
}

const ERROR_COPY: Record<string, string> = {
  not_granted: 'Para eu responder, é preciso permitir que o app use o Claude. Recarregue a página e toque em Permitir.',
  sampling_disabled: 'A IA não está disponível para esta conta no momento.',
  rate_limited: 'Muitas mensagens em pouco tempo. Espere um pouco e tente de novo.',
  session_expired: 'Sua sessão expirou. Entre novamente no claude.ai.',
  refused: 'Não consigo responder a essa mensagem. Tente reformular a pergunta.',
  prompt_too_large: 'A conversa ficou longa demais. Toque em "Nova Conversa" para recomeçar.',
};

export function errorMessage(code: string) {
  return ERROR_COPY[code] || 'Não consegui responder agora. Tente enviar de novo.';
}

/** Envia a conversa ao Claude com as ferramentas do app e transmite a resposta. */
export async function askVetAssistant(
  sample: SampleFn,
  history: AITurn[],
  getPatients: () => PatientRecord[],
  handlers: { onText: (text: string) => void; onProgress: (label: string) => void; signal?: AbortSignal },
) {
  const turns: AITurn[] = [{ role: 'user', content: buildRules(getPatients()) }, ...history.slice(-24)];
  const { text } = await sample(turns, {
    modelTier: 'quick',
    cache: false,
    signal: handlers.signal,
    tools: buildTools(getPatients, handlers.onProgress),
    onText: ({ text }: { text: string }) => handlers.onText(text),
  } as Record<string, unknown>);
  return text;
}

// ---------- Site (Netlify): Gemini gratuito, com Groq gratuito de reserva, via /api/assistant/agent ----------

type ServerMessage =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text?: string; toolCalls?: { id: string; name: string; args: Record<string, unknown> }[] }
  | { role: 'tool'; id: string; name: string; result: unknown };

export type AssistantProviderChoice = 'auto' | 'gemini' | 'groq';

export type ServerAgentErrorCode = 'quota' | 'unavailable' | 'unconfigured' | 'upstream' | 'cancelled' | 'premium_required';

const MAX_TOOL_ROUNDS = 6;

/** Conversa com a IA do servidor; as ferramentas rodam aqui, com os dados do aparelho. */
export async function askServerAssistant(
  history: AITurn[],
  getPatients: () => PatientRecord[],
  handlers: { onProgress: (label: string) => void; signal?: AbortSignal; provider?: AssistantProviderChoice },
): Promise<{ text: string; provider: string }> {
  const tools = buildTools(getPatients, handlers.onProgress);
  const schemas = tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));
  const work: ServerMessage[] = history.slice(-20).map((t) => ({ role: t.role, text: t.content }));
  const fail = (code: ServerAgentErrorCode) => Object.assign(new Error(code), { code });

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    let res: Response;
    try {
      res = await fetch('./api/assistant/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...premiumHeaders() },
        body: JSON.stringify({ system: buildRules(getPatients()), history: work, tools: schemas, provider: handlers.provider || 'auto' }),
        signal: handlers.signal,
      });
    } catch (e: any) {
      throw fail(e?.name === 'AbortError' ? 'cancelled' : 'unavailable');
    }
    if (!(res.headers.get('content-type') || '').includes('application/json')) throw fail('unavailable');
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) {
      const code = data?.error;
      throw fail(code === 'quota' || code === 'unconfigured' || code === 'premium_required' ? code : res.status === 404 ? 'unavailable' : 'upstream');
    }
    if (data.toolCalls?.length) {
      work.push({ role: 'assistant', text: data.text, toolCalls: data.toolCalls });
      for (const call of data.toolCalls) {
        const tool = tools.find((t) => t.name === call.name);
        let result: unknown;
        try {
          result = tool ? await tool.execute(call.args || {}) : `Ferramenta desconhecida: ${call.name}`;
        } catch (e: any) {
          result = `Erro: ${e?.message || e}`;
        }
        work.push({ role: 'tool', id: call.id, name: call.name, result });
      }
      continue;
    }
    return { text: String(data.text || '').trim() || 'Não consegui formular uma resposta. Pode reformular?', provider: data.provider };
  }
  throw fail('upstream');
}

/** Texto simples com IA (sem ferramentas): Claude no claude.ai; no site, Gemini/Groq pelo servidor. */
export async function generateWithAI(
  instructions: string,
  prompt: string,
  options: { signal?: AbortSignal; provider?: AssistantProviderChoice } = {},
): Promise<{ text: string; provider: string }> {
  const sample = options.provider && options.provider !== 'auto' ? null : await getClaudeSample();
  if (sample) {
    const { text } = await sample([{ role: 'user', content: `${instructions}\n\n${prompt}` }], {
      modelTier: 'quick',
      cache: false,
      signal: options.signal,
    } as Record<string, unknown>);
    return { text, provider: 'claude' };
  }
  const fail = (code: ServerAgentErrorCode) => Object.assign(new Error(code), { code });
  let res: Response;
  try {
    res = await fetch('./api/assistant/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...premiumHeaders() },
      body: JSON.stringify({ system: instructions, history: [{ role: 'user', text: prompt }], tools: [], provider: options.provider || 'auto' }),
      signal: options.signal,
    });
  } catch (e: any) {
    throw fail(e?.name === 'AbortError' ? 'cancelled' : 'unavailable');
  }
  if (!(res.headers.get('content-type') || '').includes('application/json')) throw fail('unavailable');
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.text) {
    const code = data?.error;
    throw fail(code === 'quota' || code === 'unconfigured' || code === 'premium_required' ? code : res.status === 404 ? 'unavailable' : 'upstream');
  }
  return { text: String(data.text).trim(), provider: data.provider };
}
