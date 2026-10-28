// Conteúdo dos bônus em PDF: Guia de Urgências e Emergências e Checklist de Anamnese e Exame Físico.
// Texto em Latin-1 (fonte padrão do jsPDF): sem setas, travessões longos ou símbolos fora dessa tabela.
import { PdfDoc } from './pdfDoc';
import { EMERGENCY_DRUGS, formatDose } from '../data/emergencyDrugs';

const DISCLAIMER =
  'Material educativo e de apoio. Doses de referência da literatura veterinária (incluindo as diretrizes RECOVER); confirme na bula e ajuste ao paciente. A decisão clínica é do médico-veterinário responsável.';

export function buildEmergencyGuidePdf(): Blob {
  const pdf = new PdfDoc('Bônus 01 - Guia de Urgências e Emergências Clínicas', 'Cães e gatos');
  pdf.h1('Guia de Urgências e Emergências Clínicas');
  pdf.p('Roteiro prático para o atendimento inicial do paciente crítico em cães e gatos: triagem, choque, parada cardiorrespiratória, convulsões, dispneia, obstrução uretral e intoxicações comuns.', { muted: true });
  pdf.note('No app, a aba Calculadoras > Emergência calcula em segundos o volume (mL) de cada fármaco desta guia a partir do peso do paciente.');

  pdf.section('1. Triagem inicial (ABCDE)');
  pdf.bullets([
    'A - Vias aéreas: obstrução, ruídos, corpo estranho. Libere e, se preciso, intube.',
    'B - Respiração: frequência, esforço, padrão (inspiratório, expiratório, paradoxal), cianose. Ofereça oxigênio com o mínimo de estresse.',
    'C - Circulação: cor de mucosas, TPC, pulso femoral (qualidade e sincronia com a FC), FC, temperatura das extremidades, pressão arterial. Acesso venoso calibroso.',
    'D - Disfunção neurológica: nível de consciência, pupilas, postura, convulsões; glicemia rápida.',
    'E - Exposição: feridas, hemorragias, fraturas, temperatura retal, distensão abdominal.',
  ]);
  pdf.sub('Exames rápidos na chegada');
  pdf.bullets(['Glicemia, hematócrito e proteínas totais, lactato, eletrólitos (sódio, potássio, cálcio ionizado), gasometria se disponível.', 'AFAST/TFAST (ultrassom focado) para líquido livre abdominal, pleural ou pericárdico.']);

  pdf.section('2. Choque e reposição volêmica');
  pdf.bullets([
    'Sinais: taquicardia (cães) ou bradicardia e hipotermia (gatos), mucosas pálidas, TPC acima de 2 s, pulso fraco, extremidades frias, alteração de consciência.',
    'Bolus de cristaloide isotônico: cães 10-20 mL/kg em 15 min; gatos 5-10 mL/kg em 15 min. Reavalie FC, pulso, TPC, pressão e lactato após cada bolus.',
    'Gatos e cardiopatas: bolus menores e reavaliação frequente (risco de sobrecarga e edema pulmonar).',
    'Hemorragia ativa: controle a fonte; considere hipotensão permissiva até o controle e transfusão quando indicada.',
  ]);

  pdf.section('3. Parada cardiorrespiratória (RECOVER)');
  pdf.alert('Diante de paciente inconsciente e sem respiração: comece as compressões imediatamente. Não perca tempo procurando pulso.');
  pdf.sub('Suporte básico');
  pdf.bullets([
    'Compressões: 100 a 120 por minuto, comprimindo 1/3 a 1/2 da largura do tórax, permitindo o retorno completo. Ciclos de 2 minutos, trocando quem comprime a cada ciclo.',
    'Ventilação: intubar e ventilar a 10 movimentos por minuto, sem interromper as compressões. Sem intubação: 30 compressões para 2 ventilações (boca-focinho).',
    'Monitorização: ECG e capnografia. EtCO2 abaixo de 15 mmHg sugere compressões ineficazes; aumento súbito sugere retorno da circulação.',
  ]);
  pdf.sub('Suporte avançado conforme o ritmo');
  pdf.bullets([
    'Assistolia ou AESP: adrenalina 0,01 mg/kg IV/IO a cada 3-5 min (ciclo sim, ciclo não). Vasopressina 0,8 UI/kg pode substituir a adrenalina. Atropina 0,04 mg/kg se houver suspeita de causa vagal.',
    'FV ou TV sem pulso: desfibrilação externa (monofásico 4-6 J/kg; bifásico 2-4 J/kg), retomando as compressões logo após o choque por mais 2 min. Refratária: amiodarona 5 mg/kg ou lidocaína 2 mg/kg (cães).',
    'Após 10 min de PCR: considerar adrenalina em dose alta (0,1 mg/kg) e bicarbonato de sódio 1 mEq/kg.',
    'Reverta fármacos sedativos em uso: naloxona (opioides), flumazenil (benzodiazepínicos), atipamezol (alfa-2 agonistas).',
  ]);

  pdf.section('4. Convulsões e status epilepticus');
  pdf.bullets([
    'Benzodiazepínico: diazepam 0,5 mg/kg IV (ou 1 mg/kg retal) ou midazolam 0,2 mg/kg IV, IM ou intranasal. Pode repetir até 2-3 vezes.',
    'Persistindo: levetiracetam 60 mg/kg IV lento; fenobarbital em bolus conforme protocolo; infusão contínua de benzodiazepínico.',
    'Corrija causas: glicemia, cálcio, temperatura (resfriar se acima de 41 °C), intoxicações. Proteja a via aérea e ofereça oxigênio.',
  ]);

  pdf.section('5. Dificuldade respiratória');
  pdf.bullets([
    'Oxigênio, ambiente calmo, sedação leve se necessário (ex.: butorfanol). Evite contenção e exames estressantes antes de estabilizar.',
    'Localize pelo padrão: ruído inspiratório (vias aéreas superiores), crepitação (parênquima: edema, pneumonia, contusão), sons abafados com respiração rápida e superficial (espaço pleural).',
    'Espaço pleural: toracocentese diagnóstica e terapêutica guiada por TFAST.',
    'Edema pulmonar cardiogênico: furosemida 2-4 mg/kg (cães) ou 1-2 mg/kg (gatos) IV/IM e reavaliação da frequência respiratória.',
  ]);

  pdf.section('6. Obstrução uretral no gato');
  pdf.bullets([
    'Avalie potássio e ECG (bradicardia, ondas T apiculadas, ausência de onda P).',
    'Hipercalemia com alteração no ECG: gluconato de cálcio 10% 0,5-1,5 mL/kg IV lento com ECG; insulina regular 0,25 UI/kg IV com glicose (1-2 g para cada UI); fluidoterapia.',
    'Desobstrução com analgesia e sedação, sondagem e monitorização da diurese pós-obstrutiva.',
  ]);

  pdf.section('7. Intoxicações comuns');
  pdf.bullets([
    'Indução de êmese (cães, até 1-2 h da ingestão): apomorfina 0,03 mg/kg IV ou 0,04 mg/kg IM. Não induza com cáusticos, derivados de petróleo, alteração de consciência ou ausência de reflexo de deglutição.',
    'Gatos: êmese com dexmedetomidina ou xilazina, conforme protocolo; não use água oxigenada nem sal.',
    'Paracetamol em gatos (metemoglobinemia, edema de face): N-acetilcisteína 140 mg/kg, depois 70 mg/kg a cada 6 h; oxigênio.',
    'Permetrina em gatos (tremores, convulsões): banho com detergente neutro, controle dos tremores (metocarbamol), termorregulação, emulsão lipídica conforme protocolo.',
    'Raticida anticoagulante: vitamina K1 2,5-5 mg/kg/dia VO por 3-4 semanas (rodenticidas de 2ª geração); avalie tempo de protrombina 48-72 h após o fim.',
    'Chocolate (metilxantinas) e xilitol (hipoglicemia e lesão hepática em cães): descontaminação, monitorização cardíaca e glicemia seriada.',
  ]);

  pdf.section('8. Tabela de doses de emergência');
  pdf.p('Doses por kg, concentração usual e volume por kg dessa concentração. Confira sempre a concentração da ampola disponível.', { muted: true });
  pdf.table(
    ['Fármaco', 'Indicação', 'Dose (cão / gato)', 'Concentração', 'mL/kg (cão)', 'Via'],
    EMERGENCY_DRUGS.map((d) => [
      d.name,
      d.indication,
      d.dose.dog === d.dose.cat ? `${formatDose(d.dose.dog)} ${d.unit}/kg` : `${formatDose(d.dose.dog)} / ${formatDose(d.dose.cat)} ${d.unit}/kg`,
      d.concentrationLabel,
      formatDose(d.dose.dog / d.concentration),
      d.route,
    ]),
    [27, 32, 20, 19, 13, 17],
  );
  return pdf.finish(DISCLAIMER);
}

export function buildChecklistPdf(): Blob {
  const pdf = new PdfDoc('Bônus 02 - Checklist de Anamnese e Exame Físico', 'Roteiro de consulta');
  pdf.h1('Checklist de Anamnese e Exame Físico');
  pdf.p('Roteiro sistemático para a consulta clínica de cães e gatos. Imprima e use como ficha ou como lembrete durante o atendimento.', { muted: true });

  pdf.section('Identificação');
  pdf.fields([
    ['Paciente', 'Espécie', 'Raça'],
    ['Sexo / castrado', 'Idade', 'Peso (kg)'],
    ['Tutor', 'Telefone', 'Data'],
  ]);

  pdf.section('Anamnese');
  pdf.checks([
    'Queixa principal e há quanto tempo começou',
    'Evolução: melhorou, piorou ou se manteve? Episódios anteriores?',
    'Alimentação: tipo, quantidade, mudanças recentes, apetite e ingestão de água',
    'Vacinação e vermifugação (datas e produtos), controle de ectoparasitas',
    'Ambiente: casa ou quintal, acesso à rua, contato com outros animais, viagens',
    'Medicamentos em uso, tratamentos anteriores e resposta',
    'Alergias e reações a medicamentos ou vacinas',
    'Acesso a lixo, plantas, produtos de limpeza, raticidas ou medicamentos humanos',
    'Histórico reprodutivo (fêmeas: cio, gestação, parto) e cirurgias prévias',
  ]);
  pdf.sub('Revisão por sistemas');
  pdf.checks([
    'Digestório: vômito, regurgitação, diarreia, sangue nas fezes, constipação',
    'Respiratório: tosse, espirros, secreção nasal, cansaço, respiração ruidosa',
    'Urinário: volume e frequência de urina, esforço, sangue, urina fora do lugar',
    'Neurológico: convulsões, desequilíbrio, andar em círculo, alteração de comportamento',
    'Pele e anexos: coceira, queda de pelo, feridas, odor, otites',
    'Locomotor: claudicação, dor ao levantar, rigidez',
    'Cardiovascular: síncope, intolerância ao exercício, tosse noturna',
  ]);

  pdf.section('Exame físico geral');
  pdf.checks([
    'Estado mental e postura (alerta, deprimido, estuporoso)',
    'Escore de condição corporal (1 a 9) e massa muscular',
    'Hidratação: turgor cutâneo, umidade das mucosas, posição do globo ocular',
    'Mucosas (cor) e tempo de preenchimento capilar (TPC)',
    'Linfonodos superficiais: submandibulares, pré-escapulares, poplíteos',
    'Temperatura retal, frequência cardíaca, frequência respiratória e pulso femoral',
    'Ausculta cardíaca e pulmonar (sopros, arritmias, crepitações, abafamento)',
    'Palpação abdominal: dor, órgãos aumentados, massas, bexiga',
    'Pele, pelagem, orelhas, olhos, cavidade oral e dentes',
    'Sistema locomotor e exame neurológico básico quando indicado',
  ]);
  pdf.fields([
    ['T (°C)', 'FC (bpm)', 'FR (mpm)', 'TPC (s)'],
    ['Mucosas', 'Hidratação (%)', 'ECC (1-9)', 'PA (mmHg)'],
  ]);

  pdf.section('Parâmetros de referência');
  pdf.table(
    ['Parâmetro', 'Cão', 'Gato'],
    [
      ['Temperatura retal', '37,5 a 39,2 °C', '38,0 a 39,2 °C'],
      ['Frequência cardíaca', '60 a 160 bpm (filhotes até 220)', '140 a 220 bpm'],
      ['Frequência respiratória', '10 a 30 mpm', '20 a 40 mpm'],
      ['TPC', 'Menor que 2 s', 'Menor que 2 s'],
      ['Pressão arterial sistólica', '110 a 160 mmHg', '120 a 160 mmHg'],
    ],
    [40, 45, 45],
  );
  pdf.sub('Estimativa do grau de desidratação');
  pdf.table(
    ['Desidratação', 'Sinais clínicos'],
    [
      ['Menos de 5%', 'Sem alterações detectáveis ao exame; histórico de perdas'],
      ['5 a 6%', 'Mucosas levemente pegajosas'],
      ['6 a 8%', 'Turgor cutâneo diminuído, mucosas secas'],
      ['8 a 10%', 'Olhos afundados nas órbitas, TPC aumentado'],
      ['10 a 12%', 'Pele não retorna, sinais de choque'],
      ['Acima de 12%', 'Choque grave, risco de óbito'],
    ],
    [30, 100],
  );

  pdf.section('Conclusão da consulta');
  pdf.fields([['Problemas identificados'], ['Diagnósticos diferenciais'], ['Exames solicitados'], ['Conduta e prescrição'], ['Retorno']]);
  pdf.space(4);
  pdf.fields([['Médico-veterinário (nome e CRMV)', 'Assinatura']]);
  return pdf.finish(DISCLAIMER);
}
