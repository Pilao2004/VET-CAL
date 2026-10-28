export interface DosageProtocol {
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

export const COMMERCIAL_PRODUCTS: CommercialProduct[] = [
  {
    "id": "flamavet-inj-02",
    "brandName": "Flamavet® Injetável 0,2% (Agener União)",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "concentrationMgMl": 2,
    "percentage": 0.2,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "Gatos: 0,1 mg/kg no 1º dia (0,05 mL/kg) | Cães: 0,2 mg/kg no 1º dia (0,1 mL/kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 20,
    "clinicalNotes": "0,2% = 2 mg/mL. Regra da Bula (Agener União): Gatos no 1º dia / dose única recebem 1 mL para cada 20 kg (0,05 mL/kg → 0,20 mL para 4 kg). A partir do 2º dia: 1 mL para cada 40 kg (0,05 mg/kg → 0,10 mL para 4 kg). Cães: 0,2 mg/kg 1º dia e 0,1 mg/kg manutenção.",
    "protocols": [
      {
        "id": "day1-attack",
        "label": "1º Dia / Dose de Ataque / Dose Única (Padrão Recomendado)",
        "doseMgKg": {
          "canino": 0.2,
          "felino": 0.1
        },
        "bulaRuleText": "Regra da Bula: Gatos = 1 mL para cada 20 kg (0,05 mL/kg = 0,20 mL para 4 kg) | Cães = 1 mL para cada 10 kg (0,1 mL/kg)"
      },
      {
        "id": "day2-maintenance",
        "label": "A partir do 2º Dia / Manutenção",
        "doseMgKg": {
          "canino": 0.1,
          "felino": 0.05
        },
        "bulaRuleText": "Regra da Bula: Gatos = 1 mL para cada 40 kg (0,025 mL/kg = 0,10 mL para 4 kg) | Cães = 1 mL para cada 20 kg (0,05 mL/kg)"
      }
    ],
    "manufacturer": "Agener União",
    "presentationText": "Frasco-ampola de 20 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "flamavet-comp-02",
    "brandName": "Flamavet® 0,2 mg Comprimidos para Gatos (Agener União)",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório Específico para Gatos",
    "formType": "tablet",
    "tabletMg": 0.2,
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 0.1
    },
    "doseRangeText": "1º dia: 1 comp de 0,2 mg para cada 2 kg (0,1 mg/kg) | 2º dia em diante: 1/2 comp para cada 2 kg (0,05 mg/kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Comprimido palatável específico para felinos. Para gato de 4 kg: 1º dia = 2 comprimidos (0,4 mg); manutenção = 1 comprimido (0,2 mg).",
    "protocols": [
      {
        "id": "day1-cat-comp",
        "label": "1º Dia: 1 comp a cada 2 kg (0,1 mg/kg)",
        "doseMgKg": {
          "canino": 0.1,
          "felino": 0.1
        },
        "bulaRuleText": "Gatos de 4 kg: administrar 2 comprimidos no 1º dia"
      },
      {
        "id": "day2-cat-comp",
        "label": "A partir do 2º Dia: 1/2 comp a cada 2 kg (0,05 mg/kg)",
        "doseMgKg": {
          "canino": 0.05,
          "felino": 0.05
        },
        "bulaRuleText": "Gatos de 4 kg: administrar 1 comprimido nos dias seguintes"
      }
    ],
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "flamavet-inj-05",
    "brandName": "Flamavet® Injetável 0,5% (Agener União)",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "percentage": 0.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "Cães: 0,2 mg/kg ataque (0,04 mL/kg) | Gatos: 0,1 mg/kg dose inicial (0,02 mL/kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 20,
    "clinicalNotes": "0,5% = 5 mg/mL.",
    "protocols": [
      {
        "id": "day1",
        "label": "1º Dia / Ataque (0,2 mg/kg cães | 0,1 mg/kg gatos)",
        "doseMgKg": {
          "canino": 0.2,
          "felino": 0.1
        },
        "bulaRuleText": "5 mg/mL: Cães 0,04 mL/kg | Gatos 0,02 mL/kg"
      },
      {
        "id": "day2",
        "label": "A partir do 2º Dia / Manutenção (0,1 mg/kg cães | 0,05 mg/kg gatos)",
        "doseMgKg": {
          "canino": 0.1,
          "felino": 0.05
        },
        "bulaRuleText": "5 mg/mL: Cães 0,02 mL/kg | Gatos 0,01 mL/kg"
      }
    ],
    "manufacturer": "Agener União",
    "presentationText": "Frasco-ampola de 20 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "flamavet-comp-05",
    "brandName": "Flamavet® 0,5 mg Comprimidos",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 0.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "Cães: 0,2 mg/kg ataque e 0,1 mg/kg manutenção | Gatos: 0,1 mg/kg dia 1 e 0,05 mg/kg manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Para cães e gatos. No 1º dia em gatos de 4 ou 5 kg: 1 comprimido (0,1 mg/kg).",
    "protocols": [
      {
        "id": "day1",
        "label": "1º Dia / Ataque (0,2 mg/kg cães | 0,1 mg/kg gatos)",
        "doseMgKg": {
          "canino": 0.2,
          "felino": 0.1
        }
      },
      {
        "id": "day2",
        "label": "A partir do 2º Dia / Manutenção (0,1 mg/kg cães | 0,05 mg/kg gatos)",
        "doseMgKg": {
          "canino": 0.1,
          "felino": 0.05
        }
      }
    ],
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "flamavet-comp-10",
    "brandName": "Flamavet® 1,0 mg Comprimidos",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 1,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1
    },
    "doseRangeText": "0,1 mg/kg manutenção a cada 24h",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Ideal para cães de 10 kg (1 comprimido a cada 24h).",
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "flamavet-comp-20",
    "brandName": "Flamavet® 2,0 mg Comprimidos",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 2,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1
    },
    "doseRangeText": "0,1 mg/kg manutenção a cada 24h",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Ideal para cães de 20 kg (1 comprimido a cada 24h).",
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "maxicam-inj-02",
    "brandName": "Maxicam® Injetável 0,2% (Ourofino)",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "concentrationMgMl": 2,
    "percentage": 0.2,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "Cães: 0,2 mg/kg ataque | Gatos: 0,1 mg/kg no 1º dia (0,05 mL/kg = 0,20 mL para 4 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 20,
    "clinicalNotes": "0,2% = 2 mg/mL. Gatos: 0,1 mg/kg no 1º dia (0,05 mL/kg), 0,05 mg/kg nos seguintes.",
    "protocols": [
      {
        "id": "day1",
        "label": "1º Dia / Ataque (0,2 mg/kg cães | 0,1 mg/kg gatos)",
        "doseMgKg": {
          "canino": 0.2,
          "felino": 0.1
        },
        "bulaRuleText": "Gatos 4 kg = 0,20 mL (0,05 mL/kg) | Cães = 0,1 mL/kg"
      },
      {
        "id": "day2",
        "label": "A partir do 2º Dia / Manutenção (0,1 mg/kg cães | 0,05 mg/kg gatos)",
        "doseMgKg": {
          "canino": 0.1,
          "felino": 0.05
        },
        "bulaRuleText": "Gatos 4 kg = 0,10 mL | Cães = 0,05 mL/kg"
      }
    ],
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 20 mL"
  },
  {
    "id": "maxicam-inj-05",
    "brandName": "Maxicam® Injetável 0,5% (Ourofino)",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "percentage": 0.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "0,2 mg/kg em cães, 0,1 mg/kg em gatos no 1º dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 20,
    "clinicalNotes": "0,5% = 5 mg/mL.",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 20 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "maxicam-gotas-05",
    "brandName": "Maxicam® Gotas 0,5 mg/mL (Ourofino)",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "drops",
    "concentrationMgMl": 0.5,
    "dropsPerMl": 20,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "1º dia: 0,2 mg/kg cães (8 gotas/kg), 0,1 mg/kg gatos (4 gotas/kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 10,
    "clinicalNotes": "1 gota = 0,025 mg. 4 gotas = 0,1 mg.",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco conta-gotas de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "maxicam-comp-05",
    "brandName": "Maxicam® 0,5 mg Comprimidos",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 0.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1,
      "felino": 0.05
    },
    "doseRangeText": "Cães: 0,1 mg/kg SID (manutenção) | Gatos: 0,05 mg/kg SID (manutenção, menor dose eficaz)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "maxicam-comp-20",
    "brandName": "Maxicam® 2,0 mg Comprimidos",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 2,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1
    },
    "doseRangeText": "0,1 mg/kg manutenção a cada 24h",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "manufacturer": "Ourofino",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "meloxivet-comp-10",
    "brandName": "Meloxivet® 1 mg Comprimidos (Duprat)",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 1,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1
    },
    "doseRangeText": "0,1 mg/kg SID manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "manufacturer": "Duprat",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "meloxivet-comp-40",
    "brandName": "Meloxivet® 4 mg Comprimidos (Duprat)",
    "activePrinciple": "Meloxicam",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 4,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1
    },
    "doseRangeText": "0,1 mg/kg para cães de 40 kg",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "manufacturer": "Duprat",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "synulox-comp-50",
    "brandName": "Synulox® 50 mg Comprimidos (Zoetis)",
    "activePrinciple": "Amoxicilina + Clavulanato de Potássio",
    "category": "Antimicrobiano",
    "formType": "tablet",
    "tabletMg": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5,
      "felino": 12.5
    },
    "doseRangeText": "12,5 a 25 mg/kg a cada 12h",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "1 comp de 50 mg trata 4 kg de peso a 12,5 mg/kg.",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "synulox-comp-250",
    "brandName": "Synulox® 250 mg Comprimidos (Zoetis)",
    "activePrinciple": "Amoxicilina + Clavulanato de Potássio",
    "category": "Antimicrobiano",
    "formType": "tablet",
    "tabletMg": 250,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5
    },
    "doseRangeText": "12,5 a 25 mg/kg a cada 12h",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "1 comp de 250 mg trata 20 kg de peso a 12,5 mg/kg.",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "synulox-comp-500",
    "brandName": "Synulox® 500 mg Comprimidos (Zoetis)",
    "activePrinciple": "Amoxicilina + Clavulanato de Potássio",
    "category": "Antimicrobiano",
    "formType": "tablet",
    "tabletMg": 500,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5
    },
    "doseRangeText": "12,5 a 25 mg/kg a cada 12h",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "1 comp de 500 mg trata 40 kg de peso a 12,5 mg/kg.",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "synulox-susp-50",
    "brandName": "Synulox® Suspensão Oral Pronta (50 mg/mL)",
    "activePrinciple": "Amoxicilina + Clavulanato de Potássio",
    "category": "Antimicrobiano",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5,
      "felino": 12.5
    },
    "doseRangeText": "12,5 a 25 mg/kg a cada 12h (0,25 mL/kg)",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 15,
    "clinicalNotes": "12,5 mg/kg equivale a 0,25 mL/kg. Agitar antes de usar.",
    "manufacturer": "Zoetis",
    "presentationText": "Frasco-ampola de 15 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "agemoxi-cl-comp-50",
    "brandName": "Agemoxi CL® 50 mg Comprimidos",
    "activePrinciple": "Amoxicilina + Clavulanato",
    "category": "Antimicrobiano",
    "formType": "tablet",
    "tabletMg": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5,
      "felino": 12.5
    },
    "doseRangeText": "12,5 a 25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "agemoxi-cl-comp-250",
    "brandName": "Agemoxi CL® 250 mg Comprimidos",
    "activePrinciple": "Amoxicilina + Clavulanato",
    "category": "Antimicrobiano",
    "formType": "tablet",
    "tabletMg": 250,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5
    },
    "doseRangeText": "12,5 a 25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "agemoxi-cl-inj-140",
    "brandName": "Agemoxi CL® Injetável (140 mg/mL)",
    "activePrinciple": "Amoxicilina + Clavulanato",
    "category": "Antimicrobiano",
    "formType": "liquid",
    "concentrationMgMl": 140,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 8.75,
      "felino": 8.75
    },
    "doseRangeText": "8,75 mg/kg (1 mL para cada 16 kg) a cada 24h",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Dose do produto pronto: 1 mL para cada 16 kg de peso corporal.",
    "manufacturer": "Agener União",
    "presentationText": "Frasco-ampola de 50 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "cerenia-inj-10",
    "brandName": "Cerenia® Injetável 10 mg/mL (1%) (Zoetis)",
    "activePrinciple": "Citrato de Maropitant",
    "category": "Antiemético",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "percentage": 1,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 mg/kg a cada 24h por até 5 dias (0,1 mL/kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IV",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Dose prática exata: 0,1 mL para cada 1 kg de peso. Manter refrigerado para não arder.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Frasco-ampola de 20 mL"
  },
  {
    "id": "cerenia-comp-16",
    "brandName": "Cerenia® 16 mg Comprimidos (Zoetis)",
    "activePrinciple": "Citrato de Maropitant",
    "category": "Antiemético",
    "formType": "tablet",
    "tabletMg": 16,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg SID para vômito agudo | 8 mg/kg para cinetose",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 4,
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 4 comprimidos"
  },
  {
    "id": "cerenia-comp-24",
    "brandName": "Cerenia® 24 mg Comprimidos (Zoetis)",
    "activePrinciple": "Citrato de Maropitant",
    "category": "Antiemético",
    "formType": "tablet",
    "tabletMg": 24,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg para vômito agudo",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 4,
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 4 comprimidos"
  },
  {
    "id": "cerenia-comp-60",
    "brandName": "Cerenia® 60 mg Comprimidos (Zoetis)",
    "activePrinciple": "Citrato de Maropitant",
    "category": "Antiemético",
    "formType": "tablet",
    "tabletMg": 60,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg para vômito agudo",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 4,
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 4 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "baytril-inj-25",
    "brandName": "Baytril® Injetável 2,5% (Elanco)",
    "activePrinciple": "Enrofloxacino",
    "category": "Antimicrobiano",
    "formType": "liquid",
    "concentrationMgMl": 25,
    "percentage": 2.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg a cada 24h (1 mL para cada 5 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 10,
    "clinicalNotes": "2,5% = 25 mg/mL. Gatos: dose máxima de 5 mg/kg SID.",
    "manufacturer": "Elanco",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "baytril-inj-50",
    "brandName": "Baytril® Injetável 5% (Elanco)",
    "activePrinciple": "Enrofloxacino",
    "category": "Antimicrobiano",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "percentage": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg a cada 24h (1 mL para cada 10 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 10,
    "clinicalNotes": "5% = 50 mg/mL. 1 mL a cada 10 kg de peso corporal.",
    "manufacturer": "Elanco",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "baytril-inj-100",
    "brandName": "Baytril® Injetável 10% (Elanco)",
    "activePrinciple": "Enrofloxacino",
    "category": "Antimicrobiano",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg a cada 24h (1 mL para cada 20 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 10,
    "clinicalNotes": "10% = 100 mg/mL.",
    "manufacturer": "Elanco",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "baytril-flavour-50",
    "brandName": "Baytril® Flavour 50 mg Comprimidos",
    "activePrinciple": "Enrofloxacino",
    "category": "Antimicrobiano",
    "formType": "tablet",
    "tabletMg": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg a cada 24h (1 comp para cada 10 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "validationStatus": "VALIDADO",
    "manufacturer": "Elanco",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "baytril-flavour-150",
    "brandName": "Baytril® Flavour 150 mg Comprimidos",
    "activePrinciple": "Enrofloxacino",
    "category": "Antimicrobiano",
    "formType": "tablet",
    "tabletMg": 150,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg a cada 24h (1 comp para cada 30 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "validationStatus": "VALIDADO",
    "manufacturer": "Elanco",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "chemitril-inj-10",
    "brandName": "Chemitril® Injetável 10% (Chemitec)",
    "activePrinciple": "Enrofloxacino",
    "category": "Antimicrobiano",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg a cada 24h (1 mL para cada 20 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 50,
    "manufacturer": "Chemitec",
    "presentationText": "Frasco-ampola de 50 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "doxitec-comp-50",
    "brandName": "Doxitec® 50 mg Comprimidos (Syntec)",
    "activePrinciple": "Doxiciclina",
    "category": "Antimicrobiano / Hemoparasitas",
    "formType": "tablet",
    "tabletMg": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "10 mg/kg SID ou 5 mg/kg BID (1 comp para 5 kg SID)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 16,
    "clinicalNotes": "Gatos: administrar com 5 mL de água para evitar estenose esofágica.",
    "manufacturer": "Syntec",
    "presentationText": "Cartucho com 16 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "doxitec-comp-100",
    "brandName": "Doxitec® 100 mg Comprimidos (Syntec)",
    "activePrinciple": "Doxiciclina",
    "category": "Antimicrobiano / Hemoparasitas",
    "formType": "tablet",
    "tabletMg": 100,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "10 mg/kg SID por 28 dias para Erliquiose (1 comp para 10 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 16,
    "clinicalNotes": "1 comp para cada 10 kg a cada 24 horas.",
    "manufacturer": "Syntec",
    "presentationText": "Cartucho com 16 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "doxitec-comp-200",
    "brandName": "Doxitec® 200 mg Comprimidos (Syntec)",
    "activePrinciple": "Doxiciclina",
    "category": "Antimicrobiano / Hemoparasitas",
    "formType": "tablet",
    "tabletMg": 200,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 10
    },
    "doseRangeText": "10 mg/kg SID (1 comp para 20 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 16,
    "manufacturer": "Syntec",
    "presentationText": "Cartucho com 16 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "cronidor-inj-2",
    "brandName": "Cronidor® Injetável 2% (20 mg/mL) (Agener)",
    "activePrinciple": "Cloridrato de Tramadol",
    "category": "Analgésico Opioide",
    "formType": "liquid",
    "concentrationMgMl": 20,
    "percentage": 2,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1.5
    },
    "doseRangeText": "Cães: 2 a 4 mg/kg TID | Gatos: 1 a 2 mg/kg BID",
    "defaultFrequency": "TID",
    "defaultRoute": "IV lenta / SC / IM",
    "bottleVolumeMl": 20,
    "clinicalNotes": "2% = 20 mg/mL.",
    "manufacturer": "Agener União",
    "presentationText": "Frasco-ampola de 20 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "cronidor-inj-5",
    "brandName": "Cronidor® Injetável 5% (50 mg/mL) (Agener)",
    "activePrinciple": "Cloridrato de Tramadol",
    "category": "Analgésico Opioide",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "percentage": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 3,
      "felino": 1.5
    },
    "doseRangeText": "Cães: 2 a 5 mg/kg TID/QID | Gatos: 1 a 2 mg/kg BID/TID",
    "defaultFrequency": "TID",
    "defaultRoute": "IV lenta / SC / IM",
    "bottleVolumeMl": 20,
    "clinicalNotes": "5% = 50 mg/mL.",
    "manufacturer": "Agener União",
    "presentationText": "Frasco-ampola de 20 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "cronidor-comp-12",
    "brandName": "Cronidor® 12 mg Comprimidos",
    "activePrinciple": "Cloridrato de Tramadol",
    "category": "Analgésico Opioide",
    "formType": "tablet",
    "tabletMg": 12,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 3,
      "felino": 1.5
    },
    "doseRangeText": "Cães: 2 a 4 mg/kg a cada 8h | Gatos: 1 a 2 mg/kg a cada 12h",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "cronidor-comp-50",
    "brandName": "Cronidor® 50 mg Comprimidos",
    "activePrinciple": "Cloridrato de Tramadol",
    "category": "Analgésico Opioide",
    "formType": "tablet",
    "tabletMg": 50,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 3
    },
    "doseRangeText": "2 a 5 mg/kg a cada 8h",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "dipirona-gotas-50",
    "brandName": "Dipirona Gotas 50% (500 mg/mL)",
    "activePrinciple": "Dipirona Sódica",
    "category": "Analgésico e Antipirético",
    "formType": "drops",
    "concentrationMgMl": 500,
    "percentage": 50,
    "dropsPerMl": 20,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 12.5
    },
    "doseRangeText": "Cães: 25 mg/kg (1 gota por kg) a cada 8h | Gatos: 10-15 mg/kg a cada 12-24h",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Regra prática: 1 gota por kg para cães (1 gota = 25 mg).",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco conta-gotas de 20 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "d500-inj-500",
    "brandName": "D-500® Injetável 500 mg/mL (Zoetis)",
    "activePrinciple": "Dipirona Sódica",
    "category": "Analgésico e Antipirético",
    "formType": "liquid",
    "concentrationMgMl": 500,
    "percentage": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 12.5
    },
    "doseRangeText": "Cães: 25 mg/kg (0,05 mL/kg) a cada 8 horas | Gatos: 12,5 a 25 mg/kg a cada 12 horas",
    "defaultFrequency": "TID",
    "defaultRoute": "IV lenta / IM / SC",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Aplicar IV lentamente ou IM. Gatos metabolizam a dipirona mais devagar: preferir intervalos maiores.",
    "manufacturer": "Zoetis",
    "presentationText": "Frasco-ampola de 50 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "activePrinciple": "Cloridrato de Ondansetrona",
    "category": "Antiemético 5-HT3",
    "manufacturer": "Avert (Biolab)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1,0 mg/kg VO a cada 12 horas, por até 5 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Não indicado para cadelas prenhes ou lactantes nem para cães com menos de 12 meses. Em insuficiência hepática, usar a menor dose.",
    "id": "vonau-vet-sol-5",
    "brandName": "Vonau Vet® Solução Oral 5 mg/mL (Avert)",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "percentage": 0.5,
    "bottleVolumeMl": 30,
    "presentationText": "Frasco de 30 mL"
  },
  {
    "activePrinciple": "Cloridrato de Ondansetrona",
    "category": "Antiemético 5-HT3",
    "manufacturer": "Avert (Biolab)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1,0 mg/kg VO a cada 12 horas, por até 5 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Não indicado para cadelas prenhes ou lactantes nem para cães com menos de 12 meses. Em insuficiência hepática, usar a menor dose.",
    "id": "vonau-vet-comp-6",
    "brandName": "Vonau Vet® 6 mg Comprimidos (Avert)",
    "formType": "tablet",
    "tabletMg": 6,
    "tabletsPerBox": 10,
    "presentationText": "Cartucho com 10 comprimidos bissulcados"
  },
  {
    "activePrinciple": "Cloridrato de Ondansetrona",
    "category": "Antiemético 5-HT3",
    "manufacturer": "Avert (Biolab)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1,0 mg/kg VO a cada 12 horas, por até 5 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Não indicado para cadelas prenhes ou lactantes nem para cães com menos de 12 meses. Em insuficiência hepática, usar a menor dose.",
    "id": "vonau-vet-comp-12",
    "brandName": "Vonau Vet® 12 mg Comprimidos (Avert)",
    "formType": "tablet",
    "tabletMg": 12,
    "tabletsPerBox": 10,
    "presentationText": "Cartucho com 10 comprimidos bissulcados"
  },
  {
    "activePrinciple": "Cloridrato de Ondansetrona",
    "category": "Antiemético 5-HT3",
    "manufacturer": "Avert (Biolab)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1,0 mg/kg VO a cada 12 horas, por até 5 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Não indicado para cadelas prenhes ou lactantes nem para cães com menos de 12 meses. Em insuficiência hepática, usar a menor dose.",
    "id": "vonau-vet-comp-18",
    "brandName": "Vonau Vet® 18 mg Comprimidos (Avert)",
    "formType": "tablet",
    "tabletMg": 18,
    "tabletsPerBox": 10,
    "presentationText": "Cartucho com 10 comprimidos bissulcados"
  },
  {
    "activePrinciple": "Cloridrato de Ondansetrona",
    "category": "Antiemético 5-HT3",
    "manufacturer": "Avert (Biolab)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1,0 mg/kg VO a cada 12 horas, por até 5 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Não indicado para cadelas prenhes ou lactantes nem para cães com menos de 12 meses. Em insuficiência hepática, usar a menor dose.",
    "id": "vonau-vet-comp-30",
    "brandName": "Vonau Vet® 30 mg Comprimidos (Avert)",
    "formType": "tablet",
    "tabletMg": 30,
    "tabletsPerBox": 10,
    "presentationText": "Cartucho com 10 comprimidos bissulcados"
  },
  {
    "id": "prediderm-comp-5",
    "brandName": "Prediderm® 5 mg Comprimidos (Ourofino)",
    "activePrinciple": "Prednisolona",
    "category": "Glicocorticoide Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 1
    },
    "doseRangeText": "Anti-inflamatório: 0,5 a 1,0 mg/kg SID | Imunossupressor: 2 a 4 mg/kg/dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "manufacturer": "Ourofino",
    "presentationText": "Cartucho com 10 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "prediderm-comp-20",
    "brandName": "Prediderm® 20 mg Comprimidos (Ourofino)",
    "activePrinciple": "Prednisolona",
    "category": "Glicocorticoide Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 20,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 1
    },
    "doseRangeText": "Anti-inflamatório: 0,5 a 1,0 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "acepran-inj-02",
    "brandName": "Acepran® Injetável 0,2% (2 mg/mL) (Vetnil)",
    "activePrinciple": "Acepromazina",
    "category": "Tranquilizante Fenotiazínico",
    "formType": "liquid",
    "concentrationMgMl": 2,
    "percentage": 0.2,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.05,
      "felino": 0.05
    },
    "doseRangeText": "0,02 a 0,1 mg/kg IM / SC / IV lenta",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "IM / SC / IV lenta",
    "bottleVolumeMl": 20,
    "clinicalNotes": "0,2% = 2 mg/mL. Cuidado com hipotensão.",
    "manufacturer": "Vetnil",
    "presentationText": "Frasco-ampola de 20 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "apoquel-comp-36",
    "brandName": "Apoquel® 3,6 mg Comprimidos (Zoetis)",
    "activePrinciple": "Maleato de Oclacitinib",
    "category": "Antipruriginoso / Dermatologia (Inibidor de JAK)",
    "formType": "tablet",
    "tabletMg": 3.6,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.4
    },
    "doseRangeText": "0,4 a 0,6 mg/kg BID por 14 dias; após, SID manutenção",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Para cães de 3 a 4,4 kg (1/2 comp) ou 4,5 a 5,9 kg (1 comp).",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 20 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "apoquel-comp-54",
    "brandName": "Apoquel® 5,4 mg Comprimidos (Zoetis)",
    "activePrinciple": "Maleato de Oclacitinib",
    "category": "Antipruriginoso / Dermatologia",
    "formType": "tablet",
    "tabletMg": 5.4,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.4
    },
    "doseRangeText": "0,4 a 0,6 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Para cães de 9 a 13,4 kg (1 comp).",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 20 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "apoquel-comp-160",
    "brandName": "Apoquel® 16 mg Comprimidos (Zoetis)",
    "activePrinciple": "Maleato de Oclacitinib",
    "category": "Antipruriginoso / Dermatologia",
    "formType": "tablet",
    "tabletMg": 16,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.4
    },
    "doseRangeText": "0,4 a 0,6 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Para cães de 27 a 39,9 kg (1 comp).",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 20 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "agemoxi-inj-15",
    "brandName": "Agemoxi® L.A. Injetável 15% (Agener União)",
    "activePrinciple": "Amoxicilina (tri-hidratada)",
    "category": "Antimicrobiano Penicilânico Longa Ação",
    "formType": "liquid",
    "concentrationMgMl": 150,
    "percentage": 15,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 15,
      "felino": 15
    },
    "doseRangeText": "15 mg/kg a cada 48h (1 mL para cada 10 kg de peso corporal)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 100,
    "clinicalNotes": "15% = 150 mg/mL. Regra da Bula Agener: 1 mL para cada 10 kg de peso a cada 48h. Agitar energeticamente antes da aplicação.",
    "protocols": [
      {
        "id": "agemoxi-la-48h",
        "label": "Dose Longa Ação (1 mL para 10 kg)",
        "doseMgKg": {
          "canino": 15,
          "felino": 15
        },
        "bulaRuleText": "1 mL para cada 10 kg de peso corporal a cada 48 horas"
      }
    ],
    "manufacturer": "Agener União",
    "presentationText": "Frasco-ampola de 100 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "trissulfin-inj-ourofino",
    "brandName": "Trissulfin® Injetável (Ourofino)",
    "activePrinciple": "Sulfametoxazol + Trimetoprima",
    "category": "Antimicrobiano Quimioterápico Potencializado",
    "formType": "liquid",
    "concentrationMgMl": 240,
    "percentage": 24,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 24,
      "felino": 24
    },
    "doseRangeText": "1 mL para cada 10 a 15 kg (15 a 30 mg/kg combinados) a cada 24h",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM / IV lento",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Sulfametoxazol 200 mg/mL + Trimetoprima 40 mg/mL = 240 mg/mL. Garantir hidratação adequada.",
    "protocols": [
      {
        "id": "trissulfin-std",
        "label": "Dose Padrão: 1 mL para cada 10 kg (24 mg/kg)",
        "doseMgKg": {
          "canino": 24,
          "felino": 24
        },
        "bulaRuleText": "1 mL para cada 10 kg de peso vivo a cada 24 horas"
      },
      {
        "id": "trissulfin-mild",
        "label": "Dose Moderada: 1 mL para cada 15 kg (16 mg/kg)",
        "doseMgKg": {
          "canino": 16,
          "felino": 16
        },
        "bulaRuleText": "1 mL para cada 15 kg de peso a cada 24 horas"
      }
    ],
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 50 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "biodex-inj-biofarm",
    "brandName": "Biodex® Injetável (Biofarm)",
    "activePrinciple": "Dexametasona (fosfato dissódico)",
    "category": "Anti-inflamatório Corticosteroide",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "percentage": 0.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.15,
      "felino": 0.15
    },
    "doseRangeText": "0,1 a 0,25 mg/kg (0,02 a 0,05 mL/kg) ou 0,1 a 0,5 mL/animal SC / IM / IV lento",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IV lento / IM",
    "bottleVolumeMl": 10,
    "clinicalNotes": "5 mg/mL de dexametasona fosfato dissódico (equivalente a 3,8 mg/mL de dexametasona base). Bula Oficial Biofarm: aplicação de 0,1 a 0,5 mL por animal em cães e gatos, ou dose de 0,15 mg/kg (0,03 mL/kg = 0,30 mL para 10 kg). Não usar em fêmeas prenhes ou animais com diabetes.",
    "protocols": [
      {
        "id": "biodex-anti-inflam",
        "label": "Anti-inflamatório: 0,15 mg/kg (0,03 mL/kg)",
        "doseMgKg": {
          "canino": 0.15,
          "felino": 0.15
        },
        "bulaRuleText": "0,03 mL/kg (10 kg = 0,30 mL em seringa de 1 mL)"
      },
      {
        "id": "biodex-shock",
        "label": "Choque / Emergência: 1,0 mg/kg (0,2 mL/kg)",
        "doseMgKg": {
          "canino": 1,
          "felino": 1
        },
        "bulaRuleText": "0,20 mL por kg de peso corporal via IV lenta"
      }
    ],
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "biodex-comp-05",
    "brandName": "Biodex® 0,5 mg Comprimidos (Biofarm)",
    "activePrinciple": "Dexametasona",
    "category": "Anti-inflamatório Corticosteroide",
    "formType": "tablet",
    "tabletMg": 0.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.05,
      "felino": 0.05
    },
    "doseRangeText": "Pequeno porte e gatos: 1/2 a 1 comp | Médio porte: 1 a 2 comp | Grande porte: 3 comp",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Comprimidos de 0,5 mg de Dexametasona. Bula Biofarm: administrar por 7 dias com desmame gradual.",
    "manufacturer": "Biofarm",
    "presentationText": "Cartucho com 20 comprimidos",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "corta-curso-ourofino",
    "brandName": "Corta Curso® Injetável (Ourofino)",
    "activePrinciple": "Doxiciclina (hiclato) + Cloridrato de Benzetimide",
    "category": "Antimicrobiano & Antidiarreico Específico",
    "formType": "liquid",
    "concentrationMgMl": 40,
    "percentage": 4,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 4
    },
    "doseRangeText": "1 mL para cada 10 kg de peso (4 mg/kg de doxiciclina) a cada 24h IM",
    "defaultFrequency": "SID",
    "defaultRoute": "Intramuscular (IM)",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Fórmula Oficial Bula Ourofino: Cada 100 mL contém Doxiciclina hiclato 4,00 g (40 mg/mL) + Benzetimide cloridrato 0,0165 g (0,165 mg/mL). Posologia: 1 mL para cada 10 kg de peso vivo (4 mg/kg doxiciclina) IM profunda. Máximo 3 dias consecutivos.",
    "protocols": [
      {
        "id": "corta-curso-std",
        "label": "Dose da Bula Oficial: 1 mL para cada 10 kg (4 mg/kg)",
        "doseMgKg": {
          "canino": 4,
          "felino": 4
        },
        "bulaRuleText": "1 mL para cada 10 kg de peso corporal via IM profunda"
      }
    ],
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 50 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "emedron-inj-1",
    "brandName": "Emedron® Injetável 1% (10 mg/mL) (Agener União)",
    "activePrinciple": "Cloridrato de Ondansetrona",
    "category": "Antiemético Antagonista 5-HT3",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "percentage": 1,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,2 a 0,5 mg/kg (0,02 a 0,05 mL/kg = 1 mL para 20 kg) a cada 8h a 12h IV lento ou SC",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV) lento / SC",
    "bottleVolumeMl": 10,
    "clinicalNotes": "1% m/v = 10 mg/mL de ondansetrona base (12,5 mg/mL de cloridrato diidratado). Regra da Bula (Agener União): 1 mL para cada 20 kg de peso (0,05 mL/kg na dose de 0,5 mg/kg). Cão de 10 kg recebe 0,5 mL (5 mg). Aplicar IV lentamente em pelo menos 1 a 3 minutos.",
    "protocols": [
      {
        "id": "emedron-full",
        "label": "Dose da Bula Oficial: 0,5 mg/kg (1 mL para cada 20 kg)",
        "doseMgKg": {
          "canino": 0.5,
          "felino": 0.5
        },
        "bulaRuleText": "Regra da Bula: 1 mL para cada 20 kg (0,05 mL/kg → Cão 10 kg = 0,50 mL a cada 8h)"
      },
      {
        "id": "emedron-mod",
        "label": "Dose Moderada: 0,2 mg/kg (0,02 mL/kg)",
        "doseMgKg": {
          "canino": 0.2,
          "felino": 0.2
        },
        "bulaRuleText": "0,02 mL para cada 1 kg de peso a cada 8 a 12 horas (Cão 10 kg = 0,20 mL)"
      }
    ],
    "manufacturer": "Agener União",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "cestodan-inj-55",
    "brandName": "Cestodan® Injetável 5,5% (König)",
    "activePrinciple": "Praziquantel",
    "category": "Antiparasitário Cestocida (Tênias / Dipylidium)",
    "formType": "liquid",
    "concentrationMgMl": 55,
    "percentage": 5.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5.5,
      "felino": 5.5
    },
    "doseRangeText": "1 mL para cada 10 kg de peso (5,5 mg/kg) em dose única estritamente SC",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 10,
    "clinicalNotes": "5,5% = 55 mg/mL. Aplicação exclusivamente subcutânea na região da nuca. Não usar em filhotes < 4 semanas (cães) ou < 6 semanas (gatos). Máximo 3 mL por animal.",
    "protocols": [
      {
        "id": "cestodan-single",
        "label": "Dose Única Bula: 1 mL para cada 10 kg (5,5 mg/kg)",
        "doseMgKg": {
          "canino": 5.5,
          "felino": 5.5
        },
        "bulaRuleText": "1 mL para cada 10 kg de peso em dose única SC"
      }
    ],
    "manufacturer": "König",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "enro-flec-10",
    "brandName": "Enro Flec® Injetável 10% (Vansil)",
    "activePrinciple": "Enrofloxacino",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg a cada 24h (1 mL para cada 20 kg de peso)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 50,
    "clinicalNotes": "10% = 100 mg/mL. 1 mL a cada 20 kg de peso vivo. Contraindicado em gatos nessa concentração (risco de cegueira por retinopatia).",
    "protocols": [
      {
        "id": "enro-flec-std",
        "label": "1 mL para cada 20 kg (5 mg/kg)",
        "doseMgKg": {
          "canino": 5,
          "felino": 5
        },
        "bulaRuleText": "1 mL para cada 20 kg de peso corporal a cada 24 horas"
      }
    ],
    "manufacturer": "Vansil",
    "presentationText": "Frasco-ampola de 50 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "imizol-inj-msd",
    "brandName": "Imizol® Injetável (MSD Saúde Animal)",
    "activePrinciple": "Dipropionato de Imidocarb",
    "category": "Antiprotozoário (Babesiose e Erliquiose)",
    "formType": "liquid",
    "concentrationMgMl": 120,
    "percentage": 12,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 6
    },
    "doseRangeText": "Babesiose: 3,5 a 6,6 mg/kg (1 mL para cada 20 kg) SC/IM | Erliquiose: 5 a 6 mg/kg em 2 aplicações",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 40,
    "clinicalNotes": "12% = 120 mg/mL. NUNCA aplicar via intravenosa! Contraindicado em gatos. Pode causar salivação colinérgica (antídoto: Atropina).",
    "protocols": [
      {
        "id": "imizol-babesia",
        "label": "Babesiose: 1 mL para cada 20 kg (6,0 mg/kg)",
        "doseMgKg": {
          "canino": 6,
          "felino": 0
        },
        "bulaRuleText": "0,05 mL por kg de peso corporal dose única SC ou IM"
      },
      {
        "id": "imizol-erlichia",
        "label": "Erliquiose: 1 mL para cada 24 kg (5,0 mg/kg)",
        "doseMgKg": {
          "canino": 5,
          "felino": 0
        },
        "bulaRuleText": "0,042 mL por kg em 2 aplicações com intervalo de 14 dias"
      }
    ],
    "manufacturer": "MSD Saúde Animal",
    "presentationText": "Frasco-ampola de 40 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "predi-medrol-inj",
    "brandName": "Predi-Medrol® / Depo-Medrol® 40 mg/mL",
    "activePrinciple": "Acetato de Metilprednisolona",
    "category": "Glicocorticoide Depósito de Ação Prolongada",
    "formType": "liquid",
    "concentrationMgMl": 40,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 2
    },
    "doseRangeText": "Cães: 1 mg/kg IM/SC a cada 1 a 3 semanas | Gatos: 1 a 2 mg/kg (ou 10 a 20 mg por animal)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM) / SC",
    "bottleVolumeMl": 5,
    "clinicalNotes": "40 mg/mL. Corticoide depot de liberação lenta. Agitar vigorosamente antes da aplicação. Cautela em pacientes diabéticos.",
    "protocols": [
      {
        "id": "predi-std",
        "label": "Dose Anti-inflamatória: 1 mg/kg cães | 2 mg/kg gatos",
        "doseMgKg": {
          "canino": 1,
          "felino": 2
        },
        "bulaRuleText": "0,025 mL/kg para cães e 0,05 mL/kg para gatos"
      }
    ],
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 5 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "condroton-inj-vetnil",
    "brandName": "Condroton® Injetável (Vetnil)",
    "activePrinciple": "Sulfato de Condroitina A + Sulfato de Glucosamina",
    "category": "Regenerador Articular & Condroprotetor",
    "formType": "liquid",
    "concentrationMgMl": 150,
    "percentage": 15,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 15,
      "felino": 15
    },
    "doseRangeText": "Até 10 kg: 2 mL | 10 a 25 kg: 4 mL | > 25 kg: 5 mL (SC/IM a cada 3 a 7 dias)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Fórmula Oficial Bula Vetnil: Cada 100 mL contém Sulfato de Condroitina \"A\" 7,5 g (75 mg/mL) + Sulfato de Glucosamina 7,5 g (75 mg/mL) = 150 mg/mL de glicosaminoglicanos. Posologia para cães e gatos: até 10 kg = 2 mL; 10 a 25 kg = 4 mL; acima de 25 kg = 5 mL a cada 3 a 7 dias durante 4 a 8 semanas.",
    "protocols": [
      {
        "id": "condroton-dose",
        "label": "Posologia da Bula Vetnil (Até 10 kg = 2 mL | 10 a 25 kg = 4 mL | > 25 kg = 5 mL)",
        "doseMgKg": {
          "canino": 15,
          "felino": 15
        },
        "bulaRuleText": "Regra Vetnil: Até 10 kg: 2 mL | 10-25 kg: 4 mL | > 25 kg: 5 mL SC ou IM a cada 3 a 7 dias"
      }
    ],
    "manufacturer": "Vetnil",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "omeprazol-inj-40",
    "brandName": "Omeprazol Sódico 40 mg Injetável Frasco-Ampola",
    "activePrinciple": "Omeprazol Sódico",
    "category": "Inibidor da Bomba de Prótons (IBP / Antiulceroso)",
    "formType": "liquid",
    "concentrationMgMl": 4,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1,0 mg/kg (0,25 mL/kg da solução reconstituída a 4 mg/mL) a cada 24h ou 12h IV lento",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV) lento",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Reconstituir o frasco de 40 mg com 10 mL de diluente = 4 mg/mL. Administrar IV lentamente em 5 a 15 minutos.",
    "protocols": [
      {
        "id": "omeprazol-sid",
        "label": "Dose Diária Padrão: 1,0 mg/kg SID (0,25 mL/kg)",
        "doseMgKg": {
          "canino": 1,
          "felino": 1
        },
        "bulaRuleText": "0,25 mL para cada 1 kg de peso corporal a cada 24h"
      },
      {
        "id": "omeprazol-bid",
        "label": "Hemorragia Digestiva Severa: 1,0 mg/kg BID",
        "doseMgKg": {
          "canino": 1,
          "felino": 1
        },
        "bulaRuleText": "0,25 mL/kg a cada 12 horas via IV"
      }
    ],
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "furosemida-inj-10",
    "brandName": "Furosemida Injetável 10 mg/mL (1%) (Furp / Teuto / Hipolabor)",
    "activePrinciple": "Furosemida",
    "category": "Diurético de Alça",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "percentage": 1,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1
    },
    "doseRangeText": "1 a 4 mg/kg (0,1 a 0,4 mL/kg) IV ou IM a cada 8h a 12h ou a cada 1-2h no edema agudo",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV) / IM / SC",
    "bottleVolumeMl": 2,
    "clinicalNotes": "10 mg/mL (ampola 2 mL = 20 mg). Início de ação em 5 a 15 min via IV. Monitorar hidratação, função renal e potássio.",
    "protocols": [
      {
        "id": "furo-edema",
        "label": "Edema Pulmonar Agudo: 2 a 4 mg/kg (0,2 a 0,4 mL/kg)",
        "doseMgKg": {
          "canino": 3,
          "felino": 2
        },
        "bulaRuleText": "0,3 mL/kg em cães e 0,2 mL/kg em gatos via IV ou IM na emergência"
      },
      {
        "id": "furo-maint",
        "label": "Manutenção / ICC: 1 a 2 mg/kg a cada 12h",
        "doseMgKg": {
          "canino": 1.5,
          "felino": 1
        },
        "bulaRuleText": "0,15 mL/kg em cães e 0,10 mL/kg em gatos a cada 12 horas"
      }
    ],
    "validationStatus": "VALIDADO",
    "manufacturer": "Furp / Teuto / Hipolabor",
    "presentationText": "Frasco-ampola de 2 mL"
  },
  {
    "id": "transamin-inj-zydus",
    "brandName": "Transamin® 50 mg/mL Injetável (Zydus Brasil)",
    "activePrinciple": "Ácido Tranexâmico",
    "category": "Antifibrinolítico & Hemostático Sistêmico",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "percentage": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "10 a 15 mg/kg (0,2 a 0,3 mL/kg) IV lento a cada 8 horas (TID)",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV) lento",
    "bottleVolumeMl": 5,
    "clinicalNotes": "50 mg/mL (ampola de 5 mL = 250 mg). Infundir lentamente via IV em pelo menos 10 minutos (infusão rápida pode provocar vômito).",
    "protocols": [
      {
        "id": "transamin-std",
        "label": "Dose Padrão: 10 mg/kg TID (0,2 mL/kg)",
        "doseMgKg": {
          "canino": 10,
          "felino": 10
        },
        "bulaRuleText": "0,2 mL para cada 1 kg de peso corporal a cada 8h"
      },
      {
        "id": "transamin-high",
        "label": "Hemorragia Intensa: 15 mg/kg TID (0,3 mL/kg)",
        "doseMgKg": {
          "canino": 15,
          "felino": 15
        },
        "bulaRuleText": "0,3 mL para cada 1 kg de peso corporal via IV lenta"
      }
    ],
    "manufacturer": "Zydus Brasil",
    "presentationText": "Frasco-ampola de 5 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "prometazol-inj-hipolabor",
    "brandName": "Prometazol® 25 mg/mL (Hipolabor / Prometazina)",
    "activePrinciple": "Cloridrato de Prometazina",
    "category": "Anti-histamínico H1 Fenotiazínico",
    "formType": "liquid",
    "concentrationMgMl": 25,
    "percentage": 2.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.4,
      "felino": 0.2
    },
    "doseRangeText": "0,2 a 0,5 mg/kg (0,008 a 0,02 mL/kg) IM profundo ou IV lento a cada 12h ou 24h",
    "defaultFrequency": "SID",
    "defaultRoute": "Intramuscular (IM) / IV lento",
    "bottleVolumeMl": 2,
    "clinicalNotes": "25 mg/mL (ampola 2 mL = 50 mg). Usar seringa de 1 mL para medição precisa. Causa sedação central.",
    "protocols": [
      {
        "id": "prometazol-std",
        "label": "Anti-histamínico: 0,4 mg/kg cães | 0,2 mg/kg gatos",
        "doseMgKg": {
          "canino": 0.4,
          "felino": 0.2
        },
        "bulaRuleText": "0,016 mL/kg para cães e 0,008 mL/kg para gatos (usar seringa de 1 mL)"
      }
    ],
    "manufacturer": "Hipolabor",
    "presentationText": "Frasco-ampola de 2 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "amplospec-inj-biochimico",
    "brandName": "Amplospec® Injetável 1 g (BioChimico / Ceftriaxona)",
    "activePrinciple": "Ceftriaxona Dissódica",
    "category": "Antimicrobiano Cefalosporina de 3ª Geração",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 25
    },
    "doseRangeText": "20 a 50 mg/kg SID ou 25 mg/kg BID (0,25 mL/kg a 100 mg/mL) IV lento ou SC",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa lenta (IV) / SC",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Registro ANVISA BioChimico: Frasco-ampola de 1 g de Ceftriaxona dissódica pó injetável reconstituído em 10 mL de água para injeção = 100 mg/mL. Cefalosporina bactericida de 3ª geração para sepse, infecções refratárias e SNC. NUNCA diluir com soluções contendo cálcio (Ringer Lactato). Infundir lentamente via IV em 15 a 30 min.",
    "protocols": [
      {
        "id": "amplospec-std",
        "label": "Dose Padrão: 25 mg/kg SID ou BID (0,25 mL/kg)",
        "doseMgKg": {
          "canino": 25,
          "felino": 25
        },
        "bulaRuleText": "0,25 mL para cada 1 kg de peso corporal via IV lenta ou SC"
      },
      {
        "id": "amplospec-high",
        "label": "Infecção Grave / Sepse: 50 mg/kg SID (0,50 mL/kg)",
        "doseMgKg": {
          "canino": 50,
          "felino": 50
        },
        "bulaRuleText": "0,50 mL por kg de peso corporal uma vez ao dia via IV lenta"
      }
    ],
    "manufacturer": "BioChimico / Ceftriaxona",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "mytedom-inj-cristalia",
    "brandName": "Mytedom® 10 mg/mL Injetável (Cristália)",
    "activePrinciple": "Cloridrato de Metadona",
    "category": "Analgésico Opioide Agonista Mu Potente",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.3,
      "felino": 0.2
    },
    "doseRangeText": "Cães: 0,1 a 0,5 mg/kg (0,01 a 0,05 mL/kg) | Gatos: 0,1 a 0,3 mg/kg (0,01 a 0,03 mL/kg) a cada 4-6h",
    "defaultFrequency": "QID",
    "defaultRoute": "Subcutânea (SC) / IM / IV lento",
    "bottleVolumeMl": 1,
    "clinicalNotes": "10 mg/mL (ampola 1 mL). Não induz êmese como a morfina e tem excelente estabilidade hemodinâmica. Controle especial.",
    "protocols": [
      {
        "id": "mytedom-med",
        "label": "Dor Moderada: 0,2 mg/kg (0,02 mL/kg)",
        "doseMgKg": {
          "canino": 0.2,
          "felino": 0.2
        },
        "bulaRuleText": "0,02 mL para cada 1 kg de peso corporal a cada 4 a 6 horas"
      },
      {
        "id": "mytedom-high",
        "label": "Dor Intensa: 0,4 mg/kg cães | 0,25 mg/kg gatos",
        "doseMgKg": {
          "canino": 0.4,
          "felino": 0.25
        },
        "bulaRuleText": "0,04 mL/kg para cães e 0,025 mL/kg para gatos"
      }
    ],
    "manufacturer": "Cristália",
    "presentationText": "Frasco-ampola de 1 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "escopolamina-dipirona-farmace",
    "brandName": "Butilbrometo de Escopolamina + Dipirona (Farmace / Buscopan Composto)",
    "activePrinciple": "Butilbrometo de Escopolamina + Dipirona Sódica",
    "category": "Antiespasmódico & Analgésico Visceral",
    "formType": "liquid",
    "concentrationMgMl": 500,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 12.5
    },
    "doseRangeText": "Cães: 0,1 a 0,2 mL para cada 5 kg (25 mg/kg de dipirona) | Gatos: 0,025 mL/kg",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV) lento / SC",
    "bottleVolumeMl": 5,
    "clinicalNotes": "Butilbrometo 4 mg/mL + Dipirona 500 mg/mL. Indicado para espasmos do trato digestivo e geniturinário. Injetar IV de forma lenta.",
    "protocols": [
      {
        "id": "buscopan-canine",
        "label": "Cães: 25 mg/kg (0,05 mL/kg = 1 mL para 20 kg)",
        "doseMgKg": {
          "canino": 25,
          "felino": 12.5
        },
        "bulaRuleText": "0,05 mL por kg de peso a cada 8 horas via IV lenta ou SC"
      },
      {
        "id": "buscopan-feline",
        "label": "Gatos: 12,5 mg/kg (0,025 mL/kg = 0,10 mL para 4 kg)",
        "doseMgKg": {
          "canino": 25,
          "felino": 12.5
        },
        "bulaRuleText": "0,025 mL por kg a cada 12h (medir em seringa de 1 mL)"
      }
    ],
    "manufacturer": "Farmace / Buscopan Composto",
    "presentationText": "Frasco-ampola de 5 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "aminofilina-inj-24",
    "brandName": "Aminofilina 24 mg/mL Injetável (Teuto / Hipolabor)",
    "activePrinciple": "Aminofilina",
    "category": "Broncodilatador Metilxantina",
    "formType": "liquid",
    "concentrationMgMl": 24,
    "percentage": 2.4,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 8,
      "felino": 4
    },
    "doseRangeText": "Cães: 5 a 10 mg/kg (0,2 a 0,4 mL/kg) IV lento a cada 8h | Gatos: 2 a 5 mg/kg a cada 12h",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV) lento / IM",
    "bottleVolumeMl": 10,
    "clinicalNotes": "24 mg/mL (ampola 10 mL = 240 mg). Diluir em SF 0,9% e infundir lentamente. A injeção rápida pode causar arritmias e hipotensão.",
    "protocols": [
      {
        "id": "amino-dog",
        "label": "Broncoespasmo Cães: 8 mg/kg (0,33 mL/kg)",
        "doseMgKg": {
          "canino": 8,
          "felino": 4
        },
        "bulaRuleText": "0,33 mL/kg diluído em SF e infundido lentamente"
      },
      {
        "id": "amino-cat",
        "label": "Asma Felina: 4 mg/kg (0,16 mL/kg)",
        "doseMgKg": {
          "canino": 8,
          "felino": 4
        },
        "bulaRuleText": "0,16 mL/kg a cada 12h IV lento diluído"
      }
    ],
    "manufacturer": "Hipolabor",
    "presentationText": "Frasco-ampola de 10 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "fenocris-inj-cristalia",
    "brandName": "FenoCRIS® 100 mg/mL Injetável (Cristália / Fenobarbital Sódico)",
    "activePrinciple": "Fenobarbital Sódico",
    "category": "Anticonvulsivante & Barbitúrico Hospitalar",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 4,
      "felino": 3
    },
    "doseRangeText": "Ataque em convulsão: 4 a 6 mg/kg (0,04 a 0,06 mL/kg) IV lento | Manutenção: 2,5 a 3 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV) lento / IM",
    "bottleVolumeMl": 2,
    "clinicalNotes": "100 mg/mL (ampola 2 mL = 200 mg). Droga de escolha no controle prolongado de epilepsia e pós-crise. Administrar IV de forma lenta.",
    "protocols": [
      {
        "id": "fenocris-attack",
        "label": "Status Epilepticus (Ataque): 5 mg/kg (0,05 mL/kg)",
        "doseMgKg": {
          "canino": 5,
          "felino": 4
        },
        "bulaRuleText": "0,05 mL para cada 1 kg de peso corporal via IV lenta"
      },
      {
        "id": "fenocris-maint",
        "label": "Manutenção Hospitalar: 3 mg/kg BID (0,03 mL/kg)",
        "doseMgKg": {
          "canino": 3,
          "felino": 2.5
        },
        "bulaRuleText": "0,03 mL por kg a cada 12 horas"
      }
    ],
    "manufacturer": "Cristália",
    "presentationText": "Frasco-ampola de 2 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "dipifarma-inj-farmace",
    "brandName": "Dipifarma® 500 mg/mL Injetável (Farmace / Dipirona Sódica)",
    "activePrinciple": "Dipirona Sódica",
    "category": "Analgésico & Antitérmico",
    "formType": "liquid",
    "concentrationMgMl": 500,
    "percentage": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 12.5
    },
    "doseRangeText": "Cães: 25 mg/kg (0,05 mL/kg = 1 mL para cada 20 kg) | Gatos: 10 a 12,5 mg/kg (0,02 a 0,025 mL/kg)",
    "defaultFrequency": "TID",
    "defaultRoute": "Subcutânea (SC) / IV lento / IM",
    "bottleVolumeMl": 50,
    "clinicalNotes": "500 mg/mL (50%). Excelente para febre e dores viscerais/somáticas. Cães de 10 kg recebem 0,5 mL; gatos de 4 kg recebem 0,10 mL.",
    "protocols": [
      {
        "id": "dipifarma-canine",
        "label": "Cães: 25 mg/kg (1 mL para cada 20 kg)",
        "doseMgKg": {
          "canino": 25,
          "felino": 12.5
        },
        "bulaRuleText": "0,05 mL por kg de peso corporal a cada 8 horas"
      },
      {
        "id": "dipifarma-feline",
        "label": "Gatos: 12,5 mg/kg (0,025 mL/kg = 0,10 mL para 4 kg)",
        "doseMgKg": {
          "canino": 25,
          "felino": 12.5
        },
        "bulaRuleText": "0,025 mL por kg a cada 12-24h (utilizar seringa de 1 mL)"
      }
    ],
    "manufacturer": "Farmace / Dipirona Sódica",
    "presentationText": "Frasco-ampola de 50 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "flucistein-inj-10",
    "brandName": "FluCistein® Injetável 10% (Acetilcisteína 100 mg/mL)",
    "activePrinciple": "Acetilcisteína (N-acetil-L-cisteína)",
    "category": "Mucolítico & Antídoto para Paracetamol (Acetaminofeno)",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "Mucolítico: 10 mg/kg TID | Antídoto Intoxicação Paracetamol: 140 mg/kg ataque e 70 mg/kg a cada 4h",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV) lento diluído / Inalação",
    "bottleVolumeMl": 3,
    "clinicalNotes": "100 mg/mL (10%). Droga vital como antídoto para intoxicação acidental por Paracetamol em gatos e cães. Diluir em SG 5% para infusão IV lenta.",
    "protocols": [
      {
        "id": "flucistein-mucolytic",
        "label": "Mucolítico / Respiratório: 10 mg/kg (0,1 mL/kg)",
        "doseMgKg": {
          "canino": 10,
          "felino": 10
        },
        "bulaRuleText": "0,1 mL para cada 1 kg de peso a cada 8 horas"
      },
      {
        "id": "flucistein-antidote",
        "label": "Antídoto Paracetamol (Ataque): 140 mg/kg IV",
        "doseMgKg": {
          "canino": 140,
          "felino": 140
        },
        "bulaRuleText": "1,4 mL por kg diluído em SG 5% infundido em 1 hora"
      }
    ],
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 3 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "metronidazol-inj-jp",
    "brandName": "Metronidazol 0,5% Solução para Infusão (JP Indústria Farmacêutica)",
    "activePrinciple": "Metronidazol",
    "category": "Antimicrobiano Antianaeróbio & Antiprotozoário (Giardicida)",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "percentage": 0.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 15,
      "felino": 10
    },
    "doseRangeText": "10 a 15 mg/kg (2 a 3 mL/kg da solução 0,5%) a cada 12h (BID) IV lento",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV) lenta",
    "bottleVolumeMl": 100,
    "clinicalNotes": "0,5% = 5 mg/mL (bolsa 100 mL = 500 mg). Solução pronta para infusão IV. Infundir lentamente em 30 a 60 min. Proteger da luz.",
    "protocols": [
      {
        "id": "metro-anaerobic",
        "label": "Infecções Graves / Anaeróbios: 15 mg/kg (3 mL/kg)",
        "doseMgKg": {
          "canino": 15,
          "felino": 10
        },
        "bulaRuleText": "3 mL por kg para cães e 2 mL por kg para gatos a cada 12h"
      },
      {
        "id": "metro-giardia",
        "label": "Giardíase / Dose Moderada: 10 mg/kg (2 mL/kg)",
        "doseMgKg": {
          "canino": 10,
          "felino": 10
        },
        "bulaRuleText": "2 mL para cada 1 kg de peso corporal a cada 12h via IV lenta"
      }
    ],
    "manufacturer": "JP Indústria Farmacêutica",
    "presentationText": "Frasco-ampola de 100 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "buscopan-composto-boehringer",
    "brandName": "Buscopan Composto® Injetável (Boehringer Ingelheim)",
    "activePrinciple": "Butilbrometo de Escopolamina + Dipirona",
    "category": "Antiespasmódico & Analgésico Visceral",
    "formType": "liquid",
    "concentrationMgMl": 500,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 12.5
    },
    "doseRangeText": "0,05 mL/kg cães (1 mL para 20 kg) | 0,025 mL/kg gatos",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV) lento / SC",
    "bottleVolumeMl": 5,
    "clinicalNotes": "4 mg/mL de escopolamina + 500 mg/mL de dipirona.",
    "manufacturer": "Boehringer Ingelheim",
    "presentationText": "Frasco-ampola de 5 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "nausedron-inj-cristalia",
    "brandName": "Nausedron® 2 mg/mL Injetável (Cristália / Ondansetrona)",
    "activePrinciple": "Cloridrato de Ondansetrona",
    "category": "Antiemético Antagonista 5-HT3",
    "formType": "liquid",
    "concentrationMgMl": 2,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,2 a 0,5 mg/kg (0,1 a 0,25 mL/kg) a cada 8h a 12h IV lento",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV) lento",
    "bottleVolumeMl": 4,
    "clinicalNotes": "2 mg/mL (ampola 4 mL = 8 mg). 0,25 mL para cada 1 kg de peso na dose de 0,5 mg/kg.",
    "manufacturer": "Cristália",
    "presentationText": "Frasco-ampola de 4 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "tramadon-inj-cristalia",
    "brandName": "Tramadon® 50 mg/mL Injetável (Cristália / Tramadol)",
    "activePrinciple": "Cloridrato de Tramadol",
    "category": "Analgésico Opioide Atípico",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 4,
      "felino": 2
    },
    "doseRangeText": "Cães: 2 a 5 mg/kg (0,04 a 0,1 mL/kg) | Gatos: 1 a 2 mg/kg SC/IM/IV lento a cada 8h",
    "defaultFrequency": "TID",
    "defaultRoute": "Subcutânea (SC) / IM / IV lento",
    "bottleVolumeMl": 2,
    "clinicalNotes": "50 mg/mL (ampola 2 mL = 100 mg). Analgesia para dor leve a moderada.",
    "manufacturer": "Cristália",
    "presentationText": "Frasco-ampola de 2 mL",
    "validationStatus": "VALIDADO"
  },
  {
    "id": "cefalex-vet-500",
    "brandName": "Cefalexina Vet 500 mg (Genérico)",
    "activePrinciple": "Cefalexina",
    "category": "Antimicrobiano",
    "formType": "tablet",
    "tabletMg": 500,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 20
    },
    "doseRangeText": "20 a 30 mg/kg a cada 8-12h",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Padrão ouro para piodermites.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "convenia-inj",
    "brandName": "Convenia® 80 mg/mL Injetável (Zoetis)",
    "activePrinciple": "Cefovecina Sódica",
    "category": "Antimicrobiano Cefalosporina de Ação Prolongada",
    "formType": "liquid",
    "concentrationMgMl": 80,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 8,
      "felino": 8
    },
    "doseRangeText": "8 mg/kg dose única subcutânea (garante até 14 dias de ação)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Injeção única SC. Excelente para piodermites e feridas em gatos e cães.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "azitromicina-vet-50",
    "brandName": "Azitromicina Vet 50 mg",
    "activePrinciple": "Azitromicina",
    "category": "Antimicrobiano Macrolídeo",
    "formType": "tablet",
    "tabletMg": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "10 mg/kg a cada 24h por 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Excelente para infecções respiratórias superiores e micoplasmoses.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "terramicina-la",
    "brandName": "Terramicina® LA Injetável (Zoetis)",
    "activePrinciple": "Oxitetraciclina Di-hidrato",
    "category": "Antimicrobiano de Longa Ação",
    "formType": "liquid",
    "concentrationMgMl": 200,
    "percentage": 20,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 20,
      "felino": 20
    },
    "doseRangeText": "20 mg/kg (0,1 mL/kg) IM profunda",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Ação prolongada por 3 a 4 dias.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "cort-vet-5",
    "brandName": "Cort-Vet® 5 mg (Ceva)",
    "activePrinciple": "Prednisolona",
    "category": "Corticosteroide Anti-inflamatório",
    "formType": "tablet",
    "tabletMg": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "0,5 a 1 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Uso em cães e gatos sob prescrição veterinária rigorosa.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ceva",
    "presentationText": "Cartucho com 20 comprimidos"
  },
  {
    "id": "deocil-inj",
    "brandName": "Deocil® 5 mg/mL Injetável (Ouro Fino)",
    "activePrinciple": "Cetorolaco de Trometamol",
    "category": "AINE Potente Analgésico Cirúrgico",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 mg/kg (0,1 mL/kg) IV/IM a cada 12h por no máximo 2 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV) / IM",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Potente analgésico pós-operatório curto.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ouro Fino",
    "presentationText": "Frasco-ampola de 20 mL"
  },
  {
    "id": "ketofen-10",
    "brandName": "Ketofen® 10% Injetável (Ceva)",
    "activePrinciple": "Cetoprofeno",
    "category": "AINE Anti-inflamatório e Antipirético",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1
    },
    "doseRangeText": "Cães: 2 mg/kg (0,02 mL/kg) SID | Gatos: 1 mg/kg (0,01 mL/kg) SID por 3-5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IV",
    "bottleVolumeMl": 10,
    "clinicalNotes": "100 mg/mL. Cuidado estrito com hidratação do paciente.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ceva",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "tramadol-comp-50",
    "brandName": "Cloridrato de Tramadol 50 mg (Genérico Humano / Vet)",
    "activePrinciple": "Cloridrato de Tramadol",
    "category": "Analgésico Opioide Atípico",
    "formType": "tablet",
    "tabletMg": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 4,
      "felino": 2
    },
    "doseRangeText": "Cães: 2 a 4 mg/kg | Gatos: 1 a 2 mg/kg a cada 8h VO",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Analgésico central para dor moderada a intensa.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico Humano / Vet",
    "presentationText": "Cartucho com 20 comprimidos"
  },
  {
    "id": "gabapentina-300",
    "brandName": "Gabapentina 300 mg (Uso Humano / Vet)",
    "activePrinciple": "Gabapentina",
    "category": "Neuromodulador & Analgésico para Dor Neuropática",
    "formType": "tablet",
    "tabletMg": 300,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "5 a 20 mg/kg a cada 8 a 12h VO (gatos para sedação pré-consulta: 100mg total)",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 30,
    "clinicalNotes": "Excelente para dor crônica, neuropática e ansiedade felina pré-atendimento.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Uso Humano / Vet",
    "presentationText": "Cartucho com 30 comprimidos"
  },
  {
    "id": "omeprazol-10",
    "brandName": "Omeprazol 10 mg (Uso Veterinário / Humano)",
    "activePrinciple": "Omeprazol",
    "category": "Protetor Gástrico (Inibidor da Bomba de Prótons)",
    "formType": "tablet",
    "tabletMg": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "0,7 a 1 mg/kg a cada 24h em jejum",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 28,
    "clinicalNotes": "Administrar 30 minutos antes da primeira refeição do dia.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Uso Veterinário / Humano",
    "presentationText": "Cartucho com 28 comprimidos"
  },
  {
    "id": "omeprazol-20",
    "brandName": "Omeprazol 20 mg",
    "activePrinciple": "Omeprazol",
    "category": "Protetor Gástrico",
    "formType": "tablet",
    "tabletMg": 20,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 mg/kg a cada 24h VO",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 28,
    "clinicalNotes": "Proteção gástrica em cães em uso de AINEs e corticoides.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Cartucho com 28 comprimidos"
  },
  {
    "id": "ranitidina-inj",
    "brandName": "Cloridrato de Ranitidina 25 mg/mL Injetável",
    "activePrinciple": "Cloridrato de Ranitidina",
    "category": "Protetor Gástrico (Antagonista H2)",
    "formType": "liquid",
    "concentrationMgMl": 25,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 2
    },
    "doseRangeText": "2 mg/kg (0,08 mL/kg) IV/IM a cada 12h",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV) / IM",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Infundir lentamente IV.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "primperan-inj",
    "brandName": "Primperan® 5 mg/mL Injetável (Cloridrato de Metoclopramida)",
    "activePrinciple": "Cloridrato de Metoclopramida",
    "category": "Antiemético & Procinético Gástrico",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,2 a 0,5 mg/kg (0,04 a 0,1 mL/kg) SC/IM/IV a cada 8h",
    "defaultFrequency": "TID",
    "defaultRoute": "Subcutânea (SC) / IV / IM",
    "bottleVolumeMl": 2,
    "clinicalNotes": "Contraindicado em casos de obstrução mecânica gastrointestinal ou perfuração.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Cloridrato de Metoclopramida",
    "presentationText": "Frasco-ampola de 2 mL"
  },
  {
    "id": "potenay-inj",
    "brandName": "Potenay® Injetável (Zoetis)",
    "activePrinciple": "Cloridrato de Mefenorex + Vitaminas do Complexo B",
    "category": "Estimulante do Apetite & Anabolizante / Tônico",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25,
      "felino": 0.1
    },
    "doseRangeText": "0,1 a 0,25 mL/kg IM ou IV lenta",
    "defaultFrequency": "SID",
    "defaultRoute": "Intramuscular (IM) / IV",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Estimulante do apetite e revigorante em animais debilitados.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "mirtazapina-15",
    "brandName": "Mirtazapina 15 mg (Uso Humano / Vet)",
    "activePrinciple": "Mirtazapina",
    "category": "Estimulante de Apetite & Antidepressivo",
    "formType": "tablet",
    "tabletMg": 15,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1.88
    },
    "doseRangeText": "Gatos: 1/4 a 1/2 comprimido de 15 mg (ou 1,88 mg a 3,75 mg por gato) a cada 48 a 72h VO",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 30,
    "clinicalNotes": "Potente orexígeno para felinos com lipidose hepática ou DRC.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Uso Humano / Vet",
    "presentationText": "Cartucho com 30 comprimidos"
  },
  {
    "id": "furosemida-comp-40",
    "brandName": "Furosemida 40 mg Comprimidos",
    "activePrinciple": "Furosemida",
    "category": "Diurético de Alça",
    "formType": "tablet",
    "tabletMg": 40,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1
    },
    "doseRangeText": "1 a 2 mg/kg a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Manutenção de pacientes cardiopatas e nefropatas.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Cartucho com 20 comprimidos"
  },
  {
    "id": "spironolactone-25",
    "brandName": "Espironolactona 25 mg",
    "activePrinciple": "Espironolactona",
    "category": "Diurético Poupador de Potássio",
    "formType": "tablet",
    "tabletMg": 25,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1.5
    },
    "doseRangeText": "1 a 2 mg/kg a cada 12 a 24h VO",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 30,
    "clinicalNotes": "Sinergismo excelente com inibidores da ECA e furosemida na ICC.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Cartucho com 30 comprimidos"
  },
  {
    "id": "vetmedin-125",
    "brandName": "Vetmedin® 1,25 mg (Boehringer Ingelheim / Pimobendan)",
    "activePrinciple": "Pimobendan",
    "category": "Inotrópico Positivo & Vasodilatador (Inodilatador)",
    "formType": "tablet",
    "tabletMg": 1.25,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25,
      "felino": 0.25
    },
    "doseRangeText": "0,25 a 0,3 mg/kg por dose a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 100,
    "clinicalNotes": "Padrão ouro para tratamento de insuficiência mitral mixomatosa e cardiomiopatia dilatada.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Boehringer Ingelheim",
    "presentationText": "Cartucho com 100 comprimidos"
  },
  {
    "id": "vetmedin-5",
    "brandName": "Vetmedin® 5 mg (Boehringer Ingelheim)",
    "activePrinciple": "Pimobendan",
    "category": "Inotrópico Positivo & Vasodilatador",
    "formType": "tablet",
    "tabletMg": 5,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,25 a 0,3 mg/kg a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 100,
    "clinicalNotes": "Para cães de médio e grande porte com ICC.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Boehringer Ingelheim",
    "presentationText": "Cartucho com 100 comprimidos"
  },
  {
    "id": "enalapril-10",
    "brandName": "Maleato de Enalapril 10 mg",
    "activePrinciple": "Maleato de Enalapril",
    "category": "Inibidor da ECA (IECA)",
    "formType": "tablet",
    "tabletMg": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.25
    },
    "doseRangeText": "0,25 a 0,5 mg/kg a cada 12 a 24h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 30,
    "clinicalNotes": "Vasodilatador sistêmico e cardioprotetor.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Cartucho com 30 comprimidos"
  },
  {
    "id": "atropina-sulfato-025",
    "brandName": "Sulfato de Atropina 0,25 mg/mL Injetável",
    "activePrinciple": "Sulfato de Atropina",
    "category": "Anticolinérgico & Antídoto de Emergência",
    "formType": "liquid",
    "concentrationMgMl": 0.25,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.04,
      "felino": 0.04
    },
    "doseRangeText": "0,02 a 0,04 mg/kg (0,08 a 0,16 mL/kg) IV/IM/SC",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV) / SC",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Emergência para bradicardia severa e intoxicação por organofosforados.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "adrenalina-1mg",
    "brandName": "Epifrin / Adrenalina 1 mg/mL (1:1000) Injetável",
    "activePrinciple": "Epinefrina (Adrenalina)",
    "category": "Agente Catecolamina de Reanimação Cardiopulmonar (RCP)",
    "formType": "liquid",
    "concentrationMgMl": 1,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.01,
      "felino": 0.01
    },
    "doseRangeText": "0,01 mg/kg (0,01 mL/kg da solução 1:1000) IV/IOT em RCP",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "bottleVolumeMl": 1,
    "clinicalNotes": "Uso estrito em parada cardiorrespiratória e choque anafilático grave.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 1 mL"
  },
  {
    "id": "dexametasona-2mg",
    "brandName": "Dexametasona 2 mg/mL Injetável (Uso Hospitalar)",
    "activePrinciple": "Fosfato Dissódico de Dexametasona",
    "category": "Corticosteroide Potente de Ação Rápida",
    "formType": "liquid",
    "concentrationMgMl": 2,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,2 a 1 mg/kg (0,1 a 0,5 mL/kg) IV/IM/SC dose única ou ataque",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV) / IM",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Anti-inflamatório e antialérgico de alta potência para emergências.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Uso Hospitalar",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "diazepam-10",
    "brandName": "Diazepam 5 mg/mL Injetável (Uso Veterinário / Humano)",
    "activePrinciple": "Diazepam",
    "category": "Anticonvulsivante & Benzodiazepínico Sedativo",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,5 mg/kg (0,1 mL/kg) IV lenta para crise convulsiva (status epilepticus)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV) / Retal",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Emergência para crises convulsivas ativas. Cuidado em gatos (hepatotoxicidade oral rara).",
    "validationStatus": "VALIDADO",
    "manufacturer": "Uso Veterinário / Humano",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "fenobarbital-100",
    "brandName": "Fenobarbital (Gardenal) 100 mg Comprimidos",
    "activePrinciple": "Fenobarbital (Fenobarbitona)",
    "category": "Anticonvulsivante Barbitúrico de Manutenção",
    "formType": "tablet",
    "tabletMg": 100,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5,
      "felino": 2
    },
    "doseRangeText": "2 a 3 mg/kg a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Padrão ouro para controle e prevenção de epilepsia idiopática em cães e gatos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Gardenal",
    "presentationText": "Cartucho com 20 comprimidos"
  },
  {
    "id": "fenobarbital-drops",
    "brandName": "Gardenal 40 mg/mL Solução Gotas",
    "activePrinciple": "Fenobarbital",
    "category": "Anticonvulsivante Gotas",
    "formType": "drops",
    "concentrationMgMl": 40,
    "dropsPerMl": 40,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5,
      "felino": 2
    },
    "doseRangeText": "2 a 3 mg/kg a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Gotas 40 mg/mL (1 mL = 40 gotas → 1 gota = 1 mg).",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco conta-gotas de 20 mL"
  },
  {
    "id": "propofol-10",
    "brandName": "Propovan / Propofol 10 mg/mL Injetável (Cristália)",
    "activePrinciple": "Propofol",
    "category": "Anestésico Geral Indutor de Ação Curta",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 4,
      "felino": 4
    },
    "doseRangeText": "2 a 6 mg/kg (0,2 a 0,6 mL/kg) IV lento até efeito indutor",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV) lenta",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Infundir lentamente IV. Apneia transitória comum se administrado rápido.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Cristália",
    "presentationText": "Frasco-ampola de 20 mL"
  },
  {
    "id": "ketamina-10",
    "brandName": "Ketamina 10% (100 mg/mL) Injetável",
    "activePrinciple": "Cloridrato de Cetamina",
    "category": "Anestésico Dissociativo & Analgésico",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "2 a 10 mg/kg associado a benzodiazepínicos IM/IV",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM) / IV",
    "bottleVolumeMl": 10,
    "clinicalNotes": "100 mg/mL. Nunca usar isolado em cães e gatos (rigidez muscular e convulsões). Sempre associar a sedativos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "xylazine-2",
    "brandName": "Rompun / Xilazina 2% (20 mg/mL) Injetável (Elanco)",
    "activePrinciple": "Cloridrato de Xilazina",
    "category": "Sedativo & Miorrelaxante Alfa-2 Agonista",
    "formType": "liquid",
    "concentrationMgMl": 20,
    "percentage": 2,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 2
    },
    "doseRangeText": "Cães: 0,5 a 1 mg/kg (0,025 a 0,05 mL/kg) | Gatos: 1 a 2 mg/kg IM/IV",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM) / IV",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Potente sedativo com efeitos cardiovasculares (bradicardia e arritmias). Reversível com ioimbina.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Elanco",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "dexdomitor-inj",
    "brandName": "Dexdomitor® 0,5 mg/mL Injetável (Zoetis / Dexmedetomidina)",
    "activePrinciple": "Cloridrato de Dexmedetomidina",
    "category": "Sedativo Alfa-2 Agonista de Alta Seletividade",
    "formType": "liquid",
    "concentrationMgMl": 0.5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.005,
      "felino": 0.01
    },
    "doseRangeText": "Cães: 10 a 375 mcg/m² | Gatos: 40 mcg/kg IM ou IV",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM) / IV",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Sedação profunda e analgesia previsível. Reversível com Antisedan (Atipamezol).",
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "itrafungol-oral",
    "brandName": "Itrafungol® Solução Oral 10 mg/mL (Elanco / Itraconazol)",
    "activePrinciple": "Itraconazol",
    "category": "Antifúngico Sistêmico",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg (0,5 mL/kg) a cada 24h VO (esquemas pulsados em dermatofitose e esporotricose)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 52,
    "clinicalNotes": "Padrão ouro para tratamento de esporotricose felina e dermatofitose.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Elanco",
    "presentationText": "Frasco-ampola de 52 mL"
  },
  {
    "id": "fluconazol-150",
    "brandName": "Fluconazol 150 mg Comprimidos",
    "activePrinciple": "Fluconazol",
    "category": "Antifúngico Sistêmico Triazólico",
    "formType": "tablet",
    "tabletMg": 150,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 a 10 mg/kg a cada 24h VO",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Excelente penetração no SNC e barreira hematoencefálica para micoses sistêmicas.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "drontal-plus",
    "brandName": "Drontal® Plus Cães (Elanco)",
    "activePrinciple": "Praziquantel + Pamoato de Pirantel + Febantel",
    "category": "Antiparasitário Interno Polivalente",
    "formType": "tablet",
    "tabletMg": 150,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 15
    },
    "doseRangeText": "1 comprimido para cada 10 kg de peso vivo em dose única VO",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 4,
    "clinicalNotes": "Vermífugo de largo espectro contra cestódeos e nematódeos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Elanco",
    "presentationText": "Cartucho com 4 comprimidos"
  },
  {
    "id": "drontal-gatos",
    "brandName": "Drontal® Gatos Comprimidos (Elanco)",
    "activePrinciple": "Praziquantel + Pamoato de Pirantel",
    "category": "Antiparasitário Interno para Felinos",
    "formType": "tablet",
    "tabletMg": 80,
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 5
    },
    "doseRangeText": "1 comprimido para cada 4 kg de peso vivo VO",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 4,
    "clinicalNotes": "Específico para gatos, alta palatabilidade.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Elanco",
    "presentationText": "Cartucho com 4 comprimidos"
  },
  {
    "id": "nexgard-spectra",
    "brandName": "NexGard Spectra® (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner + Milbemicina Oxima",
    "category": "Antiparasitário Externo e Interno (Endectocida Mastigável)",
    "formType": "tablet",
    "tabletMg": 28.3,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mastigável mensal conforme faixa de peso do cão",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 3,
    "clinicalNotes": "Proteção mensal contra pulgas, carrapatos, sarnas e vermes intestinais / prevenção de giárdia e verme do coração.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Boehringer Ingelheim",
    "presentationText": "Cartucho com 3 comprimidos"
  },
  {
    "id": "epOritro-inj",
    "brandName": "EpOritro® / Eritropoietina Humana Recombinante",
    "activePrinciple": "Eritropoietina Alfa",
    "category": "Agente Hematopoiético & Estimulante Eritrocitário",
    "formType": "liquid",
    "concentrationMgMl": 2000,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 100,
      "felino": 100
    },
    "doseRangeText": "100 UI/kg SC 3 vezes por semana até hematócrito alvo",
    "defaultFrequency": "BID",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 1,
    "clinicalNotes": "Para anemia não regenerativa associada à Doença Renal Crônica (DRC). Cuidado com anticorpos anti-EPO.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 1 mL"
  },
  {
    "id": "vitamina-b12-inj",
    "brandName": "Rubranova / Vitamina B12 (Hidroxocobalamina) 5000 mcg",
    "activePrinciple": "Hidroxocobalamina (Vitamina B12)",
    "category": "Suplemento Vitamínico & Hematopoiético",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 50,
      "felino": 50
    },
    "doseRangeText": "250 a 1000 mcg por animal IM/SC semanal ou quinzenal",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 2,
    "clinicalNotes": "Essencial em enteropatias crônicas, insuficiência pancreática exócrina e anemias.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Hidroxocobalamina",
    "presentationText": "Frasco-ampola de 2 mL"
  },
  {
    "id": "glicopan-energy",
    "brandName": "Glicopan® Energy (Ceva)",
    "activePrinciple": "Aminoácidos + Glicose + Vitaminas do Complexo B",
    "category": "Suplemento Nutricional Energético & Tônico",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "0,5 mL/kg a 1 mL/kg VO a cada 12h ou diluído em fluidoterapia",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 250,
    "clinicalNotes": "Suporte nutricional rápido para animais convalescentes e atletas.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ceva",
    "presentationText": "Frasco-ampola de 250 mL"
  },
  {
    "id": "tobramicina-colirio",
    "brandName": "Tobrex® / Tobramicina 0,3% Colírio (Alcon)",
    "activePrinciple": "Tobramicina",
    "category": "Antimicrobiano Oftálmico Aminoglicosídeo",
    "formType": "drops",
    "concentrationMgMl": 3,
    "dropsPerMl": 20,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 gota em cada olho afetado a cada 4 a 8 horas",
    "defaultFrequency": "TID",
    "defaultRoute": "Oftálmica",
    "bottleVolumeMl": 5,
    "clinicalNotes": "Infecções bacterianas oculares, ceratites e conjuntivites.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Alcon",
    "presentationText": "Frasco conta-gotas de 5 mL"
  },
  {
    "id": "terramicina-oftalmica",
    "brandName": "Pomada Oftálmica Terramicina® com Polimixina B (Zoetis)",
    "activePrinciple": "Oxitetraciclina + Polimixina B",
    "category": "Antimicrobiano Oftálmico em Pomada",
    "formType": "tablet",
    "tabletMg": 10,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "Aplicar pequena quantidade no saco conjuntival a cada 8 horas",
    "defaultFrequency": "TID",
    "defaultRoute": "Oftálmica",
    "tabletsPerBox": 1,
    "clinicalNotes": "Padrão ouro em conjuntivites infecciosas e úlceras superficiais de córnea.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 1 comprimidos"
  },
  {
    "id": "tramadol-gotas-100",
    "brandName": "Tramadol 100 mg/mL Gotas (Uso Humano / Vet)",
    "activePrinciple": "Cloridrato de Tramadol",
    "category": "Analgésico Opioide Gotas",
    "formType": "drops",
    "concentrationMgMl": 100,
    "dropsPerMl": 40,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 4,
      "felino": 2
    },
    "doseRangeText": "2 a 4 mg/kg (1 gota por kg para a solução 100 mg/mL) a cada 8h VO",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Solução oral em gotas. 1 mL = 40 gotas (2,5 mg/gota).",
    "validationStatus": "VALIDADO",
    "manufacturer": "Uso Humano / Vet",
    "presentationText": "Frasco conta-gotas de 10 mL"
  },
  {
    "id": "chorulon-hCG",
    "brandName": "Chorulon® 1.500 UI (Gonadotrofina Coriônica / MSD)",
    "activePrinciple": "Gonadotrofina Coriônica Humana (hCG)",
    "category": "Reprodução Veterinária & Indutores Hormonais",
    "formType": "liquid",
    "concentrationMgMl": 1500,
    "species": [
      "Canino",
      "Felino",
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 500,
      "felino": 250,
      "bovino": 1500,
      "equino": 1500
    },
    "doseRangeText": "Cães/Gatos: 500 a 1000 UI por animal IM/SC para indução de ovulação ou criptorquidismo",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Hormônio gonadotrófico coriônico para distúrbios ovarianos e indução de ovulação.",
    "validationStatus": "VALIDADO",
    "manufacturer": "MSD Saúde Animal",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "ociovet-ocitocina",
    "brandName": "Ocitovet® 10 UI/mL (Ocitocina Sintética / Ourofino)",
    "activePrinciple": "Ocitocina Sintética",
    "category": "Obstetrícia Veterinária & Hormônios Uterotônicos",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "species": [
      "Canino",
      "Felino",
      "Bovino",
      "Equino",
      "Suíno"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.2,
      "bovino": 0.05,
      "equino": 0.05
    },
    "doseRangeText": "Cães: 2 a 10 UI por animal IM/SC; Bovinos: 20 a 50 UI",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Estimula a contração do miométrio no parto (inércia uterina sem obstrução) e ejeção láctea.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 20 mL"
  },
  {
    "id": "ketamin-10pct",
    "brandName": "Cetamina 10% (100 mg/mL) Injetável (Syntec / Ceva)",
    "activePrinciple": "Cloridrato de Cetamina",
    "category": "Anestesia Geral Dissociativa",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino",
      "Felino",
      "Equino",
      "Bovino",
      "Coelhos",
      "Aves",
      "Répteis"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 10,
      "equino": 2.2
    },
    "doseRangeText": "Cães: 5 a 10 mg/kg IV associada a benzodiazepínico | Gatos: 5 a 15 mg/kg IM/IV",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV) / IM",
    "bottleVolumeMl": 50,
    "clinicalNotes": "10% = 100 mg/mL. Anestésico dissociativo de ação central. Nunca usar isolado em cães e gatos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Syntec / Ceva",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "epinefrina-adrenalina",
    "brandName": "Cloridrato de Adrenalina 1 mg/mL (1:1.000) (Hipolabor)",
    "activePrinciple": "Epinefrina (Adrenalina)",
    "category": "Emergência, UTI & Vasopressor (RCP)",
    "formType": "liquid",
    "concentrationMgMl": 1,
    "species": [
      "Canino",
      "Felino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.01,
      "felino": 0.01
    },
    "doseRangeText": "0,01 a 0,1 mg/kg (0,01 a 0,1 mL/kg da solução 1:1.000) IV/IT na Parada Cardiorrespiratória",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV) / Intratraqueal",
    "bottleVolumeMl": 1,
    "clinicalNotes": "Fármaco essencial em protocolos de Reanimação Cardiopulmonar (RCP) e choque anafilático grave.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Hipolabor",
    "presentationText": "Frasco-ampola de 1 mL"
  },
  {
    "id": "atropina-sulfato-05",
    "brandName": "Sulfato de Atropina 0,5 mg/mL (Hipolabor / Iso Farma)",
    "activePrinciple": "Sulfato de Atropina",
    "category": "Emergência, Anticolinérgico & Antídoto",
    "formType": "liquid",
    "concentrationMgMl": 0.5,
    "species": [
      "Canino",
      "Felino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.04,
      "felino": 0.04
    },
    "doseRangeText": "0,02 a 0,04 mg/kg IV/IM/SC; Tratamento de bradicardia severa ou intoxicação por organofosforados",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV) / SC / IM",
    "bottleVolumeMl": 1,
    "clinicalNotes": "Anticolinérgico parassimpaticolítico. Reverte bradicardia sinusal e toxicidade colinérgica.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Hipolabor",
    "presentationText": "Frasco-ampola de 1 mL"
  },
  {
    "id": "furosemida-inj-50",
    "brandName": "Furosemida 50 mg/mL (5%) Injetável (Ourofino / Vetnil)",
    "activePrinciple": "Furosemida",
    "category": "Diurético de Alça, Cardiologia & Emergência (Edema Pulmonar)",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "percentage": 5,
    "species": [
      "Canino",
      "Felino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1
    },
    "doseRangeText": "1 a 4 mg/kg IV/IM/SC a cada 8 a 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV) / IM / SC",
    "bottleVolumeMl": 20,
    "clinicalNotes": "5% = 50 mg/mL. Diurético potente de alça para edema agudo de pulmão, ICC e insuficiência renal.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino / Vetnil",
    "presentationText": "Frasco-ampola de 20 mL"
  },
  {
    "id": "banamine-inj",
    "brandName": "Banamine® Injetável 50 mg/mL (Flunixin Meglumine / MSD)",
    "activePrinciple": "Flunixin Meglumine",
    "category": "AINE Anti-inflamatório Não Esteroidal (Equinos & Cães)",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "species": [
      "Equino",
      "Bovino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "equino": 1.1,
      "canino": 1,
      "bovino": 2.2
    },
    "doseRangeText": "Equinos: 1,1 mg/kg IV/IM SID (máximo 5 dias) | Cães: 1 mg/kg IV/SC dose única ou sob rigorosa indicação",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV) / IM",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Excelente para cólica equina, dor visceral e dor musculoesquelética.",
    "validationStatus": "VALIDADO",
    "manufacturer": "MSD Saúde Animal",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "bio-calphos-inj",
    "brandName": "Bio-Calphos® Injetável (Biofarm)",
    "activePrinciple": "Cálcio + Fósforo + Magnésio + Dextrose",
    "category": "Suplemento Mineral & Metabólico (Hipocalcemia / Febre do Leite)",
    "formType": "liquid",
    "concentrationMgMl": 250,
    "species": [
      "Bovino",
      "Equino",
      "Ovino",
      "Caprino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "bovino": 1,
      "equino": 1,
      "canino": 0.5
    },
    "doseRangeText": "Bovinos/Equinos: 100 a 300 mL por animal IV lenta; Cães: 5 a 20 mL IV lenta",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV) Lenta",
    "bottleVolumeMl": 500,
    "clinicalNotes": "Tratamento e prevenção de febre do leite (hipocalcemia pós-parto), eclâmpsia e tetania.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 500 mL"
  },
  {
    "id": "bio-enroflax-10",
    "brandName": "Bio-Enroflax® 10% Injetável (Biofarm)",
    "activePrinciple": "Enrofloxacina",
    "category": "Antimicrobiano Quinolona / Fluoroquinolona",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino",
      "Felino",
      "Bovino",
      "Suíno",
      "Aves"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5,
      "bovino": 5
    },
    "doseRangeText": "5 a 10 mg/kg SC/IM/IV SID por 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 50,
    "clinicalNotes": "10% = 100 mg/mL. Amplo espectro contra bactérias Gram-negativas e positivas.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "bio-genta-10",
    "brandName": "Bio-Genta® 10% Injetável (Biofarm)",
    "activePrinciple": "Sulfato de Gentamicina",
    "category": "Antimicrobiano Aminoglicosídeo",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "species": [
      "Canino",
      "Felino",
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 6,
      "felino": 5,
      "equino": 6.6
    },
    "doseRangeText": "Cães: 6 a 9 mg/kg | Gatos: 5 a 8 mg/kg, IV/IM/SC uma vez ao dia (dose única diária reduz a nefrotoxicidade) | Equinos: 6,6 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV) / IM",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Aminoglicosídeo bactericida. Monitorar função renal.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 20 mL"
  },
  {
    "id": "bio-oxitetra-la",
    "brandName": "Bio-Oxitetraciclina L.A.® 20% (Biofarm)",
    "activePrinciple": "Oxitetraciclina Di-hidrato",
    "category": "Antimicrobiano Tetraciclina de Longa Ação",
    "formType": "liquid",
    "concentrationMgMl": 200,
    "percentage": 20,
    "species": [
      "Bovino",
      "Equino",
      "Suíno",
      "Ovino",
      "Caprino"
    ],
    "defaultDoseMgKg": {
      "bovino": 20,
      "equino": 20,
      "suino": 20
    },
    "doseRangeText": "20 mg/kg (1 mL para cada 10 kg) IM profunda dose única (repete em 72h se necessário)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM) Profunda",
    "bottleVolumeMl": 50,
    "clinicalNotes": "20% = 200 mg/mL. Ação prolongada de 3 a 5 dias.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "bio-iver-1pct",
    "brandName": "Bio-Iver® 1% Injetável (Biofarm)",
    "activePrinciple": "Ivermectina",
    "category": "Antiparasitário Endectocida",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "percentage": 1,
    "species": [
      "Bovino",
      "Suíno",
      "Ovinos"
    ],
    "defaultDoseMgKg": {
      "bovino": 0.2,
      "suino": 0.3,
      "ovino": 0.2
    },
    "doseRangeText": "200 mcg/kg (1 mL para cada 50 kg) SC",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 500,
    "clinicalNotes": "Controle de nematódeos gastrointestinais, bernes e carrapatos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 500 mL"
  },
  {
    "id": "bio-cort-inj",
    "brandName": "Bio-Cort® Injetável (Biofarm / Dexametasona)",
    "activePrinciple": "Fosfato Sodico de Dexametasona",
    "category": "Corticosteroide Anti-inflamatório & Imunossupressor",
    "formType": "liquid",
    "concentrationMgMl": 2,
    "species": [
      "Canino",
      "Felino",
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5,
      "bovino": 0.05
    },
    "doseRangeText": "Cães/Gatos: 0,2 a 1 mg/kg IM/IV/SC; Bovinos/Equinos: 5 a 20 mg por animal",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV) / IM / SC",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Ação anti-inflamatória potente de curta/média duração.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm / Dexametasona",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "bio-complex-ade",
    "brandName": "Bio-Complex® ADE Injetável (Biofarm)",
    "activePrinciple": "Vitamina A + Vitamina D3 + Vitamina E",
    "category": "Suplemento Vitamínico ADE",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "species": [
      "Bovino",
      "Equino",
      "Suíno",
      "Ovino",
      "Caprino"
    ],
    "defaultDoseMgKg": {
      "bovino": 0.1,
      "equino": 0.1
    },
    "doseRangeText": "Bovinos/Equinos adultos: 5 a 10 mL IM dose única trimestral",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "bottleVolumeMl": 250,
    "clinicalNotes": "Prevenção e tratamento de carências vitamínicas ADE, melhoria reprodutiva e imunológica.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 250 mL"
  },
  {
    "id": "bio-tonificante-inj",
    "brandName": "Bio-Tonificante® Injetável (Biofarm)",
    "activePrinciple": "Fosforilcolina + Vitamina B12 + Minerais",
    "category": "Tônico Geral & Estimulante Metabólico",
    "formType": "liquid",
    "concentrationMgMl": 150,
    "species": [
      "Bovino",
      "Equino",
      "Suíno",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "bovino": 0.05,
      "equino": 0.05,
      "canino": 0.1
    },
    "doseRangeText": "Grandes animais: 10 a 20 mL SC/IM; Pequenos animais: 1 a 3 mL",
    "defaultFrequency": "BID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 100,
    "clinicalNotes": "Auxilia na recuperação de estados carenciais, estresse e convalescença.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 100 mL"
  },
  {
    "id": "bio-cid-desinfetante",
    "brandName": "Bio-Cid® Desinfetante Hospitalar (Biofarm)",
    "activePrinciple": "Cloreto de Alquil Dimetil Benzil Amônio + Glutaraldeído",
    "category": "Antisséptico & Desinfetante de Instalações",
    "formType": "liquid",
    "concentrationMgMl": 200,
    "species": [
      "Bovino",
      "Equino",
      "Suíno",
      "Canino",
      "Aves"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "bovino": 1
    },
    "doseRangeText": "Diluição de 1:200 a 1:500 para desinfecção de pisos, gaiolas e maternidades",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica / Ambiental",
    "bottleVolumeMl": 1000,
    "clinicalNotes": "Desinfetante de amplo espectro para uso veterinário e hospitalar.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 1000 mL"
  },
  {
    "id": "bio-tox-carvao",
    "brandName": "Bio-Tox® Carvão Ativado Pó (Biofarm)",
    "activePrinciple": "Carvão Ativado Farmacêutico",
    "category": "Antídoto & Adsorvente de Toxinas (Emergência)",
    "formType": "tablet",
    "tabletMg": 500,
    "species": [
      "Canino",
      "Felino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 100,
      "felino": 100,
      "equino": 200
    },
    "doseRangeText": "1 a 2 g/kg VO diluído em água nas primeiras horas após ingestão de tóxicos",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO) / Sonda",
    "tabletsPerBox": 50,
    "clinicalNotes": "Adsorvente gastrointestinal de emergência em intoxicações agudas e envenenamentos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Cartucho com 50 comprimidos"
  },
  {
    "id": "bio-sulfatrim-susp",
    "brandName": "Bio-Sulfatrim® Suspensão Oral (Biofarm)",
    "activePrinciple": "Sulfadiazina + Trimetoprima",
    "category": "Antimicrobiano Sulfonamida Potencializada",
    "formType": "liquid",
    "concentrationMgMl": 240,
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 30,
      "felino": 30,
      "equino": 30
    },
    "doseRangeText": "30 mg/kg (soma dos princípios ativos) a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 100,
    "clinicalNotes": "Infecções respiratórias, urinárias e gastrointestinais.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 100 mL"
  },
  {
    "id": "bio-etofen-inj",
    "brandName": "Bio-Etofen® Injetável 10% (Biofarm)",
    "activePrinciple": "Tolfenamato de Sódio",
    "category": "AINE Anti-inflamatório Não Esteroidal & Analgésico",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Canino",
      "Bovino",
      "Suíno"
    ],
    "defaultDoseMgKg": {
      "canino": 4,
      "bovino": 2
    },
    "doseRangeText": "Cães: 4 mg/kg SC/IM dose única ou diária por até 3 dias | Bovinos: 2 mg/kg IM/IV",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Indicado para dor aguda, febre e processos inflamatórios músculo-esqueléticos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "bio-ver-plus-oral",
    "brandName": "Bio-Verm Plus® Comprimidos Palatáveis (Biofarm)",
    "activePrinciple": "Pamoato de Pirantel + Praziquantel + Febantel",
    "category": "Antiparasitário Interno de Largo Espectro",
    "formType": "tablet",
    "tabletMg": 150,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 15
    },
    "doseRangeText": "1 comprimido para cada 10 kg de peso vivo VO em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 4,
    "clinicalNotes": "Combate nematódeos e cestódeos intestinais em cães.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Cartucho com 4 comprimidos"
  },
  {
    "id": "bio-cicatrizante-spray",
    "brandName": "Bio-Cicatrizante® Spray Alumínio (Biofarm)",
    "activePrinciple": "Alumínio Micronizado Coloidal",
    "category": "Antisséptico & Protetor de Feridas Tópicas",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "species": [
      "Canino",
      "Felino",
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "bovino": 1
    },
    "doseRangeText": "Pulverizar a área afetada a uma distância de 15 a 20 cm, 1 a 2 vezes ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Tópica",
    "bottleVolumeMl": 250,
    "clinicalNotes": "Cria película protetora respirável sobre feridas cirúrgicas e traumáticas.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 250 mL"
  },
  {
    "id": "bio-oto-gotas",
    "brandName": "Bio-Oto® Solução Otológica (Biofarm)",
    "activePrinciple": "Gentamicina + Betametasona + Miconazol + Pectina",
    "category": "Antimicrobiano, Anti-inflamatório & Antifúngico Otológico",
    "formType": "drops",
    "concentrationMgMl": 34,
    "dropsPerMl": 20,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "Cães até 15 kg: 4 gotas em cada ouvido a cada 12h; acima de 15 kg: 8 gotas",
    "defaultFrequency": "BID",
    "defaultRoute": "Otológica",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Tratamento de otites externas agudas e crônicas.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco conta-gotas de 20 mL"
  },
  {
    "id": "bio-oftalmo-colirio",
    "brandName": "Bio-Oftalmo® Colírio Estéril (Biofarm)",
    "activePrinciple": "Sulfato de Neomicina + Polimixina B + Cloridrato de Fenilefrina",
    "category": "Antimicrobiano & Descongestionante Oftálmico",
    "formType": "drops",
    "concentrationMgMl": 5,
    "dropsPerMl": 20,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 a 2 gotas em cada olho afetado a cada 6 a 8 horas",
    "defaultFrequency": "TID",
    "defaultRoute": "Oftálmica",
    "bottleVolumeMl": 15,
    "clinicalNotes": "Infecções bacterianas superficiais dos olhos e anexos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco conta-gotas de 15 mL"
  },
  {
    "id": "bio-mast-intramamario",
    "brandName": "Bio-Mast® L.A. Intramamário (Biofarm)",
    "activePrinciple": "Cefoperazona Sódica",
    "category": "Antimicrobiano Intramamário para Mastite Bovina",
    "formType": "liquid",
    "concentrationMgMl": 250,
    "species": [
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "bovino": 1
    },
    "doseRangeText": "Infusão de 1 seringa de 10 mL por quarto afetado após a ordenha, a cada 24h por 3 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Intramamária",
    "bottleVolumeMl": 10,
    "clinicalNotes": "Tratamento de mastites clínicas em vacas lactantes.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 10 mL"
  },
  {
    "id": "bio-hepato-oral",
    "brandName": "Bio-Hepato® Solução Oral (Biofarm)",
    "activePrinciple": "Silimarina + DL-Metionina + Cloreto de Colina + Vitamina B12",
    "category": "Protetor Hepático & Detoxificante",
    "formType": "liquid",
    "concentrationMgMl": 80,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 mL para cada 5 kg de peso corporal a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Suporte metabólico e regenerador celular hepático em hepatopatias.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "bio-gastri-oral",
    "brandName": "Bio-Gastri® Pasta Oral 37% (Biofarm)",
    "activePrinciple": "Omeprazol",
    "category": "Inibidor da Bomba de Prótons & Protetor Gástrico (Úlceras)",
    "formType": "tablet",
    "tabletMg": 370,
    "species": [
      "Equino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "equino": 4,
      "canino": 1
    },
    "doseRangeText": "Equinos: 1 a 4 mg/kg SID VO por 28 dias para úlceras gástricas",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 7,
    "clinicalNotes": "Tratamento e prevenção de úlceras gástricas em equinos atletas e cães.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Cartucho com 7 comprimidos"
  },
  {
    "id": "bio-derme-spray",
    "brandName": "Bio-Derme® Spray Dermatológico (Biofarm)",
    "activePrinciple": "Clorexidina 0,5% + Cetoconazol 2%",
    "category": "Antifúngico, Antisséptico & Antibacteriano Tópico",
    "formType": "liquid",
    "concentrationMgMl": 25,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "Borrifar sobre as lesões de pele a cada 24h ou conforme orientação veterinária",
    "defaultFrequency": "SID",
    "defaultRoute": "Tópica",
    "bottleVolumeMl": 200,
    "clinicalNotes": "Dermatites fúngicas (Malassezia, dermatófitos) e piodermites superficiais.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 200 mL"
  },
  {
    "id": "bio-ferro-inj",
    "brandName": "Bio-Ferro® Injetável 10% (Biofarm)",
    "activePrinciple": "Ferro Dextrana",
    "category": "Agente Hematopoiético & Antianêmico",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Suíno",
      "Bovino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "suino": 15,
      "canino": 10
    },
    "doseRangeText": "Leitões: 1 a 2 mL (100 a 200 mg de ferro) IM aos 3 dias de vida",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "bottleVolumeMl": 100,
    "clinicalNotes": "Prevenção e tratamento da anemia ferropriva em leitões neonatos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 100 mL"
  },
  {
    "id": "bio-selen-ade",
    "brandName": "Bio-Selen® E Injetável (Biofarm)",
    "activePrinciple": "Selenito de Sódio + Vitamina E",
    "category": "Suplemento Mineral & Antioxidante",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "species": [
      "Bovino",
      "Equino",
      "Ovino",
      "Caprino",
      "Suíno"
    ],
    "defaultDoseMgKg": {
      "bovino": 0.05,
      "ovino": 0.05
    },
    "doseRangeText": "Bovinos/Equinos: 1 mL para cada 50 kg SC/IM; Ovinos: 0,5 mL para cada 10 kg",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 250,
    "clinicalNotes": "Prevenção de distrofia muscular nutricional (doença do músculo branco), retenção de placenta e deficiência de selênio.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm",
    "presentationText": "Frasco-ampola de 250 mL"
  },
  {
    "id": "bio-cardio-pimobendan",
    "brandName": "Bio-Cardio® 2,5 mg Comprimidos (Biofarm / Pimobendan)",
    "activePrinciple": "Pimobendan",
    "category": "Cardiologia & Inotrópico Positivo / Vasodilatador",
    "formType": "tablet",
    "tabletMg": 2.5,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,2 a 0,3 mg/kg por tomada a cada 12h VO (0,4 a 0,6 mg/kg por dia), 1 hora antes da refeição",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 30,
    "clinicalNotes": "Tratamento da insuficiência cardíaca congestiva (ICC) em cães decorrente de MDC ou degeneração da válvula mitral.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Biofarm / Pimobendan",
    "presentationText": "Cartucho com 30 comprimidos"
  },
  {
    "id": "enrotril-150",
    "brandName": "Enrotril® 150 mg Comprimidos (Ourofino / Enrofloxacina)",
    "activePrinciple": "Enrofloxacina",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "tabletMg": 150,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg a 10 mg/kg SID VO por 7 a 14 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Infecções respiratórias, entéricas, dérmicas e geniturinárias causadas por bactérias sensíveis.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "doramec-gold-1",
    "brandName": "Doramec® Gold 1% Injetável (Zoetis / Doramectina)",
    "activePrinciple": "Doramectina",
    "category": "Endectocida de Longa Ação",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "percentage": 1,
    "species": [
      "Bovino",
      "Suíno",
      "Ovino"
    ],
    "defaultDoseMgKg": {
      "bovino": 0.2,
      "suino": 0.3,
      "ovino": 0.2
    },
    "doseRangeText": "Bovinos e ovinos: 0,2 mg/kg (1 mL para cada 50 kg) | Suínos: 0,3 mg/kg (1 mL para cada 33 kg), SC ou IM em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC) / IM",
    "bottleVolumeMl": 500,
    "clinicalNotes": "Controle de vermes gastrointestinais, bernes, carrapatos, piolhos e sarnas em bovinos e suínos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Frasco-ampola de 500 mL"
  },
  {
    "id": "hemolitan-pet",
    "brandName": "Hemolitan® Pet 30 mL Gotas (Ourofino / Vitamínico Mineral)",
    "activePrinciple": "Ferro elementar + Vitaminas do Complexo B + Ácido Fólico",
    "category": "Suplemento Hematopoiético / Vitamínico",
    "formType": "drops",
    "concentrationMgMl": 50,
    "dropsPerMl": 20,
    "species": [
      "Canino",
      "Felino",
      "Aves",
      "Pequenos Mamíferos"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 gota por kg de peso corporal a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 30,
    "clinicalNotes": "Suplemento líquido altamente palatável para suporte em anemias carenciais e convalescença.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco conta-gotas de 30 mL"
  },
  {
    "id": "simparica-trio-10",
    "brandName": "Simparica Trio® 10-20 kg (Zoetis / Sarolaner + Moxidectina + Pirantel)",
    "activePrinciple": "Sarolaner + Moxidectina + Pamoato de Pirantel",
    "category": "Endectocida Oral / Pulgas, Carrapatos, Vermes e Verme do Coração",
    "formType": "tablet",
    "tabletMg": 40,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1.2
    },
    "doseRangeText": "1 comprimido mensal conforme faixa de peso do cão VO",
    "defaultFrequency": "Mensal",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 3,
    "clinicalNotes": "Proteção mensal completa contra ectoparasitos e endoparasitos intestinais e filariose.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Zoetis",
    "presentationText": "Cartucho com 3 comprimidos"
  },
  {
    "id": "nexgard-spectra-15",
    "brandName": "NexGard Spectra® 15-30 kg (Boehringer / Afoxolaner + Milbemicina)",
    "activePrinciple": "Afoxolaner + Oxima de Milbemicina",
    "category": "Endectocida Mastigável / Pulgas, Carrapatos e Vermes",
    "formType": "tablet",
    "tabletMg": 75,
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 comprimido mastigável mensal VO",
    "defaultFrequency": "Mensal",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 3,
    "clinicalNotes": "Mastigável sabor carne para controle mensal integrado.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Boehringer Ingelheim",
    "presentationText": "Cartucho com 3 comprimidos"
  },
  {
    "id": "ciprovet-colirio",
    "brandName": "Ciprovet® Solução Oftálmica 5 mL (Lema / Ciprofloxacina + Dexametasona)",
    "activePrinciple": "Cloridrato de Ciprofloxacina + Fosfato Dissódico de Dexametasona",
    "category": "Oftalmológico / Antibiótico + Corticosteroide",
    "formType": "drops",
    "concentrationMgMl": 3,
    "dropsPerMl": 20,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 gota no olho afetado a cada 8h ou 12h",
    "defaultFrequency": "TID",
    "defaultRoute": "Tópico Oftálmico",
    "bottleVolumeMl": 5,
    "clinicalNotes": "Conjuntivites bacterianas e ceratites sensíveis. Contraindicado em úlceras de córnea profundas devido ao corticosteroide.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Lema / Ciprofloxacina + Dexametasona",
    "presentationText": "Frasco conta-gotas de 5 mL"
  },
  {
    "id": "aurivet-pomada",
    "brandName": "Aurivet® Pomada Otológica 15 g (Lema / Polimixina B + Enrofloxacina)",
    "activePrinciple": "Enrofloxacina + Clotrimazol + Betametasona + Lidocaína",
    "category": "Otológico / Antibiótico + Antifúngico + Anti-inflamatório",
    "formType": "liquid",
    "concentrationMgMl": 5,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "4 a 8 gotas no conduto auditivo a cada 12h por 7 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Tópico Otológico",
    "bottleVolumeMl": 15,
    "clinicalNotes": "Tratamento de otites externas agudas e crônicas de origem bacteriana e fúngica.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Lema / Polimixina B + Enrofloxacina",
    "presentationText": "Frasco-ampola de 15 mL"
  },
  {
    "id": "vermivet-comp",
    "brandName": "Vermivet® Comprimidos (Agener União / Praziquantel + Pirantel + Pamoato)",
    "activePrinciple": "Praziquantel + Pamoato de Pirantel + Febantel",
    "category": "Vermífugo / Anti-helmíntico",
    "formType": "tablet",
    "tabletMg": 150,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 15
    },
    "doseRangeText": "1 comprimido para cada 10 kg de peso VO em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 4,
    "clinicalNotes": "Combate nematódeos e cestódeos intestinais.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Agener União",
    "presentationText": "Cartucho com 4 comprimidos"
  },
  {
    "id": "panacur-500",
    "brandName": "Panacur® 500 mg Comprimidos (MSD / Fenbendazol)",
    "activePrinciple": "Fenbendazol",
    "category": "Anti-helmíntico / Giardicida",
    "formType": "tablet",
    "tabletMg": 500,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 50
    },
    "doseRangeText": "50 mg/kg SID VO por 3 dias consecutivos (eficaz contra Giárdia)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 10,
    "clinicalNotes": "Tratamento de giardíase e nematódeos intestinais em cães e gatos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "MSD Saúde Animal",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "duotrim-inj",
    "brandName": "Duotrim® Injetável 50 mL (Ourofino / Sulfadiazina + Trimetoprim)",
    "activePrinciple": "Sulfadiazina + Trimetoprim",
    "category": "Antimicrobiano Sulfonamida Potencializada",
    "formType": "liquid",
    "concentrationMgMl": 240,
    "species": [
      "Canino",
      "Bovino",
      "Equino",
      "Suíno"
    ],
    "defaultDoseMgKg": {
      "canino": 15,
      "bovino": 24
    },
    "doseRangeText": "15 a 30 mg/kg a cada 12h ou 24h IV ou IM lenta",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV) / IM",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Infecções respiratórias, urinárias e entéricas.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "ivermectina-1-inj",
    "brandName": "Ivermectina 1% Injetável 50 mL (Ourofino)",
    "activePrinciple": "Ivermectina",
    "category": "Endectocida Injetável",
    "formType": "liquid",
    "concentrationMgMl": 10,
    "percentage": 1,
    "species": [
      "Bovino",
      "Suíno",
      "Ovino"
    ],
    "defaultDoseMgKg": {
      "bovino": 0.2
    },
    "doseRangeText": "0,2 mg/kg (1 mL para cada 50 kg) SC",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Controle de parasitos internos e externos em ruminantes e suínos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "sucralfato-1g",
    "brandName": "Sucralfato 1 g Comprimidos",
    "activePrinciple": "Sucralfato",
    "category": "Protetor de Mucosa Gástrica",
    "formType": "tablet",
    "tabletMg": 1000,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 50
    },
    "doseRangeText": "0,5 g a 1 g por cão a cada 8h VO (ou 50 mg/kg)",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "tabletsPerBox": 20,
    "clinicalNotes": "Formação de barreira protetora sobre úlceras gástricas e duodenais.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Cartucho com 20 comprimidos"
  },
  {
    "id": "enrofloxacina-10-inj",
    "brandName": "Enrofloxacina 10% Injetável 50 mL (Ourofino)",
    "activePrinciple": "Enrofloxacina",
    "category": "Antimicrobiano Fluoroquinolona Injetável",
    "formType": "liquid",
    "concentrationMgMl": 100,
    "percentage": 10,
    "species": [
      "Bovino",
      "Suíno",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "bovino": 5,
      "canino": 5
    },
    "doseRangeText": "5 mg/kg SID SC, IM ou IV",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC) / IM / IV",
    "bottleVolumeMl": 50,
    "clinicalNotes": "Infecções sistêmicas graves por bactérias gram-negativas e micoplasmas.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 50 mL"
  },
  {
    "id": "gentamicina-50",
    "brandName": "Sulfato de Gentamicina 40 mg/mL Injetável (Ourofino)",
    "activePrinciple": "Sulfato de Gentamicina",
    "category": "Antimicrobiano Aminoglicosídeo",
    "formType": "liquid",
    "concentrationMgMl": 40,
    "species": [
      "Canino",
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 6,
      "bovino": 4
    },
    "doseRangeText": "Cães: 6 a 9 mg/kg | Gatos: 5 a 8 mg/kg, IV/IM/SC uma vez ao dia (dose única diária reduz a nefrotoxicidade) | Bovinos: 4 a 6 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV) / IM / SC",
    "bottleVolumeMl": 20,
    "clinicalNotes": "Infecções bacterianas graves. Atenção à nefrotoxicidade e ototoxicidade.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Ourofino",
    "presentationText": "Frasco-ampola de 20 mL"
  },
  {
    "id": "ondansetrona-4",
    "brandName": "Ondansetrona 4 mg Comprimidos",
    "activePrinciple": "Cloridrato de Ondansetrona",
    "category": "Antiêmético Potente (Antagonista 5-HT3)",
    "formType": "tablet",
    "tabletMg": 4,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1 mg/kg SID ou BID VO ou IV",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO) / IV",
    "tabletsPerBox": 10,
    "clinicalNotes": "Antiemético de alta potência indicado em quadros de quimioterapia e vômitos refratários.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Cartucho com 10 comprimidos"
  },
  {
    "id": "amoxicilina-po-reconstituido",
    "brandName": "Amoxicilina Pó para Suspensão Oral 250 mg/5 mL (50 mg/mL)",
    "activePrinciple": "Amoxicilina Tri-hidratada",
    "category": "Antimicrobiano Betalactâmico Suspensão",
    "formType": "liquid",
    "concentrationMgMl": 50,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 20,
      "felino": 20
    },
    "doseRangeText": "10 a 20 mg/kg a cada 12h VO",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 150,
    "clinicalNotes": "Suspensão oral pediátrica/veterinária para infecções sensíveis em cães e gatos.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Genérico (vários laboratórios)",
    "presentationText": "Frasco-ampola de 150 mL"
  },
  {
    "id": "cetoprofeno-gotas-20",
    "brandName": "Cetoprofeno 20 mg/mL Gotas (Uso Veterinário)",
    "activePrinciple": "Cetoprofeno",
    "category": "Anti-inflamatório Não Esteroidal (Gotas)",
    "formType": "drops",
    "concentrationMgMl": 20,
    "dropsPerMl": 40,
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 mg/kg a cada 24h VO (1 gota por kg para 20 mg/mL)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "bottleVolumeMl": 20,
    "clinicalNotes": "AINE analgésico em gotas para administração oral em cães.",
    "validationStatus": "VALIDADO",
    "manufacturer": "Uso Veterinário",
    "presentationText": "Frasco conta-gotas de 20 mL"
  },
  {
    "id": "metacam-oral-dog-15",
    "brandName": "Metacam® Solução Oral Cães 1,5 mg/mL (Boehringer Ingelheim)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco com 10 mL com seringa dosadora",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Dose de ataque: 0,2 mg/kg no 1º dia; Manutenção: 0,1 mg/kg a cada 24h",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Metacam Solução Oral Cães: 1,5 mg de meloxicam por mL. Agitar bem antes de usar.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 1.5,
    "bottleVolumeMl": 10,
    "protocols": [
      {
        "id": "metacam-dog-ataque",
        "label": "1º Dia / Ataque (0,2 mg/kg)",
        "doseMgKg": {
          "canino": 0.2
        }
      },
      {
        "id": "metacam-dog-manut",
        "label": "A partir do 2º Dia / Manutenção (0,1 mg/kg)",
        "doseMgKg": {
          "canino": 0.1
        }
      }
    ]
  },
  {
    "id": "metacam-oral-dog-32",
    "brandName": "Metacam® Solução Oral Cães 1,5 mg/mL Frasco 32 mL (Boehringer Ingelheim)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco com 32 mL com seringa dosadora graduada por peso",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Ataque 0,2 mg/kg no 1º dia; Manutenção 0,1 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 1.5,
    "bottleVolumeMl": 32
  },
  {
    "id": "metacam-oral-cat-05",
    "brandName": "Metacam® Solução Oral Gatos 0,5 mg/mL (Boehringer Ingelheim)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório Específico para Gatos",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 15 mL",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 0.1
    },
    "doseRangeText": "Dose única ou 1º dia: 0,1 mg/kg; Manutenção: 0,05 mg/kg SID por tempo restrito",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Específico para felinos. Bula preconiza dose de ataque de 0,1 mg/kg e manutenção de 0,05 mg/kg com monitoramento renal estrito.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.5,
    "bottleVolumeMl": 15,
    "protocols": [
      {
        "id": "metacam-cat-ataque",
        "label": "1º Dia (0,1 mg/kg)",
        "doseMgKg": {
          "felino": 0.1
        }
      },
      {
        "id": "metacam-cat-manut",
        "label": "Manutenção (0,05 mg/kg)",
        "doseMgKg": {
          "felino": 0.05
        }
      }
    ]
  },
  {
    "id": "metacam-inj-5mg",
    "brandName": "Metacam® Injetável 0,5% (5 mg/mL) (Boehringer Ingelheim)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "Cães: 0,2 mg/kg SC/IV | Gatos: 0,1 mg/kg SC dose única",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "percentage": 0.5,
    "bottleVolumeMl": 20
  },
  {
    "id": "elo-xicam-05-comp",
    "brandName": "Elo-Xicam® 0,5 mg Comprimidos (Chemitec)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "Cães: 0,2 mg/kg 1º dia, depois 0,1 mg/kg SID | Gatos: 0,1 mg/kg 1º dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 0.5,
    "tabletsPerBox": 10
  },
  {
    "id": "elo-xicam-10-comp",
    "brandName": "Elo-Xicam® 1,0 mg Comprimidos (Chemitec)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Cães: 0,2 mg/kg no 1º dia; 0,1 mg/kg do 2º ao 5º dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1,
    "tabletsPerBox": 10
  },
  {
    "id": "elo-xicam-20-comp",
    "brandName": "Elo-Xicam® 2,0 mg Comprimidos (Chemitec)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Cães: 0,2 mg/kg no 1º dia; 0,1 mg/kg manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2,
    "tabletsPerBox": 10
  },
  {
    "id": "elo-xicam-40-comp",
    "brandName": "Elo-Xicam® 4,0 mg Comprimidos (Chemitec)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Cães grandes: 0,2 mg/kg 1º dia; 0,1 mg/kg manutenção SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 4,
    "tabletsPerBox": 10
  },
  {
    "id": "elo-xicam-inj-02",
    "brandName": "Elo-Xicam® Injetável 0,2% (Chemitec)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "0,2% = 2 mg/mL. Cães: 0,2 mg/kg SC; Gatos: 0,1 mg/kg SC",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 2,
    "percentage": 0.2,
    "bottleVolumeMl": 20
  },
  {
    "id": "elo-xicam-inj-20",
    "brandName": "Elo-Xicam® Injetável 2% (Chemitec)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 50 mL",
    "species": [
      "Canino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "2% = 20 mg/mL. Cães: 0,2 mg/kg; Equinos e Bovinos: 0,6 mg/kg IV/SC",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 20,
    "percentage": 2,
    "bottleVolumeMl": 50
  },
  {
    "id": "meloxivet-05-comp",
    "brandName": "Meloxivet® 0,5 mg Comprimidos (Duprat)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Duprat",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "Cães: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção | Gatos: 0,1 mg/kg 1º dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Duprat. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 0.5,
    "tabletsPerBox": 10
  },
  {
    "id": "meloxivet-20-comp",
    "brandName": "Meloxivet® 2,0 mg Comprimidos (Duprat)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Duprat",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Cães: 0,2 mg/kg no 1º dia, 0,1 mg/kg manutenção SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Duprat. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2,
    "tabletsPerBox": 10
  },
  {
    "id": "meloxivet-gotas-02",
    "brandName": "Meloxivet® Gotas 0,2% (Duprat)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Duprat",
    "category": "AINE Anti-inflamatório",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 10 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "0,2% = 2 mg/mL (1 gota = 0,1 mg). Cães: 2 gotas/kg 1º dia; Gatos: 1 gota/kg",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Duprat. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 2,
    "percentage": 0.2,
    "bottleVolumeMl": 10
  },
  {
    "id": "meloxinew-05-comp",
    "brandName": "Meloxinew® 0,5 mg Comprimidos Mastigáveis (Vetnil)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Vetnil",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos mastigáveis palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.1
    },
    "doseRangeText": "Cães: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção | Gatos: 0,1 mg/kg 1º dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 0.5,
    "tabletsPerBox": 10
  },
  {
    "id": "meloxinew-10-comp",
    "brandName": "Meloxinew® 1,0 mg Comprimidos Mastigáveis (Vetnil)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Vetnil",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Cães: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1,
    "tabletsPerBox": 10
  },
  {
    "id": "meloxinew-20-comp",
    "brandName": "Meloxinew® 2,0 mg Comprimidos Mastigáveis (Vetnil)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Vetnil",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Cães: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2,
    "tabletsPerBox": 10
  },
  {
    "id": "meloxinew-40-comp",
    "brandName": "Meloxinew® 4,0 mg Comprimidos Mastigáveis (Vetnil)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Vetnil",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Cães grandes: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 4,
    "tabletsPerBox": 10
  },
  {
    "id": "maxicam-gel-01",
    "brandName": "Maxicam® Gel 0,1% (Ourofino)",
    "activePrinciple": "Meloxicam",
    "manufacturer": "Ourofino",
    "category": "AINE Anti-inflamatório",
    "formType": "paste",
    "presentationText": "Seringa dosadora com 30 g de gel palatável",
    "species": [
      "Equino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Equinos: 0,6 mg/kg SID | Cães: 0,2 mg/kg 1º dia e 0,1 mg/kg manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 1,
    "bottleVolumeMl": 30
  },
  {
    "id": "maxicam-plus-05",
    "brandName": "Maxicam® Plus 0,5 mg Comprimidos (Ourofino)",
    "activePrinciple": "Meloxicam + Sulfato de Condroitina",
    "manufacturer": "Ourofino",
    "category": "AINE & Condroprotetor",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "0,5 mg Meloxicam + 200 mg Condroitina. 0,2 mg/kg 1º dia e 0,1 mg/kg manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 0.5,
    "tabletsPerBox": 10
  },
  {
    "id": "maxicam-plus-20",
    "brandName": "Maxicam® Plus 2,0 mg Comprimidos (Ourofino)",
    "activePrinciple": "Meloxicam + Sulfato de Condroitina",
    "manufacturer": "Ourofino",
    "category": "AINE & Condroprotetor",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "2,0 mg Meloxicam + 800 mg Condroitina. 0,2 mg/kg 1º dia e 0,1 mg/kg manutenção",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2,
    "tabletsPerBox": 10
  },
  {
    "id": "rimadyl-mast-25",
    "brandName": "Rimadyl® Mastigável 25 mg (Zoetis)",
    "activePrinciple": "Carprofeno",
    "manufacturer": "Zoetis",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Frasco com 14 comprimidos palatáveis mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 4.4
    },
    "doseRangeText": "4,4 mg/kg SID ou divididos em 2,2 mg/kg BID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "AINE seletivo COX-2 aprovado para cães. Não utilizar em gatos.",
    "validationStatus": "VALIDADO",
    "tabletMg": 25,
    "tabletsPerBox": 14
  },
  {
    "id": "rimadyl-mast-75",
    "brandName": "Rimadyl® Mastigável 75 mg (Zoetis)",
    "activePrinciple": "Carprofeno",
    "manufacturer": "Zoetis",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Frasco com 14 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 4.4
    },
    "doseRangeText": "4,4 mg/kg SID ou 2,2 mg/kg BID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 75,
    "tabletsPerBox": 14
  },
  {
    "id": "rimadyl-mast-100",
    "brandName": "Rimadyl® Mastigável 100 mg (Zoetis)",
    "activePrinciple": "Carprofeno",
    "manufacturer": "Zoetis",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Frasco com 14 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 4.4
    },
    "doseRangeText": "4,4 mg/kg SID ou 2,2 mg/kg BID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 14
  },
  {
    "id": "rimadyl-inj-50",
    "brandName": "Rimadyl® Injetável 50 mg/mL (5%) (Zoetis)",
    "activePrinciple": "Carprofeno",
    "manufacturer": "Zoetis",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 4
    },
    "doseRangeText": "4,0 mg/kg via SC ou IV lenta, preferencialmente pré-operatório",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 50,
    "percentage": 5,
    "bottleVolumeMl": 20
  },
  {
    "id": "carprodyl-quad-20",
    "brandName": "Carprodyl® Quadrissectável 20 mg (Ceva)",
    "activePrinciple": "Carprofeno",
    "manufacturer": "Ceva",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos quadrissectáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 4
    },
    "doseRangeText": "2 a 4 mg/kg por dia divididos em 1 a 2 tomadas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 20
  },
  {
    "id": "carprodyl-quad-50",
    "brandName": "Carprodyl® Quadrissectável 50 mg (Ceva)",
    "activePrinciple": "Carprofeno",
    "manufacturer": "Ceva",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos quadrissectáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 4
    },
    "doseRangeText": "2 a 4 mg/kg por dia",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 20
  },
  {
    "id": "carprodyl-quad-100",
    "brandName": "Carprodyl® Quadrissectável 100 mg (Ceva)",
    "activePrinciple": "Carprofeno",
    "manufacturer": "Ceva",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos quadrissectáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 4
    },
    "doseRangeText": "2 a 4 mg/kg por dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 20
  },
  {
    "id": "ketofen-comp-5",
    "brandName": "Ketofen® 5 mg Comprimidos (Boehringer Ingelheim)",
    "activePrinciple": "Cetoprofeno",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 mg/kg uma vez ao dia por até 3 a 5 dias consecutivos",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 10
  },
  {
    "id": "ketofen-comp-20",
    "brandName": "Ketofen® 20 mg Comprimidos (Boehringer Ingelheim)",
    "activePrinciple": "Cetoprofeno",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 mg/kg SID por 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 10
  },
  {
    "id": "ketofen-inj-1",
    "brandName": "Ketofen® Injetável 1% (Boehringer Ingelheim)",
    "activePrinciple": "Cetoprofeno",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 2
    },
    "doseRangeText": "2 mg/kg SC, IM ou IV no 1º dia (0,2 mL/kg da solução 1%)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 20
  },
  {
    "id": "chemitofen-inj-1",
    "brandName": "Chemitofen® Injetável 1% (Chemitec)",
    "activePrinciple": "Cetoprofeno",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 2
    },
    "doseRangeText": "2 mg/kg no 1º dia SC, IM ou IV",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 20
  },
  {
    "id": "chemitofen-inj-10",
    "brandName": "Chemitofen® Injetável 10% (Chemitec)",
    "activePrinciple": "Cetoprofeno",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 50 mL",
    "species": [
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "Equinos e Bovinos: 2,2 mg/kg IV ou IM SID por 1 a 3 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "percentage": 10,
    "bottleVolumeMl": 50
  },
  {
    "id": "previcox-57-comp",
    "brandName": "Previcox® 57 mg Comprimidos Mastigáveis (Boehringer Ingelheim)",
    "activePrinciple": "Firocoxib",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório Coxibe",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia com ou sem alimento",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Coxibe de alta seletividade COX-2 para cães. Excelente tolerabilidade gastrointestinal.",
    "validationStatus": "VALIDADO",
    "tabletMg": 57,
    "tabletsPerBox": 10
  },
  {
    "id": "previcox-227-comp",
    "brandName": "Previcox® 227 mg Comprimidos Mastigáveis (Boehringer Ingelheim)",
    "activePrinciple": "Firocoxib",
    "manufacturer": "Boehringer Ingelheim",
    "category": "AINE Anti-inflamatório Coxibe",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia para cães de médio e grande porte",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 227,
    "tabletsPerBox": 10
  },
  {
    "id": "onsior-gatos-6mg",
    "brandName": "Onsior® 6 mg Comprimidos para Gatos (Elanco)",
    "activePrinciple": "Robenacoxib",
    "manufacturer": "Elanco",
    "category": "AINE Específico para Felinos (Coxibe)",
    "formType": "tablet",
    "presentationText": "Cartucho com 6 comprimidos palatáveis",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 1
    },
    "doseRangeText": "1 a 2,4 mg/kg uma vez ao dia por até 6 dias (dose padrão 1 mg/kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Coxibe específico com excelente perfil de segurança para dor aguda e ortopédica em gatos.",
    "validationStatus": "VALIDADO",
    "tabletMg": 6,
    "tabletsPerBox": 6
  },
  {
    "id": "onsior-caes-10mg",
    "brandName": "Onsior® 10 mg Comprimidos para Cães (Elanco)",
    "activePrinciple": "Robenacoxib",
    "manufacturer": "Elanco",
    "category": "AINE Anti-inflamatório Coxibe",
    "formType": "tablet",
    "presentationText": "Cartucho com 7 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 a 2 mg/kg SID sem alimento",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 7
  },
  {
    "id": "onsior-caes-20mg",
    "brandName": "Onsior® 20 mg Comprimidos para Cães (Elanco)",
    "activePrinciple": "Robenacoxib",
    "manufacturer": "Elanco",
    "category": "AINE Anti-inflamatório Coxibe",
    "formType": "tablet",
    "presentationText": "Cartucho com 7 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 a 2 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 7
  },
  {
    "id": "onsior-caes-40mg",
    "brandName": "Onsior® 40 mg Comprimidos para Cães (Elanco)",
    "activePrinciple": "Robenacoxib",
    "manufacturer": "Elanco",
    "category": "AINE Anti-inflamatório Coxibe",
    "formType": "tablet",
    "presentationText": "Cartucho com 7 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 a 2 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 40,
    "tabletsPerBox": 7
  },
  {
    "id": "onsior-inj-20mg",
    "brandName": "Onsior® Injetável 20 mg/mL (Elanco)",
    "activePrinciple": "Robenacoxib",
    "manufacturer": "Elanco",
    "category": "AINE Anti-inflamatório Injetável",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 2
    },
    "doseRangeText": "2 mg/kg SC antes da cirurgia (ortopédica ou tecidos moles)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 20,
    "bottleVolumeMl": 20
  },
  {
    "id": "trocoxil-20-comp",
    "brandName": "Trocoxil® 20 mg Comprimidos Mastigáveis (Zoetis)",
    "activePrinciple": "Mavacoxib",
    "manufacturer": "Zoetis",
    "category": "AINE Coxibe de Longa Duração",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg VO no dia 0, repetir no dia 14 e após isso mensalmente (a cada 30 dias)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Coxibe de meia-vida prolongada indicado para dor osteoartrítica crônica em cães.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 2
  },
  {
    "id": "trocoxil-30-comp",
    "brandName": "Trocoxil® 30 mg Comprimidos Mastigáveis (Zoetis)",
    "activePrinciple": "Mavacoxib",
    "manufacturer": "Zoetis",
    "category": "AINE Coxibe de Longa Duração",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg VO dia 0, dia 14 e mensal",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 30,
    "tabletsPerBox": 2
  },
  {
    "id": "trocoxil-75-comp",
    "brandName": "Trocoxil® 75 mg Comprimidos Mastigáveis (Zoetis)",
    "activePrinciple": "Mavacoxib",
    "manufacturer": "Zoetis",
    "category": "AINE Coxibe de Longa Duração",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg VO para cães de grande porte",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 75,
    "tabletsPerBox": 2
  },
  {
    "id": "trocoxil-95-comp",
    "brandName": "Trocoxil® 95 mg Comprimidos Mastigáveis (Zoetis)",
    "activePrinciple": "Mavacoxib",
    "manufacturer": "Zoetis",
    "category": "AINE Coxibe de Longa Duração",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg VO para cães gigantes",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 95,
    "tabletsPerBox": 2
  },
  {
    "id": "cimalgex-8-comp",
    "brandName": "Cimalgex® 8 mg Comprimidos Mastigáveis (Vetoquinol)",
    "activePrinciple": "Cimicoxib",
    "manufacturer": "Vetoquinol",
    "category": "AINE Anti-inflamatório Coxibe",
    "formType": "tablet",
    "presentationText": "Cartucho com 8 comprimidos palatáveis divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg uma vez ao dia com ou sem alimento",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 8,
    "tabletsPerBox": 8
  },
  {
    "id": "cimalgex-30-comp",
    "brandName": "Cimalgex® 30 mg Comprimidos Mastigáveis (Vetoquinol)",
    "activePrinciple": "Cimicoxib",
    "manufacturer": "Vetoquinol",
    "category": "AINE Anti-inflamatório Coxibe",
    "formType": "tablet",
    "presentationText": "Cartucho com 8 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 30,
    "tabletsPerBox": 8
  },
  {
    "id": "cimalgex-80-comp",
    "brandName": "Cimalgex® 80 mg Comprimidos Mastigáveis (Vetoquinol)",
    "activePrinciple": "Cimicoxib",
    "manufacturer": "Vetoquinol",
    "category": "AINE Anti-inflamatório Coxibe",
    "formType": "tablet",
    "presentationText": "Cartucho com 8 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg uma vez ao dia para cães grandes",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 80,
    "tabletsPerBox": 8
  },
  {
    "id": "desflan-inj-50",
    "brandName": "Desflan® Injetável 50 mg/mL (Ourofino)",
    "activePrinciple": "Flunixina Meglumina",
    "manufacturer": "Ourofino",
    "category": "AINE Anti-inflamatório Potente",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 50 mL",
    "species": [
      "Equino",
      "Bovino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1.1
    },
    "doseRangeText": "Equinos: 1,1 mg/kg IV/IM SID | Cães: 1 mg/kg IV/SC dose única ou max 3 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 50,
    "bottleVolumeMl": 50
  },
  {
    "id": "chemiflux-inj-50",
    "brandName": "Chemiflux® Injetável 5% (Chemitec)",
    "activePrinciple": "Flunixina Meglumina",
    "manufacturer": "Chemitec",
    "category": "AINE Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 50 mL",
    "species": [
      "Equino",
      "Bovino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1.1
    },
    "doseRangeText": "5% = 50 mg/mL. Cães: 1 mg/kg | Equinos: 1,1 mg/kg",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 50,
    "percentage": 5,
    "bottleVolumeMl": 50
  },
  {
    "id": "dipi-vet-gotas",
    "brandName": "Dipi-Vet® Gotas 500 mg/mL (Vetnil)",
    "activePrinciple": "Dipirona Sódica",
    "manufacturer": "Vetnil",
    "category": "Analgésico e Antipirético",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 15
    },
    "doseRangeText": "Cães: 25 mg/kg (1 gota/kg) TID | Gatos: 10 a 15 mg/kg BID a TID",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 500,
    "bottleVolumeMl": 20
  },
  {
    "id": "chemidipirona-inj-50",
    "brandName": "Chemidipirona® Injetável 500 mg/mL (Chemitec)",
    "activePrinciple": "Dipirona Sódica",
    "manufacturer": "Chemitec",
    "category": "Analgésico e Antipirético",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Canino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "25 mg/kg IV lento, IM ou SC a cada 8h",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 500,
    "bottleVolumeMl": 50
  },
  {
    "id": "prednisolona-agener-5",
    "brandName": "Prednisolona Agener® 5 mg Comprimidos (Agener União)",
    "activePrinciple": "Prednisolona",
    "manufacturer": "Agener União",
    "category": "Glicocorticoide Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 1
    },
    "doseRangeText": "Anti-inflamatório: 0,5 a 1 mg/kg/dia | Imunossupressor: 2 a 4 mg/kg/dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 10
  },
  {
    "id": "prednisolona-agener-20",
    "brandName": "Prednisolona Agener® 20 mg Comprimidos (Agener União)",
    "activePrinciple": "Prednisolona",
    "manufacturer": "Agener União",
    "category": "Glicocorticoide Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "Anti-inflamatório: 0,5 a 1 mg/kg/dia | Imunossupressor: 2 mg/kg/dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 10
  },
  {
    "id": "prednisolona-vetnil-gotas",
    "brandName": "Prednisolona Vetnil® Gotas 10 mg/mL (Vetnil)",
    "activePrinciple": "Prednisolona",
    "manufacturer": "Vetnil",
    "category": "Glicocorticoide Anti-inflamatório",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas com 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 1
    },
    "doseRangeText": "10 mg/mL (1 gota = 0,5 mg). Anti-inflamatório: 0,5 a 1 mg/kg SID a BID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 20
  },
  {
    "id": "predsim-oral-3mg",
    "brandName": "Predsim® Solução Oral 3 mg/mL (Mantecorp)",
    "activePrinciple": "Fosfato Sódico de Prednisolona",
    "manufacturer": "Mantecorp",
    "category": "Glicocorticoide Anti-inflamatório Humano/Vet",
    "formType": "liquid",
    "presentationText": "Frasco com 60 mL acompanhado de seringa dosadora",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 1
    },
    "doseRangeText": "3 mg/mL. Dose anti-inflamatória: 0,5 a 1 mg/kg VO a cada 12-24h",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Mantecorp. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 3,
    "bottleVolumeMl": 60
  },
  {
    "id": "prelone-oral-3mg",
    "brandName": "Prelone® Solução Oral 3 mg/mL (Aché)",
    "activePrinciple": "Prednisolona",
    "manufacturer": "Aché",
    "category": "Glicocorticoide Anti-inflamatório Humano/Vet",
    "formType": "liquid",
    "presentationText": "Frasco com 120 mL com copo dosador",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 1
    },
    "doseRangeText": "3 mg/mL. Cães: 0,5 a 1 mg/kg SID | Gatos: 1 a 2 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Aché. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 3,
    "bottleVolumeMl": 120
  },
  {
    "id": "meticorten-5-comp",
    "brandName": "Meticorten® 5 mg Comprimidos (MSD Saúde Animal)",
    "activePrinciple": "Prednisona",
    "manufacturer": "MSD Saúde Animal",
    "category": "Glicocorticoide Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Blister com 20 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "Cães: 0,5 a 1 mg/kg SID a BID. Prednisona requer conversão hepática (evitar em gatos)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 20
  },
  {
    "id": "meticorten-20-comp",
    "brandName": "Meticorten® 20 mg Comprimidos (MSD Saúde Animal)",
    "activePrinciple": "Prednisona",
    "manufacturer": "MSD Saúde Animal",
    "category": "Glicocorticoide Anti-inflamatório",
    "formType": "tablet",
    "presentationText": "Blister com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "Cães: 0,5 a 1 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 10
  },
  {
    "id": "azium-comp-05",
    "brandName": "Azium® Comprimidos 0,5 mg (MSD Saúde Animal)",
    "activePrinciple": "Dexametasona",
    "manufacturer": "MSD Saúde Animal",
    "category": "Glicocorticoide Potente",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1,
      "felino": 0.1
    },
    "doseRangeText": "0,05 a 0,15 mg/kg SID por até 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 0.5,
    "tabletsPerBox": 20
  },
  {
    "id": "chemicort-inj-2",
    "brandName": "Chemicort® Injetável 2 mg/mL (Chemitec)",
    "activePrinciple": "Dexametasona",
    "manufacturer": "Chemitec",
    "category": "Glicocorticoide Injetável",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 10 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.15,
      "felino": 0.15
    },
    "doseRangeText": "0,1 a 0,25 mg/kg IV, IM ou SC",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 2,
    "bottleVolumeMl": 10
  },
  {
    "id": "dexavansil-inj-2",
    "brandName": "Dexavansil® Injetável 2 mg/mL (Vansil)",
    "activePrinciple": "Dexametasona",
    "manufacturer": "Vansil",
    "category": "Glicocorticoide Injetável",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Canino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.15
    },
    "doseRangeText": "0,1 a 0,2 mg/kg IV ou IM",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vansil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 2,
    "bottleVolumeMl": 50
  },
  {
    "id": "decadron-inj-4mg",
    "brandName": "Decadron® Injetável 4 mg/mL (Aché)",
    "activePrinciple": "Fosfato Dissódico de Dexametasona",
    "manufacturer": "Aché",
    "category": "Glicocorticoide de Ação Rápida Hospitalar",
    "formType": "liquid",
    "presentationText": "Ampola de 2,5 mL (10 mg total)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.2
    },
    "doseRangeText": "0,15 a 0,5 mg/kg IV ou IM em emergências alérgicas ou choque",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Aché. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 4,
    "bottleVolumeMl": 2.5
  },
  {
    "id": "depo-medrol-40",
    "brandName": "Depo-Medrol® Injetável 40 mg/mL (Zoetis)",
    "activePrinciple": "Acetato de Metilprednisolona",
    "manufacturer": "Zoetis",
    "category": "Glicocorticoide de Depósito Longa Ação",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 5 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 2
    },
    "doseRangeText": "Cães: 1 mg/kg IM/SC a cada 1-3 semanas | Gatos: 10 a 20 mg/gato dose única IM a cada 2-4 semanas",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Ação prolongada por 2 a 4 semanas. Uso cauteloso em felinos devido a risco de diabetes mellitus iatrogênico.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 5
  },
  {
    "id": "solu-medrol-125",
    "brandName": "Solu-Medrol® 125 mg Frasco-Ampola (Pfizer)",
    "activePrinciple": "Succinato Sódico de Metilprednisolona",
    "manufacturer": "Pfizer",
    "category": "Glicocorticoide Hospitalar Emergencial",
    "formType": "liquid",
    "presentationText": "Frasco-ampola liofilizado com diluente (2 mL)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 30,
      "felino": 30
    },
    "doseRangeText": "Trauma medular agudo (primeiras 8h): 30 mg/kg IV lento em 15 min",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Atenção: o protocolo de 30 mg/kg no trauma medular não é mais recomendado de rotina (sem benefício comprovado e com risco de úlcera gastrointestinal e infecção). Padrão ouro hospitalar para trauma agudo de medula espinhal e choque anafilático refratário.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 62.5,
    "bottleVolumeMl": 2
  },
  {
    "id": "solu-medrol-500",
    "brandName": "Solu-Medrol® 500 mg Frasco-Ampola (Pfizer)",
    "activePrinciple": "Succinato Sódico de Metilprednisolona",
    "manufacturer": "Pfizer",
    "category": "Glicocorticoide Hospitalar Emergencial",
    "formType": "liquid",
    "presentationText": "Frasco-ampola liofilizado com diluente (8 mL)",
    "species": [
      "Canino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 30
    },
    "doseRangeText": "Trauma raquimedular agudo: 30 mg/kg IV lento",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Atenção: o protocolo de 30 mg/kg no trauma medular não é mais recomendado de rotina (sem benefício comprovado e com risco de úlcera gastrointestinal e infecção). Produto registrado oficialmente pelo laboratório Pfizer. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 62.5,
    "bottleVolumeMl": 8
  },
  {
    "id": "cortavance-spray-76",
    "brandName": "Cortavance® Spray Tópico 0,584 mg/mL (Virbac)",
    "activePrinciple": "Aceponato de Hidrocortisona",
    "manufacturer": "Virbac",
    "category": "Dermatologia & Corticoide Tópico Diester",
    "formType": "spray",
    "presentationText": "Frasco aplicador spray de 76 mL",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "2 borrifadas para cada 100 cm² de área de pele uma vez ao dia por 7 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Corticoide diéster inovador metabolizado na própria pele sem absorção sistêmica significativa.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.584,
    "bottleVolumeMl": 76
  },
  {
    "id": "vetalog-plus-inj",
    "brandName": "Vetalog Plus® Injetável 6 mg/mL (Zoetis)",
    "activePrinciple": "Acetonido de Triancinolona",
    "manufacturer": "Zoetis",
    "category": "Glicocorticoide de Depósito",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 5 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1,
      "felino": 0.1
    },
    "doseRangeText": "0,1 a 0,2 mg/kg IM ou SC a cada 15 dias",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 6,
    "bottleVolumeMl": 5
  },
  {
    "id": "synulox-inj-140",
    "brandName": "Synulox® Injetável Suspensão Oleosa RTU (140 mg/mL) (Zoetis)",
    "activePrinciple": "Amoxicilina + Clavulanato de Potássio",
    "manufacturer": "Zoetis",
    "category": "Antimicrobiano Penicilânico Potencializado",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 40 mL pronto para uso",
    "species": [
      "Canino",
      "Felino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 8.75,
      "felino": 8.75
    },
    "doseRangeText": "8,75 mg/kg (1 mL para cada 16 kg) via SC ou IM uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Contém 140 mg de amoxicilina e ácido clavulânico por mL. Agitar vigorosamente antes de aspirar.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 140,
    "bottleVolumeMl": 40
  },
  {
    "id": "clavaseptin-50-comp",
    "brandName": "Clavaseptin® 50 mg Comprimidos Divisíveis (Vetoquinol)",
    "activePrinciple": "Amoxicilina + Ácido Clavulânico",
    "manufacturer": "Vetoquinol",
    "category": "Antimicrobiano Penicilânico Potencializado",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis divisíveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5,
      "felino": 12.5
    },
    "doseRangeText": "12,5 mg/kg a cada 12 horas (BID) por 7 a 14 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "clavaseptin-250-comp",
    "brandName": "Clavaseptin® 250 mg Comprimidos Divisíveis (Vetoquinol)",
    "activePrinciple": "Amoxicilina + Ácido Clavulânico",
    "manufacturer": "Vetoquinol",
    "category": "Antimicrobiano Penicilânico Potencializado",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5
    },
    "doseRangeText": "12,5 mg/kg BID por 7 a 14 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 250,
    "tabletsPerBox": 10
  },
  {
    "id": "clavaseptin-500-comp",
    "brandName": "Clavaseptin® 500 mg Comprimidos Divisíveis (Vetoquinol)",
    "activePrinciple": "Amoxicilina + Ácido Clavulânico",
    "manufacturer": "Vetoquinol",
    "category": "Antimicrobiano Penicilânico Potencializado",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5
    },
    "doseRangeText": "12,5 mg/kg BID para cães grandes",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 500,
    "tabletsPerBox": 10
  },
  {
    "id": "chemimox-cl-50",
    "brandName": "Chemimox CL® 50 mg Comprimidos (Chemitec)",
    "activePrinciple": "Amoxicilina + Clavulanato de Potássio",
    "manufacturer": "Chemitec",
    "category": "Antimicrobiano Penicilânico Potencializado",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5,
      "felino": 12.5
    },
    "doseRangeText": "12,5 a 25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "chemimox-cl-250",
    "brandName": "Chemimox CL® 250 mg Comprimidos (Chemitec)",
    "activePrinciple": "Amoxicilina + Clavulanato de Potássio",
    "manufacturer": "Chemitec",
    "category": "Antimicrobiano Penicilânico Potencializado",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 12.5
    },
    "doseRangeText": "12,5 a 25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 250,
    "tabletsPerBox": 10
  },
  {
    "id": "baytril-flavor-15",
    "brandName": "Baytril® Flavour 15 mg Comprimidos (Elanco)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "Elanco",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia (ou dividida a cada 12h) por 5 a 10 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Aviso em gatos: não exceder a dose estrita de 5 mg/kg/dia devido ao risco de degeneração retiniana e cegueira.",
    "validationStatus": "VALIDADO",
    "tabletMg": 15,
    "tabletsPerBox": 10
  },
  {
    "id": "enrotrat-flavor-25",
    "brandName": "Enrotrat® Flavour 25 mg Comprimidos (Agener União)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 25,
    "tabletsPerBox": 10
  },
  {
    "id": "enrotrat-flavor-50",
    "brandName": "Enrotrat® Flavour 50 mg Comprimidos (Agener União)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "enrotrat-flavor-100",
    "brandName": "Enrotrat® Flavour 100 mg Comprimidos (Agener União)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 10
  },
  {
    "id": "zelotril-inj-10",
    "brandName": "Zelotril® Injetável 10% (Agener União)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 50 mL",
    "species": [
      "Canino",
      "Bovino",
      "Suíno"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "10% = 100 mg/mL. Cães: 5 mg/kg SC ou IM (0,5 mL para cada 10 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "percentage": 10,
    "bottleVolumeMl": 50
  },
  {
    "id": "flotril-comp-50",
    "brandName": "Flotril® 50 mg Comprimidos (MSD Saúde Animal)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "flotril-comp-150",
    "brandName": "Flotril® 150 mg Comprimidos (MSD Saúde Animal)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia para cães grandes",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 150,
    "tabletsPerBox": 10
  },
  {
    "id": "flotril-inj-25",
    "brandName": "Flotril® Injetável 2,5% (MSD Saúde Animal)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "2,5% = 25 mg/mL (1 mL para cada 5 kg). Cães e gatos: 5 mg/kg SC ou IM",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 25,
    "percentage": 2.5,
    "bottleVolumeMl": 20
  },
  {
    "id": "kenzocim-comp-50",
    "brandName": "Kenzocim® 50 mg Comprimidos (Syntec)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "Syntec",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "kenzocim-comp-150",
    "brandName": "Kenzocim® 150 mg Comprimidos (Syntec)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "Syntec",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 150,
    "tabletsPerBox": 10
  },
  {
    "id": "dupratril-comp-50",
    "brandName": "Dupratril® 50 mg Comprimidos (Duprat)",
    "activePrinciple": "Enrofloxacino",
    "manufacturer": "Duprat",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Duprat. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "rilexine-palat-75",
    "brandName": "Rilexine® Palatável 75 mg (Virbac)",
    "activePrinciple": "Cefalexina Monoidratada",
    "manufacturer": "Virbac",
    "category": "Antimicrobiano Cefalosporina 1ª Geração",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 25
    },
    "doseRangeText": "15 a 30 mg/kg a cada 12 horas (BID) por 14 a 28 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Cefalosporina de primeira geração de escolha para piodermites estafilocócicas em pequenos animais.",
    "validationStatus": "VALIDADO",
    "tabletMg": 75,
    "tabletsPerBox": 14
  },
  {
    "id": "rilexine-palat-300",
    "brandName": "Rilexine® Palatável 300 mg (Virbac)",
    "activePrinciple": "Cefalexina Monoidratada",
    "manufacturer": "Virbac",
    "category": "Antimicrobiano Cefalosporina 1ª Geração",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "25 mg/kg BID por 14 a 28 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Virbac. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 300,
    "tabletsPerBox": 14
  },
  {
    "id": "rilexine-palat-600",
    "brandName": "Rilexine® Palatável 600 mg (Virbac)",
    "activePrinciple": "Cefalexina Monoidratada",
    "manufacturer": "Virbac",
    "category": "Antimicrobiano Cefalosporina 1ª Geração",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "25 mg/kg BID para cães grandes",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Virbac. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 600,
    "tabletsPerBox": 14
  },
  {
    "id": "cefa-cure-50",
    "brandName": "Cefa-Cure® Tabs 50 mg (MSD Saúde Animal)",
    "activePrinciple": "Cefalexina Monoidratada",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Cefalosporina",
    "formType": "tablet",
    "presentationText": "Blister com 10 comprimidos divisíveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 20,
      "felino": 20
    },
    "doseRangeText": "20 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "cefa-cure-200",
    "brandName": "Cefa-Cure® Tabs 200 mg (MSD Saúde Animal)",
    "activePrinciple": "Cefalexina Monoidratada",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Cefalosporina",
    "formType": "tablet",
    "presentationText": "Blister com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "20 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 200,
    "tabletsPerBox": 10
  },
  {
    "id": "cefa-cure-1000",
    "brandName": "Cefa-Cure® Tabs 1000 mg (MSD Saúde Animal)",
    "activePrinciple": "Cefalexina Monoidratada",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Cefalosporina",
    "formType": "tablet",
    "presentationText": "Blister com 5 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "20 mg/kg BID para cães gigantes",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1000,
    "tabletsPerBox": 5
  },
  {
    "id": "cefalexina-vetnil-300",
    "brandName": "Cefalexina Vetnil® 300 mg Comprimidos (Vetnil)",
    "activePrinciple": "Cefalexina",
    "manufacturer": "Vetnil",
    "category": "Antimicrobiano Cefalosporina",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "20 a 30 mg/kg a cada 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 300,
    "tabletsPerBox": 10
  },
  {
    "id": "cefalexina-vetnil-600",
    "brandName": "Cefalexina Vetnil® 600 mg Comprimidos (Vetnil)",
    "activePrinciple": "Cefalexina",
    "manufacturer": "Vetnil",
    "category": "Antimicrobiano Cefalosporina",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 600,
    "tabletsPerBox": 10
  },
  {
    "id": "chemicef-300-comp",
    "brandName": "Chemicef® 300 mg Comprimidos (Chemitec)",
    "activePrinciple": "Cefalexina",
    "manufacturer": "Chemitec",
    "category": "Antimicrobiano Cefalosporina",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "20 a 30 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 300,
    "tabletsPerBox": 10
  },
  {
    "id": "cefalexina-agener-susp",
    "brandName": "Cefalexina Agener® Suspensão Oral 50 mg/mL (Agener União)",
    "activePrinciple": "Cefalexina Monoidratada",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Cefalosporina",
    "formType": "liquid",
    "presentationText": "Frasco com pó para reconstituição de 100 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 25
    },
    "doseRangeText": "50 mg/mL (0,5 mL/kg). 25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 50,
    "bottleVolumeMl": 100
  },
  {
    "id": "cefazolina-cristalia-1g",
    "brandName": "Cefazolina Sódica 1 g Frasco-Ampola (Cristália)",
    "activePrinciple": "Cefazolina Sódica",
    "manufacturer": "Cristália",
    "category": "Antimicrobiano Cefalosporina 1ª Geração Hospitalar",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 1 g de pó liofilizado",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 25
    },
    "doseRangeText": "Profilaxia cirúrgica: 25 mg/kg IV lenta na indução anestésica e a cada 90-120 min intraoperatório",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Padrão ouro em profilaxia cirúrgica ortopédica e de tecidos moles.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 10
  },
  {
    "id": "cefalotina-eurofarma-1g",
    "brandName": "Cefalotina Sódica 1 g Frasco-Ampola (Eurofarma)",
    "activePrinciple": "Cefalotina Sódica",
    "manufacturer": "Eurofarma",
    "category": "Antimicrobiano Cefalosporina 1ª Geração Hospitalar",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 1 g de pó para injeção",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 25
    },
    "doseRangeText": "25 a 30 mg/kg IV lento ou IM a cada 6 a 8 horas",
    "defaultFrequency": "QID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Eurofarma. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 10
  },
  {
    "id": "ceftriaxona-cristalia-1g",
    "brandName": "Ceftriaxona Sódica 1 g Injetável IV/IM (Cristália)",
    "activePrinciple": "Ceftriaxona Sódica",
    "manufacturer": "Cristália",
    "category": "Antimicrobiano Cefalosporina 3ª Geração Hospitalar",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 1 g de pó liofilizado + diluente",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 25
    },
    "doseRangeText": "25 a 50 mg/kg IV lenta (infusão em 20 min) a cada 12 a 24 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Excelente penetração liquórica e no SNC. Indicada em sepse, meningoencefalite e peritonite bacteriana.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 10
  },
  {
    "id": "doxifin-tabs-50",
    "brandName": "Doxifin® Tabs 50 mg (Ourofino)",
    "activePrinciple": "Doxiciclina Hiclato",
    "manufacturer": "Ourofino",
    "category": "Antimicrobiano Tetraciclina Palatável",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg a cada 12h ou 10 mg/kg a cada 24h por 28 dias para Erliquiose",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Comprimidos palatáveis facilitam adesão. Em gatos, administrar sempre com água ou alimento para prevenir esofagite por retenção.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 14
  },
  {
    "id": "doxifin-tabs-100",
    "brandName": "Doxifin® Tabs 100 mg (Ourofino)",
    "activePrinciple": "Doxiciclina Hiclato",
    "manufacturer": "Ourofino",
    "category": "Antimicrobiano Tetraciclina Palatável",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg BID ou 10 mg/kg SID por 28 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 14
  },
  {
    "id": "doxifin-tabs-200",
    "brandName": "Doxifin® Tabs 200 mg (Ourofino)",
    "activePrinciple": "Doxiciclina Hiclato",
    "manufacturer": "Ourofino",
    "category": "Antimicrobiano Tetraciclina Palatável",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 10
    },
    "doseRangeText": "10 mg/kg SID para cães grandes",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 200,
    "tabletsPerBox": 14
  },
  {
    "id": "doxitrat-comp-50",
    "brandName": "Doxitrat® 50 mg Comprimidos (Agener União)",
    "activePrinciple": "Doxiciclina Hiclato",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Tetraciclina",
    "formType": "tablet",
    "presentationText": "Cartucho com 16 comprimidos divisíveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg BID ou 10 mg/kg SID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 16
  },
  {
    "id": "doxitrat-comp-100",
    "brandName": "Doxitrat® 100 mg Comprimidos (Agener União)",
    "activePrinciple": "Doxiciclina Hiclato",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Tetraciclina",
    "formType": "tablet",
    "presentationText": "Cartucho com 16 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg BID ou 10 mg/kg SID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 16
  },
  {
    "id": "doxitrat-comp-200",
    "brandName": "Doxitrat® 200 mg Comprimidos (Agener União)",
    "activePrinciple": "Doxiciclina Hiclato",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Tetraciclina",
    "formType": "tablet",
    "presentationText": "Cartucho com 16 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg BID ou 10 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 200,
    "tabletsPerBox": 16
  },
  {
    "id": "doxymax-pet-50",
    "brandName": "Doxymax Pet® 50 mg Comprimidos (Vansil)",
    "activePrinciple": "Doxiciclina",
    "manufacturer": "Vansil",
    "category": "Antimicrobiano Tetraciclina",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg BID ou 10 mg/kg SID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vansil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 14
  },
  {
    "id": "doxymax-pet-100",
    "brandName": "Doxymax Pet® 100 mg Comprimidos (Vansil)",
    "activePrinciple": "Doxiciclina",
    "manufacturer": "Vansil",
    "category": "Antimicrobiano Tetraciclina",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg BID ou 10 mg/kg SID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vansil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 14
  },
  {
    "id": "ronaxan-comp-20",
    "brandName": "Ronaxan® 20 mg Comprimidos (Boehringer Ingelheim)",
    "activePrinciple": "Doxiciclina",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antimicrobiano Tetraciclina",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 mg/kg BID ou 10 mg/kg SID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 10
  },
  {
    "id": "ronaxan-comp-100",
    "brandName": "Ronaxan® 100 mg Comprimidos (Boehringer Ingelheim)",
    "activePrinciple": "Doxiciclina",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antimicrobiano Tetraciclina",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 10
    },
    "doseRangeText": "10 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 10
  },
  {
    "id": "marbopet-275-comp",
    "brandName": "Marbopet® 27,5 mg Comprimidos Palatáveis (Ceva)",
    "activePrinciple": "Marbofloxacino",
    "manufacturer": "Ceva",
    "category": "Antimicrobiano Fluoroquinolona 3ª Geração",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.75,
      "felino": 2.75
    },
    "doseRangeText": "2,75 mg/kg uma vez ao dia (ou até 5,5 mg/kg em infecções graves) por 5 a 21 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Fluoroquinolona de terceira geração de alta biodisponibilidade e segurança em cães e gatos.",
    "validationStatus": "VALIDADO",
    "tabletMg": 27.5,
    "tabletsPerBox": 10
  },
  {
    "id": "marbopet-825-comp",
    "brandName": "Marbopet® 82,5 mg Comprimidos Palatáveis (Ceva)",
    "activePrinciple": "Marbofloxacino",
    "manufacturer": "Ceva",
    "category": "Antimicrobiano Fluoroquinolona 3ª Geração",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.75
    },
    "doseRangeText": "2,75 mg/kg uma vez ao dia para cães grandes",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 82.5,
    "tabletsPerBox": 10
  },
  {
    "id": "marbocyl-p-5-comp",
    "brandName": "Marbocyl® P 5 mg Comprimidos (Vetoquinol)",
    "activePrinciple": "Marbofloxacino",
    "manufacturer": "Vetoquinol",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 2
    },
    "doseRangeText": "2 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 10
  },
  {
    "id": "marbocyl-p-20-comp",
    "brandName": "Marbocyl® P 20 mg Comprimidos (Vetoquinol)",
    "activePrinciple": "Marbofloxacino",
    "manufacturer": "Vetoquinol",
    "category": "Antimicrobiano Fluoroquinolona",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 10
  },
  {
    "id": "marbocyl-inj-10",
    "brandName": "Marbocyl® Injetável 10% (Vetoquinol)",
    "activePrinciple": "Marbofloxacino",
    "manufacturer": "Vetoquinol",
    "category": "Antimicrobiano Fluoroquinolona Injetável",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 50 mL",
    "species": [
      "Bovino",
      "Suíno",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "10% = 100 mg/mL. 2 mg/kg IV, IM ou SC",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetoquinol. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "percentage": 10,
    "bottleVolumeMl": 50
  },
  {
    "id": "giardicid-susp-50",
    "brandName": "Giardicid® Suspensão Oral 50 mg/mL (Cepav)",
    "activePrinciple": "Metronidazol + Sulfadimetoxina",
    "manufacturer": "Cepav",
    "category": "Antiprotozoário e Antimicrobiano Giardicida",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL com seringa dosadora",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 25,
      "felino": 25
    },
    "doseRangeText": "0,5 mL/kg a cada 12 horas (BID) por 5 dias consecutivos",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Excelente palatabilidade e associação sinérgica consagrada no tratamento de Giardia e coccidiose.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 50,
    "bottleVolumeMl": 50
  },
  {
    "id": "flagyl-pediatrico-40",
    "brandName": "Flagyl® Pediátrico Suspensão Oral 40 mg/mL (Sanofi)",
    "activePrinciple": "Benzoilmetronidazol",
    "manufacturer": "Sanofi",
    "category": "Antiprotozoário e Antianaeróbio",
    "formType": "liquid",
    "presentationText": "Frasco com 120 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 15,
      "felino": 15
    },
    "doseRangeText": "10 a 25 mg/kg a cada 12 horas por 5 a 7 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Sanofi. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 120
  },
  {
    "id": "metronidazol-bolsa-05",
    "brandName": "Metronidazol Solução para Infusão 5 mg/mL (0,5%) (Isofarma)",
    "activePrinciple": "Metronidazol",
    "manufacturer": "Isofarma",
    "category": "Antimicrobiano Antianaeróbio Hospitalar",
    "formType": "liquid",
    "presentationText": "Bolsa de 100 mL para infusão intravenosa",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "10 a 15 mg/kg em infusão IV lenta (correr em 30 a 60 min) a cada 12h",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Infusão intravenosa lenta obrigatória. Nunca administrar em bolus rápido devido a risco de neurotoxicidade.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "bottleVolumeMl": 100
  },
  {
    "id": "stomorgyl-2-comp",
    "brandName": "Stomorgyl® 2 Comprimidos (Boehringer Ingelheim)",
    "activePrinciple": "Espiramicina + Metronidazol",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antimicrobiano Odontológico",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 comprimido para cada 2 kg de peso vivo a cada 24 horas por 5 a 10 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Associação de referência para doença periodontal, gengivites e estomatites bacterianas.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2,
    "tabletsPerBox": 20
  },
  {
    "id": "stomorgyl-10-comp",
    "brandName": "Stomorgyl® 10 Comprimidos (Boehringer Ingelheim)",
    "activePrinciple": "Espiramicina + Metronidazol",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antimicrobiano Odontológico",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 comprimido para cada 10 kg de peso vivo a cada 24 horas",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 20
  },
  {
    "id": "stomorgyl-20-comp",
    "brandName": "Stomorgyl® 20 Comprimidos (Boehringer Ingelheim)",
    "activePrinciple": "Espiramicina + Metronidazol",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antimicrobiano Odontológico",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 comprimido para cada 20 kg de peso a cada 24 horas",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 10
  },
  {
    "id": "clindabac-50-comp",
    "brandName": "Clindabac® 50 mg Comprimidos (Ceva)",
    "activePrinciple": "Clindamicina",
    "manufacturer": "Ceva",
    "category": "Antimicrobiano Lincosamida",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5.5,
      "felino": 5.5
    },
    "doseRangeText": "5,5 mg/kg a cada 12 horas ou 11 mg/kg a cada 24 horas por 7 a 28 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Excelente penetração óssea (osteomielites), tecidos moles, abscessos profundos e toxoplasmose felina.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "clindabac-150-comp",
    "brandName": "Clindabac® 150 mg Comprimidos (Ceva)",
    "activePrinciple": "Clindamicina",
    "manufacturer": "Ceva",
    "category": "Antimicrobiano Lincosamida",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5.5
    },
    "doseRangeText": "5,5 mg/kg BID ou 11 mg/kg SID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 150,
    "tabletsPerBox": 10
  },
  {
    "id": "clindabac-300-comp",
    "brandName": "Clindabac® 300 mg Comprimidos (Ceva)",
    "activePrinciple": "Clindamicina",
    "manufacturer": "Ceva",
    "category": "Antimicrobiano Lincosamida",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 11
    },
    "doseRangeText": "11 mg/kg SID para cães grandes",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 300,
    "tabletsPerBox": 10
  },
  {
    "id": "antirobe-gotas-25",
    "brandName": "Antirobe® Gotas Aquadrops 25 mg/mL (Dechra)",
    "activePrinciple": "Cloridrato de Clindamicina",
    "manufacturer": "Dechra",
    "category": "Antimicrobiano Lincosamida Solução Oral",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5.5,
      "felino": 5.5
    },
    "doseRangeText": "25 mg/mL (1 mL para cada 4,5 kg). 5,5 mg/kg a cada 12h",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Dechra. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 25,
    "bottleVolumeMl": 20
  },
  {
    "id": "clindamicina-inj-150",
    "brandName": "Clindamicina Injetável 150 mg/mL (Cristália)",
    "activePrinciple": "Fosfato de Clindamicina",
    "manufacturer": "Cristália",
    "category": "Antimicrobiano Lincosamida Hospitalar",
    "formType": "liquid",
    "presentationText": "Ampola de 4 mL (600 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "10 mg/kg IV lenta em infusão a cada 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 150,
    "bottleVolumeMl": 4
  },
  {
    "id": "zitrex-100-comp",
    "brandName": "Zitrex® 100 mg Comprimidos (Agener União)",
    "activePrinciple": "Azitromicina",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Macrolídeo Azalídeo",
    "formType": "tablet",
    "presentationText": "Cartucho com 6 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "5 a 10 mg/kg a cada 24 horas por 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 6
  },
  {
    "id": "zitrex-250-comp",
    "brandName": "Zitrex® 250 mg Comprimidos (Agener União)",
    "activePrinciple": "Azitromicina",
    "manufacturer": "Agener União",
    "category": "Antimicrobiano Macrolídeo Azalídeo",
    "formType": "tablet",
    "presentationText": "Cartucho com 6 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 10
    },
    "doseRangeText": "10 mg/kg SID por 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 250,
    "tabletsPerBox": 6
  },
  {
    "id": "azitromicina-vansil-100",
    "brandName": "Azitromicina Vansil® 100 mg Comprimidos (Vansil)",
    "activePrinciple": "Azitromicina",
    "manufacturer": "Vansil",
    "category": "Antimicrobiano Macrolídeo",
    "formType": "tablet",
    "presentationText": "Cartucho com 6 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "10 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vansil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 6
  },
  {
    "id": "azitromicina-susp-40",
    "brandName": "Azitromicina Suspensão Oral 40 mg/mL (Medley)",
    "activePrinciple": "Azitromicina Di-hidratada",
    "manufacturer": "Medley",
    "category": "Antimicrobiano Macrolídeo Líquido",
    "formType": "liquid",
    "presentationText": "Frasco com pó para 15 mL de suspensão (600 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "40 mg/mL (1 mL para cada 4 kg). 10 mg/kg SID por 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Medley. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 15
  },
  {
    "id": "trissulfin-inj-ouro",
    "brandName": "Trissulfin® Injetável (Ourofino)",
    "activePrinciple": "Sulfadiazina + Trimetoprima",
    "manufacturer": "Ourofino",
    "category": "Antimicrobiano Quimioterápico Potencializado",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 50 mL",
    "species": [
      "Canino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 15
    },
    "doseRangeText": "160 mg Sulfa + 32 mg TMP por mL (total 192 mg/mL). 15 a 30 mg/kg combinados SC, IM ou IV SID a BID",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 192,
    "bottleVolumeMl": 50
  },
  {
    "id": "trissulfin-comp-ouro",
    "brandName": "Trissulfin® Comprimidos (Ourofino)",
    "activePrinciple": "Sulfadiazina + Trimetoprima",
    "manufacturer": "Ourofino",
    "category": "Antimicrobiano Quimioterápico Potencializado",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "400 mg Sulfa + 80 mg TMP (480 mg total). 15 a 30 mg/kg a cada 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 480,
    "tabletsPerBox": 10
  },
  {
    "id": "chemiprim-inj-50",
    "brandName": "Chemiprim® Injetável (Chemitec)",
    "activePrinciple": "Sulfadiazina + Trimetoprima",
    "manufacturer": "Chemitec",
    "category": "Antimicrobiano Quimioterápico Potencializado",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 50 mL",
    "species": [
      "Canino",
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "200 mg Sulfa + 40 mg TMP por mL (240 mg/mL). 15 a 24 mg/kg IV ou IM",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 240,
    "bottleVolumeMl": 50
  },
  {
    "id": "gentocin-inj-40",
    "brandName": "Gentocin® Injetável 40 mg/mL (MSD Saúde Animal)",
    "activePrinciple": "Sulfato de Gentamicina",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Aminoglicosídeo",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 20 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 4
    },
    "doseRangeText": "Cães: 5 a 8 mg/kg IV ou SC em dose única diária (SID) | Gatos: 4 a 5 mg/kg SID por até 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Monitorar função renal (creatinina/urinálise). Dose única diária (SID) reduz nefrotoxicidade.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 20
  },
  {
    "id": "chemimicina-inj-40",
    "brandName": "Chemimicina® Injetável 40 mg/mL (Chemitec)",
    "activePrinciple": "Sulfato de Gentamicina",
    "manufacturer": "Chemitec",
    "category": "Antimicrobiano Aminoglicosídeo",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Canino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 a 8 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 50
  },
  {
    "id": "amicacina-cristalia-250",
    "brandName": "Amicacina Injetável 250 mg/mL (Cristália)",
    "activePrinciple": "Sulfato de Amicacina",
    "manufacturer": "Cristália",
    "category": "Antimicrobiano Aminoglicosídeo Hospitalar",
    "formType": "liquid",
    "presentationText": "Ampola com 2 mL (500 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 15,
      "felino": 10
    },
    "doseRangeText": "Cães: 15 a 20 mg/kg IV ou SC a cada 24 horas (SID) | Gatos: 10 a 15 mg/kg SID por 3 a 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Aminoglicosídeo de espectro mais potente para bactérias gram-negativas multirresistentes (Pseudomonas).",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 250,
    "bottleVolumeMl": 2
  },
  {
    "id": "terramicina-mais-50",
    "brandName": "Terramicina® Mais Injetável (Zoetis)",
    "activePrinciple": "Oxitetraciclina + Diclofenaco",
    "manufacturer": "Zoetis",
    "category": "Antimicrobiano LA & Anti-inflamatório",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 50 mL",
    "species": [
      "Bovino",
      "Suíno",
      "Ovino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "200 mg oxitetraciclina + 10 mg diclofenaco por mL. 1 mL para cada 10 kg IM profunda",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 200,
    "bottleVolumeMl": 50
  },
  {
    "id": "ourotetra-la-50",
    "brandName": "Ourotetra LA® Injetável 200 mg/mL (Ourofino)",
    "activePrinciple": "Oxitetraciclina Longa Ação",
    "manufacturer": "Ourofino",
    "category": "Antimicrobiano Tetraciclina de Longa Ação",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Bovino",
      "Ovino",
      "Suíno"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "20 mg/kg IM profunda (1 mL para cada 10 kg de peso vivo)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 200,
    "bottleVolumeMl": 50
  },
  {
    "id": "nuflor-inj-300",
    "brandName": "Nuflor® Injetável 300 mg/mL (MSD Saúde Animal)",
    "activePrinciple": "Florfenicol",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Fenicol de Amplo Espectro",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 100 mL",
    "species": [
      "Bovino",
      "Suíno"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "20 mg/kg IM a cada 48h ou 40 mg/kg SC dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 300,
    "bottleVolumeMl": 100
  },
  {
    "id": "maxflor-inj-300",
    "brandName": "Maxflor® Injetável 300 mg/mL (Ourofino)",
    "activePrinciple": "Florfenicol",
    "manufacturer": "Ourofino",
    "category": "Antimicrobiano Fenicol",
    "formType": "liquid",
    "presentationText": "Frasco com 100 mL",
    "species": [
      "Bovino",
      "Suíno"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "20 mg/kg IM a cada 48h ou 40 mg/kg SC dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 300,
    "bottleVolumeMl": 100
  },
  {
    "id": "micotil-inj-300",
    "brandName": "Micotil® Injetável 300 mg/mL (Elanco)",
    "activePrinciple": "Tilmicosina",
    "manufacturer": "Elanco",
    "category": "Antimicrobiano Macrolídeo Específico para Bovinos",
    "formType": "liquid",
    "presentationText": "Frasco com 100 mL",
    "species": [
      "Bovino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "10 mg/kg SC dose única exclusivamente (1 mL para cada 30 kg de peso)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "ATENÇÃO: Uso exclusivo bovino por via SC. Letal para equinos, suínos e primatas por cardiotoxicidade.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 300,
    "bottleVolumeMl": 100
  },
  {
    "id": "penfort-ppu-50",
    "brandName": "Penfort PPU® Injetável Pronto para Uso (Zoetis)",
    "activePrinciple": "Benzilpenicilina Procaína + Potássica + Estreptomicina",
    "manufacturer": "Zoetis",
    "category": "Antimicrobiano Penicilânico Associação",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Equino",
      "Bovino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20000
    },
    "doseRangeText": "Cães: 20.000 a 40.000 UI/kg IM ou SC a cada 24 a 48h | Grandes: 1 mL para cada 25 kg",
    "defaultFrequency": "SID",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 250,
    "bottleVolumeMl": 50
  },
  {
    "id": "pencivet-plus-50",
    "brandName": "Pencivet Plus PPU® Injetável (MSD Saúde Animal)",
    "activePrinciple": "Benzilpenicilina + Estreptomicina",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antimicrobiano Penicilânico Associação",
    "formType": "liquid",
    "presentationText": "Frasco-ampola de 50 mL",
    "species": [
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 mL para cada 20-30 kg de peso vivo via IM profunda",
    "defaultFrequency": "SID",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 250,
    "bottleVolumeMl": 50
  },
  {
    "id": "agrovet-5-milhoes",
    "brandName": "Agrovet 5 Milhões® PPU Injetável (Ourofino)",
    "activePrinciple": "Benzilpenicilina Procaína + Potássica",
    "manufacturer": "Ourofino",
    "category": "Antimicrobiano Penicilânico",
    "formType": "liquid",
    "presentationText": "Frasco com suspensão pronta para uso de 50 mL",
    "species": [
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 mL para cada 25 kg IM profunda",
    "defaultFrequency": "SID",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 200,
    "bottleVolumeMl": 50
  },
  {
    "id": "dorless-comp-12",
    "brandName": "Dorless® 12 mg Comprimidos (Syntec)",
    "activePrinciple": "Cloridrato de Tramadol",
    "manufacturer": "Syntec",
    "category": "Analgésico Opioide",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 a 4 mg/kg a cada 8 horas (TID)",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 12,
    "tabletsPerBox": 10
  },
  {
    "id": "dorless-comp-50",
    "brandName": "Dorless® 50 mg Comprimidos (Syntec)",
    "activePrinciple": "Cloridrato de Tramadol",
    "manufacturer": "Syntec",
    "category": "Analgésico Opioide",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 a 4 mg/kg TID",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "dorless-inj-50",
    "brandName": "Dorless® Injetável 5% (Syntec)",
    "activePrinciple": "Cloridrato de Tramadol",
    "manufacturer": "Syntec",
    "category": "Analgésico Opioide Injetável",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1.5
    },
    "doseRangeText": "5% = 50 mg/mL. Cães: 2 a 4 mg/kg IV, IM ou SC | Gatos: 1 a 2 mg/kg IV ou SC a cada 8-12h",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 50,
    "percentage": 5,
    "bottleVolumeMl": 20
  },
  {
    "id": "dimorf-inj-02",
    "brandName": "Dimorf® Injetável 0,2 mg/mL sem conservante (Cristália)",
    "activePrinciple": "Sulfato de Morfina",
    "manufacturer": "Cristália",
    "category": "Analgésico Opioide Potente Peridural",
    "formType": "liquid",
    "presentationText": "Ampola de 1 mL estéril sem conservante",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.1,
      "felino": 0.1
    },
    "doseRangeText": "Analgesia peridural / espinhal: 0,1 mg/kg em dose única pré-operatória",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Peridural",
    "clinicalNotes": "Formulação sem conservante indicada exclusivamente para anestesia e analgesia peridural e intratecal.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.2,
    "bottleVolumeMl": 1
  },
  {
    "id": "dimorf-inj-10",
    "brandName": "Dimorf® Injetável 10 mg/mL (Cristália)",
    "activePrinciple": "Sulfato de Morfina",
    "manufacturer": "Cristália",
    "category": "Analgésico Opioide Puro Agonista Mu",
    "formType": "liquid",
    "presentationText": "Ampola de 1 mL (10 mg/mL)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.1
    },
    "doseRangeText": "Cães: 0,2 a 0,5 mg/kg IM ou SC a cada 4h (ou infusão contínua 0,1 a 0,2 mg/kg/h) | Gatos: 0,05 a 0,1 mg/kg",
    "defaultFrequency": "QID",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Agonista mu puro de referência para dor aguda moderada a grave. Pode liberar histamina se injetado IV rápido.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 1
  },
  {
    "id": "dimorf-solucao-10mg",
    "brandName": "Dimorf® Solução Oral 10 mg/mL (Cristália)",
    "activePrinciple": "Sulfato de Morfina",
    "manufacturer": "Cristália",
    "category": "Analgésico Opioide Puro",
    "formType": "liquid",
    "presentationText": "Frasco com 60 mL com conta-gotas graduado",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1 mg/kg VO a cada 6 a 8 horas",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 60
  },
  {
    "id": "fentanest-inj-50mcg",
    "brandName": "Fentanest® Injetável 50 mcg/mL (0,05 mg/mL) (Cristália)",
    "activePrinciple": "Citrato de Fentanila",
    "manufacturer": "Cristália",
    "category": "Analgésico Opioide Agonista Mu Potente UTI",
    "formType": "liquid",
    "presentationText": "Ampola de 5 mL (250 mcg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.005,
      "felino": 0.003
    },
    "doseRangeText": "Bolus pré-medicação: 2 a 5 mcg/kg IV | Infusão Contínua (CRI): 2 a 10 mcg/kg/h (0,002 a 0,01 mg/kg/h)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Opioide potente de ação rápida (início 1-2 min, duração 20-30 min). Padrão ouro em infusão contínua intraoperatória e UTI.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.05,
    "bottleVolumeMl": 5
  },
  {
    "id": "mytedom-comp-5",
    "brandName": "Mytedom® 5 mg Comprimidos (Cristália)",
    "activePrinciple": "Cloridrato de Metadona",
    "manufacturer": "Cristália",
    "category": "Analgésico Opioide Puro",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.3
    },
    "doseRangeText": "0,2 a 0,4 mg/kg VO a cada 8 a 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 20
  },
  {
    "id": "mytedom-comp-10",
    "brandName": "Mytedom® 10 mg Comprimidos (Cristália)",
    "activePrinciple": "Cloridrato de Metadona",
    "manufacturer": "Cristália",
    "category": "Analgésico Opioide Puro",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.3
    },
    "doseRangeText": "0,2 a 0,4 mg/kg VO a cada 8 a 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 20
  },
  {
    "id": "torbugesic-inj-10",
    "brandName": "Torbugesic® Injetável 10 mg/mL (1%) (Zoetis)",
    "activePrinciple": "Tartarato de Butorfanol",
    "manufacturer": "Zoetis",
    "category": "Analgésico Opioide Agonista-Antagonista",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 10 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.2
    },
    "doseRangeText": "Cães e Gatos: 0,1 a 0,4 mg/kg IV, IM ou SC a cada 2 a 4h | Equinos: 0,05 a 0,1 mg/kg IV",
    "defaultFrequency": "QID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Agonista kappa e antagonista mu. Excelente sedativo em neuroleptoanalgesia associado a acepromazina ou alfa-2 agonistas.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 10
  },
  {
    "id": "temgesic-inj-03",
    "brandName": "Temgesic® Injetável 0,3 mg/mL (Cristália)",
    "activePrinciple": "Cloridrato de Buprenorfina",
    "manufacturer": "Cristália",
    "category": "Analgésico Opioide Agonista Parcial",
    "formType": "liquid",
    "presentationText": "Ampola com 1 mL (0,3 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.02,
      "felino": 0.02
    },
    "doseRangeText": "Cães: 0,01 a 0,02 mg/kg IV, IM ou SC a cada 8h | Gatos: 0,01 a 0,03 mg/kg transmucosa oral (OTM) a cada 8 a 12h",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Excelente absorção transmucosa oral (OTM) em felinos devido ao pH favorável da cavidade oral do gato.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.3,
    "bottleVolumeMl": 1
  },
  {
    "id": "narcan-inj-04",
    "brandName": "Narcan® Injetável 0,4 mg/mL (Cristália)",
    "activePrinciple": "Cloridrato de Naloxona",
    "manufacturer": "Cristália",
    "category": "Antagonista Opioide Puro de Emergência",
    "formType": "liquid",
    "presentationText": "Ampola com 1 mL (0,4 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.04,
      "felino": 0.04
    },
    "doseRangeText": "0,02 a 0,04 mg/kg IV, IM ou endotraqueal para reversão imediata de depressão respiratória por opioides",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Antídoto de reversão rápida de opioides puros em caso de depressão respiratória ou sobredose acidental.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.4,
    "bottleVolumeMl": 1
  },
  {
    "id": "propovan-inj-10",
    "brandName": "Propovan® 10 mg/mL (1%) Emulsão Injetável (Cristália)",
    "activePrinciple": "Propofol",
    "manufacturer": "Cristália",
    "category": "Anestésico Geral Indutor Não Barbitúrico",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 4,
      "felino": 5
    },
    "doseRangeText": "Indução: 3 a 6 mg/kg IV efeito-dependente (titular lentamente em 60-90 segundos) | Manutenção CRI: 0,1 a 0,4 mg/kg/min",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Indução rápida e suave com despertar límpido. Não contém conservante antibacteriano (descartar sobras do frasco aberto).",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 20
  },
  {
    "id": "diprivan-inj-10",
    "brandName": "Diprivan® 10 mg/mL (1%) Emulsão Injetável (Aspen Pharma)",
    "activePrinciple": "Propofol com EDTA",
    "manufacturer": "Aspen Pharma",
    "category": "Anestésico Geral Indutor",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 4,
      "felino": 5
    },
    "doseRangeText": "3 a 6 mg/kg IV lento titulado até perda do reflexo laringotraqueal",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Aspen Pharma. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 20
  },
  {
    "id": "vetaset-inj-100",
    "brandName": "Vetaset® Injetável 100 mg/mL (10%) (Zoetis)",
    "activePrinciple": "Cloridrato de Cetamina",
    "manufacturer": "Zoetis",
    "category": "Anestésico Geral Dissociativo",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 10 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 10
    },
    "doseRangeText": "Indução cães: 5 mg/kg IV (associada a benzodiazepínico) | Gatos: 5 a 15 mg/kg IM ou IV | Analgesia infusão CRI: 0,1 a 0,6 mg/kg/h",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Anestésico dissociativo clássico. Preserva reflexos protetores faríngeos. Associar sempre a relaxante muscular.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "percentage": 10,
    "bottleVolumeMl": 10
  },
  {
    "id": "cetamin-syntec-100",
    "brandName": "Cetamin® Injetável 100 mg/mL (Syntec)",
    "activePrinciple": "Cloridrato de Cetamina",
    "manufacturer": "Syntec",
    "category": "Anestésico Geral Dissociativo",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 10 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 10
    },
    "doseRangeText": "5 a 10 mg/kg IV ou IM",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 10
  },
  {
    "id": "dopalen-inj-100",
    "brandName": "Dopalen® Injetável 100 mg/mL (10%) (Ceva)",
    "activePrinciple": "Cloridrato de Cetamina",
    "manufacturer": "Ceva",
    "category": "Anestésico Geral Dissociativo",
    "formType": "liquid",
    "presentationText": "Frasco com 10 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 10
    },
    "doseRangeText": "5 a 10 mg/kg",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "percentage": 10,
    "bottleVolumeMl": 10
  },
  {
    "id": "zoletil-50-inj",
    "brandName": "Zoletil 50® Injetável (Virbac)",
    "activePrinciple": "Tiletamina + Zolazepam",
    "manufacturer": "Virbac",
    "category": "Anestésico Dissociativo Associação",
    "formType": "liquid",
    "presentationText": "Frasco com liofilizado (250 mg Tiletamina + 250 mg Zolazepam) + diluente 5 mL (100 mg/mL)",
    "species": [
      "Canino",
      "Felino",
      "Silvestres"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 7
    },
    "doseRangeText": "Cães: 3 a 7 mg/kg IM ou 2 a 5 mg/kg IV | Gatos: 5 a 10 mg/kg IM ou IV",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Associação potente e confiável para contenção química e anestesia rápida de pequenos animais e animais silvestres.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 5
  },
  {
    "id": "dormire-inj-5mg",
    "brandName": "Dormire® Injetável 5 mg/mL (Cristália)",
    "activePrinciple": "Maleato de Midazolam",
    "manufacturer": "Cristália",
    "category": "Sedativo Benzodiazepínico & Miorrelaxante",
    "formType": "liquid",
    "presentationText": "Ampola com 3 mL (15 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.3,
      "felino": 0.3
    },
    "doseRangeText": "0,2 a 0,5 mg/kg IV, IM ou intranasal",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Hidrossolúvel, não causa dor à injeção intramuscular. Excelente miorrelaxamento e estabilidade cardiovascular.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "bottleVolumeMl": 3
  },
  {
    "id": "compaz-inj-5mg",
    "brandName": "Compaz® Injetável 5 mg/mL (Cristália)",
    "activePrinciple": "Diazepam",
    "manufacturer": "Cristália",
    "category": "Sedativo Benzodiazepínico & Anticonvulsivante",
    "formType": "liquid",
    "presentationText": "Ampola com 2 mL (10 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "Crise convulsiva: 0,5 a 1 mg/kg IV lento ou intra-retal | Pré-anestesia: 0,2 a 0,5 mg/kg IV",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Veículo com propilenoglicol (não administrar IM por absorção errática e dor; na veia aplicar lentamente).",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "bottleVolumeMl": 2
  },
  {
    "id": "valium-comp-10",
    "brandName": "Valium® 10 mg Comprimidos (Roche)",
    "activePrinciple": "Diazepam",
    "manufacturer": "Roche",
    "category": "Benzodiazepínico Oral",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1 mg/kg VO a cada 8 horas (evitar uso oral crônico em felinos devido a necrose hepática fulminante)",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Roche. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 20
  },
  {
    "id": "acepran-gotas-02-alt",
    "brandName": "Acepran® Gotas 0,2% (Vetnil)",
    "activePrinciple": "Acepromazina",
    "manufacturer": "Vetnil",
    "category": "Tranquilizante Fenotiazínico",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas com 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.05,
      "felino": 0.05
    },
    "doseRangeText": "0,2% = 2 mg/mL (1 gota = 0,1 mg). 0,05 a 0,1 mg/kg VO (1 gota para cada 1-2 kg)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 2,
    "percentage": 0.2,
    "bottleVolumeMl": 20
  },
  {
    "id": "acepran-inj-10-alt",
    "brandName": "Acepran® Injetável 1% (Vetnil)",
    "activePrinciple": "Acepromazina",
    "manufacturer": "Vetnil",
    "category": "Tranquilizante Fenotiazínico Injetável",
    "formType": "liquid",
    "presentationText": "Frasco com 20 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.03,
      "felino": 0.03
    },
    "doseRangeText": "1% = 10 mg/mL. Cães e Gatos: 0,02 a 0,05 mg/kg IM, SC ou IV lento",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Causa vasodilatação periférica por bloqueio alfa-1 (não utilizar em animais hipotensos, hipovolêmicos ou em choque).",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 20
  },
  {
    "id": "xilazin-syntec-20",
    "brandName": "Xilazin® Injetável 2% (Syntec)",
    "activePrinciple": "Cloridrato de Xilazina",
    "manufacturer": "Syntec",
    "category": "Sedativo Alfa-2 Agonista & Miorrelaxante",
    "formType": "liquid",
    "presentationText": "Frasco com 20 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "2% = 20 mg/mL. Cães: 1 a 2 mg/kg IM ou 0,5 a 1 mg/kg IV | Gatos: 1 a 2 mg/kg IM | Equinos: 0,5 a 1,1 mg/kg IV",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 20,
    "percentage": 2,
    "bottleVolumeMl": 20
  },
  {
    "id": "sedomin-konig-20",
    "brandName": "Sedomin® Injetável 2% (König)",
    "activePrinciple": "Cloridrato de Xilazina",
    "manufacturer": "König",
    "category": "Sedativo Alfa-2 Agonista",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Canino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 a 2 mg/kg IM ou 0,5 a 1 mg/kg IV",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório König. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 20,
    "percentage": 2,
    "bottleVolumeMl": 20
  },
  {
    "id": "sileo-gel-01",
    "brandName": "Sileo® Gel Oromucosal 0,1 mg/mL (Zoetis)",
    "activePrinciple": "Cloridrato de Dexmedetomidina",
    "manufacturer": "Zoetis",
    "category": "Ansiolítico Auricular e Oromucosal",
    "formType": "paste",
    "presentationText": "Seringa dosadora de 3 mL com escala por pontos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.001
    },
    "doseRangeText": "125 mcg/m² administrado na mucosa oral (entre a bochecha e gengiva) para aversão a ruídos e fogos",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Absorção exclusiva transmucosa oromucosal (não deve ser deglutido, aplicar na mucosa jugal).",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.1,
    "bottleVolumeMl": 3
  },
  {
    "id": "antisedan-inj-5mg",
    "brandName": "Antisedan® Injetável 5 mg/mL (Zoetis)",
    "activePrinciple": "Cloridrato de Atipamezol",
    "manufacturer": "Zoetis",
    "category": "Antagonista Alfa-2 Seletivo (Reversor)",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 10 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25,
      "felino": 0.25
    },
    "doseRangeText": "Reversão de dexmedetomidina: mesmo volume do Dexdomitor aplicado (dose 5 vezes maior em mg) via IM",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Reversor específico de alta afinidade para alfa-2 agonistas (dexmedetomidina e medetomidina).",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "bottleVolumeMl": 10
  },
  {
    "id": "isoforine-frasco-240",
    "brandName": "Isoforine® Frasco 240 mL (Cristália)",
    "activePrinciple": "Isoflurano",
    "manufacturer": "Cristália",
    "category": "Anestésico Geral Inalatório Líquido Volátil",
    "formType": "liquid",
    "presentationText": "Frasco de vidro âmbar com 240 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "CAM cão 1,3% | CAM gato 1,6%. Indução com vaporizador em 2 a 3% e manutenção em 1,5 a 2%",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Inalatória",
    "clinicalNotes": "Anestésico volátil de rápida indução e recuperação, metabolização hepática mínima (<0,2%).",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 240
  },
  {
    "id": "sevocris-frasco-250",
    "brandName": "Sevocris® Frasco 250 mL (Cristália)",
    "activePrinciple": "Sevoflurano",
    "manufacturer": "Cristália",
    "category": "Anestésico Geral Inalatório",
    "formType": "liquid",
    "presentationText": "Frasco de 250 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "CAM cão 2,3% | CAM gato 2,6%. Indução 3 a 5% e manutenção 2,5 a 3,5%",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Inalatória",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 250
  },
  {
    "id": "cerenia-comp-160",
    "brandName": "Cerenia® 160 mg Comprimidos (Zoetis)",
    "activePrinciple": "Citrato de Maropitant",
    "manufacturer": "Zoetis",
    "category": "Antiemético Antagonista NK1",
    "formType": "tablet",
    "presentationText": "Cartucho com 4 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "Êmese geral: 2 mg/kg SID | Prevenção de cinetose (enjoo de viagem): 8 mg/kg 2h antes da viagem",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 160,
    "tabletsPerBox": 4
  },
  {
    "id": "emedron-comp-4",
    "brandName": "Emedron® 4 mg Comprimidos (Agener União)",
    "activePrinciple": "Cloridrato de Ondansetrona",
    "manufacturer": "Agener União",
    "category": "Antiemético Antagonista 5-HT3",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,3 a 0,5 mg/kg a cada 8 a 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 4,
    "tabletsPerBox": 10
  },
  {
    "id": "plasil-gotas-4mg",
    "brandName": "Plasil® Gotas Pediátrico 4 mg/mL (Sanofi)",
    "activePrinciple": "Cloridrato de Metoclopramida",
    "manufacturer": "Sanofi",
    "category": "Antiemético & Procinético Gástrico",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas com 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.3,
      "felino": 0.3
    },
    "doseRangeText": "0,2 a 0,5 mg/kg (1 a 2 gotas por kg) a cada 8 horas (TID)",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Sanofi. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 4,
    "bottleVolumeMl": 20
  },
  {
    "id": "plasil-inj-5mg",
    "brandName": "Plasil® Injetável 5 mg/mL (Sanofi)",
    "activePrinciple": "Cloridrato de Metoclopramida",
    "manufacturer": "Sanofi",
    "category": "Antiemético & Procinético Injetável",
    "formType": "liquid",
    "presentationText": "Ampola com 2 mL (10 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.3,
      "felino": 0.3
    },
    "doseRangeText": "0,2 a 0,5 mg/kg SC, IM ou infusão contínua CRI (1 a 2 mg/kg/dia) a cada 8h",
    "defaultFrequency": "TID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Ação antiemética central e procinética periférica (aumenta tônus do esfíncter esofágico inferior).",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "bottleVolumeMl": 2
  },
  {
    "id": "gaviz-v-comp-10",
    "brandName": "Gaviz V® 10 mg Comprimidos Gastrorresistentes (Agener União)",
    "activePrinciple": "Omeprazol",
    "manufacturer": "Agener União",
    "category": "Inibidor da Bomba de Prótons (IBP)",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos revestidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "0,7 a 1,5 mg/kg uma vez ao dia em jejum pela manhã",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Comprimido gastrorresistente. Administrar inteiro sem mastigar 30 a 60 min antes da refeição matinal.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 10
  },
  {
    "id": "gaviz-v-comp-20",
    "brandName": "Gaviz V® 20 mg Comprimidos Gastrorresistentes (Agener União)",
    "activePrinciple": "Omeprazol",
    "manufacturer": "Agener União",
    "category": "Inibidor da Bomba de Prótons (IBP)",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos revestidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 mg/kg SID em jejum",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 10
  },
  {
    "id": "omeprazol-cristalia-40",
    "brandName": "Omeprazol Sódico 40 mg Frasco-Ampola Injetável (Cristália)",
    "activePrinciple": "Omeprazol Sódico",
    "manufacturer": "Cristália",
    "category": "Inibidor da Bomba de Prótons Hospitalar",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 40 mg pó liofilizado + diluente",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 mg/kg IV lenta (em 5 a 10 min) a cada 12 a 24 horas para esofagite grave ou hemorragia digestiva",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 4,
    "bottleVolumeMl": 10
  },
  {
    "id": "pantoprazol-cristalia-40",
    "brandName": "Pantoprazol Sódico 40 mg Injetável IV (Cristália)",
    "activePrinciple": "Pantoprazol Sódico",
    "manufacturer": "Cristália",
    "category": "Inibidor da Bomba de Prótons Hospitalar",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 40 mg de pó liofilizado",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 mg/kg IV lenta a cada 12 a 24 horas",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 4,
    "bottleVolumeMl": 10
  },
  {
    "id": "antak-inj-25",
    "brandName": "Antak® Injetável 25 mg/mL (50 mg/2 mL) (GlaxoSmithKline (GSK))",
    "activePrinciple": "Cloridrato de Ranitidina",
    "manufacturer": "GlaxoSmithKline (GSK)",
    "category": "Antagonista de Receptores H2",
    "formType": "liquid",
    "presentationText": "Ampola com 2 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 2
    },
    "doseRangeText": "1 a 2 mg/kg IV lenta ou SC a cada 8 a 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório GlaxoSmithKline (GSK). Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 25,
    "bottleVolumeMl": 2
  },
  {
    "id": "sucrafilm-susp-200",
    "brandName": "Sucrafilm® Suspensão Oral 200 mg/mL (1 g/5 mL) (EMS)",
    "activePrinciple": "Sucralfato",
    "manufacturer": "EMS",
    "category": "Protetor de Mucosa Gástrica (Citoprotetor)",
    "formType": "liquid",
    "presentationText": "Frasco com 100 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 40,
      "felino": 40
    },
    "doseRangeText": "Cães pequenos e gatos: 250 a 500 mg VO TID | Cães médios e grandes: 1 a 2 g VO TID em jejum",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Forma camada protetora sobre úlceras em meio ácido. Espaçar em pelo menos 1-2h da administração de outros medicamentos.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 200,
    "bottleVolumeMl": 100
  },
  {
    "id": "duphalac-xarope-667",
    "brandName": "Duphalac® Xarope 667 mg/mL (Abbott)",
    "activePrinciple": "Lactulose",
    "manufacturer": "Abbott",
    "category": "Laxante Osmótico & Redutor de Amônia",
    "formType": "liquid",
    "presentationText": "Frasco com 120 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 333,
      "felino": 333
    },
    "doseRangeText": "Constipação: 0,5 mL/kg a cada 8-12h | Encefalopatia hepática: titular para 2-3 fezes pastosas ao dia",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Abbott. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 667,
    "bottleVolumeMl": 120
  },
  {
    "id": "luftal-gotas-75",
    "brandName": "Luftal® Gotas 75 mg/mL (Medley)",
    "activePrinciple": "Simeticona",
    "manufacturer": "Medley",
    "category": "Antiflatulento",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas com 15 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "1 gota/kg VO a cada 8 horas para alívio de gases e meteorismo",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Medley. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 75,
    "bottleVolumeMl": 15
  },
  {
    "id": "vetmedin-mast-125",
    "brandName": "Vetmedin® 1,25 mg Comprimidos Mastigáveis (Boehringer Ingelheim)",
    "activePrinciple": "Pimobendan",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Inodilatador Cardíaco",
    "formType": "tablet",
    "presentationText": "Frasco com 50 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,25 mg/kg a cada 12 horas (dose total diária 0,5 mg/kg) 1h antes da refeição",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Inodilatador de escolha para Insuficiência Cardíaca Congestiva (ICC) e Cardiomiopatia Dilatada (CMD).",
    "validationStatus": "VALIDADO",
    "tabletMg": 1.25,
    "tabletsPerBox": 50
  },
  {
    "id": "vetmedin-mast-25",
    "brandName": "Vetmedin® 2,5 mg Comprimidos Mastigáveis (Boehringer Ingelheim)",
    "activePrinciple": "Pimobendan",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Inodilatador Cardíaco",
    "formType": "tablet",
    "presentationText": "Frasco com 50 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,25 mg/kg BID em jejum",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2.5,
    "tabletsPerBox": 50
  },
  {
    "id": "vetmedin-mast-5",
    "brandName": "Vetmedin® 5,0 mg Comprimidos Mastigáveis (Boehringer Ingelheim)",
    "activePrinciple": "Pimobendan",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Inodilatador Cardíaco",
    "formType": "tablet",
    "presentationText": "Frasco com 50 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,25 mg/kg BID em jejum",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 50
  },
  {
    "id": "vetmedin-mast-10",
    "brandName": "Vetmedin® 10,0 mg Comprimidos Mastigáveis (Boehringer Ingelheim)",
    "activePrinciple": "Pimobendan",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Inodilatador Cardíaco",
    "formType": "tablet",
    "presentationText": "Frasco com 50 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,25 mg/kg BID para cães de grande porte",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 50
  },
  {
    "id": "pimocard-125-comp",
    "brandName": "Pimocard® 1,25 mg Comprimidos Palatáveis (Syntec)",
    "activePrinciple": "Pimobendan",
    "manufacturer": "Syntec",
    "category": "Inodilatador Cardíaco",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos palatáveis divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1.25,
    "tabletsPerBox": 30
  },
  {
    "id": "pimocard-25-comp",
    "brandName": "Pimocard® 2,5 mg Comprimidos Palatáveis (Syntec)",
    "activePrinciple": "Pimobendan",
    "manufacturer": "Syntec",
    "category": "Inodilatador Cardíaco",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos palatáveis divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2.5,
    "tabletsPerBox": 30
  },
  {
    "id": "pimocard-5-comp",
    "brandName": "Pimocard® 5,0 mg Comprimidos Palatáveis (Syntec)",
    "activePrinciple": "Pimobendan",
    "manufacturer": "Syntec",
    "category": "Inodilatador Cardíaco",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "0,25 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 30
  },
  {
    "id": "fortekor-flavor-25",
    "brandName": "Fortekor® Flavour 2,5 mg (Elanco)",
    "activePrinciple": "Cloridrato de Benazepril",
    "manufacturer": "Elanco",
    "category": "Inibidor da ECA (IECA)",
    "formType": "tablet",
    "presentationText": "Cartucho com 28 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,25 a 0,5 mg/kg uma vez ao dia para ICC e Doença Renal Crônica (DRC)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "IECA com dupla via de excreção (biliar e renal), ideal para pacientes nefropatas e cardiopatas.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2.5,
    "tabletsPerBox": 28
  },
  {
    "id": "fortekor-flavor-5",
    "brandName": "Fortekor® Flavour 5,0 mg (Elanco)",
    "activePrinciple": "Cloridrato de Benazepril",
    "manufacturer": "Elanco",
    "category": "Inibidor da ECA (IECA)",
    "formType": "tablet",
    "presentationText": "Cartucho com 28 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 28
  },
  {
    "id": "fortekor-flavor-20",
    "brandName": "Fortekor® Flavour 20,0 mg (Elanco)",
    "activePrinciple": "Cloridrato de Benazepril",
    "manufacturer": "Elanco",
    "category": "Inibidor da ECA (IECA)",
    "formType": "tablet",
    "presentationText": "Cartucho com 28 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 mg/kg SID para cães grandes",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 28
  },
  {
    "id": "cardalis-25-20",
    "brandName": "Cardalis® 2,5 mg / 20 mg Comprimidos (Ceva)",
    "activePrinciple": "Benazepril + Espironolactona",
    "manufacturer": "Ceva",
    "category": "Cardiologia Associação IECA + Antialdosterona",
    "formType": "tablet",
    "presentationText": "Frasco com 30 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "1 comprimido para cada 5 a 10 kg uma vez ao dia junto ao alimento",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Cálculo pelo benazepril (0,25 mg/kg, que corresponde a 2 mg/kg de espironolactona): 1 comprimido para cada 10 kg. Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2.5,
    "tabletsPerBox": 30
  },
  {
    "id": "cardalis-5-40",
    "brandName": "Cardalis® 5 mg / 40 mg Comprimidos (Ceva)",
    "activePrinciple": "Benazepril + Espironolactona",
    "manufacturer": "Ceva",
    "category": "Cardiologia Associação IECA + Antialdosterona",
    "formType": "tablet",
    "presentationText": "Frasco com 30 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "1 comprimido para cada 10 a 20 kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Cálculo pelo benazepril (0,25 mg/kg, que corresponde a 2 mg/kg de espironolactona): 1 comprimido para cada 20 kg. Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 30
  },
  {
    "id": "cardalis-10-80",
    "brandName": "Cardalis® 10 mg / 80 mg Comprimidos (Ceva)",
    "activePrinciple": "Benazepril + Espironolactona",
    "manufacturer": "Ceva",
    "category": "Cardiologia Associação IECA + Antialdosterona",
    "formType": "tablet",
    "presentationText": "Frasco com 30 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.25
    },
    "doseRangeText": "1 comprimido para cada 20 a 40 kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Cálculo pelo benazepril (0,25 mg/kg, que corresponde a 2 mg/kg de espironolactona): 1 comprimido para cada 40 kg. Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 30
  },
  {
    "id": "enalatrat-comp-5",
    "brandName": "Enalatrat® 5 mg Comprimidos (Agener União)",
    "activePrinciple": "Maleato de Enalapril",
    "manufacturer": "Agener União",
    "category": "Inibidor da ECA (IECA)",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 mg/kg a cada 12 a 24 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 30
  },
  {
    "id": "enalatrat-comp-10",
    "brandName": "Enalatrat® 10 mg Comprimidos (Agener União)",
    "activePrinciple": "Maleato de Enalapril",
    "manufacturer": "Agener União",
    "category": "Inibidor da ECA (IECA)",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 mg/kg a cada 12 a 24 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 30
  },
  {
    "id": "lasix-comp-40-alt",
    "brandName": "Lasix® 40 mg Comprimidos (Sanofi)",
    "activePrinciple": "Furosemida",
    "manufacturer": "Sanofi",
    "category": "Diurético de Alça",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1
    },
    "doseRangeText": "Cães: 1 a 4 mg/kg a cada 8 a 12h | Gatos: 1 a 2 mg/kg a cada 12 a 24h",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Sanofi. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 40,
    "tabletsPerBox": 20
  },
  {
    "id": "lasix-inj-10",
    "brandName": "Lasix® Injetável 10 mg/mL (20 mg/2 mL) (Sanofi)",
    "activePrinciple": "Furosemida",
    "manufacturer": "Sanofi",
    "category": "Diurético de Alça Emergencial",
    "formType": "liquid",
    "presentationText": "Ampola com 2 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 1
    },
    "doseRangeText": "Edema agudo de pulmão — Cães: 2 a 4 mg/kg | Gatos: 1 a 2 mg/kg, IV ou IM, repetindo a cada 1-2h até estabilização",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Sanofi. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 2
  },
  {
    "id": "furosemida-chemitec-40",
    "brandName": "Furosemida Chemitec® 40 mg Comprimidos (Chemitec)",
    "activePrinciple": "Furosemida",
    "manufacturer": "Chemitec",
    "category": "Diurético de Alça",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 a 4 mg/kg a cada 8 a 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 40,
    "tabletsPerBox": 20
  },
  {
    "id": "aldactone-comp-25",
    "brandName": "Aldactone® 25 mg Comprimidos (Pfizer)",
    "activePrinciple": "Espironolactona",
    "manufacturer": "Pfizer",
    "category": "Diurético Poupador de Potássio & Antialdosterona",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 a 2 mg/kg a cada 12 a 24 horas junto ao alimento",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Pfizer. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 25,
    "tabletsPerBox": 30
  },
  {
    "id": "amodip-felinos-125",
    "brandName": "Amodip® 1,25 mg Comprimidos Mastigáveis para Gatos (Ceva)",
    "activePrinciple": "Besilato de Amlodipina",
    "manufacturer": "Ceva",
    "category": "Bloqueador dos Canais de Cálcio & Anti-hipertensivo",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos palatáveis divisíveis",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 0.18
    },
    "doseRangeText": "Gatos: 0,625 mg a 1,25 mg por gato uma vez ao dia (ou 0,18 a 0,3 mg/kg SID)",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Anti-hipertensivo de primeira escolha em felinos com hipertensão sistêmica secundária a DRC ou hipertireoidismo.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1.25,
    "tabletsPerBox": 30
  },
  {
    "id": "atenolol-medley-25",
    "brandName": "Atenolol 25 mg Comprimidos (Medley)",
    "activePrinciple": "Atenolol",
    "manufacturer": "Medley",
    "category": "Betabloqueador Cardioseletivo Beta-1",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,25 a 1 mg/kg a cada 12 a 24 horas para estenose aórtica e cardiomiopatia hipertrófica felina",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Medley. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 25,
    "tabletsPerBox": 30
  },
  {
    "id": "manitol-halex-20",
    "brandName": "Manitol Solução Injetável 20% (Halex Istar)",
    "activePrinciple": "Manitol",
    "manufacturer": "Halex Istar",
    "category": "Diurético Osmótico & Redutor de PIC",
    "formType": "liquid",
    "presentationText": "Bolsa de 250 mL pronta para infusão",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 500,
      "felino": 500
    },
    "doseRangeText": "Hipertensão intracraniana e glaucoma agudo: 0,5 a 1,0 g/kg (2,5 a 5 mL/kg da solução 20%) IV em 20-30 min",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Halex Istar. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 200,
    "percentage": 20,
    "bottleVolumeMl": 250
  },
  {
    "id": "gardenal-comp-50",
    "brandName": "Gardenal® 50 mg Comprimidos (Sanofi)",
    "activePrinciple": "Fenobarbital",
    "manufacturer": "Sanofi",
    "category": "Anticonvulsivante Barbitúrico",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos divisíveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5,
      "felino": 2.5
    },
    "doseRangeText": "Dose inicial: 2,5 a 3 mg/kg a cada 12 horas (BID). Monitorar nível sérico após 14-21 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Anticonvulsivante de manutenção de primeira linha em cães e gatos. Requer monitoramento periódico de ALT/FA e dosagem sérica.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 20
  },
  {
    "id": "gardenal-comp-100",
    "brandName": "Gardenal® 100 mg Comprimidos (Sanofi)",
    "activePrinciple": "Fenobarbital",
    "manufacturer": "Sanofi",
    "category": "Anticonvulsivante Barbitúrico",
    "formType": "tablet",
    "presentationText": "Cartucho com 20 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "2,5 a 3 mg/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Sanofi. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 20
  },
  {
    "id": "gardenal-gotas-40",
    "brandName": "Gardenal® Gotas Pediátrico 40 mg/mL (Sanofi)",
    "activePrinciple": "Fenobarbital",
    "manufacturer": "Sanofi",
    "category": "Anticonvulsivante Gotas",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 20 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5,
      "felino": 2.5
    },
    "doseRangeText": "40 mg/mL (1 gota = 1 mg). 2,5 a 3 gotas/kg a cada 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Sanofi. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 20
  },
  {
    "id": "keppra-comp-250",
    "brandName": "Keppra® 250 mg Comprimidos Revestidos (UCB Biopharma)",
    "activePrinciple": "Levetiracetam",
    "manufacturer": "UCB Biopharma",
    "category": "Anticonvulsivante de Nova Geração",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 20,
      "felino": 20
    },
    "doseRangeText": "20 a 30 mg/kg a cada 8 horas (TID). Não sofre metabolismo hepático",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Excelente perfil de segurança, excreção renal inalterada sem sobrecarga hepática. Ideal para epilepsia refratária.",
    "validationStatus": "VALIDADO",
    "tabletMg": 250,
    "tabletsPerBox": 30
  },
  {
    "id": "keppra-comp-750",
    "brandName": "Keppra® 750 mg Comprimidos Revestidos (UCB Biopharma)",
    "activePrinciple": "Levetiracetam",
    "manufacturer": "UCB Biopharma",
    "category": "Anticonvulsivante de Nova Geração",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "20 a 30 mg/kg TID para cães grandes",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório UCB Biopharma. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 750,
    "tabletsPerBox": 30
  },
  {
    "id": "keppra-solucao-100",
    "brandName": "Keppra® Solução Oral 100 mg/mL (UCB Biopharma)",
    "activePrinciple": "Levetiracetam",
    "manufacturer": "UCB Biopharma",
    "category": "Anticonvulsivante Solução Oral",
    "formType": "liquid",
    "presentationText": "Frasco com 300 mL com seringa dosadora",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 20,
      "felino": 20
    },
    "doseRangeText": "100 mg/mL (0,2 a 0,3 mL/kg) a cada 8 horas (TID)",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório UCB Biopharma. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 300
  },
  {
    "id": "gabapentina-ems-300",
    "brandName": "Gabapentina 300 mg Cápsulas (EMS)",
    "activePrinciple": "Gabapentina",
    "manufacturer": "EMS",
    "category": "Neuromodulador & Analgésico para Dor Neuropática",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 cápsulas",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "Dor crônica/neuropática: 10 a 20 mg/kg BID a TID | Redução de estresse em felinos: 50 a 100 mg/gato 2h antes de consultas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Padrão ouro em dor neuropática, osteoartrite crônica e sedação amigável para consultas felinas (Cat Friendly).",
    "validationStatus": "VALIDADO",
    "tabletMg": 300,
    "tabletsPerBox": 30
  },
  {
    "id": "gabapentina-ems-400",
    "brandName": "Gabapentina 400 mg Cápsulas (EMS)",
    "activePrinciple": "Gabapentina",
    "manufacturer": "EMS",
    "category": "Neuromodulador & Analgésico",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 cápsulas",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 10
    },
    "doseRangeText": "10 a 20 mg/kg BID a TID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório EMS. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 400,
    "tabletsPerBox": 30
  },
  {
    "id": "lyrica-caps-75",
    "brandName": "Lyrica® 75 mg Cápsulas (Pfizer)",
    "activePrinciple": "Pregabalina",
    "manufacturer": "Pfizer",
    "category": "Neuromodulador e Anticonvulsivante",
    "formType": "tablet",
    "presentationText": "Cartucho com 28 cápsulas",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 3,
      "felino": 2
    },
    "doseRangeText": "2 a 4 mg/kg a cada 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Pfizer. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 75,
    "tabletsPerBox": 28
  },
  {
    "id": "adrenalina-hipolabor-1",
    "brandName": "Adrenalina Injetável 1 mg/mL (1:1000) (Hipolabor)",
    "activePrinciple": "Epinefrina",
    "manufacturer": "Hipolabor",
    "category": "Catecolamina de Ressuscitação Cardiopulmonar (RCP)",
    "formType": "liquid",
    "presentationText": "Ampola com 1 mL (1 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.01,
      "felino": 0.01
    },
    "doseRangeText": "RCP (Parada Cardiorrespiratória): 0,01 mg/kg IV ou intraóssea a cada 3 a 5 min (ou 0,1 mg/kg em dose alta)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Medicamento obrigatório do carrinho de emergência. Diretrizes RECOVER RCP veterinárias.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 1,
    "bottleVolumeMl": 1
  },
  {
    "id": "atropina-fagra-10",
    "brandName": "Atropina 1% Injetável (10 mg/mL) (Fagra)",
    "activePrinciple": "Sulfato de Atropina",
    "manufacturer": "Fagra",
    "category": "Anticolinérgico & Antídoto de Emergência",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 10 mL",
    "species": [
      "Canino",
      "Felino",
      "Equino",
      "Bovino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.04,
      "felino": 0.04
    },
    "doseRangeText": "Bradicardia sinusal grave: 0,02 a 0,04 mg/kg IV, IM ou SC | Antídoto organofosforados: 0,2 a 0,5 mg/kg",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Fagra. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 10
  },
  {
    "id": "norepinefrina-cristalia-2",
    "brandName": "Hemitartarato de Norepinefrina 2 mg/mL (Cristália)",
    "activePrinciple": "Norepinefrina",
    "manufacturer": "Cristália",
    "category": "Vasopressor de Emergência UTI",
    "formType": "liquid",
    "presentationText": "Ampola de 4 mL (8 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.0005,
      "felino": 0.0005
    },
    "doseRangeText": "Choque séptico / vasoplegia: infusão contínua CRI de 0,1 a 1,5 mcg/kg/min (0,0001 a 0,0015 mg/kg/min)",
    "defaultFrequency": "Infusão contínua (CRI)",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Droga de infusão contínua: use a calculadora \"Infusão Contínua na Bolsa\" (dose em mcg/kg/min). Vasopressor de primeira linha no choque séptico distributivo em UTI. Administrar exclusivamente em bomba de infusão.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 2,
    "bottleVolumeMl": 4
  },
  {
    "id": "dopamina-cristalia-5",
    "brandName": "Revivan® / Cloridrato de Dopamina 5 mg/mL (Cristália)",
    "activePrinciple": "Cloridrato de Dopamina",
    "manufacturer": "Cristália",
    "category": "Inotrópico e Vasopressor",
    "formType": "liquid",
    "presentationText": "Ampola com 10 mL (50 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.005,
      "felino": 0.005
    },
    "doseRangeText": "Infusão contínua: 2 a 10 mcg/kg/min IV em bomba de infusão",
    "defaultFrequency": "Infusão contínua (CRI)",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Droga de infusão contínua: use a calculadora \"Infusão Contínua na Bolsa\" (dose em mcg/kg/min). Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "bottleVolumeMl": 10
  },
  {
    "id": "dobutamina-cristalia-125",
    "brandName": "Dobutrex® / Dobutamina 12,5 mg/mL (Cristália)",
    "activePrinciple": "Cloridrato de Dobutamina",
    "manufacturer": "Cristália",
    "category": "Inotrópico Positivo Beta-1 UTI",
    "formType": "liquid",
    "presentationText": "Ampola com 20 mL (250 mg)",
    "species": [
      "Canino",
      "Felino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.005,
      "felino": 0.005
    },
    "doseRangeText": "Infusão contínua: 2,5 a 10 mcg/kg/min IV em bomba para choque cardiogênico",
    "defaultFrequency": "Infusão contínua (CRI)",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Droga de infusão contínua: use a calculadora \"Infusão Contínua na Bolsa\" (dose em mcg/kg/min). Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 12.5,
    "bottleVolumeMl": 20
  },
  {
    "id": "xylestesin-2-sem-vaso",
    "brandName": "Xylestesin® 2% sem Vasoconstritor (20 mg/mL) (Cristália)",
    "activePrinciple": "Cloridrato de Lidocaína",
    "manufacturer": "Cristália",
    "category": "Antiarrítmico Ventricular & Anestésico Local",
    "formType": "liquid",
    "presentationText": "Frasco com 20 mL pronto para injeção",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2,
      "felino": 0.5
    },
    "doseRangeText": "Taquicardia ventricular: bolus 2 mg/kg IV lento em cães, seguido de CRI 25 a 50 mcg/kg/min",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Antiarrítmico Classe IB de referência. Em gatos usar com extremo cuidado devido a sensibilidade miocárdica.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 20,
    "percentage": 2,
    "bottleVolumeMl": 20
  },
  {
    "id": "gluconato-calcio-10",
    "brandName": "Gluconato de Cálcio 10% (100 mg/mL) (Halex Istar)",
    "activePrinciple": "Gluconato de Cálcio",
    "manufacturer": "Halex Istar",
    "category": "Eletrólito de Emergência (Hipocalcemia)",
    "formType": "liquid",
    "presentationText": "Ampola com 10 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 50,
      "felino": 50
    },
    "doseRangeText": "Eclâmpsia / Hipocalcemia aguda: 0,5 a 1,5 mL/kg IV lento monitorando ECG por 15-20 min",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Monitorar ritmo cardíaco durante a infusão. Parar imediatamente se ocorrer bradicardia ou parada sinusal.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "percentage": 10,
    "bottleVolumeMl": 10
  },
  {
    "id": "bicarbonato-sodio-84",
    "brandName": "Bicarbonato de Sódio 8,4% (1 mEq/mL) (Farmace)",
    "activePrinciple": "Bicarbonato de Sódio",
    "manufacturer": "Farmace",
    "category": "Alcalinizante de Emergência UTI",
    "formType": "liquid",
    "presentationText": "Frasco com 250 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "Acidose metabólica grave com HCO3 < 10 mEq/L: mEq = 0,3 x Peso x (12 - HCO3 sérico) IV lento",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Farmace. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 84,
    "percentage": 8.4,
    "bottleVolumeMl": 250
  },
  {
    "id": "kcl-halex-191",
    "brandName": "Cloreto de Potássio 19,1% (2,56 mEq/mL) (Halex Istar)",
    "activePrinciple": "Cloreto de Potássio",
    "manufacturer": "Halex Istar",
    "category": "Reposição Eletrolítica Hospitalar",
    "formType": "liquid",
    "presentationText": "Ampola com 10 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "Aditivo para fluidoterapia: 10 a 40 mEq/L na bolsa de fluido. Taxa máxima de infusão: 0,5 mEq/kg/h",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "NUNCA APLICAR EM BOLUS DIRETO. Diluir sempre na bolsa de soro. Infusão rápida de potássio causa parada cardíaca em diástole.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 191,
    "percentage": 19.1,
    "bottleVolumeMl": 10
  },
  {
    "id": "glicose-halex-50",
    "brandName": "Glicose Hipertônica 50% (500 mg/mL) (Halex Istar)",
    "activePrinciple": "Glicose",
    "manufacturer": "Halex Istar",
    "category": "Carboidrato Hipertônico de Emergência",
    "formType": "liquid",
    "presentationText": "Ampola de 10 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 500,
      "felino": 500
    },
    "doseRangeText": "Hipoglicemia aguda / convulsão hipoglicêmica: 1 a 2 mL/kg da solução 50% diluída 1:1 com soro IV lento",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Halex Istar. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 500,
    "percentage": 50,
    "bottleVolumeMl": 10
  },
  {
    "id": "kanakion-mm-inj-10",
    "brandName": "Kanakion MM® Injetável 10 mg/mL (Cristália)",
    "activePrinciple": "Fitomenadiona (Vitamina K1)",
    "manufacturer": "Cristália",
    "category": "Antídoto para Intoxicação por Rodenticidas Cumarínicos",
    "formType": "liquid",
    "presentationText": "Ampola com 1 mL (10 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5,
      "felino": 2.5
    },
    "doseRangeText": "Intoxicação por raticida anticoagulante: 2,5 a 5 mg/kg SC (usar agulha fina) a cada 12h, seguido de via oral por 28 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Antídoto específico para rodenticidas anticoagulantes. Nunca aplicar IV direto devido a risco de anafilaxia severa.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 1
  },
  {
    "id": "apoquel-chew-36",
    "brandName": "Apoquel® Mastigável 3,6 mg (Zoetis)",
    "activePrinciple": "Maleato de Oclacitinib",
    "manufacturer": "Zoetis",
    "category": "Antipruriginoso Inibidor de JAK Mastigável",
    "formType": "tablet",
    "presentationText": "Frasco com 20 comprimidos mastigáveis palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.4
    },
    "doseRangeText": "0,4 a 0,6 mg/kg a cada 12 horas por 14 dias; após isso, manutenção a cada 24 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Inibidor seletivo de JAK-1 de início de ação em menos de 4 horas para controle rápido de prurido alérgico e dermatite atópica.",
    "validationStatus": "VALIDADO",
    "tabletMg": 3.6,
    "tabletsPerBox": 20
  },
  {
    "id": "apoquel-chew-54",
    "brandName": "Apoquel® Mastigável 5,4 mg (Zoetis)",
    "activePrinciple": "Maleato de Oclacitinib",
    "manufacturer": "Zoetis",
    "category": "Antipruriginoso Inibidor de JAK Mastigável",
    "formType": "tablet",
    "presentationText": "Frasco com 20 comprimidos mastigáveis palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.4
    },
    "doseRangeText": "0,4 a 0,6 mg/kg BID por 14 dias, depois SID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5.4,
    "tabletsPerBox": 20
  },
  {
    "id": "apoquel-chew-16",
    "brandName": "Apoquel® Mastigável 16 mg (Zoetis)",
    "activePrinciple": "Maleato de Oclacitinib",
    "manufacturer": "Zoetis",
    "category": "Antipruriginoso Inibidor de JAK Mastigável",
    "formType": "tablet",
    "presentationText": "Frasco com 20 comprimidos mastigáveis palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.4
    },
    "doseRangeText": "0,4 a 0,6 mg/kg BID por 14 dias, depois SID para cães grandes",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 16,
    "tabletsPerBox": 20
  },
  {
    "id": "cytopoint-inj-10",
    "brandName": "Cytopoint® 10 mg Frasco Injetável (Zoetis)",
    "activePrinciple": "Lokivetmab",
    "manufacturer": "Zoetis",
    "category": "Anticorpo Monoclonal Anti-IL-31 Caninizado",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 1 mL (10 mg/mL)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "Dose mínima recomendada: 2 mg/kg via SC a cada 4 a 8 semanas conforme retorno do prurido",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Anticorpo monoclonal caninizado que neutraliza especificamente a IL-31. Seguro em cães de qualquer idade e com comorbidades renais/hepáticas.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 1
  },
  {
    "id": "cytopoint-inj-20",
    "brandName": "Cytopoint® 20 mg Frasco Injetável (Zoetis)",
    "activePrinciple": "Lokivetmab",
    "manufacturer": "Zoetis",
    "category": "Anticorpo Monoclonal Anti-IL-31 Caninizado",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 1 mL (20 mg/mL)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg via SC a cada 4 a 8 semanas",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 20,
    "bottleVolumeMl": 1
  },
  {
    "id": "cytopoint-inj-30",
    "brandName": "Cytopoint® 30 mg Frasco Injetável (Zoetis)",
    "activePrinciple": "Lokivetmab",
    "manufacturer": "Zoetis",
    "category": "Anticorpo Monoclonal Anti-IL-31 Caninizado",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 1 mL (30 mg/mL)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg via SC a cada 4 a 8 semanas",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 30,
    "bottleVolumeMl": 1
  },
  {
    "id": "cytopoint-inj-40",
    "brandName": "Cytopoint® 40 mg Frasco Injetável (Zoetis)",
    "activePrinciple": "Lokivetmab",
    "manufacturer": "Zoetis",
    "category": "Anticorpo Monoclonal Anti-IL-31 Caninizado",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 1 mL (40 mg/mL)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "2 mg/kg via SC a cada 4 a 8 semanas para cães grandes",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 1
  },
  {
    "id": "atopica-caps-10",
    "brandName": "Atopica® 10 mg Cápsulas (Elanco)",
    "activePrinciple": "Ciclosporina Microemulsionada",
    "manufacturer": "Elanco",
    "category": "Imunomodulador & Dermatite Atópica",
    "formType": "tablet",
    "presentationText": "Cartucho com 15 cápsulas",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia 2h antes ou depois da refeição",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 15
  },
  {
    "id": "atopica-caps-25",
    "brandName": "Atopica® 25 mg Cápsulas (Elanco)",
    "activePrinciple": "Ciclosporina Microemulsionada",
    "manufacturer": "Elanco",
    "category": "Imunomodulador & Dermatite Atópica",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 cápsulas",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 25,
    "tabletsPerBox": 30
  },
  {
    "id": "atopica-caps-50",
    "brandName": "Atopica® 50 mg Cápsulas (Elanco)",
    "activePrinciple": "Ciclosporina Microemulsionada",
    "manufacturer": "Elanco",
    "category": "Imunomodulador & Dermatite Atópica",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 cápsulas",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 30
  },
  {
    "id": "atopica-caps-100",
    "brandName": "Atopica® 100 mg Cápsulas (Elanco)",
    "activePrinciple": "Ciclosporina Microemulsionada",
    "manufacturer": "Elanco",
    "category": "Imunomodulador & Dermatite Atópica",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 cápsulas",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 mg/kg uma vez ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 30
  },
  {
    "id": "atopica-gatos-100mg",
    "brandName": "Atopica® para Gatos Solução Oral 100 mg/mL (Elanco)",
    "activePrinciple": "Ciclosporina Microemulsionada",
    "manufacturer": "Elanco",
    "category": "Imunomodulador Específico para Felinos",
    "formType": "liquid",
    "presentationText": "Frasco com 17 mL acompanhado de seringa dosadora",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 7
    },
    "doseRangeText": "7 mg/kg (0,07 mL/kg) uma vez ao dia misturado a um pequeno petisco ou diretamente na boca",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Tratamento padrão para dermatite atópica / síndrome atópica cutânea felina e complexo granuloma eosinofílico.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 17
  },
  {
    "id": "cyclavance-oral-100",
    "brandName": "Cyclavance® Solução Oral 100 mg/mL (Virbac)",
    "activePrinciple": "Ciclosporina",
    "manufacturer": "Virbac",
    "category": "Imunomodulador & Dermatite Atópica",
    "formType": "liquid",
    "presentationText": "Frasco de 15 mL com adaptador e seringa graduada",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 7
    },
    "doseRangeText": "Cães: 5 mg/kg SID | Gatos: 7 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Virbac. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 15
  },
  {
    "id": "polaramine-xarope-04",
    "brandName": "Polaramine® Xarope 0,4 mg/mL (2 mg/5 mL) (Mantecorp)",
    "activePrinciple": "Maleato de Dexclorfeniramina",
    "manufacturer": "Mantecorp",
    "category": "Anti-histamínico H1",
    "formType": "liquid",
    "presentationText": "Frasco com 120 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2,
      "felino": 0.2
    },
    "doseRangeText": "0,2 a 0,4 mg/kg a cada 8 a 12 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Mantecorp. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.4,
    "bottleVolumeMl": 120
  },
  {
    "id": "difenidrin-inj-50",
    "brandName": "Difenidrin® Injetável 50 mg/mL (Cristália)",
    "activePrinciple": "Cloridrato de Difenidramina",
    "manufacturer": "Cristália",
    "category": "Anti-histamínico H1 Injetável de Emergência",
    "formType": "liquid",
    "presentationText": "Ampola com 1 mL (50 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "Reação anafilática ou alérgica aguda: 1 a 2 mg/kg IM ou IV lento a cada 8-12h",
    "defaultFrequency": "BID",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Cristália. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 50,
    "bottleVolumeMl": 1
  },
  {
    "id": "fenergan-inj-25",
    "brandName": "Fenergan® Injetável 25 mg/mL (Sanofi)",
    "activePrinciple": "Cloridrato de Prometazina",
    "manufacturer": "Sanofi",
    "category": "Anti-histamínico H1 e Sedativo",
    "formType": "liquid",
    "presentationText": "Ampola de 2 mL (50 mg)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "0,5 a 1 mg/kg IM profunda (evitar em gatos e evitar via IV devido a hipotensão severa)",
    "defaultFrequency": "BID",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Sanofi. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 25,
    "bottleVolumeMl": 2
  },
  {
    "id": "hixizine-xarope-2",
    "brandName": "Hixizine® Xarope 2 mg/mL (Abbott)",
    "activePrinciple": "Cloridrato de Hidroxizina",
    "manufacturer": "Abbott",
    "category": "Anti-histamínico H1 com Ação Antipruriginosa",
    "formType": "liquid",
    "presentationText": "Frasco com 120 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 a 2 mg/kg a cada 8 a 12 horas",
    "defaultFrequency": "TID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Abbott. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 2,
    "bottleVolumeMl": 120
  },
  {
    "id": "simparic-5-mg",
    "brandName": "Simparic® 5 mg Comprimidos Mastigáveis (1.3 a 2.5 kg) (Zoetis)",
    "activePrinciple": "Sarolaner",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo (Ectoparasiticida)",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 1.3 a 2.5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido de 5 mg a cada 35 dias (dose alvo 2 a 4 mg/kg de sarolaner)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Eficácia sustentada por até 35 dias contra pulgas, carrapatos e 3 tipos de sarna (sarcóptica, demodécica e otodécica).",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-10-mg",
    "brandName": "Simparic® 10 mg Comprimidos Mastigáveis (2.6 a 5 kg) (Zoetis)",
    "activePrinciple": "Sarolaner",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo (Ectoparasiticida)",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 2.6 a 5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido de 10 mg a cada 35 dias (dose alvo 2 a 4 mg/kg de sarolaner)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Eficácia sustentada por até 35 dias contra pulgas, carrapatos e 3 tipos de sarna (sarcóptica, demodécica e otodécica).",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-20-mg",
    "brandName": "Simparic® 20 mg Comprimidos Mastigáveis (5.1 a 10 kg) (Zoetis)",
    "activePrinciple": "Sarolaner",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo (Ectoparasiticida)",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 5.1 a 10 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido de 20 mg a cada 35 dias (dose alvo 2 a 4 mg/kg de sarolaner)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Eficácia sustentada por até 35 dias contra pulgas, carrapatos e 3 tipos de sarna (sarcóptica, demodécica e otodécica).",
    "validationStatus": "VALIDADO",
    "tabletMg": 20,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-40-mg",
    "brandName": "Simparic® 40 mg Comprimidos Mastigáveis (10.1 a 20 kg) (Zoetis)",
    "activePrinciple": "Sarolaner",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo (Ectoparasiticida)",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 10.1 a 20 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido de 40 mg a cada 35 dias (dose alvo 2 a 4 mg/kg de sarolaner)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Eficácia sustentada por até 35 dias contra pulgas, carrapatos e 3 tipos de sarna (sarcóptica, demodécica e otodécica).",
    "validationStatus": "VALIDADO",
    "tabletMg": 40,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-80-mg",
    "brandName": "Simparic® 80 mg Comprimidos Mastigáveis (20.1 a 40 kg) (Zoetis)",
    "activePrinciple": "Sarolaner",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo (Ectoparasiticida)",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 20.1 a 40 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido de 80 mg a cada 35 dias (dose alvo 2 a 4 mg/kg de sarolaner)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Eficácia sustentada por até 35 dias contra pulgas, carrapatos e 3 tipos de sarna (sarcóptica, demodécica e otodécica).",
    "validationStatus": "VALIDADO",
    "tabletMg": 80,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-120-mg",
    "brandName": "Simparic® 120 mg Comprimidos Mastigáveis (40.1 a 60 kg) (Zoetis)",
    "activePrinciple": "Sarolaner",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo (Ectoparasiticida)",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 40.1 a 60 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido de 120 mg a cada 35 dias (dose alvo 2 a 4 mg/kg de sarolaner)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Eficácia sustentada por até 35 dias contra pulgas, carrapatos e 3 tipos de sarna (sarcóptica, demodécica e otodécica).",
    "validationStatus": "VALIDADO",
    "tabletMg": 120,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-trio-3-mg",
    "brandName": "Simparic Trio® 3 mg (1.25 a 2.5 kg) (Zoetis)",
    "activePrinciple": "Sarolaner + Moxidectina + Pirantel",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo e Interno Triplo",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 1.25 a 2.5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido mensal contra ectoparasitas, vermes intestinais e prevenção de dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 3,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-trio-6-mg",
    "brandName": "Simparic Trio® 6 mg (2.6 a 5 kg) (Zoetis)",
    "activePrinciple": "Sarolaner + Moxidectina + Pirantel",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo e Interno Triplo",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 2.6 a 5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido mensal contra ectoparasitas, vermes intestinais e prevenção de dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 6,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-trio-12-mg",
    "brandName": "Simparic Trio® 12 mg (5.1 a 10 kg) (Zoetis)",
    "activePrinciple": "Sarolaner + Moxidectina + Pirantel",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo e Interno Triplo",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 5.1 a 10 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido mensal contra ectoparasitas, vermes intestinais e prevenção de dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 12,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-trio-24-mg",
    "brandName": "Simparic Trio® 24 mg (10.1 a 20 kg) (Zoetis)",
    "activePrinciple": "Sarolaner + Moxidectina + Pirantel",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo e Interno Triplo",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 10.1 a 20 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido mensal contra ectoparasitas, vermes intestinais e prevenção de dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 24,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-trio-48-mg",
    "brandName": "Simparic Trio® 48 mg (20.1 a 40 kg) (Zoetis)",
    "activePrinciple": "Sarolaner + Moxidectina + Pirantel",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo e Interno Triplo",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 20.1 a 40 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido mensal contra ectoparasitas, vermes intestinais e prevenção de dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 48,
    "tabletsPerBox": 3
  },
  {
    "id": "simparic-trio-72-mg",
    "brandName": "Simparic Trio® 72 mg (40.1 a 60 kg) (Zoetis)",
    "activePrinciple": "Sarolaner + Moxidectina + Pirantel",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Externo e Interno Triplo",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis para cães de 40.1 a 60 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 comprimido mensal contra ectoparasitas, vermes intestinais e prevenção de dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 72,
    "tabletsPerBox": 3
  },
  {
    "id": "bravecto-dog-112",
    "brandName": "Bravecto® Mastigável 112.5 mg Cães (2 a 4.5 kg) (MSD Saúde Animal)",
    "activePrinciple": "Fluralaner",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Externo de Longa Duração (3 meses)",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 comprimido mastigável para cães de 2 a 4.5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "1 comprimido a cada 12 semanas (84 dias / 3 meses)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Proteção sistêmica contínua comprovada por 12 semanas contra pulgas e carrapatos.",
    "validationStatus": "VALIDADO",
    "tabletMg": 112.5,
    "tabletsPerBox": 1
  },
  {
    "id": "bravecto-dog-250",
    "brandName": "Bravecto® Mastigável 250 mg Cães (4.5 a 10 kg) (MSD Saúde Animal)",
    "activePrinciple": "Fluralaner",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Externo de Longa Duração (3 meses)",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 comprimido mastigável para cães de 4.5 a 10 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "1 comprimido a cada 12 semanas (84 dias / 3 meses)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Proteção sistêmica contínua comprovada por 12 semanas contra pulgas e carrapatos.",
    "validationStatus": "VALIDADO",
    "tabletMg": 250,
    "tabletsPerBox": 1
  },
  {
    "id": "bravecto-dog-500",
    "brandName": "Bravecto® Mastigável 500 mg Cães (10 a 20 kg) (MSD Saúde Animal)",
    "activePrinciple": "Fluralaner",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Externo de Longa Duração (3 meses)",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 comprimido mastigável para cães de 10 a 20 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "1 comprimido a cada 12 semanas (84 dias / 3 meses)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Proteção sistêmica contínua comprovada por 12 semanas contra pulgas e carrapatos.",
    "validationStatus": "VALIDADO",
    "tabletMg": 500,
    "tabletsPerBox": 1
  },
  {
    "id": "bravecto-dog-1000",
    "brandName": "Bravecto® Mastigável 1000 mg Cães (20 a 40 kg) (MSD Saúde Animal)",
    "activePrinciple": "Fluralaner",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Externo de Longa Duração (3 meses)",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 comprimido mastigável para cães de 20 a 40 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "1 comprimido a cada 12 semanas (84 dias / 3 meses)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Proteção sistêmica contínua comprovada por 12 semanas contra pulgas e carrapatos.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1000,
    "tabletsPerBox": 1
  },
  {
    "id": "bravecto-dog-1400",
    "brandName": "Bravecto® Mastigável 1400 mg Cães (40 a 56 kg) (MSD Saúde Animal)",
    "activePrinciple": "Fluralaner",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Externo de Longa Duração (3 meses)",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 comprimido mastigável para cães de 40 a 56 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 25
    },
    "doseRangeText": "1 comprimido a cada 12 semanas (84 dias / 3 meses)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Proteção sistêmica contínua comprovada por 12 semanas contra pulgas e carrapatos.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1400,
    "tabletsPerBox": 1
  },
  {
    "id": "bravecto-cat-spot-112",
    "brandName": "Bravecto® Transdermal Gatos 112.5 mg (1.2 a 2.8 kg) (MSD Saúde Animal)",
    "activePrinciple": "Fluralaner",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Tópico Transdermal (3 meses)",
    "formType": "topical",
    "presentationText": "Pipeta dosadora transdermal para gatos de 1.2 a 2.8 kg",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 40
    },
    "doseRangeText": "1 pipeta tópica na base do crânio a cada 12 semanas (3 meses)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Aplicação tópica spot-on na pele da base do crânio com absorção transdérmica sustentada por 12 semanas.",
    "validationStatus": "VALIDADO",
    "tabletMg": 112.5,
    "bottleVolumeMl": 1
  },
  {
    "id": "bravecto-cat-spot-250",
    "brandName": "Bravecto® Transdermal Gatos 250 mg (2.8 a 6.25 kg) (MSD Saúde Animal)",
    "activePrinciple": "Fluralaner",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Tópico Transdermal (3 meses)",
    "formType": "topical",
    "presentationText": "Pipeta dosadora transdermal para gatos de 2.8 a 6.25 kg",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 40
    },
    "doseRangeText": "1 pipeta tópica na base do crânio a cada 12 semanas (3 meses)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Aplicação tópica spot-on na pele da base do crânio com absorção transdérmica sustentada por 12 semanas.",
    "validationStatus": "VALIDADO",
    "tabletMg": 250,
    "bottleVolumeMl": 1
  },
  {
    "id": "bravecto-cat-spot-500",
    "brandName": "Bravecto® Transdermal Gatos 500 mg (6.25 a 12.5 kg) (MSD Saúde Animal)",
    "activePrinciple": "Fluralaner",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Tópico Transdermal (3 meses)",
    "formType": "topical",
    "presentationText": "Pipeta dosadora transdermal para gatos de 6.25 a 12.5 kg",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 40
    },
    "doseRangeText": "1 pipeta tópica na base do crânio a cada 12 semanas (3 meses)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Aplicação tópica spot-on na pele da base do crânio com absorção transdérmica sustentada por 12 semanas.",
    "validationStatus": "VALIDADO",
    "tabletMg": 500,
    "bottleVolumeMl": 1
  },
  {
    "id": "nexgard-chew-11",
    "brandName": "NexGard® 11.3 mg Mastigável (2 a 4 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Externo Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 ou 3 tabletes mastigáveis para cães de 2 a 4 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mastigável mensal (dose mínima 2,5 mg/kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 11.3,
    "tabletsPerBox": 3
  },
  {
    "id": "nexgard-chew-28",
    "brandName": "NexGard® 28.3 mg Mastigável (4.1 a 10 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Externo Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 ou 3 tabletes mastigáveis para cães de 4.1 a 10 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mastigável mensal (dose mínima 2,5 mg/kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 28.3,
    "tabletsPerBox": 3
  },
  {
    "id": "nexgard-chew-68",
    "brandName": "NexGard® 68 mg Mastigável (10.1 a 25 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Externo Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 ou 3 tabletes mastigáveis para cães de 10.1 a 25 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mastigável mensal (dose mínima 2,5 mg/kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 68,
    "tabletsPerBox": 3
  },
  {
    "id": "nexgard-chew-136",
    "brandName": "NexGard® 136 mg Mastigável (25.1 a 50 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Externo Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 1 ou 3 tabletes mastigáveis para cães de 25.1 a 50 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mastigável mensal (dose mínima 2,5 mg/kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 136,
    "tabletsPerBox": 3
  },
  {
    "id": "nexgard-spectra-p",
    "brandName": "NexGard Spectra® P (2 a 3.5 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner + Milbemicina Oxima",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Completo Externo e Interno",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 tabletes mastigáveis sabor carne para cães de 2 a 3.5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mensal: combate pulgas, carrapatos, sarnas, nematódeos gastrointestinais e previne dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 11.25,
    "tabletsPerBox": 3
  },
  {
    "id": "nexgard-spectra-m",
    "brandName": "NexGard Spectra® M (3.6 a 7.5 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner + Milbemicina Oxima",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Completo Externo e Interno",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 tabletes mastigáveis sabor carne para cães de 3.6 a 7.5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mensal: combate pulgas, carrapatos, sarnas, nematódeos gastrointestinais e previne dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 22.5,
    "tabletsPerBox": 3
  },
  {
    "id": "nexgard-spectra-g",
    "brandName": "NexGard Spectra® G (7.6 a 15 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner + Milbemicina Oxima",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Completo Externo e Interno",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 tabletes mastigáveis sabor carne para cães de 7.6 a 15 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mensal: combate pulgas, carrapatos, sarnas, nematódeos gastrointestinais e previne dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 45,
    "tabletsPerBox": 3
  },
  {
    "id": "nexgard-spectra-gg",
    "brandName": "NexGard Spectra® GG (15.1 a 30 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner + Milbemicina Oxima",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Completo Externo e Interno",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 tabletes mastigáveis sabor carne para cães de 15.1 a 30 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mensal: combate pulgas, carrapatos, sarnas, nematódeos gastrointestinais e previne dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 90,
    "tabletsPerBox": 3
  },
  {
    "id": "nexgard-spectra-super-gg",
    "brandName": "NexGard Spectra® Super GG (30.1 a 60 kg) (Boehringer Ingelheim)",
    "activePrinciple": "Afoxolaner + Milbemicina Oxima",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Completo Externo e Interno",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 tabletes mastigáveis sabor carne para cães de 30.1 a 60 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2.5
    },
    "doseRangeText": "1 tablete mensal: combate pulgas, carrapatos, sarnas, nematódeos gastrointestinais e previne dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 180,
    "tabletsPerBox": 3
  },
  {
    "id": "credelio-dog-56",
    "brandName": "Credelio® Cães 56.25 mg (1.3 a 2.5 kg) (Elanco)",
    "activePrinciple": "Lotilaner",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Externo Comprimido Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos para cães de 1.3 a 2.5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "1 comprimido mensal administrado junto ao alimento ou até 30 min após",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 56.25,
    "tabletsPerBox": 3
  },
  {
    "id": "credelio-dog-112",
    "brandName": "Credelio® Cães 112.5 mg (2.5 a 5.5 kg) (Elanco)",
    "activePrinciple": "Lotilaner",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Externo Comprimido Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos para cães de 2.5 a 5.5 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "1 comprimido mensal administrado junto ao alimento ou até 30 min após",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 112.5,
    "tabletsPerBox": 3
  },
  {
    "id": "credelio-dog-225",
    "brandName": "Credelio® Cães 225 mg (5.5 a 11 kg) (Elanco)",
    "activePrinciple": "Lotilaner",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Externo Comprimido Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos para cães de 5.5 a 11 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "1 comprimido mensal administrado junto ao alimento ou até 30 min após",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 225,
    "tabletsPerBox": 3
  },
  {
    "id": "credelio-dog-450",
    "brandName": "Credelio® Cães 450 mg (11 a 22 kg) (Elanco)",
    "activePrinciple": "Lotilaner",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Externo Comprimido Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos para cães de 11 a 22 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "1 comprimido mensal administrado junto ao alimento ou até 30 min após",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 450,
    "tabletsPerBox": 3
  },
  {
    "id": "credelio-dog-900",
    "brandName": "Credelio® Cães 900 mg (22 a 45 kg) (Elanco)",
    "activePrinciple": "Lotilaner",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Externo Comprimido Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos para cães de 22 a 45 kg",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 20
    },
    "doseRangeText": "1 comprimido mensal administrado junto ao alimento ou até 30 min após",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 900,
    "tabletsPerBox": 3
  },
  {
    "id": "credelio-cat-12",
    "brandName": "Credelio® Gatos 12 mg (0.5 a 2 kg) (Elanco)",
    "activePrinciple": "Lotilaner",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Externo Específico para Felinos",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis palatáveis para gatos de 0.5 a 2 kg",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 6
    },
    "doseRangeText": "1 comprimido mensal administrado com a comida (dose mínima 6 mg/kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 12,
    "tabletsPerBox": 3
  },
  {
    "id": "credelio-cat-48",
    "brandName": "Credelio® Gatos 48 mg (2 a 8 kg) (Elanco)",
    "activePrinciple": "Lotilaner",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Externo Específico para Felinos",
    "formType": "tablet",
    "presentationText": "Cartucho com 3 comprimidos mastigáveis palatáveis para gatos de 2 a 8 kg",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 6
    },
    "doseRangeText": "1 comprimido mensal administrado com a comida (dose mínima 6 mg/kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 48,
    "tabletsPerBox": 3
  },
  {
    "id": "revolution-6-gatos",
    "brandName": "Revolution® 6% Gatos até 7,5 kg (Zoetis)",
    "activePrinciple": "Selamectina",
    "manufacturer": "Zoetis",
    "category": "Endectocida Tópico Spot-on",
    "formType": "topical",
    "presentationText": "Cartucho com 3 pipetas de 0,75 mL (45 mg)",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 6
    },
    "doseRangeText": "1 pipeta tópica mensal na nuca (dose 6 mg/kg de selamectina)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 60,
    "percentage": 6,
    "bottleVolumeMl": 0.75
  },
  {
    "id": "revolution-12-caes-10-20",
    "brandName": "Revolution® 12% Cães de 10,1 a 20 kg (Zoetis)",
    "activePrinciple": "Selamectina",
    "manufacturer": "Zoetis",
    "category": "Endectocida Tópico Spot-on",
    "formType": "topical",
    "presentationText": "Cartucho com 3 pipetas de 1,0 mL (120 mg)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 6
    },
    "doseRangeText": "1 pipeta mensal tópica na pele da nuca",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 120,
    "percentage": 12,
    "bottleVolumeMl": 1
  },
  {
    "id": "revolution-plus-gatos-medio",
    "brandName": "Revolution® Plus Gatos de 2,5 a 5 kg (Zoetis)",
    "activePrinciple": "Selamectina + Sarolaner",
    "manufacturer": "Zoetis",
    "category": "Endectocida Tópico Felino Ampliado",
    "formType": "topical",
    "presentationText": "Cartucho com 3 pipetas de 0,5 mL (30 mg Selamectina + 5 mg Sarolaner)",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 6
    },
    "doseRangeText": "1 pipeta tópica mensal: protege contra pulgas, carrapatos, ácaros de ouvido, vermes e dirofilariose",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 70,
    "bottleVolumeMl": 0.5
  },
  {
    "id": "advocate-caes-4-10",
    "brandName": "Advocate® Cães de 4 a 10 kg (Elanco)",
    "activePrinciple": "Imidacloprida + Moxidectina",
    "manufacturer": "Elanco",
    "category": "Endectocida Tópico Spot-On",
    "formType": "topical",
    "presentationText": "Cartucho com 3 pipetas de 1,0 mL",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 10
    },
    "doseRangeText": "1 pipeta mensal na pele entre as escápulas",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 125,
    "bottleVolumeMl": 1
  },
  {
    "id": "advocate-gatos-4-8",
    "brandName": "Advocate® Gatos de 4 a 8 kg (Elanco)",
    "activePrinciple": "Imidacloprida + Moxidectina",
    "manufacturer": "Elanco",
    "category": "Endectocida Tópico Felino",
    "formType": "topical",
    "presentationText": "Cartucho com 3 pipetas de 0,8 mL",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 10
    },
    "doseRangeText": "1 pipeta tópica mensal na nuca do gato",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Tópica",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 110,
    "bottleVolumeMl": 0.8
  },
  {
    "id": "drontal-plus-35kg",
    "brandName": "Drontal® Plus 35 kg Cães Grandes (Elanco)",
    "activePrinciple": "Praziquantel + Pirantel + Febantel",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Interno Polivalente",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos formato osso sabor carne",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "1 comprimido para cada 35 kg de peso corporal em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 175,
    "tabletsPerBox": 2
  },
  {
    "id": "drontal-gatos-comp",
    "brandName": "Drontal® Gatos Comprimidos (Elanco)",
    "activePrinciple": "Praziquantel + Pamoato de Pirantel",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Interno para Felinos",
    "formType": "tablet",
    "presentationText": "Cartucho com 4 comprimidos elípticos",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 5
    },
    "doseRangeText": "1 comprimido para cada 4 kg de peso corporal em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 230,
    "tabletsPerBox": 4
  },
  {
    "id": "milbemax-caes-pequenos",
    "brandName": "Milbemax® Cães até 5 kg (Elanco)",
    "activePrinciple": "Milbemicina Oxima + Praziquantel",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Interno Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "1 comprimido para cães de 0,5 a 5 kg em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 27.5,
    "tabletsPerBox": 2
  },
  {
    "id": "milbemax-caes-grandes",
    "brandName": "Milbemax® Cães de 5 a 25 kg (Elanco)",
    "activePrinciple": "Milbemicina Oxima + Praziquantel",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Interno Mastigável",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos mastigáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5
    },
    "doseRangeText": "1 comprimido para cada 5 a 25 kg em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 137.5,
    "tabletsPerBox": 2
  },
  {
    "id": "milbemax-gatos-grandes",
    "brandName": "Milbemax® Gatos de 2 a 8 kg (Elanco)",
    "activePrinciple": "Milbemicina Oxima + Praziquantel",
    "manufacturer": "Elanco",
    "category": "Antiparasitário Interno para Felinos",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos pequenos palatáveis",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 2
    },
    "doseRangeText": "1 comprimido para gatos de 2 a 8 kg em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Elanco. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 56,
    "tabletsPerBox": 2
  },
  {
    "id": "endogard-10-comp",
    "brandName": "Endogard® 10 kg Comprimidos (Virbac)",
    "activePrinciple": "Febantel + Pirantel + Praziquantel + Ivermectina",
    "manufacturer": "Virbac",
    "category": "Antiparasitário Interno com CPR",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos palatáveis divisíveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 comprimido para cada 10 kg de peso vivo em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Virbac. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 900,
    "tabletsPerBox": 2
  },
  {
    "id": "endogard-30-comp",
    "brandName": "Endogard® 30 kg Comprimidos (Virbac)",
    "activePrinciple": "Febantel + Pirantel + Praziquantel + Ivermectina",
    "manufacturer": "Virbac",
    "category": "Antiparasitário Interno com CPR",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 comprimido para cada 30 kg de peso vivo em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Virbac. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2700,
    "tabletsPerBox": 2
  },
  {
    "id": "vermivet-composto-comp",
    "brandName": "Vermivet® Composto Comprimidos (Agener União)",
    "activePrinciple": "Pamoato de Pirantel + Praziquantel",
    "manufacturer": "Agener União",
    "category": "Antiparasitário Interno",
    "formType": "tablet",
    "presentationText": "Cartucho com 4 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 comprimido para cada 3 kg de peso corporal em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 345,
    "tabletsPerBox": 4
  },
  {
    "id": "vermivet-plus-2g",
    "brandName": "Vermivet® Plus 2,0 g Comprimidos (Agener União)",
    "activePrinciple": "Praziquantel + Pirantel + Febantel",
    "manufacturer": "Agener União",
    "category": "Antiparasitário Interno para Cães Grandes",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 comprimido para cada 25 kg de peso corporal em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2000,
    "tabletsPerBox": 2
  },
  {
    "id": "vermivet-filhote-susp",
    "brandName": "Vermivet® Filhote Suspensão Oral 20 mL (Agener União)",
    "activePrinciple": "Pamoato de Pirantel + Praziquantel",
    "manufacturer": "Agener União",
    "category": "Antiparasitário Interno Líquido para Filhotes",
    "formType": "liquid",
    "presentationText": "Frasco com 20 mL com seringa dosadora",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 mL para cada 1 kg de peso a partir de 15 dias de vida",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 35,
    "bottleVolumeMl": 20
  },
  {
    "id": "vetmax-plus-susp-30",
    "brandName": "Vetmax Plus® Suspensão Oral 30 mL (Vetnil)",
    "activePrinciple": "Febendazol + Pirantel + Praziquantel",
    "manufacturer": "Vetnil",
    "category": "Antiparasitário Interno Líquido",
    "formType": "liquid",
    "presentationText": "Frasco com 30 mL com seringa dosadora",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "0,5 mL por kg de peso vivo em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 75,
    "bottleVolumeMl": 30
  },
  {
    "id": "chemital-plus-comp",
    "brandName": "Chemital® Plus Comprimidos (Chemitec)",
    "activePrinciple": "Praziquantel + Pirantel + Febantel",
    "manufacturer": "Chemitec",
    "category": "Antiparasitário Interno",
    "formType": "tablet",
    "presentationText": "Cartucho com 4 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 comprimido para cada 10 kg de peso vivo",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 660,
    "tabletsPerBox": 4
  },
  {
    "id": "ivomec-inj-10",
    "brandName": "Ivomec® Injetável 1% (Boehringer Ingelheim)",
    "activePrinciple": "Ivermectina",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Endectocida Clássico",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Bovino",
      "Ovino",
      "Suíno"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1% = 10 mg/mL. Bovinos e Ovinos: 0,2 mg/kg SC (1 mL para cada 50 kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 50
  },
  {
    "id": "master-lp-inj-4",
    "brandName": "Master LP® Injetável 4% (Ourofino)",
    "activePrinciple": "Ivermectina Longa Ação",
    "manufacturer": "Ourofino",
    "category": "Antiparasitário Endectocida de Longa Duração",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Bovino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "4% = 40 mg/mL. 1 mL para cada 50 kg SC (0,8 mg/kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "percentage": 4,
    "bottleVolumeMl": 50
  },
  {
    "id": "ivercanis-comp-3",
    "brandName": "Ivercanis® 3 mg Comprimidos (Ucbvet)",
    "activePrinciple": "Ivermectina",
    "manufacturer": "Ucbvet",
    "category": "Antiparasitário Acaricida Oral",
    "formType": "tablet",
    "presentationText": "Cartucho com 4 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "Sarna sarcóptica/demodécica: 0,2 a 0,6 mg/kg uma vez ao dia ou semanal",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Contraindicado em cães das raças Collie, Pastor de Shetland, Border Collie e Australian Shepherd com mutação no gene MDR1.",
    "validationStatus": "VALIDADO",
    "tabletMg": 3,
    "tabletsPerBox": 4
  },
  {
    "id": "ivercanis-comp-6",
    "brandName": "Ivercanis® 6 mg Comprimidos (Ucbvet)",
    "activePrinciple": "Ivermectina",
    "manufacturer": "Ucbvet",
    "category": "Antiparasitário Acaricida Oral",
    "formType": "tablet",
    "presentationText": "Cartucho com 4 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.2
    },
    "doseRangeText": "0,2 a 0,4 mg/kg",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ucbvet. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 6,
    "tabletsPerBox": 4
  },
  {
    "id": "dectomax-inj-10",
    "brandName": "Dectomax® Injetável 1% (Zoetis)",
    "activePrinciple": "Doramectina",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Endectocida Injetável",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Bovino",
      "Ovino",
      "Suíno",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "bovino": 0.2,
      "ovino": 0.2,
      "suino": 0.3,
      "canino": 0.2
    },
    "doseRangeText": "Bovinos/Ovinos: 0,2 mg/kg SC ou IM | Cães: 0,2 a 0,4 mg/kg SC para sarna demodécica sob supervisão",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 50
  },
  {
    "id": "cydectin-inj-10",
    "brandName": "Cydectin® Injetável 1% (Zoetis)",
    "activePrinciple": "Moxidectina",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Endectocida de Segunda Geração",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Bovino",
      "Ovino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "0,2 mg/kg SC (1 mL para cada 50 kg)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "percentage": 1,
    "bottleVolumeMl": 50
  },
  {
    "id": "caninsulin-susp-40ui",
    "brandName": "Caninsulin® Suspensão Injetável 40 UI/mL (MSD Saúde Animal)",
    "activePrinciple": "Insulina Suína Altamente Purificada",
    "manufacturer": "MSD Saúde Animal",
    "category": "Insulina Veterinária Lenta (Canina & Felina)",
    "formType": "liquid",
    "presentationText": "Frasco com 2,5 mL ou 10 mL (40 UI/mL)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.25
    },
    "doseRangeText": "Dose inicial cães: 0,5 UI/kg uma vez ou duas vezes ao dia com a refeição | Gatos: 0,25 a 0,5 UI/kg BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Atenção crítica: Concentração de 40 UI/mL. Utilizar obrigatoriamente seringas vermelhas graduadas para U-40 para evitar erros letais.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 10
  },
  {
    "id": "prozinc-susp-40ui",
    "brandName": "ProZinc® Suspensão Injetável 40 UI/mL (Boehringer Ingelheim)",
    "activePrinciple": "Insulina Protamina Zinco Humana Recombinante",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Insulina Veterinária Específica para Gatos e Cães",
    "formType": "liquid",
    "presentationText": "Frasco com 10 mL (40 UI/mL)",
    "species": [
      "Felino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.25
    },
    "doseRangeText": "Gatos: dose inicial 0,2 a 0,4 UI/kg via SC a cada 12 horas imediatamente após refeição",
    "defaultFrequency": "BID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Insulina de longa ação padrão ouro no tratamento do diabetes mellitus felino. Utilizar seringas U-40.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 40,
    "bottleVolumeMl": 10
  },
  {
    "id": "lantus-inj-100ui",
    "brandName": "Lantus® Solução Injetável 100 UI/mL (Sanofi)",
    "activePrinciple": "Insulina Glargina",
    "manufacturer": "Sanofi",
    "category": "Insulina de Longa Duração sem Pico",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 10 mL (100 UI/mL)",
    "species": [
      "Felino",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.25
    },
    "doseRangeText": "Gatos diabéticos: 0,25 a 0,5 UI/kg a cada 12 horas SC com seringa U-100",
    "defaultFrequency": "BID",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Concentração 100 UI/mL. Utilizar obrigatoriamente seringas U-100. Alta taxa de remissão diabética em felinos.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 10
  },
  {
    "id": "vetoryl-caps-10",
    "brandName": "Vetoryl® 10 mg Cápsulas (Dechra)",
    "activePrinciple": "Trilostano",
    "manufacturer": "Dechra",
    "category": "Inibidor da Síntese de Cortisol (Cushing)",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 cápsulas",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "Dose inicial: 1 a 2 mg/kg uma vez ao dia pela manhã com o alimento",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Tratamento de referência para Hiperadrenocorticismo (Síndrome de Cushing) hipófise e adrenal-dependente. Monitorar com teste de ACTH.",
    "validationStatus": "VALIDADO",
    "tabletMg": 10,
    "tabletsPerBox": 30
  },
  {
    "id": "vetoryl-caps-30",
    "brandName": "Vetoryl® 30 mg Cápsulas (Dechra)",
    "activePrinciple": "Trilostano",
    "manufacturer": "Dechra",
    "category": "Inibidor da Síntese de Cortisol (Cushing)",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 cápsulas",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 a 2 mg/kg SID junto à comida",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Dechra. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 30,
    "tabletsPerBox": 30
  },
  {
    "id": "vetoryl-caps-60",
    "brandName": "Vetoryl® 60 mg Cápsulas (Dechra)",
    "activePrinciple": "Trilostano",
    "manufacturer": "Dechra",
    "category": "Inibidor da Síntese de Cortisol (Cushing)",
    "formType": "tablet",
    "presentationText": "Cartucho com 30 cápsulas",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 2
    },
    "doseRangeText": "1 a 2 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Dechra. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 60,
    "tabletsPerBox": 30
  },
  {
    "id": "leventa-oral-1mg",
    "brandName": "Leventa® Solução Oral 1 mg/mL (Virbac)",
    "activePrinciple": "Levotiroxina Sódica",
    "manufacturer": "Virbac",
    "category": "Hormônio Tireoidiano Líquido para Cães",
    "formType": "liquid",
    "presentationText": "Frasco com 30 mL com seringa dosadora graduada por peso",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.02
    },
    "doseRangeText": "Dose inicial: 0,02 mg/kg (20 mcg/kg) uma vez ao dia pela manhã em jejum",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Tratamento do hipotireoidismo canino. Solução líquida garante absorção uniforme e dosagem milimétrica.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 1,
    "bottleVolumeMl": 30
  },
  {
    "id": "forthyron-comp-200",
    "brandName": "Forthyron® 200 mcg Comprimidos Palatáveis (Dechra)",
    "activePrinciple": "Levotiroxina Sódica",
    "manufacturer": "Dechra",
    "category": "Hormônio Tireoidiano Palatável Divisível",
    "formType": "tablet",
    "presentationText": "Cartucho com 50 comprimidos quadrissectáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.02
    },
    "doseRangeText": "10 a 20 mcg/kg a cada 12 a 24 horas em jejum",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Dechra. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 0.2,
    "tabletsPerBox": 50
  },
  {
    "id": "forthyron-comp-400",
    "brandName": "Forthyron® 400 mcg Comprimidos Palatáveis (Dechra)",
    "activePrinciple": "Levotiroxina Sódica",
    "manufacturer": "Dechra",
    "category": "Hormônio Tireoidiano Palatável Divisível",
    "formType": "tablet",
    "presentationText": "Cartucho com 50 comprimidos quadrissectáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.02
    },
    "doseRangeText": "10 a 20 mcg/kg a cada 12 a 24 horas",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Dechra. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 0.4,
    "tabletsPerBox": 50
  },
  {
    "id": "felimazole-comp-25",
    "brandName": "Felimazole® 2,5 mg Comprimidos Revestidos (Dechra)",
    "activePrinciple": "Tiamazol (Metimazol)",
    "manufacturer": "Dechra",
    "category": "Antitireoidiano Específico para Gatos",
    "formType": "tablet",
    "presentationText": "Frasco com 100 comprimidos revestidos pequenos",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 0.625
    },
    "doseRangeText": "Dose inicial: 2,5 mg por gato a cada 12 horas (ou 1,25 mg BID em gatos idosos) com alimento",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Padrão ouro médico no hipertireoidismo felino. Monitorar função renal (ureia/creatinina) e T4 total a cada 3-4 semanas.",
    "validationStatus": "VALIDADO",
    "tabletMg": 2.5,
    "tabletsPerBox": 100
  },
  {
    "id": "felimazole-comp-5",
    "brandName": "Felimazole® 5 mg Comprimidos Revestidos (Dechra)",
    "activePrinciple": "Tiamazol (Metimazol)",
    "manufacturer": "Dechra",
    "category": "Antitireoidiano Específico para Gatos",
    "formType": "tablet",
    "presentationText": "Frasco com 100 comprimidos",
    "species": [
      "Felino"
    ],
    "defaultDoseMgKg": {
      "felino": 1.25
    },
    "doseRangeText": "2,5 a 5 mg por gato BID",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Dechra. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 5,
    "tabletsPerBox": 100
  },
  {
    "id": "galastop-oral-50mcg",
    "brandName": "Galastop® Solução Oral 50 mcg/mL (Ceva)",
    "activePrinciple": "Cabergolina",
    "manufacturer": "Ceva",
    "category": "Antiprolactínico & Tratamento de Pseudociese",
    "formType": "liquid",
    "presentationText": "Frasco com 15 mL com conta-gotas",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.005,
      "felino": 0.005
    },
    "doseRangeText": "5 mcg/kg (0,1 mL para cada kg de peso) uma vez ao dia com o alimento por 4 a 6 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Inibe prolactina rapidamente, cessando a lactação indesejada e os sintomas comportamentais de gravidez psicológica.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.05,
    "bottleVolumeMl": 15
  },
  {
    "id": "ocitocina-forte-ucb",
    "brandName": "Ocitocina Forte UCB® Injetável 10 UI/mL (Ourofino)",
    "activePrinciple": "Ocitocina Sintética",
    "manufacturer": "Ourofino",
    "category": "Hormônio Uterotônico & Ejeção do Leite",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mL",
    "species": [
      "Canino",
      "Felino",
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 3
    },
    "doseRangeText": "Inércia uterina primária/secundária: Celas: 2 a 10 UI IM ou SC | Gatas: 1 a 3 UI IM",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Confirmar previamente ausência de obstrução mecânica e canal pélvico pérvio antes de aplicar.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 50
  },
  {
    "id": "sincrocio-inj-20",
    "brandName": "Sincrocio® Injetável 0,075 mg/mL (Ourofino)",
    "activePrinciple": "D-Cloprostenol",
    "manufacturer": "Ourofino",
    "category": "Prostaglandina Sintética Luteolítica",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "Sincronização de estro e luteólise: Bovinos 2 mL IM | Equinos 1 mL IM",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intramuscular (IM)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ourofino. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.075,
    "bottleVolumeMl": 20
  },
  {
    "id": "lutalyse-inj-30",
    "brandName": "Lutalyse® Injetável 5 mg/mL (Zoetis)",
    "activePrinciple": "Dinoprost Trometamina",
    "manufacturer": "Zoetis",
    "category": "Prostaglandina Luteolítica Natural",
    "formType": "liquid",
    "presentationText": "Frasco com 30 mL",
    "species": [
      "Bovino",
      "Equino",
      "Suíno",
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.025,
      "bovino": 0.05,
      "equino": 0.011
    },
    "doseRangeText": "Cadelas (piometra de cérvix aberta): 0,025 a 0,05 mg/kg SC | Bovinos: 25 mg (5 mL) IM | Éguas: 5 mg (1 mL) IM",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "bottleVolumeMl": 30
  },
  {
    "id": "itranew-comp-25",
    "brandName": "Itranew® 25 mg Comprimidos (Ceva)",
    "activePrinciple": "Itraconazol",
    "manufacturer": "Ceva",
    "category": "Antifúngico Triazólico Sistêmico",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 a 10 mg/kg uma vez ao dia administrado junto a refeição rica em gordura",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Antifúngico de eleição para Esporotricose felina, dermatofitose e micoses profundas.",
    "validationStatus": "VALIDADO",
    "tabletMg": 25,
    "tabletsPerBox": 10
  },
  {
    "id": "itranew-comp-50",
    "brandName": "Itranew® 50 mg Comprimidos (Ceva)",
    "activePrinciple": "Itraconazol",
    "manufacturer": "Ceva",
    "category": "Antifúngico Triazólico Sistêmico",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 5,
      "felino": 5
    },
    "doseRangeText": "5 a 10 mg/kg SID junto com alimento",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 50,
    "tabletsPerBox": 10
  },
  {
    "id": "itranew-comp-100",
    "brandName": "Itranew® 100 mg Comprimidos (Ceva)",
    "activePrinciple": "Itraconazol",
    "manufacturer": "Ceva",
    "category": "Antifúngico Triazólico Sistêmico",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 5
    },
    "doseRangeText": "5 a 10 mg/kg SID",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Ceva. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 100,
    "tabletsPerBox": 10
  },
  {
    "id": "zoltec-caps-150",
    "brandName": "Zoltec® 150 mg Cápsulas (Pfizer)",
    "activePrinciple": "Fluconazol",
    "manufacturer": "Pfizer",
    "category": "Antifúngico Triazólico Hidrossolúvel",
    "formType": "tablet",
    "presentationText": "Cartucho com 2 cápsulas",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "5 a 15 mg/kg a cada 12 a 24 horas para criptococose e candidíase sistêmica",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Excelente penetração no líquor, olho e trato urinário por ser hidrossolúvel.",
    "validationStatus": "VALIDADO",
    "tabletMg": 150,
    "tabletsPerBox": 2
  },
  {
    "id": "fluconazol-bolsa-02",
    "brandName": "Fluconazol Solução para Infusão 2 mg/mL (Eurofarma)",
    "activePrinciple": "Fluconazol",
    "manufacturer": "Eurofarma",
    "category": "Antifúngico Sistêmico Hospitalar",
    "formType": "liquid",
    "presentationText": "Bolsa de 100 mL (200 mg total)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "5 a 10 mg/kg IV lenta a cada 12 a 24 horas",
    "defaultFrequency": "SID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Eurofarma. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 2,
    "bottleVolumeMl": 100
  },
  {
    "id": "chemiconazol-comp-200",
    "brandName": "Chemiconazol® 200 mg Comprimidos (Chemitec)",
    "activePrinciple": "Cetoconazol",
    "manufacturer": "Chemitec",
    "category": "Antifúngico Imidazólico",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 10
    },
    "doseRangeText": "5 a 10 mg/kg a cada 12 a 24 horas com comida",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Chemitec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 200,
    "tabletsPerBox": 10
  },
  {
    "id": "cetoconazol-vansil-200",
    "brandName": "Cetoconazol Vansil® 200 mg Comprimidos (Vansil)",
    "activePrinciple": "Cetoconazol",
    "manufacturer": "Vansil",
    "category": "Antifúngico Imidazólico",
    "formType": "tablet",
    "presentationText": "Cartucho com 10 comprimidos",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 10
    },
    "doseRangeText": "10 mg/kg SID com refeição",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vansil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 200,
    "tabletsPerBox": 10
  },
  {
    "id": "lamisil-comp-250",
    "brandName": "Lamisil® 250 mg Comprimidos (Novartis)",
    "activePrinciple": "Cloridrato de Terbinafina",
    "manufacturer": "Novartis",
    "category": "Antifúngico Alilamina Sistêmico",
    "formType": "tablet",
    "presentationText": "Cartucho com 14 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 30,
      "felino": 30
    },
    "doseRangeText": "20 a 40 mg/kg uma vez ao dia para Malassezia recalcitrante e dermatofitose",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Novartis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 250,
    "tabletsPerBox": 14
  },
  {
    "id": "anforicin-inj-50",
    "brandName": "Anforicin® Injetável 50 mg Frasco-Ampola (Cristália)",
    "activePrinciple": "Anfotericina B Desoxicolato",
    "manufacturer": "Cristália",
    "category": "Antifúngico Poliênico Hospitalar de Resgate",
    "formType": "liquid",
    "presentationText": "Frasco com 50 mg de pó liofilizado",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,25 a 0,5 mg/kg em infusão lenta de glicose 5% (correr em 4-6h) 3 vezes por semana monitorando rins",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Antifúngico potente para infecções fúngicas sistêmicas refratárias (histoplasmose, blastomicose). Diluir apenas em Glicose 5%.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 5,
    "bottleVolumeMl": 10
  },
  {
    "id": "tobradex-colirio-5",
    "brandName": "Tobradex® Colírio Oftálmico (5 mL) (Alcon)",
    "activePrinciple": "Tobramicina 0,3% + Dexametasona 0,1%",
    "manufacturer": "Alcon",
    "category": "Colírio Antibiótico & Anti-inflamatório",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 5 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 a 2 gotas no olho afetado a cada 6 a 8 horas",
    "defaultFrequency": "QID",
    "defaultRoute": "Tópica Oftálmica",
    "clinicalNotes": "Contraindicado terminantemente se houver úlcera de córnea ativa (teste de fluoresceína positivo).",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 5
  },
  {
    "id": "vigamox-colirio-5",
    "brandName": "Vigamox® Colírio Oftálmico 0,5% (Alcon)",
    "activePrinciple": "Cloridrato de Moxifloxacino",
    "manufacturer": "Alcon",
    "category": "Colírio Fluoroquinolona 4ª Geração",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 5 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 gota no olho afetado a cada 4 a 6 horas para conjuntivites e ceratites bacterianas severas",
    "defaultFrequency": "QID",
    "defaultRoute": "Tópica Oftálmica",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Alcon. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 5
  },
  {
    "id": "ciloxan-colirio-5",
    "brandName": "Ciloxan® Colírio Oftálmico 0,3% (Alcon)",
    "activePrinciple": "Cloridrato de Ciprofloxacino",
    "manufacturer": "Alcon",
    "category": "Colírio Fluoroquinolona",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas com 5 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 a 2 gotas a cada 6 horas",
    "defaultFrequency": "QID",
    "defaultRoute": "Tópica Oftálmica",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Alcon. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 5
  },
  {
    "id": "ciprovet-colirio-5",
    "brandName": "Ciprovet® Colírio Oftálmico com Cicatrizante (König)",
    "activePrinciple": "Ciprofloxacino 0,3% + Condroitina A 20%",
    "manufacturer": "König",
    "category": "Colírio Antibacteriano & Cicatrizante Corneano",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas com 5 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 gota a cada 6 a 8 horas. Sulfato de condroitina estimula a regeneração epitelial da córnea",
    "defaultFrequency": "TID",
    "defaultRoute": "Tópica Oftálmica",
    "clinicalNotes": "Seguro em úlceras de córnea superficiais por não conter corticosteroide e possuir condroitina cicatrizante.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 5
  },
  {
    "id": "otomax-pomada-14",
    "brandName": "Otomax® Pomada Otológica (14 g) (Elanco)",
    "activePrinciple": "Gentamicina + Betametasona + Clotrimazol",
    "manufacturer": "Elanco",
    "category": "Pomada Otológica Tripla Ação",
    "formType": "topical",
    "presentationText": "Bisnaga com cânula aplicadora de 14 g",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "Cães até 15 kg: 4 gotas no conduto auditivo BID | Cães > 15 kg: 8 gotas BID por 7 a 14 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Tópica Otológica",
    "clinicalNotes": "Avaliar integridade da membrana timpânica antes do uso. Limpar previamente o cerúmen.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 14
  },
  {
    "id": "posatex-susp-88",
    "brandName": "Posatex® Suspensão Otológica (8,8 mL) (Zoetis)",
    "activePrinciple": "Orbifloxacino + Mometasona + Posaconazol",
    "manufacturer": "Zoetis",
    "category": "Suspensão Otológica de Amplo Espectro",
    "formType": "drops",
    "presentationText": "Frasco dosador de 8,8 mL",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "Cães até 12 kg: 4 gotas uma vez ao dia (SID) | Cães > 12 kg: 8 gotas SID por 7 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Tópica Otológica",
    "clinicalNotes": "Posologia prática em dose única diária (SID). Mometasona potente com menor efeito colateral que betametasona.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 8.8
  },
  {
    "id": "easotic-susp-10",
    "brandName": "Easotic® Suspensão Otológica Dosadora (10 mL) (Ceva)",
    "activePrinciple": "Hidrocortisona Aceponato + Miconazol + Gentamicina",
    "manufacturer": "Ceva",
    "category": "Solução Otológica com Bomba Dosadora Ergonômica",
    "formType": "topical",
    "presentationText": "Frasco com aplicador dosador de 10 mL (1 mL por jato)",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 pressão do bico dosador (exatamente 1 mL) em cada ouvido afetado uma vez ao dia por 5 dias",
    "defaultFrequency": "SID",
    "defaultRoute": "Tópica Otológica",
    "clinicalNotes": "Frasco anatômico que aplica exatamente 1 mL em qualquer ângulo, facilitando o manejo do tutor.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 10
  },
  {
    "id": "aurivet-pomada-13",
    "brandName": "Aurivet® Pomada Otológica (13 g) (Agener União)",
    "activePrinciple": "Cloranfenicol + Betametasona + Benzocaína + Tiabendazol",
    "manufacturer": "Agener União",
    "category": "Pomada Otológica Completa",
    "formType": "topical",
    "presentationText": "Bisnaga com 13 g com bico aplicador flexível",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "4 a 8 gotas no canal auditivo a cada 12 horas por 7 a 10 dias consecutivos",
    "defaultFrequency": "BID",
    "defaultRoute": "Tópica Otológica",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Agener União. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 13
  },
  {
    "id": "auritop-gel-30",
    "brandName": "Auritop® Gel Otológico (30 g) (Vetnil)",
    "activePrinciple": "Ciprofloxacino + Cetoconazol + Fluocinolona + Lidocaína",
    "manufacturer": "Vetnil",
    "category": "Gel Otológico com Anestésico Local",
    "formType": "topical",
    "presentationText": "Bisnaga com 30 g com aplicador",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "Aplicar no canal auditivo a cada 12 horas por 7 a 9 dias",
    "defaultFrequency": "BID",
    "defaultRoute": "Tópica Otológica",
    "clinicalNotes": "Contém lidocaína que alivia a dor e o desconforto imediato da otite aguda.",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 30
  },
  {
    "id": "bricanyl-xarope-03",
    "brandName": "Bricanyl® Xarope 0,3 mg/mL (AstraZeneca)",
    "activePrinciple": "Sulfato de Terbutalina",
    "manufacturer": "AstraZeneca",
    "category": "Broncodilatador Beta-2 Agonista Oral",
    "formType": "liquid",
    "presentationText": "Frasco com 100 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.05,
      "felino": 0.05
    },
    "doseRangeText": "0,03 a 0,05 mg/kg a cada 8 a 12 horas para bronquite alérgica e asma felina",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório AstraZeneca. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.3,
    "bottleVolumeMl": 100
  },
  {
    "id": "bricanyl-inj-05",
    "brandName": "Bricanyl® Injetável 0,5 mg/mL (AstraZeneca)",
    "activePrinciple": "Sulfato de Terbutalina",
    "manufacturer": "AstraZeneca",
    "category": "Broncodilatador Beta-2 de Emergência",
    "formType": "liquid",
    "presentationText": "Ampola com 1 mL (0,5 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.01,
      "felino": 0.01
    },
    "doseRangeText": "Crise asmática aguda: 0,01 mg/kg SC, IM ou IV lento",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Subcutânea (SC)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório AstraZeneca. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 0.5,
    "bottleVolumeMl": 1
  },
  {
    "id": "aerolin-spray-100",
    "brandName": "Aerolin® Spray Inalatório 100 mcg/dose (GlaxoSmithKline (GSK))",
    "activePrinciple": "Sulfato de Salbutamol",
    "manufacturer": "GlaxoSmithKline (GSK)",
    "category": "Broncodilatador Inalatório de Ação Rápida",
    "formType": "spray",
    "presentationText": "Frasco com 200 doses acompanhado de atuador",
    "species": [
      "Felino",
      "Canino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 a 2 jatos inalatórios com espaçador pediátrico (AeroKat) durante broncoespasmo agudo",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Inalatória",
    "clinicalNotes": "Alívio rápido de broncoespasmo em asma felina. Utilizar com máscara e câmara espaçadora apropriada (AeroKat).",
    "validationStatus": "VALIDADO",
    "bottleVolumeMl": 200
  },
  {
    "id": "aminofilina-hipolabor-24",
    "brandName": "Aminofilina Injetável 24 mg/mL (Hipolabor)",
    "activePrinciple": "Aminofilina",
    "manufacturer": "Hipolabor",
    "category": "Broncodilatador Metilxantina Hospitalar",
    "formType": "liquid",
    "presentationText": "Ampola de 10 mL (240 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 8,
      "felino": 5
    },
    "doseRangeText": "Cães: 6 a 10 mg/kg IV lenta diluída em soro a cada 8h | Gatos: 4 a 6 mg/kg IV lenta",
    "defaultFrequency": "TID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Hipolabor. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 24,
    "bottleVolumeMl": 10
  },
  {
    "id": "fluimucil-gotas-200",
    "brandName": "Fluimucil® Solução Oral Gotas 200 mg/mL (Zambon)",
    "activePrinciple": "Acetilcisteína",
    "manufacturer": "Zambon",
    "category": "Mucolítico & Antídoto para Paracetamol",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 15 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 10,
      "felino": 10
    },
    "doseRangeText": "Mucolítico: 5 a 10 mg/kg VO BID | Intoxicação por paracetamol: 140 mg/kg ataque seguido de 70 mg/kg a cada 4h por 72h",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Antídoto vital e específico para intoxicação acidental por Paracetamol (Acetaminofeno) em felinos e cães.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 200,
    "bottleVolumeMl": 15
  },
  {
    "id": "fluimucil-inj-10",
    "brandName": "Fluimucil® Injetável 10% (100 mg/mL) (Zambon)",
    "activePrinciple": "Acetilcisteína",
    "manufacturer": "Zambon",
    "category": "Antídoto Hospitalar Injetável",
    "formType": "liquid",
    "presentationText": "Ampola de 3 mL (300 mg)",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 140,
      "felino": 140
    },
    "doseRangeText": "Intoxicação por paracetamol: dose de ataque 140 mg/kg IV em glicose 5%, depois 70 mg/kg IV a cada 4h por 17 doses",
    "defaultFrequency": "QID",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zambon. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "percentage": 10,
    "bottleVolumeMl": 3
  },
  {
    "id": "hemolitan-pet-comp",
    "brandName": "Hemolitan® Pet Comprimidos (Vetnil)",
    "activePrinciple": "Complexo Hematopoiético & Minerais Quelatados",
    "manufacturer": "Vetnil",
    "category": "Suplemento Vitamínico & Hematopoiético",
    "formType": "tablet",
    "presentationText": "Frasco com 30 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 comprimido para cada 10 kg de peso corporal a cada 12 a 24 horas",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1,
    "tabletsPerBox": 30
  },
  {
    "id": "hemolitan-pet-gotas",
    "brandName": "Hemolitan® Pet Gotas (Vetnil)",
    "activePrinciple": "Complexo Hematopoiético & Vitaminas do Complexo B",
    "manufacturer": "Vetnil",
    "category": "Suplemento Vitamínico & Hematopoiético",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas com 30 mL ou 60 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 gota para cada 1 kg de peso a cada 12 horas (BID) para suporte em anemias",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 30
  },
  {
    "id": "glicopan-pet-gotas",
    "brandName": "Glicopan Pet® Gotas (Vetnil)",
    "activePrinciple": "Aminoácidos, Vitaminas do Complexo B & Glicose",
    "manufacturer": "Vetnil",
    "category": "Suplemento Nutricional Energético & Tônico",
    "formType": "drops",
    "presentationText": "Frasco conta-gotas de 125 mL",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 0.5,
      "felino": 0.5
    },
    "doseRangeText": "0,5 mL (ou 15 gotas) por kg de peso duas vezes ao dia diretamente na boca",
    "defaultFrequency": "BID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 100,
    "bottleVolumeMl": 125
  },
  {
    "id": "condroton-comp-500",
    "brandName": "Condroton® 500 mg Comprimidos (Vetnil)",
    "activePrinciple": "Sulfato de Condroitina + Glicosamina",
    "manufacturer": "Vetnil",
    "category": "Regenerador Articular & Condroprotetor",
    "formType": "tablet",
    "presentationText": "Frasco com 60 comprimidos palatáveis",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "Cães até 5 kg: 1 comp/dia | 5 a 10 kg: 1 comp BID nas primeiras semanas",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 500,
    "tabletsPerBox": 60
  },
  {
    "id": "condroton-comp-1000",
    "brandName": "Condroton® 1000 mg Comprimidos (Vetnil)",
    "activePrinciple": "Sulfato de Condroitina + Glicosamina",
    "manufacturer": "Vetnil",
    "category": "Regenerador Articular & Condroprotetor",
    "formType": "tablet",
    "presentationText": "Frasco com 60 comprimidos palatáveis",
    "species": [
      "Canino"
    ],
    "defaultDoseMgKg": {
      "canino": 1
    },
    "doseRangeText": "1 comprimido para cada 10 a 20 kg de peso corporal",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1000,
    "tabletsPerBox": 6
  },
  {
    "id": "hepvet-comp-30",
    "brandName": "Hepvet® Comprimidos (Vetnil)",
    "activePrinciple": "Extrato de Cardo Mariano (Silimarina) + Nutrientes Hepáticos",
    "manufacturer": "Vetnil",
    "category": "Hepatoprotetor & Antioxidante Hepático",
    "formType": "tablet",
    "presentationText": "Frasco com 30 comprimidos",
    "species": [
      "Canino",
      "Felino"
    ],
    "defaultDoseMgKg": {
      "canino": 1,
      "felino": 1
    },
    "doseRangeText": "1 comprimido para cada 10 kg de peso ao dia",
    "defaultFrequency": "SID",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Vetnil. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "tabletMg": 1,
    "tabletsPerBox": 30
  },
  {
    "id": "calfoz-inj-500",
    "brandName": "Calfoz® Injetável 500 mL (Zoetis)",
    "activePrinciple": "Gluconato de Cálcio + Hipofosfito + Glicose",
    "manufacturer": "Zoetis",
    "category": "Suplemento Mineral & Metabólico (Febre do Leite)",
    "formType": "liquid",
    "presentationText": "Frasco com 500 mL acompanhado de equipo",
    "species": [
      "Bovino",
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "Hipocalcemia / Febre vitular: 250 a 500 mL IV lento ou SC",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 200,
    "bottleVolumeMl": 500
  },
  {
    "id": "equalan-pasta-642",
    "brandName": "Equalan® Pasta Equina (6,42 g) (Boehringer Ingelheim)",
    "activePrinciple": "Ivermectina 1,87%",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Pasta Oral para Equinos",
    "formType": "paste",
    "presentationText": "Seringa dosadora com 6,42 g graduada por peso corporal",
    "species": [
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "0,2 mg/kg VO (1 seringa trata até 600 kg de peso vivo em dose única)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 18.7,
    "percentage": 1.87,
    "bottleVolumeMl": 6.42
  },
  {
    "id": "equalan-duo-pasta",
    "brandName": "Equalan Duo® Pasta Equina (Boehringer Ingelheim)",
    "activePrinciple": "Ivermectina 1,87% + Praziquantel 14,03%",
    "manufacturer": "Boehringer Ingelheim",
    "category": "Antiparasitário Equino Completo (Vermes e Tênias)",
    "formType": "paste",
    "presentationText": "Seringa com 7,74 g graduada para até 600 kg",
    "species": [
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "1 seringa para 600 kg de peso em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Boehringer Ingelheim. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "percentage": 15.9,
    "bottleVolumeMl": 7.74
  },
  {
    "id": "quest-gel-equino",
    "brandName": "Quest Gel® Equino 2% (Zoetis)",
    "activePrinciple": "Moxidectina 2%",
    "manufacturer": "Zoetis",
    "category": "Antiparasitário Gel Oral de Longa Duração para Equinos",
    "formType": "paste",
    "presentationText": "Seringa dosadora com 14,4 g (trata até 700 kg)",
    "species": [
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "0,4 mg/kg VO em dose única",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "percentage": 2,
    "bottleVolumeMl": 14.4
  },
  {
    "id": "panacur-pasta-equina",
    "brandName": "Panacur® Pasta Equina 18,75% (MSD Saúde Animal)",
    "activePrinciple": "Fenbendazol",
    "manufacturer": "MSD Saúde Animal",
    "category": "Antiparasitário Anti-helmíntico Benzimidazol",
    "formType": "paste",
    "presentationText": "Seringa com 24 g",
    "species": [
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "7,5 mg/kg VO dose única (ou 10 mg/kg SID por 5 dias para ciatostomíneos encistados)",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Oral (VO)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório MSD Saúde Animal. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "percentage": 18.75,
    "bottleVolumeMl": 24
  },
  {
    "id": "detomidina-syntec-10",
    "brandName": "Detomidina Syntec® Injetável 10 mg/mL (Syntec)",
    "activePrinciple": "Cloridrato de Detomidina",
    "manufacturer": "Syntec",
    "category": "Sedativo Alfa-2 Agonista Potente para Equinos",
    "formType": "liquid",
    "presentationText": "Frasco-ampola com 20 mL",
    "species": [
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "Equinos: 10 a 40 mcg/kg (0,01 a 0,04 mg/kg) IV ou IM para sedação profunda e alívio de cólica",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Syntec. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 20
  },
  {
    "id": "domosedan-inj-10",
    "brandName": "Domosedan® Injetável 10 mg/mL (Zoetis)",
    "activePrinciple": "Cloridrato de Detomidina",
    "manufacturer": "Zoetis",
    "category": "Sedativo e Analgésico Alfa-2 para Equinos",
    "formType": "liquid",
    "presentationText": "Frasco com 5 mL ou 20 mL",
    "species": [
      "Equino"
    ],
    "defaultDoseMgKg": {},
    "doseRangeText": "10 a 40 mcg/kg IV ou IM",
    "defaultFrequency": "Dose Única",
    "defaultRoute": "Intravenosa (IV)",
    "clinicalNotes": "Produto registrado oficialmente pelo laboratório Zoetis. Respeitar indicações e contraindicações de bula.",
    "validationStatus": "VALIDADO",
    "concentrationMgMl": 10,
    "bottleVolumeMl": 20
  }
];
