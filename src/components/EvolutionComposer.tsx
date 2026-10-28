import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PatientRecord } from '../types';
import { generateWithAI } from '../services/vetAssistantAI';

const SOAP_INSTRUCTIONS = `Você é assistente de prontuário veterinário. Organize o relato abaixo em uma evolução clínica no formato SOAP, em português do Brasil, texto simples (sem markdown, sem asteriscos), com estas seções em linhas próprias:
S (Subjetivo): queixa e relato do tutor.
O (Objetivo): exame físico, parâmetros vitais e resultados de exames citados.
A (Avaliação): interpretação e hipóteses diagnósticas citadas.
P (Plano): condutas, prescrições, exames solicitados e retorno.
Use somente informações do relato. Não invente valores, diagnósticos ou medicamentos. Quando uma seção não tiver informação, escreva "Não informado". Responda apenas com a evolução.`;

type Stage = 'write' | 'review';

export const EvolutionComposer: React.FC<{ patient: PatientRecord; onClose: () => void }> = ({ patient, onClose }) => {
  const { addClinicalEvolutionToPatient, showToast } = useApp();
  const [stage, setStage] = useState<Stage>('write');
  const [report, setReport] = useState('');
  const [draft, setDraft] = useState('');
  const [usedAI, setUsedAI] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const abortRef = useRef<AbortController | null>(null);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  useEffect(
    () => () => {
      recognitionRef.current?.stop?.();
      abortRef.current?.abort();
    },
    [],
  );

  const toggleDictation = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'pt-BR';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (event: any) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
      }
      if (finalText) setReport((prev) => (prev ? `${prev.trimEnd()} ${finalText.trim()}` : finalText.trim()));
    };
    rec.onerror = (e: any) => {
      setNotice(e?.error === 'not-allowed' ? 'Permita o uso do microfone para ditar o relato.' : 'Não foi possível usar o microfone agora. Você pode digitar o relato.');
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    try {
      rec.start();
      setNotice(null);
      setListening(true);
    } catch {
      setNotice('Não foi possível iniciar o ditado. Você pode digitar o relato.');
    }
  };

  const header = `Evolução de ${new Date().toLocaleDateString('pt-BR')} - ${patient.name} (${patient.species}, ${patient.weight} kg)`;

  const organize = async () => {
    recognitionRef.current?.stop?.();
    setBusy(true);
    setNotice(null);
    const ctl = new AbortController();
    abortRef.current = ctl;
    try {
      const context = `Paciente: ${patient.name}, ${patient.species}${patient.breed ? ', ' + patient.breed : ''}, ${patient.weight} kg, ${patient.age || 'idade não informada'}.\nRelato do atendimento:\n${report}`;
      const { text } = await generateWithAI(SOAP_INSTRUCTIONS, context, { signal: ctl.signal });
      setDraft(`${header}\n\n${text.replace(/\*\*/g, '')}`);
      setUsedAI(true);
    } catch (e: any) {
      if (e?.code === 'cancelled') return;
      setDraft(`${header}\n\n${report}`);
      setUsedAI(false);
      setNotice('A IA não está disponível agora. Revise o relato e salve como está.');
    } finally {
      setBusy(false);
      setStage('review');
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      await addClinicalEvolutionToPatient(patient.id, draft.trim(), usedAI ? 'ai_assistant' : 'manual');
      showToast('Evolução salva no prontuário.');
      onClose();
    } catch {
      setNotice('Não foi possível salvar. Tente novamente.');
      setBusy(false);
    }
  };

  const textareaCls =
    'w-full rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] p-3 text-sm text-[var(--text-main)] leading-relaxed focus:outline-none focus:border-[var(--primary)]';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/75 backdrop-blur-sm p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="Nova evolução clínica">
      <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-t-3xl sm:rounded-3xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-main)]">Nova evolução clínica</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {patient.name} · {patient.species} · {patient.weight} kg
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-2 rounded-xl hover:bg-[var(--input-bg)] text-[var(--text-secondary)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {stage === 'write' ? (
          <>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Conte o atendimento do seu jeito: queixa, exame físico, parâmetros, suspeita e conduta. A IA organiza no formato SOAP e você revisa antes de salvar.
            </p>
            <textarea
              id="evolution-report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              rows={8}
              placeholder="Ex.: Tutora relata vômito há 2 dias, comeu pouco. Ao exame: T 39,1 °C, FC 120, mucosas rosadas, dor leve à palpação abdominal, 5% de desidratação. Suspeita de gastroenterite alimentar. Iniciei maropitant 1 mg/kg SC e fluidoterapia SC, dieta leve, retorno em 48 h."
              className={textareaCls}
            />
            {notice && <p className="text-xs text-amber-300">{notice}</p>}
            <div className="flex flex-wrap gap-2">
              {SpeechRecognition && (
                <button
                  type="button"
                  onClick={toggleDictation}
                  className={`min-h-[44px] px-4 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer border ${
                    listening ? 'bg-red-500 text-white border-transparent animate-pulse' : 'bg-[var(--input-bg)] text-[var(--text-main)] border-[var(--border)]'
                  }`}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {listening ? 'Parar ditado' : 'Ditar por voz'}
                </button>
              )}
              <button
                type="button"
                onClick={organize}
                disabled={!report.trim() || busy}
                className="flex-1 min-h-[44px] px-4 rounded-xl bg-[var(--primary)] text-[#062C23] text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                {busy ? 'Organizando…' : 'Organizar com IA'}
              </button>
            </div>
            {!SpeechRecognition && <p className="text-[11px] text-[var(--text-secondary)]">O ditado por voz funciona no Chrome e no Edge; neste navegador, digite o relato.</p>}
          </>
        ) : (
          <>
            <p className="text-xs text-[var(--text-secondary)]">
              {usedAI ? 'Confira e edite a evolução organizada pela IA antes de salvar.' : 'Revise o texto antes de salvar.'}
            </p>
            <textarea id="evolution-draft" value={draft} onChange={(e) => setDraft(e.target.value)} rows={14} className={`${textareaCls} font-mono text-xs`} />
            {notice && <p className="text-xs text-amber-300">{notice}</p>}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStage('write')}
                disabled={busy}
                className="min-h-[44px] px-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text-main)] text-sm font-bold cursor-pointer"
              >
                Voltar ao relato
              </button>
              <button
                type="button"
                onClick={save}
                disabled={busy || !draft.trim()}
                className="flex-1 min-h-[44px] px-4 rounded-xl bg-[var(--primary)] text-[#062C23] text-sm font-extrabold cursor-pointer disabled:opacity-50"
              >
                {busy ? 'Salvando…' : 'Aprovar e salvar no prontuário'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
