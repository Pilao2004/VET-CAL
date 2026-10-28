import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { AgentError, runAgentRound } from './agent';

dotenv.config();

// Rotas da API compartilhadas pelo servidor local (server.ts) e pela Netlify Function
const router = express.Router();

// Initialise server-side Gemini client
let aiClient: GoogleGenAI | null = null;
try {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} catch (err) {
  console.warn('Gemini client could not be initialized:', err);
}

// In-memory or verified valid coupon/license keys for Premium
const VALID_PROMO_KEYS = new Set([
  'VETPRO2026',
  'MEDVET',
  'HOTMART-VIP',
  'VETCALC-PREMIUM',
  'CRMV-BRASIL',
]);

// Active licenses store in server memory
const activeLicenses = new Map<string, { activatedAt: string; plan: string; email?: string }>();

// API: Validate subscription / license key
router.post('/subscription/validate', (req: Request, res: Response) => {
  const { licenseKey } = req.body;
  if (!licenseKey) {
    return res.status(400).json({ valid: false, message: 'Chave não informada.' });
  }

  const cleanKey = String(licenseKey).trim().toUpperCase();
  if (VALID_PROMO_KEYS.has(cleanKey) || activeLicenses.has(cleanKey)) {
    return res.json({
      valid: true,
      tier: 'premium',
      message: 'Assinatura Premium ativa e validada no servidor.',
      expiresAt: '2027-12-31',
    });
  }

  return res.status(403).json({
    valid: false,
    message: 'Código de ativação ou assinatura inválido. Utilize um cupom promocional ou renove sua assinatura.',
  });
});

// API: Activate subscription
router.post('/subscription/activate', (req: Request, res: Response) => {
  const { licenseKey, email } = req.body;
  const cleanKey = String(licenseKey || '').trim().toUpperCase();

  if (VALID_PROMO_KEYS.has(cleanKey)) {
    activeLicenses.set(cleanKey, {
      activatedAt: new Date().toISOString(),
      plan: 'premium',
      email: email || 'usuario@medvet.com',
    });
    return res.json({
      success: true,
      tier: 'premium',
      message: 'Plano Premium ativado com sucesso!',
      expiresAt: '2027-12-31',
    });
  }

  return res.status(400).json({
    success: false,
    message: 'Chave de ativação inválida. Verifique o código e tente novamente.',
  });
});

// API: Veterinary AI Assistant
router.post('/assistant/chat', async (req: Request, res: Response) => {
  const { messages, detectedPatient } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Histórico de mensagens inválido.' });
  }

  const lastUserMsg = messages[messages.length - 1]?.content || '';
  const isGreeting = /^(oi|ol[aá]|bom dia|boa tarde|boa noite|tudo bem|como vai|sauda[cç][oõ]es|e a[ií])/i.test(lastUserMsg.trim());

  try {
    const formattedHistory = messages
      .slice(-10)
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Colega Veterinário' : 'Assistente VET'}: ${m.content}`)
      .join('\n\n');

    let patientContextNote = '';
    if (detectedPatient && (detectedPatient.species || detectedPatient.weightKg)) {
      patientContextNote = `\n[DADOS DETECTADOS DO PACIENTE: Espécie: ${detectedPatient.species || 'Não informada'}, Peso: ${detectedPatient.weightKg ? `${detectedPatient.weightKg} kg` : 'Não informado'}. Use esses dados para calcular as doses em mg e os volumes em mL com precisão!]`;
    }

    const systemInstruction = `Você é o Assistente Veterinário Especialista e Clínico do VET CALC PRO — uma inteligência artificial humanizada, empática, acolhedora, técnica e altamente resolutiva para Médicos-Veterinários e estudantes.

SUA PERSONALIDADE E COMUNICAÇÃO:
1. Converse de forma natural, acolhedora, humanizada e empática, exatamente como um experiente colega médico-veterinário e preceptor de clínica médica.
2. Seja prestativo e cordial: se o usuário disser "boa noite", "olá", "bom dia" ou fizer cumprimentos, responda calorosamente e pergunte como pode auxiliá-lo com os pacientes do plantão.
3. Interprete livremente perguntas abertas, dúvidas de diagnóstico, casos clínicos e descrições de sintomas (ex: "gato com problema respiratório o que eu faço", "cão com gastroenterite", "animal convulsionando", "intoxicação"). NUNCA fique travado exigindo um remédio específico quando o usuário relatar um caso ou sintoma!

ESTRUTURA DE RESPOSTA PARA CASOS CLÍNICOS E SINTOMAS:
Ao receber um caso ou sintoma clínico, estruture a resposta de forma clara, didática e imediata:
1. 🚨 ACOLHIMENTO E CONDUTA IMEDIATA / ESTABILIZAÇÃO:
   - Prioridades do exame físico e suporte inicial (vias aéreas, oxigenioterapia para dispneia, acesso venoso, fluidoterapia para desidratação, controle de dor/êmese/convulsão, redução de estresse principalmente em felinos).
2. 🔍 PRINCIPAIS DIAGNÓSTICOS DIFERENCIAIS:
   - Liste as causas mais prováveis e frequentes para a espécie e sinais apresentados.
3. 🧪 EXAMES COMPLEMENTARES RECOMENDADOS:
   - Exames de imagem (radiografia, ultrassonografia) e laboratoriais prioritários (hemograma, bioquímicos, eletrólitos, gasometria).
4. 💊 CONDUTA TERAPÊUTICA & MEDICAMENTOS RECOMENDADOS:
   - Indique as classes terapêuticas e os medicamentos de primeira linha.
   - PRIORIZE MEDICAMENTOS CADASTRADOS NA BIBLIOTECA DO VET CALC PRO (ex: Ondansetrona 2 mg/mL, Maropitant/Cerenia 10 mg/mL, Omeprazol injetável 40 mg/4 mg/mL, Agemoxi LA 15% 150 mg/mL, Enrofloxacino 5% ou 10%, Flamavet/Meloxicam 0,2% ou 2 mg/mL, Biodex/Dexametasona 2 mg/mL, Dipirona 500 mg/mL, Tramadol 50 mg/mL, Ringer Lactato).
   - SE O PESO DO PACIENTE FOR INFORMADO (ex: 10 kg, 3,5 kg), CALCULE AUTOMATICAMENTE A DOSE TOTAL (mg) E O VOLUME EXATO A APLICAR (mL) COM BASE NA CONCENTRAÇÃO!
   - Se for uma droga ou protocolo não registrado na base local, use a ferramenta de busca do Google (Google Search) para obter a dose veterinária e a literatura oficial atualizada.
5. ⚠️ SINAIS DE ALERTA E MONITORAMENTO:
   - Parâmetros que devem ser monitorados de perto no internamento ou domicílio.
6. 🤝 FECHAMENTO ACOLHEDOR:
   - Coloque-se à disposição para detalhar qualquer aspecto, calcular outra medicação ou ajustar o protocolo.

ESTRUTURA PARA CÁLCULO DE MEDICAMENTOS ESPECÍFICOS:
Se o usuário pedir a dose ou cálculo de um fármaco:
- Apresente: Nome Comercial, Princípio Ativo, Concentração da apresentação, Dose de referência (mg/kg), Dose calculada (mg), Volume a administrar (mL), Via de aplicação e Frequência/Intervalo.

RESPONSABILIDADE CLÍNICA:
Mantenha a postura de suporte técnico confiável, lembrando que a avaliação presencial e prescrição cabem ao médico-veterinário responsável.`;

    const prompt = `Histórico da conversa:
${formattedHistory}

Última mensagem do colega veterinário: "${lastUserMsg}"${patientContextNote}

Responda com excelência clínica, tom humano e acolhedor, de forma completa e estruturada em Markdown:`;

    // Try available models per gemini-api guidelines with fallback
    const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let reply = '';
    let lastError: any = null;

    if (aiClient) {
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await aiClient.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              tools: [{ googleSearch: {} }],
              temperature: 0.6,
            },
          });
          reply = response.text || '';
          if (reply) break;
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} with search failed: ${err?.message || err}. Trying without tools...`);
          try {
            const fallbackResponse = await aiClient.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                systemInstruction,
                temperature: 0.6,
              },
            });
            reply = fallbackResponse.text || '';
            if (reply) break;
          } catch (innerErr) {
            console.warn(`Model ${modelName} without tools failed:`, innerErr);
          }
        }
      }
    }

    if (!reply) {
      // Smart clinical fallback if Gemini is temporarily unavailable
      if (isGreeting) {
        reply = 'Olá! 👋 Muito boa noite! Como posso ajudar você e seu paciente hoje?\n\nFique à vontade para relatar o caso clínico, os sintomas ou solicitar cálculos de doses de medicamentos!';
      } else if (/gastroenterite|vomit|vômit|diarr/i.test(lastUserMsg)) {
        reply = `### 🩺 Conduta Clínica para Gastroenterite / Vômitos & Diarreia\n\n` +
          `Olá, colega! Casos de gastroenterite exigem estabilização rápida hidroeletrolítica e controle sintomático:\n\n` +
          `#### 1. 🚨 Estabilização e Fluidoterapia Imediata\n` +
          `- **Avaliar grau de desidratação**: Turgor cutâneo, umidade de mucosas e TPC.\n` +
          `- **Reposição hidroeletrolítica**: Solução de Ringer com Lactato IV (Déficit = Peso × % Desidratação × 10 mL + Manutenção 50-60 mL/kg/dia).\n` +
          `- **Jejum hídrico e alimentar inicial**: de 6 a 12 horas caso haja êmese ativa incoercível.\n\n` +
          `#### 2. 💊 Terapia Farmacológica de Primeira Linha (Base VET CALC PRO)\n` +
          `- **Antiemético**: **Ondansetrona** (2 mg/mL): 0,2 a 0,5 mg/kg IV a cada 8-12h, ou **Maropitant** (Cerenia 10 mg/mL): 1 mg/kg SC a cada 24h (máx 5 dias).\n` +
          `- **Protetor Gástrico**: **Omeprazol injetável** (40 mg diluído para 4 mg/mL): 1,0 mg/kg IV a cada 24h.\n` +
          `- **Antiespasmódico / Analgésico visceral**: Se dor abdominal, Dipirona 500 mg/mL (25 mg/kg IV/SC) ou Tramadol (2-3 mg/kg SC/IV).\n` +
          `- **Antibioticoterapia**: Reservada para suspeita de translocação bacteriana, hematoquezia ou sepse (ex: Metronidazol 10-15 mg/kg IV BID ou Amoxicilina com Clavulanato / Agemoxi).\n\n` +
          `#### 3. 🧪 Exames Prioritários\n` +
          `- Hemograma completo (leucopenia em parvovirose, hematócrito/desidratação).\n` +
          `- Bioquímicos: Creatinina, Ureia, ALT, FA, Albumina, Eletrólitos (Na+, K+, Cl-).\n` +
          `- Ultrassom abdominal (investigar corpo estranho, intussuscepção, espessamento de alças).\n\n` +
          `*Se desejar que eu calcule os volumes exatos em mL das medicações, basta me informar o peso do paciente (ex: cão 10 kg)!*`;
      } else if (/esporotricose|esporo|fungo|dermatite|ferida/i.test(lastUserMsg)) {
        reply = `Conduta Clínica para Esporotricose Felina\n\n` +
          `Olá, colega! A esporotricose é uma micose subcutânea zoonótica de alta relevância clínica causada pelo fungo Sporothrix spp. (principalmente Sporothrix brasiliensis em gatos):\n\n` +
          `1. Biossegurança e Proteção no Atendimento (Zoonose)\n` +
          `- **Uso OBRIGATÓRIO de EPIs**: Luvas de procedimento, avental e óculos de proteção ao manusear o animal.\n` +
          `- O fungo é altamente transmissível a humanos por arranhaduras, mordeduras ou contato de exsudato de lesões ulceradas com microfissuras na pele.\n\n` +
          `2. Diagnóstico e Exames\n` +
          `- **Citologia aspirativa por agulha fina (CAAF)** ou esfregaço de exsudato corado por Panótico (visualização de leveduras arredondadas ou ovaladas em forma de charuto).\n` +
          `- **Cultura fúngica** em ágar Sabouraud para confirmação definitiva.\n` +
          `- Hemograma e bioquímicos completos (avaliar função hepática e renal antes de introduzir antifúngicos sistêmicos).\n\n` +
          `3. Terapia Antifúngica e Conduta\n` +
          `- **Itraconazol (primeira escolha)**: 5 a 10 mg/kg, VO, a cada 24 horas (SID), administrado junto com alimento para melhorar a absorção.\n` +
          `- **Duração do tratamento**: O tratamento deve ser prolongado, mantido por pelo menos 30 a 60 dias após a **cura clínica completa** (cicatrização total de todas as lesões).\n` +
          `- Isolamento domiciliar do felino para evitar acesso à rua e circulação do fungo.\n\n` +
          `Se desejar calcular a dose exata do Itraconazol para o peso do seu paciente, me informe o peso em kg!`;
      } else if (/convulsão|crise convulsiva|epilepsia|neurológico/i.test(lastUserMsg)) {
        reply = `Conduta de Emergência para Crise Convulsiva / Estado Epiléptico\n\n` +
          `Olá, colega! Convulsões são emergências neurológicas que exigem intervenção rápida para evitar lesão cerebral permanente:\n\n` +
          `1. Estabilização e Interrupção da Crise\n` +
          `- **Diazepam**: 0,5 a 1,0 mg/kg IV ou via retal (se acesso venoso difícil). Pode repetir até 3 vezes.\n` +
          `- **Midazolam**: 0,2 a 0,5 mg/kg IV, IM ou intranasal.\n\n` +
          `2. Suporte Geral\n` +
          `- Oxigenioterapia com máscara.\n` +
          `- Acesso venoso e fluidoterapia com Ringer Lactato.\n` +
          `- Monitorização de glicemia e temperatura corporal.\n\n` +
          `Informe a espécie e o peso do paciente caso precise calcular doses de anticonvulsivantes!`;
      } else {
        reply = `Conduta Clínica e Raciocínio Diagnóstico\n\n` +
          `Olá, colega! Compreendi seu relato sobre o caso clínico. Para conduzir este atendimento da melhor forma, recomendo:\n\n` +
          `1. Anamnese e Exame Físico Detalhado\n` +
          `- Avaliação dos parâmetros vitais (FC, FR, TPC, hidratação e temperatura corporal).\n\n` +
          `2. Exames Complementares Iniciais\n` +
          `- Hemograma completo e perfil bioquímico (função renal e hepática).\n\n` +
          `3. Terapia Sintomática e de Suporte\n` +
          `- Estabilização hemodinâmica e controle da dor.\n\n` +
          `Pode me detalhar os sintomas específicos, a espécie e o peso do animal para montarmos o protocolo terapêutico exato?`;
      }
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      error: 'Erro no servidor de IA.',
      details: error.toString(),
    });
  }
});

// API: External Drug Search for Assistant with Google Search Grounding
router.post('/assistant/search-drug', async (req: Request, res: Response) => {
  const { query, species } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Termo de busca não informado.' });
  }

  if (!aiClient) {
    return res.status(500).json({ error: 'Serviço de busca com IA indisponível.' });
  }

  try {
    const today = new Date().toLocaleDateString('pt-BR');
    const prompt = `Você é um pesquisador farmacêutico e médico-veterinário do VET CALC PRO.
Pesquise a bula oficial do fabricante, laboratório responsável e referências farmacológicas veterinárias para: "${query}".
Espécie animal informada pelo usuário: ${species || 'Não especificada'}.

DIRETRIZES DE SEGURANÇA OBRIGATÓRIAS:
1. Jamais invente laboratórios, concentrações, doses ou apresentações.
2. Se não for possível confirmar a concentração oficial em mg/mL ou mg/comprimido, retorne "insufficientData": true.
3. Extraia o nome comercial, princípio ativo, laboratório, concentração numérica exata em mg/mL, apresentações e faixa de dose em mg/kg.

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown ou texto fora do JSON):
{
  "found": true,
  "insufficientData": false,
  "brandName": "Nome do Medicamento",
  "activePrinciple": "Princípio Ativo",
  "laboratory": "Nome do Laboratório",
  "formType": "liquid",
  "concentrationMgMl": 10,
  "concentrationText": "10 mg/mL",
  "species": ["Canino", "Felino"],
  "defaultDoseMgKg": { "canino": 1.0, "felino": 1.0 },
  "doseRangeText": "0,5 a 1,0 mg/kg a cada 24h",
  "defaultRoute": "Subcutânea (SC) / IV",
  "defaultFrequency": "SID",
  "source": "Bula Oficial do Fabricante / Compêndio Veterinário",
  "searchDate": "${today}",
  "clinicalNotes": "Instruções e contraindicações relevantes."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.json({
        found: false,
        insufficientData: true,
        message: 'Não foi possível confirmar os dados oficiais deste medicamento com segurança.',
        searchDate: today,
      });
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json(parsed);
    } catch {
      return res.json({
        found: false,
        insufficientData: true,
        message: 'Informações farmacológicas insuficientes na literatura aberta.',
        searchDate: today,
      });
    }
  } catch (error: any) {
    console.error('Error in external drug search:', error);
    return res.status(500).json({
      found: false,
      insufficientData: true,
      error: 'Falha na pesquisa externa farmacológica.',
      details: error?.message,
    });
  }
});

// API: uma rodada da Assistente conversacional (ferramentas executadas no navegador)
router.post('/assistant/agent', async (req: Request, res: Response) => {
  const { system, history, tools, provider } = req.body || {};
  if (typeof system !== 'string' || !Array.isArray(history) || !Array.isArray(tools)) {
    return res.status(400).json({ error: 'invalid_request' });
  }
  try {
    const choice = provider === 'gemini' || provider === 'groq' ? provider : 'auto';
    return res.json(await runAgentRound(system, history.slice(-40), tools, choice));
  } catch (err: any) {
    const code = err instanceof AgentError ? err.code : 'upstream';
    console.warn('Assistente IA:', err?.message || err);
    return res.status(code === 'quota' ? 429 : code === 'unconfigured' ? 503 : 502).json({ error: code });
  }
});

export function createApiApp() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  // '/api' para o servidor local; '/.netlify/functions/api' quando o Netlify repassa o caminho reescrito
  app.use(['/api', '/.netlify/functions/api'], router);
  return app;
}
