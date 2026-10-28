// Alertas de segurança por espécie e princípio ativo, mostrados junto do cálculo de dose
// (calculadora e Assistente). Não bloqueiam o cálculo: a decisão é do veterinário.
import { CommercialProduct } from '../data/commercialProducts';

export interface SafetyAlert {
  level: 'danger' | 'warning';
  text: string;
}

const norm = (s: string) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const NSAIDS = /meloxicam|carprofeno|cetoprofeno|firocoxib|robenacoxib|nimesulida|diclofenaco|flunixin|ibuprofeno|naproxeno|piroxicam|acido acetilsalicilico|\baas\b|aspirina/;
const CORTICOIDS = /dexametasona|prednisolona|prednisona|metilprednisolona|triancinolona|betametasona/;
const MACROCYCLIC = /ivermectina|doramectina|moxidectina|abamectina|selamectina|milbemicina/;
const MDR1_SENSITIVE = /loperamida|acepromazina|vincristina|doxorrubicina/;

export function speciesSafetyAlerts(input: {
  activePrinciple: string;
  name?: string;
  species: string;
  doseMgKg?: number;
  product?: CommercialProduct | null;
}): SafetyAlert[] {
  const drug = norm(`${input.activePrinciple} ${input.name || ''}`);
  const sp = norm(input.species);
  const isCat = sp.startsWith('felin') || sp === 'gato';
  const isDog = sp.startsWith('canin') || sp === 'cao';
  const dose = input.doseMgKg || 0;
  const alerts: SafetyAlert[] = [];

  if (isCat) {
    if (/paracetamol|acetaminofen/.test(drug)) {
      alerts.push({ level: 'danger', text: 'Paracetamol é tóxico para gatos em qualquer dose (metemoglobinemia, edema de face e lesão hepática). Não usar.' });
    }
    if (/permetrina|cipermetrina|deltametrina|piretr/.test(drug)) {
      alerts.push({ level: 'danger', text: 'Permetrina e piretroides concentrados causam tremores e convulsões em gatos. Não usar produtos de cães em gatos.' });
    }
    if (/benzocaina/.test(drug)) {
      alerts.push({ level: 'danger', text: 'Benzocaína pode causar metemoglobinemia em gatos.' });
    }
    if (/enrofloxacin/.test(drug) && dose > 5) {
      alerts.push({ level: 'danger', text: `Enrofloxacino acima de 5 mg/kg/dia pode causar degeneração de retina e cegueira em gatos (dose informada: ${dose} mg/kg).` });
    }
    if (NSAIDS.test(drug)) {
      alerts.push({
        level: 'warning',
        text: /aspirina|acido acetilsalicilico|\baas\b/.test(drug)
          ? 'Gatos eliminam o ácido acetilsalicílico muito devagar: intervalos de 48-72 h e risco de toxicidade.'
          : 'Gatos metabolizam mal os AINEs: use a menor dose eficaz, pelo menor tempo, com o paciente hidratado e função renal avaliada.',
      });
    }
    if (/lidocaina/.test(drug)) {
      alerts.push({ level: 'warning', text: 'Gatos são sensíveis à lidocaína (sinais neurológicos e cardiovasculares): use doses menores que as de cães.' });
    }
    if (/doxiciclina|tetraciclina|clindamicina/.test(drug) && input.product?.formType === 'tablet') {
      alerts.push({ level: 'warning', text: 'Comprimidos de doxiciclina ou clindamicina podem causar esofagite e estenose em gatos: ofereça água ou alimento logo após.' });
    }
  }

  if (isDog && MACROCYCLIC.test(drug)) {
    alerts.push({
      level: 'warning',
      text: 'Raças com mutação MDR1 (Collie, Pastor de Shetland, Pastor Australiano, Border Collie, Old English Sheepdog, Whippet de pelo longo e mestiços) podem intoxicar com lactonas macrocíclicas acima das doses preventivas. Considere o teste MDR1.',
    });
  }
  if (isDog && MDR1_SENSITIVE.test(drug)) {
    alerts.push({ level: 'warning', text: 'Cães com mutação MDR1 são mais sensíveis a este fármaco: reduza a dose em raças de risco.' });
  }

  if (NSAIDS.test(drug)) {
    alerts.push({ level: 'warning', text: 'Não associar AINE a corticoide nem a outro AINE (risco de úlcera gastrointestinal e lesão renal). Respeite um intervalo de troca.' });
  }
  if (CORTICOIDS.test(drug)) {
    alerts.push({ level: 'warning', text: 'Não associar corticoide a AINE. Em uso prolongado, reduzir a dose de forma gradual.' });
  }
  if (/metronidazol/.test(drug) && dose > 25) {
    alerts.push({ level: 'warning', text: `Metronidazol em doses altas pode causar sinais neurológicos (ataxia, nistagmo). Dose informada: ${dose} mg/kg por tomada.` });
  }
  if (/gentamicina|amicacina|tobramicina|neomicina/.test(drug)) {
    alerts.push({ level: 'warning', text: 'Aminoglicosídeos são nefrotóxicos: mantenha o paciente hidratado, use dose única diária e monitore a urina e a creatinina.' });
  }

  // Produto sem indicação cadastrada para a espécie escolhida
  const productSpecies = (input.product?.species || []).map(norm);
  if (input.product && (isCat || isDog) && productSpecies.length > 0) {
    const wanted = isCat ? 'felin' : 'canin';
    if (!productSpecies.some((s) => s.startsWith(wanted))) {
      alerts.push({
        level: 'danger',
        text: `Este produto não tem indicação cadastrada para ${isCat ? 'gatos' : 'cães'} (cadastro: ${input.product.species.join(', ')}). Confira a bula antes de usar; a dose pode não se aplicar a esta espécie.`,
      });
    }
  }

  // Dose muito acima da dose padrão do cadastro para a espécie
  const key = norm(input.species).replace(/\s+/g, '');
  const reference = input.product?.defaultDoseMgKg?.[key];
  if (reference && dose > reference * 2) {
    alerts.push({
      level: 'warning',
      text: `A dose informada (${dose} mg/kg) é ${(dose / reference).toFixed(1).replace('.', ',')} vezes a dose padrão do cadastro (${reference} mg/kg). Confira a prescrição.`,
    });
  }

  return alerts;
}
