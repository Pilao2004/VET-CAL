import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  Calculator,
  Search,
  BookOpen,
  BookmarkPlus,
  ArrowRight,
  Info,
  AlertTriangle,
  Building2,
  Syringe,
  PlusCircle,
  FileText,
  ExternalLink,
  ClipboardList,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage, ChatQuickOption, PatientRecord } from '../types';
import { COMMERCIAL_PRODUCTS, CommercialProduct, DosageProtocol } from '../data/commercialProducts';
import { patientService } from '../services/patientService';
import {
  parseVeterinaryQuery,
  calculateDeterministicDose,
  SmartCalculationResult,
  formatClinicalVolume,
} from '../utils/assistantCalculator';

interface PendingCalculationState {
  drug: CommercialProduct | null;
  externalDrug?: any;
  species: 'Canino' | 'Felino' | string | null;
  weightKg: number | null;
  doseMgKg: number | null;
  totalDoseMg: number | null;
  concentrationMgMl: number | null;
  route?: string;
  frequency?: string;
  bulaRuleText?: string;
  protocolLabel?: string;
  waitingFor?: 'presentation' | 'species' | 'weight' | 'dose' | null;
}

const EMPTY_PENDING: PendingCalculationState = {
  drug: null,
  species: null,
  weightKg: null,
  doseMgKg: null,
  totalDoseMg: null,
  concentrationMgMl: null,
  waitingFor: null,
};

export const AssistantView: React.FC = () => {
  const {
    showToast,
    addCalculationToHistory,
    user,
    patients,
    setCurrentView,
    setSelectedPatientId,
    addClinicalEvolutionToPatient,
  } = useApp();
  const [evolutionPreview, setEvolutionPreview] = useState<{
    patientId: string;
    patientName: string;
    text: string;
  } | null>(null);
  const [isSavingEvolution, setIsSavingEvolution] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Olá! 👋 Como posso ajudar com seu paciente hoje?

Posso auxiliar com cálculos de medicamentos, consultar informações farmacológicas ou ajudar a organizar seu raciocínio clínico.

É só me contar o que você precisa.`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedResultDetails, setSelectedResultDetails] = useState<SmartCalculationResult | null>(null);
  const [pendingCalculation, setPendingCalculation] = useState<PendingCalculationState>(EMPTY_PENDING);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Executa o cálculo determinístico quando todos os dados estiverem disponíveis
  const executeCalculation = (state: PendingCalculationState) => {
    if (!state.species || !state.weightKg || !state.concentrationMgMl) return false;
    if ((state.doseMgKg === null || state.doseMgKg === undefined) && (state.totalDoseMg === null || state.totalDoseMg === undefined)) {
      return false;
    }

    try {
      const drugName = state.drug?.brandName || state.externalDrug?.brandName || 'Medicamento Veterinário';
      const activePrinciple = state.drug?.activePrinciple || state.externalDrug?.activePrinciple || 'Princípio Ativo';
      const laboratory = state.drug?.manufacturer || state.drug?.brandName.match(/\(([^)]+)\)/)?.[1] || state.externalDrug?.laboratory || 'Laboratório Veterinário';

      const result = calculateDeterministicDose({
        drugName,
        activePrinciple,
        laboratory,
        species: state.species,
        weightKg: state.weightKg,
        doseMgKg: state.doseMgKg || undefined,
        totalDoseMg: state.totalDoseMg || undefined,
        concentrationMgMl: state.concentrationMgMl,
        route: state.route || state.drug?.defaultRoute || 'Subcutânea (SC) / IV',
        frequency: state.frequency || state.drug?.defaultFrequency || 'A cada 24 horas (SID)',
        protocolLabel: state.protocolLabel,
        bulaRuleText: state.bulaRuleText || state.drug?.clinicalNotes,
        source: state.externalDrug ? state.externalDrug.source : 'Bula Oficial do Fabricante / Base Farmacológica VET CALC PRO',
        searchDate: state.externalDrug?.searchDate,
        isExternal: Boolean(state.externalDrug),
      });

      const calcMessage: ChatMessage = {
        id: 'calc-' + Date.now(),
        role: 'assistant',
        content: `Cálculo realizado com sucesso para **${result.drugName}** em **${result.species}** (${result.weightKg} kg):`,
        calcResult: result,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, calcMessage]);
      setPendingCalculation({
        drug: null,
        species: null,
        weightKg: null,
        doseMgKg: null,
        totalDoseMg: null,
        concentrationMgMl: null,
        waitingFor: null,
      });

      showToast(`Volume calculado: ${result.volumeDisplayShort} para ${result.species} (${result.weightKg} kg).`);
      return true;
    } catch (err: any) {
      console.error('Calculation error:', err);
      const errMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: `⚠️ Não foi possível calcular a dose: ${err.message || 'Verifique as informações informadas.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
      return false;
    }
  };

  // Pesquisa externa via API no servidor quando o medicamento não está cadastrado
  const searchExternalDrug = async (drugName: string, species?: string | null) => {
    setLoading(true);
    try {
      const res = await fetch('/api/assistant/search-drug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: drugName, species }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error('External search error:', err);
      return { found: false, insufficientData: true };
    } finally {
      setLoading(false);
    }
  };

  const sendToChatApi = async (textToSend: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { id: 'u', role: 'user', content: textToSend }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'Não foi possível obter resposta no momento.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Falha na comunicação com o servidor de IA. Tente novamente em instantes.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fluxo de análise da mensagem
  const processUserMessage = async (textToSend: string) => {
    // 0. Detecta consulta segura de prontuário por código (VET-XXXXXX)
    const codeMatch = textToSend.match(/VET-\d{5,8}/i);
    if (codeMatch) {
      const code = codeMatch[0].toUpperCase();
      let foundPatient: PatientRecord | null = null;
      if (user) {
        try {
          foundPatient = await patientService.getPatientByPublicCode(code, user.id);
        } catch (e) {
          console.error(e);
        }
      } else {
        foundPatient = patients.find((p) => p.publicCode === code) || null;
      }

      if (!foundPatient) {
        const notFoundMsg: ChatMessage = {
          id: 'pt-notfound-' + Date.now(),
          role: 'assistant',
          content: `🔒 **Prontuário com código \`${code}\` não localizado:**\n\nNenhum paciente cadastrado sob sua conta possui esse código, ou você não possui autorização para acessá-lo.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, notFoundMsg]);
        return;
      }

      // Contexto mínimo e seguro
      const latestCons = foundPatient.consultations?.[0];
      const patientSummaryMsg: ChatMessage = {
        id: 'pt-found-' + Date.now(),
        role: 'assistant',
        content: `📋 **Prontuário Identificado:** **${foundPatient.name}** (${foundPatient.species} - ${foundPatient.breed}, ${foundPatient.weight} kg)
• **Código Público:** \`${foundPatient.publicCode}\`
• **Tutor:** ${foundPatient.tutorName}
• **Alergias:** ${foundPatient.allergies || 'Nenhuma registrada'}
${latestCons ? `• **Última Consulta (${new Date(latestCons.date).toLocaleDateString('pt-BR')}):** ${latestCons.tentativeDiagnosis || 'Não informada'}` : ''}

Como deseja prosseguir com este paciente?`,
        quickOptions: [
          {
            id: 'gen-evolution',
            label: '📝 Gerar Prévia de Evolução Clínica',
            badge: 'Prévia IA',
            payload: { action: 'draft_evolution', patient: foundPatient },
          },
          {
            id: 'prep-calc',
            label: `💉 Calcular Medicamento (${foundPatient.weight} kg)`,
            badge: 'Posologia',
            payload: { action: 'prep_calc', patient: foundPatient },
          },
          {
            id: 'open-patient',
            label: '📄 Acessar Prontuário Completo',
            payload: { action: 'open_patient', patientId: foundPatient.id },
          },
        ],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, patientSummaryMsg]);
      return;
    }

    // 1. Detecta saudação/conversa casual
    if (/^(oi|ola|olá|bom dia|boa tarde|boa noite|tudo bem|como vai)/i.test(textToSend.trim())) {
      await sendToChatApi(textToSend);
      return;
    }

    const parsed = parseVeterinaryQuery(textToSend);

    // A mensagem só continua o cálculo anterior se responder exatamente ao que foi perguntado
    const waiting = pendingCalculation.waitingFor;
    const answersPending =
      (waiting === 'species' && Boolean(parsed.species)) ||
      (waiting === 'weight' && Boolean(parsed.weightKg)) ||
      (waiting === 'dose' && (parsed.doseMgKg !== null || parsed.totalDoseMg !== null));

    // Dúvida clínica nova: não reaproveita o medicamento da conversa anterior
    if (!parsed.isCalculationIntent && !answersPending) {
      setPendingCalculation(EMPTY_PENDING);
      await sendToChatApi(textToSend);
      return;
    }

    // Medicamento novo citado: descarta o anterior (mantém espécie e peso do mesmo paciente)
    const base: PendingCalculationState =
      parsed.candidateProducts.length > 0
        ? { ...EMPTY_PENDING, species: pendingCalculation.species, weightKg: pendingCalculation.weightKg }
        : pendingCalculation;

    // Mescla dados atuais com o estado pendente
    let current: PendingCalculationState = {
      ...base,
      species: parsed.species || base.species,
      weightKg: parsed.weightKg || base.weightKg,
      doseMgKg: parsed.doseMgKg !== null ? parsed.doseMgKg : base.doseMgKg,
      totalDoseMg: parsed.totalDoseMg !== null ? parsed.totalDoseMg : base.totalDoseMg,
    };

    if (parsed.concentrationMgMl) {
      current.concentrationMgMl = parsed.concentrationMgMl;
    }

    // Se detectou um produto no texto
    if (parsed.matchedProduct) {
      current.drug = parsed.matchedProduct;
      current.concentrationMgMl = parsed.matchedProduct.concentrationMgMl || current.concentrationMgMl;
      current.route = parsed.matchedProduct.defaultRoute;
      current.frequency = parsed.matchedProduct.defaultFrequency;
    }

    // SE NÃO HÁ PRODUTO DEFINIDO MAS HÁ CANDIDATOS
    if (!current.drug && !current.externalDrug) {
      if (parsed.candidateProducts.length === 1) {
        current.drug = parsed.candidateProducts[0];
        current.concentrationMgMl = parsed.candidateProducts[0].concentrationMgMl || current.concentrationMgMl;
        current.route = parsed.candidateProducts[0].defaultRoute;
        current.frequency = parsed.candidateProducts[0].defaultFrequency;
      } else if (parsed.candidateProducts.length > 1) {
        // Mais de uma apresentação encontrada (ex: Agemoxi LA 15% vs Agemoxi CL Comprimidos)
        current.waitingFor = 'presentation';
        setPendingCalculation(current);

        const options: ChatQuickOption[] = parsed.candidateProducts.slice(0, 5).map((p) => ({
          id: p.id,
          label: p.brandName,
          sublabel: p.formType === 'liquid' ? `Concentração: ${p.concentrationMgMl} mg/mL` : `Comprimido: ${p.tabletMg} mg`,
          badge: p.formType === 'liquid' ? 'Injetável/Líquido' : 'Comprimido',
          payload: { action: 'select_product', product: p },
        }));

        const askPresentationMsg: ChatMessage = {
          id: 'ask-pres-' + Date.now(),
          role: 'assistant',
          content: `Identifiquei mais de uma apresentação comercial cadastrada para **"${parsed.drugMention || 'o medicamento informado'}"**.

Para garantir a precisão matemática e segurança posológica, **qual apresentação você está utilizando?**`,
          quickOptions: options,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, askPresentationMsg]);
        return;
      } else if (parsed.drugMention && parsed.isCalculationIntent) {
        // Medicamento NÃO encontrado localmente -> Busca externa
        const searchStatusMsg: ChatMessage = {
          id: 'searching-' + Date.now(),
          role: 'assistant',
          content: `🔍 O medicamento **"${parsed.drugMention}"** não consta na biblioteca local.
Consultando a **bula oficial do fabricante e compêndios farmacológicos veterinários**...`,
          isSearchingExternal: true,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, searchStatusMsg]);

        const extData = await searchExternalDrug(parsed.drugMention, current.species);

        if (extData && extData.found && !extData.insufficientData && extData.concentrationMgMl) {
          current.externalDrug = extData;
          current.concentrationMgMl = extData.concentrationMgMl;
          current.route = extData.defaultRoute;
          current.frequency = extData.defaultFrequency;
          setPendingCalculation(current);

          const foundMsg: ChatMessage = {
            id: 'found-ext-' + Date.now(),
            role: 'assistant',
            content: `📖 **Informações farmacológicas encontradas na pesquisa externa:**

• **Medicamento:** ${extData.brandName} (${extData.activePrinciple})
• **Laboratório:** ${extData.laboratory || 'Não especificado'}
• **Concentração identificada:** **${extData.concentrationText || `${extData.concentrationMgMl} mg/mL`}**
• **Espécies indicadas:** ${extData.species?.join(', ') || 'Cães e Gatos'}
• **Dose de Referência:** ${extData.doseRangeText || 'Conforme prescrição'}
• **Fonte:** *${extData.source}* (${extData.searchDate})

⚠️ **Verificação de Segurança:** Confirma utilizar a concentração de **${extData.concentrationText || `${extData.concentrationMgMl} mg/mL`}** para realizar o cálculo?`,
            quickOptions: [
              {
                id: 'confirm-ext',
                label: `Confirmar e Prosseguir (${extData.concentrationText || `${extData.concentrationMgMl} mg/mL`})`,
                badge: 'Revisado',
                payload: { action: 'confirm_external', data: extData },
              },
              {
                id: 'suggest-catalog',
                label: '➕ Sugerir para cadastro permanente na biblioteca',
                badge: 'Biblioteca',
                payload: { action: 'suggest_drug', data: extData },
              },
            ],
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, foundMsg]);
          return;
        } else {
          await sendToChatApi(textToSend);
          return;
        }
      }
    }

    // SE NÃO É UMA INTENÇÃO DE CÁLCULO E NÃO HÁ MEDICAMENTO PENDENTE -> Dúvida Clínica Geral
    if (!current.drug && !current.externalDrug && !parsed.isCalculationIntent) {
      await sendToChatApi(textToSend);
      return;
    }

    // SE TEM MEDICAMENTO MAS FALTA A ESPÉCIE
    if (!current.species) {
      current.waitingFor = 'species';
      setPendingCalculation(current);

      const askSpeciesMsg: ChatMessage = {
        id: 'ask-species-' + Date.now(),
        role: 'assistant',
        content: `Para calcular **${current.drug?.brandName || current.externalDrug?.brandName}**, **qual é a espécie do paciente?**`,
        quickOptions: [
          { id: 'sp-dog', label: '🐶 Cão (Canino)', payload: { action: 'set_species', species: 'Canino' } },
          { id: 'sp-cat', label: '🐱 Gato (Felino)', payload: { action: 'set_species', species: 'Felino' } },
        ],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, askSpeciesMsg]);
      return;
    }

    // SE TEM MEDICAMENTO E ESPÉCIE MAS FALTA O PESO
    if (!current.weightKg) {
      current.waitingFor = 'weight';
      setPendingCalculation(current);

      const askWeightMsg: ChatMessage = {
        id: 'ask-weight-' + Date.now(),
        role: 'assistant',
        content: `Qual é o **peso corporal do animal em quilogramas (kg)**? *(ex: 4 kg, 12,5 kg)*`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, askWeightMsg]);
      return;
    }

    // SE FALTA A DOSE (verificar protocolos da bula ou solicitar)
    if (current.doseMgKg === null && current.totalDoseMg === null) {
      current.waitingFor = 'dose';

      // Verifica se o produto tem protocolos posológicos cadastrados (ex: 1º dia ataque vs manutenção)
      const protocols = current.drug?.protocols;
      if (protocols && protocols.length > 0) {
        setPendingCalculation(current);
        const isDog = current.species === 'Canino';
        const options: ChatQuickOption[] = protocols.map((proto) => {
          const dose = isDog ? proto.doseMgKg.canino : proto.doseMgKg.felino;
          return {
            id: proto.id,
            label: `${proto.label} (${dose} mg/kg)`,
            sublabel: proto.bulaRuleText,
            badge: `${dose} mg/kg`,
            payload: { action: 'set_protocol', protocol: proto, dose },
          };
        });

        const askProtocolMsg: ChatMessage = {
          id: 'ask-proto-' + Date.now(),
          role: 'assistant',
          content: `Identifiquei os seguintes **protocolos e doses documentadas na bula oficial** para **${current.species}**:

Qual dose você deseja confirmar para este paciente?`,
          quickOptions: options,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, askProtocolMsg]);
        return;
      }

      // Se há dose padrão de referência recomendada na literatura
      const defaultDose = current.species === 'Canino'
        ? current.drug?.defaultDoseMgKg?.canino || current.externalDrug?.defaultDoseMgKg?.canino
        : current.drug?.defaultDoseMgKg?.felino || current.externalDrug?.defaultDoseMgKg?.felino;

      if (defaultDose) {
        setPendingCalculation(current);
        const askDoseMsg: ChatMessage = {
          id: 'ask-dose-' + Date.now(),
          role: 'assistant',
          content: `A dose de referência recomendada na literatura para **${current.drug?.brandName || current.externalDrug?.brandName}** em **${current.species}** é de **${defaultDose} mg/kg**.

Confirma esta dose ou deseja prescrever outro valor em mg/kg?`,
          quickOptions: [
            {
              id: 'confirm-ref-dose',
              label: `Confirmar ${defaultDose} mg/kg`,
              badge: 'Bula Padrão',
              payload: { action: 'set_dose', dose: defaultDose },
            },
          ],
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, askDoseMsg]);
        return;
      }

      // Se não há dose conhecida
      setPendingCalculation(current);
      const askCustomDoseMsg: ChatMessage = {
        id: 'ask-custom-dose-' + Date.now(),
        role: 'assistant',
        content: `Qual **dose em mg/kg** foi prescrita pelo médico-veterinário para este paciente? *(ex: 2 mg/kg, 0,1 mg/kg)*`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, askCustomDoseMsg]);
      return;
    }

    // TUDO REUNIDO! EXECUTAR CÁLCULO DETERMINÍSTICO!
    executeCalculation(current);
  };

  // Clique nos botões de opções interativas (Apresentação, Espécie, Protocolo)
  const handleOptionClick = (option: ChatQuickOption) => {
    const payload = option.payload;
    if (!payload) return;

    if (payload.action === 'select_product') {
      const prod: CommercialProduct = payload.product;
      const updated: PendingCalculationState = {
        ...pendingCalculation,
        drug: prod,
        concentrationMgMl: prod.concentrationMgMl || pendingCalculation.concentrationMgMl,
        route: prod.defaultRoute,
        frequency: prod.defaultFrequency,
        waitingFor: null,
      };
      setPendingCalculation(updated);

      const userSelMsg: ChatMessage = {
        id: 'usr-sel-' + Date.now(),
        role: 'user',
        content: `Selecionado: ${prod.brandName}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userSelMsg]);

      // Continua o fluxo
      setTimeout(() => {
        if (!updated.species) {
          const askSpeciesMsg: ChatMessage = {
            id: 'ask-sp-' + Date.now(),
            role: 'assistant',
            content: `Ótimo! Para calcular **${prod.brandName}**, qual é a **espécie do paciente**?`,
            quickOptions: [
              { id: 'sp-dog', label: '🐶 Cão (Canino)', payload: { action: 'set_species', species: 'Canino' } },
              { id: 'sp-cat', label: '🐱 Gato (Felino)', payload: { action: 'set_species', species: 'Felino' } },
            ],
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, askSpeciesMsg]);
        } else if (!updated.weightKg) {
          const askWeightMsg: ChatMessage = {
            id: 'ask-wt-' + Date.now(),
            role: 'assistant',
            content: `Qual é o peso do paciente em kg? *(ex: 4 kg)*`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, askWeightMsg]);
        } else {
          // Se já tem espécie e peso, calcula ou pede dose
          processUserMessage('');
        }
      }, 300);
    } else if (payload.action === 'set_species') {
      const updated: PendingCalculationState = {
        ...pendingCalculation,
        species: payload.species,
        waitingFor: null,
      };
      setPendingCalculation(updated);

      const userSelMsg: ChatMessage = {
        id: 'usr-sp-' + Date.now(),
        role: 'user',
        content: `Espécie: ${payload.species}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userSelMsg]);

      setTimeout(() => {
        if (!updated.weightKg) {
          const askWeightMsg: ChatMessage = {
            id: 'ask-wt-' + Date.now(),
            role: 'assistant',
            content: `Qual é o **peso corporal do animal em kg**?`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, askWeightMsg]);
        } else {
          processUserMessage('');
        }
      }, 300);
    } else if (payload.action === 'set_protocol') {
      const proto: DosageProtocol = payload.protocol;
      const isDog = pendingCalculation.species === 'Canino';
      const dose = isDog ? proto.doseMgKg.canino : proto.doseMgKg.felino;

      const updated: PendingCalculationState = {
        ...pendingCalculation,
        doseMgKg: dose ?? null,
        protocolLabel: proto.label,
        bulaRuleText: proto.bulaRuleText,
        waitingFor: null,
      };
      setPendingCalculation(updated);

      const userSelMsg: ChatMessage = {
        id: 'usr-proto-' + Date.now(),
        role: 'user',
        content: `Protocolo confirmado: ${proto.label} (${dose} mg/kg)`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userSelMsg]);

      setTimeout(() => {
        executeCalculation(updated);
      }, 300);
    } else if (payload.action === 'set_dose') {
      const updated: PendingCalculationState = {
        ...pendingCalculation,
        doseMgKg: payload.dose,
        waitingFor: null,
      };
      setPendingCalculation(updated);

      const userSelMsg: ChatMessage = {
        id: 'usr-dose-' + Date.now(),
        role: 'user',
        content: `Dose confirmada: ${payload.dose} mg/kg`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userSelMsg]);

      setTimeout(() => {
        executeCalculation(updated);
      }, 300);
    } else if (payload.action === 'confirm_external') {
      const ext = payload.data;
      const updated: PendingCalculationState = {
        ...pendingCalculation,
        externalDrug: ext,
        concentrationMgMl: ext.concentrationMgMl,
        route: ext.defaultRoute,
        frequency: ext.defaultFrequency,
        waitingFor: null,
      };
      setPendingCalculation(updated);

      const userSelMsg: ChatMessage = {
        id: 'usr-conf-' + Date.now(),
        role: 'user',
        content: `Confirmado: ${ext.brandName} (${ext.concentrationText})`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userSelMsg]);

      setTimeout(() => {
        if (!updated.species) {
          const askSp: ChatMessage = {
            id: 'ask-sp-' + Date.now(),
            role: 'assistant',
            content: `Qual é a espécie do paciente?`,
            quickOptions: [
              { id: 'sp-dog', label: '🐶 Cão (Canino)', payload: { action: 'set_species', species: 'Canino' } },
              { id: 'sp-cat', label: '🐱 Gato (Felino)', payload: { action: 'set_species', species: 'Felino' } },
            ],
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, askSp]);
        } else if (!updated.weightKg) {
          const askWt: ChatMessage = {
            id: 'ask-wt-' + Date.now(),
            role: 'assistant',
            content: `Qual é o peso do animal em kg?`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, askWt]);
        } else {
          processUserMessage('');
        }
      }, 300);
    } else if (payload.action === 'suggest_drug') {
      const ext = payload.data;
      try {
        const stored = JSON.parse(localStorage.getItem('vetcalc_suggested_drugs') || '[]');
        stored.push({ ...ext, suggestedAt: new Date().toISOString() });
        localStorage.setItem('vetcalc_suggested_drugs', JSON.stringify(stored));
        showToast(`Medicamento "${ext.brandName}" sugerido com sucesso para a biblioteca técnica!`);
      } catch (e) {
        showToast('Sugestão registrada.');
      }
    } else if (payload.action === 'draft_evolution') {
      const patient = payload.patient;
      const latestCons = patient.consultations?.[0];
      const draftText = `Paciente ${patient.name} (${patient.species}, ${patient.weight} kg). ` +
        `Evolução clínica assistida por IA em ${new Date().toLocaleDateString('pt-BR')}: ` +
        (latestCons?.tentativeDiagnosis ? `Quadro clínico sob acompanhamento para ${latestCons.tentativeDiagnosis}. ` : '') +
        `Paciente clinicamente estável, sob monitoramento dos parâmetros vitais e resposta à conduta terapêutica prescrita.`;

      setEvolutionPreview({
        patientId: patient.id,
        patientName: patient.name,
        text: draftText,
      });
      showToast('Prévia de evolução gerada para sua revisão.');
    } else if (payload.action === 'prep_calc') {
      const patient = payload.patient;
      setPendingCalculation({
        drug: null,
        species: patient.species,
        weightKg: patient.weight,
        doseMgKg: null,
        totalDoseMg: null,
        concentrationMgMl: null,
        waitingFor: null,
      });
      const promptDrugMsg: ChatMessage = {
        id: 'prep-drug-' + Date.now(),
        role: 'assistant',
        content: `Paciente **${patient.name}** (${patient.species}, ${patient.weight} kg) pronto para cálculo posológico.\n\nQual medicamento você deseja calcular? *(ex: Cerenia 10 mg/mL, Meloxicam, Dipirona, Ondansetrona)*`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, promptDrugMsg]);
    } else if (payload.action === 'open_patient') {
      setSelectedPatientId(payload.patientId);
      setCurrentView('patients');
    }
  };

  const handleConfirmEvolution = async () => {
    if (!evolutionPreview) return;
    setIsSavingEvolution(true);
    try {
      await addClinicalEvolutionToPatient(
        evolutionPreview.patientId,
        evolutionPreview.text,
        'ai_assistant'
      );
      showToast('Evolução clínica gravada com sucesso no prontuário!');
      const confirmedMsg: ChatMessage = {
        id: 'evo-saved-' + Date.now(),
        role: 'assistant',
        content: `✅ **Evolução Clínica Gravada no Prontuário de ${evolutionPreview.patientName}:**\n\n> "${evolutionPreview.text}"\n\nRegistro salvo com sucesso no banco de dados com auditoria e controle de acesso.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, confirmedMsg]);
      setEvolutionPreview(null);
    } catch (err: any) {
      showToast(`Erro ao salvar evolução: ${err.message}`);
    } finally {
      setIsSavingEvolution(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt.trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputPrompt('');

    await processUserMessage(textToSend);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Resultado copiado com sucesso.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const saveResultToHistory = (res: SmartCalculationResult) => {
    addCalculationToHistory({
      type: 'dosage',
      title: `${res.drugName} (${res.species} ${res.weightKg} kg)`,
      inputs: {
        medicamento: res.drugName,
        laboratorio: res.laboratory,
        especie: res.species,
        peso_kg: res.weightKg,
        dose_mg_kg: res.doseMgKg,
        dose_total_mg: res.totalDoseMg,
        concentracao: res.concentrationMgMl,
        volume_calculado: res.volumeDisplayFull,
      },
      resultSummary: `${res.volumeDisplayFull} por aplicação (${res.totalDoseMg.toFixed(2)} mg)`,
      steps: res.steps,
    });
    showToast('Cálculo salvo no histórico clínico com sucesso!');
  };

  const handleSuggestDrugForLibrary = (res: SmartCalculationResult) => {
    try {
      const stored = JSON.parse(localStorage.getItem('vetcalc_suggested_drugs') || '[]');
      stored.push({
        brandName: res.drugName,
        activePrinciple: res.activePrinciple,
        laboratory: res.laboratory,
        concentrationMgMl: res.concentrationMgMl,
        source: res.source,
        suggestedAt: new Date().toISOString(),
      });
      localStorage.setItem('vetcalc_suggested_drugs', JSON.stringify(stored));
      showToast(`Medicamento "${res.drugName}" sugerido para inclusão na biblioteca!`);
    } catch {
      showToast('Sugestão registrada.');
    }
  };

  const promptSuggestions = [
    'Agemoxi, cachorro, 12 kg',
    'Biodex, gato, 3,5 kg',
    'Omeprazol injetável, cão, 10 kg, dose de 1 mg/kg',
    'Emedron 1%, gata, 2,8 kg, dose total de 1,4 mg',
    'Flamavet 0,2%, gato, 4 kg',
    'Trissulfin, cão, 10 kg',
    'Diferenciais para vômito agudo em filhote',
  ];

  const formatMessageContent = (content: string) => {
    if (!content) return '';
    return content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[#14243A] dark:text-white">$1</strong>')
      .replace(/\*/g, '');
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-[#DCE7F2] dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00C896] to-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/15 shrink-0">
              <Bot className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#14243A] dark:text-white tracking-tight flex items-center space-x-2">
                <span>Assistente IA com Calculadora Inteligente</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#E5FFF4] text-[#007F62] border border-[#B8E8D9] dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-transparent font-extrabold uppercase">
                  VET SMART PRO
                </span>
              </h1>
              <p className="text-xs text-[#52677F] dark:text-slate-400 mt-0.5">
                Digite frases naturais como <em>"Agemoxi, cachorro, 12 kg"</em> para calcular doses e volumes sem formulários.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Deseja reiniciar a conversa do assistente?')) {
              setMessages(messages.slice(0, 1));
              setPendingCalculation({
                drug: null,
                species: null,
                weightKg: null,
                doseMgKg: null,
                totalDoseMg: null,
                concentrationMgMl: null,
                waitingFor: null,
              });
            }
          }}
          className="p-2.5 text-[#52677F] hover:text-[#14243A] dark:text-slate-400 dark:hover:text-slate-200 rounded-xl bg-[#F1F6FC] hover:bg-[#E8F0F8] dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#DCE7F2] dark:border-slate-700 transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-semibold"
          title="Nova Conversa"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Conversa</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-3xl border border-[#DCE7F2] dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[640px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm bg-[#FFFFFF] dark:bg-slate-900">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-[#E8F1FA] text-[#14243A] border border-[#DCE5EF] dark:bg-slate-700 dark:text-slate-200 dark:border-transparent font-bold'
                      : 'bg-[#E5FFF4] text-[#007F62] border border-[#00C896] dark:bg-gradient-to-tr dark:from-emerald-600 dark:to-teal-500 dark:text-slate-950 dark:border-transparent font-bold'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[90%] rounded-2xl p-4 space-y-3 ${
                    isUser
                      ? 'bg-[#F1F6FC] text-[#14243A] border border-[#DCE5EF] rounded-tr-none shadow-xs dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
                      : 'bg-[#FFFFFF] text-[#14243A] border border-[#DCE5EF] rounded-tl-none shadow-xs dark:bg-slate-800/90 dark:text-slate-100 dark:border-slate-700/60'
                  }`}
                >
                  {/* Text content */}
                  {msg.content && (
                    <div
                      className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-sans space-y-1.5"
                      dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }}
                    />
                  )}

                  {/* SMART CALCULATION RESULT CARD */}
                  {msg.calcResult && (
                    <div className="mt-3 p-4 rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 border-2 border-[#00C896] dark:border-emerald-500/50 shadow-sm space-y-3.5 text-[#14243A] dark:text-white">
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between border-b border-[#DCE7F2] dark:border-slate-800 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <Calculator className="w-4 h-4 text-[#007F62] dark:text-emerald-400" />
                          <span className="font-extrabold text-xs uppercase tracking-wider text-[#007F62] dark:text-emerald-400 font-mono">
                            Cálculo Clínico Confirmado
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E5FFF4] text-[#007F62] border border-[#B8E8D9] dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-transparent font-bold">
                          {msg.calcResult.species} ({msg.calcResult.weightKg} kg)
                        </span>
                      </div>

                      {/* BIG HIGHLIGHT VOLUME DISPLAY */}
                      <div className="p-3.5 rounded-xl bg-[#E5FFF4] dark:bg-emerald-950/60 border border-[#00C896] dark:border-emerald-400/40 text-center">
                        <span className="text-[11px] font-bold text-[#52677F] dark:text-slate-400 block uppercase tracking-wider mb-0.5">
                          Volume a Aplicar
                        </span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#007F62] dark:text-emerald-400 font-mono tracking-tight">
                          {msg.calcResult.volumeDisplayFull}
                        </span>
                        <span className="text-xs text-[#14243A] dark:text-slate-300 block mt-1 font-medium">
                          Equivalente a <strong>{msg.calcResult.totalDoseMg.toFixed(2)} mg</strong> ({msg.calcResult.doseMgKg.toFixed(2)} mg/kg)
                        </span>
                      </div>

                      {/* Clinical Parameters Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#F5F9FD] dark:bg-slate-800/60 border border-[#DCE7F2] dark:border-slate-800">
                          <span className="text-[10px] text-[#52677F] dark:text-slate-400 block uppercase font-bold">Medicamento & Princípio</span>
                          <span className="font-bold text-[#14243A] dark:text-white">
                            {msg.calcResult.drugName}
                          </span>
                          <span className="text-[11px] text-[#52677F] dark:text-slate-400 block">
                            {msg.calcResult.activePrinciple}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#F5F9FD] dark:bg-slate-800/60 border border-[#DCE7F2] dark:border-slate-800">
                          <span className="text-[10px] text-[#52677F] dark:text-slate-400 block uppercase font-bold">Laboratório Fabricante</span>
                          <span className="font-bold text-[#14243A] dark:text-white flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5 text-[#52677F] dark:text-slate-400" />
                            <span>{msg.calcResult.laboratory}</span>
                          </span>
                          <span className="text-[11px] text-[#52677F] dark:text-slate-400 block">
                            Concentração: <strong>{msg.calcResult.concentrationMgMl} mg/mL</strong>
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#F5F9FD] dark:bg-slate-800/60 border border-[#DCE7F2] dark:border-slate-800">
                          <span className="text-[10px] text-[#52677F] dark:text-slate-400 block uppercase font-bold">Dose Prescrita</span>
                          <span className="font-bold text-[#14243A] dark:text-white">
                            {msg.calcResult.doseMgKg.toFixed(2)} mg/kg
                          </span>
                          <span className="text-[11px] text-[#52677F] dark:text-slate-400 block">
                            Dose total no paciente: {msg.calcResult.totalDoseMg.toFixed(2)} mg
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#F5F9FD] dark:bg-slate-800/60 border border-[#DCE7F2] dark:border-slate-800">
                          <span className="text-[10px] text-[#52677F] dark:text-slate-400 block uppercase font-bold">Via e Frequência</span>
                          <span className="font-bold text-[#14243A] dark:text-white">
                            {msg.calcResult.route}
                          </span>
                          <span className="text-[11px] text-[#52677F] dark:text-slate-400 block">
                            {msg.calcResult.frequency}
                          </span>
                        </div>
                      </div>

                      {/* Step-by-Step Mathematical Memory */}
                      <div className="p-3 rounded-xl bg-[#F5F9FD] dark:bg-slate-800/40 border border-[#DCE7F2] dark:border-slate-800 space-y-2">
                        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#14243A] dark:text-slate-300 uppercase tracking-wider">
                          <BookOpen className="w-3.5 h-3.5 text-[#007F62] dark:text-emerald-500" />
                          <span>Memória de Cálculo Determinística</span>
                        </div>

                        <div className="space-y-1.5 text-xs font-mono">
                          {msg.calcResult.steps.map((st: any, idx: number) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-[#52677F] dark:text-slate-300 text-[11px] border-b border-[#DCE7F2]/60 dark:border-slate-800/40 pb-1">
                              <span className="text-[#52677F] dark:text-slate-400">{st.label}: {st.expression}</span>
                              <span className="font-bold text-[#007F62] dark:text-emerald-400">= {st.result}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Syringe Recommendation */}
                      <div className="p-2.5 rounded-xl bg-[#E5FFF4] dark:bg-emerald-950/30 border border-[#00C896] dark:border-emerald-300/40 text-xs text-[#14243A] dark:text-emerald-200 flex items-start space-x-2">
                        <Syringe className="w-4 h-4 text-[#007F62] dark:text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[11px] uppercase tracking-wider text-[#007F62] dark:text-emerald-300 font-mono">
                            Recomendação de Seringa & Graduação:
                          </strong>
                          <span>{msg.calcResult.syringeRecommendation}</span>
                        </div>
                      </div>

                      {/* Source Reference */}
                      <div className="flex items-center justify-between text-[10px] text-[#52677F] dark:text-slate-400 pt-1 border-t border-[#DCE7F2] dark:border-slate-800">
                        <span>Fonte: <strong>{msg.calcResult.source}</strong> {msg.calcResult.searchDate ? `(${msg.calcResult.searchDate})` : ''}</span>
                        {msg.calcResult.isExternal && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                            Pesquisa Externa
                          </span>
                        )}
                      </div>

                      {/* INTERACTIVE ACTIONS INSIDE THE RESULT CARD */}
                      <div className="pt-2 flex flex-wrap gap-2 border-t border-[#DCE7F2] dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            const summaryText = `CÁLCULO VET CALC PRO:\nMedicamento: ${msg.calcResult.drugName} (${msg.calcResult.activePrinciple})\nLaboratório: ${msg.calcResult.laboratory}\nEspécie: ${msg.calcResult.species} (${msg.calcResult.weightKg} kg)\nDose: ${msg.calcResult.doseMgKg.toFixed(2)} mg/kg (${msg.calcResult.totalDoseMg.toFixed(2)} mg)\nConcentração: ${msg.calcResult.concentrationMgMl} mg/mL\nVolume a Aplicar: ${msg.calcResult.volumeDisplayFull}\nSeringa: ${msg.calcResult.syringeRecommendation}\nFonte: ${msg.calcResult.source}`;
                            copyToClipboard(summaryText, msg.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#00C896] hover:bg-[#00B083] text-[#062C23] text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Resultado</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => saveResultToHistory(msg.calcResult)}
                          className="px-3 py-1.5 rounded-xl bg-[#F1F6FC] hover:bg-[#E8F0F8] border border-[#DCE7F2] dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-transparent text-[#14243A] dark:text-slate-200 text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5 text-[#007F62] dark:text-emerald-400" />
                          <span>Salvar no Histórico</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedResultDetails(msg.calcResult)}
                          className="px-3 py-1.5 rounded-xl border border-[#DCE7F2] bg-[#FFFFFF] hover:bg-[#F1F6FC] dark:border-slate-700 dark:bg-transparent dark:hover:bg-slate-800 text-[#52677F] hover:text-[#14243A] dark:text-slate-300 text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Visualizar Fonte</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSuggestDrugForLibrary(msg.calcResult)}
                          className="px-3 py-1.5 rounded-xl border border-[#DCE7F2] bg-[#FFFFFF] hover:bg-[#F1F6FC] dark:border-slate-700 dark:bg-transparent dark:hover:bg-slate-800 text-[#52677F] hover:text-[#14243A] dark:text-slate-300 text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Sugerir para Biblioteca</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPendingCalculation({
                              drug: null,
                              species: null,
                              weightKg: null,
                              doseMgKg: null,
                              totalDoseMg: null,
                              concentrationMgMl: null,
                              waitingFor: null,
                            });
                            setInputPrompt('');
                            showToast('Pronto para novo cálculo! Digite o medicamento, espécie e peso.');
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#00C896] text-[#007F62] bg-[#E5FFF4] hover:bg-[#D5FCEB] dark:border-dashed dark:border-emerald-400 dark:text-emerald-400 dark:bg-transparent dark:hover:bg-emerald-950/40 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ml-auto"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Novo Cálculo</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive Quick Option Buttons (Apresentações, Espécies, Protocolos) */}
                  {msg.quickOptions && msg.quickOptions.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold text-[#52677F] dark:text-slate-400 uppercase tracking-wider block">
                        Selecione para confirmar:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {msg.quickOptions.map((opt: ChatQuickOption) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleOptionClick(opt)}
                            className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-slate-900 border border-[#DCE7F2] dark:border-slate-700 hover:border-[#00C896] dark:hover:border-emerald-500 hover:bg-[#E5FFF4]/50 dark:hover:bg-emerald-950/30 text-left transition-all flex items-center justify-between cursor-pointer group shadow-xs"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-[#14243A] dark:text-slate-100 text-xs group-hover:text-[#007F62] dark:group-hover:text-emerald-400">
                                  {opt.label}
                                </span>
                                {opt.badge && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E8F0F8] dark:bg-slate-800 text-[#52677F] dark:text-slate-300 font-mono font-semibold">
                                    {opt.badge}
                                  </span>
                                )}
                              </div>
                              {opt.sublabel && (
                                <p className="text-[11px] text-[#52677F] dark:text-slate-400 mt-0.5">
                                  {opt.sublabel}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#52677F]/60 group-hover:text-[#007F62] dark:group-hover:text-emerald-500 shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isUser && !msg.calcResult && (
                    <div className="flex items-center justify-between pt-2 border-t border-[#DCE7F2] dark:border-slate-700/50 text-[10px] text-[#52677F] dark:text-slate-400">
                      <span className="font-mono">VET CALC PRO ASSISTANT</span>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-[#14243A] dark:hover:text-slate-200 flex items-center space-x-1 cursor-pointer font-medium"
                        title="Copiar texto"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#007F62] dark:text-emerald-500" />
                            <span className="text-[#007F62] dark:text-emerald-400 font-bold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-[#E5FFF4] text-[#007F62] border border-[#00C896] dark:bg-emerald-500 dark:text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-[#F5F9FD] dark:bg-slate-800 border border-[#DCE7F2] dark:border-slate-700 text-xs text-[#52677F] dark:text-slate-300 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse delay-150" />
                <span className="font-medium text-[#14243A] dark:text-slate-200">Consultando referências médico-veterinárias e calculando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="p-2.5 bg-[#F5F9FD] dark:bg-slate-900 border-t border-[#DCE7F2] dark:border-slate-800 overflow-x-auto scrollbar-none flex items-center space-x-2">
          <span className="text-[10px] font-bold text-[#52677F] dark:text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1">
            Exemplos rápidos:
          </span>
          {promptSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              disabled={loading}
              className="text-[11px] px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#E5FFF4] border border-[#DCE7F2] hover:border-[#00C896] text-[#14243A] hover:text-[#007F62] dark:bg-slate-800 dark:hover:bg-emerald-950/60 dark:border-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50 font-medium shadow-xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#DCE7F2] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 flex items-center space-x-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Digite o medicamento, a espécie e o peso do animal..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-[#DCE7F2] dark:border-slate-700 bg-[#F1F6FC] dark:bg-slate-800 text-[#0F172A] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-slate-400 text-xs sm:text-sm focus:border-[#00C896] dark:focus:border-emerald-500 focus:outline-none disabled:opacity-50 font-medium transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputPrompt.trim()}
            className="px-5 py-3 rounded-xl bg-[#00C896] hover:bg-[#00B083] text-[#062C23] font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Calcular / Enviar</span>
          </button>
        </div>
      </div>

      {/* Medical Responsibility Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-[#F5F9FD] dark:bg-slate-800/80 border border-[#DCE7F2] dark:border-slate-700/60 text-xs text-[#52677F] dark:text-slate-400 flex items-start space-x-2.5">
        <ShieldCheck className="w-4 h-4 text-[#007F62] dark:text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <strong className="text-[#14243A] dark:text-slate-200">Segurança Médico-Veterinária Obrigatória:</strong> Todas as fórmulas são executadas por funções matemáticas programadas e determinísticas, sem dependência de palpites gerados por inteligência artificial. Os dados farmacológicos são oriundos de compêndios oficiais e bulas dos fabricantes. A conferência clínica e a prescrição final são de exclusiva responsabilidade do médico-veterinário responsável com registro no CRMV.
        </div>
      </div>

      {/* Modal / Popover de Detalhes da Fonte */}
      {selectedResultDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FFFFFF] dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-[#DCE7F2] dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE7F2] dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-[#007F62] dark:text-emerald-500" />
                <h3 className="font-bold text-base text-[#14243A] dark:text-white">
                  Detalhes Farmacológicos da Fonte
                </h3>
              </div>
              <button
                onClick={() => setSelectedResultDetails(null)}
                className="text-[#52677F] hover:text-[#14243A] dark:text-slate-400 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#52677F] dark:text-slate-300">
              <p>
                <strong className="text-[#14243A] dark:text-white">Medicamento:</strong> {selectedResultDetails.drugName}
              </p>
              <p>
                <strong className="text-[#14243A] dark:text-white">Princípio Ativo:</strong> {selectedResultDetails.activePrinciple}
              </p>
              <p>
                <strong className="text-[#14243A] dark:text-white">Laboratório Fabricante:</strong> {selectedResultDetails.laboratory}
              </p>
              <p>
                <strong className="text-[#14243A] dark:text-white">Concentração Oficial:</strong> {selectedResultDetails.concentrationMgMl} mg/mL
              </p>
              <p>
                <strong className="text-[#14243A] dark:text-white">Fonte Documental:</strong> {selectedResultDetails.source}
              </p>
              {selectedResultDetails.bulaRuleText && (
                <div className="p-3 rounded-xl bg-[#E5FFF4] dark:bg-emerald-950/40 border border-[#00C896]/50 dark:border-emerald-300/40 text-[#14243A] dark:text-emerald-200">
                  <strong className="text-[#007F62] dark:text-emerald-300">Regra da Bula Oficial:</strong>
                  <p className="mt-0.5">{selectedResultDetails.bulaRuleText}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedResultDetails(null)}
                className="px-4 py-2 rounded-xl bg-[#F1F6FC] hover:bg-[#E8F0F8] border border-[#DCE7F2] dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-transparent text-[#14243A] dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review & Confirmation Modal for AI Clinical Evolution (Requirement 7) */}
      {evolutionPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-teal-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Revisão de Evolução Clínica — {evolutionPreview.patientName}
                </h3>
              </div>
              <button
                onClick={() => setEvolutionPreview(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Revise o texto gerado pela Assistente IA antes de confirmar a gravação permanente no prontuário do paciente:
            </p>

            <div>
              <textarea
                rows={5}
                value={evolutionPreview.text}
                onChange={(e) => setEvolutionPreview({ ...evolutionPreview, text: e.target.value })}
                className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEvolutionPreview(null)}
                disabled={isSavingEvolution}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Descartar
              </button>
              <button
                type="button"
                onClick={handleConfirmEvolution}
                disabled={isSavingEvolution || !evolutionPreview.text.trim()}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 text-xs font-bold shadow transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                {isSavingEvolution && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSavingEvolution ? 'Gravando no Prontuário...' : 'Confirmar e Gravar no Prontuário'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
