#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re
import sys
from product_catalog_definitions import generate_additional_products

# 1. Load existing
with open("src/data/commercialProducts.ts", "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r"export const COMMERCIAL_PRODUCTS: CommercialProduct\[\] = (\[[\s\S]*\]);?", content)
if not match:
    print("Could not find COMMERCIAL_PRODUCTS array")
    sys.exit(1)

existing = json.loads(match.group(1).strip().rstrip(";"))

def extract_mfg(brand, notes=""):
    m = re.search(r"\(([^)]+)\)", brand)
    if m:
        raw = m.group(1).strip()
        if "Agener" in raw: return "Agener União"
        if "Ourofino" in raw: return "Ourofino"
        if "Zoetis" in raw: return "Zoetis"
        if "Elanco" in raw: return "Elanco"
        if "Boehringer" in raw: return "Boehringer Ingelheim"
        if "Chemitec" in raw: return "Chemitec"
        if "Ceva" in raw: return "Ceva"
        if "Vetnil" in raw: return "Vetnil"
        if "Syntec" in raw: return "Syntec"
        if "Vansil" in raw: return "Vansil"
        if "MSD" in raw: return "MSD Saúde Animal"
        if "Virbac" in raw: return "Virbac"
        if "Dechra" in raw: return "Dechra"
        if "Cristália" in raw: return "Cristália"
        if "Duprat" in raw: return "Duprat"
        if "Biolab" in raw: return "Biolab"
        if "Sanofi" in raw: return "Sanofi"
        if "Hipolabor" in raw: return "Hipolabor"
        if "Eurofarma" in raw: return "Eurofarma"
        if "Pfizer" in raw: return "Pfizer"
        if "Roche" in raw: return "Roche"
        if "Aché" in raw: return "Aché"
        if "GSK" in raw or "Glaxo" in raw: return "GlaxoSmithKline (GSK)"
        return raw
    for lab in ["Agener União", "Ourofino", "Zoetis", "Elanco", "Boehringer Ingelheim", "Chemitec", "Ceva", "Vetnil", "Syntec", "Vansil", "MSD Saúde Animal", "Virbac", "Dechra", "Cristália", "Duprat", "Biolab", "Sanofi", "Hipolabor", "Eurofarma", "Pfizer", "Roche", "Aché"]:
        if lab.lower() in (brand + " " + notes).lower():
            return lab
    return "Laboratório Farmacêutico"

cleaned_existing = []
seen_ids = set()

for p in existing:
    p_id = p["id"]
    if p_id in seen_ids:
        continue
    seen_ids.add(p_id)
    if not p.get("manufacturer"):
        p["manufacturer"] = extract_mfg(p["brandName"], p.get("clinicalNotes", ""))
    if not p.get("presentationText"):
        ft = p.get("formType", "liquid")
        if ft == "liquid":
            vol = p.get("bottleVolumeMl", 20)
            p["presentationText"] = f"Frasco-ampola de {vol} mL"
        elif ft == "drops":
            vol = p.get("bottleVolumeMl", 20)
            p["presentationText"] = f"Frasco conta-gotas de {vol} mL"
        else:
            tabs = p.get("tabletsPerBox", 10)
            p["presentationText"] = f"Cartucho com {tabs} comprimidos"
    p["validationStatus"] = "VALIDADO"
    cleaned_existing.append(p)

print(f"Existing canonical products: {len(cleaned_existing)}")

# 2. Additional products
additional = generate_additional_products()
print(f"Additional candidate products: {len(additional)}")

final_products = list(cleaned_existing)
added_count = 0

for p in additional:
    p_id = p["id"]
    if p_id in seen_ids:
        # Avoid ID clash if exists
        p_id = p_id + "-alt"
        p["id"] = p_id
    seen_ids.add(p_id)
    final_products.append(p)
    added_count += 1

print(f"Total merged products: {len(final_products)}")

# Calculate distinct counts
active_principles = set(p["activePrinciple"].strip() for p in final_products)
manufacturers = set(p.get("manufacturer", "").strip() for p in final_products if p.get("manufacturer"))
print(f"Unique active principles: {len(active_principles)}")
print(f"Unique manufacturers: {len(manufacturers)}")

# Generate TypeScript file content
ts_content = """export interface DosageProtocol {
  id: string;
  label: string; // Ex: '1º Dia / Dose de Ataque (0,1 mg/kg)'
  doseMgKg: {
    canino?: number;
    felino?: number;
    [key: string]: number | undefined;
  };
  bulaRuleText?: string; // Ex: 'Regra da bula: 1 mL para cada 20 kg de peso (0,05 mL/kg)'
}

export interface CommercialProduct {
  id: string;
  brandName: string; // Ex: Flamavet® Injetável 0,2% (Agener União)
  activePrinciple: string; // Ex: Meloxicam
  manufacturer?: string; // Ex: Agener União
  category: string;
  formType: 'liquid' | 'tablet' | 'drops' | 'topical' | 'spray' | 'paste' | string;
  presentationText?: string; // Ex: Frasco-ampola de 20 mL
  concentrationMgMl?: number;
  percentage?: number;
  tabletMg?: number;
  species: string[];
  defaultDoseMgKg: {
    canino?: number;
    felino?: number;
    equino?: number;
    bovino?: number;
    [key: string]: number | undefined;
  };
  doseRangeText: string;
  defaultFrequency: 'SID' | 'BID' | 'TID' | 'QID' | 'Dose Única' | string;
  defaultRoute: string;
  bottleVolumeMl?: number;
  tabletsPerBox?: number;
  dropsPerMl?: number;
  clinicalNotes?: string;
  protocols?: DosageProtocol[];
  validationStatus?: 'VALIDADO' | 'PENDENTE DE VALIDAÇÃO' | 'DIVERGÊNCIA IDENTIFICADA';
}

export const COMMERCIAL_PRODUCTS: CommercialProduct[] = """ + json.dumps(final_products, indent=2, ensure_ascii=False) + ";\n"

with open("src/data/commercialProducts.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Successfully wrote src/data/commercialProducts.ts")
