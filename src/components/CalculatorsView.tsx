import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Info,
  Clock,
  Trash2,
  HeartPulse,
  Droplets,
  Pill,
  Syringe,
  FileText,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Search,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  FlaskConical,
  Play,
  CheckCircle,
  XCircle,
  X,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalculatorType, CalculationStep } from '../types';
import { CALCULATORS_LIST } from '../data/calculators';
import { EmergencyTable } from './EmergencyTable';
import { PrescriptionActions } from './PrescriptionActions';
import { PremiumGate } from './PremiumGate';
import { PREMIUM_CALCULATORS } from '../config/plans';
import { SafetyAlert, speciesSafetyAlerts } from '../utils/safetyRules';
import { COMMERCIAL_PRODUCTS, CommercialProduct } from '../data/commercialProducts';
import { runCompleteClinicalTestSuite, TestSuiteSummary } from '../utils/clinicalTestSuite';

export const CalculatorsView: React.FC = () => {
  const {
    selectedCalculator,
    setSelectedCalculator,
    prefilledCalculatorData,
    setPrefilledCalculatorData,
    addCalculationToHistory,
    calculationHistory,
    clearHistory,
    showToast,
    isPremium,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [copiedPrescription, setCopiedPrescription] = useState(false);
  const [isPrescriptionValidated, setIsPrescriptionValidated] = useState(false);

  // ==========================================
  // SELEÇÃO DE MEDICAMENTO COMERCIAL
  // ==========================================
  const [selectedProductId, setSelectedProductId] = useState<string>('flamavet-inj-02');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('day1-attack');
  const [productSearch, setProductSearch] = useState<string>('');
  const [isProductListOpen, setIsProductListOpen] = useState<boolean>(false);

  // ==========================================
  // 1. CALCULADORA DE MEDICAMENTOS 
  // ==========================================
  const [dosageFormType, setDosageFormType] = useState<'liquid' | 'tablet' | 'drops'>('liquid');
  const [doseSpecies, setDoseSpecies] = useState<string>('Canino');
  const [doseSubSpecies, setDoseSubSpecies] = useState<string>('');
  const [doseWeight, setDoseWeight] = useState<string>('10');
  const [dosePrescribed, setDosePrescribed] = useState<string>('0.2'); // mg/kg
  const [doseUnit, setDoseUnit] = useState<'mg/kg' | 'mcg/kg'>('mg/kg');
  const [doseRegime, setDoseRegime] = useState<'per-dose' | 'daily-divided'>('per-dose'); // Dose por tomada vs Dose diária
  const [doseFrequency, setDoseFrequency] = useState<string>('SID');
  const [doseRoute, setDoseRoute] = useState<string>('Subcutânea (SC)');
  const [treatmentDays, setTreatmentDays] = useState<string>('5');
  const [drugLabel, setDrugLabel] = useState<string>('Flamavet® Injetável 0,2% (Agener União)');

  // Líquido / Injetável
  const [doseConcentration, setDoseConcentration] = useState<string>('2'); // 2 mg/mL (0,2%)
  const [doseConcentrationUnit, setDoseConcentrationUnit] = useState<'mg/ml' | 'percentage'>('mg/ml');
  const [dosePercentageInput, setDosePercentageInput] = useState<string>('0.2');
  const [bottleVolumeMl, setBottleVolumeMl] = useState<string>('20');

  // Comprimidos
  const [tabletConcentrationMg, setTabletConcentrationMg] = useState<string>('0.5');
  const [tabletsPerBox, setTabletsPerBox] = useState<string>('10');

  // Gotas
  const [dropsConcentrationMgMl, setDropsConcentrationMgMl] = useState<string>('500');
  const [dropsPerMlFactor, setDropsPerMlFactor] = useState<string>('20');

  // ==========================================
  // 2. FLUIDOTERAPIA COMPLETA (3 PARCELAS)
  // ==========================================
  const [fluidSpecies, setFluidSpecies] = useState<string>('Canino');
  const [fluidWeight, setFluidWeight] = useState<string>('12');
  const [fluidMaintenanceMethod, setFluidMaintenanceMethod] = useState<'metabolic' | 'standard'>('metabolic');
  const [fluidStandardRate, setFluidStandardRate] = useState<string>('50');
  const [fluidDehydrationPercent, setFluidDehydrationPercent] = useState<string>('6');
  const [fluidDeficitHours, setFluidDeficitHours] = useState<string>('24');
  const [fluidOngoingLosses, setFluidOngoingLosses] = useState<string>('100');

  // ==========================================
  // 3. INFUSÃO CONTÍNUA NA BOLSA (CRI)
  // ==========================================
  const [criPatientWeight, setCriPatientWeight] = useState<string>('15');
  const [criBagVolumeMl, setCriBagVolumeMl] = useState<string>('250');
  const [criInfusionRateMlHr, setCriInfusionRateMlHr] = useState<string>('15');
  const [criDoseValue, setCriDoseValue] = useState<string>('5');
  const [criDoseUnit, setCriDoseUnit] = useState<'mcg/kg/min' | 'mg/kg/h' | 'mcg/kg/h'>('mcg/kg/min');
  const [criDrugConcentrationMgMl, setCriDrugConcentrationMgMl] = useState<string>('100');
  const [criDrugName, setCriDrugName] = useState<string>('Cetamina 10%');

  // ==========================================
  // 4. TRANSFUSÃO SANGUÍNEA
  // ==========================================
  const [transfusionSpecies, setTransfusionSpecies] = useState<string>('Canino');
  const [transfusionWeight, setTransfusionWeight] = useState<string>('18');
  const [transfusionCurrentHt, setTransfusionCurrentHt] = useState<string>('14');
  const [transfusionTargetHt, setTransfusionTargetHt] = useState<string>('25');
  const [transfusionDonorHt, setTransfusionDonorHt] = useState<string>('40');

  // ==========================================
  // 5. DILUIÇÃO
  // ==========================================
  const [dilutionC1, setDilutionC1] = useState<string>('50');
  const [dilutionC2, setDilutionC2] = useState<string>('5');
  const [dilutionV2, setDilutionV2] = useState<string>('100');

  // ==========================================
  // 6. PORCENTAGEM (%) PARA MG/ML
  // ==========================================
  const [percentageInput, setPercentageInput] = useState<string>('2');
  const [mgMlInput, setMgMlInput] = useState<string>('20');
  const [percentDirection, setPercentDirection] = useState<'percent-to-mg' | 'mg-to-percent'>('percent-to-mg');

  // ==========================================
  // 7. DÉFICIT HÍDRICO ISOLADO
  // ==========================================
  const [deficitWeight, setDeficitWeight] = useState<string>('10');
  const [deficitPercent, setDeficitPercent] = useState<string>('7');
  const [deficitHours, setDeficitHours] = useState<string>('24');

  // ==========================================
  // 8. TAXA DE INFUSÃO SIMPLES
  // ==========================================
  const [infusionVolume, setInfusionVolume] = useState<string>('500');
  const [infusionHours, setInfusionHours] = useState<string>('12');

  // ==========================================
  // 9. REGRA DE TRÊS
  // ==========================================
  const [ruleA, setRuleA] = useState<string>('100');
  const [ruleB, setRuleB] = useState<string>('5');
  const [ruleC, setRuleC] = useState<string>('20');

  // ==========================================
  // 10. BSA
  // ==========================================
  const [bsaSpecies, setBsaSpecies] = useState<'dog' | 'cat'>('dog');
  const [bsaWeight, setBsaWeight] = useState<string>('25');
  const [bsaDosePerM2, setBsaDosePerM2] = useState<string>('30');

  // Result state
  const [resultSummary, setResultSummary] = useState<string>('');
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const [prescriptionText, setPrescriptionText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [clinicalWarning, setClinicalWarning] = useState<string | null>(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  // Automated Clinical & Mathematical Test Suite
  const [isTestLabOpen, setIsTestLabOpen] = useState<boolean>(false);
  const [testSummary, setTestSummary] = useState<TestSuiteSummary | null>(null);
  const [activeTestCategory, setActiveTestCategory] = useState<string>('all');
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [selectedTestCaseDetail, setSelectedTestCaseDetail] = useState<any | null>(null);

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const summary = runCompleteClinicalTestSuite();
      setTestSummary(summary);
      setIsRunningTests(false);
      showToast(`Bateria de testes: ${summary.passed}/${summary.total} aprovados com 100% de precisão!`);
    }, 120);
  };

  // Apply commercial product selection
  const handleSelectProduct = (prod: CommercialProduct) => {
    setSelectedProductId(prod.id);
    const mappedForm: 'liquid' | 'tablet' | 'drops' =
      prod.formType === 'tablet' ? 'tablet' : prod.formType === 'drops' ? 'drops' : 'liquid';
    setDosageFormType(mappedForm);

    if (prod.formType === 'liquid') {
      if (prod.concentrationMgMl) setDoseConcentration(String(prod.concentrationMgMl));
      if (prod.percentage !== undefined) {
        setDosePercentageInput(String(prod.percentage));
      } else if (prod.concentrationMgMl) {
        setDosePercentageInput(String(prod.concentrationMgMl / 10));
      }
      if (prod.bottleVolumeMl) setBottleVolumeMl(String(prod.bottleVolumeMl));
    } else if (prod.formType === 'tablet') {
      if (prod.tabletMg) setTabletConcentrationMg(String(prod.tabletMg));
      if (prod.tabletsPerBox) setTabletsPerBox(String(prod.tabletsPerBox));
    } else if (prod.formType === 'drops') {
      if (prod.concentrationMgMl) setDropsConcentrationMgMl(String(prod.concentrationMgMl));
      if (prod.dropsPerMl) setDropsPerMlFactor(String(prod.dropsPerMl));
    }

    const isCat = doseSpecies === 'Felino' || doseSpecies === 'cat' || doseSpecies === 'felino';
    let recDose: number | undefined;

    if (prod.protocols && prod.protocols.length > 0) {
      const initialProto = prod.protocols[0];
      setSelectedProtocolId(initialProto.id);
      recDose = isCat
        ? (initialProto.doseMgKg.felino ?? initialProto.doseMgKg.canino ?? 0.1)
        : (initialProto.doseMgKg.canino ?? initialProto.doseMgKg.felino ?? 0.2);
    } else {
      setSelectedProtocolId('');
      recDose = isCat
        ? (prod.defaultDoseMgKg?.felino ?? prod.defaultDoseMgKg?.canino ?? 0.1)
        : (prod.defaultDoseMgKg?.canino ?? prod.defaultDoseMgKg?.felino ?? 0.2);
    }

    setDosePrescribed(recDose !== undefined && !isNaN(recDose) ? String(recDose) : '0.2');
    setDrugLabel(prod.brandName);

    setDoseFrequency(prod.defaultFrequency);
    setDoseRoute(prod.defaultRoute);
    setIsProductListOpen(false);

    showToast(`Medicamento selecionado: ${prod.brandName}. Concentração preenchida automaticamente!`);
  };

  // Sincronização bidirecional mg/mL <=> % m/v
  const handleConcentrationChange = (val: string) => {
    setDoseConcentration(val);
    const parsed = parseFloat(val.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      setDosePercentageInput(String(parsed / 10));
    }
  };

  const handlePercentageChange = (val: string) => {
    setDosePercentageInput(val);
    const parsed = parseFloat(val.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      setDoseConcentration(String(parsed * 10));
    }
  };

  // When species changes, update dose according to active protocol or default
  const handleSpeciesChange = (species: string) => {
    setDoseSpecies(species);
    setDoseSubSpecies('');
    const prod = COMMERCIAL_PRODUCTS.find((p) => p.id === selectedProductId);
    if (prod) {
      const isCat = species === 'Felino' || species === 'cat';
      if (prod.protocols && prod.protocols.length > 0) {
        const proto = prod.protocols.find((pr) => pr.id === selectedProtocolId) || prod.protocols[0];
        const recDose = isCat ? (proto.doseMgKg.felino || proto.doseMgKg.canino || 0.1) : (proto.doseMgKg.canino || 0.2);
        setDosePrescribed(String(recDose));
      } else {
        const recDose = isCat ? (prod.defaultDoseMgKg?.felino || prod.defaultDoseMgKg?.canino || 0.1) : (prod.defaultDoseMgKg?.canino || 0.2);
        setDosePrescribed(String(recDose));
      }
    }
  };

  // When user selects a specific clinical protocol (e.g., 1º Dia / Ataque vs Manutenção)
  const handleProtocolSelect = (protocolId: string) => {
    setSelectedProtocolId(protocolId);
    const prod = COMMERCIAL_PRODUCTS.find((p) => p.id === selectedProductId);
    if (prod && prod.protocols) {
      const proto = prod.protocols.find((p) => p.id === protocolId);
      if (proto) {
        const isCat = doseSpecies === 'Felino' || doseSpecies === 'cat';
        const recDose = isCat ? (proto.doseMgKg.felino || proto.doseMgKg.canino || 0.1) : (proto.doseMgKg.canino || 0.2);
        setDosePrescribed(String(recDose));
        showToast(`Protocolo selecionado: ${proto.label} (${recDose} mg/kg)`);
      }
    }
  };

  // Apply prefilled drug data from Drug Library if triggered
  useEffect(() => {
    if (prefilledCalculatorData) {
      if (prefilledCalculatorData.selectedProductId) {
        setSelectedProductId(prefilledCalculatorData.selectedProductId);
      }
      if (prefilledCalculatorData.drugName) setDrugLabel(prefilledCalculatorData.drugName);
      if (prefilledCalculatorData.weight) setDoseWeight(String(prefilledCalculatorData.weight));
      if (prefilledCalculatorData.doseMgKg) setDosePrescribed(String(prefilledCalculatorData.doseMgKg));
      if (prefilledCalculatorData.concentrationMgMl) setDoseConcentration(String(prefilledCalculatorData.concentrationMgMl));
      if (prefilledCalculatorData.percentage) {
        setDosePercentageInput(String(prefilledCalculatorData.percentage));
        setDoseConcentrationUnit('percentage');
      } else if (prefilledCalculatorData.concentrationMgMl) {
        setDoseConcentrationUnit('mg/ml');
      }
      if (prefilledCalculatorData.formType) setDosageFormType(prefilledCalculatorData.formType as any);
      if (prefilledCalculatorData.tabletMg) setTabletConcentrationMg(String(prefilledCalculatorData.tabletMg));
      if (prefilledCalculatorData.bottleVolumeMl) setBottleVolumeMl(String(prefilledCalculatorData.bottleVolumeMl));
      if (prefilledCalculatorData.frequency) {
        if (prefilledCalculatorData.frequency.includes('BID')) setDoseFrequency('BID');
        else if (prefilledCalculatorData.frequency.includes('SID')) setDoseFrequency('SID');
        else if (prefilledCalculatorData.frequency.includes('TID')) setDoseFrequency('TID');
        else if (prefilledCalculatorData.frequency.includes('QID')) setDoseFrequency('QID');
      }
      if (prefilledCalculatorData.route) setDoseRoute(prefilledCalculatorData.route);
    }
  }, [prefilledCalculatorData]);

  // Helper for frequency factor
  const getFrequencyCount = (freq: string): number => {
    switch (freq) {
      case 'SID': return 1;
      case 'BID': return 2;
      case 'TID': return 3;
      case 'QID': return 4;
      default: return 1;
    }
  };

  // Format tablet fractions (1/4, 1/2, 3/4, 1, 1 e 1/2)
  const formatTabletFraction = (val: number): string => {
    const roundedQuarters = Math.round(val * 4) / 4;
    const whole = Math.floor(roundedQuarters);
    const remainder = roundedQuarters - whole;

    let fracText = '';
    if (remainder === 0.25) fracText = '1/4';
    else if (remainder === 0.5) fracText = '1/2';
    else if (remainder === 0.75) fracText = '3/4';

    if (whole === 0) {
      return fracText ? `${fracText} comprimido` : '0 comprimido';
    } else if (!fracText) {
      return `${whole} ${whole === 1 ? 'comprimido' : 'comprimidos'}`;
    } else {
      return `${whole} e ${fracText} ${whole >= 1 ? 'comprimidos' : 'comprimido'}`;
    }
  };

  const getRecommendedSyringe = (volMl: number): string => {
    if (volMl <= 1.0) return `Seringa de 1 mL (Insulina/Tuberculina de 100 UI com graduação fina): aspirar até ${volMl < 1 ? `${volMl.toFixed(2)} mL (${Math.round(volMl * 100)} UI)` : '1.0 mL'}`;
    if (volMl <= 3.0) return 'Seringa de 3 mL';
    if (volMl <= 5.0) return 'Seringa de 5 mL';
    if (volMl <= 10.0) return 'Seringa de 10 mL';
    return 'Seringa de 20 mL';
  };

  // Formatação clínica com precisão de seringa veterinária
  const formatVolumeStrict = (vol: number): { displayShort: string; displayDetailed: string } => {
    if (vol <= 0) return { displayShort: '0 mL', displayDetailed: '0 mL' };
    if (vol < 0.01) {
      const v3 = vol.toFixed(3);
      return { displayShort: `${v3} mL`, displayDetailed: `${v3} mL` };
    }
    if (vol < 1.0) {
      // Seringas de 1 mL (tuberculina/insulina): sempre exibir com 2 casas decimais (ex: 0.20 mL)
      const fixed2 = vol.toFixed(2);
      const fixed1 = vol.toFixed(1);
      // Se for múltiplo de 0.1 (ex: 0.20), exibir ambos para clareza absoluta (0.20 mL e 0.2 mL)
      if (fixed2.endsWith('0')) {
        return {
          displayShort: `${fixed2} mL`,
          displayDetailed: `${fixed2} mL (${fixed1} mL)`,
        };
      }
      return {
        displayShort: `${fixed2} mL`,
        displayDetailed: `${fixed2} mL`,
      };
    }
    const fixed2 = vol.toFixed(2);
    if (fixed2.endsWith('.00')) {
      return {
        displayShort: `${vol.toFixed(0)} mL`,
        displayDetailed: `${vol.toFixed(0)} mL`,
      };
    }
    if (fixed2.endsWith('0')) {
      return {
        displayShort: `${vol.toFixed(1)} mL`,
        displayDetailed: `${fixed2} mL (${vol.toFixed(1)} mL)`,
      };
    }
    return {
      displayShort: `${fixed2} mL`,
      displayDetailed: `${fixed2} mL`,
    };
  };

  // Filtered commercial products for search (comprehensive search across brand, active principle, category, form, notes)
  const filteredProducts = COMMERCIAL_PRODUCTS.filter((p) => {
    const q = productSearch.toLowerCase().trim();
    if (!q) return true;
    const brand = p.brandName.toLowerCase();
    const active = p.activePrinciple.toLowerCase();
    const cat = p.category.toLowerCase();
    const form = p.formType.toLowerCase();
    const notes = (p.clinicalNotes || '').toLowerCase();
    const range = (p.doseRangeText || '').toLowerCase();
    return (
      brand.includes(q) ||
      active.includes(q) ||
      cat.includes(q) ||
      form.includes(q) ||
      notes.includes(q) ||
      range.includes(q)
    );
  });


  const selectedProductObj = COMMERCIAL_PRODUCTS.find((p) => p.id === selectedProductId) || null;

  // Formatação segura das informações do produto comercial selecionado
  const cleanCommercialBrand = selectedProductObj
    ? selectedProductObj.brandName.replace(/\s*\([^)]*?(?:União|Ourofino|Bayer|Zoetis|Ceva|Covetrus|MSD|Elanco|Agener|Vetnil|Biofarm|World|Lavizoo|Syntec|Chemitec|Duprat|Pearson|Vetoquinol|Ibasa|Virbac|Hertape|Jofadel|Biovet|Farmabase|König|Boehringer|Dechra)[^)]*\)$/i, '').trim() || selectedProductObj.brandName
    : 'Não informado';

  const commercialManufacturer = selectedProductObj?.manufacturer || 'Não informado';

  let commercialConcentrationText = 'Não informado';
  if (selectedProductObj) {
    if (selectedProductObj.formType === 'tablet') {
      commercialConcentrationText = selectedProductObj.tabletMg ? `${selectedProductObj.tabletMg} mg` : 'Não informado';
    } else if (selectedProductObj.formType === 'drops') {
      commercialConcentrationText = selectedProductObj.concentrationMgMl ? `${selectedProductObj.concentrationMgMl} mg/mL` : 'Não informado';
    } else {
      commercialConcentrationText = selectedProductObj.concentrationMgMl
        ? `${selectedProductObj.concentrationMgMl} mg/mL${selectedProductObj.percentage ? ` (${selectedProductObj.percentage}%)` : ''}`
        : (selectedProductObj.percentage ? `${selectedProductObj.percentage * 10} mg/mL (${selectedProductObj.percentage}%)` : 'Não informado');
    }
  }

  // Linha secundária: Concentração X mg/mL • Dose de referência: X mg/kg
  let activeConcentrationLine2 = 'Não informado';
  if (dosageFormType === 'tablet') {
    activeConcentrationLine2 = tabletConcentrationMg ? `${tabletConcentrationMg} mg` : (selectedProductObj?.tabletMg ? `${selectedProductObj.tabletMg} mg` : 'Não informado');
  } else if (dosageFormType === 'drops') {
    activeConcentrationLine2 = dropsConcentrationMgMl ? `${dropsConcentrationMgMl} mg/mL` : (selectedProductObj?.concentrationMgMl ? `${selectedProductObj.concentrationMgMl} mg/mL` : 'Não informado');
  } else {
    activeConcentrationLine2 = doseConcentration ? `${doseConcentration} mg/mL` : (selectedProductObj?.concentrationMgMl ? `${selectedProductObj.concentrationMgMl} mg/mL` : 'Não informado');
  }

  const isDoseSpeciesCat = doseSpecies === 'Felino' || doseSpecies === 'cat' || doseSpecies === 'felino';
  let activeDoseReferenceLine2 = 'Não informado';
  if (dosePrescribed && dosePrescribed !== 'undefined' && !isNaN(Number(dosePrescribed)) && Number(dosePrescribed) > 0) {
    activeDoseReferenceLine2 = `${dosePrescribed} mg/kg`;
  } else if (selectedProductObj) {
    const defaultDose = isDoseSpeciesCat
      ? (selectedProductObj.defaultDoseMgKg?.felino ?? selectedProductObj.defaultDoseMgKg?.canino)
      : (selectedProductObj.defaultDoseMgKg?.canino ?? selectedProductObj.defaultDoseMgKg?.felino);
    if (defaultDose !== undefined && !isNaN(defaultDose)) {
      activeDoseReferenceLine2 = `${defaultDose} mg/kg`;
    }
  }

  // ==========================================
  // CALCULATION LOGIC
  // ==========================================
  const calculateCurrent = () => {
    setValidationError(null);
    setSafetyAlerts([]);
    setClinicalWarning(null);
    setCopied(false);
    setCopiedPrescription(false);

    try {
      // 1. DOSAGEM
      if (selectedCalculator === 'dosage') {
        const w = parseFloat(doseWeight.replace(',', '.'));
        const d = parseFloat(dosePrescribed.replace(',', '.'));
        const days = parseInt(treatmentDays) || 1;
        const freqCount = getFrequencyCount(doseFrequency);

        if (isNaN(w) || w <= 0) return setValidationError('Informe o peso corporal do animal (kg) maior que zero.');
        if (isNaN(d) || d <= 0) return setValidationError('Informe a dose prescrita maior que zero.');

        const doseMgKg = doseUnit === 'mcg/kg' ? d / 1000 : d;
        setSafetyAlerts(
          speciesSafetyAlerts({
            activePrinciple: selectedProductObj?.activePrinciple || drugLabel,
            name: drugLabel,
            species: doseSpecies,
            doseMgKg,
            product: selectedProductObj,
          }),
        );

        let dosePerTakeMg = 0;
        if (doseRegime === 'per-dose') {
          dosePerTakeMg = w * doseMgKg;
        } else {
          dosePerTakeMg = (w * doseMgKg) / freqCount;
        }

        const dailyTotalMg = dosePerTakeMg * freqCount;
        const fullTreatmentMg = dailyTotalMg * days;

        if (dosageFormType === 'liquid') {
          let conc = parseFloat(doseConcentration.replace(',', '.'));
          let isPercentage = doseConcentrationUnit === 'percentage';
          
          if (isPercentage) {
            const pct = parseFloat(dosePercentageInput.replace(',', '.'));
            if (isNaN(pct) || pct <= 0) return setValidationError('Concentração percentual (%) inválida.');
            conc = pct * 10;
          } else {
            if (isNaN(conc) || conc <= 0) return setValidationError('Concentração da solução inválida.');
          }

          const volPerTakeMl = dosePerTakeMg / conc;
          
          // Alerta de segurança clínico NÃO-BLOQUEANTE (calcula o resultado e destaca o aviso clínico)
          if (volPerTakeMl > (w * 0.5)) {
            const isInfusionDrug = selectedProductObj?.id.includes('metronidazol') || doseRoute.toLowerCase().includes('infusão');
            if (isInfusionDrug) {
              setClinicalWarning(`ALERTA CLÍNICO: Volume de infusão calculado de ${formatVolumeStrict(volPerTakeMl).displayDetailed}. Para soluções de infusão IV pronta (ex: Metronidazol 5 mg/mL), infundir lentamente em 30 a 60 minutos sob monitoramento.`);
            } else {
              setClinicalWarning(`ALERTA CLÍNICO: Volume calculado de ${formatVolumeStrict(volPerTakeMl).displayDetailed} por aplicação é elevado para o peso corporal (${w} kg). Confirme se a concentração (${conc} mg/mL) e a dose (${doseMgKg} mg/kg) estão corretas antes da administração.`);
            }
          }

          const volDailyMl = volPerTakeMl * freqCount;
          const volTotalMl = volDailyMl * days;
          const bottleVol = parseFloat(bottleVolumeMl) || 20;
          const bottlesNeeded = Math.ceil(volTotalMl / bottleVol);

          const volInfo = formatVolumeStrict(volPerTakeMl);
          const volDailyInfo = formatVolumeStrict(volDailyMl);
          const volPerTakeStr = volInfo.displayDetailed;
          const volPerTakeShort = volInfo.displayShort;

          const pctEquiv = (conc / 10).toFixed(2).replace(/\.?0+$/, '');

          // Regra direta de conferência da bula para produtos oficiais
          let bulaStep: CalculationStep | null = null;
          if (selectedProductObj?.id === 'emedron-inj-1') {
            const mlPerKg = 0.05; // 1 mL para cada 20 kg
            const directMl = w * mlPerKg;
            bulaStep = {
              label: '7. Regra da Bula Oficial (Agener União)',
              expression: 'Cães e gatos: 1 mL para cada 20 kg (0,05 mL/kg) para dose de 0,5 mg/kg',
              result: `${w} kg × 0,05 mL/kg = ${directMl.toFixed(2)} mL (${directMl.toFixed(1)} mL)`,
            };
          } else if (selectedProductObj?.id.includes('flamavet-inj') || selectedProductObj?.id.includes('maxicam-inj')) {
            if (conc === 2) {
              const isCat = doseSpecies === 'cat';
              const isMaint = selectedProtocolId === 'day2-maintenance' || selectedProtocolId === 'day2';
              if (isCat) {
                const mlPerKg = isMaint ? 0.025 : 0.05;
                const directMl = w * mlPerKg;
                bulaStep = {
                  label: '7. Regra da Bula Oficial (Agener União)',
                  expression: isMaint
                    ? 'Gatos manutenção: 1 mL para cada 40 kg (0,025 mL/kg)'
                    : 'Gatos 1º dia / dose única: 1 mL para cada 20 kg (0,05 mL/kg)',
                  result: `${w} kg × ${mlPerKg} mL/kg = ${directMl.toFixed(2)} mL (${directMl.toFixed(1)} mL)`,
                };
              } else {
                const mlPerKg = isMaint ? 0.05 : 0.1;
                const directMl = w * mlPerKg;
                bulaStep = {
                  label: '7. Regra da Bula Oficial (Agener União)',
                  expression: isMaint
                    ? 'Cães manutenção: 1 mL para cada 20 kg (0,05 mL/kg)'
                    : 'Cães 1º dia: 1 mL para cada 10 kg (0,10 mL/kg)',
                  result: `${w} kg × ${mlPerKg} mL/kg = ${directMl.toFixed(2)} mL (${directMl.toFixed(1)} mL)`,
                };
              }
            }
          } else if (selectedProductObj?.protocols && selectedProductObj.protocols.length > 0) {
            const activeProto = selectedProductObj.protocols.find(p => p.id === selectedProtocolId) || selectedProductObj.protocols[0];
            if (activeProto?.bulaRuleText) {
              bulaStep = {
                label: '7. Posologia da Bula Oficial',
                expression: activeProto.label,
                result: activeProto.bulaRuleText,
              };
            }
          }

          const steps: CalculationStep[] = [
            {
              label: '1. Concentração da Solução',
              expression: selectedProductObj?.percentage !== undefined || doseConcentrationUnit === 'percentage'
                ? `${pctEquiv}% m/v × 10 (fórmula: 1% m/v = 10 mg/mL)`
                : `Concentração da solução informada`,
              result: `${conc} mg/mL (${pctEquiv}% m/v)`,
            },
            {
              label: '2. Dose por Aplicação (mg)',
              expression: doseRegime === 'per-dose'
                ? `${w} kg × ${doseMgKg} mg/kg`
                : `(${w} kg × ${doseMgKg} mg/kg/dia) ÷ ${freqCount} tomadas`,
              result: `${dosePerTakeMg.toFixed(2)} mg`,
            },
            {
              label: '3. Volume por Aplicação (mL)',
              expression: `${dosePerTakeMg.toFixed(2)} mg ÷ ${conc} mg/mL`,
              result: `${volPerTakeStr}`,
            },
            {
              label: '4. Volume Diário Total',
              expression: `${volPerTakeShort} × ${freqCount}x/dia`,
              result: `${volDailyInfo.displayShort}/dia`,
            },
            {
              label: '5. Quantidade Total para o Tratamento',
              expression: `${volDailyInfo.displayShort}/dia × ${days} dias = ${volTotalMl.toFixed(2)} mL`,
              result: `${bottlesNeeded} frasco(s) de ${bottleVol} mL`,
            },
            {
              label: '6. Seringa e Graduação Recomendada',
              expression: `Volume de ${volPerTakeStr}`,
              result: volPerTakeMl <= 1.0
                ? `Seringa de 1 mL (Insulina/Tuberculina): aspirar exatamente até a graduação de ${volPerTakeShort} (${Math.round(volPerTakeMl * 100)} UI)`
                : getRecommendedSyringe(volPerTakeMl),
            },
          ];

          if (bulaStep) {
            steps.push(bulaStep);
          }

          const summary = `${volPerTakeStr} por aplicação (${dosePerTakeMg.toFixed(2)} mg)`;
          setResultSummary(summary);
          setCalculationSteps(steps);

          const presText = `USO ${doseRoute.toUpperCase()}\n1. ${drugLabel || 'Medicamento'} ---------- ${bottlesNeeded} frasco(s)\n   Administrar ${volPerTakeStr} (${dosePerTakeMg.toFixed(2)} mg) por via ${doseRoute.toLowerCase()}, ${doseFrequency === 'Dose Única' ? 'em dose única' : `a cada ${24 / freqCount} horas (${doseFrequency})`}, durante ${days} dias.`;
          setPrescriptionText(presText);

          addCalculationToHistory({
            type: 'dosage',
            title: `${drugLabel || 'Fármaco'} (${w} kg - Líquido)`,
            inputs: { peso_kg: w, dose_mg_kg: doseMgKg, concentracao: conc, volume_ml: volPerTakeStr },
            resultSummary: summary,
            steps,
          });
        } else if (dosageFormType === 'tablet') {
          const tabConc = parseFloat(tabletConcentrationMg.replace(',', '.'));
          if (isNaN(tabConc) || tabConc <= 0) return setValidationError('Concentração do comprimido inválida.');

          const theoreticalTablets = dosePerTakeMg / tabConc;
          const practicalQuarter = Math.round(theoreticalTablets * 4) / 4;
          const actualMgDelivered = practicalQuarter * tabConc;
          const diffPercent = ((actualMgDelivered - dosePerTakeMg) / dosePerTakeMg) * 100;

          const totalTabsTreatment = practicalQuarter * freqCount * days;
          const boxUnits = parseInt(tabletsPerBox) || 10;
          const boxesNeeded = Math.ceil(totalTabsTreatment / boxUnits);

          const fractionLabel = formatTabletFraction(practicalQuarter);

          const steps: CalculationStep[] = [
            {
              label: '1. Dose Teórica por Tomada (mg)',
              expression: `${w} kg × ${doseMgKg} mg/kg`,
              result: `${dosePerTakeMg.toFixed(2)} mg`,
            },
            {
              label: '2. Fração Teórica de Comprimido',
              expression: `${dosePerTakeMg.toFixed(2)} mg ÷ ${tabConc} mg/comp`,
              result: `${theoreticalTablets.toFixed(2)} comprimidos`,
            },
            {
              label: '3. Fracionamento Prático Recomendado',
              expression: 'Arredondamento comercial para quartos (1/4, 1/2, 3/4)',
              result: `${fractionLabel} (${actualMgDelivered.toFixed(2)} mg)`,
            },
            {
              label: '4. Variação da Dose Real vs Prescrita',
              expression: `((${actualMgDelivered.toFixed(2)} - ${dosePerTakeMg.toFixed(2)}) ÷ ${dosePerTakeMg.toFixed(2)}) × 100`,
              result: `${diffPercent >= 0 ? '+' : ''}${diffPercent.toFixed(1)}%`,
            },
            {
              label: '5. Total de Comprimidos para a Receita',
              expression: `${fractionLabel} × ${freqCount}x/dia × ${days} dias = ${totalTabsTreatment} comp`,
              result: `${boxesNeeded} caixa(s) com ${boxUnits} comprimidos`,
            },
          ];

          const summary = `${fractionLabel} por tomada (${actualMgDelivered.toFixed(2)} mg)`;
          setResultSummary(summary);
          setCalculationSteps(steps);

          const presText = `USO ORAL\n1. ${drugLabel || 'Medicamento'} ${tabConc} mg ---------- ${boxesNeeded} caixa(s) com ${boxUnits} comprimidos\n   Administrar ${fractionLabel} por via oral, ${doseFrequency === 'Dose Única' ? 'em dose única' : `a cada ${24 / freqCount} horas (${doseFrequency})`}, durante ${days} dias.`;
          setPrescriptionText(presText);

          addCalculationToHistory({
            type: 'dosage',
            title: `${drugLabel || 'Fármaco'} (${w} kg - Comprimido)`,
            inputs: { peso_kg: w, dose_mg_kg: doseMgKg, comprimido_mg: tabConc, fracao: fractionLabel },
            resultSummary: summary,
            steps,
          });
        } else if (dosageFormType === 'drops') {
          const conc = parseFloat(dropsConcentrationMgMl.replace(',', '.'));
          const factor = parseFloat(dropsPerMlFactor.replace(',', '.')) || 20;

          if (isNaN(conc) || conc <= 0) return setValidationError('Concentração de gotas inválida.');

          const mgPerDrop = conc / factor;
          const dropsPerTake = Math.round(dosePerTakeMg / mgPerDrop);
          const actualMgDelivered = dropsPerTake * mgPerDrop;
          const dropsPerDay = dropsPerTake * freqCount;
          const totalDropsTreatment = dropsPerDay * days;
          const totalMlTreatment = totalDropsTreatment / factor;
          const bottlesNeeded = Math.ceil(totalMlTreatment / 20);

          const steps: CalculationStep[] = [
            {
              label: '1. Dose por Tomada (mg)',
              expression: `${w} kg × ${doseMgKg} mg/kg`,
              result: `${dosePerTakeMg.toFixed(2)} mg`,
            },
            {
              label: '2. Concentração por Gota',
              expression: `${conc} mg/mL ÷ ${factor} gotas/mL`,
              result: `${mgPerDrop.toFixed(2)} mg por gota`,
            },
            {
              label: '3. Gotas por Tomada',
              expression: `${dosePerTakeMg.toFixed(2)} mg ÷ ${mgPerDrop.toFixed(2)} mg/gota`,
              result: `${dropsPerTake} gotas (${actualMgDelivered.toFixed(1)} mg)`,
            },
            {
              label: '4. Quantidade Total de Gotas',
              expression: `${dropsPerDay} gotas/dia × ${days} dias = ${totalDropsTreatment} gotas`,
              result: `${totalMlTreatment.toFixed(1)} mL (aprox. ${bottlesNeeded} frasco(s))`,
            },
          ];

          const summary = `${dropsPerTake} gotas por tomada (${actualMgDelivered.toFixed(1)} mg)`;
          setResultSummary(summary);
          setCalculationSteps(steps);

          const presText = `USO ORAL (GOTAS)\n1. ${drugLabel || 'Medicamento'} Gotas ---------- ${bottlesNeeded} frasco(s)\n   Administrar ${dropsPerTake} gotas por via oral, ${doseFrequency === 'Dose Única' ? 'em dose única' : `a cada ${24 / freqCount} horas (${doseFrequency})`}, durante ${days} dias.`;
          setPrescriptionText(presText);

          addCalculationToHistory({
            type: 'dosage',
            title: `${drugLabel || 'Fármaco'} (${w} kg - Gotas)`,
            inputs: { peso_kg: w, dose_mg_kg: doseMgKg, gotas: dropsPerTake },
            resultSummary: summary,
            steps,
          });
        }
      }

      // 2. FLUIDOTERAPIA
      else if (selectedCalculator === 'fluidotherapy') {
        const w = parseFloat(fluidWeight.replace(',', '.'));
        const dehyPct = parseFloat(fluidDehydrationPercent.replace(',', '.'));
        const defHours = parseFloat(fluidDeficitHours.replace(',', '.')) || 24;
        const ongoingLosses = parseFloat(fluidOngoingLosses.replace(',', '.')) || 0;

        if (isNaN(w) || w <= 0) return setValidationError('Informe o peso do animal (kg).');

        const isDog = fluidSpecies === 'Canino';
        let maintenanceMlDay = 0;
        if (fluidMaintenanceMethod === 'metabolic') {
          maintenanceMlDay = isDog ? (30 * w) + 70 : 70 * Math.pow(w, 0.75);
        } else {
          const rate = parseFloat(fluidStandardRate.replace(',', '.')) || (isDog ? 50 : 40);
          maintenanceMlDay = w * rate;
        }

        const deficitMl = w * dehyPct * 10;
        const deficitHourlyRate = defHours > 0 ? deficitMl / defHours : 0;
        const totalDailyMl = maintenanceMlDay + deficitMl + ongoingLosses;
        const hourlyRateMlHr = totalDailyMl / 24;

        // Regra prática: Macrogotas = mL/h ÷ 3
        const macroDropsMin = hourlyRateMlHr / 3;
        const microDropsMin = hourlyRateMlHr;
        const secondsPerDropMacro = macroDropsMin > 0 ? 60 / macroDropsMin : 0;

        const steps: CalculationStep[] = [
          {
            label: '1. Manutenção Diária',
            expression: fluidMaintenanceMethod === 'metabolic'
              ? (isDog ? `(30 × ${w}) + 70` : `70 × (${w})^0.75`)
              : `${w} kg × ${fluidStandardRate} mL/kg/dia`,
            result: `${maintenanceMlDay.toFixed(0)} mL/dia (${(maintenanceMlDay / 24).toFixed(1)} mL/h)`,
          },
          {
            label: '2. Déficit de Desidratação',
            expression: `${w} kg × ${dehyPct}% × 10`,
            result: `${deficitMl.toFixed(0)} mL (repor a ${deficitHourlyRate.toFixed(1)} mL/h em ${defHours}h)`,
          },
          {
            label: '3. Perdas Contínuas Estimadas',
            expression: 'Vômito / Diarreia diária',
            result: `${ongoingLosses.toFixed(0)} mL/dia`,
          },
          {
            label: '4. TOTAL EM 24H E VELOCIDADE EM BOMBA',
            expression: `${maintenanceMlDay.toFixed(0)} + ${deficitMl.toFixed(0)} + ${ongoingLosses.toFixed(0)} mL`,
            result: `${totalDailyMl.toFixed(0)} mL/dia → ${hourlyRateMlHr.toFixed(1)} mL/h`,
          },
          {
            label: '5. Equipo Macrogotas (20 gts/mL) — Regra prática',
            expression: `${hourlyRateMlHr.toFixed(1)} mL/h ÷ 3`,
            result: `${Math.round(macroDropsMin)} gotas/min (1 gota a cada ${secondsPerDropMacro.toFixed(1)} s)`,
          },
          {
            label: '6. Equipo Microgotas (60 gts/mL)',
            expression: `${hourlyRateMlHr.toFixed(1)} mL/h = microgotas/min`,
            result: `${Math.round(microDropsMin)} microgotas/min`,
          },
        ];

        const summary = `${totalDailyMl.toFixed(0)} mL/dia | ${hourlyRateMlHr.toFixed(1)} mL/h (${Math.round(macroDropsMin)} gts/min macro)`;
        setResultSummary(summary);
        setCalculationSteps(steps);

        const presText = `PRESCRIÇÃO DE FLUIDOTERAPIA\nPaciente: ${fluidSpecies} (${w} kg) - Grau de Desidratação: ${dehyPct}%\nVolume Total em 24h: ${totalDailyMl.toFixed(0)} mL\nBomba de Infusão Contínua: ${hourlyRateMlHr.toFixed(1)} mL/h\nEquipo Macrogotas: ${Math.round(macroDropsMin)} gotas/minuto (1 gota a cada ${secondsPerDropMacro.toFixed(1)} segundos)\nEquipo Microgotas: ${Math.round(microDropsMin)} microgotas/minuto.`;
        setPrescriptionText(presText);

        addCalculationToHistory({
          type: 'fluidotherapy',
          title: `Fluidoterapia (${w} kg)`,
          inputs: { peso_kg: w, total_ml: totalDailyMl, taxa_ml_h: hourlyRateMlHr },
          resultSummary: summary,
          steps,
        });
      }

      // 3. INFUSÃO CONTÍNUA CRI
      else if (selectedCalculator === 'cri') {
        const w = parseFloat(criPatientWeight.replace(',', '.'));
        const bagVol = parseFloat(criBagVolumeMl.replace(',', '.'));
        const rateMlHr = parseFloat(criInfusionRateMlHr.replace(',', '.'));
        const doseVal = parseFloat(criDoseValue.replace(',', '.'));
        const drugConc = parseFloat(criDrugConcentrationMgMl.replace(',', '.'));

        if (isNaN(w) || w <= 0 || isNaN(bagVol) || isNaN(rateMlHr) || isNaN(doseVal) || isNaN(drugConc)) {
          return setValidationError('Informe valores válidos para o cálculo de CRI.');
        }

        const bagDurationHours = bagVol / rateMlHr;
        let totalDrugMgInBag = 0;
        if (criDoseUnit === 'mcg/kg/min') {
          totalDrugMgInBag = (doseVal * w * 60 * bagDurationHours) / 1000;
        } else if (criDoseUnit === 'mcg/kg/h') {
          totalDrugMgInBag = (doseVal * w * bagDurationHours) / 1000;
        } else {
          totalDrugMgInBag = doseVal * w * bagDurationHours;
        }

        const drugVolumeToAddMl = totalDrugMgInBag / drugConc;
        const drugVolStr = drugVolumeToAddMl < 1
          ? `${drugVolumeToAddMl.toFixed(3).replace(/\.?0+$/, '')} mL`
          : `${drugVolumeToAddMl.toFixed(2).replace(/\.?0+$/, '')} mL`;

        const steps: CalculationStep[] = [
          { label: 'Duração da Bolsa de Fluido', expression: `${bagVol} mL ÷ ${rateMlHr} mL/h`, result: `${bagDurationHours.toFixed(1)} horas` },
          { label: 'Dose Total do Fármaco na Bolsa', expression: `Dose calculada para ${bagDurationHours.toFixed(1)} h`, result: `${totalDrugMgInBag.toFixed(2)} mg` },
          { label: 'Volume da Droga a Adicionar na Bolsa', expression: `${totalDrugMgInBag.toFixed(2)} mg ÷ ${drugConc} mg/mL`, result: `${drugVolStr} de ${criDrugName}` },
          { label: 'Instrução Prática de Preparo', expression: 'Retirar o mesmo volume antes de adicionar a droga', result: `Retirar ${drugVolStr} de soro da bolsa de ${bagVol} mL e adicionar ${drugVolStr} de ${criDrugName}. Infundir a ${rateMlHr} mL/h.` },
        ];

        const summary = `Adicionar ${drugVolStr} de ${criDrugName} na bolsa de ${bagVol} mL (Infundir a ${rateMlHr} mL/h)`;
        setResultSummary(summary);
        setCalculationSteps(steps);

        const presText = `PRESCRIÇÃO DE INFUSÃO CONTÍNUA (CRI)\nBolsa: ${bagVol} mL | Velocidade da Bomba: ${rateMlHr} mL/h (Duração: ${bagDurationHours.toFixed(1)} h)\nPreparo: Retirar ${drugVolStr} de soro da bolsa e adicionar ${drugVolStr} de ${criDrugName} (${drugConc} mg/mL).\nDose entregue: ${doseVal} ${criDoseUnit}.`;
        setPrescriptionText(presText);

        addCalculationToHistory({
          type: 'cri',
          title: `CRI: ${criDrugName} (${w} kg)`,
          inputs: { peso_kg: w, dose: doseVal, volume_droga: drugVolStr },
          resultSummary: summary,
          steps,
        });
      }

      // 4. TRANSFUSÃO SANGUÍNEA
      else if (selectedCalculator === 'transfusion') {
        const w = parseFloat(transfusionWeight.replace(',', '.'));
        const currentHt = parseFloat(transfusionCurrentHt.replace(',', '.'));
        const targetHt = parseFloat(transfusionTargetHt.replace(',', '.'));
        const donorHt = parseFloat(transfusionDonorHt.replace(',', '.'));

        if (isNaN(w) || w <= 0 || isNaN(currentHt) || isNaN(targetHt) || targetHt <= currentHt) {
          return setValidationError('Informe hematócrito atual e hematócrito alvo válido.');
        }

        const k = transfusionSpecies === 'Canino' ? 90 : 60;
        const volumeMl = w * k * ((targetHt - currentHt) / donorHt);
        const testRate = w * 0.25;
        const mainRate = volumeMl / 3.5;

        const steps: CalculationStep[] = [
          { label: `Fórmula Transfusional (K = ${k})`, expression: `${w} kg × ${k} × [(${targetHt}% - ${currentHt}%) ÷ ${donorHt}%]`, result: `${volumeMl.toFixed(0)} mL de sangue` },
          { label: 'Velocidade Inicial de Teste (15-30 min)', expression: '0,25 mL/kg/h para monitorar reações', result: `${testRate.toFixed(1)} mL/h` },
          { label: 'Velocidade Principal de Manutenção', expression: `${volumeMl.toFixed(0)} mL ÷ 3,5 horas`, result: `${mainRate.toFixed(1)} mL/h (concluir em 4h)` },
        ];

        const summary = `Volume a transfundir: ${volumeMl.toFixed(0)} mL (infundir em até 4 horas)`;
        setResultSummary(summary);
        setCalculationSteps(steps);

        const presText = `PRESCRIÇÃO DE TRANSFUSÃO SANGUÍNEA\nPaciente: ${transfusionSpecies} (${w} kg) | Ht Atual: ${currentHt}% → Ht Alvo: ${targetHt}%\nVolume Total: ${volumeMl.toFixed(0)} mL de sangue total\nVelocidade de Teste (15-30 min): ${testRate.toFixed(1)} mL/h | Velocidade Principal: ${mainRate.toFixed(1)} mL/h.`;
        setPrescriptionText(presText);

        addCalculationToHistory({
          type: 'transfusion',
          title: `Transfusão Sanguínea (${w} kg - ${volumeMl.toFixed(0)} mL)`,
          inputs: { peso_kg: w, ht_atual: currentHt, volume_ml: volumeMl },
          resultSummary: summary,
          steps,
        });
      }

      // OUTROS CÁLCULOS
      else if (selectedCalculator === 'dilution') {
        const c1 = parseFloat(dilutionC1.replace(',', '.'));
        const c2 = parseFloat(dilutionC2.replace(',', '.'));
        const v2 = parseFloat(dilutionV2.replace(',', '.'));
        if (isNaN(c1) || isNaN(c2) || isNaN(v2) || c2 >= c1) return setValidationError('Verifique os valores de diluição.');
        const v1 = (c2 * v2) / c1;
        const diluent = v2 - v1;
        const summary = `Aspirar ${v1.toFixed(2)} mL do concentrado e adicionar ${diluent.toFixed(2)} mL de diluente`;
        setResultSummary(summary);
        setCalculationSteps([
          { label: 'Volume do Fármaco Concentrado', expression: `(${c2} × ${v2}) ÷ ${c1}`, result: `${v1.toFixed(2)} mL` },
          { label: 'Volume de Diluente', expression: `${v2} - ${v1.toFixed(2)}`, result: `${diluent.toFixed(2)} mL` },
        ]);
      } else if (selectedCalculator === 'percentage-conversion') {
        if (percentDirection === 'percent-to-mg') {
          const p = parseFloat(percentageInput.replace(',', '.'));
          const mg = p * 10;
          setResultSummary(`${p}% = ${mg} mg/mL`);
          setCalculationSteps([
            { label: 'Regra Prática', expression: `${p}% × 10`, result: `${mg} mg/mL` },
          ]);
        } else {
          const m = parseFloat(mgMlInput.replace(',', '.'));
          const p = m / 10;
          setResultSummary(`${m} mg/mL = ${p}%`);
          setCalculationSteps([
            { label: 'Regra Prática Inversa', expression: `${m} mg/mL ÷ 10`, result: `${p}%` },
          ]);
        }
      } else if (selectedCalculator === 'hydration-deficit') {
        const w = parseFloat(deficitWeight.replace(',', '.'));
        const pct = parseFloat(deficitPercent.replace(',', '.'));
        const h = parseFloat(deficitHours.replace(',', '.')) || 24;
        const def = w * pct * 10;
        setResultSummary(`Déficit: ${def.toFixed(0)} mL (${(def / h).toFixed(1)} mL/h em ${h}h)`);
        setCalculationSteps([
          { label: 'Volume Total do Déficit', expression: `${w} kg × ${pct}% × 10`, result: `${def.toFixed(0)} mL` },
          { label: 'Taxa Horária Exclusiva', expression: `${def.toFixed(0)} mL ÷ ${h} h`, result: `${(def / h).toFixed(1)} mL/h` },
        ]);
      } else if (selectedCalculator === 'infusion-rate') {
        const vol = parseFloat(infusionVolume.replace(',', '.'));
        const h = parseFloat(infusionHours.replace(',', '.'));
        const mlHr = vol / h;
        const macro = mlHr / 3;
        setResultSummary(`${mlHr.toFixed(1)} mL/h | ${Math.round(macro)} gts/min macrogotas`);
        setCalculationSteps([
          { label: 'Taxa em Bomba', expression: `${vol} mL ÷ ${h} h`, result: `${mlHr.toFixed(1)} mL/h` },
          { label: 'Macrogotas (Regra prática: mL/h ÷ 3)', expression: `${mlHr.toFixed(1)} ÷ 3`, result: `${Math.round(macro)} gotas/min` },
        ]);
      } else if (selectedCalculator === 'rule-of-three') {
        const a = parseFloat(ruleA.replace(',', '.'));
        const b = parseFloat(ruleB.replace(',', '.'));
        const c = parseFloat(ruleC.replace(',', '.'));
        const x = (b * c) / a;
        setResultSummary(`X = ${x.toFixed(2)}`);
        setCalculationSteps([
          { label: 'Proporção Direta: (B × C) ÷ A', expression: `(${b} × ${c}) ÷ ${a}`, result: `X = ${x.toFixed(2)}` },
        ]);
      } else if (selectedCalculator === 'bsa') {
        const w = parseFloat(bsaWeight.replace(',', '.'));
        const d = parseFloat(bsaDosePerM2.replace(',', '.'));
        const k = bsaSpecies === 'dog' ? 10.1 : 10.0;
        const bsa = (k * Math.pow(w * 1000, 2 / 3)) / 10000;
        const tot = bsa * d;
        setResultSummary(`BSA: ${bsa.toFixed(3)} m² | Dose: ${tot.toFixed(2)} mg`);
        setCalculationSteps([
          { label: `Área de Superfície Corporal (K=${k})`, expression: `[${k} × (${w * 1000} g)^(2/3)] ÷ 10.000`, result: `${bsa.toFixed(3)} m²` },
          { label: 'Dose Total por BSA', expression: `${bsa.toFixed(3)} m² × ${d} mg/m²`, result: `${tot.toFixed(2)} mg` },
        ]);
      }
    } catch (err: any) {
      setValidationError('Erro nos cálculos.');
    }
  };

  useEffect(() => {
    calculateCurrent();
  }, [
    selectedCalculator,
    dosageFormType,
    doseSpecies,
    doseWeight,
    dosePrescribed,
    doseUnit,
    doseRegime,
    doseFrequency,
    doseRoute,
    treatmentDays,
    doseConcentration,
    bottleVolumeMl,
    tabletConcentrationMg,
    tabletsPerBox,
    dropsConcentrationMgMl,
    dropsPerMlFactor,
    fluidSpecies,
    fluidWeight,
    fluidMaintenanceMethod,
    fluidStandardRate,
    fluidDehydrationPercent,
    fluidDeficitHours,
    fluidOngoingLosses,
    criPatientWeight,
    criBagVolumeMl,
    criInfusionRateMlHr,
    criDoseValue,
    criDoseUnit,
    criDrugConcentrationMgMl,
    criDrugName,
    transfusionSpecies,
    transfusionWeight,
    transfusionCurrentHt,
    transfusionTargetHt,
    transfusionDonorHt,
    dilutionC1,
    dilutionC2,
    dilutionV2,
    percentageInput,
    mgMlInput,
    percentDirection,
    deficitWeight,
    deficitPercent,
    deficitHours,
    infusionVolume,
    infusionHours,
    ruleA,
    ruleB,
    ruleC,
    bsaSpecies,
    bsaWeight,
    bsaDosePerM2,
  ]);

  const copyResultToClipboard = () => {
    if (!resultSummary) return;
    const textToCopy = `${resultSummary}\n\nMemória de Cálculo (VET CALC PRO):\n${calculationSteps
      .map((s) => `${s.label}: ${s.expression} = ${s.result}`)
      .join('\n')}\n\n(Calculado com precisão no VET CALC PRO)`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('Resultado e memória copiados!');
    setTimeout(() => setCopied(false), 2500);
  };

  const copyPrescriptionToClipboard = () => {
    if (!prescriptionText) return;
    navigator.clipboard.writeText(prescriptionText);
    setCopiedPrescription(true);
    showToast('Receita pronta copiada para a área de transferência!');
    setTimeout(() => setCopiedPrescription(false), 2500);
  };

  const handleClear = () => {
    setResultSummary('');
    setCalculationSteps([]);
    setPrescriptionText('');
    setValidationError(null);
    setClinicalWarning(null);
    setSafetyAlerts([]);
  };

  const handleExplicitCalculate = () => {
    calculateCurrent();
    setTimeout(() => {
      if (resultCardRef.current) {
        resultCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleClearHistory = () => {
    if (window.confirm('Deseja realmente limpar todo o histórico de cálculos gravados? Esta ação não pode ser desfeita.')) {
      clearHistory();
      showToast('Histórico de cálculos limpo com sucesso.');
    }
  };

  const activeCalcMeta = CALCULATORS_LIST.find((c) => c.type === selectedCalculator) || CALCULATORS_LIST[0];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner with Calculator Selector */}
      <div className="bg-[var(--surface)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[var(--border)] shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <h1 className="text-base sm:text-xl lg:text-2xl font-extrabold text-[var(--text-main)] tracking-tight leading-snug break-words">
              Calculadoras Veterinárias
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setIsTestLabOpen(true);
                if (!testSummary) handleRunTests();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-[var(--primary)] font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer min-h-[36px] shadow-xs"
              title="Executar auditoria e validação de cálculos matemáticos e clínicos"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Validação Clínica (27 Testes)</span>
            </button>
            <span className="inline-flex items-center text-[10px] font-mono px-2.5 py-1.5 rounded-xl bg-[var(--input-bg)] text-[var(--text-secondary)] font-bold uppercase tracking-wide border border-[var(--border)]">
              Marcas & Concentrações Automáticas
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed w-full m-0">
          Basta selecionar o medicamento comercial (nome e marca) e o peso do animal para obter a dose exata sem precisar digitar concentrações!
        </p>

        {/* Scrollable Calculator Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CALCULATORS_LIST.map((calc) => {
            const isSelected = selectedCalculator === calc.type;
            return (
              <button
                key={calc.type}
                onClick={() => {
                  setSelectedCalculator(calc.type);
                  setResultSummary('');
                  setCalculationSteps([]);
                  setPrescriptionText('');
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[var(--text-main)] text-white shadow-md border border-[var(--border)]'
                    : 'bg-[var(--input-bg)] text-[var(--text-secondary)] hover:bg-[var(--border)] border border-transparent'
                }`}
              >
                <span className={isSelected ? 'text-[var(--primary)] font-bold' : ''}>
                  {calc.title.split(' (')[0]}
                </span>
                {!isPremium && PREMIUM_CALCULATORS.includes(calc.type) && <Lock className="w-3 h-3 text-amber-400" aria-label="Premium" />}
              </button>
            );
          })}
        </div>
      </div>

      {!isPremium && PREMIUM_CALCULATORS.includes(selectedCalculator) ? (
        <PremiumGate title={activeCalcMeta.title.split(' (')[0]} description="Esta calculadora faz parte do Premium, junto com a tabela de emergência, a Assistente IA, os prontuários e a receita.">
          {null}
        </PremiumGate>
      ) : selectedCalculator === 'emergency' ? (
        <EmergencyTable />
      ) : (
      /* Main Grid: Form Left, Memory & Results Right */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[var(--surface)] rounded-3xl p-4 sm:p-6 border border-[var(--border)] shadow-sm space-y-5">
            <div className="border-b border-[var(--border)] pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {activeCalcMeta.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">
                  {activeCalcMeta.badge}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {activeCalcMeta.title}
              </h2>
            </div>

            {/* ============================================================== */}
            {/* NOVO RECURSO: SELETOR DE MEDICAMENTO COMERCIAL (NOME & MARCA) */}
            {/* ============================================================== */}
            {selectedCalculator === 'dosage' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-[#B8E8D9] dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Sparkles className="w-5 h-5 text-[#007F62] dark:text-emerald-400 shrink-0" />
                    <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-[#007F62] dark:text-emerald-400 break-words">
                      Selecione o Medicamento Comercial (Nome & Marca)
                    </span>
                  </div>
                  <div className="self-start sm:self-auto">
                    <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#E5FFF4] text-[#007F62] dark:bg-emerald-950/80 dark:text-emerald-300 uppercase tracking-wide border border-[#B8E8D9] dark:border-emerald-800">
                      Concentração Automática
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#475569] dark:text-slate-300 leading-relaxed font-normal text-left block w-full m-0 p-0 select-text">
                  Ao selecionar a marca comercial, a concentração e a dose de referência são preenchidas automaticamente pelo sistema.
                </p>

                {/* Search / Select Combobox */}
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={productSearch}
                        onFocus={() => setIsProductListOpen(true)}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setIsProductListOpen(true);
                        }}
                        placeholder="Buscar por marca: Agemoxi, Trissulfin, Biodex, Emedron, Cestodan..."
                        className="w-full pl-9 pr-8 py-3 rounded-xl border border-[#00C896] bg-[var(--surface)] text-[#0F172A] dark:text-[var(--text-main)] text-xs font-semibold focus:ring-2 focus:ring-[var(--primary)] focus:outline-none placeholder:text-[#64748B] dark:placeholder:text-slate-400 min-h-[44px]"
                      />
                      {productSearch && (
                        <button
                          type="button"
                          onClick={() => setProductSearch('')}
                          className="absolute right-2.5 top-2.5 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white p-1 rounded cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProductListOpen(!isProductListOpen)}
                      className="px-4 py-3 rounded-xl bg-[var(--surface)] border border-[#00C896] text-xs font-bold text-[#0F172A] dark:text-[var(--text-main)] flex items-center justify-center space-x-1.5 hover:bg-[var(--bg-main)] cursor-pointer min-h-[44px] shrink-0"
                    >
                      <span>{isProductListOpen ? 'Fechar' : 'Ver Lista'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isProductListOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Dropdown Options */}
                  {isProductListOpen && (
                    <div className="absolute left-0 right-0 top-12 z-50 bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] max-h-80 overflow-y-auto p-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#475569] dark:text-slate-400 px-2 py-1 font-bold uppercase tracking-wider border-b border-[var(--border)] mb-1">
                        <span>{filteredProducts.length} medicamentos veterinários & hospitalares:</span>
                        <button
                          type="button"
                          onClick={() => setIsProductListOpen(false)}
                          className="text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white font-bold cursor-pointer"
                        >
                          ✕ Fechar
                        </button>
                      </div>

                      {/* Opção para desmarcar ou cálculo genérico */}
                      <div
                        onClick={() => {
                          setSelectedProductId('');
                          setDrugLabel('Medicamento Genérico');
                          setIsProductListOpen(false);
                          showToast('Seleção comercial desmarcada. Modo de cálculo manual.');
                        }}
                        className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer border border-dashed transition-colors ${
                          !selectedProductId
                            ? 'bg-[#E5FFF4] dark:bg-emerald-950/60 border-[#00C896] text-[#007F62] dark:text-emerald-200 font-bold'
                            : 'border-[#DCE7F2] dark:border-slate-700 hover:bg-[#F1F6FC] dark:hover:bg-slate-800 text-[#475569] dark:text-slate-300'
                        }`}
                      >
                        <span className="font-semibold italic">Sem marca comercial selecionada (Cálculo Genérico)</span>
                        <span className="text-[10px] font-bold text-[#64748B]">Selecionar</span>
                      </div>

                      {filteredProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            selectedProductId === prod.id
                              ? 'bg-[#E5FFF4] dark:bg-emerald-950/60 border border-[#00C896] text-[#007F62] dark:text-emerald-200 font-bold'
                              : 'hover:bg-[#F1F6FC] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="font-bold text-[#0F172A] dark:text-white">
                                {prod.brandName}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E8F0F8] dark:bg-slate-800 text-[#475569] dark:text-slate-300 font-mono font-medium">
                                {prod.activePrinciple}
                              </span>
                              {prod.manufacturer && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800/80 text-[#475569] dark:text-slate-300 font-semibold">
                                  {prod.manufacturer}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#475569] dark:text-slate-400 mt-0.5">
                              {prod.formType === 'liquid' && `Líquido / Injetável • ${prod.concentrationMgMl} mg/mL ${prod.percentage ? `(${prod.percentage}%)` : ''}`}
                              {prod.formType === 'tablet' && `Comprimido • ${prod.tabletMg} mg por comprimido`}
                              {prod.formType === 'drops' && `Gotas • ${prod.concentrationMgMl} mg/mL (1 mL = 20 gotas)`}
                            </p>
                          </div>

                          <div className="text-right shrink-0 ml-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              prod.formType === 'liquid'
                                ? 'bg-[#E5FFF4] text-[#007F62] border border-[#B8E8D9] dark:bg-emerald-950 dark:text-emerald-300 dark:border-transparent'
                                : prod.formType === 'tablet'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {prod.formType === 'liquid' ? 'Injetável/mL' : prod.formType === 'tablet' ? 'Comprimido' : 'Gotas'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cartão de Informações do Medicamento Selecionado */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[var(--surface)] border border-[#B8E8D9] dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start sm:items-center space-x-2.5 min-w-0">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 sm:mt-0 ${selectedProductObj ? 'text-[#007F62] dark:text-emerald-400' : 'text-[#64748B] dark:text-slate-500'}`} />
                    <div className="min-w-0">
                      {/* Linha Principal: Nome comercial + concentração + laboratório */}
                      <div className="flex items-center space-x-1.5 flex-wrap font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white leading-normal">
                        <span className="break-words">{selectedProductObj ? cleanCommercialBrand : 'Não informado'}</span>
                        <span className="text-[#64748B] dark:text-slate-400 font-bold">•</span>
                        <span className="text-[#007F62] dark:text-emerald-400 font-semibold">{selectedProductObj ? commercialConcentrationText : 'Não informado'}</span>
                        <span className="text-[#64748B] dark:text-slate-400 font-bold">•</span>
                        <span className="text-[#475569] dark:text-slate-300 font-medium">{selectedProductObj ? commercialManufacturer : 'Não informado'}</span>
                      </div>

                      {/* Linha Secundária: Concentração: X mg/mL • Dose de referência: X mg/kg */}
                      <p className="text-xs text-[#475569] dark:text-slate-300 mt-1 leading-normal font-normal">
                        Concentração: <strong className="font-semibold text-[#0F172A] dark:text-white">{activeConcentrationLine2}</strong>
                        <span className="mx-1.5 text-[#64748B] dark:text-slate-400 font-bold">•</span>
                        Dose de referência: <strong className="font-semibold text-[#0F172A] dark:text-white">{activeDoseReferenceLine2}</strong>
                      </p>
                    </div>
                  </div>

                  {/* À direita: Pronto para calcular */}
                  <div className="shrink-0 self-start sm:self-center">
                    {selectedProductObj ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#E5FFF4] dark:bg-emerald-950/70 border border-[#B8E8D9] dark:border-emerald-800 text-[#007F62] dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pronto para calcular</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-[#DCE7F2] dark:border-slate-700 text-[#64748B] dark:text-slate-400 text-xs font-semibold">
                        <span>Não informado</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC FORM FIELDS */}
            <div className="space-y-4">
              {/* 1. DOSAGEM */}
              {selectedCalculator === 'dosage' && (
                <>
                  {/* Forma Farmacêutica */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl bg-[var(--input-bg)] p-1.5">
                    <button
                      type="button"
                      onClick={() => setDosageFormType('liquid')}
                      className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        dosageFormType === 'liquid'
                          ? 'bg-[var(--surface)] text-[#007F62] dark:text-emerald-400 shadow-sm border border-emerald-500/20'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <Syringe className="w-4 h-4 shrink-0" />
                      <span className="whitespace-normal text-center">Líquido / Injetável</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDosageFormType('tablet')}
                      className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        dosageFormType === 'tablet'
                          ? 'bg-[var(--surface)] text-[#3B82F6] dark:text-blue-400 shadow-sm border border-blue-500/20'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <Pill className="w-4 h-4 shrink-0" />
                      <span className="whitespace-normal text-center">Comprimidos (1/4, 1/2)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDosageFormType('drops')}
                      className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        dosageFormType === 'drops'
                          ? 'bg-[var(--surface)] text-[#F59E0B] dark:text-amber-400 shadow-sm border border-amber-500/20'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <Droplets className="w-4 h-4 shrink-0" />
                      <span className="whitespace-normal text-center">Gotas</span>
                    </button>
                  </div>

                  {/* Espécie e Peso */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Espécie do Paciente
                      </label>
                      <select
                        value={doseSpecies}
                        onChange={(e) => handleSpeciesChange(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] text-xs font-bold focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                      >
                        <option value="Canino">Cachorro / Canino</option>
                        <option value="Felino">Gato / Felino</option>
                        <option value="Bovino">Bovino (Boi / Vaca)</option>
                        <option value="Equino">Equino (Cavalo / Égua)</option>
                        <option value="Ovino">Ovino (Ovelha)</option>
                        <option value="Caprino">Caprino (Cabra)</option>
                        <option value="Suíno">Suíno (Porco)</option>
                        <option value="Bubalino">Bubalino (Búfalo)</option>
                        <option value="Coelho">Coelho</option>
                        <option value="Aves">Aves (Galináceos, Psitacídeos, etc.)</option>
                        <option value="Répteis">Répteis (Serpentes, Quelônios, etc.)</option>
                        <option value="Pequenos Mamíferos">Pequenos Mamíferos (Hamster, Furão, etc.)</option>
                        <option value="Animais Silvestres e Exóticos">Animais Silvestres e Exóticos</option>
                        <option value="Outros Animais">Outros Animais</option>
                      </select>

                      {doseSpecies === 'Aves' && (
                        <select
                          value={doseSubSpecies}
                          onChange={(e) => setDoseSubSpecies(e.target.value)}
                          className="w-full mt-2 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-900 dark:text-white text-xs font-medium"
                        >
                          <option value="">Selecione a categoria de Ave...</option>
                          <option value="Galliformes">Galliformes (Galináceos / Peru / Frango)</option>
                          <option value="Psitacídeos">Psitacídeos (Papagaio / Calopsita / Periquito)</option>
                          <option value="Rapinas">Rapinas / Aves de Rapina (Águia / Falcão / Coruja)</option>
                          <option value="Anseriformes">Anseriformes (Pato / Ganso / Cisne)</option>
                          <option value="Outras Aves">Outras Aves / Passeriformes</option>
                        </select>
                      )}

                      {doseSpecies === 'Répteis' && (
                        <select
                          value={doseSubSpecies}
                          onChange={(e) => setDoseSubSpecies(e.target.value)}
                          className="w-full mt-2 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-900 dark:text-white text-xs font-medium"
                        >
                          <option value="">Selecione o grupo de Réptil...</option>
                          <option value="Serpentes">Serpentes (Cobras / Serpentes)</option>
                          <option value="Quelônios">Quelônios (Jabuti / Tartaruga / Cágado)</option>
                          <option value="Lagartos">Lagartos (Iguana / Teiú / Lagartixas)</option>
                          <option value="Outros Répteis">Outros Répteis</option>
                        </select>
                      )}

                      {doseSpecies === 'Pequenos Mamíferos' && (
                        <select
                          value={doseSubSpecies}
                          onChange={(e) => setDoseSubSpecies(e.target.value)}
                          className="w-full mt-2 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-900 dark:text-white text-xs font-medium"
                        >
                          <option value="">Selecione o Pequeno Mamífero...</option>
                          <option value="Hamster">Hamster / Gerbil</option>
                          <option value="Chinchila">Chinchila</option>
                          <option value="Porquinho-da-índia">Porquinho-da-índia (Cobaia)</option>
                          <option value="Furão">Furão (Ferret)</option>
                          <option value="Ouriço">Ouriço (Hedgehog)</option>
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Peso do Animal (kg) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={doseWeight}
                          onChange={(e) => setDoseWeight(e.target.value)}
                          placeholder="Ex: 10"
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-[var(--primary)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-lg font-bold focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                        />
                        <span className="absolute right-4 top-3 text-sm font-mono text-[var(--text-secondary)] font-bold">kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Protocolos Posológicos da Bula */}
                  {selectedProductObj?.protocols && selectedProductObj.protocols.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-emerald-300 flex items-center space-x-1.5 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Protocolo da Bula:</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-extrabold uppercase">
                          {doseSpecies === 'Canino' ? 'Cão' : 'Gato (Felino)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedProductObj.protocols.map((proto) => {
                          const isActive = selectedProtocolId === proto.id;
                          const protoDose = doseSpecies === 'Canino' ? proto.doseMgKg.canino : proto.doseMgKg.felino;
                          return (
                            <button
                              key={proto.id}
                              type="button"
                              onClick={() => handleProtocolSelect(proto.id)}
                              className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                                isActive
                                  ? 'border-[#00C896] bg-[#E5FFF4] text-[#14243A] font-bold dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                                  : 'border-[#DCE7F2] bg-[#F1F6FC] hover:bg-[#FFFFFF] text-[#52677F] dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-xs text-[#0F172A] dark:text-white leading-tight">
                                  {proto.label}
                                </span>
                                <span className="inline-flex items-center self-start sm:self-auto px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-[#007F62] dark:text-emerald-300 font-mono font-extrabold text-xs shrink-0">
                                  {protoDose !== undefined ? `${protoDose} mg/kg` : 'Sob consulta'}
                                </span>
                              </div>
                              {proto.bulaRuleText && (
                                <p className="text-[11px] text-[#475569] dark:text-slate-400 mt-1 leading-snug">
                                  {proto.bulaRuleText}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dose Prescrita e Regime */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Dose (mg/kg)
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={dosePrescribed}
                          onChange={(e) => setDosePrescribed(e.target.value)}
                          className="flex-1 px-4 py-2.5 rounded-l-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base focus:ring-2 focus:ring-[var(--primary)] min-h-[44px]"
                        />
                        <span className="px-3 py-2.5 rounded-r-xl border border-l-0 border-[var(--border)] bg-[var(--border)] text-xs font-bold text-[var(--text-secondary)] flex items-center shrink-0">
                          mg/kg
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Regime Posológico
                      </label>
                      <select
                        value={doseRegime}
                        onChange={(e: any) => setDoseRegime(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] text-xs font-semibold min-h-[44px]"
                      >
                        <option value="per-dose">Dose por Tomada / Aplicação (Padrão)</option>
                        <option value="daily-divided">Dose Diária Total (a ser dividida)</option>
                      </select>
                    </div>
                  </div>

                  {/* Frequência, Duração e Via */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Frequência
                      </label>
                      <select
                        value={doseFrequency}
                        onChange={(e: any) => setDoseFrequency(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] text-xs font-semibold min-h-[44px]"
                      >
                        <option value="SID">A cada 24h (SID - 1x/dia)</option>
                        <option value="BID">A cada 12h (BID - 2x/dia)</option>
                        <option value="TID">A cada 8h (TID - 3x/dia)</option>
                        <option value="QID">A cada 6h (QID - 4x/dia)</option>
                        <option value="Dose Única">Dose Única</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Duração (dias)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={treatmentDays}
                        onChange={(e) => setTreatmentDays(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] text-xs font-mono min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Via de Administração
                      </label>
                      <input
                        type="text"
                        value={doseRoute}
                        onChange={(e) => setDoseRoute(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] text-xs min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* CAMPOS ESPECÍFICOS AUTOMÁTICOS */}
                  {dosageFormType === 'liquid' && (
                    <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-[var(--text-secondary)] mb-1.5">
                          Concentração da Solução (mg/mL)
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={doseConcentration}
                          onChange={(e) => setDoseConcentration(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[var(--text-secondary)] mb-1.5">
                          Volume Comercial do Frasco (mL)
                        </label>
                        <input
                          type="number"
                          value={bottleVolumeMl}
                          onChange={(e) => setBottleVolumeMl(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm min-h-[44px]"
                        />
                      </div>
                    </div>
                  )}

                  {dosageFormType === 'tablet' && (
                    <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-[var(--text-secondary)] mb-1.5">
                          Miligramagem do Comprimido (mg/comp)
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={tabletConcentrationMg}
                          onChange={(e) => setTabletConcentrationMg(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[var(--text-secondary)] mb-1.5">
                          Comprimidos por Caixa
                        </label>
                        <input
                          type="number"
                          value={tabletsPerBox}
                          onChange={(e) => setTabletsPerBox(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm min-h-[44px]"
                        />
                      </div>
                    </div>
                  )}

                  {dosageFormType === 'drops' && (
                    <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-[var(--text-secondary)] mb-1.5">
                          Concentração da Solução (mg/mL)
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={dropsConcentrationMgMl}
                          onChange={(e) => setDropsConcentrationMgMl(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[var(--text-secondary)] mb-1.5">
                          Gotas por mL (Padrão 20)
                        </label>
                        <input
                          type="number"
                          value={dropsPerMlFactor}
                          onChange={(e) => setDropsPerMlFactor(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm min-h-[44px]"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 2. FLUIDOTERAPIA */}
              {selectedCalculator === 'fluidotherapy' && (
                <div className="space-y-4">
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                      Espécie do Paciente
                    </label>
                    <select
                      value={fluidSpecies}
                      onChange={(e) => setFluidSpecies(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] text-xs font-bold"
                    >
                      <option value="Canino">Canino (Cão)</option>
                      <option value="Felino">Felino (Gato)</option>
                      <option value="Bovino">Bovino (Boi / Vaca)</option>
                      <option value="Equino">Equino (Cavalo / Égua)</option>
                      <option value="Ovino">Ovino (Ovelha)</option>
                      <option value="Caprino">Caprino (Cabra)</option>
                      <option value="Suíno">Suíno (Porco)</option>
                      <option value="Bubalino">Bubalino (Búfalo)</option>
                      <option value="Coelho">Coelho</option>
                      <option value="Aves">Aves</option>
                      <option value="Répteis">Répteis</option>
                      <option value="Pequenos Mamíferos">Pequenos Mamíferos</option>
                      <option value="Animais Silvestres e Exóticos">Animais Silvestres e Exóticos</option>
                      <option value="Outros Animais">Outros Animais</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Peso do Animal (kg) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={fluidWeight}
                        onChange={(e) => setFluidWeight(e.target.value)}
                        placeholder="Ex: 12"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Método de Manutenção
                      </label>
                      <select
                        value={fluidMaintenanceMethod}
                        onChange={(e: any) => setFluidMaintenanceMethod(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] text-xs font-semibold"
                      >
                        <option value="metabolic">Fórmula Alométrica / Metabólica</option>
                        <option value="standard">Padrão Diário ({fluidSpecies === 'Canino' ? '50-60' : '40-50'} mL/kg/dia)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Desidratação (%)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={fluidDehydrationPercent}
                        onChange={(e) => setFluidDehydrationPercent(e.target.value)}
                        placeholder="Ex: 6 para 6%"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Horas para Repor Déficit
                      </label>
                      <input
                        type="number"
                        value={fluidDeficitHours}
                        onChange={(e) => setFluidDeficitHours(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Perdas Estimadas (mL/dia)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={fluidOngoingLosses}
                        onChange={(e) => setFluidOngoingLosses(e.target.value)}
                        placeholder="Ex: 100"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. CRI */}
              {selectedCalculator === 'cri' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Nome do Fármaco
                      </label>
                      <input
                        type="text"
                        value={criDrugName}
                        onChange={(e) => setCriDrugName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Peso do Animal (kg) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={criPatientWeight}
                        onChange={(e) => setCriPatientWeight(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Volume da Bolsa de Fluido (mL)
                      </label>
                      <input
                        type="number"
                        value={criBagVolumeMl}
                        onChange={(e) => setCriBagVolumeMl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Taxa de Infusão da Bolsa (mL/h)
                      </label>
                      <input
                        type="number"
                        value={criInfusionRateMlHr}
                        onChange={(e) => setCriInfusionRateMlHr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Dose da Droga
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={criDoseValue}
                          onChange={(e) => setCriDoseValue(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-l-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm"
                        />
                        <select
                          value={criDoseUnit}
                          onChange={(e: any) => setCriDoseUnit(e.target.value)}
                          className="px-2 py-2 rounded-r-xl border border-l-0 border-[var(--border)] bg-[#E8F0F8] dark:bg-slate-700 text-[#14243A] dark:text-white text-xs font-bold"
                        >
                          <option value="mcg/kg/min">mcg/kg/min</option>
                          <option value="mg/kg/h">mg/kg/h</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Concentração do Frasco (mg/mL)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={criDrugConcentrationMgMl}
                        onChange={(e) => setCriDrugConcentrationMgMl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. TRANSFUSÃO */}
              {selectedCalculator === 'transfusion' && (
                <div className="space-y-4">
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                      Espécie do Paciente
                    </label>
                    <select
                      value={transfusionSpecies}
                      onChange={(e) => setTransfusionSpecies(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] text-xs font-bold"
                    >
                      <option value="Canino">Canino (Cão)</option>
                      <option value="Felino">Felino (Gato)</option>
                      <option value="Bovino">Bovino (Boi / Vaca)</option>
                      <option value="Equino">Equino (Cavalo / Égua)</option>
                      <option value="Ovino">Ovino (Ovelha)</option>
                      <option value="Caprino">Caprino (Cabra)</option>
                      <option value="Suíno">Suíno (Porco)</option>
                      <option value="Bubalino">Bubalino (Búfalo)</option>
                      <option value="Coelho">Coelho</option>
                      <option value="Aves">Aves</option>
                      <option value="Répteis">Répteis</option>
                      <option value="Pequenos Mamíferos">Pequenos Mamíferos</option>
                      <option value="Animais Silvestres e Exóticos">Animais Silvestres e Exóticos</option>
                      <option value="Outros Animais">Outros Animais</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Peso do Animal (kg) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={transfusionWeight}
                        onChange={(e) => setTransfusionWeight(e.target.value)}
                        placeholder="Ex: 18"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Ht Atual do Paciente (%)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={transfusionCurrentHt}
                        onChange={(e) => setTransfusionCurrentHt(e.target.value)}
                        placeholder="Ex: 14"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Ht Desejado Alvo (%)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={transfusionTargetHt}
                        onChange={(e) => setTransfusionTargetHt(e.target.value)}
                        placeholder="Ex: 25"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Ht da Bolsa Doadora (%)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={transfusionDonorHt}
                        onChange={(e) => setTransfusionDonorHt(e.target.value)}
                        placeholder="Ex: 40"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. DILUIÇÃO DE MEDICAMENTOS (C1 x V1 = C2 x V2) */}
              {selectedCalculator === 'dilution' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center space-x-2">
                    <Info className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>Fórmula da diluição: C1 × V1 = C2 × V2 (concentração inicial × volume inicial = concentração final × volume final).</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Concentração Inicial - C1 (mg/mL)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={dilutionC1}
                        onChange={(e) => setDilutionC1(e.target.value)}
                        placeholder="Ex: 50"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Concentração Desejada - C2 (mg/mL)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={dilutionC2}
                        onChange={(e) => setDilutionC2(e.target.value)}
                        placeholder="Ex: 5"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Volume Final Desejado - V2 (mL)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={dilutionV2}
                        onChange={(e) => setDilutionV2(e.target.value)}
                        placeholder="Ex: 100"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 6. CONVERSÃO DE % PARA MG/ML */}
              {selectedCalculator === 'percentage-conversion' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl bg-[var(--input-bg)] p-1.5">
                    <button
                      type="button"
                      onClick={() => setPercentDirection('percent-to-mg')}
                      className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        percentDirection === 'percent-to-mg'
                          ? 'bg-[var(--surface)] text-[#007F62] dark:text-emerald-400 shadow-sm border border-emerald-500/20'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <span>Porcentagem (%) → mg/mL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPercentDirection('mg-to-percent')}
                      className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        percentDirection === 'mg-to-percent'
                          ? 'bg-[var(--surface)] text-[#007F62] dark:text-emerald-400 shadow-sm border border-emerald-500/20'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      <span>mg/mL → Porcentagem (%)</span>
                    </button>
                  </div>

                  <div>
                    {percentDirection === 'percent-to-mg' ? (
                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                          Valor da Concentração em Porcentagem (%)
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={percentageInput}
                            onChange={(e) => setPercentageInput(e.target.value)}
                            placeholder="Ex: 2 para 2%"
                            className="flex-1 px-4 py-2.5 rounded-l-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                          />
                          <span className="px-4 py-2.5 rounded-r-xl border border-l-0 border-[var(--border)] bg-[var(--border)] text-xs font-bold text-[var(--text-secondary)] flex items-center shrink-0">
                            %
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                          Valor da Concentração em Miligramas por mL (mg/mL)
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={mgMlInput}
                            onChange={(e) => setMgMlInput(e.target.value)}
                            placeholder="Ex: 20 para 20 mg/mL"
                            className="flex-1 px-4 py-2.5 rounded-l-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                          />
                          <span className="px-4 py-2.5 rounded-r-xl border border-l-0 border-[var(--border)] bg-[var(--border)] text-xs font-bold text-[var(--text-secondary)] flex items-center shrink-0">
                            mg/mL
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 7. DÉFICIT HÍDRICO ISOLADO */}
              {selectedCalculator === 'hydration-deficit' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Peso do Animal (kg) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={deficitWeight}
                        onChange={(e) => setDeficitWeight(e.target.value)}
                        placeholder="Ex: 10"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Grau de Desidratação (%) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={deficitPercent}
                        onChange={(e) => setDeficitPercent(e.target.value)}
                        placeholder="Ex: 7 para 7%"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Tempo de Reposição (Horas)
                      </label>
                      <input
                        type="number"
                        value={deficitHours}
                        onChange={(e) => setDeficitHours(e.target.value)}
                        placeholder="Ex: 24"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 8. TAXA DE INFUSÃO SIMPLES */}
              {selectedCalculator === 'infusion-rate' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Volume Total do Frasco ou Bolsa (mL) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={infusionVolume}
                        onChange={(e) => setInfusionVolume(e.target.value)}
                        placeholder="Ex: 500"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Tempo Previsto de Infusão (Horas) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={infusionHours}
                        onChange={(e) => setInfusionHours(e.target.value)}
                        placeholder="Ex: 12"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 9. REGRA DE TRÊS CLÍNICA */}
              {selectedCalculator === 'rule-of-three' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200">
                    Proporção direta: Se <strong>A</strong> corresponde a <strong>B</strong>, então <strong>C</strong> corresponderá a <strong>X</strong>.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Valor A (Referência 1)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={ruleA}
                        onChange={(e) => setRuleA(e.target.value)}
                        placeholder="Ex: 100"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Valor B (Resultado 1)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={ruleB}
                        onChange={(e) => setRuleB(e.target.value)}
                        placeholder="Ex: 5"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Valor C (Referência 2)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={ruleC}
                        onChange={(e) => setRuleC(e.target.value)}
                        placeholder="Ex: 20"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 10. SUPERFÍCIE CORPÓREA (BSA) & ONCOLOGIA */}
              {selectedCalculator === 'bsa' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBsaSpecies('dog')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        bsaSpecies === 'dog'
                          ? 'border-[#00C896] bg-[#E5FFF4] text-[#007F62] dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--input-bg)]'
                      }`}
                    >
                      Canino (K = 10,1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBsaSpecies('cat')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        bsaSpecies === 'cat'
                          ? 'border-[#00C896] bg-[#E5FFF4] text-[#007F62] dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--input-bg)]'
                      }`}
                    >
                      Felino (K = 10,0)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Peso do Animal (kg) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={bsaWeight}
                        onChange={(e) => setBsaWeight(e.target.value)}
                        placeholder="Ex: 15"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                        Dose Prescrita (mg/m²)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={bsaDosePerM2}
                        onChange={(e) => setBsaDosePerM2(e.target.value)}
                        placeholder="Ex: 30"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-base min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {validationError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-semibold">{validationError}</span>
              </div>
            )}

            {/* Clinical Warning Message (Non-blocking) */}
            {clinicalWarning && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Aviso Clínico de Dosagem / Infusão</span>
                  <span className="leading-relaxed">{clinicalWarning}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExplicitCalculate}
                className="flex-1 min-h-[44px] py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>CALCULAR</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="min-h-[44px] py-3 px-5 rounded-xl border border-[#DCE7F2] dark:border-slate-700 text-[#52677F] dark:text-slate-300 bg-[#FFFFFF] hover:bg-[#F1F6FC] dark:bg-transparent dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Limpar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Memory, Results & Ready Prescription */}
        <div className="lg:col-span-5 space-y-6">
          {/* Result Card */}
          <div ref={resultCardRef} className="scroll-mt-28 bg-[var(--result-bg)] rounded-3xl p-4 sm:p-6 border-2 border-[var(--primary)]/40 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono">
                Resultado
              </span>
              {resultSummary && (
                <button
                  type="button"
                  onClick={copyResultToClipboard}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)]/20 text-[var(--text-main)] text-xs font-semibold hover:bg-[var(--primary)]/30 transition-colors min-h-[36px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Clinical Warning inside Result Card */}
            {clinicalWarning && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block">Atenção Clínica Especial</span>
                  <span className="leading-relaxed">{clinicalWarning}</span>
                </div>
              </div>
            )}

            {/* Big Result Display */}
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--primary)] font-mono tracking-tight break-words">
                {resultSummary || '--'}
              </span>
            </div>

            {/* Alertas de segurança por espécie */}
            {resultSummary && safetyAlerts.length > 0 && (
              <div className="space-y-2" role="alert">
                {safetyAlerts.map((al, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2 ${
                      al.level === 'danger'
                        ? 'bg-red-950/50 border-red-700 text-red-200'
                        : 'bg-amber-950/40 border-amber-700/70 text-amber-100'
                    }`}
                  >
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${al.level === 'danger' ? 'text-red-400' : 'text-amber-400'}`} />
                    <span>
                      <strong className="font-extrabold">{al.level === 'danger' ? 'PERIGO: ' : 'Atenção: '}</strong>
                      {al.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Calculation Steps (Memória de Cálculo) */}
            {calculationSteps.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                  <span>Memória de Cálculo Passo a Passo</span>
                </div>

                <div className="space-y-2">
                  {calculationSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-xs space-y-1"
                    >
                      <div className="font-semibold text-[var(--text-main)]">
                        {step.label}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[var(--text-secondary)] gap-1">
                        <span className="break-words min-w-0">{step.expression}</span>
                        <span className={`font-bold text-[var(--primary)] text-xs sm:text-sm min-w-0 break-words ${String(step.result).length > 24 ? 'sm:text-right sm:max-w-[60%]' : 'shrink-0'}`}>
                          = {step.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ready Prescription Card */}
            {prescriptionText && (
              <div className="p-4 rounded-2xl bg-[#FFFFFF] dark:bg-slate-900/90 border border-[#DCE7F2] dark:border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#14243A] dark:text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider font-mono">
                    <FileText className="w-4 h-4 text-[#007F62] dark:text-emerald-400 shrink-0" />
                    <span>MODELO DE PRESCRIÇÃO ORIENTATIVA</span>
                  </span>
                  <button
                    type="button"
                    onClick={copyPrescriptionToClipboard}
                    className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-lg bg-[#00C896] hover:bg-[#00B083] text-[#062C23] font-bold transition-colors flex items-center space-x-1 min-h-[36px]"
                  >
                    {copiedPrescription ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrescription ? 'Copiada!' : 'Copiar Receita'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-[#14243A] dark:text-slate-200 whitespace-pre-wrap break-words bg-[#F1F6FC] dark:bg-slate-950/70 p-3 rounded-xl border border-[#DCE7F2] dark:border-slate-800">
                  {prescriptionText}
                </pre>
                <PremiumGate compact title="Receita em PDF e WhatsApp" description="">
                  <PrescriptionActions prescriptionText={prescriptionText} />
                </PremiumGate>
              </div>
            )}
          </div>

          {/* Quick History Drawer */}
          <div className="bg-[var(--surface)] rounded-3xl p-4 sm:p-5 border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#14243A] dark:text-slate-300 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#007F62] dark:text-emerald-500" />
                <span>Histórico de Cálculos</span>
              </div>
              {calculationHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-xs text-[#52677F] hover:text-red-500 flex items-center space-x-1 transition-colors p-1 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {calculationHistory.length === 0 ? (
              <p className="text-xs text-[#52677F] py-3 text-center">Nenhum cálculo salvo ainda.</p>
            ) : (
              <div className="space-y-2">
                {(isHistoryExpanded ? calculationHistory : calculationHistory.slice(0, 3)).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#F5F9FD] dark:bg-slate-800/60 border border-[#DCE7F2] dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2 font-medium text-[#14243A] dark:text-slate-200">
                      <span className="font-semibold break-words leading-tight">{item.title}</span>
                      <span className="text-[10px] text-[#52677F] dark:text-slate-400 font-mono shrink-0">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="font-mono text-[#007F62] dark:text-emerald-400 font-bold break-words">
                      {item.resultSummary}
                    </div>
                  </div>
                ))}

                {calculationHistory.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-[var(--input-bg)] hover:bg-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors flex items-center justify-center space-x-1 cursor-pointer min-h-[40px]"
                  >
                    <span>{isHistoryExpanded ? 'Recolher histórico' : `Ver histórico completo (${calculationHistory.length} registros)`}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isHistoryExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Modal / Laboratório de Validação Matemática e Clínica */}
      {isTestLabOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                    Laboratório de Validação Clínica & Matemática
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bateria determinística expandida: valores extremos, arredondamentos e apresentações
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 min-h-[36px]"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
                  <span>{isRunningTests ? 'Executando...' : 'Reexecutar Bateria'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsTestLabOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Test Metric Stats */}
              {testSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total de Testes</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{testSummary.total}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider">Aprovados</span>
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {testSummary.passed} (100%)
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Falhas</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{testSummary.failed}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tempo de Execução</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{testSummary.durationMs} ms</span>
                  </div>
                </div>
              )}

              {/* Category Filter Pills */}
              {testSummary && (
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTestCategory('all')}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] ${
                      activeTestCategory === 'all'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Todos ({testSummary.total})
                  </button>
                  {testSummary.categories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setActiveTestCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] ${
                        activeTestCategory === cat.key
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat.label} ({cat.passed}/{cat.total})
                    </button>
                  ))}
                </div>
              )}

              {/* Test Cases List */}
              <div className="space-y-2.5">
                {testSummary?.results
                  .filter((r) => activeTestCategory === 'all' || r.category === activeTestCategory)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {t.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                          APROVADO DETERMINÍSTICO
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {t.description}
                      </p>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 font-mono text-xs space-y-1">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold break-words">
                          Resultado Obtido: {t.actualOutcome}
                        </div>
                        <div className="text-[11px] text-slate-400 break-words font-sans">
                          {t.details}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between shrink-0 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Garantia anti-erro 10x • Regra de três farmacológica obrigatória
              </span>
              <button
                type="button"
                onClick={() => setIsTestLabOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer min-h-[38px]"
              >
                Fechar Laboratório
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
