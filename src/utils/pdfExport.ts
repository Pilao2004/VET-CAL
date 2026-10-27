import { jsPDF } from 'jspdf';
import { PatientRecord, ClinicalConsultation } from '../types';

export function exportPatientRecordToPdf(patient: PatientRecord, consultation?: ClinicalConsultation) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const targetConsultation = consultation || (patient.consultations && patient.consultations.length > 0
    ? patient.consultations[0]
    : undefined);

  // Colors: Navy (#0B1D3A), Slate Gray (#475569), Accent Green (#10B981)
  const primaryNavy = [11, 29, 58] as const;
  const textDark = [30, 41, 59] as const;
  const lightGray = [241, 245, 249] as const;
  const brandGreen = [16, 185, 129] as const;

  let y = 16;

  // Header Bar
  doc.setFillColor(...primaryNavy);
  doc.rect(0, 0, 210, 26, 'F');

  // Logo Icon Box (Teal rounded square)
  doc.setFillColor(0, 200, 150);
  doc.roundedRect(12, 4, 18, 18, 3, 3, 'F');

  // White medical cross inside logo box
  doc.setFillColor(255, 255, 255);
  doc.rect(19.5, 8, 3, 10, 'F'); // vertical
  doc.rect(16, 11.5, 10, 3, 'F'); // horizontal

  // Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('VET CALC PRO', 34, 11);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 220, 200);
  doc.text('Apoio à Medicina Veterinária', 34, 17);

  // Right side header info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Prontuário Clínico & Prescrição', 135, 11);

  const docDate = targetConsultation ? new Date(targetConsultation.date).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 210, 225);
  doc.text(`Data: ${docDate}`, 135, 17);

  y = 34;

  // Patient and Tutor Box
  doc.setFillColor(...lightGray);
  doc.roundedRect(12, y, 186, 38, 2, 2, 'F');

  doc.setTextColor(...primaryNavy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DADOS DO PACIENTE E DO TUTOR', 16, y + 7);

  doc.setTextColor(...textDark);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Paciente:', 16, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.name} (${patient.species} - ${patient.breed || 'SRD'})`, 32, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Sexo/Idade:', 16, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.sex} ${patient.isNeutered ? '(Castrado)' : ''} | Idade: ${patient.age || 'N/I'}`, 36, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Peso Atual:', 16, y + 29);
  doc.setFont('helvetica', 'normal');
  const displayWeight = targetConsultation ? targetConsultation.weight : patient.weight;
  doc.text(`${displayWeight ? displayWeight + ' kg' : 'Não informado'}`, 36, y + 29);

  // Right column in box
  doc.setFont('helvetica', 'bold');
  doc.text('Tutor(a):', 110, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.tutorName}`, 126, y + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Contato:', 110, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.tutorPhone || 'Não informado'}`, 126, y + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Alergias:', 110, y + 29);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 38, 38);
  doc.text(`${patient.allergies || 'Nenhuma alergia conhecida'}`, 126, y + 29);

  y += 44;

  if (targetConsultation) {
    // Queixa Principal
    doc.setTextColor(...primaryNavy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('1. QUEIXA PRINCIPAL E HISTÓRICO CLÍNICO', 14, y);
    y += 5;

    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const complaintLines = doc.splitTextToSize(targetConsultation.chiefComplaint || 'Consulta de rotina / avaliação clínica geral.', 182);
    doc.text(complaintLines, 14, y);
    y += complaintLines.length * 4.5 + 4;

    // Exame Físico
    doc.setTextColor(...primaryNavy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('2. EXAME FÍSICO DETALHADO', 14, y);
    y += 5;

    const pe = targetConsultation.physicalExam || {};
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(12, y, 186, 22, 1, 1, 'F');

    doc.setTextColor(...textDark);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');

    const tempStr = pe.temperature ? `${pe.temperature} °C` : '--';
    const fcStr = pe.heartRate ? `${pe.heartRate} bpm` : '--';
    const frStr = pe.respiratoryRate ? `${pe.respiratoryRate} mpm` : '--';
    const tpcStr = pe.crt ? `${pe.crt} s` : '--';
    const mucStr = pe.mucousMembranes || 'Normocoradas';
    const hydStr = pe.hydrationPercent !== undefined ? `${pe.hydrationPercent}%` : 'Normal';
    const eccStr = pe.bodyConditionScore ? `${pe.bodyConditionScore}/9` : '--';

    doc.text(`Temperatura: ${tempStr}`, 16, y + 6);
    doc.text(`Freq. Cardíaca: ${fcStr}`, 68, y + 6);
    doc.text(`Freq. Resp: ${frStr}`, 120, y + 6);
    doc.text(`TPC: ${tpcStr}`, 162, y + 6);

    doc.text(`Mucosas: ${mucStr}`, 16, y + 14);
    doc.text(`Hidratação: ${hydStr}`, 68, y + 14);
    doc.text(`ECC: ${eccStr}`, 120, y + 14);
    doc.text(`Linfonodos: ${pe.lymphNodes || 'Normais'}`, 162, y + 14);

    y += 28;

    // Diagnóstico / Hipóteses
    if (targetConsultation.tentativeDiagnosis) {
      doc.setTextColor(...primaryNavy);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('3. HIPÓTESES DIAGNÓSTICAS', 14, y);
      y += 5;

      doc.setTextColor(...textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const diagLines = doc.splitTextToSize(targetConsultation.tentativeDiagnosis, 182);
      doc.text(diagLines, 14, y);
      y += diagLines.length * 4.5 + 4;
    }

    // Prescrições e Conduta
    if (targetConsultation.prescriptions && targetConsultation.prescriptions.length > 0) {
      doc.setTextColor(...primaryNavy);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('4. PRESCRIÇÃO E CONDUTA TERAPÊUTICA', 14, y);
      y += 5;

      targetConsultation.prescriptions.forEach((item, idx) => {
        doc.setTextColor(...brandGreen);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(`${idx + 1}.`, 14, y);

        doc.setTextColor(...textDark);
        doc.setFont('helvetica', 'normal');
        const presLines = doc.splitTextToSize(item, 174);
        doc.text(presLines, 20, y);
        y += presLines.length * 4.5 + 2;
      });
      y += 3;
    }

    // Exames Solicitados
    if (targetConsultation.requestedExams && targetConsultation.requestedExams.length > 0) {
      doc.setTextColor(...primaryNavy);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('5. EXAMES COMPLEMENTARES SOLICITADOS', 14, y);
      y += 5;

      doc.setTextColor(...textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const examsStr = targetConsultation.requestedExams.join(', ');
      const examLines = doc.splitTextToSize(examsStr, 182);
      doc.text(examLines, 14, y);
      y += examLines.length * 4.5 + 4;
    }

    // Evolução Clínica / Observações
    if (targetConsultation.clinicalEvolution) {
      doc.setTextColor(...primaryNavy);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('6. EVOLUÇÃO CLÍNICA / RECOMENDAÇÕES', 14, y);
      y += 5;

      doc.setTextColor(...textDark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const evoLines = doc.splitTextToSize(targetConsultation.clinicalEvolution, 182);
      doc.text(evoLines, 14, y);
      y += evoLines.length * 4.5 + 4;
    }
  }

  // Footer & Signature Area
  const pageHeight = doc.internal.pageSize.getHeight();
  const signatureY = Math.max(y + 10, pageHeight - 38);

  doc.setDrawColor(203, 213, 225);
  doc.line(60, signatureY + 12, 150, signatureY + 12);

  doc.setTextColor(...textDark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Assinatura e Carimbo do Médico-Veterinário (CRMV)', 105, signatureY + 17, { align: 'center' });

  // Legal footer note
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Documento emitido via VET CALC PRO. Proteção e sigilo em conformidade com o Código de Ética Veterinário e LGPD.',
    105,
    pageHeight - 8,
    { align: 'center' }
  );

  const cleanFileName = `Prontuario_${patient.name.replace(/[^a-zA-Z0-9]/g, '_')}_${docDate.replace(/\//g, '-')}.pdf`;
  doc.save(cleanFileName);
}
