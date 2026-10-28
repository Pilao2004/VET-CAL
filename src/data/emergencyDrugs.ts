// Fármacos de emergência com doses de referência (RECOVER e literatura de emergência veterinária).
// Usados pela Tabela de Emergência por peso e pelo Guia de Urgências em PDF.

export type EmergencyGroup = 'PCR' | 'Reversores' | 'Convulsão' | 'Metabólico' | 'Anafilaxia e ICC' | 'Choque';

export interface EmergencyDrug {
  id: string;
  name: string;
  group: EmergencyGroup;
  indication: string;
  /** Dose por kg na unidade `unit`; `cat` quando a dose de gatos for diferente. */
  dose: { dog: number; cat: number };
  unit: 'mg' | 'UI' | 'mEq' | 'g' | 'mL';
  /** Quantidade de `unit` por mL da apresentação padrão (editável na tela). */
  concentration: number;
  concentrationLabel: string;
  route: string;
  note?: string;
}

export const EMERGENCY_DRUGS: EmergencyDrug[] = [
  {
    id: 'adrenalina-baixa', name: 'Adrenalina (dose baixa)', group: 'PCR', indication: 'PCR: assistolia e AESP',
    dose: { dog: 0.01, cat: 0.01 }, unit: 'mg', concentration: 1, concentrationLabel: '1 mg/mL', route: 'IV / IO',
    note: 'Repetir a cada 3-5 min (ciclo sim, ciclo não). Em pacientes pequenos, diluir para medir com precisão.',
  },
  {
    id: 'adrenalina-alta', name: 'Adrenalina (dose alta)', group: 'PCR', indication: 'PCR prolongada (mais de 10 min)',
    dose: { dog: 0.1, cat: 0.1 }, unit: 'mg', concentration: 1, concentrationLabel: '1 mg/mL', route: 'IV / IO',
  },
  {
    id: 'vasopressina', name: 'Vasopressina', group: 'PCR', indication: 'PCR: alternativa à adrenalina',
    dose: { dog: 0.8, cat: 0.8 }, unit: 'UI', concentration: 20, concentrationLabel: '20 UI/mL', route: 'IV / IO',
  },
  {
    id: 'atropina', name: 'Atropina', group: 'PCR', indication: 'Bradicardia, assistolia ou AESP de origem vagal',
    dose: { dog: 0.04, cat: 0.04 }, unit: 'mg', concentration: 0.25, concentrationLabel: '0,25 mg/mL', route: 'IV / IO',
    note: 'Confira a concentração da ampola disponível (0,25, 0,5 mg/mL ou 1%).',
  },
  {
    id: 'lidocaina', name: 'Lidocaína 2% (sem vasoconstritor)', group: 'PCR', indication: 'FV / TV sem pulso refratária',
    dose: { dog: 2, cat: 0.25 }, unit: 'mg', concentration: 20, concentrationLabel: '20 mg/mL', route: 'IV / IO',
    note: 'Gatos são sensíveis à lidocaína: usar dose bem menor e com cautela.',
  },
  {
    id: 'amiodarona', name: 'Amiodarona', group: 'PCR', indication: 'FV / TV sem pulso refratária',
    dose: { dog: 5, cat: 5 }, unit: 'mg', concentration: 50, concentrationLabel: '50 mg/mL', route: 'IV / IO lenta',
    note: 'Pode causar hipotensão e reação anafilactoide em cães.',
  },
  {
    id: 'bicarbonato', name: 'Bicarbonato de sódio 8,4%', group: 'PCR', indication: 'PCR prolongada (mais de 10-15 min) ou acidose grave',
    dose: { dog: 1, cat: 1 }, unit: 'mEq', concentration: 1, concentrationLabel: '1 mEq/mL', route: 'IV lenta',
  },
  {
    id: 'naloxona', name: 'Naloxona', group: 'Reversores', indication: 'Reversão de opioides',
    dose: { dog: 0.04, cat: 0.04 }, unit: 'mg', concentration: 0.4, concentrationLabel: '0,4 mg/mL', route: 'IV / IM',
  },
  {
    id: 'flumazenil', name: 'Flumazenil', group: 'Reversores', indication: 'Reversão de benzodiazepínicos',
    dose: { dog: 0.01, cat: 0.01 }, unit: 'mg', concentration: 0.1, concentrationLabel: '0,1 mg/mL', route: 'IV',
  },
  {
    id: 'atipamezol', name: 'Atipamezol', group: 'Reversores', indication: 'Reversão de dexmedetomidina / medetomidina',
    dose: { dog: 0.1, cat: 0.1 }, unit: 'mg', concentration: 5, concentrationLabel: '5 mg/mL', route: 'IM',
    note: 'Preferir IM: pela via IV pode causar hipotensão e colapso cardiovascular. Na prática, use o mesmo volume de dexmedetomidina aplicado.',
  },
  {
    id: 'diazepam', name: 'Diazepam', group: 'Convulsão', indication: 'Convulsão / status epilepticus',
    dose: { dog: 0.5, cat: 0.5 }, unit: 'mg', concentration: 5, concentrationLabel: '5 mg/mL', route: 'IV (ou 1 mg/kg retal)',
    note: 'Pode repetir até 2-3 vezes. Se persistir, considerar levetiracetam ou fenobarbital.',
  },
  {
    id: 'midazolam', name: 'Midazolam', group: 'Convulsão', indication: 'Convulsão / status epilepticus',
    dose: { dog: 0.2, cat: 0.2 }, unit: 'mg', concentration: 5, concentrationLabel: '5 mg/mL', route: 'IV / IM / intranasal',
  },
  {
    id: 'levetiracetam', name: 'Levetiracetam', group: 'Convulsão', indication: 'Status epilepticus refratário a benzodiazepínico',
    dose: { dog: 60, cat: 60 }, unit: 'mg', concentration: 100, concentrationLabel: '100 mg/mL', route: 'IV lenta',
  },
  {
    id: 'glicose50', name: 'Glicose 50%', group: 'Metabólico', indication: 'Hipoglicemia',
    dose: { dog: 0.5, cat: 0.5 }, unit: 'g', concentration: 0.5, concentrationLabel: '0,5 g/mL (50%)', route: 'IV lenta',
    note: 'Diluir 1:2 a 1:4 em solução fisiológica antes de aplicar.',
  },
  {
    id: 'gluconato-calcio', name: 'Gluconato de cálcio 10%', group: 'Metabólico', indication: 'Hipercalemia com alteração no ECG; hipocalcemia',
    dose: { dog: 50, cat: 50 }, unit: 'mg', concentration: 100, concentrationLabel: '100 mg/mL (10%)', route: 'IV lenta (10-20 min)',
    note: 'Faixa 50-150 mg/kg (0,5-1,5 mL/kg). Aplicar com ECG; interromper se surgir bradicardia.',
  },
  {
    id: 'insulina-regular', name: 'Insulina regular', group: 'Metabólico', indication: 'Hipercalemia',
    dose: { dog: 0.25, cat: 0.25 }, unit: 'UI', concentration: 100, concentrationLabel: '100 UI/mL', route: 'IV',
    note: 'Associar glicose (1-2 g para cada UI de insulina) e monitorar a glicemia. Diluir para medir.',
  },
  {
    id: 'adrenalina-anafilaxia', name: 'Adrenalina (anafilaxia)', group: 'Anafilaxia e ICC', indication: 'Anafilaxia',
    dose: { dog: 0.01, cat: 0.01 }, unit: 'mg', concentration: 1, concentrationLabel: '1 mg/mL', route: 'IM',
  },
  {
    id: 'furosemida', name: 'Furosemida', group: 'Anafilaxia e ICC', indication: 'Edema pulmonar cardiogênico',
    dose: { dog: 2, cat: 1 }, unit: 'mg', concentration: 10, concentrationLabel: '10 mg/mL', route: 'IV / IM',
    note: 'Cães 2-4 mg/kg; gatos 1-2 mg/kg. Reavaliar a frequência respiratória em 1-2 h.',
  },
  {
    id: 'bolus-cristaloide', name: 'Bolus de cristaloide', group: 'Choque', indication: 'Choque hipovolêmico',
    dose: { dog: 15, cat: 5 }, unit: 'mL', concentration: 1, concentrationLabel: 'Ringer lactato ou NaCl 0,9%', route: 'IV em 15 min',
    note: 'Cães 10-20 mL/kg; gatos 5-10 mL/kg. Reavaliar perfusão após cada bolus.',
  },
];

export interface EmergencyDose {
  drug: EmergencyDrug;
  dosePerKg: number;
  totalDose: number;
  volumeMl: number;
}

export function emergencyDoses(weightKg: number, species: 'dog' | 'cat', concentrations: Record<string, number> = {}): EmergencyDose[] {
  return EMERGENCY_DRUGS.map((drug) => {
    const dosePerKg = drug.dose[species];
    const totalDose = dosePerKg * weightKg;
    const conc = concentrations[drug.id] || drug.concentration;
    return { drug, dosePerKg, totalDose, volumeMl: totalDose / conc };
  });
}

/** Formata número em pt-BR com casas suficientes para volumes pequenos. */
export function formatDose(n: number) {
  const digits = n >= 10 ? 1 : n >= 1 ? 2 : 3;
  return n.toLocaleString('pt-BR', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
