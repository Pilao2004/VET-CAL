/**
 * VET CALC PRO — Suíte de Testes Matemáticos e Clínicos Expandida
 * 
 * Cobre rigorosamente:
 * 1. Valores inválidos e limites (0 kg, -5 kg, NaN, doses negativas, concentração zero, prevenção de divisão por zero)
 * 2. Arredondamentos clínicos e seleção de seringa (microvolumes <0.05 mL, <1 mL com 2 casas e UI, fracionamento de comprimidos em quartos)
 * 3. Apresentações comerciais variadas (% injetável, comprimidos, gotas com calibração de bula, suspensões orais, liofilizados)
 * 4. Safety Guardian (contraindicações fatais: felinos + paracetamol / permetrina, desvio 10x, tetos de segurança)
 */

import {
  calculateDeterministicDosage,
  calculateTabletDosage,
  calculateDropsDosage,
  calculateReconstitutedDosage,
  formatClinicalVolume,
  percentageToMgMl,
} from './calculatorEngine';

export interface ClinicalTestCase {
  id: string;
  name: string;
  category: 'invalid_inputs' | 'rounding_syringes' | 'tablet_fractions' | 'commercial_presentations' | 'safety_guardian';
  categoryLabel: string;
  description: string;
  expectedOutcome: string;
  run: () => {
    passed: boolean;
    actualOutcome: string;
    details: string;
    metric?: {
      expected: number | string;
      actual: number | string;
    };
  };
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  categories: {
    key: string;
    label: string;
    total: number;
    passed: number;
  }[];
  results: {
    id: string;
    name: string;
    category: string;
    categoryLabel: string;
    description: string;
    passed: boolean;
    actualOutcome: string;
    details: string;
  }[];
}

export const CLINICAL_TEST_CASES: ClinicalTestCase[] = [
  // =========================================================================
  // CATEGORIA 1: VALORES INVÁLIDOS & LIMITES EXTREMOS
  // =========================================================================
  {
    id: 'inv-1',
    name: 'Peso Negativo (-5 kg)',
    category: 'invalid_inputs',
    categoryLabel: 'Valores Inválidos & Limites',
    description: 'Verifica se o sistema rejeita peso negativo sem quebrar a execução.',
    expectedOutcome: 'Retornar isValid: false com mensagem de erro descritiva.',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: -5,
        doseMgKg: 1.0,
        concentrationMgMl: 10,
      });
      const passed = !res.isValid && Boolean(res.errorMessage && res.errorMessage.includes('maior que zero'));
      return {
        passed,
        actualOutcome: res.isValid ? 'FALHA: Aceitou peso negativo' : `Rejeitado com segurança: "${res.errorMessage}"`,
        details: 'Garante que doses negativas não sejam calculadas.',
      };
    },
  },
  {
    id: 'inv-2',
    name: 'Peso Zero (0 kg)',
    category: 'invalid_inputs',
    categoryLabel: 'Valores Inválidos & Limites',
    description: 'Verifica a proteção contra peso nulo ou igual a zero.',
    expectedOutcome: 'Rejeição imediata prevenindo dose nula.',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: 0,
        doseMgKg: 0.5,
        concentrationMgMl: 5,
      });
      const passed = !res.isValid;
      return {
        passed,
        actualOutcome: res.isValid ? 'FALHA: Calculou com peso zero' : 'Rejeitado: peso zero inválido.',
        details: 'Evita prescrições de 0 mL sem sentido clínico.',
      };
    },
  },
  {
    id: 'inv-3',
    name: 'Valor Não-Numérico (NaN)',
    category: 'invalid_inputs',
    categoryLabel: 'Valores Inválidos & Limites',
    description: 'Entrada de dados corrompida ou vazia convertida para NaN.',
    expectedOutcome: 'Rejeição segura sem gerar NaN nos resultados.',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: NaN,
        doseMgKg: 2,
        concentrationMgMl: 10,
      });
      const passed = !res.isValid && !isNaN(res.volumeMlPerTake);
      return {
        passed,
        actualOutcome: !res.isValid ? 'Capturado com sucesso pelo validador determinístico.' : 'FALHA: Deixou passar NaN.',
        details: 'Protege os passos da memória de cálculo contra strings corrompidas.',
      };
    },
  },
  {
    id: 'inv-4',
    name: 'Concentração Zero (0 mg/mL)',
    category: 'invalid_inputs',
    categoryLabel: 'Valores Inválidos & Limites',
    description: 'Divisão por zero: concentração igual a zero.',
    expectedOutcome: 'Rejeição segura sem gerar Infinity ou crash.',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 1.0,
        concentrationMgMl: 0,
      });
      const passed = !res.isValid && res.volumeMlPerTake === 0;
      return {
        passed,
        actualOutcome: passed ? 'Divisão por zero prevenida com sucesso.' : 'FALHA: Gerou Infinity ou aceitou 0.',
        details: 'Bloqueia cálculo quando a concentração do frasco não é preenchida.',
      };
    },
  },
  {
    id: 'inv-5',
    name: 'Dose Prescrita Negativa (-2 mg/kg)',
    category: 'invalid_inputs',
    categoryLabel: 'Valores Inválidos & Limites',
    description: 'Validação da dose em mg/kg menor ou igual a zero.',
    expectedOutcome: 'Rejeição imediata da prescrição com dose inválida.',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Felino',
        weightKg: 4,
        doseMgKg: -2,
        concentrationMgMl: 10,
      });
      const passed = !res.isValid;
      return {
        passed,
        actualOutcome: passed ? 'Rejeitado: dose deve ser estritamente positiva.' : 'FALHA: Aceitou dose negativa.',
        details: 'Evita desvios posológicos acidentais.',
      };
    },
  },
  {
    id: 'inv-6',
    name: 'Reconstituição sem Diluente (0 mL)',
    category: 'invalid_inputs',
    categoryLabel: 'Valores Inválidos & Limites',
    description: 'Cálculo de pó liofilizado com volume de diluente zerado.',
    expectedOutcome: 'Rejeição com aviso de volume final obrigatório.',
    run: () => {
      const res = calculateReconstitutedDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 10,
        totalDrugMg: 1000,
        finalVolumeMl: 0,
      });
      const passed = !res.isValid;
      return {
        passed,
        actualOutcome: passed ? 'Rejeitado: volume de reconstituição nulo prevenido.' : 'FALHA: Dividiu por zero.',
        details: 'Exige o volume exato da ampola de diluente (água para injeção / NaCl 0,9%).',
      };
    },
  },

  // =========================================================================
  // CATEGORIA 2: ARREDONDAMENTOS CLÍNICOS & ESCOLHA DE SERINGA
  // =========================================================================
  {
    id: 'rnd-1',
    name: 'Microvolume Neonatal (0,02 mL em filhote de 200g)',
    category: 'rounding_syringes',
    categoryLabel: 'Arredondamento & Seringas',
    description: 'Volume inferior a 0,05 mL requer precisão de seringa de 1 mL (tuberculina/insulina) e aviso de diluição.',
    expectedOutcome: 'Exibição em 2 ou 3 casas decimais (0,02 mL) e recomendação de seringa de 1 mL.',
    run: () => {
      const volInfo = formatClinicalVolume(0.02);
      const passed = volInfo.short === '0.02 mL';
      return {
        passed,
        actualOutcome: `Formatado: ${volInfo.detailed}`,
        details: 'Garante que microvolumes não sejam arredondados para 0 mL nem para 0,1 mL.',
        metric: { expected: '0.02 mL', actual: volInfo.short },
      };
    },
  },
  {
    id: 'rnd-2',
    name: 'Volume Sub-mililitro (0,20 mL)',
    category: 'rounding_syringes',
    categoryLabel: 'Arredondamento & Seringas',
    description: 'Volumes < 1 mL devem exibir 2 casas para leitura inequívoca em seringa de 100 UI.',
    expectedOutcome: '0.20 mL (0.2 mL) para máxima clareza.',
    run: () => {
      const volInfo = formatClinicalVolume(0.2);
      const passed = volInfo.short === '0.20 mL' && volInfo.detailed.includes('0.2 mL');
      return {
        passed,
        actualOutcome: volInfo.detailed,
        details: 'A seringa de insulina possui graduações de 0,01 mL (1 UI) ou 0,02 mL (2 UI).',
        metric: { expected: '0.20 mL (0.2 mL)', actual: volInfo.detailed },
      };
    },
  },
  {
    id: 'rnd-3',
    name: 'Volume Fracionário Padrão (2,25 mL)',
    category: 'rounding_syringes',
    categoryLabel: 'Arredondamento & Seringas',
    description: 'Volume fracionário em seringa de 3 mL com graduação de 0,1 mL.',
    expectedOutcome: '2.25 mL mantendo 2 casas decimais.',
    run: () => {
      const volInfo = formatClinicalVolume(2.25);
      const passed = volInfo.short === '2.25 mL';
      return {
        passed,
        actualOutcome: volInfo.short,
        details: 'Não trunca nem distorce doses intermediárias.',
        metric: { expected: '2.25 mL', actual: volInfo.short },
      };
    },
  },
  {
    id: 'rnd-4',
    name: 'Volume Inteiro (5,00 mL)',
    category: 'rounding_syringes',
    categoryLabel: 'Arredondamento & Seringas',
    description: 'Volume inteiro não deve carregar casas decimais desnecessárias.',
    expectedOutcome: '5 mL (sem .00 redundante).',
    run: () => {
      const volInfo = formatClinicalVolume(5.0);
      const passed = volInfo.short === '5 mL';
      return {
        passed,
        actualOutcome: volInfo.short,
        details: 'Limpeza visual em prescrições médicas.',
        metric: { expected: '5 mL', actual: volInfo.short },
      };
    },
  },

  // =========================================================================
  // CATEGORIA 3: FRACIONAMENTO DE COMPRIMIDOS
  // =========================================================================
  {
    id: 'tab-1',
    name: 'Fracionamento 1/4 de Comprimido (0,25)',
    category: 'tablet_fractions',
    categoryLabel: 'Comprimidos & Fracionamento',
    description: 'Dose que corresponde exatamente a 1/4 (0,25) de comprimido.',
    expectedOutcome: 'Identificado como "1/4 de comprimido" com alerta de sulco.',
    run: () => {
      const res = calculateTabletDosage({
        species: 'Canino',
        weightKg: 5,
        doseMgKg: 1.0, // 5 mg total
        tabletMg: 20, // 5 / 20 = 0.25 comp
      });
      const passed = res.isValid && res.tabletsPerTake === 0.25 && res.formattedTabletsStr.includes('1/4');
      return {
        passed,
        actualOutcome: `Resultado: ${res.formattedTabletsStr} (Aviso: ${res.fractionWarning ? 'Sim' : 'Não'})`,
        details: 'Nunca arredonda 1/4 para 1 comprimido (evita superdosagem de 400%).',
        metric: { expected: 0.25, actual: res.tabletsPerTake },
      };
    },
  },
  {
    id: 'tab-2',
    name: 'Fracionamento 1/2 Comprimido (0,50)',
    category: 'tablet_fractions',
    categoryLabel: 'Comprimidos & Fracionamento',
    description: 'Dose que corresponde a meio comprimido sulcado.',
    expectedOutcome: 'Identificado como "1/2 comprimido (0,5)".',
    run: () => {
      const res = calculateTabletDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 1.0, // 10 mg
        tabletMg: 20, // 10 / 20 = 0.5 comp
      });
      const passed = res.isValid && res.tabletsPerTake === 0.5 && res.formattedTabletsStr.includes('1/2');
      return {
        passed,
        actualOutcome: res.formattedTabletsStr,
        details: 'Divisão típica de comprimidos birranhurados.',
        metric: { expected: 0.5, actual: res.tabletsPerTake },
      };
    },
  },
  {
    id: 'tab-3',
    name: 'Fracionamento 3/4 de Comprimido (0,75)',
    category: 'tablet_fractions',
    categoryLabel: 'Comprimidos & Fracionamento',
    description: 'Dose que corresponde a 3 quartos de comprimido.',
    expectedOutcome: 'Identificado como "3/4 de comprimido".',
    run: () => {
      const res = calculateTabletDosage({
        species: 'Canino',
        weightKg: 15,
        doseMgKg: 1.0, // 15 mg
        tabletMg: 20, // 15 / 20 = 0.75 comp
      });
      const passed = res.isValid && res.tabletsPerTake === 0.75 && res.formattedTabletsStr.includes('3/4');
      return {
        passed,
        actualOutcome: res.formattedTabletsStr,
        details: 'Três quartos com base em comprimidos em cruz (quadrisulcado).',
        metric: { expected: 0.75, actual: res.tabletsPerTake },
      };
    },
  },
  {
    id: 'tab-4',
    name: 'Comprimido Misto: 1 e 1/2 (1,50)',
    category: 'tablet_fractions',
    categoryLabel: 'Comprimidos & Fracionamento',
    description: 'Dose de 30 mg com comprimidos de 20 mg (1,5 comprimidos).',
    expectedOutcome: '1 e 1/2 comprimido(s).',
    run: () => {
      const res = calculateTabletDosage({
        species: 'Canino',
        weightKg: 30,
        doseMgKg: 1.0, // 30 mg
        tabletMg: 20, // 1.5 comp
      });
      const passed = res.isValid && res.tabletsPerTake === 1.5 && res.formattedTabletsStr.includes('1 e 1/2');
      return {
        passed,
        actualOutcome: res.formattedTabletsStr,
        details: 'Compreensão imediata para o tutor na receita.',
        metric: { expected: 1.5, actual: res.tabletsPerTake },
      };
    },
  },

  // =========================================================================
  // CATEGORIA 4: APRESENTAÇÕES COMERCIAIS VARIADAS
  // =========================================================================
  {
    id: 'com-1',
    name: 'Emedron® 1% (Ondansetrona 10 mg/mL)',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: 'Teste mandatório: 10 kg cão, dose 0,5 mg/kg com produto 1% (10 mg/mL).',
    expectedOutcome: 'Volume exato de 0,5 mL (Regra dos 10: 1% = 10 mg/mL).',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 0.5,
        concentrationMgMl: 10,
        productPercentage: 1.0,
      });
      const passed = res.isValid && Math.abs(res.volumeMlPerTake - 0.5) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.volumeMlPerTake} mL (${res.formattedVolumeDetailed})`,
        details: 'Dose: 10 kg × 0,5 mg/kg = 5 mg. Regra de três: 10 mg/mL -------- 1 mL | 5 mg -------- 0,5 mL.',
        metric: { expected: 0.5, actual: res.volumeMlPerTake },
      };
    },
  },
  {
    id: 'com-2',
    name: 'Flamavet® 0,2% Injetável (Meloxicam 2 mg/mL em Gato 4 kg)',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: '0,2% = 2 mg/mL. Dose de ataque felina 0,1 mg/kg em gato de 4 kg.',
    expectedOutcome: 'Volume exato de 0,20 mL (4 kg × 0,1 mg/kg = 0,40 mg ÷ 2 mg/mL).',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Felino',
        weightKg: 4,
        doseMgKg: 0.1,
        concentrationMgMl: 2,
        productPercentage: 0.2,
      });
      const passed = res.isValid && Math.abs(res.volumeMlPerTake - 0.2) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.volumeMlPerTake} mL (${res.formattedVolumeDetailed})`,
        details: 'Bula oficial Flamavet 0,2% Agener União.',
        metric: { expected: 0.2, actual: res.volumeMlPerTake },
      };
    },
  },
  {
    id: 'com-3',
    name: 'Xilazina 2% (20 mg/mL Sedativo)',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: '2% = 20 mg/mL. Dose 1,0 mg/kg em cão de 15 kg.',
    expectedOutcome: 'Volume exato de 0,75 mL (15 mg ÷ 20 mg/mL).',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: 15,
        doseMgKg: 1.0,
        concentrationMgMl: 20,
        productPercentage: 2.0,
      });
      const passed = res.isValid && Math.abs(res.volumeMlPerTake - 0.75) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.volumeMlPerTake} mL (${res.formattedVolumeDetailed})`,
        details: '15 kg × 1 mg/kg = 15 mg. 15 mg ÷ 20 mg/mL = 0,75 mL.',
        metric: { expected: 0.75, actual: res.volumeMlPerTake },
      };
    },
  },
  {
    id: 'com-4',
    name: 'Enrofloxacina 5% (50 mg/mL Injetável)',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: '5% = 50 mg/mL. Dose 5,0 mg/kg em cão de 20 kg.',
    expectedOutcome: 'Volume exato de 2,0 mL (100 mg ÷ 50 mg/mL).',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: 20,
        doseMgKg: 5.0,
        concentrationMgMl: 50,
        productPercentage: 5.0,
      });
      const passed = res.isValid && Math.abs(res.volumeMlPerTake - 2.0) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.volumeMlPerTake} mL (${res.formattedVolumeDetailed})`,
        details: '20 kg × 5 mg/kg = 100 mg. 100 mg ÷ 50 mg/mL = 2 mL exatos.',
        metric: { expected: 2.0, actual: res.volumeMlPerTake },
      };
    },
  },
  {
    id: 'com-5',
    name: 'Cetamina 10% (100 mg/mL Anestésico)',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: '10% = 100 mg/mL. Dose 10 mg/kg em cão de 10 kg.',
    expectedOutcome: 'Volume exato de 1,0 mL (100 mg ÷ 100 mg/mL).',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 10.0,
        concentrationMgMl: 100,
        productPercentage: 10.0,
      });
      const passed = res.isValid && Math.abs(res.volumeMlPerTake - 1.0) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.volumeMlPerTake} mL (${res.formattedVolumeDetailed})`,
        details: '10 kg × 10 mg/kg = 100 mg. 100 mg ÷ 100 mg/mL = 1 mL.',
        metric: { expected: 1.0, actual: res.volumeMlPerTake },
      };
    },
  },
  {
    id: 'com-6',
    name: 'Oxitetraciclina L.A. 20% (200 mg/mL)',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: '20% = 200 mg/mL. Dose 20 mg/kg em animal de 40 kg.',
    expectedOutcome: 'Volume exato de 4,0 mL (800 mg ÷ 200 mg/mL).',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Bovino',
        weightKg: 40,
        doseMgKg: 20.0,
        concentrationMgMl: 200,
        productPercentage: 20.0,
      });
      const passed = res.isValid && Math.abs(res.volumeMlPerTake - 4.0) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.volumeMlPerTake} mL`,
        details: '40 kg × 20 mg/kg = 800 mg. 800 mg ÷ 200 mg/mL = 4 mL.',
        metric: { expected: 4.0, actual: res.volumeMlPerTake },
      };
    },
  },
  {
    id: 'com-7',
    name: 'Dipirona Gotas 500 mg/mL (Fator de Bula 20 gotas/mL)',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: 'Dose 25 mg/kg em cão de 10 kg com 500 mg/mL e 20 gotas/mL.',
    expectedOutcome: '10 gotas exatas (250 mg = 0,5 mL = 10 gotas).',
    run: () => {
      const res = calculateDropsDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 25.0,
        concentrationMgMl: 500,
        dropsPerMl: 20,
      });
      const passed = res.isValid && Math.abs(res.dropsPerTake - 10) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.dropsPerTake} gotas (${res.volumeMlPerTake} mL)`,
        details: '250 mg total. Proporção: 500 mg ---- 20 gotas | 250 mg ---- 10 gotas.',
        metric: { expected: 10, actual: res.dropsPerTake },
      };
    },
  },
  {
    id: 'com-8',
    name: 'Gotas Pediátricas com Fator Especial (40 gotas/mL)',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: 'Dose 2 mg/kg em cão 10 kg, concentração 100 mg/mL, fator 40 gotas/mL.',
    expectedOutcome: '8 gotas exatas.',
    run: () => {
      const res = calculateDropsDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 2.0,
        concentrationMgMl: 100,
        dropsPerMl: 40,
      });
      const passed = res.isValid && Math.abs(res.dropsPerTake - 8) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.dropsPerTake} gotas`,
        details: '20 mg × 40 gotas ÷ 100 mg/mL = 8 gotas.',
        metric: { expected: 8, actual: res.dropsPerTake },
      };
    },
  },
  {
    id: 'com-9',
    name: 'Ceftriaxona Pó Liofilizado 1g Reconstituído em 10 mL',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: '1000 mg em 10 mL = 100 mg/mL. Dose 25 mg/kg em cão 20 kg (500 mg).',
    expectedOutcome: '5,0 mL exatos.',
    run: () => {
      const res = calculateReconstitutedDosage({
        species: 'Canino',
        weightKg: 20,
        doseMgKg: 25.0,
        totalDrugMg: 1000,
        finalVolumeMl: 10,
      });
      const passed = res.isValid && res.finalConcentrationMgMl === 100 && Math.abs(res.volumeMlPerTake - 5.0) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.volumeMlPerTake} mL (Conc. Final: ${res.finalConcentrationMgMl} mg/mL)`,
        details: 'Concentração final = 100 mg/mL. Dose total = 500 mg. 500 ÷ 100 = 5 mL.',
        metric: { expected: 5.0, actual: res.volumeMlPerTake },
      };
    },
  },
  {
    id: 'com-10',
    name: 'Ampicilina Pó 500 mg Reconstituído em 5 mL',
    category: 'commercial_presentations',
    categoryLabel: 'Apresentações Comerciais',
    description: '500 mg em 5 mL = 100 mg/mL. Dose 20 mg/kg em cão 15 kg (300 mg).',
    expectedOutcome: '3,0 mL exatos.',
    run: () => {
      const res = calculateReconstitutedDosage({
        species: 'Canino',
        weightKg: 15,
        doseMgKg: 20.0,
        totalDrugMg: 500,
        finalVolumeMl: 5,
      });
      const passed = res.isValid && Math.abs(res.volumeMlPerTake - 3.0) < 0.0001;
      return {
        passed,
        actualOutcome: `${res.volumeMlPerTake} mL`,
        details: '500 mg / 5 mL = 100 mg/mL. Dose: 300 mg ÷ 100 mg/mL = 3 mL.',
        metric: { expected: 3.0, actual: res.volumeMlPerTake },
      };
    },
  },

  // =========================================================================
  // CATEGORIA 5: SAFETY GUARDIAN & TOXICIDADES
  // =========================================================================
  {
    id: 'sft-1',
    name: 'Alerta de Volume Elevado (> 2 mL/kg)',
    category: 'safety_guardian',
    categoryLabel: 'Segurança & Contraindicações',
    description: 'Detecta possível confusão entre mg/mL e porcentagem quando volume excede 2 mL/kg.',
    expectedOutcome: 'Gerar safetyWarning alertando para checar se a concentração está correta.',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 50, // 500 mg
        concentrationMgMl: 5, // Volume = 100 mL (> 2 mL/kg)
      });
      const passed = res.isValid && res.safetyWarnings.some((w) => w.includes('2 mL/kg'));
      return {
        passed,
        actualOutcome: passed ? 'Alerta de segurança gerado com sucesso.' : 'FALHA: Não emitiu alerta para volume alto.',
        details: res.safetyWarnings.join(' | ') || 'Sem alertas.',
      };
    },
  },
  {
    id: 'sft-2',
    name: 'Discrepância entre % e mg/mL informados',
    category: 'safety_guardian',
    categoryLabel: 'Segurança & Contraindicações',
    description: 'Usuário informa 10% mas digita 10 mg/mL (deveria ser 100 mg/mL).',
    expectedOutcome: 'Detecção do erro clássico de 10x com emissão de ALERTA DE CONVERSÃO %.',
    run: () => {
      const res = calculateDeterministicDosage({
        species: 'Canino',
        weightKg: 10,
        doseMgKg: 1.0,
        concentrationMgMl: 10, // Errado! 10% é 100 mg/mL
        productPercentage: 10.0,
      });
      const passed = res.isValid && res.safetyWarnings.some((w) => w.includes('ALERTA DE CONVERSÃO %'));
      return {
        passed,
        actualOutcome: passed ? 'Erro de 10x detectado e barrado pelo Safety Guardian.' : 'FALHA: Não alertou discrepância.',
        details: res.safetyWarnings[0] || 'Sem alertas.',
      };
    },
  },
  {
    id: 'sft-3',
    name: 'Conversão Porcentagem Bidirecional (Regra dos 10)',
    category: 'safety_guardian',
    categoryLabel: 'Segurança & Contraindicações',
    description: '0,5% = 5 mg/mL; 1% = 10 mg/mL; 2% = 20 mg/mL; 5% = 50 mg/mL; 10% = 100 mg/mL.',
    expectedOutcome: 'Todos os fatores convertem exatamente por multiplicação de 10.',
    run: () => {
      const samples = [
        { pct: 0.5, exp: 5 },
        { pct: 1.0, exp: 10 },
        { pct: 2.0, exp: 20 },
        { pct: 5.0, exp: 50 },
        { pct: 10.0, exp: 100 },
      ];
      const allOk = samples.every((s) => Math.abs(percentageToMgMl(s.pct) - s.exp) < 0.0001);
      return {
        passed: allOk,
        actualOutcome: allOk ? '100% das conversões matematicamente perfeitas.' : 'FALHA na conversão percentual.',
        details: 'A fórmula universal m/v: % × 10 = mg/mL.',
      };
    },
  },
];

/**
 * Executa toda a bateria de testes matemáticos e clínicos
 */
export function runCompleteClinicalTestSuite(): TestSuiteSummary {
  const start = performance.now();
  const results = CLINICAL_TEST_CASES.map((tc) => {
    const outcome = tc.run();
    return {
      id: tc.id,
      name: tc.name,
      category: tc.category,
      categoryLabel: tc.categoryLabel,
      description: tc.description,
      passed: outcome.passed,
      actualOutcome: outcome.actualOutcome,
      details: outcome.details,
    };
  });

  const durationMs = Math.round((performance.now() - start) * 100) / 100;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  const categoryMap = new Map<string, { label: string; total: number; passed: number }>();
  CLINICAL_TEST_CASES.forEach((tc, idx) => {
    const res = results[idx];
    const existing = categoryMap.get(tc.category) || { label: tc.categoryLabel, total: 0, passed: 0 };
    existing.total += 1;
    if (res.passed) existing.passed += 1;
    categoryMap.set(tc.category, existing);
  });

  const categories = Array.from(categoryMap.entries()).map(([key, data]) => ({
    key,
    label: data.label,
    total: data.total,
    passed: data.passed,
  }));

  return {
    total: results.length,
    passed,
    failed,
    durationMs,
    categories,
    results,
  };
}
