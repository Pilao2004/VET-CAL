import React, { useState } from 'react';
import { FileDown, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { saveFile } from '../utils/fileSave';
import { PdfDoc } from '../utils/pdfDoc';

const VET_KEY = 'vetcalc_vet_profile';

// A fonte padrão do jsPDF só tem Latin-1: troca símbolos que não existem nela
const latin = (s: string) =>
  s.replace(/→/g, '->').replace(/[–—]/g, '-').replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/•/g, '-');

function loadVet(): { name: string; crmv: string } {
  try {
    const saved = JSON.parse(localStorage.getItem(VET_KEY) || '{}');
    return { name: saved.name || '', crmv: saved.crmv || '' };
  } catch {
    return { name: '', crmv: '' };
  }
}

export const PrescriptionActions: React.FC<{ prescriptionText: string }> = ({ prescriptionText }) => {
  const { patients, showToast, activePatientId } = useApp();
  const [vet, setVet] = useState(loadVet);
  const describe = (p: (typeof patients)[number]) => `${p.name} (${p.species}${p.breed ? ', ' + p.breed : ''}, ${p.weight} kg)`;
  // Já vem preenchido com o paciente da vez
  const active = patients.find((x) => x.id === activePatientId);
  const [patientName, setPatientName] = useState(active ? describe(active) : '');
  const [tutorName, setTutorName] = useState(active?.tutorName || '');

  const updateVet = (field: 'name' | 'crmv', value: string) => {
    const next = { ...vet, [field]: value };
    setVet(next);
    try {
      localStorage.setItem(VET_KEY, JSON.stringify(next));
    } catch {}
  };

  const pickPatient = (id: string) => {
    const p = patients.find((x) => x.id === id);
    if (p) {
      setPatientName(describe(p));
      setTutorName(p.tutorName || '');
    }
  };

  const downloadPdf = async () => {
    const pdf = new PdfDoc('Receituário Veterinário', new Date().toLocaleDateString('pt-BR'));
    pdf.h1('Receituário Veterinário');
    pdf.fields([[`Médico-veterinário: ${latin(vet.name || '')}`, `CRMV: ${latin(vet.crmv || '')}`]]);
    pdf.fields([[`Paciente: ${latin(patientName)}`], [`Tutor: ${latin(tutorName)}`, `Data: ${new Date().toLocaleDateString('pt-BR')}`]]);
    pdf.section('Prescrição');
    for (const block of latin(prescriptionText).split('\n')) {
      if (block.trim()) pdf.p(block);
    }
    pdf.space(18);
    pdf.fields([[`Assinatura e carimbo - ${latin(vet.name || 'Médico-veterinário')}${vet.crmv ? ' - CRMV ' + latin(vet.crmv) : ''}`]]);
    const blob = pdf.finish('Receita gerada no VET CALC PRO a partir do cálculo de dose. Confira a prescrição antes de entregar ao tutor.');
    const safe = (patientName.split(' (')[0] || 'paciente').replace(/[^a-zA-Z0-9]+/g, '_');
    const outcome = await saveFile(`Receita_${safe}_${new Date().toISOString().slice(0, 10)}.pdf`, blob);
    if (outcome === 'saved') showToast('Receita em PDF gerada.');
  };

  const whatsappText = [
    '*Receita veterinária*',
    patientName && `Paciente: ${patientName}`,
    tutorName && `Tutor: ${tutorName}`,
    '',
    prescriptionText,
    '',
    vet.name && `${vet.name}${vet.crmv ? ' - CRMV ' + vet.crmv : ''}`,
  ]
    .filter((l): l is string => typeof l === 'string')
    .join('\n');

  const inputCls =
    'w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]';

  return (
    <div className="space-y-2.5 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {patients.length > 0 && (
          <select id="rx-patient" defaultValue="" onChange={(e) => pickPatient(e.target.value)} className={`${inputCls} sm:col-span-2`}>
            <option value="" disabled>
              Preencher com um paciente cadastrado…
            </option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.tutorName}
              </option>
            ))}
          </select>
        )}
        <input id="rx-patient-name" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Paciente" className={inputCls} />
        <input id="rx-tutor" value={tutorName} onChange={(e) => setTutorName(e.target.value)} placeholder="Tutor" className={inputCls} />
        <input id="rx-vet" value={vet.name} onChange={(e) => updateVet('name', e.target.value)} placeholder="Seu nome (médico-veterinário)" className={inputCls} />
        <input id="rx-crmv" value={vet.crmv} onChange={(e) => updateVet('crmv', e.target.value)} placeholder="CRMV (ex.: SP 12345)" className={inputCls} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={downloadPdf}
          className="flex-1 min-w-[140px] min-h-[40px] px-3 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text-main)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:border-[var(--primary)]"
        >
          <FileDown className="w-4 h-4" />
          Receita em PDF
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[140px] min-h-[40px] px-3 rounded-lg bg-[#25D366] text-[#062C23] text-xs font-extrabold flex items-center justify-center gap-1.5 hover:brightness-110"
        >
          <MessageCircle className="w-4 h-4" />
          Enviar no WhatsApp
        </a>
      </div>
      <p className="text-[10px] text-[var(--text-secondary)]">Seu nome e CRMV ficam salvos neste aparelho para as próximas receitas.</p>
    </div>
  );
};
