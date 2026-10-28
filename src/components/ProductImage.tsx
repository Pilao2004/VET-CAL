import React from 'react';
import { CommercialProduct } from '../data/commercialProducts';

// Ilustração da embalagem de cada produto, desenhada a partir da apresentação cadastrada
// (frasco-ampola, comprimidos, conta-gotas...). Não é foto do produto.

export type PackageKind = 'vial' | 'ampoule' | 'bottle' | 'dropper' | 'tablets' | 'tube' | 'spray' | 'syringe' | 'pipette' | 'bag';

const KIND_LABEL: Record<PackageKind, string> = {
  vial: 'frasco-ampola',
  ampoule: 'ampola',
  bottle: 'frasco',
  dropper: 'frasco conta-gotas',
  tablets: 'comprimidos',
  tube: 'bisnaga',
  spray: 'spray',
  syringe: 'seringa dosadora',
  pipette: 'pipeta',
  bag: 'bolsa',
};

export function packageKind(p: Pick<CommercialProduct, 'formType' | 'presentationText' | 'defaultRoute'>): PackageKind {
  const text = `${p.presentationText || ''} ${p.defaultRoute || ''}`.toLowerCase();
  if (text.includes('bolsa')) return 'bag';
  if (text.includes('pipeta')) return 'pipette';
  if (text.includes('seringa')) return 'syringe';
  if (p.formType === 'spray' || text.includes('spray') || text.includes('inalat')) return 'spray';
  if (text.includes('bisnaga') || p.formType === 'paste') return 'tube';
  if (p.formType === 'drops' || text.includes('conta-gotas') || text.includes('otol') || text.includes('oftálm') || text.includes('oftalm')) return 'dropper';
  if (p.formType === 'tablet') return 'tablets';
  if (p.formType === 'topical') return 'tube';
  if (/\bampola\b/.test(text) && !text.includes('frasco-ampola')) return 'ampoule';
  if (text.includes('frasco-ampola') || /\b(iv|im|sc)\b|intraven|intramus|subcut/.test(text)) return 'vial';
  return 'bottle';
}

// Uma cor por classe terapêutica (sempre a mesma para a mesma classe)
const PALETTE = ['#00B386', '#2F80ED', '#9B51E0', '#F2994A', '#EB5757', '#0EA5B7', '#D9A400', '#E0559B'];
function accentFor(category: string) {
  let h = 0;
  for (const ch of category) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

const GLASS = '#FFFFFF';
const LINE = '#B9C7D6';
const DARK = '#3B4A5E';

function Drawing({ kind, accent }: { kind: PackageKind; accent: string }) {
  switch (kind) {
    case 'vial':
      return (
        <>
          <rect x="23" y="7" width="18" height="8" rx="2" fill={DARK} />
          <rect x="26" y="15" width="12" height="5" fill="#D7DEE7" />
          <rect x="17" y="20" width="30" height="37" rx="6" fill={GLASS} stroke={LINE} strokeWidth="1.5" />
          <rect x="18.5" y="40" width="27" height="15.5" rx="4.5" fill={accent} opacity="0.25" />
          <rect x="17" y="27" width="30" height="13" fill={accent} />
          <rect x="21" y="31" width="14" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
          <rect x="21" y="35" width="9" height="2" rx="1" fill="#FFFFFF" opacity="0.6" />
        </>
      );
    case 'ampoule':
      return (
        <>
          <path d="M29 6h6v9c0 2 3 3 3 6v2h-12v-2c0-3 3-4 3-6z" fill={GLASS} stroke={LINE} strokeWidth="1.5" />
          <rect x="27.5" y="19" width="9" height="2" fill={accent} />
          <path d="M24 23h16v28a8 8 0 0 1-16 0z" fill={GLASS} stroke={LINE} strokeWidth="1.5" />
          <path d="M25.5 40h13v11a6.5 6.5 0 0 1-13 0z" fill={accent} opacity="0.3" />
          <rect x="24" y="29" width="16" height="9" fill={accent} />
        </>
      );
    case 'bottle':
      return (
        <>
          <rect x="23" y="5" width="18" height="10" rx="2.5" fill={accent} />
          <rect x="25" y="15" width="14" height="4" fill="#D7DEE7" />
          <rect x="15" y="19" width="34" height="39" rx="8" fill="#F7EBDD" stroke="#D8BFA2" strokeWidth="1.5" />
          <rect x="15" y="28" width="34" height="19" fill={GLASS} />
          <rect x="15" y="28" width="34" height="5" fill={accent} />
          <rect x="20" y="37" width="20" height="2.5" rx="1" fill={DARK} opacity="0.5" />
          <rect x="20" y="42" width="13" height="2" rx="1" fill={DARK} opacity="0.3" />
        </>
      );
    case 'dropper':
      return (
        <>
          <ellipse cx="32" cy="9" rx="6" ry="5" fill={DARK} />
          <rect x="29" y="12" width="6" height="7" fill={DARK} />
          <rect x="24" y="19" width="16" height="6" rx="1.5" fill={accent} />
          <rect x="18" y="25" width="28" height="33" rx="7" fill={GLASS} stroke={LINE} strokeWidth="1.5" />
          <rect x="18" y="33" width="28" height="13" fill={accent} opacity="0.9" />
          <rect x="22" y="37" width="14" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
          <path d="M51 42c0 0-3 4-3 6a3 3 0 0 0 6 0c0-2-3-6-3-6z" fill={accent} opacity="0.7" />
        </>
      );
    case 'tablets':
      return (
        <>
          <rect x="8" y="14" width="34" height="40" rx="3" fill={GLASS} stroke={LINE} strokeWidth="1.5" />
          <path d="M8 14l6-6h34l-6 6z" fill="#E9EFF5" stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M42 14l6-6v40l-6 6z" fill="#DCE5EE" stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="8" y="22" width="34" height="11" fill={accent} />
          <rect x="12" y="26" width="16" height="3" rx="1" fill="#FFFFFF" opacity="0.9" />
          <rect x="12" y="38" width="22" height="2.5" rx="1" fill={DARK} opacity="0.35" />
          <circle cx="47" cy="50" r="7" fill="#FFFFFF" stroke={LINE} strokeWidth="1.5" />
          <line x1="42" y1="50" x2="52" y2="50" stroke={LINE} strokeWidth="1.2" />
          <ellipse cx="55" cy="40" rx="5" ry="3.2" fill={accent} opacity="0.55" transform="rotate(-30 55 40)" />
        </>
      );
    case 'tube':
      return (
        <>
          <rect x="26" y="5" width="12" height="9" rx="2" fill={DARK} />
          <path d="M22 14h20l3 36h-26z" fill={GLASS} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M19 50h26v6h-26z" fill="#E1E8F0" stroke={LINE} strokeWidth="1.5" />
          <path d="M22.6 21h18.8l1.2 15h-21.2z" fill={accent} />
          <rect x="25" y="26" width="12" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
        </>
      );
    case 'spray':
      return (
        <>
          <rect x="26" y="5" width="13" height="6" rx="1.5" fill={DARK} />
          <rect x="38" y="6.5" width="8" height="3" rx="1" fill={DARK} />
          <rect x="28" y="11" width="9" height="7" fill="#D7DEE7" />
          <rect x="19" y="18" width="27" height="40" rx="6" fill={GLASS} stroke={LINE} strokeWidth="1.5" />
          <rect x="19" y="27" width="27" height="15" fill={accent} />
          <rect x="23" y="31" width="13" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
          <circle cx="51" cy="5" r="1.2" fill={accent} /><circle cx="54" cy="8" r="1.2" fill={accent} /><circle cx="51" cy="11" r="1.2" fill={accent} />
        </>
      );
    case 'syringe':
      return (
        <>
          <g transform="rotate(-35 32 32)">
            <rect x="6" y="27" width="40" height="11" rx="2" fill={GLASS} stroke={LINE} strokeWidth="1.5" />
            <rect x="7.5" y="28.5" width="22" height="8" fill={accent} opacity="0.85" />
            <rect x="46" y="30" width="6" height="5" fill={LINE} />
            <rect x="52" y="31.5" width="5" height="2" fill={LINE} />
            <rect x="1" y="25" width="5" height="15" rx="1.5" fill={DARK} />
            {[14, 20, 26, 32, 38].map((x) => (
              <line key={x} x1={x} y1="27" x2={x} y2="31" stroke={DARK} strokeWidth="1" opacity="0.6" />
            ))}
          </g>
        </>
      );
    case 'pipette':
      return (
        <>
          <path d="M24 10h16l-2 22h-12z" fill={GLASS} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M25 18h14l-1 12h-12z" fill={accent} />
          <path d="M26 32h12l-4 18h-4z" fill={GLASS} stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M31 50l1 6 1-6z" fill={LINE} />
          <path d="M44 46c0 0-3 4-3 6a3 3 0 0 0 6 0c0-2-3-6-3-6z" fill={accent} opacity="0.7" />
        </>
      );
    case 'bag':
      return (
        <>
          <circle cx="32" cy="7" r="3" fill="none" stroke={LINE} strokeWidth="1.5" />
          <path d="M16 12h32v32c0 6-6 10-16 10s-16-4-16-10z" fill={GLASS} stroke={LINE} strokeWidth="1.5" />
          <path d="M17.5 30h29v14c0 5-6 8.5-14.5 8.5s-14.5-3.5-14.5-8.5z" fill={accent} opacity="0.25" />
          <rect x="21" y="17" width="22" height="10" rx="1.5" fill={accent} />
          <rect x="29" y="54" width="6" height="7" rx="1" fill={DARK} />
        </>
      );
  }
}

/** Imagem ilustrativa da embalagem, ao lado do nome do medicamento. */
export const ProductImage: React.FC<{ product: CommercialProduct; size?: number; className?: string }> = ({ product, size = 56, className = '' }) => {
  const kind = packageKind(product);
  const accent = accentFor(product.category || product.activePrinciple);
  const label = `Ilustração: ${KIND_LABEL[kind]} de ${product.brandName.split(/[(]/)[0].trim()}`;
  return (
    <div
      className={`shrink-0 rounded-2xl border border-[var(--border)] overflow-hidden flex items-center justify-center ${className}`}
      style={{ width: size, height: size, background: `linear-gradient(145deg, ${accent}22, ${accent}0D)` }}
      title={`${label} (imagem ilustrativa)`}
    >
      <svg viewBox="0 0 64 64" width={size * 0.82} height={size * 0.82} role="img" aria-label={label}>
        <Drawing kind={kind} accent={accent} />
      </svg>
    </div>
  );
};
