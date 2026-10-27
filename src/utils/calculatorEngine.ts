/**
 * VET CALC PRO — Motor de Cálculo Farmacológico e Validação Determinística
 * 
 * Regras Matemáticas e Clínicas Centrais (Regra de Três Obrigatória):
 * 1. Dose Total (mg) = Peso (kg) × Dose prescrita (mg/kg)
 * 2. Injetáveis (Volume mL) = Dose Total (mg) ÷ Concentração (mg/mL) [Regra de Três: Concentração mg -------- 1 mL | Dose Total -------- X]
 * 3. Comprimidos (Qtd) = Dose Total (mg) ÷ Concentração do Comprimido (mg/comp) [Regra de Três: Comp mg -------- 1 comp | Dose Total -------- X]
 * 4. Gotas (Qtd) = (Dose Total (mg) × Gotas/mL) ÷ Concentração (mg/mL) [Regra de Três: Concentração mg -------- Gotas/mL | Dose Total -------- X]
 * 5. Reconstituídos (Conc. Final) = Pó Total (mg) ÷ Volume Final (mL). Depois, Volume (mL) = Dose Total ÷ Conc. Final.
 * 6. Conversão % m/v: X% = X * 10 mg/mL (0,5% = 5 mg/mL; 1% = 10 mg/mL; 2% = 20 mg/mL; 5% = 50 mg/mL; 10% = 100 mg/mL)
 * 7. Safety Guardian: Detecta desvios de 10x, confusão mg/mL, erros percentuais e dados faltantes.
 */

export interface DosageInput {
  species: string;
  weightKg: number;
  doseMgKg: number;
  concentrationMgMl: number;
  frequencyTimesPerDay?: number;
  treatmentDays?: number;
  doseRegime?: 'per-dose' | 'daily-divided';
  productPercentage?: number;
  drugName?: string;
}

export interface DosageResult {
  isValid: boolean;
  errorMessage?: string;
  weightKg: number;
  doseMgKg: number;
  concentrationMgMl: number;
  totalMgPerTake: number;
  volumeMlPerTake: number;
  volumeMlDaily: number;
  volumeMlTotalTreatment: number;
  formattedVolumeStr: string;
  formattedVolumeDetailed: string;
  steps: {
    label: string;
    expression: string;
    result: string;
  }[];
  safetyWarnings: string[];
  bulaRuleNote?: string;
}

export interface TabletDosageInput {
  species: string;
  weightKg: number;
  doseMgKg: number;
  tabletMg: number;
  frequencyTimesPerDay?: number;
  treatmentDays?: number;
  drugName?: string;
}

export interface TabletDosageResult {
  isValid: boolean;
  errorMessage?: string;
  weightKg: number;
  doseMgKg: number;
  tabletMg: number;
  totalMgPerTake: number;
  tabletsPerTake: number;
  formattedTabletsStr: string;
  fractionWarning?: string;
  steps: {
    label: string;
    expression: string;
    result: string;
  }[];
  safetyWarnings: string[];
}

export interface DropsDosageInput {
  species: string;
  weightKg: number;
  doseMgKg: number;
  concentrationMgMl: number;
  dropsPerMl: number;
  frequencyTimesPerDay?: number;
  treatmentDays?: number;
  drugName?: string;
}

export interface DropsDosageResult {
  isValid: boolean;
  errorMessage?: string;
  weightKg: number;
  doseMgKg: number;
  concentrationMgMl: number;
  dropsPerMl: number;
  totalMgPerTake: number;
  dropsPerTake: number;
  volumeMlPerTake: number;
  formattedDropsStr: string;
  steps: {
    label: string;
    expression: string;
    result: string;
  }[];
  safetyWarnings: string[];
}

export interface ReconstitutedInput {
  species: string;
  weightKg: number;
  doseMgKg: number;
  totalDrugMg: number;
  finalVolumeMl: number;
  frequencyTimesPerDay?: number;
  treatmentDays?: number;
  drugName?: string;
}

export interface ReconstitutedResult extends DosageResult {
  finalConcentrationMgMl: number;
}

export function percentageToMgMl(percent: number): number {
  if (percent <= 0) return 0;
  return percent * 10;
}

export function mgMlToPercentage(mgMl: number): number {
  if (mgMl <= 0) return 0;
  return mgMl / 10;
}

export function formatClinicalVolume(vol: number): { short: string; detailed: string } {
  if (isNaN(vol) || vol <= 0) {
    return { short: '0 mL', detailed: '0 mL' };
  }

  if (vol < 0.01) {
    const v3 = vol.toFixed(3);
    return { short: `${v3} mL`, detailed: `${v3} mL` };
  }

  if (vol < 1.0) {
    const f2 = vol.toFixed(2);
    const f1 = vol.toFixed(1);
    if (f2.endsWith('0')) {
      return {
        short: `${f2} mL`,
        detailed: `${f2} mL (${f1} mL)`,
      };
    }
    return {
      short: `${f2} mL`,
      detailed: `${f2} mL`,
    };
  }

  const f2 = vol.toFixed(2);
  if (f2.endsWith('.00')) {
    return {
      short: `${vol.toFixed(0)} mL`,
      detailed: `${vol.toFixed(0)} mL`,
    };
  }
  if (f2.endsWith('0')) {
    return {
      short: `${vol.toFixed(1)} mL`,
      detailed: `${f2} mL (${vol.toFixed(1)} mL)`,
    };
  }
  return {
    short: `${f2} mL`,
    detailed: `${f2} mL`,
  };
}

export function calculateDeterministicDosage(input: DosageInput): DosageResult {
  const safetyWarnings: string[] = [];

  if (isNaN(input.weightKg) || input.weightKg <= 0) {
    return createErrorResult('Peso do paciente deve ser um número maior que zero.');
  }
  if (isNaN(input.doseMgKg) || input.doseMgKg <= 0) {
    return createErrorResult('Dose prescrita (mg/kg) deve ser maior que zero.');
  }
  if (isNaN(input.concentrationMgMl) || input.concentrationMgMl <= 0) {
    return createErrorResult('Concentração do medicamento (mg/mL) deve ser maior que zero.');
  }

  const freq = input.frequencyTimesPerDay || 1;
  const days = input.treatmentDays || 1;

  if (input.productPercentage && input.productPercentage > 0) {
    const expectedMgMl = percentageToMgMl(input.productPercentage);
    if (Math.abs(input.concentrationMgMl - expectedMgMl) > 0.001) {
      safetyWarnings.push(
        `ALERTA DE CONVERSÃO %: O produto declara ${input.productPercentage}%, que equivale matematicamente a ${expectedMgMl} mg/mL, porém a concentração informada foi ${input.concentrationMgMl} mg/mL.`
      );
    }
  }

  let totalMgPerTake = 0;
  if (input.doseRegime === 'daily-divided') {
    totalMgPerTake = (input.weightKg * input.doseMgKg) / freq;
  } else {
    totalMgPerTake = input.weightKg * input.doseMgKg;
  }

  const volumeMlPerTake = totalMgPerTake / input.concentrationMgMl;
  const volumeMlDaily = volumeMlPerTake * freq;
  const volumeMlTotalTreatment = volumeMlDaily * days;

  if (volumeMlPerTake > input.weightKg * 2 && input.concentrationMgMl < 10) {
    safetyWarnings.push(
      'Atenção: O volume calculado excede 2 mL/kg. Verifique se a concentração informada está em mg/mL e não em porcentagem sem converter.'
    );
  }

  const volFmt = formatClinicalVolume(volumeMlPerTake);
  const volDailyFmt = formatClinicalVolume(volumeMlDaily);

  const steps = [
    {
      label: '1. Dose Total por Aplicação (mg) — Multiplicação',
      expression: input.doseRegime === 'daily-divided'
        ? `(${input.weightKg} kg × ${input.doseMgKg} mg/kg) ÷ ${freq} tomadas`
        : `${input.weightKg} kg × ${input.doseMgKg} mg/kg`,
      result: `${totalMgPerTake.toFixed(2)} mg`,
    },
    {
      label: '2. Regra de Três Injetável (mL) — Proporção',
      expression: `${input.concentrationMgMl} mg -------- 1 mL\n${totalMgPerTake.toFixed(2)} mg -------- X mL\n(X = ${totalMgPerTake.toFixed(2)} × 1 ÷ ${input.concentrationMgMl})`,
      result: volFmt.detailed,
    },
    {
      label: '3. Volume Diário Total',
      expression: `${volFmt.short} × ${freq}x/dia`,
      result: `${volDailyFmt.short}/dia`,
    },
    {
      label: '4. Seringa e Graduação Recomendada',
      expression: `Volume de ${volFmt.detailed}`,
      result: volumeMlPerTake <= 1.0
        ? `Seringa de 1 mL (Insulina/Tuberculina): aspirar até a marca de ${volFmt.short}`
        : volumeMlPerTake <= 3.0
        ? 'Seringa de 3 mL'
        : volumeMlPerTake <= 5.0
        ? 'Seringa de 5 mL'
        : 'Seringa de 10 mL ou 20 mL',
    },
  ];

  return {
    isValid: true,
    weightKg: input.weightKg,
    doseMgKg: input.doseMgKg,
    concentrationMgMl: input.concentrationMgMl,
    totalMgPerTake,
    volumeMlPerTake,
    volumeMlDaily,
    volumeMlTotalTreatment,
    formattedVolumeStr: volFmt.short,
    formattedVolumeDetailed: volFmt.detailed,
    steps,
    safetyWarnings,
  };
}

export function calculateTabletDosage(input: TabletDosageInput): TabletDosageResult {
  const safetyWarnings: string[] = [];
  if (isNaN(input.weightKg) || input.weightKg <= 0) {
    return createTabletErrorResult('Peso do paciente deve ser maior que zero.');
  }
  if (isNaN(input.doseMgKg) || input.doseMgKg <= 0) {
    return createTabletErrorResult('Dose prescrita deve ser maior que zero.');
  }
  if (isNaN(input.tabletMg) || input.tabletMg <= 0) {
    return createTabletErrorResult('Concentração do comprimido deve ser maior que zero.');
  }

  const freq = input.frequencyTimesPerDay || 1;
  const totalMgPerTake = (input.weightKg * input.doseMgKg) / freq;
  const tabletsPerTake = totalMgPerTake / input.tabletMg;

  let fractionWarning = undefined;
  let formattedTabletsStr = '';

  const roundedQuarter = Math.round(tabletsPerTake * 4) / 4;
  if (Math.abs(tabletsPerTake - roundedQuarter) > 0.001) {
    formattedTabletsStr = `${tabletsPerTake.toFixed(2)} comprimidos`;
  } else if (roundedQuarter === 0.25) {
    formattedTabletsStr = '1/4 de comprimido';
  } else if (roundedQuarter === 0.5) {
    formattedTabletsStr = '1/2 comprimido (0,5)';
  } else if (roundedQuarter === 0.75) {
    formattedTabletsStr = '3/4 de comprimido';
  } else if (roundedQuarter === 1.0) {
    formattedTabletsStr = '1 comprimido inteiro';
  } else {
    const whole = Math.floor(roundedQuarter);
    const frac = roundedQuarter - whole;
    if (frac === 0.5) {
      formattedTabletsStr = `${whole} e 1/2 comprimido(s)`;
    } else {
      formattedTabletsStr = `${roundedQuarter.toFixed(2)} comprimidos`;
    }
  }

  if (tabletsPerTake < 0.5) {
    fractionWarning = 'Atenção: A quantidade calculada é inferior a 0,5 comprimido. Verifique se o comprimido é sulcado/fracionável ou se há uma apresentação de menor concentração disponível.';
  }

  const steps = [
    {
      label: '1. Dose Total por Tomada (mg)',
      expression: freq > 1 ? `(${input.weightKg} kg × ${input.doseMgKg} mg/kg) ÷ ${freq}` : `${input.weightKg} kg × ${input.doseMgKg} mg/kg`,
      result: `${totalMgPerTake.toFixed(2)} mg`,
    },
    {
      label: '2. Regra de Três para Comprimidos',
      expression: `${input.tabletMg} mg -------- 1 comprimido\n${totalMgPerTake.toFixed(2)} mg -------- X comp\n(X = ${totalMgPerTake.toFixed(2)} ÷ ${input.tabletMg})`,
      result: formattedTabletsStr,
    },
    {
      label: '3. Orientação de Fracionamento',
      expression: 'Verificação de sulco e divisão',
      result: fractionWarning ? `⚠️ ${fractionWarning}` : 'Comprimido fracionável conforme cálculo exato (sem arredondamento forçado para 1).',
    },
  ];

  return {
    isValid: true,
    weightKg: input.weightKg,
    doseMgKg: input.doseMgKg,
    tabletMg: input.tabletMg,
    totalMgPerTake,
    tabletsPerTake,
    formattedTabletsStr,
    fractionWarning,
    steps,
    safetyWarnings,
  };
}

export function calculateDropsDosage(input: DropsDosageInput): DropsDosageResult {
  const safetyWarnings: string[] = [];
  if (isNaN(input.weightKg) || input.weightKg <= 0) {
    return createDropsErrorResult('Peso do paciente deve ser maior que zero.');
  }
  if (isNaN(input.doseMgKg) || input.doseMgKg <= 0) {
    return createDropsErrorResult('Dose prescrita deve ser maior que zero.');
  }
  if (isNaN(input.concentrationMgMl) || input.concentrationMgMl <= 0) {
    return createDropsErrorResult('Concentração deve ser maior que zero.');
  }
  if (isNaN(input.dropsPerMl) || input.dropsPerMl <= 0) {
    return createDropsErrorResult('Fator de gotejamento (gotas/mL) obrigatório conforme bula.');
  }

  const freq = input.frequencyTimesPerDay || 1;
  const totalMgPerTake = (input.weightKg * input.doseMgKg) / freq;
  const dropsPerTake = (totalMgPerTake * input.dropsPerMl) / input.concentrationMgMl;
  const volumeMlPerTake = totalMgPerTake / input.concentrationMgMl;

  const formattedDropsStr = `${dropsPerTake.toFixed(2)} gotas (${volumeMlPerTake.toFixed(2)} mL)`;

  const steps = [
    {
      label: '1. Dose Total por Tomada (mg)',
      expression: `${input.weightKg} kg × ${input.doseMgKg} mg/kg`,
      result: `${totalMgPerTake.toFixed(2)} mg`,
    },
    {
      label: '2. Regra de Três para Gotas (Fator Oficial da Bula)',
      expression: `${input.concentrationMgMl} mg -------- ${input.dropsPerMl} gotas (1 mL)\n${totalMgPerTake.toFixed(2)} mg -------- X gotas\n(X = ${totalMgPerTake.toFixed(2)} × ${input.dropsPerMl} ÷ ${input.concentrationMgMl})`,
      result: formattedDropsStr,
    },
    {
      label: '3. Volume em mL equivalente',
      expression: `${totalMgPerTake.toFixed(2)} mg ÷ ${input.concentrationMgMl} mg/mL`,
      result: `${volumeMlPerTake.toFixed(3)} mL`,
    },
  ];

  return {
    isValid: true,
    weightKg: input.weightKg,
    doseMgKg: input.doseMgKg,
    concentrationMgMl: input.concentrationMgMl,
    dropsPerMl: input.dropsPerMl,
    totalMgPerTake,
    dropsPerTake,
    volumeMlPerTake,
    formattedDropsStr,
    steps,
    safetyWarnings,
  };
}

export function calculateReconstitutedDosage(input: ReconstitutedInput): ReconstitutedResult {
  if (isNaN(input.totalDrugMg) || input.totalDrugMg <= 0 || isNaN(input.finalVolumeMl) || input.finalVolumeMl <= 0) {
    return {
      ...createErrorResult('Quantidade total do pó (mg) e volume final de reconstituição (mL) são obrigatórios.'),
      finalConcentrationMgMl: 0,
    };
  }

  const finalConcentrationMgMl = input.totalDrugMg / input.finalVolumeMl;

  const baseResult = calculateDeterministicDosage({
    species: input.species,
    weightKg: input.weightKg,
    doseMgKg: input.doseMgKg,
    concentrationMgMl: finalConcentrationMgMl,
    frequencyTimesPerDay: input.frequencyTimesPerDay,
    treatmentDays: input.treatmentDays,
    drugName: input.drugName,
  });

  baseResult.steps.unshift({
    label: '0. Concentração Final Pós-Reconstituição',
    expression: `${input.totalDrugMg} mg ÷ ${input.finalVolumeMl} mL de diluente`,
    result: `${finalConcentrationMgMl.toFixed(2)} mg/mL`,
  });

  return {
    ...baseResult,
    finalConcentrationMgMl,
  };
}

function createErrorResult(msg: string): DosageResult {
  return {
    isValid: false,
    errorMessage: msg,
    weightKg: 0,
    doseMgKg: 0,
    concentrationMgMl: 0,
    totalMgPerTake: 0,
    volumeMlPerTake: 0,
    volumeMlDaily: 0,
    volumeMlTotalTreatment: 0,
    formattedVolumeStr: '0 mL',
    formattedVolumeDetailed: '0 mL',
    steps: [],
    safetyWarnings: [msg],
  };
}

function createTabletErrorResult(msg: string): TabletDosageResult {
  return {
    isValid: false,
    errorMessage: msg,
    weightKg: 0,
    doseMgKg: 0,
    tabletMg: 0,
    totalMgPerTake: 0,
    tabletsPerTake: 0,
    formattedTabletsStr: '0',
    steps: [],
    safetyWarnings: [msg],
  };
}

function createDropsErrorResult(msg: string): DropsDosageResult {
  return {
    isValid: false,
    errorMessage: msg,
    weightKg: 0,
    doseMgKg: 0,
    concentrationMgMl: 0,
    dropsPerMl: 0,
    totalMgPerTake: 0,
    dropsPerTake: 0,
    volumeMlPerTake: 0,
    formattedDropsStr: '0 gotas',
    steps: [],
    safetyWarnings: [msg],
  };
}

export interface TestCaseResult {
  name: string;
  category: string;
  passed: boolean;
  expectedValue: number;
  actualValue: number;
  expectedVolumeMl?: number;
  actualVolumeMl?: number;
  details: string;
}

export function runAutomatedDosageTests(): {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: TestCaseResult[];
} {
  const tests: TestCaseResult[] = [];

  // 1. Emedron 1%
  {
    const res = calculateDeterministicDosage({
      species: 'dog',
      weightKg: 10,
      doseMgKg: 0.5,
      concentrationMgMl: 10,
      productPercentage: 1.0,
      drugName: 'Emedron® 1%',
    });
    const expected = 0.5;
    const passed = Math.abs(res.volumeMlPerTake - expected) < 0.0001;
    tests.push({
      name: 'Emedron® 1% (Teste Mandatório do Usuário)',
      category: 'Validação Anti-Erro 10x',
      passed,
      expectedValue: expected,
      actualValue: res.volumeMlPerTake,
      expectedVolumeMl: expected,
      actualVolumeMl: res.volumeMlPerTake,
      details: passed
        ? `Sucesso: 10 kg × 0,5 mg/kg = 5 mg. Regra de três: 10 mg/mL -------- 1 mL | 5 mg -------- 0,5 mL (correto).`
        : `FALHA: Retornou ${res.volumeMlPerTake} mL em vez de ${expected} mL.`,
    });
  }

  // 2. Flamavet 0,2% em Gato 4 kg
  {
    const res = calculateDeterministicDosage({
      species: 'cat',
      weightKg: 4,
      doseMgKg: 0.1,
      concentrationMgMl: 2,
      productPercentage: 0.2,
      drugName: 'Flamavet® 0,2%',
    });
    const expected = 0.2;
    const passed = Math.abs(res.volumeMlPerTake - expected) < 0.0001;
    tests.push({
      name: 'Flamavet® 0,2% em Gato 4 kg',
      category: 'AINEs & Bula Oficial',
      passed,
      expectedValue: expected,
      actualValue: res.volumeMlPerTake,
      expectedVolumeMl: expected,
      actualVolumeMl: res.volumeMlPerTake,
      details: `4 kg × 0,1 mg/kg = 0,40 mg. 0,40 mg ÷ 2 mg/mL = 0,20 mL exatos.`,
    });
  }

  // 3. Comprimidos
  {
    const res = calculateTabletDosage({
      species: 'dog',
      weightKg: 10,
      doseMgKg: 1.0,
      tabletMg: 20,
    });
    const expected = 0.5;
    const passed = Math.abs(res.tabletsPerTake - expected) < 0.0001;
    tests.push({
      name: 'Comprimido Regra de Três (10 mg / 20 mg)',
      category: 'Comprimidos & Fracionamento',
      passed,
      expectedValue: expected,
      actualValue: res.tabletsPerTake,
      expectedVolumeMl: expected,
      actualVolumeMl: res.tabletsPerTake,
      details: `10 mg total ÷ 20 mg/comp = 0,5 comprimido (1/2 comp).`,
    });
  }

  // 4. Gotas
  {
    const res = calculateDropsDosage({
      species: 'dog',
      weightKg: 10,
      doseMgKg: 2.0,
      concentrationMgMl: 100,
      dropsPerMl: 40,
    });
    const expected = 8.0;
    const passed = Math.abs(res.dropsPerTake - expected) < 0.0001;
    tests.push({
      name: 'Gotas Regra de Três (100 mg/mL, 40 gtt/mL)',
      category: 'Gotas & Fator Bula',
      passed,
      expectedValue: expected,
      actualValue: res.dropsPerTake,
      expectedVolumeMl: expected,
      actualVolumeMl: res.dropsPerTake,
      details: `20 mg total × 40 gotas ÷ 100 mg/mL = 8 gotas exatas.`,
    });
  }

  // 5. Reconstituído
  {
    const res = calculateReconstitutedDosage({
      species: 'dog',
      weightKg: 10,
      doseMgKg: 1.0,
      totalDrugMg: 40,
      finalVolumeMl: 10,
    });
    const expected = 2.5;
    const passed = Math.abs(res.volumeMlPerTake - expected) < 0.0001;
    tests.push({
      name: 'Pó Reconstituído (40mg/10mL = 4mg/mL) em 10kg',
      category: 'Reconstituição',
      passed,
      expectedValue: expected,
      actualValue: res.volumeMlPerTake,
      expectedVolumeMl: expected,
      actualVolumeMl: res.volumeMlPerTake,
      details: `Conc final = 4 mg/mL. Dose = 10 mg. 10 ÷ 4 = 2,5 mL.`,
    });
  }

  const passedCount = tests.filter((t) => t.passed).length;
  const allPassed = passedCount === tests.length;

  return {
    allPassed,
    passedCount,
    totalCount: tests.length,
    results: tests,
  };
}
