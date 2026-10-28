import React, { useState } from 'react';
import { Gift, ShieldCheck, Zap, Download, CheckCircle2, AlertTriangle, Activity, Stethoscope, HeartPulse, CheckSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { saveFile } from '../utils/fileSave';

export const BonusView: React.FC = () => {
  const { showToast, isPremium, setIsSubscriptionModalOpen } = useApp();
  const [downloadedBonus1, setDownloadedBonus1] = useState(false);
  const [downloadedBonus3, setDownloadedBonus3] = useState(false);
  const [generating, setGenerating] = useState<'guia' | 'checklist' | null>(null);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    anamnese: false,
    identificacao: false,
    historico: false,
    mucosas: false,
    hidratacao: false,
    linfonodos: false,
    ausculta: false,
    palpacao: false,
  });

  const toggleCheck = (key: string) => {
    setChecklistState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const downloadBonus = async (which: 'guia' | 'checklist') => {
    if (!isPremium) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    setGenerating(which);
    try {
      const pdfs = await import('../utils/bonusPdfs');
      const isGuide = which === 'guia';
      const outcome = await saveFile(
        isGuide ? 'VetCalcPro_Guia_Urgencias_Emergencias.pdf' : 'VetCalcPro_Checklist_Anamnese_Exame_Fisico.pdf',
        isGuide ? pdfs.buildEmergencyGuidePdf() : pdfs.buildChecklistPdf(),
      );
      if (outcome === 'saved') {
        (isGuide ? setDownloadedBonus1 : setDownloadedBonus3)(true);
        showToast(isGuide ? 'Guia de Urgências e Emergências baixado.' : 'Checklist de Anamnese e Exame Físico baixado.');
      } else if (outcome === 'declined') {
        showToast('Download cancelado.');
      } else {
        showToast('Não foi possível baixar o arquivo aqui.');
      }
    } catch {
      showToast('Não foi possível gerar o PDF. Tente novamente.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-4xl mx-auto">
      {/* Top Title Banner */}
      <div className="bg-gradient-to-r from-[#071326] via-[#10213B] to-[#0A2540] text-white rounded-3xl p-6 sm:p-8 border border-[#243D58] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider font-mono">
            <Gift className="w-3.5 h-3.5" />
            <span>Materiais Bônus Exclusivos Pro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Manuais Digitais e Checklists Clínicos
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Ferramentas práticas incluídas gratuitamente para otimizar sua rotina de atendimento, plantões e exames físicos na clínica veterinária.
          </p>
        </div>
      </div>

      {/* ================= BÔNUS 01 ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold uppercase tracking-wider">
                Bônus 01
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Guia Prático</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Guia de Urgências e Emergências Clínicas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Manual digital prático com fluxograma de atendimento inicial para pacientes críticos em cães e gatos.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shrink-0 w-full md:w-auto">
            <span className="text-[11px] text-slate-400 block uppercase font-mono">Valor separado:</span>
            <span className="text-base font-bold text-slate-400 line-through">R$ 97,00</span>
            <div className="mt-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider">
              Grátis nesta oferta
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Triagem ABCDE Veterinária</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Passo a passo para avaliação imediata de vias aéreas, respiração, circulação, estado neurológico e lesões ativas em pacientes politraumatizados ou em choque.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1.5">
              <HeartPulse className="w-4 h-4 text-red-500" />
              <span>Protocolo de RCP & Fármacos</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Diretrizes RECOVER para massagem cardíaca, ventilação com ambu e doses rápidas de Adrenalina, Atropina, Lidocaína e Furosemida.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => downloadBonus('guia')}
            disabled={generating !== null}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            <Download className="w-4 h-4" />
            <span>{generating === 'guia' ? 'Gerando PDF…' : downloadedBonus1 ? 'Guia baixado · baixar de novo' : isPremium ? 'Baixar Guia de Urgências (PDF)' : 'Baixar Guia (Premium)'}</span>
          </button>
        </div>
      </div>

      {/* ================= BÔNUS 03 ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold uppercase tracking-wider">
                Bônus 02
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Checklist Prático</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Checklist de Anamnese e Exame Físico
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Roteiro sistemático para não esquecer nenhum detalhe durante a consulta clínica diária.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shrink-0 w-full md:w-auto">
            <span className="text-[11px] text-slate-400 block uppercase font-mono">Valor separado:</span>
            <span className="text-base font-bold text-slate-400 line-through">R$ 77,00</span>
            <div className="mt-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider">
              Grátis nesta oferta
            </div>
          </div>
        </div>

        {/* Interactive Checklist Preview */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <span>Roteiro Interativo da Consulta Diária</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {Object.values(checklistState).filter(Boolean).length} / {Object.keys(checklistState).length} Concluídos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { key: 'identificacao', label: '1. Identificação completa (Espécie, raça, idade, peso, sexo)' },
              { key: 'anamnese', label: '2. Queixa principal e histórico da doença atual (HDA)' },
              { key: 'historico', label: '3. Histórico vacinal, vermifugação e alimentação' },
              { key: 'mucosas', label: '4. Inspeção de mucosas e TPC (Tempo de Preenchimento Capilar)' },
              { key: 'hidratacao', label: '5. Avaliação do grau de desidratação e turgor cutâneo' },
              { key: 'linfonodos', label: '6. Palpação de linfonodos superficiais' },
              { key: 'ausculta', label: '7. Ausculta cardiopulmonar (FC, FR e murmúrios)' },
              { key: 'palpacao', label: '8. Palpação abdominal sistemática e dor' },
            ].map((item) => (
              <label
                key={item.key}
                className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                  checklistState[item.key]
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checklistState[item.key]}
                  onChange={() => toggleCheck(item.key)}
                  className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="leading-tight">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => downloadBonus('checklist')}
            disabled={generating !== null}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            <Download className="w-4 h-4" />
            <span>{generating === 'checklist' ? 'Gerando PDF…' : downloadedBonus3 ? 'Checklist baixado · baixar de novo' : isPremium ? 'Baixar Checklist de Anamnese (PDF)' : 'Baixar Checklist (Premium)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
