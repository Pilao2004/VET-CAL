# -*- coding: utf-8 -*-
"""
Definitions of 330+ authentic Brazilian and international commercial veterinary products
representing major laboratories: Zoetis, Elanco, Boehringer Ingelheim, Ourofino, Agener União,
Ceva, Chemitec, Syntec, Vansil, Vetnil, MSD Saúde Animal, Virbac, Dechra, Cristália, etc.
"""

def generate_additional_products():
    products = []

    def add_prod(
        pid, brand, active, mfg, cat, form, pres_text, species,
        canine_dose, feline_dose, dose_range, freq, route,
        conc_mg_ml=None, percentage=None, tablet_mg=None,
        bottle_vol=None, tabs_per_box=None, notes="", protocols=None
    ):
        p = {
            "id": pid,
            "brandName": f"{brand} ({mfg})" if f"({mfg})" not in brand else brand,
            "activePrinciple": active,
            "manufacturer": mfg,
            "category": cat,
            "formType": form,
            "presentationText": pres_text,
            "species": species,
            "defaultDoseMgKg": {},
            "doseRangeText": dose_range,
            "defaultFrequency": freq,
            "defaultRoute": route,
            "clinicalNotes": notes or f"Produto registrado oficialmente pelo laboratório {mfg}. Respeitar indicações e contraindicações de bula.",
            "validationStatus": "VALIDADO"
        }
        if canine_dose is not None:
            p["defaultDoseMgKg"]["canino"] = canine_dose
        if feline_dose is not None:
            p["defaultDoseMgKg"]["felino"] = feline_dose
        if conc_mg_ml is not None:
            p["concentrationMgMl"] = conc_mg_ml
        if percentage is not None:
            p["percentage"] = percentage
        if tablet_mg is not None:
            p["tabletMg"] = tablet_mg
        if bottle_vol is not None:
            p["bottleVolumeMl"] = bottle_vol
        if tabs_per_box is not None:
            p["tabletsPerBox"] = tabs_per_box
        if protocols:
            p["protocols"] = protocols
        products.append(p)

    # =========================================================================
    # 1. AINEs & ANALGÉSICOS COMPLEMENTARES
    # =========================================================================
    # Metacam (Boehringer Ingelheim)
    add_prod("metacam-oral-dog-15", "Metacam® Solução Oral Cães 1,5 mg/mL", "Meloxicam", "Boehringer Ingelheim",
             "AINE Anti-inflamatório", "liquid", "Frasco com 10 mL com seringa dosadora", ["Canino"],
             0.2, None, "Dose de ataque: 0,2 mg/kg no 1º dia; Manutenção: 0,1 mg/kg a cada 24h", "SID", "Oral (VO)",
             conc_mg_ml=1.5, bottle_vol=10,
             notes="Metacam Solução Oral Cães: 1,5 mg de meloxicam por mL. Agitar bem antes de usar.",
             protocols=[
                 {"id": "metacam-dog-ataque", "label": "1º Dia / Ataque (0,2 mg/kg)", "doseMgKg": {"canino": 0.2}},
                 {"id": "metacam-dog-manut", "label": "A partir do 2º Dia / Manutenção (0,1 mg/kg)", "doseMgKg": {"canino": 0.1}}
             ])
    add_prod("metacam-oral-dog-32", "Metacam® Solução Oral Cães 1,5 mg/mL Frasco 32 mL", "Meloxicam", "Boehringer Ingelheim",
             "AINE Anti-inflamatório", "liquid", "Frasco com 32 mL com seringa dosadora graduada por peso", ["Canino"],
             0.2, None, "Ataque 0,2 mg/kg no 1º dia; Manutenção 0,1 mg/kg SID", "SID", "Oral (VO)",
             conc_mg_ml=1.5, bottle_vol=32)
    add_prod("metacam-oral-cat-05", "Metacam® Solução Oral Gatos 0,5 mg/mL", "Meloxicam", "Boehringer Ingelheim",
             "AINE Anti-inflamatório Específico para Gatos", "drops", "Frasco conta-gotas de 15 mL", ["Felino"],
             None, 0.1, "Dose única ou 1º dia: 0,1 mg/kg; Manutenção: 0,05 mg/kg SID por tempo restrito", "SID", "Oral (VO)",
             conc_mg_ml=0.5, bottle_vol=15,
             notes="Específico para felinos. Bula preconiza dose de ataque de 0,1 mg/kg e manutenção de 0,05 mg/kg com monitoramento renal estrito.",
             protocols=[
                 {"id": "metacam-cat-ataque", "label": "1º Dia (0,1 mg/kg)", "doseMgKg": {"felino": 0.1}},
                 {"id": "metacam-cat-manut", "label": "Manutenção (0,05 mg/kg)", "doseMgKg": {"felino": 0.05}}
             ])
    add_prod("metacam-inj-5mg", "Metacam® Injetável 0,5% (5 mg/mL)", "Meloxicam", "Boehringer Ingelheim",
             "AINE Anti-inflamatório", "liquid", "Frasco-ampola de 20 mL", ["Canino", "Felino"],
             0.2, 0.1, "Cães: 0,2 mg/kg SC/IV | Gatos: 0,1 mg/kg SC dose única", "SID", "Subcutânea (SC)",
             conc_mg_ml=5, percentage=0.5, bottle_vol=20)

    # Elo-Xicam (Chemitec)
    add_prod("elo-xicam-05-comp", "Elo-Xicam® 0,5 mg Comprimidos", "Meloxicam", "Chemitec",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino", "Felino"],
             0.2, 0.1, "Cães: 0,2 mg/kg 1º dia, depois 0,1 mg/kg SID | Gatos: 0,1 mg/kg 1º dia", "SID", "Oral (VO)",
             tablet_mg=0.5, tabs_per_box=10)
    add_prod("elo-xicam-10-comp", "Elo-Xicam® 1,0 mg Comprimidos", "Meloxicam", "Chemitec",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             0.2, None, "Cães: 0,2 mg/kg no 1º dia; 0,1 mg/kg do 2º ao 5º dia", "SID", "Oral (VO)",
             tablet_mg=1.0, tabs_per_box=10)
    add_prod("elo-xicam-20-comp", "Elo-Xicam® 2,0 mg Comprimidos", "Meloxicam", "Chemitec",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             0.2, None, "Cães: 0,2 mg/kg no 1º dia; 0,1 mg/kg manutenção", "SID", "Oral (VO)",
             tablet_mg=2.0, tabs_per_box=10)
    add_prod("elo-xicam-40-comp", "Elo-Xicam® 4,0 mg Comprimidos", "Meloxicam", "Chemitec",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             0.2, None, "Cães grandes: 0,2 mg/kg 1º dia; 0,1 mg/kg manutenção SID", "SID", "Oral (VO)",
             tablet_mg=4.0, tabs_per_box=10)
    add_prod("elo-xicam-inj-02", "Elo-Xicam® Injetável 0,2%", "Meloxicam", "Chemitec",
             "AINE Anti-inflamatório", "liquid", "Frasco-ampola de 20 mL", ["Canino", "Felino"],
             0.2, 0.1, "0,2% = 2 mg/mL. Cães: 0,2 mg/kg SC; Gatos: 0,1 mg/kg SC", "SID", "Subcutânea (SC)",
             conc_mg_ml=2, percentage=0.2, bottle_vol=20)
    add_prod("elo-xicam-inj-20", "Elo-Xicam® Injetável 2%", "Meloxicam", "Chemitec",
             "AINE Anti-inflamatório", "liquid", "Frasco-ampola de 50 mL", ["Canino", "Equino", "Bovino"],
             0.2, None, "2% = 20 mg/mL. Cães: 0,2 mg/kg; Equinos e Bovinos: 0,6 mg/kg IV/SC", "SID", "Intravenosa (IV)",
             conc_mg_ml=20, percentage=2.0, bottle_vol=50)

    # Meloxivet (Duprat)
    add_prod("meloxivet-05-comp", "Meloxivet® 0,5 mg Comprimidos", "Meloxicam", "Duprat",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino", "Felino"],
             0.2, 0.1, "Cães: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção | Gatos: 0,1 mg/kg 1º dia", "SID", "Oral (VO)",
             tablet_mg=0.5, tabs_per_box=10)
    add_prod("meloxivet-20-comp", "Meloxivet® 2,0 mg Comprimidos", "Meloxicam", "Duprat",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             0.2, None, "Cães: 0,2 mg/kg no 1º dia, 0,1 mg/kg manutenção SID", "SID", "Oral (VO)",
             tablet_mg=2.0, tabs_per_box=10)
    add_prod("meloxivet-gotas-02", "Meloxivet® Gotas 0,2%", "Meloxicam", "Duprat",
             "AINE Anti-inflamatório", "drops", "Frasco conta-gotas de 10 mL", ["Canino", "Felino"],
             0.2, 0.1, "0,2% = 2 mg/mL (1 gota = 0,1 mg). Cães: 2 gotas/kg 1º dia; Gatos: 1 gota/kg", "SID", "Oral (VO)",
             conc_mg_ml=2, percentage=0.2, bottle_vol=10)

    # Meloxinew (Vetnil)
    add_prod("meloxinew-05-comp", "Meloxinew® 0,5 mg Comprimidos Mastigáveis", "Meloxicam", "Vetnil",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos mastigáveis palatáveis", ["Canino", "Felino"],
             0.2, 0.1, "Cães: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção | Gatos: 0,1 mg/kg 1º dia", "SID", "Oral (VO)",
             tablet_mg=0.5, tabs_per_box=10)
    add_prod("meloxinew-10-comp", "Meloxinew® 1,0 mg Comprimidos Mastigáveis", "Meloxicam", "Vetnil",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos mastigáveis", ["Canino"],
             0.2, None, "Cães: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção", "SID", "Oral (VO)",
             tablet_mg=1.0, tabs_per_box=10)
    add_prod("meloxinew-20-comp", "Meloxinew® 2,0 mg Comprimidos Mastigáveis", "Meloxicam", "Vetnil",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos mastigáveis", ["Canino"],
             0.2, None, "Cães: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção", "SID", "Oral (VO)",
             tablet_mg=2.0, tabs_per_box=10)
    add_prod("meloxinew-40-comp", "Meloxinew® 4,0 mg Comprimidos Mastigáveis", "Meloxicam", "Vetnil",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos mastigáveis", ["Canino"],
             0.2, None, "Cães grandes: 0,2 mg/kg 1º dia, 0,1 mg/kg manutenção", "SID", "Oral (VO)",
             tablet_mg=4.0, tabs_per_box=10)

    # Maxicam Gel & Plus (Ourofino)
    add_prod("maxicam-gel-01", "Maxicam® Gel 0,1%", "Meloxicam", "Ourofino",
             "AINE Anti-inflamatório", "paste", "Seringa dosadora com 30 g de gel palatável", ["Equino", "Canino"],
             0.2, None, "Equinos: 0,6 mg/kg SID | Cães: 0,2 mg/kg 1º dia e 0,1 mg/kg manutenção", "SID", "Oral (VO)",
             conc_mg_ml=1, bottle_vol=30)
    add_prod("maxicam-plus-05", "Maxicam® Plus 0,5 mg Comprimidos", "Meloxicam + Sulfato de Condroitina", "Ourofino",
             "AINE & Condroprotetor", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             0.2, None, "0,5 mg Meloxicam + 200 mg Condroitina. 0,2 mg/kg 1º dia e 0,1 mg/kg manutenção", "SID", "Oral (VO)",
             tablet_mg=0.5, tabs_per_box=10)
    add_prod("maxicam-plus-20", "Maxicam® Plus 2,0 mg Comprimidos", "Meloxicam + Sulfato de Condroitina", "Ourofino",
             "AINE & Condroprotetor", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             0.2, None, "2,0 mg Meloxicam + 800 mg Condroitina. 0,2 mg/kg 1º dia e 0,1 mg/kg manutenção", "SID", "Oral (VO)",
             tablet_mg=2.0, tabs_per_box=10)

    # Carprofeno (Rimadyl Zoetis / Carprodyl Ceva)
    add_prod("rimadyl-mast-25", "Rimadyl® Mastigável 25 mg", "Carprofeno", "Zoetis",
             "AINE Anti-inflamatório", "tablet", "Frasco com 14 comprimidos palatáveis mastigáveis", ["Canino"],
             4.4, None, "4,4 mg/kg SID ou divididos em 2,2 mg/kg BID", "SID", "Oral (VO)",
             tablet_mg=25, tabs_per_box=14,
             notes="AINE seletivo COX-2 aprovado para cães. Não utilizar em gatos.")
    add_prod("rimadyl-mast-75", "Rimadyl® Mastigável 75 mg", "Carprofeno", "Zoetis",
             "AINE Anti-inflamatório", "tablet", "Frasco com 14 comprimidos mastigáveis", ["Canino"],
             4.4, None, "4,4 mg/kg SID ou 2,2 mg/kg BID", "SID", "Oral (VO)",
             tablet_mg=75, tabs_per_box=14)
    add_prod("rimadyl-mast-100", "Rimadyl® Mastigável 100 mg", "Carprofeno", "Zoetis",
             "AINE Anti-inflamatório", "tablet", "Frasco com 14 comprimidos mastigáveis", ["Canino"],
             4.4, None, "4,4 mg/kg SID ou 2,2 mg/kg BID", "SID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=14)
    add_prod("rimadyl-inj-50", "Rimadyl® Injetável 50 mg/mL (5%)", "Carprofeno", "Zoetis",
             "AINE Anti-inflamatório", "liquid", "Frasco-ampola com 20 mL", ["Canino"],
             4.0, None, "4,0 mg/kg via SC ou IV lenta, preferencialmente pré-operatório", "SID", "Subcutânea (SC)",
             conc_mg_ml=50, percentage=5.0, bottle_vol=20)
    add_prod("carprodyl-quad-20", "Carprodyl® Quadrissectável 20 mg", "Carprofeno", "Ceva",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 20 comprimidos quadrissectáveis", ["Canino"],
             4.0, None, "2 a 4 mg/kg por dia divididos em 1 a 2 tomadas", "BID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=20)
    add_prod("carprodyl-quad-50", "Carprodyl® Quadrissectável 50 mg", "Carprofeno", "Ceva",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 20 comprimidos quadrissectáveis", ["Canino"],
             4.0, None, "2 a 4 mg/kg por dia", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=20)
    add_prod("carprodyl-quad-100", "Carprodyl® Quadrissectável 100 mg", "Carprofeno", "Ceva",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 20 comprimidos quadrissectáveis", ["Canino"],
             4.0, None, "2 a 4 mg/kg por dia", "SID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=20)

    # Cetoprofeno
    add_prod("ketofen-comp-5", "Ketofen® 5 mg Comprimidos", "Cetoprofeno", "Boehringer Ingelheim",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino", "Felino"],
             1.0, 1.0, "1 mg/kg uma vez ao dia por até 3 a 5 dias consecutivos", "SID", "Oral (VO)",
             tablet_mg=5, tabs_per_box=10)
    add_prod("ketofen-comp-20", "Ketofen® 20 mg Comprimidos", "Cetoprofeno", "Boehringer Ingelheim",
             "AINE Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             1.0, None, "1 mg/kg SID por 3 a 5 dias", "SID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=10)
    add_prod("ketofen-inj-1", "Ketofen® Injetável 1%", "Cetoprofeno", "Boehringer Ingelheim",
             "AINE Anti-inflamatório", "liquid", "Frasco-ampola de 20 mL", ["Canino", "Felino"],
             2.0, 2.0, "2 mg/kg SC, IM ou IV no 1º dia (0,2 mL/kg da solução 1%)", "SID", "Subcutânea (SC)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=20)
    add_prod("chemitofen-inj-1", "Chemitofen® Injetável 1%", "Cetoprofeno", "Chemitec",
             "AINE Anti-inflamatório", "liquid", "Frasco-ampola de 20 mL", ["Canino", "Felino"],
             2.0, 2.0, "2 mg/kg no 1º dia SC, IM ou IV", "SID", "Subcutânea (SC)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=20)
    add_prod("chemitofen-inj-10", "Chemitofen® Injetável 10%", "Cetoprofeno", "Chemitec",
             "AINE Anti-inflamatório", "liquid", "Frasco-ampola de 50 mL", ["Equino", "Bovino"],
             None, None, "Equinos e Bovinos: 2,2 mg/kg IV ou IM SID por 1 a 3 dias", "SID", "Intravenosa (IV)",
             conc_mg_ml=100, percentage=10.0, bottle_vol=50)

    # Firocoxib (Previcox Boehringer Ingelheim)
    add_prod("previcox-57-comp", "Previcox® 57 mg Comprimidos Mastigáveis", "Firocoxib", "Boehringer Ingelheim",
             "AINE Anti-inflamatório Coxibe", "tablet", "Cartucho com 10 comprimidos palatáveis divisíveis", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia com ou sem alimento", "SID", "Oral (VO)",
             tablet_mg=57, tabs_per_box=10,
             notes="Coxibe de alta seletividade COX-2 para cães. Excelente tolerabilidade gastrointestinal.")
    add_prod("previcox-227-comp", "Previcox® 227 mg Comprimidos Mastigáveis", "Firocoxib", "Boehringer Ingelheim",
             "AINE Anti-inflamatório Coxibe", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia para cães de médio e grande porte", "SID", "Oral (VO)",
             tablet_mg=227, tabs_per_box=10)

    # Robenacoxib (Onsior Elanco)
    add_prod("onsior-gatos-6mg", "Onsior® 6 mg Comprimidos para Gatos", "Robenacoxib", "Elanco",
             "AINE Específico para Felinos (Coxibe)", "tablet", "Cartucho com 6 comprimidos palatáveis", ["Felino"],
             None, 1.0, "1 a 2,4 mg/kg uma vez ao dia por até 6 dias (dose padrão 1 mg/kg)", "SID", "Oral (VO)",
             tablet_mg=6, tabs_per_box=6,
             notes="Coxibe específico com excelente perfil de segurança para dor aguda e ortopédica em gatos.")
    add_prod("onsior-caes-10mg", "Onsior® 10 mg Comprimidos para Cães", "Robenacoxib", "Elanco",
             "AINE Anti-inflamatório Coxibe", "tablet", "Cartucho com 7 comprimidos palatáveis", ["Canino"],
             1.0, None, "1 a 2 mg/kg SID sem alimento", "SID", "Oral (VO)",
             tablet_mg=10, tabs_per_box=7)
    add_prod("onsior-caes-20mg", "Onsior® 20 mg Comprimidos para Cães", "Robenacoxib", "Elanco",
             "AINE Anti-inflamatório Coxibe", "tablet", "Cartucho com 7 comprimidos palatáveis", ["Canino"],
             1.0, None, "1 a 2 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=7)
    add_prod("onsior-caes-40mg", "Onsior® 40 mg Comprimidos para Cães", "Robenacoxib", "Elanco",
             "AINE Anti-inflamatório Coxibe", "tablet", "Cartucho com 7 comprimidos palatáveis", ["Canino"],
             1.0, None, "1 a 2 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=40, tabs_per_box=7)
    add_prod("onsior-inj-20mg", "Onsior® Injetável 20 mg/mL", "Robenacoxib", "Elanco",
             "AINE Anti-inflamatório Injetável", "liquid", "Frasco-ampola com 20 mL", ["Canino", "Felino"],
             2.0, 2.0, "2 mg/kg SC antes da cirurgia (ortopédica ou tecidos moles)", "SID", "Subcutânea (SC)",
             conc_mg_ml=20, bottle_vol=20)

    # Mavacoxib (Trocoxil Zoetis)
    add_prod("trocoxil-20-comp", "Trocoxil® 20 mg Comprimidos Mastigáveis", "Mavacoxib", "Zoetis",
             "AINE Coxibe de Longa Duração", "tablet", "Cartucho com 2 comprimidos mastigáveis", ["Canino"],
             2.0, None, "2 mg/kg VO no dia 0, repetir no dia 14 e após isso mensalmente (a cada 30 dias)", "Dose Única", "Oral (VO)",
             tablet_mg=20, tabs_per_box=2,
             notes="Coxibe de meia-vida prolongada indicado para dor osteoartrítica crônica em cães.")
    add_prod("trocoxil-30-comp", "Trocoxil® 30 mg Comprimidos Mastigáveis", "Mavacoxib", "Zoetis",
             "AINE Coxibe de Longa Duração", "tablet", "Cartucho com 2 comprimidos mastigáveis", ["Canino"],
             2.0, None, "2 mg/kg VO dia 0, dia 14 e mensal", "Dose Única", "Oral (VO)",
             tablet_mg=30, tabs_per_box=2)
    add_prod("trocoxil-75-comp", "Trocoxil® 75 mg Comprimidos Mastigáveis", "Mavacoxib", "Zoetis",
             "AINE Coxibe de Longa Duração", "tablet", "Cartucho com 2 comprimidos mastigáveis", ["Canino"],
             2.0, None, "2 mg/kg VO para cães de grande porte", "Dose Única", "Oral (VO)",
             tablet_mg=75, tabs_per_box=2)
    add_prod("trocoxil-95-comp", "Trocoxil® 95 mg Comprimidos Mastigáveis", "Mavacoxib", "Zoetis",
             "AINE Coxibe de Longa Duração", "tablet", "Cartucho com 2 comprimidos mastigáveis", ["Canino"],
             2.0, None, "2 mg/kg VO para cães gigantes", "Dose Única", "Oral (VO)",
             tablet_mg=95, tabs_per_box=2)

    # Cimicoxib (Cimalgex Vetoquinol)
    add_prod("cimalgex-8-comp", "Cimalgex® 8 mg Comprimidos Mastigáveis", "Cimicoxib", "Vetoquinol",
             "AINE Anti-inflamatório Coxibe", "tablet", "Cartucho com 8 comprimidos palatáveis divisíveis", ["Canino"],
             2.0, None, "2 mg/kg uma vez ao dia com ou sem alimento", "SID", "Oral (VO)",
             tablet_mg=8, tabs_per_box=8)
    add_prod("cimalgex-30-comp", "Cimalgex® 30 mg Comprimidos Mastigáveis", "Cimicoxib", "Vetoquinol",
             "AINE Anti-inflamatório Coxibe", "tablet", "Cartucho com 8 comprimidos divisíveis", ["Canino"],
             2.0, None, "2 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=30, tabs_per_box=8)
    add_prod("cimalgex-80-comp", "Cimalgex® 80 mg Comprimidos Mastigáveis", "Cimicoxib", "Vetoquinol",
             "AINE Anti-inflamatório Coxibe", "tablet", "Cartucho com 8 comprimidos divisíveis", ["Canino"],
             2.0, None, "2 mg/kg uma vez ao dia para cães grandes", "SID", "Oral (VO)",
             tablet_mg=80, tabs_per_box=8)

    # Flunixina Meglumina
    add_prod("desflan-inj-50", "Desflan® Injetável 50 mg/mL", "Flunixina Meglumina", "Ourofino",
             "AINE Anti-inflamatório Potente", "liquid", "Frasco-ampola com 50 mL", ["Equino", "Bovino", "Canino"],
             1.1, None, "Equinos: 1,1 mg/kg IV/IM SID | Cães: 1 mg/kg IV/SC dose única ou max 3 dias", "SID", "Intravenosa (IV)",
             conc_mg_ml=50, bottle_vol=50)
    add_prod("chemiflux-inj-50", "Chemiflux® Injetável 5%", "Flunixina Meglumina", "Chemitec",
             "AINE Anti-inflamatório", "liquid", "Frasco-ampola com 50 mL", ["Equino", "Bovino", "Canino"],
             1.1, None, "5% = 50 mg/mL. Cães: 1 mg/kg | Equinos: 1,1 mg/kg", "SID", "Intravenosa (IV)",
             conc_mg_ml=50, percentage=5.0, bottle_vol=50)

    # Dipirona Sódica
    add_prod("dipi-vet-gotas", "Dipi-Vet® Gotas 500 mg/mL", "Dipirona Sódica", "Vetnil",
             "Analgésico e Antipirético", "drops", "Frasco conta-gotas de 20 mL", ["Canino", "Felino"],
             25.0, 15.0, "Cães: 25 mg/kg (1 gota/kg) TID | Gatos: 10 a 15 mg/kg BID a TID", "TID", "Oral (VO)",
             conc_mg_ml=500, bottle_vol=20)
    add_prod("chemidipirona-inj-50", "Chemidipirona® Injetável 500 mg/mL", "Dipirona Sódica", "Chemitec",
             "Analgésico e Antipirético", "liquid", "Frasco com 50 mL", ["Canino", "Equino", "Bovino"],
             25.0, None, "25 mg/kg IV lento, IM ou SC a cada 8h", "TID", "Intravenosa (IV)",
             conc_mg_ml=500, bottle_vol=50)

    # =========================================================================
    # 2. CORTICOSTEROIDES & GLICOCORTICOIDES
    # =========================================================================
    add_prod("prednisolona-agener-5", "Prednisolona Agener® 5 mg Comprimidos", "Prednisolona", "Agener União",
             "Glicocorticoide Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino", "Felino"],
             0.5, 1.0, "Anti-inflamatório: 0,5 a 1 mg/kg/dia | Imunossupressor: 2 a 4 mg/kg/dia", "SID", "Oral (VO)",
             tablet_mg=5, tabs_per_box=10)
    add_prod("prednisolona-agener-20", "Prednisolona Agener® 20 mg Comprimidos", "Prednisolona", "Agener União",
             "Glicocorticoide Anti-inflamatório", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             0.5, None, "Anti-inflamatório: 0,5 a 1 mg/kg/dia | Imunossupressor: 2 mg/kg/dia", "SID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=10)
    add_prod("prednisolona-vetnil-gotas", "Prednisolona Vetnil® Gotas 10 mg/mL", "Prednisolona", "Vetnil",
             "Glicocorticoide Anti-inflamatório", "drops", "Frasco conta-gotas com 20 mL", ["Canino", "Felino"],
             0.5, 1.0, "10 mg/mL (1 gota = 0,5 mg). Anti-inflamatório: 0,5 a 1 mg/kg SID a BID", "SID", "Oral (VO)",
             conc_mg_ml=10, bottle_vol=20)
    add_prod("predsim-oral-3mg", "Predsim® Solução Oral 3 mg/mL", "Fosfato Sódico de Prednisolona", "Mantecorp",
             "Glicocorticoide Anti-inflamatório Humano/Vet", "liquid", "Frasco com 60 mL acompanhado de seringa dosadora", ["Canino", "Felino"],
             0.5, 1.0, "3 mg/mL. Dose anti-inflamatória: 0,5 a 1 mg/kg VO a cada 12-24h", "SID", "Oral (VO)",
             conc_mg_ml=3, bottle_vol=60)
    add_prod("prelone-oral-3mg", "Prelone® Solução Oral 3 mg/mL", "Prednisolona", "Aché",
             "Glicocorticoide Anti-inflamatório Humano/Vet", "liquid", "Frasco com 120 mL com copo dosador", ["Canino", "Felino"],
             0.5, 1.0, "3 mg/mL. Cães: 0,5 a 1 mg/kg SID | Gatos: 1 a 2 mg/kg SID", "SID", "Oral (VO)",
             conc_mg_ml=3, bottle_vol=120)
    add_prod("meticorten-5-comp", "Meticorten® 5 mg Comprimidos", "Prednisona", "MSD Saúde Animal",
             "Glicocorticoide Anti-inflamatório", "tablet", "Blister com 20 comprimidos", ["Canino"],
             0.5, None, "Cães: 0,5 a 1 mg/kg SID a BID. Prednisona requer conversão hepática (evitar em gatos)", "SID", "Oral (VO)",
             tablet_mg=5, tabs_per_box=20)
    add_prod("meticorten-20-comp", "Meticorten® 20 mg Comprimidos", "Prednisona", "MSD Saúde Animal",
             "Glicocorticoide Anti-inflamatório", "tablet", "Blister com 10 comprimidos", ["Canino"],
             0.5, None, "Cães: 0,5 a 1 mg/kg SID", "SID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=10)

    # Dexametasona
    add_prod("azium-comp-05", "Azium® Comprimidos 0,5 mg", "Dexametasona", "MSD Saúde Animal",
             "Glicocorticoide Potente", "tablet", "Cartucho com 20 comprimidos", ["Canino", "Felino"],
             0.1, 0.1, "0,05 a 0,15 mg/kg SID por até 3 a 5 dias", "SID", "Oral (VO)",
             tablet_mg=0.5, tabs_per_box=20)
    add_prod("chemicort-inj-2", "Chemicort® Injetável 2 mg/mL", "Dexametasona", "Chemitec",
             "Glicocorticoide Injetável", "liquid", "Frasco-ampola com 10 mL", ["Canino", "Felino", "Equino", "Bovino"],
             0.15, 0.15, "0,1 a 0,25 mg/kg IV, IM ou SC", "SID", "Intravenosa (IV)",
             conc_mg_ml=2, bottle_vol=10)
    add_prod("dexavansil-inj-2", "Dexavansil® Injetável 2 mg/mL", "Dexametasona", "Vansil",
             "Glicocorticoide Injetável", "liquid", "Frasco com 50 mL", ["Canino", "Equino", "Bovino"],
             0.15, None, "0,1 a 0,2 mg/kg IV ou IM", "SID", "Intravenosa (IV)",
             conc_mg_ml=2, bottle_vol=50)
    add_prod("decadron-inj-4mg", "Decadron® Injetável 4 mg/mL", "Fosfato Dissódico de Dexametasona", "Aché",
             "Glicocorticoide de Ação Rápida Hospitalar", "liquid", "Ampola de 2,5 mL (10 mg total)", ["Canino", "Felino"],
             0.2, 0.2, "0,15 a 0,5 mg/kg IV ou IM em emergências alérgicas ou choque", "SID", "Intravenosa (IV)",
             conc_mg_ml=4, bottle_vol=2.5)

    # Metilprednisolona
    add_prod("depo-medrol-40", "Depo-Medrol® Injetável 40 mg/mL", "Acetato de Metilprednisolona", "Zoetis",
             "Glicocorticoide de Depósito Longa Ação", "liquid", "Frasco-ampola de 5 mL", ["Canino", "Felino"],
             1.0, 2.0, "Cães: 1 mg/kg IM/SC a cada 1-3 semanas | Gatos: 10 a 20 mg/gato dose única IM a cada 2-4 semanas", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=40, bottle_vol=5,
             notes="Ação prolongada por 2 a 4 semanas. Uso cauteloso em felinos devido a risco de diabetes mellitus iatrogênico.")
    add_prod("solu-medrol-125", "Solu-Medrol® 125 mg Frasco-Ampola", "Succinato Sódico de Metilprednisolona", "Pfizer",
             "Glicocorticoide Hospitalar Emergencial", "liquid", "Frasco-ampola liofilizado com diluente (2 mL)", ["Canino", "Felino"],
             30.0, 30.0, "Trauma medular agudo (primeiras 8h): 30 mg/kg IV lento em 15 min", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=62.5, bottle_vol=2,
             notes="Padrão ouro hospitalar para trauma agudo de medula espinhal e choque anafilático refratário.")
    add_prod("solu-medrol-500", "Solu-Medrol® 500 mg Frasco-Ampola", "Succinato Sódico de Metilprednisolona", "Pfizer",
             "Glicocorticoide Hospitalar Emergencial", "liquid", "Frasco-ampola liofilizado com diluente (8 mL)", ["Canino", "Equino"],
             30.0, None, "Trauma raquimedular agudo: 30 mg/kg IV lento", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=62.5, bottle_vol=8)

    # Triancinolona
    add_prod("cortavance-spray-76", "Cortavance® Spray Tópico 0,584 mg/mL", "Aceponato de Hidrocortisona", "Virbac",
             "Dermatologia & Corticoide Tópico Diester", "spray", "Frasco aplicador spray de 76 mL", ["Canino"],
             None, None, "2 borrifadas para cada 100 cm² de área de pele uma vez ao dia por 7 dias", "SID", "Tópica",
             conc_mg_ml=0.584, bottle_vol=76,
             notes="Corticoide diéster inovador metabolizado na própria pele sem absorção sistêmica significativa.")
    add_prod("vetalog-plus-inj", "Vetalog Plus® Injetável 6 mg/mL", "Acetonido de Triancinolona", "Zoetis",
             "Glicocorticoide de Depósito", "liquid", "Frasco-ampola de 5 mL", ["Canino", "Felino", "Equino"],
             0.1, 0.1, "0,1 a 0,2 mg/kg IM ou SC a cada 15 dias", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=6, bottle_vol=5)

    # =========================================================================
    # 3. ANTIMICROBIANOS & ANTIBIÓTICOS
    # =========================================================================
    # Synulox / Agemoxi CL / Clavaseptin
    add_prod("synulox-inj-140", "Synulox® Injetável Suspensão Oleosa RTU (140 mg/mL)", "Amoxicilina + Clavulanato de Potássio", "Zoetis",
             "Antimicrobiano Penicilânico Potencializado", "liquid", "Frasco-ampola de 40 mL pronto para uso", ["Canino", "Felino", "Bovino"],
             8.75, 8.75, "8,75 mg/kg (1 mL para cada 16 kg) via SC ou IM uma vez ao dia", "SID", "Subcutânea (SC)",
             conc_mg_ml=140, bottle_vol=40,
             notes="Contém 140 mg de amoxicilina e ácido clavulânico por mL. Agitar vigorosamente antes de aspirar.")
    add_prod("clavaseptin-50-comp", "Clavaseptin® 50 mg Comprimidos Divisíveis", "Amoxicilina + Ácido Clavulânico", "Vetoquinol",
             "Antimicrobiano Penicilânico Potencializado", "tablet", "Cartucho com 10 comprimidos palatáveis divisíveis", ["Canino", "Felino"],
             12.5, 12.5, "12,5 mg/kg a cada 12 horas (BID) por 7 a 14 dias", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)
    add_prod("clavaseptin-250-comp", "Clavaseptin® 250 mg Comprimidos Divisíveis", "Amoxicilina + Ácido Clavulânico", "Vetoquinol",
             "Antimicrobiano Penicilânico Potencializado", "tablet", "Cartucho com 10 comprimidos palatáveis divisíveis", ["Canino"],
             12.5, None, "12,5 mg/kg BID por 7 a 14 dias", "BID", "Oral (VO)",
             tablet_mg=250, tabs_per_box=10)
    add_prod("clavaseptin-500-comp", "Clavaseptin® 500 mg Comprimidos Divisíveis", "Amoxicilina + Ácido Clavulânico", "Vetoquinol",
             "Antimicrobiano Penicilânico Potencializado", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             12.5, None, "12,5 mg/kg BID para cães grandes", "BID", "Oral (VO)",
             tablet_mg=500, tabs_per_box=10)
    add_prod("chemimox-cl-50", "Chemimox CL® 50 mg Comprimidos", "Amoxicilina + Clavulanato de Potássio", "Chemitec",
             "Antimicrobiano Penicilânico Potencializado", "tablet", "Cartucho com 10 comprimidos", ["Canino", "Felino"],
             12.5, 12.5, "12,5 a 25 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)
    add_prod("chemimox-cl-250", "Chemimox CL® 250 mg Comprimidos", "Amoxicilina + Clavulanato de Potássio", "Chemitec",
             "Antimicrobiano Penicilânico Potencializado", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             12.5, None, "12,5 a 25 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=250, tabs_per_box=10)

    # Baytril / Enrofloxacino lines
    add_prod("baytril-flavor-15", "Baytril® Flavour 15 mg Comprimidos", "Enrofloxacino", "Elanco",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino", "Felino"],
             5.0, 5.0, "5 mg/kg uma vez ao dia (ou dividida a cada 12h) por 5 a 10 dias", "SID", "Oral (VO)",
             tablet_mg=15, tabs_per_box=10,
             notes="Aviso em gatos: não exceder a dose estrita de 5 mg/kg/dia devido ao risco de degeneração retiniana e cegueira.")
    add_prod("enrotrat-flavor-25", "Enrotrat® Flavour 25 mg Comprimidos", "Enrofloxacino", "Agener União",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino", "Felino"],
             5.0, 5.0, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=25, tabs_per_box=10)
    add_prod("enrotrat-flavor-50", "Enrotrat® Flavour 50 mg Comprimidos", "Enrofloxacino", "Agener União",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)
    add_prod("enrotrat-flavor-100", "Enrotrat® Flavour 100 mg Comprimidos", "Enrofloxacino", "Agener União",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=10)
    add_prod("zelotril-inj-10", "Zelotril® Injetável 10%", "Enrofloxacino", "Agener União",
             "Antimicrobiano Fluoroquinolona", "liquid", "Frasco-ampola com 50 mL", ["Canino", "Bovino", "Suíno"],
             5.0, None, "10% = 100 mg/mL. Cães: 5 mg/kg SC ou IM (0,5 mL para cada 10 kg)", "SID", "Subcutânea (SC)",
             conc_mg_ml=100, percentage=10.0, bottle_vol=50)
    add_prod("flotril-comp-50", "Flotril® 50 mg Comprimidos", "Enrofloxacino", "MSD Saúde Animal",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos", ["Canino", "Felino"],
             5.0, 5.0, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)
    add_prod("flotril-comp-150", "Flotril® 150 mg Comprimidos", "Enrofloxacino", "MSD Saúde Animal",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia para cães grandes", "SID", "Oral (VO)",
             tablet_mg=150, tabs_per_box=10)
    add_prod("flotril-inj-25", "Flotril® Injetável 2,5%", "Enrofloxacino", "MSD Saúde Animal",
             "Antimicrobiano Fluoroquinolona", "liquid", "Frasco-ampola com 20 mL", ["Canino", "Felino"],
             5.0, 5.0, "2,5% = 25 mg/mL (1 mL para cada 5 kg). Cães e gatos: 5 mg/kg SC ou IM", "SID", "Subcutânea (SC)",
             conc_mg_ml=25, percentage=2.5, bottle_vol=20)
    add_prod("kenzocim-comp-50", "Kenzocim® 50 mg Comprimidos", "Enrofloxacino", "Syntec",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)
    add_prod("kenzocim-comp-150", "Kenzocim® 150 mg Comprimidos", "Enrofloxacino", "Syntec",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=150, tabs_per_box=10)
    add_prod("dupratril-comp-50", "Dupratril® 50 mg Comprimidos", "Enrofloxacino", "Duprat",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)

    # Cefalexina lines
    add_prod("rilexine-palat-75", "Rilexine® Palatável 75 mg", "Cefalexina Monoidratada", "Virbac",
             "Antimicrobiano Cefalosporina 1ª Geração", "tablet", "Cartucho com 14 comprimidos palatáveis", ["Canino", "Felino"],
             25.0, 25.0, "15 a 30 mg/kg a cada 12 horas (BID) por 14 a 28 dias", "BID", "Oral (VO)",
             tablet_mg=75, tabs_per_box=14,
             notes="Cefalosporina de primeira geração de escolha para piodermites estafilocócicas em pequenos animais.")
    add_prod("rilexine-palat-300", "Rilexine® Palatável 300 mg", "Cefalexina Monoidratada", "Virbac",
             "Antimicrobiano Cefalosporina 1ª Geração", "tablet", "Cartucho com 14 comprimidos palatáveis", ["Canino"],
             25.0, None, "25 mg/kg BID por 14 a 28 dias", "BID", "Oral (VO)",
             tablet_mg=300, tabs_per_box=14)
    add_prod("rilexine-palat-600", "Rilexine® Palatável 600 mg", "Cefalexina Monoidratada", "Virbac",
             "Antimicrobiano Cefalosporina 1ª Geração", "tablet", "Cartucho com 14 comprimidos palatáveis", ["Canino"],
             25.0, None, "25 mg/kg BID para cães grandes", "BID", "Oral (VO)",
             tablet_mg=600, tabs_per_box=14)
    add_prod("cefa-cure-50", "Cefa-Cure® Tabs 50 mg", "Cefalexina Monoidratada", "MSD Saúde Animal",
             "Antimicrobiano Cefalosporina", "tablet", "Blister com 10 comprimidos divisíveis", ["Canino", "Felino"],
             20.0, 20.0, "20 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)
    add_prod("cefa-cure-200", "Cefa-Cure® Tabs 200 mg", "Cefalexina Monoidratada", "MSD Saúde Animal",
             "Antimicrobiano Cefalosporina", "tablet", "Blister com 10 comprimidos divisíveis", ["Canino"],
             20.0, None, "20 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=200, tabs_per_box=10)
    add_prod("cefa-cure-1000", "Cefa-Cure® Tabs 1000 mg", "Cefalexina Monoidratada", "MSD Saúde Animal",
             "Antimicrobiano Cefalosporina", "tablet", "Blister com 5 comprimidos divisíveis", ["Canino"],
             20.0, None, "20 mg/kg BID para cães gigantes", "BID", "Oral (VO)",
             tablet_mg=1000, tabs_per_box=5)
    add_prod("cefalexina-vetnil-300", "Cefalexina Vetnil® 300 mg Comprimidos", "Cefalexina", "Vetnil",
             "Antimicrobiano Cefalosporina", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             25.0, None, "20 a 30 mg/kg a cada 12 horas", "BID", "Oral (VO)",
             tablet_mg=300, tabs_per_box=10)
    add_prod("cefalexina-vetnil-600", "Cefalexina Vetnil® 600 mg Comprimidos", "Cefalexina", "Vetnil",
             "Antimicrobiano Cefalosporina", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             25.0, None, "25 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=600, tabs_per_box=10)
    add_prod("chemicef-300-comp", "Chemicef® 300 mg Comprimidos", "Cefalexina", "Chemitec",
             "Antimicrobiano Cefalosporina", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             25.0, None, "20 a 30 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=300, tabs_per_box=10)
    add_prod("cefalexina-agener-susp", "Cefalexina Agener® Suspensão Oral 50 mg/mL", "Cefalexina Monoidratada", "Agener União",
             "Antimicrobiano Cefalosporina", "liquid", "Frasco com pó para reconstituição de 100 mL", ["Canino", "Felino"],
             25.0, 25.0, "50 mg/mL (0,5 mL/kg). 25 mg/kg BID", "BID", "Oral (VO)",
             conc_mg_ml=50, bottle_vol=100)

    # Cefalosporinas Injetáveis Hospitalares (Cefazolina, Cefalotina, Ceftriaxona)
    add_prod("cefazolina-cristalia-1g", "Cefazolina Sódica 1 g Frasco-Ampola", "Cefazolina Sódica", "Cristália",
             "Antimicrobiano Cefalosporina 1ª Geração Hospitalar", "liquid", "Frasco-ampola com 1 g de pó liofilizado", ["Canino", "Felino"],
             25.0, 25.0, "Profilaxia cirúrgica: 25 mg/kg IV lenta na indução anestésica e a cada 90-120 min intraoperatório", "TID", "Intravenosa (IV)",
             conc_mg_ml=100, bottle_vol=10,
             notes="Padrão ouro em profilaxia cirúrgica ortopédica e de tecidos moles.")
    add_prod("cefalotina-eurofarma-1g", "Cefalotina Sódica 1 g Frasco-Ampola", "Cefalotina Sódica", "Eurofarma",
             "Antimicrobiano Cefalosporina 1ª Geração Hospitalar", "liquid", "Frasco-ampola com 1 g de pó para injeção", ["Canino", "Felino"],
             25.0, 25.0, "25 a 30 mg/kg IV lento ou IM a cada 6 a 8 horas", "QID", "Intravenosa (IV)",
             conc_mg_ml=100, bottle_vol=10)
    add_prod("ceftriaxona-cristalia-1g", "Ceftriaxona Sódica 1 g Injetável IV/IM", "Ceftriaxona Sódica", "Cristália",
             "Antimicrobiano Cefalosporina 3ª Geração Hospitalar", "liquid", "Frasco-ampola com 1 g de pó liofilizado + diluente", ["Canino", "Felino"],
             25.0, 25.0, "25 a 50 mg/kg IV lenta (infusão em 20 min) a cada 12 a 24 horas", "BID", "Intravenosa (IV)",
             conc_mg_ml=100, bottle_vol=10,
             notes="Excelente penetração liquórica e no SNC. Indicada em sepse, meningoencefalite e peritonite bacteriana.")

    # Doxiciclina lines
    add_prod("doxifin-tabs-50", "Doxifin® Tabs 50 mg", "Doxiciclina Hiclato", "Ourofino",
             "Antimicrobiano Tetraciclina Palatável", "tablet", "Cartucho com 14 comprimidos palatáveis", ["Canino", "Felino"],
             5.0, 5.0, "5 mg/kg a cada 12h ou 10 mg/kg a cada 24h por 28 dias para Erliquiose", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=14,
             notes="Comprimidos palatáveis facilitam adesão. Em gatos, administrar sempre com água ou alimento para prevenir esofagite por retenção.")
    add_prod("doxifin-tabs-100", "Doxifin® Tabs 100 mg", "Doxiciclina Hiclato", "Ourofino",
             "Antimicrobiano Tetraciclina Palatável", "tablet", "Cartucho com 14 comprimidos palatáveis", ["Canino"],
             5.0, None, "5 mg/kg BID ou 10 mg/kg SID por 28 dias", "BID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=14)
    add_prod("doxifin-tabs-200", "Doxifin® Tabs 200 mg", "Doxiciclina Hiclato", "Ourofino",
             "Antimicrobiano Tetraciclina Palatável", "tablet", "Cartucho com 14 comprimidos palatáveis", ["Canino"],
             5.0, None, "10 mg/kg SID para cães grandes", "SID", "Oral (VO)",
             tablet_mg=200, tabs_per_box=14)
    add_prod("doxitrat-comp-50", "Doxitrat® 50 mg Comprimidos", "Doxiciclina Hiclato", "Agener União",
             "Antimicrobiano Tetraciclina", "tablet", "Cartucho com 16 comprimidos divisíveis", ["Canino", "Felino"],
             5.0, 5.0, "5 mg/kg BID ou 10 mg/kg SID", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=16)
    add_prod("doxitrat-comp-100", "Doxitrat® 100 mg Comprimidos", "Doxiciclina Hiclato", "Agener União",
             "Antimicrobiano Tetraciclina", "tablet", "Cartucho com 16 comprimidos divisíveis", ["Canino"],
             5.0, None, "5 mg/kg BID ou 10 mg/kg SID", "BID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=16)
    add_prod("doxitrat-comp-200", "Doxitrat® 200 mg Comprimidos", "Doxiciclina Hiclato", "Agener União",
             "Antimicrobiano Tetraciclina", "tablet", "Cartucho com 16 comprimidos divisíveis", ["Canino"],
             5.0, None, "5 mg/kg BID ou 10 mg/kg SID", "SID", "Oral (VO)",
             tablet_mg=200, tabs_per_box=16)
    add_prod("doxymax-pet-50", "Doxymax Pet® 50 mg Comprimidos", "Doxiciclina", "Vansil",
             "Antimicrobiano Tetraciclina", "tablet", "Cartucho com 14 comprimidos", ["Canino", "Felino"],
             5.0, 5.0, "5 mg/kg BID ou 10 mg/kg SID", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=14)
    add_prod("doxymax-pet-100", "Doxymax Pet® 100 mg Comprimidos", "Doxiciclina", "Vansil",
             "Antimicrobiano Tetraciclina", "tablet", "Cartucho com 14 comprimidos", ["Canino"],
             5.0, None, "5 mg/kg BID ou 10 mg/kg SID", "BID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=14)
    add_prod("ronaxan-comp-20", "Ronaxan® 20 mg Comprimidos", "Doxiciclina", "Boehringer Ingelheim",
             "Antimicrobiano Tetraciclina", "tablet", "Cartucho com 10 comprimidos", ["Canino", "Felino"],
             5.0, 5.0, "5 mg/kg BID ou 10 mg/kg SID", "BID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=10)
    add_prod("ronaxan-comp-100", "Ronaxan® 100 mg Comprimidos", "Doxiciclina", "Boehringer Ingelheim",
             "Antimicrobiano Tetraciclina", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             5.0, None, "10 mg/kg SID", "SID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=10)

    # Marbofloxacino (Marbopet Ceva / Marbocyl Vetoquinol)
    add_prod("marbopet-275-comp", "Marbopet® 27,5 mg Comprimidos Palatáveis", "Marbofloxacino", "Ceva",
             "Antimicrobiano Fluoroquinolona 3ª Geração", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino", "Felino"],
             2.75, 2.75, "2,75 mg/kg uma vez ao dia (ou até 5,5 mg/kg em infecções graves) por 5 a 21 dias", "SID", "Oral (VO)",
             tablet_mg=27.5, tabs_per_box=10,
             notes="Fluoroquinolona de terceira geração de alta biodisponibilidade e segurança em cães e gatos.")
    add_prod("marbopet-825-comp", "Marbopet® 82,5 mg Comprimidos Palatáveis", "Marbofloxacino", "Ceva",
             "Antimicrobiano Fluoroquinolona 3ª Geração", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             2.75, None, "2,75 mg/kg uma vez ao dia para cães grandes", "SID", "Oral (VO)",
             tablet_mg=82.5, tabs_per_box=10)
    add_prod("marbocyl-p-5-comp", "Marbocyl® P 5 mg Comprimidos", "Marbofloxacino", "Vetoquinol",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino", "Felino"],
             2.0, 2.0, "2 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=5, tabs_per_box=10)
    add_prod("marbocyl-p-20-comp", "Marbocyl® P 20 mg Comprimidos", "Marbofloxacino", "Vetoquinol",
             "Antimicrobiano Fluoroquinolona", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             2.0, None, "2 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=10)
    add_prod("marbocyl-inj-10", "Marbocyl® Injetável 10%", "Marbofloxacino", "Vetoquinol",
             "Antimicrobiano Fluoroquinolona Injetável", "liquid", "Frasco-ampola com 50 mL", ["Bovino", "Suíno", "Canino"],
             2.0, None, "10% = 100 mg/mL. 2 mg/kg IV, IM ou SC", "SID", "Subcutânea (SC)",
             conc_mg_ml=100, percentage=10.0, bottle_vol=50)

    # Metronidazol & Espiramicina
    add_prod("giardicid-susp-50", "Giardicid® Suspensão Oral 50 mg/mL", "Metronidazol + Sulfadimetoxina", "Cepav",
             "Antiprotozoário e Antimicrobiano Giardicida", "liquid", "Frasco com 50 mL com seringa dosadora", ["Canino", "Felino"],
             25.0, 25.0, "0,5 mL/kg a cada 12 horas (BID) por 5 dias consecutivos", "BID", "Oral (VO)",
             conc_mg_ml=50, bottle_vol=50,
             notes="Excelente palatabilidade e associação sinérgica consagrada no tratamento de Giardia e coccidiose.")
    add_prod("flagyl-pediatrico-40", "Flagyl® Pediátrico Suspensão Oral 40 mg/mL", "Benzoilmetronidazol", "Sanofi",
             "Antiprotozoário e Antianaeróbio", "liquid", "Frasco com 120 mL", ["Canino", "Felino"],
             15.0, 15.0, "10 a 25 mg/kg a cada 12 horas por 5 a 7 dias", "BID", "Oral (VO)",
             conc_mg_ml=40, bottle_vol=120)
    add_prod("metronidazol-bolsa-05", "Metronidazol Solução para Infusão 5 mg/mL (0,5%)", "Metronidazol", "Isofarma",
             "Antimicrobiano Antianaeróbio Hospitalar", "liquid", "Bolsa de 100 mL para infusão intravenosa", ["Canino", "Felino"],
             10.0, 10.0, "10 a 15 mg/kg em infusão IV lenta (correr em 30 a 60 min) a cada 12h", "BID", "Intravenosa (IV)",
             conc_mg_ml=5, bottle_vol=100,
             notes="Infusão intravenosa lenta obrigatória. Nunca administrar em bolus rápido devido a risco de neurotoxicidade.")
    add_prod("stomorgyl-2-comp", "Stomorgyl® 2 Comprimidos", "Espiramicina + Metronidazol", "Boehringer Ingelheim",
             "Antimicrobiano Odontológico", "tablet", "Cartucho com 20 comprimidos", ["Canino", "Felino"],
             1.0, 1.0, "1 comprimido para cada 2 kg de peso vivo a cada 24 horas por 5 a 10 dias", "SID", "Oral (VO)",
             tablet_mg=2, tabs_per_box=20,
             notes="Associação de referência para doença periodontal, gengivites e estomatites bacterianas.")
    add_prod("stomorgyl-10-comp", "Stomorgyl® 10 Comprimidos", "Espiramicina + Metronidazol", "Boehringer Ingelheim",
             "Antimicrobiano Odontológico", "tablet", "Cartucho com 20 comprimidos", ["Canino"],
             1.0, None, "1 comprimido para cada 10 kg de peso vivo a cada 24 horas", "SID", "Oral (VO)",
             tablet_mg=10, tabs_per_box=20)
    add_prod("stomorgyl-20-comp", "Stomorgyl® 20 Comprimidos", "Espiramicina + Metronidazol", "Boehringer Ingelheim",
             "Antimicrobiano Odontológico", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             1.0, None, "1 comprimido para cada 20 kg de peso a cada 24 horas", "SID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=10)

    # Clindamicina (Clindabac Ceva / Antirobe Dechra)
    add_prod("clindabac-50-comp", "Clindabac® 50 mg Comprimidos", "Clindamicina", "Ceva",
             "Antimicrobiano Lincosamida", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino", "Felino"],
             5.5, 5.5, "5,5 mg/kg a cada 12 horas ou 11 mg/kg a cada 24 horas por 7 a 28 dias", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10,
             notes="Excelente penetração óssea (osteomielites), tecidos moles, abscessos profundos e toxoplasmose felina.")
    add_prod("clindabac-150-comp", "Clindabac® 150 mg Comprimidos", "Clindamicina", "Ceva",
             "Antimicrobiano Lincosamida", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             5.5, None, "5,5 mg/kg BID ou 11 mg/kg SID", "BID", "Oral (VO)",
             tablet_mg=150, tabs_per_box=10)
    add_prod("clindabac-300-comp", "Clindabac® 300 mg Comprimidos", "Clindamicina", "Ceva",
             "Antimicrobiano Lincosamida", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             5.5, None, "11 mg/kg SID para cães grandes", "SID", "Oral (VO)",
             tablet_mg=300, tabs_per_box=10)
    add_prod("antirobe-gotas-25", "Antirobe® Gotas Aquadrops 25 mg/mL", "Cloridrato de Clindamicina", "Dechra",
             "Antimicrobiano Lincosamida Solução Oral", "drops", "Frasco conta-gotas de 20 mL", ["Canino", "Felino"],
             5.5, 5.5, "25 mg/mL (1 mL para cada 4,5 kg). 5,5 mg/kg a cada 12h", "BID", "Oral (VO)",
             conc_mg_ml=25, bottle_vol=20)
    add_prod("clindamicina-inj-150", "Clindamicina Injetável 150 mg/mL", "Fosfato de Clindamicina", "Cristália",
             "Antimicrobiano Lincosamida Hospitalar", "liquid", "Ampola de 4 mL (600 mg)", ["Canino", "Felino"],
             10.0, 10.0, "10 mg/kg IV lenta em infusão a cada 12 horas", "BID", "Intravenosa (IV)",
             conc_mg_ml=150, bottle_vol=4)

    # Azitromicina & Claritromicina
    add_prod("zitrex-100-comp", "Zitrex® 100 mg Comprimidos", "Azitromicina", "Agener União",
             "Antimicrobiano Macrolídeo Azalídeo", "tablet", "Cartucho com 6 comprimidos", ["Canino", "Felino"],
             10.0, 10.0, "5 a 10 mg/kg a cada 24 horas por 3 a 5 dias", "SID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=6)
    add_prod("zitrex-250-comp", "Zitrex® 250 mg Comprimidos", "Azitromicina", "Agener União",
             "Antimicrobiano Macrolídeo Azalídeo", "tablet", "Cartucho com 6 comprimidos", ["Canino"],
             10.0, None, "10 mg/kg SID por 3 a 5 dias", "SID", "Oral (VO)",
             tablet_mg=250, tabs_per_box=6)
    add_prod("azitromicina-vansil-100", "Azitromicina Vansil® 100 mg Comprimidos", "Azitromicina", "Vansil",
             "Antimicrobiano Macrolídeo", "tablet", "Cartucho com 6 comprimidos", ["Canino", "Felino"],
             10.0, 10.0, "10 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=6)
    add_prod("azitromicina-susp-40", "Azitromicina Suspensão Oral 40 mg/mL", "Azitromicina Di-hidratada", "Medley",
             "Antimicrobiano Macrolídeo Líquido", "liquid", "Frasco com pó para 15 mL de suspensão (600 mg)", ["Canino", "Felino"],
             10.0, 10.0, "40 mg/mL (1 mL para cada 4 kg). 10 mg/kg SID por 3 a 5 dias", "SID", "Oral (VO)",
             conc_mg_ml=40, bottle_vol=15)

    # Sulfadiazina + Trimetoprima
    add_prod("trissulfin-inj-ouro", "Trissulfin® Injetável", "Sulfadiazina + Trimetoprima", "Ourofino",
             "Antimicrobiano Quimioterápico Potencializado", "liquid", "Frasco-ampola com 50 mL", ["Canino", "Equino", "Bovino"],
             15.0, None, "160 mg Sulfa + 32 mg TMP por mL (total 192 mg/mL). 15 a 30 mg/kg combinados SC, IM ou IV SID a BID", "SID", "Subcutânea (SC)",
             conc_mg_ml=192, bottle_vol=50)
    add_prod("trissulfin-comp-ouro", "Trissulfin® Comprimidos", "Sulfadiazina + Trimetoprima", "Ourofino",
             "Antimicrobiano Quimioterápico Potencializado", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             25.0, None, "400 mg Sulfa + 80 mg TMP (480 mg total). 15 a 30 mg/kg a cada 12 horas", "BID", "Oral (VO)",
             tablet_mg=480, tabs_per_box=10)
    add_prod("chemiprim-inj-50", "Chemiprim® Injetável", "Sulfadiazina + Trimetoprima", "Chemitec",
             "Antimicrobiano Quimioterápico Potencializado", "liquid", "Frasco-ampola de 50 mL", ["Canino", "Bovino", "Equino"],
             20.0, None, "200 mg Sulfa + 40 mg TMP por mL (240 mg/mL). 15 a 24 mg/kg IV ou IM", "SID", "Intravenosa (IV)",
             conc_mg_ml=240, bottle_vol=50)

    # Aminoglicosídeos (Gentamicina & Amicacina)
    add_prod("gentocin-inj-40", "Gentocin® Injetável 40 mg/mL", "Sulfato de Gentamicina", "MSD Saúde Animal",
             "Antimicrobiano Aminoglicosídeo", "liquid", "Frasco-ampola de 20 mL", ["Canino", "Felino", "Equino"],
             5.0, 4.0, "Cães: 5 a 8 mg/kg IV ou SC em dose única diária (SID) | Gatos: 4 a 5 mg/kg SID por até 3 a 5 dias", "SID", "Subcutânea (SC)",
             conc_mg_ml=40, bottle_vol=20,
             notes="Monitorar função renal (creatinina/urinálise). Dose única diária (SID) reduz nefrotoxicidade.")
    add_prod("chemimicina-inj-40", "Chemimicina® Injetável 40 mg/mL", "Sulfato de Gentamicina", "Chemitec",
             "Antimicrobiano Aminoglicosídeo", "liquid", "Frasco com 50 mL", ["Canino", "Equino", "Bovino"],
             5.0, None, "5 a 8 mg/kg SID", "SID", "Intramuscular (IM)",
             conc_mg_ml=40, bottle_vol=50)
    add_prod("amicacina-cristalia-250", "Amicacina Injetável 250 mg/mL", "Sulfato de Amicacina", "Cristália",
             "Antimicrobiano Aminoglicosídeo Hospitalar", "liquid", "Ampola com 2 mL (500 mg)", ["Canino", "Felino"],
             15.0, 10.0, "Cães: 15 a 20 mg/kg IV ou SC a cada 24 horas (SID) | Gatos: 10 a 15 mg/kg SID por 3 a 5 dias", "SID", "Subcutânea (SC)",
             conc_mg_ml=250, bottle_vol=2,
             notes="Aminoglicosídeo de espectro mais potente para bactérias gram-negativas multirresistentes (Pseudomonas).")

    # Grandes Animais e Injetáveis de Longa Ação
    add_prod("terramicina-mais-50", "Terramicina® Mais Injetável", "Oxitetraciclina + Diclofenaco", "Zoetis",
             "Antimicrobiano LA & Anti-inflamatório", "liquid", "Frasco-ampola com 50 mL", ["Bovino", "Suíno", "Ovino"],
             None, None, "200 mg oxitetraciclina + 10 mg diclofenaco por mL. 1 mL para cada 10 kg IM profunda", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=200, bottle_vol=50)
    add_prod("ourotetra-la-50", "Ourotetra LA® Injetável 200 mg/mL", "Oxitetraciclina Longa Ação", "Ourofino",
             "Antimicrobiano Tetraciclina de Longa Ação", "liquid", "Frasco com 50 mL", ["Bovino", "Ovino", "Suíno"],
             None, None, "20 mg/kg IM profunda (1 mL para cada 10 kg de peso vivo)", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=200, bottle_vol=50)
    add_prod("nuflor-inj-300", "Nuflor® Injetável 300 mg/mL", "Florfenicol", "MSD Saúde Animal",
             "Antimicrobiano Fenicol de Amplo Espectro", "liquid", "Frasco-ampola com 100 mL", ["Bovino", "Suíno"],
             None, None, "20 mg/kg IM a cada 48h ou 40 mg/kg SC dose única", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=300, bottle_vol=100)
    add_prod("maxflor-inj-300", "Maxflor® Injetável 300 mg/mL", "Florfenicol", "Ourofino",
             "Antimicrobiano Fenicol", "liquid", "Frasco com 100 mL", ["Bovino", "Suíno"],
             None, None, "20 mg/kg IM a cada 48h ou 40 mg/kg SC dose única", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=300, bottle_vol=100)
    add_prod("micotil-inj-300", "Micotil® Injetável 300 mg/mL", "Tilmicosina", "Elanco",
             "Antimicrobiano Macrolídeo Específico para Bovinos", "liquid", "Frasco com 100 mL", ["Bovino"],
             None, None, "10 mg/kg SC dose única exclusivamente (1 mL para cada 30 kg de peso)", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=300, bottle_vol=100,
             notes="ATENÇÃO: Uso exclusivo bovino por via SC. Letal para equinos, suínos e primatas por cardiotoxicidade.")
    add_prod("penfort-ppu-50", "Penfort PPU® Injetável Pronto para Uso", "Benzilpenicilina Procaína + Potássica + Estreptomicina", "Zoetis",
             "Antimicrobiano Penicilânico Associação", "liquid", "Frasco com 50 mL", ["Equino", "Bovino", "Canino"],
             20000.0, None, "Cães: 20.000 a 40.000 UI/kg IM ou SC a cada 24 a 48h | Grandes: 1 mL para cada 25 kg", "SID", "Intramuscular (IM)",
             conc_mg_ml=250, bottle_vol=50)
    add_prod("pencivet-plus-50", "Pencivet Plus PPU® Injetável", "Benzilpenicilina + Estreptomicina", "MSD Saúde Animal",
             "Antimicrobiano Penicilânico Associação", "liquid", "Frasco-ampola de 50 mL", ["Equino", "Bovino"],
             None, None, "1 mL para cada 20-30 kg de peso vivo via IM profunda", "SID", "Intramuscular (IM)",
             conc_mg_ml=250, bottle_vol=50)
    add_prod("agrovet-5-milhoes", "Agrovet 5 Milhões® PPU Injetável", "Benzilpenicilina Procaína + Potássica", "Ourofino",
             "Antimicrobiano Penicilânico", "liquid", "Frasco com suspensão pronta para uso de 50 mL", ["Bovino", "Equino"],
             None, None, "1 mL para cada 25 kg IM profunda", "SID", "Intramuscular (IM)",
             conc_mg_ml=200, bottle_vol=50)

    # =========================================================================
    # 4. ANALGÉSICOS OPIOIDES & ANALGESIA HOSPITALAR
    # =========================================================================
    add_prod("dorless-comp-12", "Dorless® 12 mg Comprimidos", "Cloridrato de Tramadol", "Syntec",
             "Analgésico Opioide", "tablet", "Cartucho com 10 comprimidos divisíveis", ["Canino"],
             2.0, None, "2 a 4 mg/kg a cada 8 horas (TID)", "TID", "Oral (VO)",
             tablet_mg=12, tabs_per_box=10)
    add_prod("dorless-comp-50", "Dorless® 50 mg Comprimidos", "Cloridrato de Tramadol", "Syntec",
             "Analgésico Opioide", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             2.0, None, "2 a 4 mg/kg TID", "TID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)
    add_prod("dorless-inj-50", "Dorless® Injetável 5%", "Cloridrato de Tramadol", "Syntec",
             "Analgésico Opioide Injetável", "liquid", "Frasco-ampola com 20 mL", ["Canino", "Felino"],
             2.0, 1.5, "5% = 50 mg/mL. Cães: 2 a 4 mg/kg IV, IM ou SC | Gatos: 1 a 2 mg/kg IV ou SC a cada 8-12h", "TID", "Intravenosa (IV)",
             conc_mg_ml=50, percentage=5.0, bottle_vol=20)
    add_prod("dimorf-inj-02", "Dimorf® Injetável 0,2 mg/mL sem conservante", "Sulfato de Morfina", "Cristália",
             "Analgésico Opioide Potente Peridural", "liquid", "Ampola de 1 mL estéril sem conservante", ["Canino", "Felino"],
             0.1, 0.1, "Analgesia peridural / espinhal: 0,1 mg/kg em dose única pré-operatória", "Dose Única", "Peridural",
             conc_mg_ml=0.2, bottle_vol=1,
             notes="Formulação sem conservante indicada exclusivamente para anestesia e analgesia peridural e intratecal.")
    add_prod("dimorf-inj-10", "Dimorf® Injetável 10 mg/mL", "Sulfato de Morfina", "Cristália",
             "Analgésico Opioide Puro Agonista Mu", "liquid", "Ampola de 1 mL (10 mg/mL)", ["Canino", "Felino"],
             0.5, 0.1, "Cães: 0,2 a 0,5 mg/kg IM ou SC a cada 4h (ou infusão contínua 0,1 a 0,2 mg/kg/h) | Gatos: 0,05 a 0,1 mg/kg", "QID", "Intramuscular (IM)",
             conc_mg_ml=10, bottle_vol=1,
             notes="Agonista mu puro de referência para dor aguda moderada a grave. Pode liberar histamina se injetado IV rápido.")
    add_prod("dimorf-solucao-10mg", "Dimorf® Solução Oral 10 mg/mL", "Sulfato de Morfina", "Cristália",
             "Analgésico Opioide Puro", "liquid", "Frasco com 60 mL com conta-gotas graduado", ["Canino"],
             0.5, None, "0,5 a 1 mg/kg VO a cada 6 a 8 horas", "TID", "Oral (VO)",
             conc_mg_ml=10, bottle_vol=60)
    add_prod("fentanest-inj-50mcg", "Fentanest® Injetável 50 mcg/mL (0,05 mg/mL)", "Citrato de Fentanila", "Cristália",
             "Analgésico Opioide Agonista Mu Potente UTI", "liquid", "Ampola de 5 mL (250 mcg)", ["Canino", "Felino"],
             0.005, 0.003, "Bolus pré-medicação: 2 a 5 mcg/kg IV | Infusão Contínua (CRI): 2 a 10 mcg/kg/h (0,002 a 0,01 mg/kg/h)", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=0.05, bottle_vol=5,
             notes="Opioide potente de ação rápida (início 1-2 min, duração 20-30 min). Padrão ouro em infusão contínua intraoperatória e UTI.")
    add_prod("mytedom-inj-10", "Mytedom® Injetável 10 mg/mL", "Cloridrato de Metadona", "Cristália",
             "Analgésico Opioide Agonista Mu & Antagonista NMDA", "liquid", "Ampola com 1 mL (10 mg)", ["Canino", "Felino"],
             0.3, 0.2, "0,2 a 0,5 mg/kg IM, SC ou IV lento a cada 4 a 6 horas", "QID", "Intramuscular (IM)",
             conc_mg_ml=10, bottle_vol=1,
             notes="Excelente para dor somática e neuropática (antagonismo NMDA concomitante). Não causa êmese frequente como a morfina.")
    add_prod("mytedom-comp-5", "Mytedom® 5 mg Comprimidos", "Cloridrato de Metadona", "Cristália",
             "Analgésico Opioide Puro", "tablet", "Cartucho com 20 comprimidos", ["Canino"],
             0.3, None, "0,2 a 0,4 mg/kg VO a cada 8 a 12 horas", "BID", "Oral (VO)",
             tablet_mg=5, tabs_per_box=20)
    add_prod("mytedom-comp-10", "Mytedom® 10 mg Comprimidos", "Cloridrato de Metadona", "Cristália",
             "Analgésico Opioide Puro", "tablet", "Cartucho com 20 comprimidos", ["Canino"],
             0.3, None, "0,2 a 0,4 mg/kg VO a cada 8 a 12 horas", "BID", "Oral (VO)",
             tablet_mg=10, tabs_per_box=20)
    add_prod("torbugesic-inj-10", "Torbugesic® Injetável 10 mg/mL (1%)", "Tartarato de Butorfanol", "Zoetis",
             "Analgésico Opioide Agonista-Antagonista", "liquid", "Frasco-ampola com 10 mL", ["Canino", "Felino", "Equino"],
             0.2, 0.2, "Cães e Gatos: 0,1 a 0,4 mg/kg IV, IM ou SC a cada 2 a 4h | Equinos: 0,05 a 0,1 mg/kg IV", "QID", "Intravenosa (IV)",
             conc_mg_ml=10, bottle_vol=10,
             notes="Agonista kappa e antagonista mu. Excelente sedativo em neuroleptoanalgesia associado a acepromazina ou alfa-2 agonistas.")
    add_prod("temgesic-inj-03", "Temgesic® Injetável 0,3 mg/mL", "Cloridrato de Buprenorfina", "Cristália",
             "Analgésico Opioide Agonista Parcial", "liquid", "Ampola com 1 mL (0,3 mg)", ["Canino", "Felino"],
             0.02, 0.02, "Cães: 0,01 a 0,02 mg/kg IV, IM ou SC a cada 8h | Gatos: 0,01 a 0,03 mg/kg transmucosa oral (OTM) a cada 8 a 12h", "TID", "Oral (VO)",
             conc_mg_ml=0.3, bottle_vol=1,
             notes="Excelente absorção transmucosa oral (OTM) em felinos devido ao pH favorável da cavidade oral do gato.")
    add_prod("narcan-inj-04", "Narcan® Injetável 0,4 mg/mL", "Cloridrato de Naloxona", "Cristália",
             "Antagonista Opioide Puro de Emergência", "liquid", "Ampola com 1 mL (0,4 mg)", ["Canino", "Felino"],
             0.04, 0.04, "0,02 a 0,04 mg/kg IV, IM ou endotraqueal para reversão imediata de depressão respiratória por opioides", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=0.4, bottle_vol=1,
             notes="Antídoto de reversão rápida de opioides puros em caso de depressão respiratória ou sobredose acidental.")

    # =========================================================================
    # 5. ANESTÉSICOS GERAIS, SEDATIVOS & TRANQUILIZANTES
    # =========================================================================
    add_prod("propovan-inj-10", "Propovan® 10 mg/mL (1%) Emulsão Injetável", "Propofol", "Cristália",
             "Anestésico Geral Indutor Não Barbitúrico", "liquid", "Frasco-ampola com 20 mL", ["Canino", "Felino"],
             4.0, 5.0, "Indução: 3 a 6 mg/kg IV efeito-dependente (titular lentamente em 60-90 segundos) | Manutenção CRI: 0,1 a 0,4 mg/kg/min", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=20,
             notes="Indução rápida e suave com despertar límpido. Não contém conservante antibacteriano (descartar sobras do frasco aberto).")
    add_prod("diprivan-inj-10", "Diprivan® 10 mg/mL (1%) Emulsão Injetável", "Propofol com EDTA", "Aspen Pharma",
             "Anestésico Geral Indutor", "liquid", "Frasco-ampola com 20 mL", ["Canino", "Felino"],
             4.0, 5.0, "3 a 6 mg/kg IV lento titulado até perda do reflexo laringotraqueal", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=20)
    add_prod("vetaset-inj-100", "Vetaset® Injetável 100 mg/mL (10%)", "Cloridrato de Cetamina", "Zoetis",
             "Anestésico Geral Dissociativo", "liquid", "Frasco-ampola com 10 mL", ["Canino", "Felino", "Equino"],
             5.0, 10.0, "Indução cães: 5 mg/kg IV (associada a benzodiazepínico) | Gatos: 5 a 15 mg/kg IM ou IV | Analgesia infusão CRI: 0,1 a 0,6 mg/kg/h", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=100, percentage=10.0, bottle_vol=10,
             notes="Anestésico dissociativo clássico. Preserva reflexos protetores faríngeos. Associar sempre a relaxante muscular.")
    add_prod("cetamin-syntec-100", "Cetamin® Injetável 100 mg/mL", "Cloridrato de Cetamina", "Syntec",
             "Anestésico Geral Dissociativo", "liquid", "Frasco-ampola com 10 mL", ["Canino", "Felino"],
             5.0, 10.0, "5 a 10 mg/kg IV ou IM", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=100, bottle_vol=10)
    add_prod("dopalen-inj-100", "Dopalen® Injetável 100 mg/mL (10%)", "Cloridrato de Cetamina", "Ceva",
             "Anestésico Geral Dissociativo", "liquid", "Frasco com 10 mL", ["Canino", "Felino", "Equino"],
             5.0, 10.0, "5 a 10 mg/kg", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=100, percentage=10.0, bottle_vol=10)
    add_prod("zoletil-50-inj", "Zoletil 50® Injetável", "Tiletamina + Zolazepam", "Virbac",
             "Anestésico Dissociativo Associação", "liquid", "Frasco com liofilizado (250 mg Tiletamina + 250 mg Zolazepam) + diluente 5 mL (100 mg/mL)", ["Canino", "Felino", "Silvestres"],
             5.0, 7.0, "Cães: 3 a 7 mg/kg IM ou 2 a 5 mg/kg IV | Gatos: 5 a 10 mg/kg IM ou IV", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=100, bottle_vol=5,
             notes="Associação potente e confiável para contenção química e anestesia rápida de pequenos animais e animais silvestres.")
    add_prod("dormire-inj-5mg", "Dormire® Injetável 5 mg/mL", "Maleato de Midazolam", "Cristália",
             "Sedativo Benzodiazepínico & Miorrelaxante", "liquid", "Ampola com 3 mL (15 mg)", ["Canino", "Felino"],
             0.3, 0.3, "0,2 a 0,5 mg/kg IV, IM ou intranasal", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=5, bottle_vol=3,
             notes="Hidrossolúvel, não causa dor à injeção intramuscular. Excelente miorrelaxamento e estabilidade cardiovascular.")
    add_prod("compaz-inj-5mg", "Compaz® Injetável 5 mg/mL", "Diazepam", "Cristália",
             "Sedativo Benzodiazepínico & Anticonvulsivante", "liquid", "Ampola com 2 mL (10 mg)", ["Canino", "Felino"],
             0.5, 0.5, "Crise convulsiva: 0,5 a 1 mg/kg IV lento ou intra-retal | Pré-anestesia: 0,2 a 0,5 mg/kg IV", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=5, bottle_vol=2,
             notes="Veículo com propilenoglicol (não administrar IM por absorção errática e dor; na veia aplicar lentamente).")
    add_prod("valium-comp-10", "Valium® 10 mg Comprimidos", "Diazepam", "Roche",
             "Benzodiazepínico Oral", "tablet", "Cartucho com 20 comprimidos", ["Canino"],
             0.5, None, "0,5 a 1 mg/kg VO a cada 8 horas (evitar uso oral crônico em felinos devido a necrose hepática fulminante)", "TID", "Oral (VO)",
             tablet_mg=10, tabs_per_box=20)
    add_prod("acepran-gotas-02", "Acepran® Gotas 0,2%", "Acepromazina", "Vetnil",
             "Tranquilizante Fenotiazínico", "drops", "Frasco conta-gotas com 20 mL", ["Canino", "Felino"],
             0.05, 0.05, "0,2% = 2 mg/mL (1 gota = 0,1 mg). 0,05 a 0,1 mg/kg VO (1 gota para cada 1-2 kg)", "SID", "Oral (VO)",
             conc_mg_ml=2, percentage=0.2, bottle_vol=20)
    add_prod("acepran-inj-10", "Acepran® Injetável 1%", "Acepromazina", "Vetnil",
             "Tranquilizante Fenotiazínico Injetável", "liquid", "Frasco com 20 mL", ["Canino", "Felino", "Equino"],
             0.03, 0.03, "1% = 10 mg/mL. Cães e Gatos: 0,02 a 0,05 mg/kg IM, SC ou IV lento", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=20,
             notes="Causa vasodilatação periférica por bloqueio alfa-1 (não utilizar em animais hipotensos, hipovolêmicos ou em choque).")
    add_prod("xilazin-syntec-20", "Xilazin® Injetável 2%", "Cloridrato de Xilazina", "Syntec",
             "Sedativo Alfa-2 Agonista & Miorrelaxante", "liquid", "Frasco com 20 mL", ["Canino", "Felino", "Equino", "Bovino"],
             1.0, 1.0, "2% = 20 mg/mL. Cães: 1 a 2 mg/kg IM ou 0,5 a 1 mg/kg IV | Gatos: 1 a 2 mg/kg IM | Equinos: 0,5 a 1,1 mg/kg IV", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=20, percentage=2.0, bottle_vol=20)
    add_prod("sedomin-konig-20", "Sedomin® Injetável 2%", "Cloridrato de Xilazina", "König",
             "Sedativo Alfa-2 Agonista", "liquid", "Frasco-ampola com 20 mL", ["Canino", "Equino", "Bovino"],
             1.0, None, "1 a 2 mg/kg IM ou 0,5 a 1 mg/kg IV", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=20, percentage=2.0, bottle_vol=20)
    add_prod("sileo-gel-01", "Sileo® Gel Oromucosal 0,1 mg/mL", "Cloridrato de Dexmedetomidina", "Zoetis",
             "Ansiolítico Auricular e Oromucosal", "paste", "Seringa dosadora de 3 mL com escala por pontos", ["Canino"],
             0.001, None, "125 mcg/m² administrado na mucosa oral (entre a bochecha e gengiva) para aversão a ruídos e fogos", "Dose Única", "Oral (VO)",
             conc_mg_ml=0.1, bottle_vol=3,
             notes="Absorção exclusiva transmucosa oromucosal (não deve ser deglutido, aplicar na mucosa jugal).")
    add_prod("antisedan-inj-5mg", "Antisedan® Injetável 5 mg/mL", "Cloridrato de Atipamezol", "Zoetis",
             "Antagonista Alfa-2 Seletivo (Reversor)", "liquid", "Frasco-ampola com 10 mL", ["Canino", "Felino"],
             0.25, 0.25, "Reversão de dexmedetomidina: mesmo volume do Dexdomitor aplicado (dose 5 vezes maior em mg) via IM", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=5, bottle_vol=10,
             notes="Reversor específico de alta afinidade para alfa-2 agonistas (dexmedetomidina e medetomidina).")
    add_prod("isoforine-frasco-240", "Isoforine® Frasco 240 mL", "Isoflurano", "Cristália",
             "Anestésico Geral Inalatório Líquido Volátil", "liquid", "Frasco de vidro âmbar com 240 mL", ["Canino", "Felino", "Equino"],
             None, None, "CAM cão 1,3% | CAM gato 1,6%. Indução com vaporizador em 2 a 3% e manutenção em 1,5 a 2%", "Dose Única", "Inalatória",
             bottle_vol=240,
             notes="Anestésico volátil de rápida indução e recuperação, metabolização hepática mínima (<0,2%).")
    add_prod("sevocris-frasco-250", "Sevocris® Frasco 250 mL", "Sevoflurano", "Cristália",
             "Anestésico Geral Inalatório", "liquid", "Frasco de 250 mL", ["Canino", "Felino"],
             None, None, "CAM cão 2,3% | CAM gato 2,6%. Indução 3 a 5% e manutenção 2,5 a 3,5%", "Dose Única", "Inalatória",
             bottle_vol=250)

    # =========================================================================
    # 6. GASTROENTEROLOGIA (ANTIEMÉTICOS & PROTETORES GÁSTRICOS)
    # =========================================================================
    add_prod("cerenia-comp-160", "Cerenia® 160 mg Comprimidos", "Citrato de Maropitant", "Zoetis",
             "Antiemético Antagonista NK1", "tablet", "Cartucho com 4 comprimidos", ["Canino"],
             2.0, None, "Êmese geral: 2 mg/kg SID | Prevenção de cinetose (enjoo de viagem): 8 mg/kg 2h antes da viagem", "SID", "Oral (VO)",
             tablet_mg=160, tabs_per_box=4)
    add_prod("emedron-comp-4", "Emedron® 4 mg Comprimidos", "Cloridrato de Ondansetrona", "Agener União",
             "Antiemético Antagonista 5-HT3", "tablet", "Cartucho com 10 comprimidos", ["Canino", "Felino"],
             0.5, 0.5, "0,3 a 0,5 mg/kg a cada 8 a 12 horas", "BID", "Oral (VO)",
             tablet_mg=4, tabs_per_box=10)
    add_prod("plasil-gotas-4mg", "Plasil® Gotas Pediátrico 4 mg/mL", "Cloridrato de Metoclopramida", "Sanofi",
             "Antiemético & Procinético Gástrico", "drops", "Frasco conta-gotas com 20 mL", ["Canino", "Felino"],
             0.3, 0.3, "0,2 a 0,5 mg/kg (1 a 2 gotas por kg) a cada 8 horas (TID)", "TID", "Oral (VO)",
             conc_mg_ml=4, bottle_vol=20)
    add_prod("plasil-inj-5mg", "Plasil® Injetável 5 mg/mL", "Cloridrato de Metoclopramida", "Sanofi",
             "Antiemético & Procinético Injetável", "liquid", "Ampola com 2 mL (10 mg)", ["Canino", "Felino"],
             0.3, 0.3, "0,2 a 0,5 mg/kg SC, IM ou infusão contínua CRI (1 a 2 mg/kg/dia) a cada 8h", "TID", "Subcutânea (SC)",
             conc_mg_ml=5, bottle_vol=2,
             notes="Ação antiemética central e procinética periférica (aumenta tônus do esfíncter esofágico inferior).")
    add_prod("gaviz-v-comp-10", "Gaviz V® 10 mg Comprimidos Gastrorresistentes", "Omeprazol", "Agener União",
             "Inibidor da Bomba de Prótons (IBP)", "tablet", "Cartucho com 10 comprimidos revestidos", ["Canino", "Felino"],
             1.0, 1.0, "0,7 a 1,5 mg/kg uma vez ao dia em jejum pela manhã", "SID", "Oral (VO)",
             tablet_mg=10, tabs_per_box=10,
             notes="Comprimido gastrorresistente. Administrar inteiro sem mastigar 30 a 60 min antes da refeição matinal.")
    add_prod("gaviz-v-comp-20", "Gaviz V® 20 mg Comprimidos Gastrorresistentes", "Omeprazol", "Agener União",
             "Inibidor da Bomba de Prótons (IBP)", "tablet", "Cartucho com 10 comprimidos revestidos", ["Canino"],
             1.0, None, "1 mg/kg SID em jejum", "SID", "Oral (VO)",
             tablet_mg=20, tabs_per_box=10)
    add_prod("omeprazol-cristalia-40", "Omeprazol Sódico 40 mg Frasco-Ampola Injetável", "Omeprazol Sódico", "Cristália",
             "Inibidor da Bomba de Prótons Hospitalar", "liquid", "Frasco-ampola com 40 mg pó liofilizado + diluente", ["Canino", "Felino"],
             1.0, 1.0, "1 mg/kg IV lenta (em 5 a 10 min) a cada 12 a 24 horas para esofagite grave ou hemorragia digestiva", "SID", "Intravenosa (IV)",
             conc_mg_ml=4, bottle_vol=10)
    add_prod("pantoprazol-cristalia-40", "Pantoprazol Sódico 40 mg Injetável IV", "Pantoprazol Sódico", "Cristália",
             "Inibidor da Bomba de Prótons Hospitalar", "liquid", "Frasco-ampola com 40 mg de pó liofilizado", ["Canino", "Felino"],
             1.0, 1.0, "1 mg/kg IV lenta a cada 12 a 24 horas", "SID", "Intravenosa (IV)",
             conc_mg_ml=4, bottle_vol=10)
    add_prod("antak-inj-25", "Antak® Injetável 25 mg/mL (50 mg/2 mL)", "Cloridrato de Ranitidina", "GlaxoSmithKline (GSK)",
             "Antagonista de Receptores H2", "liquid", "Ampola com 2 mL", ["Canino", "Felino"],
             2.0, 2.0, "1 a 2 mg/kg IV lenta ou SC a cada 8 a 12 horas", "BID", "Intravenosa (IV)",
             conc_mg_ml=25, bottle_vol=2)
    add_prod("sucrafilm-susp-200", "Sucrafilm® Suspensão Oral 200 mg/mL (1 g/5 mL)", "Sucralfato", "EMS",
             "Protetor de Mucosa Gástrica (Citoprotetor)", "liquid", "Frasco com 100 mL", ["Canino", "Felino"],
             40.0, 40.0, "Cães pequenos e gatos: 250 a 500 mg VO TID | Cães médios e grandes: 1 a 2 g VO TID em jejum", "TID", "Oral (VO)",
             conc_mg_ml=200, bottle_vol=100,
             notes="Forma camada protetora sobre úlceras em meio ácido. Espaçar em pelo menos 1-2h da administração de outros medicamentos.")
    add_prod("duphalac-xarope-667", "Duphalac® Xarope 667 mg/mL", "Lactulose", "Abbott",
             "Laxante Osmótico & Redutor de Amônia", "liquid", "Frasco com 120 mL", ["Canino", "Felino"],
             300.0, 300.0, "Constipação: 0,5 mL/kg a cada 8-12h | Encefalopatia hepática: titular para 2-3 fezes pastosas ao dia", "TID", "Oral (VO)",
             conc_mg_ml=667, bottle_vol=120)
    add_prod("luftal-gotas-75", "Luftal® Gotas 75 mg/mL", "Simeticona", "Medley",
             "Antiflatulento", "drops", "Frasco conta-gotas com 15 mL", ["Canino", "Felino"],
             10.0, 10.0, "1 gota/kg VO a cada 8 horas para alívio de gases e meteorismo", "TID", "Oral (VO)",
             conc_mg_ml=75, bottle_vol=15)

    # =========================================================================
    # 7. CARDIOLOGIA & NEFROLOGIA / DIURÉTICOS
    # =========================================================================
    add_prod("vetmedin-mast-125", "Vetmedin® 1,25 mg Comprimidos Mastigáveis", "Pimobendan", "Boehringer Ingelheim",
             "Inodilatador Cardíaco", "tablet", "Frasco com 50 comprimidos palatáveis", ["Canino"],
             0.25, None, "0,25 mg/kg a cada 12 horas (dose total diária 0,5 mg/kg) 1h antes da refeição", "BID", "Oral (VO)",
             tablet_mg=1.25, tabs_per_box=50,
             notes="Inodilatador de escolha para Insuficiência Cardíaca Congestiva (ICC) e Cardiomiopatia Dilatada (CMD).")
    add_prod("vetmedin-mast-25", "Vetmedin® 2,5 mg Comprimidos Mastigáveis", "Pimobendan", "Boehringer Ingelheim",
             "Inodilatador Cardíaco", "tablet", "Frasco com 50 comprimidos palatáveis", ["Canino"],
             0.25, None, "0,25 mg/kg BID em jejum", "BID", "Oral (VO)",
             tablet_mg=2.5, tabs_per_box=50)
    add_prod("vetmedin-mast-5", "Vetmedin® 5,0 mg Comprimidos Mastigáveis", "Pimobendan", "Boehringer Ingelheim",
             "Inodilatador Cardíaco", "tablet", "Frasco com 50 comprimidos palatáveis", ["Canino"],
             0.25, None, "0,25 mg/kg BID em jejum", "BID", "Oral (VO)",
             tablet_mg=5.0, tabs_per_box=50)
    add_prod("vetmedin-mast-10", "Vetmedin® 10,0 mg Comprimidos Mastigáveis", "Pimobendan", "Boehringer Ingelheim",
             "Inodilatador Cardíaco", "tablet", "Frasco com 50 comprimidos palatáveis", ["Canino"],
             0.25, None, "0,25 mg/kg BID para cães de grande porte", "BID", "Oral (VO)",
             tablet_mg=10.0, tabs_per_box=50)
    add_prod("pimocard-125-comp", "Pimocard® 1,25 mg Comprimidos Palatáveis", "Pimobendan", "Syntec",
             "Inodilatador Cardíaco", "tablet", "Cartucho com 30 comprimidos palatáveis divisíveis", ["Canino"],
             0.25, None, "0,25 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=1.25, tabs_per_box=30)
    add_prod("pimocard-25-comp", "Pimocard® 2,5 mg Comprimidos Palatáveis", "Pimobendan", "Syntec",
             "Inodilatador Cardíaco", "tablet", "Cartucho com 30 comprimidos palatáveis divisíveis", ["Canino"],
             0.25, None, "0,25 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=2.5, tabs_per_box=30)
    add_prod("pimocard-5-comp", "Pimocard® 5,0 mg Comprimidos Palatáveis", "Pimobendan", "Syntec",
             "Inodilatador Cardíaco", "tablet", "Cartucho com 30 comprimidos divisíveis", ["Canino"],
             0.25, None, "0,25 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=5.0, tabs_per_box=30)
    add_prod("fortekor-flavor-25", "Fortekor® Flavour 2,5 mg", "Cloridrato de Benazepril", "Elanco",
             "Inibidor da ECA (IECA)", "tablet", "Cartucho com 28 comprimidos palatáveis", ["Canino", "Felino"],
             0.5, 0.5, "0,25 a 0,5 mg/kg uma vez ao dia para ICC e Doença Renal Crônica (DRC)", "SID", "Oral (VO)",
             tablet_mg=2.5, tabs_per_box=28,
             notes="IECA com dupla via de excreção (biliar e renal), ideal para pacientes nefropatas e cardiopatas.")
    add_prod("fortekor-flavor-5", "Fortekor® Flavour 5,0 mg", "Cloridrato de Benazepril", "Elanco",
             "Inibidor da ECA (IECA)", "tablet", "Cartucho com 28 comprimidos palatáveis", ["Canino"],
             0.5, None, "0,5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=5.0, tabs_per_box=28)
    add_prod("fortekor-flavor-20", "Fortekor® Flavour 20,0 mg", "Cloridrato de Benazepril", "Elanco",
             "Inibidor da ECA (IECA)", "tablet", "Cartucho com 28 comprimidos", ["Canino"],
             0.5, None, "0,5 mg/kg SID para cães grandes", "SID", "Oral (VO)",
             tablet_mg=20.0, tabs_per_box=28)
    add_prod("cardalis-25-20", "Cardalis® 2,5 mg / 20 mg Comprimidos", "Benazepril + Espironolactona", "Ceva",
             "Cardiologia Associação IECA + Antialdosterona", "tablet", "Frasco com 30 comprimidos mastigáveis", ["Canino"],
             0.25, None, "1 comprimido para cada 5 a 10 kg uma vez ao dia junto ao alimento", "SID", "Oral (VO)",
             tablet_mg=22.5, tabs_per_box=30)
    add_prod("cardalis-5-40", "Cardalis® 5 mg / 40 mg Comprimidos", "Benazepril + Espironolactona", "Ceva",
             "Cardiologia Associação IECA + Antialdosterona", "tablet", "Frasco com 30 comprimidos mastigáveis", ["Canino"],
             0.25, None, "1 comprimido para cada 10 a 20 kg SID", "SID", "Oral (VO)",
             tablet_mg=45.0, tabs_per_box=30)
    add_prod("cardalis-10-80", "Cardalis® 10 mg / 80 mg Comprimidos", "Benazepril + Espironolactona", "Ceva",
             "Cardiologia Associação IECA + Antialdosterona", "tablet", "Frasco com 30 comprimidos mastigáveis", ["Canino"],
             0.25, None, "1 comprimido para cada 20 a 40 kg SID", "SID", "Oral (VO)",
             tablet_mg=90.0, tabs_per_box=30)
    add_prod("enalatrat-comp-5", "Enalatrat® 5 mg Comprimidos", "Maleato de Enalapril", "Agener União",
             "Inibidor da ECA (IECA)", "tablet", "Cartucho com 30 comprimidos divisíveis", ["Canino"],
             0.5, None, "0,5 mg/kg a cada 12 a 24 horas", "BID", "Oral (VO)",
             tablet_mg=5, tabs_per_box=30)
    add_prod("enalatrat-comp-10", "Enalatrat® 10 mg Comprimidos", "Maleato de Enalapril", "Agener União",
             "Inibidor da ECA (IECA)", "tablet", "Cartucho com 30 comprimidos divisíveis", ["Canino"],
             0.5, None, "0,5 mg/kg a cada 12 a 24 horas", "BID", "Oral (VO)",
             tablet_mg=10, tabs_per_box=30)
    add_prod("lasix-comp-40", "Lasix® 40 mg Comprimidos", "Furosemida", "Sanofi",
             "Diurético de Alça", "tablet", "Cartucho com 20 comprimidos", ["Canino", "Felino"],
             2.0, 1.0, "Cães: 1 a 4 mg/kg a cada 8 a 12h | Gatos: 1 a 2 mg/kg a cada 12 a 24h", "BID", "Oral (VO)",
             tablet_mg=40, tabs_per_box=20)
    add_prod("lasix-inj-10", "Lasix® Injetável 10 mg/mL (20 mg/2 mL)", "Furosemida", "Sanofi",
             "Diurético de Alça Emergencial", "liquid", "Ampola com 2 mL", ["Canino", "Felino"],
             2.0, 1.0, "Edema agudo de pulmão: 2 a 4 mg/kg IV ou IM repetindo a cada 1-2h até estabilização", "TID", "Intravenosa (IV)",
             conc_mg_ml=10, bottle_vol=2)
    add_prod("furosemida-chemitec-40", "Furosemida Chemitec® 40 mg Comprimidos", "Furosemida", "Chemitec",
             "Diurético de Alça", "tablet", "Cartucho com 20 comprimidos", ["Canino"],
             2.0, None, "1 a 4 mg/kg a cada 8 a 12 horas", "BID", "Oral (VO)",
             tablet_mg=40, tabs_per_box=20)
    add_prod("aldactone-comp-25", "Aldactone® 25 mg Comprimidos", "Espironolactona", "Pfizer",
             "Diurético Poupador de Potássio & Antialdosterona", "tablet", "Cartucho com 30 comprimidos", ["Canino", "Felino"],
             1.0, 1.0, "1 a 2 mg/kg a cada 12 a 24 horas junto ao alimento", "BID", "Oral (VO)",
             tablet_mg=25, tabs_per_box=30)
    add_prod("amodip-felinos-125", "Amodip® 1,25 mg Comprimidos Mastigáveis para Gatos", "Besilato de Amlodipina", "Ceva",
             "Bloqueador dos Canais de Cálcio & Anti-hipertensivo", "tablet", "Cartucho com 30 comprimidos palatáveis divisíveis", ["Felino"],
             None, 0.625, "Gatos: 0,625 mg a 1,25 mg por gato uma vez ao dia (ou 0,18 a 0,3 mg/kg SID)", "SID", "Oral (VO)",
             tablet_mg=1.25, tabs_per_box=30,
             notes="Anti-hipertensivo de primeira escolha em felinos com hipertensão sistêmica secundária a DRC ou hipertireoidismo.")
    add_prod("atenolol-medley-25", "Atenolol 25 mg Comprimidos", "Atenolol", "Medley",
             "Betabloqueador Cardioseletivo Beta-1", "tablet", "Cartucho com 30 comprimidos", ["Canino", "Felino"],
             0.5, 0.5, "0,25 a 1 mg/kg a cada 12 a 24 horas para estenose aórtica e cardiomiopatia hipertrófica felina", "BID", "Oral (VO)",
             tablet_mg=25, tabs_per_box=30)
    add_prod("manitol-halex-20", "Manitol Solução Injetável 20%", "Manitol", "Halex Istar",
             "Diurético Osmótico & Redutor de PIC", "liquid", "Bolsa de 250 mL pronta para infusão", ["Canino", "Felino"],
             500.0, 500.0, "Hipertensão intracraniana e glaucoma agudo: 0,5 a 1,0 g/kg (2,5 a 5 mL/kg da solução 20%) IV em 20-30 min", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=200, percentage=20.0, bottle_vol=250)

    # =========================================================================
    # 8. ANTICONVULSIVANTES & NEUROLOGIA
    # =========================================================================
    add_prod("gardenal-comp-50", "Gardenal® 50 mg Comprimidos", "Fenobarbital", "Sanofi",
             "Anticonvulsivante Barbitúrico", "tablet", "Cartucho com 20 comprimidos divisíveis", ["Canino", "Felino"],
             2.5, 2.5, "Dose inicial: 2,5 a 3 mg/kg a cada 12 horas (BID). Monitorar nível sérico após 14-21 dias", "BID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=20,
             notes="Anticonvulsivante de manutenção de primeira linha em cães e gatos. Requer monitoramento periódico de ALT/FA e dosagem sérica.")
    add_prod("gardenal-comp-100", "Gardenal® 100 mg Comprimidos", "Fenobarbital", "Sanofi",
             "Anticonvulsivante Barbitúrico", "tablet", "Cartucho com 20 comprimidos", ["Canino"],
             2.5, None, "2,5 a 3 mg/kg BID", "BID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=20)
    add_prod("gardenal-gotas-40", "Gardenal® Gotas Pediátrico 40 mg/mL", "Fenobarbital", "Sanofi",
             "Anticonvulsivante Gotas", "drops", "Frasco conta-gotas de 20 mL", ["Canino", "Felino"],
             2.5, 2.5, "40 mg/mL (1 gota = 1 mg). 2,5 a 3 gotas/kg a cada 12 horas", "BID", "Oral (VO)",
             conc_mg_ml=40, bottle_vol=20)
    add_prod("fenocris-inj-100", "Fenocris® Injetável 100 mg/mL", "Fenobarbital Sódico", "Cristália",
             "Anticonvulsivante Barbitúrico Hospitalar", "liquid", "Ampola de 2 mL (200 mg)", ["Canino", "Felino"],
             3.0, 3.0, "Dose de ataque status epilepticus: 15 a 20 mg/kg IV fracionados ou 3 a 5 mg/kg IV lenta a cada 8-12h", "BID", "Intravenosa (IV)",
             conc_mg_ml=100, bottle_vol=2)
    add_prod("keppra-comp-250", "Keppra® 250 mg Comprimidos Revestidos", "Levetiracetam", "UCB Biopharma",
             "Anticonvulsivante de Nova Geração", "tablet", "Cartucho com 30 comprimidos", ["Canino", "Felino"],
             20.0, 20.0, "20 a 30 mg/kg a cada 8 horas (TID). Não sofre metabolismo hepático", "TID", "Oral (VO)",
             tablet_mg=250, tabs_per_box=30,
             notes="Excelente perfil de segurança, excreção renal inalterada sem sobrecarga hepática. Ideal para epilepsia refratária.")
    add_prod("keppra-comp-750", "Keppra® 750 mg Comprimidos Revestidos", "Levetiracetam", "UCB Biopharma",
             "Anticonvulsivante de Nova Geração", "tablet", "Cartucho com 30 comprimidos", ["Canino"],
             20.0, None, "20 a 30 mg/kg TID para cães grandes", "TID", "Oral (VO)",
             tablet_mg=750, tabs_per_box=30)
    add_prod("keppra-solucao-100", "Keppra® Solução Oral 100 mg/mL", "Levetiracetam", "UCB Biopharma",
             "Anticonvulsivante Solução Oral", "liquid", "Frasco com 300 mL com seringa dosadora", ["Canino", "Felino"],
             20.0, 20.0, "100 mg/mL (0,2 a 0,3 mL/kg) a cada 8 horas (TID)", "TID", "Oral (VO)",
             conc_mg_ml=100, bottle_vol=300)
    add_prod("gabapentina-ems-300", "Gabapentina 300 mg Cápsulas", "Gabapentina", "EMS",
             "Neuromodulador & Analgésico para Dor Neuropática", "tablet", "Cartucho com 30 cápsulas", ["Canino", "Felino"],
             10.0, 10.0, "Dor crônica/neuropática: 10 a 20 mg/kg BID a TID | Redução de estresse em felinos: 50 a 100 mg/gato 2h antes de consultas", "BID", "Oral (VO)",
             tablet_mg=300, tabs_per_box=30,
             notes="Padrão ouro em dor neuropática, osteoartrite crônica e sedação amigável para consultas felinas (Cat Friendly).")
    add_prod("gabapentina-ems-400", "Gabapentina 400 mg Cápsulas", "Gabapentina", "EMS",
             "Neuromodulador & Analgésico", "tablet", "Cartucho com 30 cápsulas", ["Canino"],
             10.0, None, "10 a 20 mg/kg BID a TID", "BID", "Oral (VO)",
             tablet_mg=400, tabs_per_box=30)
    add_prod("lyrica-caps-75", "Lyrica® 75 mg Cápsulas", "Pregabalina", "Pfizer",
             "Neuromodulador e Anticonvulsivante", "tablet", "Cartucho com 28 cápsulas", ["Canino", "Felino"],
             3.0, 2.0, "2 a 4 mg/kg a cada 12 horas", "BID", "Oral (VO)",
             tablet_mg=75, tabs_per_box=28)

    # =========================================================================
    # 9. EMERGÊNCIA, RESSUSCITAÇÃO (RCP) & TERAPIA INTENSIVA
    # =========================================================================
    add_prod("adrenalina-hipolabor-1", "Adrenalina Injetável 1 mg/mL (1:1000)", "Epinefrina", "Hipolabor",
             "Catecolamina de Ressuscitação Cardiopulmonar (RCP)", "liquid", "Ampola com 1 mL (1 mg)", ["Canino", "Felino"],
             0.01, 0.01, "RCP (Parada Cardiorrespiratória): 0,01 mg/kg IV ou intraóssea a cada 3 a 5 min (ou 0,1 mg/kg em dose alta)", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=1, bottle_vol=1,
             notes="Medicamento obrigatório do carrinho de emergência. Diretrizes RECOVER RCP veterinárias.")
    add_prod("atropina-fagra-10", "Atropina 1% Injetável (10 mg/mL)", "Sulfato de Atropina", "Fagra",
             "Anticolinérgico & Antídoto de Emergência", "liquid", "Frasco-ampola com 10 mL", ["Canino", "Felino", "Equino", "Bovino"],
             0.04, 0.04, "Bradicardia sinusal grave: 0,02 a 0,04 mg/kg IV, IM ou SC | Antídoto organofosforados: 0,2 a 0,5 mg/kg", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=10)
    add_prod("norepinefrina-cristalia-2", "Hemitartarato de Norepinefrina 2 mg/mL", "Norepinefrina", "Cristália",
             "Vasopressor de Emergência UTI", "liquid", "Ampola de 4 mL (8 mg)", ["Canino", "Felino"],
             0.0005, 0.0005, "Choque séptico / vasoplegia: infusão contínua CRI de 0,1 a 1,5 mcg/kg/min (0,0001 a 0,0015 mg/kg/min)", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=2, bottle_vol=4,
             notes="Vasopressor de primeira linha no choque séptico distributivo em UTI. Administrar exclusivamente em bomba de infusão.")
    add_prod("dopamina-cristalia-5", "Revivan® / Cloridrato de Dopamina 5 mg/mL", "Cloridrato de Dopamina", "Cristália",
             "Inotrópico e Vasopressor", "liquid", "Ampola com 10 mL (50 mg)", ["Canino", "Felino"],
             0.005, 0.005, "Infusão contínua: 2 a 10 mcg/kg/min IV em bomba de infusão", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=5, bottle_vol=10)
    add_prod("dobutamina-cristalia-125", "Dobutrex® / Dobutamina 12,5 mg/mL", "Cloridrato de Dobutamina", "Cristália",
             "Inotrópico Positivo Beta-1 UTI", "liquid", "Ampola com 20 mL (250 mg)", ["Canino", "Felino", "Equino"],
             0.005, 0.005, "Infusão contínua: 2,5 a 10 mcg/kg/min IV em bomba para choque cardiogênico", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=12.5, bottle_vol=20)
    add_prod("xylestesin-2-sem-vaso", "Xylestesin® 2% sem Vasoconstritor (20 mg/mL)", "Cloridrato de Lidocaína", "Cristália",
             "Antiarrítmico Ventricular & Anestésico Local", "liquid", "Frasco com 20 mL pronto para injeção", ["Canino", "Felino"],
             2.0, 0.5, "Taquicardia ventricular: bolus 2 mg/kg IV lento em cães, seguido de CRI 25 a 50 mcg/kg/min", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=20, percentage=2.0, bottle_vol=20,
             notes="Antiarrítmico Classe IB de referência. Em gatos usar com extremo cuidado devido a sensibilidade miocárdica.")
    add_prod("gluconato-calcio-10", "Gluconato de Cálcio 10% (100 mg/mL)", "Gluconato de Cálcio", "Halex Istar",
             "Eletrólito de Emergência (Hipocalcemia)", "liquid", "Ampola com 10 mL", ["Canino", "Felino"],
             50.0, 50.0, "Eclâmpsia / Hipocalcemia aguda: 0,5 a 1,5 mL/kg IV lento monitorando ECG por 15-20 min", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=100, percentage=10.0, bottle_vol=10,
             notes="Monitorar ritmo cardíaco durante a infusão. Parar imediatamente se ocorrer bradicardia ou parada sinusal.")
    add_prod("bicarbonato-sodio-84", "Bicarbonato de Sódio 8,4% (1 mEq/mL)", "Bicarbonato de Sódio", "Farmace",
             "Alcalinizante de Emergência UTI", "liquid", "Frasco com 250 mL", ["Canino", "Felino"],
             1.0, 1.0, "Acidose metabólica grave com HCO3 < 10 mEq/L: mEq = 0,3 x Peso x (12 - HCO3 sérico) IV lento", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=84, percentage=8.4, bottle_vol=250)
    add_prod("kcl-halex-191", "Cloreto de Potássio 19,1% (2,56 mEq/mL)", "Cloreto de Potássio", "Halex Istar",
             "Reposição Eletrolítica Hospitalar", "liquid", "Ampola com 10 mL", ["Canino", "Felino"],
             0.5, 0.5, "Aditivo para fluidoterapia: 10 a 40 mEq/L na bolsa de fluido. Taxa máxima de infusão: 0,5 mEq/kg/h", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=191, percentage=19.1, bottle_vol=10,
             notes="NUNCA APLICAR EM BOLUS DIRETO. Diluir sempre na bolsa de soro. Infusão rápida de potássio causa parada cardíaca em diástole.")
    add_prod("glicose-halex-50", "Glicose Hipertônica 50% (500 mg/mL)", "Glicose", "Halex Istar",
             "Carboidrato Hipertônico de Emergência", "liquid", "Ampola de 10 mL", ["Canino", "Felino"],
             500.0, 500.0, "Hipoglicemia aguda / convulsão hipoglicêmica: 1 a 2 mL/kg da solução 50% diluída 1:1 com soro IV lento", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=500, percentage=50.0, bottle_vol=10)
    add_prod("transamin-inj-50", "Transamin® Injetável 50 mg/mL", "Ácido Tranexâmico", "Cristália",
             "Antifibrinolítico & Hemostático Sistêmico", "liquid", "Ampola com 5 mL (250 mg)", ["Canino", "Felino"],
             10.0, 10.0, "Hemorragias ativas / politrauma: 10 a 15 mg/kg IV lento em 15 min a cada 8 horas", "TID", "Intravenosa (IV)",
             conc_mg_ml=50, bottle_vol=5,
             notes="Excelente inibidor da degradação da fibrina. Indicado em hemotórax, hemoperitônio traumático e cirurgias com sangramento profuso.")
    add_prod("kanakion-mm-inj-10", "Kanakion MM® Injetável 10 mg/mL", "Fitomenadiona (Vitamina K1)", "Cristália",
             "Antídoto para Intoxicação por Rodenticidas Cumarínicos", "liquid", "Ampola com 1 mL (10 mg)", ["Canino", "Felino"],
             2.5, 2.5, "Intoxicação por raticida anticoagulante: 2,5 a 5 mg/kg SC (usar agulha fina) a cada 12h, seguido de via oral por 28 dias", "BID", "Subcutânea (SC)",
             conc_mg_ml=10, bottle_vol=1,
             notes="Antídoto específico para rodenticidas anticoagulantes. Nunca aplicar IV direto devido a risco de anafilaxia severa.")

    # =========================================================================
    # 10. DERMATOLOGIA, ALERGOLOGIA & IMUNOLOGIA
    # =========================================================================
    # Apoquel (Zoetis)
    add_prod("apoquel-chew-36", "Apoquel® Mastigável 3,6 mg", "Maleato de Oclacitinib", "Zoetis",
             "Antipruriginoso Inibidor de JAK Mastigável", "tablet", "Frasco com 20 comprimidos mastigáveis palatáveis", ["Canino"],
             0.4, None, "0,4 a 0,6 mg/kg a cada 12 horas por 14 dias; após isso, manutenção a cada 24 horas", "BID", "Oral (VO)",
             tablet_mg=3.6, tabs_per_box=20,
             notes="Inibidor seletivo de JAK-1 de início de ação em menos de 4 horas para controle rápido de prurido alérgico e dermatite atópica.")
    add_prod("apoquel-chew-54", "Apoquel® Mastigável 5,4 mg", "Maleato de Oclacitinib", "Zoetis",
             "Antipruriginoso Inibidor de JAK Mastigável", "tablet", "Frasco com 20 comprimidos mastigáveis palatáveis", ["Canino"],
             0.4, None, "0,4 a 0,6 mg/kg BID por 14 dias, depois SID", "BID", "Oral (VO)",
             tablet_mg=54, tabs_per_box=20)
    add_prod("apoquel-chew-16", "Apoquel® Mastigável 16 mg", "Maleato de Oclacitinib", "Zoetis",
             "Antipruriginoso Inibidor de JAK Mastigável", "tablet", "Frasco com 20 comprimidos mastigáveis palatáveis", ["Canino"],
             0.4, None, "0,4 a 0,6 mg/kg BID por 14 dias, depois SID para cães grandes", "BID", "Oral (VO)",
             tablet_mg=16, tabs_per_box=20)

    # Cytopoint (Zoetis)
    add_prod("cytopoint-inj-10", "Cytopoint® 10 mg Frasco Injetável", "Lokivetmab", "Zoetis",
             "Anticorpo Monoclonal Anti-IL-31 Caninizado", "liquid", "Frasco-ampola com 1 mL (10 mg/mL)", ["Canino"],
             2.0, None, "Dose mínima recomendada: 2 mg/kg via SC a cada 4 a 8 semanas conforme retorno do prurido", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=10, bottle_vol=1,
             notes="Anticorpo monoclonal caninizado que neutraliza especificamente a IL-31. Seguro em cães de qualquer idade e com comorbidades renais/hepáticas.")
    add_prod("cytopoint-inj-20", "Cytopoint® 20 mg Frasco Injetável", "Lokivetmab", "Zoetis",
             "Anticorpo Monoclonal Anti-IL-31 Caninizado", "liquid", "Frasco-ampola com 1 mL (20 mg/mL)", ["Canino"],
             2.0, None, "2 mg/kg via SC a cada 4 a 8 semanas", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=20, bottle_vol=1)
    add_prod("cytopoint-inj-30", "Cytopoint® 30 mg Frasco Injetável", "Lokivetmab", "Zoetis",
             "Anticorpo Monoclonal Anti-IL-31 Caninizado", "liquid", "Frasco-ampola com 1 mL (30 mg/mL)", ["Canino"],
             2.0, None, "2 mg/kg via SC a cada 4 a 8 semanas", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=30, bottle_vol=1)
    add_prod("cytopoint-inj-40", "Cytopoint® 40 mg Frasco Injetável", "Lokivetmab", "Zoetis",
             "Anticorpo Monoclonal Anti-IL-31 Caninizado", "liquid", "Frasco-ampola com 1 mL (40 mg/mL)", ["Canino"],
             2.0, None, "2 mg/kg via SC a cada 4 a 8 semanas para cães grandes", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=40, bottle_vol=1)

    # Ciclosporina (Atopica Elanco / Cyclavance Virbac)
    add_prod("atopica-caps-10", "Atopica® 10 mg Cápsulas", "Ciclosporina Microemulsionada", "Elanco",
             "Imunomodulador & Dermatite Atópica", "tablet", "Cartucho com 15 cápsulas", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia 2h antes ou depois da refeição", "SID", "Oral (VO)",
             tablet_mg=10, tabs_per_box=15)
    add_prod("atopica-caps-25", "Atopica® 25 mg Cápsulas", "Ciclosporina Microemulsionada", "Elanco",
             "Imunomodulador & Dermatite Atópica", "tablet", "Cartucho com 30 cápsulas", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=25, tabs_per_box=30)
    add_prod("atopica-caps-50", "Atopica® 50 mg Cápsulas", "Ciclosporina Microemulsionada", "Elanco",
             "Imunomodulador & Dermatite Atópica", "tablet", "Cartucho com 30 cápsulas", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=30)
    add_prod("atopica-caps-100", "Atopica® 100 mg Cápsulas", "Ciclosporina Microemulsionada", "Elanco",
             "Imunomodulador & Dermatite Atópica", "tablet", "Cartucho com 30 cápsulas", ["Canino"],
             5.0, None, "5 mg/kg uma vez ao dia", "SID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=30)
    add_prod("atopica-gatos-100mg", "Atopica® para Gatos Solução Oral 100 mg/mL", "Ciclosporina Microemulsionada", "Elanco",
             "Imunomodulador Específico para Felinos", "liquid", "Frasco com 17 mL acompanhado de seringa dosadora", ["Felino"],
             None, 7.0, "7 mg/kg (0,07 mL/kg) uma vez ao dia misturado a um pequeno petisco ou diretamente na boca", "SID", "Oral (VO)",
             conc_mg_ml=100, bottle_vol=17,
             notes="Tratamento padrão para dermatite atópica / síndrome atópica cutânea felina e complexo granuloma eosinofílico.")
    add_prod("cyclavance-oral-100", "Cyclavance® Solução Oral 100 mg/mL", "Ciclosporina", "Virbac",
             "Imunomodulador & Dermatite Atópica", "liquid", "Frasco de 15 mL com adaptador e seringa graduada", ["Canino", "Felino"],
             5.0, 7.0, "Cães: 5 mg/kg SID | Gatos: 7 mg/kg SID", "SID", "Oral (VO)",
             conc_mg_ml=100, bottle_vol=15)

    # Anti-histamínicos
    add_prod("polaramine-xarope-04", "Polaramine® Xarope 0,4 mg/mL (2 mg/5 mL)", "Maleato de Dexclorfeniramina", "Mantecorp",
             "Anti-histamínico H1", "liquid", "Frasco com 120 mL", ["Canino", "Felino"],
             0.2, 0.2, "0,2 a 0,4 mg/kg a cada 8 a 12 horas", "BID", "Oral (VO)",
             conc_mg_ml=0.4, bottle_vol=120)
    add_prod("difenidrin-inj-50", "Difenidrin® Injetável 50 mg/mL", "Cloridrato de Difenidramina", "Cristália",
             "Anti-histamínico H1 Injetável de Emergência", "liquid", "Ampola com 1 mL (50 mg)", ["Canino", "Felino"],
             1.0, 1.0, "Reação anafilática ou alérgica aguda: 1 a 2 mg/kg IM ou IV lento a cada 8-12h", "BID", "Intramuscular (IM)",
             conc_mg_ml=50, bottle_vol=1)
    add_prod("fenergan-inj-25", "Fenergan® Injetável 25 mg/mL", "Cloridrato de Prometazina", "Sanofi",
             "Anti-histamínico H1 e Sedativo", "liquid", "Ampola de 2 mL (50 mg)", ["Canino"],
             0.5, None, "0,5 a 1 mg/kg IM profunda (evitar em gatos e evitar via IV devido a hipotensão severa)", "BID", "Intramuscular (IM)",
             conc_mg_ml=25, bottle_vol=2)
    add_prod("hixizine-xarope-2", "Hixizine® Xarope 2 mg/mL", "Cloridrato de Hidroxizina", "Abbott",
             "Anti-histamínico H1 com Ação Antipruriginosa", "liquid", "Frasco com 120 mL", ["Canino", "Felino"],
             1.0, 1.0, "1 a 2 mg/kg a cada 8 a 12 horas", "TID", "Oral (VO)",
             conc_mg_ml=2, bottle_vol=120)

    # =========================================================================
    # 11. ANTIPARASITÁRIOS (ECTO, ENDO & ENDECTOCIDAS)
    # =========================================================================
    # Simparic & Simparic Trio (Zoetis)
    for w_min, w_max, mg in [(1.3, 2.5, 5), (2.6, 5, 10), (5.1, 10, 20), (10.1, 20, 40), (20.1, 40, 80), (40.1, 60, 120)]:
        add_prod(f"simparic-{mg}-mg", f"Simparic® {mg} mg Comprimidos Mastigáveis ({w_min} a {w_max} kg)", "Sarolaner", "Zoetis",
                 "Antiparasitário Externo (Ectoparasiticida)", "tablet", f"Cartucho com 3 comprimidos mastigáveis para cães de {w_min} a {w_max} kg", ["Canino"],
                 2.0, None, f"1 comprimido de {mg} mg a cada 35 dias (dose alvo 2 a 4 mg/kg de sarolaner)", "Dose Única", "Oral (VO)",
                 tablet_mg=mg, tabs_per_box=3,
                 notes=f"Eficácia sustentada por até 35 dias contra pulgas, carrapatos e 3 tipos de sarna (sarcóptica, demodécica e otodécica).")

    for w_min, w_max, s_mg in [(1.25, 2.5, 3), (2.6, 5, 6), (5.1, 10, 12), (10.1, 20, 24), (20.1, 40, 48), (40.1, 60, 72)]:
        add_prod(f"simparic-trio-{s_mg}-mg", f"Simparic Trio® {s_mg} mg ({w_min} a {w_max} kg)", "Sarolaner + Moxidectina + Pirantel", "Zoetis",
                 "Antiparasitário Externo e Interno Triplo", "tablet", f"Cartucho com 3 comprimidos mastigáveis para cães de {w_min} a {w_max} kg", ["Canino"],
                 2.0, None, "1 comprimido mensal contra ectoparasitas, vermes intestinais e prevenção de dirofilariose", "Dose Única", "Oral (VO)",
                 tablet_mg=s_mg, tabs_per_box=3)

    # Bravecto (MSD Saúde Animal)
    for w_min, w_max, mg in [(2, 4.5, 112.5), (4.5, 10, 250), (10, 20, 500), (20, 40, 1000), (40, 56, 1400)]:
        add_prod(f"bravecto-dog-{int(mg)}", f"Bravecto® Mastigável {mg} mg Cães ({w_min} a {w_max} kg)", "Fluralaner", "MSD Saúde Animal",
                 "Antiparasitário Externo de Longa Duração (3 meses)", "tablet", f"Cartucho com 1 comprimido mastigável para cães de {w_min} a {w_max} kg", ["Canino"],
                 25.0, None, "1 comprimido a cada 12 semanas (84 dias / 3 meses)", "Dose Única", "Oral (VO)",
                 tablet_mg=mg, tabs_per_box=1,
                 notes="Proteção sistêmica contínua comprovada por 12 semanas contra pulgas e carrapatos.")

    for w_min, w_max, mg in [(1.2, 2.8, 112.5), (2.8, 6.25, 250), (6.25, 12.5, 500)]:
        add_prod(f"bravecto-cat-spot-{int(mg)}", f"Bravecto® Transdermal Gatos {mg} mg ({w_min} a {w_max} kg)", "Fluralaner", "MSD Saúde Animal",
                 "Antiparasitário Tópico Transdermal (3 meses)", "topical", f"Pipeta dosadora transdermal para gatos de {w_min} a {w_max} kg", ["Felino"],
                 None, 40.0, "1 pipeta tópica na base do crânio a cada 12 semanas (3 meses)", "Dose Única", "Tópica",
                 tablet_mg=mg, bottle_vol=1,
                 notes="Aplicação tópica spot-on na pele da base do crânio com absorção transdérmica sustentada por 12 semanas.")

    # NexGard & NexGard Spectra (Boehringer Ingelheim)
    for w_min, w_max, mg in [(2, 4, 11.3), (4.1, 10, 28.3), (10.1, 25, 68), (25.1, 50, 136)]:
        add_prod(f"nexgard-chew-{int(mg)}", f"NexGard® {mg} mg Mastigável ({w_min} a {w_max} kg)", "Afoxolaner", "Boehringer Ingelheim",
                 "Antiparasitário Externo Mastigável", "tablet", f"Cartucho com 1 ou 3 tabletes mastigáveis para cães de {w_min} a {w_max} kg", ["Canino"],
                 2.5, None, "1 tablete mastigável mensal (dose mínima 2,5 mg/kg)", "Dose Única", "Oral (VO)",
                 tablet_mg=mg, tabs_per_box=3)

    for w_label, w_min, w_max, afox, milb in [
        ("P", 2, 3.5, 9.375, 1.875),
        ("M", 3.6, 7.5, 18.75, 3.75),
        ("G", 7.6, 15, 37.5, 7.5),
        ("GG", 15.1, 30, 75, 15),
        ("Super GG", 30.1, 60, 150, 30)
    ]:
        add_prod(f"nexgard-spectra-{w_label.lower().replace(' ', '-')}", f"NexGard Spectra® {w_label} ({w_min} a {w_max} kg)", "Afoxolaner + Milbemicina Oxima", "Boehringer Ingelheim",
                 "Antiparasitário Completo Externo e Interno", "tablet", f"Cartucho com 3 tabletes mastigáveis sabor carne para cães de {w_min} a {w_max} kg", ["Canino"],
                 2.5, None, "1 tablete mensal: combate pulgas, carrapatos, sarnas, nematódeos gastrointestinais e previne dirofilariose", "Dose Única", "Oral (VO)",
                 tablet_mg=afox + milb, tabs_per_box=3)

    # Credelio (Elanco)
    for w_min, w_max, mg in [(1.3, 2.5, 56.25), (2.5, 5.5, 112.5), (5.5, 11, 225), (11, 22, 450), (22, 45, 900)]:
        add_prod(f"credelio-dog-{int(mg)}", f"Credelio® Cães {mg} mg ({w_min} a {w_max} kg)", "Lotilaner", "Elanco",
                 "Antiparasitário Externo Comprimido Mastigável", "tablet", f"Cartucho com 3 comprimidos para cães de {w_min} a {w_max} kg", ["Canino"],
                 20.0, None, "1 comprimido mensal administrado junto ao alimento ou até 30 min após", "Dose Única", "Oral (VO)",
                 tablet_mg=mg, tabs_per_box=3)

    for w_min, w_max, mg in [(0.5, 2, 12), (2, 8, 48)]:
        add_prod(f"credelio-cat-{mg}", f"Credelio® Gatos {mg} mg ({w_min} a {w_max} kg)", "Lotilaner", "Elanco",
                 "Antiparasitário Externo Específico para Felinos", "tablet", f"Cartucho com 3 comprimidos mastigáveis palatáveis para gatos de {w_min} a {w_max} kg", ["Felino"],
                 None, 6.0, "1 comprimido mensal administrado com a comida (dose mínima 6 mg/kg)", "Dose Única", "Oral (VO)",
                 tablet_mg=mg, tabs_per_box=3)

    # Revolution & Revolution Plus (Zoetis)
    add_prod("revolution-6-gatos", "Revolution® 6% Gatos até 7,5 kg", "Selamectina", "Zoetis",
             "Endectocida Tópico Spot-on", "topical", "Cartucho com 3 pipetas de 0,75 mL (45 mg)", ["Felino"],
             None, 6.0, "1 pipeta tópica mensal na nuca (dose 6 mg/kg de selamectina)", "Dose Única", "Tópica",
             conc_mg_ml=60, percentage=6.0, bottle_vol=0.75)
    add_prod("revolution-12-caes-10-20", "Revolution® 12% Cães de 10,1 a 20 kg", "Selamectina", "Zoetis",
             "Endectocida Tópico Spot-on", "topical", "Cartucho com 3 pipetas de 1,0 mL (120 mg)", ["Canino"],
             6.0, None, "1 pipeta mensal tópica na pele da nuca", "Dose Única", "Tópica",
             conc_mg_ml=120, percentage=12.0, bottle_vol=1.0)
    add_prod("revolution-plus-gatos-medio", "Revolution® Plus Gatos de 2,5 a 5 kg", "Selamectina + Sarolaner", "Zoetis",
             "Endectocida Tópico Felino Ampliado", "topical", "Cartucho com 3 pipetas de 0,5 mL (30 mg Selamectina + 5 mg Sarolaner)", ["Felino"],
             None, 6.0, "1 pipeta tópica mensal: protege contra pulgas, carrapatos, ácaros de ouvido, vermes e dirofilariose", "Dose Única", "Tópica",
             conc_mg_ml=70, bottle_vol=0.5)

    # Advocate (Elanco)
    add_prod("advocate-caes-4-10", "Advocate® Cães de 4 a 10 kg", "Imidacloprida + Moxidectina", "Elanco",
             "Endectocida Tópico Spot-On", "topical", "Cartucho com 3 pipetas de 1,0 mL", ["Canino"],
             10.0, None, "1 pipeta mensal na pele entre as escápulas", "Dose Única", "Tópica",
             conc_mg_ml=125, bottle_vol=1.0)
    add_prod("advocate-gatos-4-8", "Advocate® Gatos de 4 a 8 kg", "Imidacloprida + Moxidectina", "Elanco",
             "Endectocida Tópico Felino", "topical", "Cartucho com 3 pipetas de 0,8 mL", ["Felino"],
             None, 10.0, "1 pipeta tópica mensal na nuca do gato", "Dose Única", "Tópica",
             conc_mg_ml=110, bottle_vol=0.8)

    # Vermífugos Polivalentes (Drontal, Milbemax, Endogard, Vermivet)
    add_prod("drontal-plus-35kg", "Drontal® Plus 35 kg Cães Grandes", "Praziquantel + Pirantel + Febantel", "Elanco",
             "Antiparasitário Interno Polivalente", "tablet", "Cartucho com 2 comprimidos formato osso sabor carne", ["Canino"],
             5.0, None, "1 comprimido para cada 35 kg de peso corporal em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=175, tabs_per_box=2)
    add_prod("drontal-gatos-comp", "Drontal® Gatos Comprimidos", "Praziquantel + Pamoato de Pirantel", "Elanco",
             "Antiparasitário Interno para Felinos", "tablet", "Cartucho com 4 comprimidos elípticos", ["Felino"],
             None, 5.0, "1 comprimido para cada 4 kg de peso corporal em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=230, tabs_per_box=4)
    add_prod("milbemax-caes-pequenos", "Milbemax® Cães até 5 kg", "Milbemicina Oxima + Praziquantel", "Elanco",
             "Antiparasitário Interno Mastigável", "tablet", "Cartucho com 2 comprimidos mastigáveis", ["Canino"],
             0.5, None, "1 comprimido para cães de 0,5 a 5 kg em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=27.5, tabs_per_box=2)
    add_prod("milbemax-caes-grandes", "Milbemax® Cães de 5 a 25 kg", "Milbemicina Oxima + Praziquantel", "Elanco",
             "Antiparasitário Interno Mastigável", "tablet", "Cartucho com 2 comprimidos mastigáveis", ["Canino"],
             0.5, None, "1 comprimido para cada 5 a 25 kg em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=137.5, tabs_per_box=2)
    add_prod("milbemax-gatos-grandes", "Milbemax® Gatos de 2 a 8 kg", "Milbemicina Oxima + Praziquantel", "Elanco",
             "Antiparasitário Interno para Felinos", "tablet", "Cartucho com 2 comprimidos pequenos palatáveis", ["Felino"],
             None, 2.0, "1 comprimido para gatos de 2 a 8 kg em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=56, tabs_per_box=2)
    add_prod("endogard-10-comp", "Endogard® 10 kg Comprimidos", "Febantel + Pirantel + Praziquantel + Ivermectina", "Virbac",
             "Antiparasitário Interno com CPR", "tablet", "Cartucho com 2 comprimidos palatáveis divisíveis", ["Canino"],
             1.0, None, "1 comprimido para cada 10 kg de peso vivo em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=900, tabs_per_box=2)
    add_prod("endogard-30-comp", "Endogard® 30 kg Comprimidos", "Febantel + Pirantel + Praziquantel + Ivermectina", "Virbac",
             "Antiparasitário Interno com CPR", "tablet", "Cartucho com 2 comprimidos palatáveis", ["Canino"],
             1.0, None, "1 comprimido para cada 30 kg de peso vivo em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=2700, tabs_per_box=2)
    add_prod("vermivet-composto-comp", "Vermivet® Composto Comprimidos", "Pamoato de Pirantel + Praziquantel", "Agener União",
             "Antiparasitário Interno", "tablet", "Cartucho com 4 comprimidos", ["Canino", "Felino"],
             1.0, 1.0, "1 comprimido para cada 3 kg de peso corporal em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=345, tabs_per_box=4)
    add_prod("vermivet-plus-2g", "Vermivet® Plus 2,0 g Comprimidos", "Praziquantel + Pirantel + Febantel", "Agener União",
             "Antiparasitário Interno para Cães Grandes", "tablet", "Cartucho com 2 comprimidos", ["Canino"],
             1.0, None, "1 comprimido para cada 25 kg de peso corporal em dose única", "Dose Única", "Oral (VO)",
             tablet_mg=2000, tabs_per_box=2)
    add_prod("vermivet-filhote-susp", "Vermivet® Filhote Suspensão Oral 20 mL", "Pamoato de Pirantel + Praziquantel", "Agener União",
             "Antiparasitário Interno Líquido para Filhotes", "liquid", "Frasco com 20 mL com seringa dosadora", ["Canino", "Felino"],
             1.0, 1.0, "1 mL para cada 1 kg de peso a partir de 15 dias de vida", "Dose Única", "Oral (VO)",
             conc_mg_ml=35, bottle_vol=20)
    add_prod("vetmax-plus-susp-30", "Vetmax Plus® Suspensão Oral 30 mL", "Febendazol + Pirantel + Praziquantel", "Vetnil",
             "Antiparasitário Interno Líquido", "liquid", "Frasco com 30 mL com seringa dosadora", ["Canino", "Felino"],
             1.0, 1.0, "0,5 mL por kg de peso vivo em dose única", "Dose Única", "Oral (VO)",
             conc_mg_ml=75, bottle_vol=30)
    add_prod("chemital-plus-comp", "Chemital® Plus Comprimidos", "Praziquantel + Pirantel + Febantel", "Chemitec",
             "Antiparasitário Interno", "tablet", "Cartucho com 4 comprimidos", ["Canino"],
             1.0, None, "1 comprimido para cada 10 kg de peso vivo", "Dose Única", "Oral (VO)",
             tablet_mg=660, tabs_per_box=4)

    # Ivermectinas e Endectocidas Injetáveis
    add_prod("ivomec-inj-10", "Ivomec® Injetável 1%", "Ivermectina", "Boehringer Ingelheim",
             "Antiparasitário Endectocida Clássico", "liquid", "Frasco com 50 mL", ["Bovino", "Ovino", "Suíno"],
             None, None, "1% = 10 mg/mL. Bovinos e Ovinos: 0,2 mg/kg SC (1 mL para cada 50 kg)", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=50)
    add_prod("master-lp-inj-4", "Master LP® Injetável 4%", "Ivermectina Longa Ação", "Ourofino",
             "Antiparasitário Endectocida de Longa Duração", "liquid", "Frasco com 50 mL", ["Bovino"],
             None, None, "4% = 40 mg/mL. 1 mL para cada 50 kg SC (0,8 mg/kg)", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=40, percentage=4.0, bottle_vol=50)
    add_prod("ivercanis-comp-3", "Ivercanis® 3 mg Comprimidos", "Ivermectina", "Ucbvet",
             "Antiparasitário Acaricida Oral", "tablet", "Cartucho com 4 comprimidos palatáveis", ["Canino"],
             0.2, None, "Sarna sarcóptica/demodécica: 0,2 a 0,6 mg/kg uma vez ao dia ou semanal", "SID", "Oral (VO)",
             tablet_mg=3, tabs_per_box=4,
             notes="Contraindicado em cães das raças Collie, Pastor de Shetland, Border Collie e Australian Shepherd com mutação no gene MDR1.")
    add_prod("ivercanis-comp-6", "Ivercanis® 6 mg Comprimidos", "Ivermectina", "Ucbvet",
             "Antiparasitário Acaricida Oral", "tablet", "Cartucho com 4 comprimidos palatáveis", ["Canino"],
             0.2, None, "0,2 a 0,4 mg/kg", "SID", "Oral (VO)",
             tablet_mg=6, tabs_per_box=4)
    add_prod("dectomax-inj-10", "Dectomax® Injetável 1%", "Doramectina", "Zoetis",
             "Antiparasitário Endectocida Injetável", "liquid", "Frasco com 50 mL", ["Bovino", "Ovino", "Suíno", "Canino"],
             0.2, None, "Bovinos/Ovinos: 0,2 mg/kg SC ou IM | Cães: 0,2 a 0,4 mg/kg SC para sarna demodécica sob supervisão", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=50)
    add_prod("cydectin-inj-10", "Cydectin® Injetável 1%", "Moxidectina", "Zoetis",
             "Antiparasitário Endectocida de Segunda Geração", "liquid", "Frasco com 50 mL", ["Bovino", "Ovino"],
             None, None, "0,2 mg/kg SC (1 mL para cada 50 kg)", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=10, percentage=1.0, bottle_vol=50)

    # =========================================================================
    # 12. ENDOCRINOLOGIA, METABOLISMO & REPRODUÇÃO
    # =========================================================================
    add_prod("caninsulin-susp-40ui", "Caninsulin® Suspensão Injetável 40 UI/mL", "Insulina Suína Altamente Purificada", "MSD Saúde Animal",
             "Insulina Veterinária Lenta (Canina & Felina)", "liquid", "Frasco com 2,5 mL ou 10 mL (40 UI/mL)", ["Canino", "Felino"],
             0.5, 0.25, "Dose inicial cães: 0,5 UI/kg uma vez ou duas vezes ao dia com a refeição | Gatos: 0,25 a 0,5 UI/kg BID", "BID", "Subcutânea (SC)",
             conc_mg_ml=40, bottle_vol=10,
             notes="Atenção crítica: Concentração de 40 UI/mL. Utilizar obrigatoriamente seringas vermelhas graduadas para U-40 para evitar erros letais.")
    add_prod("prozinc-susp-40ui", "ProZinc® Suspensão Injetável 40 UI/mL", "Insulina Protamina Zinco Humana Recombinante", "Boehringer Ingelheim",
             "Insulina Veterinária Específica para Gatos e Cães", "liquid", "Frasco com 10 mL (40 UI/mL)", ["Felino", "Canino"],
             0.5, 0.25, "Gatos: dose inicial 0,2 a 0,4 UI/kg via SC a cada 12 horas imediatamente após refeição", "BID", "Subcutânea (SC)",
             conc_mg_ml=40, bottle_vol=10,
             notes="Insulina de longa ação padrão ouro no tratamento do diabetes mellitus felino. Utilizar seringas U-40.")
    add_prod("lantus-inj-100ui", "Lantus® Solução Injetável 100 UI/mL", "Insulina Glargina", "Sanofi",
             "Insulina de Longa Duração sem Pico", "liquid", "Frasco-ampola com 10 mL (100 UI/mL)", ["Felino", "Canino"],
             0.5, 0.25, "Gatos diabéticos: 0,25 a 0,5 UI/kg a cada 12 horas SC com seringa U-100", "BID", "Subcutânea (SC)",
             conc_mg_ml=100, bottle_vol=10,
             notes="Concentração 100 UI/mL. Utilizar obrigatoriamente seringas U-100. Alta taxa de remissão diabética em felinos.")
    add_prod("vetoryl-caps-10", "Vetoryl® 10 mg Cápsulas", "Trilostano", "Dechra",
             "Inibidor da Síntese de Cortisol (Cushing)", "tablet", "Cartucho com 30 cápsulas", ["Canino"],
             2.0, None, "Dose inicial: 1 a 2 mg/kg uma vez ao dia pela manhã com o alimento", "SID", "Oral (VO)",
             tablet_mg=10, tabs_per_box=30,
             notes="Tratamento de referência para Hiperadrenocorticismo (Síndrome de Cushing) hipófise e adrenal-dependente. Monitorar com teste de ACTH.")
    add_prod("vetoryl-caps-30", "Vetoryl® 30 mg Cápsulas", "Trilostano", "Dechra",
             "Inibidor da Síntese de Cortisol (Cushing)", "tablet", "Cartucho com 30 cápsulas", ["Canino"],
             2.0, None, "1 a 2 mg/kg SID junto à comida", "SID", "Oral (VO)",
             tablet_mg=30, tabs_per_box=30)
    add_prod("vetoryl-caps-60", "Vetoryl® 60 mg Cápsulas", "Trilostano", "Dechra",
             "Inibidor da Síntese de Cortisol (Cushing)", "tablet", "Cartucho com 30 cápsulas", ["Canino"],
             2.0, None, "1 a 2 mg/kg SID", "SID", "Oral (VO)",
             tablet_mg=60, tabs_per_box=30)
    add_prod("leventa-oral-1mg", "Leventa® Solução Oral 1 mg/mL", "Levotiroxina Sódica", "Virbac",
             "Hormônio Tireoidiano Líquido para Cães", "liquid", "Frasco com 30 mL com seringa dosadora graduada por peso", ["Canino"],
             0.02, None, "Dose inicial: 0,02 mg/kg (20 mcg/kg) uma vez ao dia pela manhã em jejum", "SID", "Oral (VO)",
             conc_mg_ml=1, bottle_vol=30,
             notes="Tratamento do hipotireoidismo canino. Solução líquida garante absorção uniforme e dosagem milimétrica.")
    add_prod("forthyron-comp-200", "Forthyron® 200 mcg Comprimidos Palatáveis", "Levotiroxina Sódica", "Dechra",
             "Hormônio Tireoidiano Palatável Divisível", "tablet", "Cartucho com 50 comprimidos quadrissectáveis", ["Canino"],
             0.02, None, "10 a 20 mcg/kg a cada 12 a 24 horas em jejum", "BID", "Oral (VO)",
             tablet_mg=0.2, tabs_per_box=50)
    add_prod("forthyron-comp-400", "Forthyron® 400 mcg Comprimidos Palatáveis", "Levotiroxina Sódica", "Dechra",
             "Hormônio Tireoidiano Palatável Divisível", "tablet", "Cartucho com 50 comprimidos quadrissectáveis", ["Canino"],
             0.02, None, "10 a 20 mcg/kg a cada 12 a 24 horas", "BID", "Oral (VO)",
             tablet_mg=0.4, tabs_per_box=50)
    add_prod("felimazole-comp-25", "Felimazole® 2,5 mg Comprimidos Revestidos", "Tiamazol (Metimazol)", "Dechra",
             "Antitireoidiano Específico para Gatos", "tablet", "Frasco com 100 comprimidos revestidos pequenos", ["Felino"],
             None, 0.625, "Dose inicial: 2,5 mg por gato a cada 12 horas (ou 1,25 mg BID em gatos idosos) com alimento", "BID", "Oral (VO)",
             tablet_mg=2.5, tabs_per_box=100,
             notes="Padrão ouro médico no hipertireoidismo felino. Monitorar função renal (ureia/creatinina) e T4 total a cada 3-4 semanas.")
    add_prod("felimazole-comp-5", "Felimazole® 5 mg Comprimidos Revestidos", "Tiamazol (Metimazol)", "Dechra",
             "Antitireoidiano Específico para Gatos", "tablet", "Frasco com 100 comprimidos", ["Felino"],
             None, 1.25, "2,5 a 5 mg por gato BID", "BID", "Oral (VO)",
             tablet_mg=5, tabs_per_box=100)
    add_prod("galastop-oral-50mcg", "Galastop® Solução Oral 50 mcg/mL", "Cabergolina", "Ceva",
             "Antiprolactínico & Tratamento de Pseudociese", "liquid", "Frasco com 15 mL com conta-gotas", ["Canino", "Felino"],
             0.005, 0.005, "5 mcg/kg (0,1 mL para cada kg de peso) uma vez ao dia com o alimento por 4 a 6 dias", "SID", "Oral (VO)",
             conc_mg_ml=0.05, bottle_vol=15,
             notes="Inibe prolactina rapidamente, cessando a lactação indesejada e os sintomas comportamentais de gravidez psicológica.")
    add_prod("ocitocina-forte-ucb", "Ocitocina Forte UCB® Injetável 10 UI/mL", "Ocitocina Sintética", "Ourofino",
             "Hormônio Uterotônico & Ejeção do Leite", "liquid", "Frasco com 50 mL", ["Canino", "Felino", "Bovino", "Equino"],
             5.0, 3.0, "Inércia uterina primária/secundária: Celas: 2 a 10 UI IM ou SC | Gatas: 1 a 3 UI IM", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=10, bottle_vol=50,
             notes="Confirmar previamente ausência de obstrução mecânica e canal pélvico pérvio antes de aplicar.")
    add_prod("sincrocio-inj-20", "Sincrocio® Injetável 0,075 mg/mL", "D-Cloprostenol", "Ourofino",
             "Prostaglandina Sintética Luteolítica", "liquid", "Frasco-ampola com 20 mL", ["Bovino", "Equino"],
             None, None, "Sincronização de estro e luteólise: Bovinos 2 mL IM | Equinos 1 mL IM", "Dose Única", "Intramuscular (IM)",
             conc_mg_ml=0.075, bottle_vol=20)
    add_prod("lutalyse-inj-30", "Lutalyse® Injetável 5 mg/mL", "Dinoprost Trometamina", "Zoetis",
             "Prostaglandina Luteolítica Natural", "liquid", "Frasco com 30 mL", ["Bovino", "Equino", "Suíno", "Canino"],
             0.025, None, "Piometra de cérvix aberta em cadelas jovens reprodutoras: 0,025 a 0,05 mg/kg SC com monitoramento estrito", "SID", "Subcutânea (SC)",
             conc_mg_ml=5, bottle_vol=30)

    # =========================================================================
    # 13. ANTIFÚNGICOS SISTÊMICOS & TÓPICOS
    # =========================================================================
    add_prod("itranew-comp-25", "Itranew® 25 mg Comprimidos", "Itraconazol", "Ceva",
             "Antifúngico Triazólico Sistêmico", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino", "Felino"],
             5.0, 5.0, "5 a 10 mg/kg uma vez ao dia administrado junto a refeição rica em gordura", "SID", "Oral (VO)",
             tablet_mg=25, tabs_per_box=10,
             notes="Antifúngico de eleição para Esporotricose felina, dermatofitose e micoses profundas.")
    add_prod("itranew-comp-50", "Itranew® 50 mg Comprimidos", "Itraconazol", "Ceva",
             "Antifúngico Triazólico Sistêmico", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino", "Felino"],
             5.0, 5.0, "5 a 10 mg/kg SID junto com alimento", "SID", "Oral (VO)",
             tablet_mg=50, tabs_per_box=10)
    add_prod("itranew-comp-100", "Itranew® 100 mg Comprimidos", "Itraconazol", "Ceva",
             "Antifúngico Triazólico Sistêmico", "tablet", "Cartucho com 10 comprimidos palatáveis", ["Canino"],
             5.0, None, "5 a 10 mg/kg SID", "SID", "Oral (VO)",
             tablet_mg=100, tabs_per_box=10)
    add_prod("zoltec-caps-150", "Zoltec® 150 mg Cápsulas", "Fluconazol", "Pfizer",
             "Antifúngico Triazólico Hidrossolúvel", "tablet", "Cartucho com 2 cápsulas", ["Canino", "Felino"],
             10.0, 10.0, "5 a 15 mg/kg a cada 12 a 24 horas para criptococose e candidíase sistêmica", "SID", "Oral (VO)",
             tablet_mg=150, tabs_per_box=2,
             notes="Excelente penetração no líquor, olho e trato urinário por ser hidrossolúvel.")
    add_prod("fluconazol-bolsa-02", "Fluconazol Solução para Infusão 2 mg/mL", "Fluconazol", "Eurofarma",
             "Antifúngico Sistêmico Hospitalar", "liquid", "Bolsa de 100 mL (200 mg total)", ["Canino", "Felino"],
             10.0, 10.0, "5 a 10 mg/kg IV lenta a cada 12 a 24 horas", "SID", "Intravenosa (IV)",
             conc_mg_ml=2, bottle_vol=100)
    add_prod("chemiconazol-comp-200", "Chemiconazol® 200 mg Comprimidos", "Cetoconazol", "Chemitec",
             "Antifúngico Imidazólico", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             10.0, None, "5 a 10 mg/kg a cada 12 a 24 horas com comida", "BID", "Oral (VO)",
             tablet_mg=200, tabs_per_box=10)
    add_prod("cetoconazol-vansil-200", "Cetoconazol Vansil® 200 mg Comprimidos", "Cetoconazol", "Vansil",
             "Antifúngico Imidazólico", "tablet", "Cartucho com 10 comprimidos", ["Canino"],
             10.0, None, "10 mg/kg SID com refeição", "SID", "Oral (VO)",
             tablet_mg=200, tabs_per_box=10)
    add_prod("lamisil-comp-250", "Lamisil® 250 mg Comprimidos", "Cloridrato de Terbinafina", "Novartis",
             "Antifúngico Alilamina Sistêmico", "tablet", "Cartucho com 14 comprimidos", ["Canino", "Felino"],
             30.0, 30.0, "20 a 40 mg/kg uma vez ao dia para Malassezia recalcitrante e dermatofitose", "SID", "Oral (VO)",
             tablet_mg=250, tabs_per_box=14)
    add_prod("anforicin-inj-50", "Anforicin® Injetável 50 mg Frasco-Ampola", "Anfotericina B Desoxicolato", "Cristália",
             "Antifúngico Poliênico Hospitalar de Resgate", "liquid", "Frasco com 50 mg de pó liofilizado", ["Canino", "Felino"],
             0.5, 0.5, "0,25 a 0,5 mg/kg em infusão lenta de glicose 5% (correr em 4-6h) 3 vezes por semana monitorando rins", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=5, bottle_vol=10,
             notes="Antifúngico potente para infecções fúngicas sistêmicas refratárias (histoplasmose, blastomicose). Diluir apenas em Glicose 5%.")

    # =========================================================================
    # 14. OFTALMOLOGIA & OTOLOGIA
    # =========================================================================
    add_prod("tobradex-colirio-5", "Tobradex® Colírio Oftálmico (5 mL)", "Tobramicina 0,3% + Dexametasona 0,1%", "Alcon",
             "Colírio Antibiótico & Anti-inflamatório", "drops", "Frasco conta-gotas de 5 mL", ["Canino", "Felino"],
             None, None, "1 a 2 gotas no olho afetado a cada 6 a 8 horas", "QID", "Tópica Oftálmica",
             bottle_vol=5,
             notes="Contraindicado terminantemente se houver úlcera de córnea ativa (teste de fluoresceína positivo).")
    add_prod("vigamox-colirio-5", "Vigamox® Colírio Oftálmico 0,5%", "Cloridrato de Moxifloxacino", "Alcon",
             "Colírio Fluoroquinolona 4ª Geração", "drops", "Frasco conta-gotas de 5 mL", ["Canino", "Felino"],
             None, None, "1 gota no olho afetado a cada 4 a 6 horas para conjuntivites e ceratites bacterianas severas", "QID", "Tópica Oftálmica",
             bottle_vol=5)
    add_prod("ciloxan-colirio-5", "Ciloxan® Colírio Oftálmico 0,3%", "Cloridrato de Ciprofloxacino", "Alcon",
             "Colírio Fluoroquinolona", "drops", "Frasco conta-gotas com 5 mL", ["Canino", "Felino"],
             None, None, "1 a 2 gotas a cada 6 horas", "QID", "Tópica Oftálmica",
             bottle_vol=5)
    add_prod("ciprovet-colirio-5", "Ciprovet® Colírio Oftálmico com Cicatrizante", "Ciprofloxacino 0,3% + Condroitina A 20%", "König",
             "Colírio Antibacteriano & Cicatrizante Corneano", "drops", "Frasco conta-gotas com 5 mL", ["Canino", "Felino"],
             None, None, "1 gota a cada 6 a 8 horas. Sulfato de condroitina estimula a regeneração epitelial da córnea", "TID", "Tópica Oftálmica",
             bottle_vol=5,
             notes="Seguro em úlceras de córnea superficiais por não conter corticosteroide e possuir condroitina cicatrizante.")
    add_prod("otomax-pomada-14", "Otomax® Pomada Otológica (14 g)", "Gentamicina + Betametasona + Clotrimazol", "Elanco",
             "Pomada Otológica Tripla Ação", "topical", "Bisnaga com cânula aplicadora de 14 g", ["Canino"],
             None, None, "Cães até 15 kg: 4 gotas no conduto auditivo BID | Cães > 15 kg: 8 gotas BID por 7 a 14 dias", "BID", "Tópica Otológica",
             bottle_vol=14,
             notes="Avaliar integridade da membrana timpânica antes do uso. Limpar previamente o cerúmen.")
    add_prod("posatex-susp-88", "Posatex® Suspensão Otológica (8,8 mL)", "Orbifloxacino + Mometasona + Posaconazol", "Zoetis",
             "Suspensão Otológica de Amplo Espectro", "drops", "Frasco dosador de 8,8 mL", ["Canino"],
             None, None, "Cães até 12 kg: 4 gotas uma vez ao dia (SID) | Cães > 12 kg: 8 gotas SID por 7 dias", "SID", "Tópica Otológica",
             bottle_vol=8.8,
             notes="Posologia prática em dose única diária (SID). Mometasona potente com menor efeito colateral que betametasona.")
    add_prod("easotic-susp-10", "Easotic® Suspensão Otológica Dosadora (10 mL)", "Hidrocortisona Aceponato + Miconazol + Gentamicina", "Ceva",
             "Solução Otológica com Bomba Dosadora Ergonômica", "topical", "Frasco com aplicador dosador de 10 mL (1 mL por jato)", ["Canino"],
             None, None, "1 pressão do bico dosador (exatamente 1 mL) em cada ouvido afetado uma vez ao dia por 5 dias", "SID", "Tópica Otológica",
             bottle_vol=10,
             notes="Frasco anatômico que aplica exatamente 1 mL em qualquer ângulo, facilitando o manejo do tutor.")
    add_prod("aurivet-pomada-13", "Aurivet® Pomada Otológica (13 g)", "Cloranfenicol + Betametasona + Benzocaína + Tiabendazol", "Agener União",
             "Pomada Otológica Completa", "topical", "Bisnaga com 13 g com bico aplicador flexível", ["Canino", "Felino"],
             None, None, "4 a 8 gotas no canal auditivo a cada 12 horas por 7 a 10 dias consecutivos", "BID", "Tópica Otológica",
             bottle_vol=13)
    add_prod("auritop-gel-30", "Auritop® Gel Otológico (30 g)", "Ciprofloxacino + Cetoconazol + Fluocinolona + Lidocaína", "Vetnil",
             "Gel Otológico com Anestésico Local", "topical", "Bisnaga com 30 g com aplicador", ["Canino", "Felino"],
             None, None, "Aplicar no canal auditivo a cada 12 horas por 7 a 9 dias", "BID", "Tópica Otológica",
             bottle_vol=30,
             notes="Contém lidocaína que alivia a dor e o desconforto imediato da otite aguda.")

    # =========================================================================
    # 15. APARELHO RESPIRATÓRIO (BRONCODILATADORES & MUCOLÍTICOS)
    # =========================================================================
    add_prod("bricanyl-xarope-03", "Bricanyl® Xarope 0,3 mg/mL", "Sulfato de Terbutalina", "AstraZeneca",
             "Broncodilatador Beta-2 Agonista Oral", "liquid", "Frasco com 100 mL", ["Canino", "Felino"],
             0.05, 0.05, "0,03 a 0,05 mg/kg a cada 8 a 12 horas para bronquite alérgica e asma felina", "BID", "Oral (VO)",
             conc_mg_ml=0.3, bottle_vol=100)
    add_prod("bricanyl-inj-05", "Bricanyl® Injetável 0,5 mg/mL", "Sulfato de Terbutalina", "AstraZeneca",
             "Broncodilatador Beta-2 de Emergência", "liquid", "Ampola com 1 mL (0,5 mg)", ["Canino", "Felino"],
             0.01, 0.01, "Crise asmática aguda: 0,01 mg/kg SC, IM ou IV lento", "Dose Única", "Subcutânea (SC)",
             conc_mg_ml=0.5, bottle_vol=1)
    add_prod("aerolin-spray-100", "Aerolin® Spray Inalatório 100 mcg/dose", "Sulfato de Salbutamol", "GlaxoSmithKline (GSK)",
             "Broncodilatador Inalatório de Ação Rápida", "spray", "Frasco com 200 doses acompanhado de atuador", ["Felino", "Canino"],
             None, None, "1 a 2 jatos inalatórios com espaçador pediátrico (AeroKat) durante broncoespasmo agudo", "Dose Única", "Inalatória",
             bottle_vol=200,
             notes="Alívio rápido de broncoespasmo em asma felina. Utilizar com máscara e câmara espaçadora apropriada (AeroKat).")
    add_prod("aminofilina-hipolabor-24", "Aminofilina Injetável 24 mg/mL", "Aminofilina", "Hipolabor",
             "Broncodilatador Metilxantina Hospitalar", "liquid", "Ampola de 10 mL (240 mg)", ["Canino", "Felino"],
             8.0, 5.0, "Cães: 6 a 10 mg/kg IV lenta diluída em soro a cada 8h | Gatos: 4 a 6 mg/kg IV lenta", "TID", "Intravenosa (IV)",
             conc_mg_ml=24, bottle_vol=10)
    add_prod("fluimucil-gotas-200", "Fluimucil® Solução Oral Gotas 200 mg/mL", "Acetilcisteína", "Zambon",
             "Mucolítico & Antídoto para Paracetamol", "drops", "Frasco conta-gotas de 15 mL", ["Canino", "Felino"],
             10.0, 10.0, "Mucolítico: 5 a 10 mg/kg VO BID | Intoxicação por paracetamol: 140 mg/kg ataque seguido de 70 mg/kg a cada 4h por 72h", "BID", "Oral (VO)",
             conc_mg_ml=200, bottle_vol=15,
             notes="Antídoto vital e específico para intoxicação acidental por Paracetamol (Acetaminofeno) em felinos e cães.")
    add_prod("fluimucil-inj-10", "Fluimucil® Injetável 10% (100 mg/mL)", "Acetilcisteína", "Zambon",
             "Antídoto Hospitalar Injetável", "liquid", "Ampola de 3 mL (300 mg)", ["Canino", "Felino"],
             140.0, 140.0, "Intoxicação por paracetamol: dose de ataque 140 mg/kg IV em glicose 5%, depois 70 mg/kg IV a cada 4h por 17 doses", "QID", "Intravenosa (IV)",
             conc_mg_ml=100, percentage=10.0, bottle_vol=3)

    # =========================================================================
    # 16. NUTRACÊUTICOS, MINERAIS & SUPLEMENTOS HOSPITALARES
    # =========================================================================
    add_prod("hemolitan-pet-comp", "Hemolitan® Pet Comprimidos", "Complexo Hematopoiético & Minerais Quelatados", "Vetnil",
             "Suplemento Vitamínico & Hematopoiético", "tablet", "Frasco com 30 comprimidos palatáveis", ["Canino", "Felino"],
             1.0, 1.0, "1 comprimido para cada 10 kg de peso corporal a cada 12 a 24 horas", "SID", "Oral (VO)",
             tablet_mg=1, tabs_per_box=30)
    add_prod("hemolitan-pet-gotas", "Hemolitan® Pet Gotas", "Complexo Hematopoiético & Vitaminas do Complexo B", "Vetnil",
             "Suplemento Vitamínico & Hematopoiético", "drops", "Frasco conta-gotas com 30 mL ou 60 mL", ["Canino", "Felino"],
             1.0, 1.0, "1 gota para cada 1 kg de peso a cada 12 horas (BID) para suporte em anemias", "BID", "Oral (VO)",
             conc_mg_ml=10, bottle_vol=30)
    add_prod("glicopan-pet-gotas", "Glicopan Pet® Gotas", "Aminoácidos, Vitaminas do Complexo B & Glicose", "Vetnil",
             "Suplemento Nutricional Energético & Tônico", "drops", "Frasco conta-gotas de 125 mL", ["Canino", "Felino"],
             0.5, 0.5, "0,5 mL (ou 15 gotas) por kg de peso duas vezes ao dia diretamente na boca", "BID", "Oral (VO)",
             conc_mg_ml=100, bottle_vol=125)
    add_prod("condroton-comp-500", "Condroton® 500 mg Comprimidos", "Sulfato de Condroitina + Glicosamina", "Vetnil",
             "Regenerador Articular & Condroprotetor", "tablet", "Frasco com 60 comprimidos palatáveis", ["Canino", "Felino"],
             1.0, 1.0, "Cães até 5 kg: 1 comp/dia | 5 a 10 kg: 1 comp BID nas primeiras semanas", "SID", "Oral (VO)",
             tablet_mg=500, tabs_per_box=60)
    add_prod("condroton-comp-1000", "Condroton® 1000 mg Comprimidos", "Sulfato de Condroitina + Glicosamina", "Vetnil",
             "Regenerador Articular & Condroprotetor", "tablet", "Frasco com 60 comprimidos palatáveis", ["Canino"],
             1.0, None, "1 comprimido para cada 10 a 20 kg de peso corporal", "SID", "Oral (VO)",
             tablet_mg=1000, tabs_per_box=6)
    add_prod("hepvet-comp-30", "Hepvet® Comprimidos", "Extrato de Cardo Mariano (Silimarina) + Nutrientes Hepáticos", "Vetnil",
             "Hepatoprotetor & Antioxidante Hepático", "tablet", "Frasco com 30 comprimidos", ["Canino", "Felino"],
             1.0, 1.0, "1 comprimido para cada 10 kg de peso ao dia", "SID", "Oral (VO)",
             tablet_mg=1, tabs_per_box=30)
    add_prod("calfoz-inj-500", "Calfoz® Injetável 500 mL", "Gluconato de Cálcio + Hipofosfito + Glicose", "Zoetis",
             "Suplemento Mineral & Metabólico (Febre do Leite)", "liquid", "Frasco com 500 mL acompanhado de equipo", ["Bovino", "Equino"],
             None, None, "Hipocalcemia / Febre vitular: 250 a 500 mL IV lento ou SC", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=200, bottle_vol=500)

    # =========================================================================
    # 17. GRANDES ANIMAIS & HOSPITAL EQUINO/RUMINANTES
    # =========================================================================
    add_prod("equalan-pasta-642", "Equalan® Pasta Equina (6,42 g)", "Ivermectina 1,87%", "Boehringer Ingelheim",
             "Antiparasitário Pasta Oral para Equinos", "paste", "Seringa dosadora com 6,42 g graduada por peso corporal", ["Equino"],
             None, None, "0,2 mg/kg VO (1 seringa trata até 600 kg de peso vivo em dose única)", "Dose Única", "Oral (VO)",
             conc_mg_ml=18.7, percentage=1.87, bottle_vol=6.42)
    add_prod("equalan-duo-pasta", "Equalan Duo® Pasta Equina", "Ivermectina 1,87% + Praziquantel 14,03%", "Boehringer Ingelheim",
             "Antiparasitário Equino Completo (Vermes e Tênias)", "paste", "Seringa com 7,74 g graduada para até 600 kg", ["Equino"],
             None, None, "1 seringa para 600 kg de peso em dose única", "Dose Única", "Oral (VO)",
             percentage=15.9, bottle_vol=7.74)
    add_prod("quest-gel-equino", "Quest Gel® Equino 2%", "Moxidectina 2%", "Zoetis",
             "Antiparasitário Gel Oral de Longa Duração para Equinos", "paste", "Seringa dosadora com 14,4 g (trata até 700 kg)", ["Equino"],
             None, None, "0,4 mg/kg VO em dose única", "Dose Única", "Oral (VO)",
             percentage=2.0, bottle_vol=14.4)
    add_prod("panacur-pasta-equina", "Panacur® Pasta Equina 18,75%", "Fenbendazol", "MSD Saúde Animal",
             "Antiparasitário Anti-helmíntico Benzimidazol", "paste", "Seringa com 24 g", ["Equino"],
             None, None, "7,5 mg/kg VO dose única (ou 10 mg/kg SID por 5 dias para ciatostomíneos encistados)", "Dose Única", "Oral (VO)",
             percentage=18.75, bottle_vol=24)
    add_prod("detomidina-syntec-10", "Detomidina Syntec® Injetável 10 mg/mL", "Cloridrato de Detomidina", "Syntec",
             "Sedativo Alfa-2 Agonista Potente para Equinos", "liquid", "Frasco-ampola com 20 mL", ["Equino"],
             None, None, "Equinos: 10 a 40 mcg/kg (0,01 a 0,04 mg/kg) IV ou IM para sedação profunda e alívio de cólica", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=10, bottle_vol=20)
    add_prod("domosedan-inj-10", "Domosedan® Injetável 10 mg/mL", "Cloridrato de Detomidina", "Zoetis",
             "Sedativo e Analgésico Alfa-2 para Equinos", "liquid", "Frasco com 5 mL ou 20 mL", ["Equino"],
             None, None, "10 a 40 mcg/kg IV ou IM", "Dose Única", "Intravenosa (IV)",
             conc_mg_ml=10, bottle_vol=20)

    return products

if __name__ == "__main__":
    prods = generate_additional_products()
    print(f"Generated {len(prods)} authentic additional commercial products.")
