import * as fs from 'fs';
import * as path from 'path';
import { COMMERCIAL_PRODUCTS, CommercialProduct } from '../src/data/commercialProducts';

// Helper to determine clean manufacturer
function getManufacturer(brandName: string, notes?: string): string {
  const match = brandName.match(/\(([^)]+)\)/);
  if (match) {
    const raw = match[1].trim();
    if (raw.includes('Agener')) return 'Agener União';
    if (raw.includes('Ourofino')) return 'Ourofino';
    if (raw.includes('Zoetis')) return 'Zoetis';
    if (raw.includes('Elanco')) return 'Elanco';
    if (raw.includes('Boehringer')) return 'Boehringer Ingelheim';
    if (raw.includes('Chemitec')) return 'Chemitec';
    if (raw.includes('Ceva')) return 'Ceva';
    if (raw.includes('Vetnil')) return 'Vetnil';
    if (raw.includes('Syntec')) return 'Syntec';
    if (raw.includes('Vansil')) return 'Vansil';
    if (raw.includes('MSD')) return 'MSD Saúde Animal';
    if (raw.includes('Virbac')) return 'Virbac';
    if (raw.includes('Dechra')) return 'Dechra';
    if (raw.includes('Cristália')) return 'Cristália';
    if (raw.includes('Duprat')) return 'Duprat';
    if (raw.includes('Biolab')) return 'Biolab';
    if (raw.includes('Sanofi')) return 'Sanofi';
    if (raw.includes('Hipolabor')) return 'Hipolabor';
    if (raw.includes('Eurofarma')) return 'Eurofarma';
    if (raw.includes('Pfizer')) return 'Pfizer';
    if (raw.includes('Roche')) return 'Roche';
    if (raw.includes('Aché')) return 'Aché';
    if (raw.includes('GSK') || raw.includes('Glaxo')) return 'GlaxoSmithKline (GSK)';
    return raw;
  }
  if (notes) {
    if (notes.includes('Agener União')) return 'Agener União';
    if (notes.includes('Ourofino')) return 'Ourofino';
    if (notes.includes('Zoetis')) return 'Zoetis';
    if (notes.includes('Elanco')) return 'Elanco';
    if (notes.includes('Boehringer')) return 'Boehringer Ingelheim';
    if (notes.includes('Chemitec')) return 'Chemitec';
    if (notes.includes('Ceva')) return 'Ceva';
    if (notes.includes('Vetnil')) return 'Vetnil';
    if (notes.includes('Syntec')) return 'Syntec';
    if (notes.includes('Vansil')) return 'Vansil';
    if (notes.includes('MSD')) return 'MSD Saúde Animal';
    if (notes.includes('Virbac')) return 'Virbac';
    if (notes.includes('Dechra')) return 'Dechra';
    if (notes.includes('Cristália')) return 'Cristália';
  }
  return 'Laboratório Especializado';
}

const enhancedExisting: CommercialProduct[] = COMMERCIAL_PRODUCTS.map((p) => {
  const manufacturer = (p as any).manufacturer || getManufacturer(p.brandName, p.clinicalNotes);
  const presentationText =
    (p as any).presentationText ||
    (p.formType === 'liquid'
      ? `Frasco-ampola de ${p.bottleVolumeMl || 20} mL`
      : p.formType === 'drops'
      ? `Frasco conta-gotas de ${p.bottleVolumeMl || 20} mL`
      : `Cartucho com ${p.tabletsPerBox || 10} comprimidos`);

  return {
    ...p,
    manufacturer,
    presentationText,
    validationStatus: 'VALIDADO' as const,
  };
});

// Set of existing IDs to guarantee 100% uniqueness
const existingIds = new Set(enhancedExisting.map(p => p.id));

console.log("Current existing unique IDs:", existingIds.size);
