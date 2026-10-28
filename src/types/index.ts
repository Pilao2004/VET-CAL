export type ActiveView =
  | 'home'
  | 'calculators'
  | 'drugs'
  | 'symptoms'
  | 'labs'
  | 'patients'
  | 'assistant'
  | 'subscription'
  | 'bonus'
  | 'profile'
  | 'support';

export type CalculatorType =
  | 'dosage'
  | 'mg-to-ml'
  | 'dilution'
  | 'fluidotherapy'
  | 'cri'
  | 'transfusion'
  | 'hydration-deficit'
  | 'infusion-rate'
  | 'percentage-conversion'
  | 'rule-of-three'
  | 'unit-conversion'
  | 'bsa';

export interface CalculationStep {
  label: string;
  expression: string;
  result: string;
}

export interface CalculationHistoryItem {
  id: string;
  type: CalculatorType;
  title: string;
  timestamp: string;
  inputs: Record<string, string | number>;
  resultSummary: string;
  steps: CalculationStep[];
}

export type VeterinarySpecies =
  | 'Canino'
  | 'Felino'
  | 'Bovino'
  | 'Equino'
  | 'Ovino'
  | 'Caprino'
  | 'Suíno'
  | 'Bubalino'
  | 'Coelho'
  | 'Aves'
  | 'Répteis'
  | 'Pequenos Mamíferos'
  | 'Animais Silvestres e Exóticos'
  | 'Outros Animais';

export interface DrugCommercialPresentation {
  type: 'liquid' | 'tablet' | 'drops';
  name: string;
  concentrationMgMl?: number;
  tabletMg?: number;
  percentage?: number;
  bottleVolumeMl?: number;
  tabletsPerBox?: number;
}

export interface DrugItem {
  id: string;
  activePrinciple: string;
  brandNames: string[];
  category: string;
  species: (VeterinarySpecies | string)[];
  presentations: string[];
  commercialPresentations?: DrugCommercialPresentation[];
  standardConcentrations: { label: string; valueMgMl: number }[];
  clinicalIndications: string[];
  referenceDosages: {
    species: string;
    indication: string;
    doseRange: string;
    route: string;
    frequency: 'SID' | 'BID' | 'TID' | 'QID' | 'Dose Única' | string;
    suggestedMgKg?: number;
    suggestedMgMl?: number;
    notes?: string;
  }[];
  routes: string[];
  contraindications: string[];
  interactions: string[];
  precautions: string[];
  scientificReferences: string[];
  lastReviewDate: string;
  validationStatus?: 'VALIDADO' | 'PENDENTE DE VALIDAÇÃO' | 'DIVERGÊNCIA IDENTIFICADA';
  isFavorite?: boolean;
}

export interface SymptomDifferential {
  name: string;
  category: 'Comum' | 'Moderado' | 'Grave' | 'Emergencial';
  likelihood: 'Alta' | 'Média' | 'Considerar';
  description: string;
  recommendedExams: string[];
}

export interface SymptomInfo {
  id: string;
  name: string;
  species: VeterinarySpecies[];
  category: string;
  iconName: string;
  description: string;
  anamnesisQuestions: string[];
  differentials: SymptomDifferential[];
  recommendedExams: {
    name: string;
    justification: string;
  }[];
  redFlags: string[];
  clinicalTips: string[];
}

export interface LabParameter {
  id: string;
  name: string;
  category: 'Hemograma' | 'Bioquímica' | 'Urinálise' | 'Hormonais' | 'Parasitologia';
  unit: string;
  referenceDog: { min: number; max: number; text?: string };
  referenceCat: { min: number; max: number; text?: string };
  lowMeaning: string;
  highMeaning: string;
  clinicalSignificance: string;
}

export interface PhysicalExam {
  temperature?: number; // °C
  heartRate?: number; // bpm
  respiratoryRate?: number; // mpm
  crt?: string; // TPC s
  mucousMembranes?: string; // Rosa, Pálida, Ictérica, Cianótica, Congesta
  hydrationPercent?: number; // %
  bodyConditionScore?: number; // 1-9
  lymphNodes?: string; // Normais, Aumentados
  abdominalPalpation?: string;
}

export interface ClinicalConsultation {
  id: string;
  date: string;
  weight: number;
  consultationCode?: string; // New field
  chiefComplaint: string;
  reportedSymptoms: string[];
  physicalExam: PhysicalExam;
  tentativeDiagnosis: string;
  requestedExams: string[];
  prescriptions: string[];
  clinicalEvolution: string;
}

export interface ClinicalEvolutionEntry {
  id: string;
  patientId: string;
  evolutionText: string;
  source: 'ai_assistant' | 'manual';
  createdAt: string;
}

export interface PatientRecord {
  id: string;
  publicCode?: string;
  name: string;
  species: VeterinarySpecies | string;
  subSpecies?: string;
  breed: string;
  sex: 'Macho' | 'Fêmea';
  isNeutered: boolean;
  age: string;
  birthDate?: string;
  weight: number; // kg
  microchip?: string;
  tutorName: string;
  tutorPhone: string;
  tutorEmail?: string;
  allergies?: string;
  createdAt: string;
  consultations: ClinicalConsultation[];
  evolutions?: ClinicalEvolutionEntry[];
}

export interface SubscriptionInfo {
  tier: 'free' | 'premium';
  isActive: boolean;
  licenseKey?: string;
  expiresAt?: string;
}

export interface ChatQuickOption {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  payload?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  calcResult?: any;
  quickOptions?: ChatQuickOption[];
  isSearchingExternal?: boolean;
  aiProvider?: string; // IA que escreveu a resposta (Claude, Gemini, Groq)
  timestamp: string;
}

