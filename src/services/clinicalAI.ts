// Chat clínico e busca de medicamentos fora da base, com o Gemini do Firebase (antes ficavam no servidor).
import { generateGrounded } from './firebaseAI';

const SYSTEM_INSTRUCTION = `Você é o Assistente Veterinário Especialista e Clínico do VET CALC PRO — uma inteligência artificial humanizada, empática, acolhedora, técnica e altamente resolutiva para Médicos-Veterinários e estudantes.

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

/** Resposta do chat clínico; o histórico vem da tela. */
export async function clinicalChat(
  messages: { role: string; content: string }[],
  detectedPatient?: { species?: string | null; weightKg?: number | null } | null,
): Promise<string> {
  const lastUserMsg = messages[messages.length - 1]?.content || '';
  const formattedHistory = messages
    .slice(-10)
    .map((m) => `${m.role === 'user' ? 'Colega Veterinário' : 'Assistente VET'}: ${m.content}`)
    .join('\n\n');
  const patientContextNote =
    detectedPatient && (detectedPatient.species || detectedPatient.weightKg)
      ? `\n[DADOS DETECTADOS DO PACIENTE: Espécie: ${detectedPatient.species || 'Não informada'}, Peso: ${detectedPatient.weightKg ? `${detectedPatient.weightKg} kg` : 'Não informado'}. Use esses dados para calcular as doses em mg e os volumes em mL com precisão!]`
      : '';
  const prompt = `Histórico da conversa:
${formattedHistory}

Última mensagem do colega veterinário: "${lastUserMsg}"${patientContextNote}

Responda com excelência clínica, tom humano e acolhedor, de forma completa e estruturada em Markdown:`;
  return generateGrounded(SYSTEM_INSTRUCTION, prompt, 0.6);
}

/** Pesquisa a bula de um medicamento que não está na biblioteca; nunca inventa dados. */
export async function searchDrugWithAI(query: string, species?: string | null): Promise<any> {
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
  const text = await generateGrounded(undefined, prompt, 0.1);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { found: false, insufficientData: true, message: 'Não foi possível confirmar os dados oficiais deste medicamento com segurança.', searchDate: today };
  }
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return { found: false, insufficientData: true, message: 'Informações farmacológicas insuficientes na literatura aberta.', searchDate: today };
  }
}
