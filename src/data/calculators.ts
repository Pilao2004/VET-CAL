import { CalculatorType } from '../types';

export interface CalculatorMeta {
  type: CalculatorType;
  title: string;
  shortDescription: string;
  category: 'Farmacologia & Prescrição' | 'Emergência & Fluidos' | 'Conversões & Matemática' | 'UTI & Especiais';
  badge: 'VetSmart' | 'Avançada';
  icon: string;
  formulaText: string;
  clinicalNote: string;
}

export const CALCULATORS_LIST: CalculatorMeta[] = [
  {
    type: 'dosage',
    title: 'Calculadora de Medicamentos (Líquido, Comprimido e Gotas)',
    shortDescription: 'Cálculo completo no padrão VetSmart: volume em mL, fracionamento de comprimidos (1/4, 1/2, 3/4), gotas por tomada, seringa indicada e receita pronta.',
    category: 'Farmacologia & Prescrição',
    badge: 'VetSmart',
    icon: 'Pill',
    formulaText: 'Dose por Tomada (mg) = Peso (kg) × Dose (mg/kg)\nVolume (mL) = Dose (mg) ÷ Concentração (mg/mL)\nComprimidos = Dose (mg) ÷ Concentração do Comp (mg)\nGotas = Dose (mg) ÷ (Concentração mg/mL ÷ 20)',
    clinicalNote: 'Permite selecionar dose por tomada ou dose diária total, fracionamento em quartos e quantidade total para receita.',
  },
  {
    type: 'fluidotherapy',
    title: 'Fluidoterapia Completa VetSmart (3 Parcelas)',
    shortDescription: 'Cálculo integrado com as 3 parcelas clínicas: Manutenção diária + Déficit de desidratação + Perdas contínuas (êmese/diarreia) em mL/h e gotas/min.',
    category: 'Emergência & Fluidos',
    badge: 'VetSmart',
    icon: 'Droplets',
    formulaText: 'Volume 24h = Manutenção + Déficit + Perdas Estimadas\nTaxa Bomba (mL/h) = Volume Total ÷ 24h\nMacrogotas (20 gts/mL) = mL/h ÷ 3\nMicrogotas (60 gts/mL) = mL/h',
    clinicalNote: 'Regra de ouro VetSmart: Macrogotas = (mL/h) ÷ 3. Microgotas = mL/h.',
  },
  {
    type: 'cri',
    title: 'Infusão Contínua na Bolsa (CRI / Taxa de Infusão)',
    shortDescription: 'Cálculo do volume do fármaco (Cetamina, Fentanil, Lidocaína, etc.) a ser adicionado à bolsa de fluido para infusão contínua em mcg/kg/min ou mg/kg/h.',
    category: 'UTI & Especiais',
    badge: 'VetSmart',
    icon: 'Clock',
    formulaText: 'Dose na Bolsa (mg) = [Dose (mcg/kg/min) × Peso × 60 min × Horas da Bolsa] ÷ 1.000\nVolume Droga (mL) = Dose na Bolsa (mg) ÷ Concentração da Droga (mg/mL)',
    clinicalNote: 'Retirar da bolsa o mesmo volume do fármaco adicionado para manter a concentração final exata.',
  },
  {
    type: 'transfusion',
    title: 'Transfusão Sanguínea (Sangue Total e Papa de Hemácias)',
    shortDescription: 'Cálculo do volume de sangue total ou concentrado de hemácias necessário a partir do hematócrito atual e do hematócrito alvo.',
    category: 'Emergência & Fluidos',
    badge: 'VetSmart',
    icon: 'HeartPulse',
    formulaText: 'Volume (mL) = Peso (kg) × K × [(Ht Desejado - Ht Atual) ÷ Ht do Doador]\nOnde K = 90 (Caninos) e K = 60 (Felinos)',
    clinicalNote: 'Taxa inicial: 0,25 a 0,5 mL/kg/h nos primeiros 15 a 30 minutos; depois 5 a 10 mL/kg/h (concluir em até 4 horas).',
  },
  {
    type: 'dilution',
    title: 'Diluição de Medicamentos (C1 × V1 = C2 × V2)',
    shortDescription: 'Descubra quanto retirar da solução concentrada estoque e quanto adicionar de diluente para atingir a concentração e volume desejados.',
    category: 'Farmacologia & Prescrição',
    badge: 'Avançada',
    icon: 'FlaskConical',
    formulaText: 'V1 = (C2 × V2) ÷ C1\nVolume de Diluente = V2 - V1',
    clinicalNote: 'Ideal para preparar soluções orais pediátricas, colírios manipulados na emergência ou soluções injetáveis diluídas.',
  },
  {
    type: 'percentage-conversion',
    title: 'Conversão de Porcentagem (%) para mg/mL',
    shortDescription: 'Converta soluções em % (ex: 2%, 10%, 50%) para mg/mL e execute o cálculo inverso com máxima precisão.',
    category: 'Conversões & Matemática',
    badge: 'VetSmart',
    icon: 'Percent',
    formulaText: 'Concentração (mg/mL) = Porcentagem (%) × 10\nPorcentagem (%) = Concentração (mg/mL) ÷ 10',
    clinicalNote: '1% equivale a 1 grama em 100 mL, o que corresponde a 1000 mg / 100 mL = 10 mg/mL.',
  },
  {
    type: 'hydration-deficit',
    title: 'Déficit Hídrico Isolado (Desidratação)',
    shortDescription: 'Estime o volume de líquidos perdido com base na porcentagem clínica de desidratação e defina o tempo de reposição.',
    category: 'Emergência & Fluidos',
    badge: 'Avançada',
    icon: 'HeartPulse',
    formulaText: 'Volume do Déficit (mL) = Peso (kg) × Grau de Desidratação (%) × 10',
    clinicalNote: 'Repor o déficit mais lentamente (12 a 24h) em cardiopatas ou nefropatas crônicos oligúricos.',
  },
  {
    type: 'infusion-rate',
    title: 'Taxa de Infusão e Gotejamento Simples',
    shortDescription: 'Cálculo de gotas/minuto (macrogotas 20 gts/mL e microgotas 60 gts/mL) e velocidade em bomba de infusão contínua (mL/h).',
    category: 'Emergência & Fluidos',
    badge: 'Avançada',
    icon: 'Clock',
    formulaText: 'Taxa (mL/h) = Volume Total (mL) ÷ Tempo (horas)\nGotas/min = (Volume em mL × Fator do Equipo) ÷ (Tempo em horas × 60 min)',
    clinicalNote: 'Macrogotas: 1 mL = 20 gotas. Microgotas: 1 mL = 60 microgotas.',
  },
  {
    type: 'rule-of-three',
    title: 'Regra de Três Clínica (A → B, C → X)',
    shortDescription: 'Ferramenta universal para cálculos rápidos de proporção, dosagens empíricas e relações de embalagem/frasco.',
    category: 'Conversões & Matemática',
    badge: 'Avançada',
    icon: 'Binary',
    formulaText: 'X = (B × C) ÷ A (proporção direta)\nVisualização interativa das variáveis',
    clinicalNote: 'Simples, transparente e à prova de falhas para conferência rápida à beira do leito.',
  },
  {
    type: 'bsa',
    title: 'Superfície Corporal (BSA) & Doses Oncológicas',
    shortDescription: 'Calcule a área de superfície corporal em metros quadrados (m²) e a dose necessária para quimioterápicos ou fármacos de índice estreito.',
    category: 'UTI & Especiais',
    badge: 'Avançada',
    icon: 'ShieldAlert',
    formulaText: 'BSA (m²) = [ K × (Peso em gramas)^(2/3) ] ÷ 10.000\nOnde K = 10,1 (Cães) e K = 10,0 (Gatos)',
    clinicalNote: 'Utilizada para Doxorrubicina, Ciclofosfamida, Vincristina e em protocolos de suporte em pacientes oncológicos.',
  },
];
