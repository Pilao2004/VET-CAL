// Produtos sem cálculo por kg: colírios, otológicos, pomadas, sprays, pastas com seringa graduada e vacinas.
import { CommercialProduct } from '../data/commercialProducts';

export interface FixedPosology {
  posology: string;
  schedule?: string;
}

export function fixedPosology(p: CommercialProduct): FixedPosology | null {
  if (p.fixedDosing) return { posology: p.fixedDosing, schedule: p.vaccineSchedule };
  const route = (p.defaultRoute || '').toLowerCase();
  const byRoute = /oft|otol|inalat/.test(route);
  const noConcentration = ['paste', 'spray', 'topical'].includes(p.formType) && !p.concentrationMgMl;
  if (p.formType === 'vaccine' || byRoute || noConcentration) {
    return { posology: p.doseRangeText, schedule: p.vaccineSchedule };
  }
  return null;
}
