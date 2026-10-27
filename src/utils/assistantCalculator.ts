import { COMMERCIAL_PRODUCTS, CommercialProduct } from '../data/commercialProducts';
import { calculateDeterministicDosage, formatClinicalVolume } from './calculatorEngine';

export { formatClinicalVolume };

export interface SmartCalculationResult {
  drugName: string;
  activePrinciple: string;
  laboratory: string;
  species: 'Canino' | 'Felino' | string;
  weightKg: number;
  doseMgKg: number;
  totalDoseMg: number;
  concentrationMgMl: number;
  route: string;
  frequency: string;
  volumeDisplayShort: string;
  volumeDisplayFull: string;
  syringeRecommendation: string;
  steps: { label: string; expression: string; result: string }[];
  safetyWarnings: string[];
  bulaRuleText?: string;
  source: string;
  searchDate?: string;
  isExternal: boolean;
}

export interface ParsedQuery {
  species: 'Canino' | 'Felino' | string | null;
  weightKg: number | null;
  doseMgKg: number | null;
  totalDoseMg: number | null;
  concentrationMgMl: number | null;
  matchedProduct: CommercialProduct | null;
  candidateProducts: CommercialProduct[];
  drugMention: string | null;
  isCalculationIntent: boolean;
}

export function parseVeterinaryQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase();

  let species: string | null = null;
  if (/cão|cachorro|canino|dog|cadela|macho/i.test(lower)) {
    // If query mentions dog indicators
    if (!/gato|felino|cat|gata/i.test(lower)) {
      species = 'Canino';
    }
  }
  if (/gato|felino|cat|gata/i.test(lower)) {
    species = 'Felino';
  } else if (/bovino|boi|vaca|bezerro/i.test(lower)) {
    species = 'Bovino';
  } else if (/equino|cavalo|égua|potro/i.test(lower)) {
    species = 'Equino';
  } else if (/ovino|ovelha|carneiro/i.test(lower)) {
    species = 'Ovino';
  } else if (/caprino|cabra|bode/i.test(lower)) {
    species = 'Caprino';
  }

  // Weight extraction (e.g. "10 kg", "10kg", "10 quilos", "pesando 10", "de 10 kg")
  let weightKg: number | null = null;
  const weightMatch = query.match(/(\d+([.,]\d+)?)\s*(kg|quilos?|quilo|kilos?)/i);
  if (weightMatch) {
    weightMatch[1] = weightMatch[1].replace(',', '.');
    weightKg = parseFloat(weightMatch[1]);
  } else {
    const looseWeightMatch = query.match(/(?:peso|pesando|de)\s+(\d+([.,]\d+)?)/i);
    if (looseWeightMatch) {
      looseWeightMatch[1] = looseWeightMatch[1].replace(',', '.');
      weightKg = parseFloat(looseWeightMatch[1]);
    }
  }

  // Dose extraction (e.g. "0.5 mg/kg", "15 mg/kg")
  let doseMgKg: number | null = null;
  const doseMatch = query.match(/(\d+([.,]\d+)?)\s*mg\s*\/\s*kg/i);
  if (doseMatch) {
    doseMatch[1] = doseMatch[1].replace(',', '.');
    doseMgKg = parseFloat(doseMatch[1]);
  }

  // Total dose extraction (e.g. "150 mg")
  let totalDoseMg: number | null = null;
  const totalDoseMatch = query.match(/(\d+([.,]\d+)?)\s*mg(?!\s*\/\s*kg)/i);
  if (totalDoseMatch && !doseMatch) {
    totalDoseMatch[1] = totalDoseMatch[1].replace(',', '.');
    totalDoseMg = parseFloat(totalDoseMatch[1]);
  }

  // Concentration extraction (e.g. "5 mg/mL", "10 mg/mL", "0.2%")
  let concentrationMgMl: number | null = null;
  const concMatch = query.match(/(\d+([.,]\d+)?)\s*mg\s*\/\s*ml/i);
  if (concMatch) {
    concMatch[1] = concMatch[1].replace(',', '.');
    concentrationMgMl = parseFloat(concMatch[1]);
  } else {
    const percentMatch = query.match(/(\d+([.,]\d+)?)\s*%/i);
    if (percentMatch) {
      percentMatch[1] = percentMatch[1].replace(',', '.');
      concentrationMgMl = parseFloat(percentMatch[1]) * 10;
    }
  }

  // Product and active principle matching from COMMERCIAL_PRODUCTS
  let matchedProduct: CommercialProduct | null = null;
  const candidateProducts: CommercialProduct[] = [];
  let drugMention: string | null = null;

  const queryWords = lower.split(/[^a-z0-9à-ú]+/);
  // Primeira palavra da marca (ex.: "agemoxi" em "Agemoxi CL® 50 mg") reúne as apresentações da mesma família
  const brandFamily = (p: CommercialProduct) => p.brandName.toLowerCase().split(/[®(\s]/)[0];

  for (const prod of COMMERCIAL_PRODUCTS) {
    const brandLower = prod.brandName.toLowerCase();
    const activeLower = prod.activePrinciple.toLowerCase();
    const simpleBrand = brandLower.split(/[®(]/)[0].trim();
    const family = brandFamily(prod);
    if (
      lower.includes(simpleBrand) ||
      (family.length > 3 && queryWords.includes(family)) ||
      lower.includes(brandLower) ||
      lower.includes(activeLower) ||
      activeLower.split(/[\s+/]+/).some((word) => word.length > 3 && lower.includes(word))
    ) {
      if (!candidateProducts.some((p) => p.id === prod.id)) {
        candidateProducts.push(prod);
      }
      if (!drugMention) {
        drugMention = prod.brandName.split('(')[0].trim();
      }
    }
  }

  if (candidateProducts.length === 1) {
    matchedProduct = candidateProducts[0];
  } else if (candidateProducts.length > 1) {
    // Só escolhe sozinho quando o texto aponta para uma única apresentação
    const exact = candidateProducts.filter((p) =>
      lower.includes(p.brandName.toLowerCase().split(/[®(]/)[0].trim()) ||
      lower.includes(p.activePrinciple.toLowerCase())
    );
    if (exact.length === 1 && candidateProducts.filter((p) => brandFamily(p) === brandFamily(exact[0])).length === 1) {
      matchedProduct = exact[0];
    }
  }

  // Clinical questions detection (e.g. "diferenciais para...", "qual a causa...", "como tratar...")
  const isClinicalInquiry =
    /diferencia(?:is|l)|diagn[oó]stico|sintoma|causa|conduta|como tratar|tratamento|exame|fisiopatologia|progn[oó]stico|por que|o que [eé]|quais s[aã]o|orienta[cç][aã]o|abordagem|indica[cç][aã]o|mecanismo|ant[ií]doto/i.test(
      lower
    );

  const hasExplicitCalculationTerms =
    /dose|calcular|c[aá]lculo|volume|posologia|quantos?\s*ml|quanto\s*aplicar|mg\/kg|mg\/ml/i.test(lower);

  const isCalculationIntent =
    !isClinicalInquiry &&
    (Boolean(weightKg) ||
      Boolean(doseMgKg) ||
      Boolean(totalDoseMg) ||
      Boolean(matchedProduct) ||
      Boolean(concentrationMgMl) ||
      hasExplicitCalculationTerms);

  return {
    species,
    weightKg,
    doseMgKg,
    totalDoseMg,
    concentrationMgMl,
    matchedProduct,
    candidateProducts,
    drugMention:
      drugMention ||
      (candidateProducts.length === 0 && isCalculationIntent ? extractDrugMention(query) : null),
    isCalculationIntent,
  };
}

function extractDrugMention(query: string): string | null {
  const cleaned = query
    .replace(/(\d+([.,]\d+)?)\s*(kg|quilos?|mg|ml|%|g|gotas?)/gi, '')
    .replace(/dose|calcular|posologia|volume|aplicar|para|com|em|um|uma|cão|cachorro|canino|gato|felino/gi, '')
    .trim();
  const words = cleaned
    .split(/[\s,.;]+/)
    .filter((w) => w.length > 2 && !['tenho', 'preciso', 'quanto', 'seria', 'fêmea', 'macho'].includes(w.toLowerCase()));
  return words.length > 0 ? words.slice(0, 2).join(' ') : null;
}

export function calculateDeterministicDose(input: {
  drugName: string;
  activePrinciple: string;
  laboratory: string;
  species: string | null;
  weightKg: number | null;
  doseMgKg?: number;
  totalDoseMg?: number;
  concentrationMgMl: number | null;
  route: string;
  frequency: string;
  protocolLabel?: string;
  bulaRuleText?: string;
  source?: string;
  searchDate?: string;
  isExternal?: boolean;
}): SmartCalculationResult {
  const species = input.species || 'Canino';
  const weightKg = input.weightKg || 10;
  const concentrationMgMl = input.concentrationMgMl || 10;

  let doseMgKg = input.doseMgKg;
  if (!doseMgKg && input.totalDoseMg && weightKg > 0) {
    doseMgKg = input.totalDoseMg / weightKg;
  }
  if (!doseMgKg) {
    doseMgKg = 1.0;
  }

  const res = calculateDeterministicDosage({
    species,
    weightKg,
    doseMgKg,
    concentrationMgMl,
    drugName: input.drugName,
  });

  const volFmt = formatClinicalVolume(res.volumeMlPerTake);

  let syringe = 'Seringa de 1 mL (Insulina / Tuberculina) para máxima precisão.';
  if (res.volumeMlPerTake > 5 && res.volumeMlPerTake <= 20) {
    syringe = 'Seringa de 20 mL com bico Luer Lock.';
  } else if (res.volumeMlPerTake > 20) {
    syringe = 'Seringa de 60 mL ou equipo de gotejamento.';
  } else if (res.volumeMlPerTake > 1) {
    syringe = 'Seringa de 3 mL ou 5 mL.';
  }

  return {
    drugName: input.drugName,
    activePrinciple: input.activePrinciple,
    laboratory: input.laboratory,
    species,
    weightKg,
    doseMgKg,
    totalDoseMg: res.totalMgPerTake,
    concentrationMgMl,
    route: input.route,
    frequency: input.frequency,
    volumeDisplayShort: volFmt.short,
    volumeDisplayFull: volFmt.detailed,
    syringeRecommendation: syringe,
    steps: res.steps,
    safetyWarnings: res.safetyWarnings,
    bulaRuleText: input.bulaRuleText,
    source: input.source || 'Bula Oficial do Fabricante / Base Farmacológica VET CALC PRO',
    searchDate: input.searchDate,
    isExternal: Boolean(input.isExternal),
  };
}
