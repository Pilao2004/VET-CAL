import React, { useMemo, useState } from 'react';
import { AlertTriangle, Download, Siren } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EMERGENCY_DRUGS, EmergencyGroup, emergencyDoses, formatDose } from '../data/emergencyDrugs';
import { saveFile } from '../utils/fileSave';
import { PdfDoc } from '../utils/pdfDoc';
import { PcrTimer } from './PcrTimer';

const GROUPS: (EmergencyGroup | 'Todos')[] = ['Todos', 'PCR', 'Reversores', 'Convulsão', 'Metabólico', 'Anafilaxia e ICC', 'Choque'];

export const EmergencyTable: React.FC = () => {
  const { showToast, sharedWeight, setSharedWeight, sharedSpecies, setSharedSpecies } = useApp();
  // Peso e espécie são os mesmos das outras calculadoras (paciente da vez)
  const species: 'dog' | 'cat' = sharedSpecies === 'Felino' ? 'cat' : 'dog';
  const setSpecies = (sp: 'dog' | 'cat') => setSharedSpecies(sp === 'cat' ? 'Felino' : 'Canino');
  const weightText = sharedWeight;
  const setWeightText = setSharedWeight;
  const [group, setGroup] = useState<EmergencyGroup | 'Todos'>('Todos');
  const [concentrations, setConcentrations] = useState<Record<string, number>>({});

  const weight = parseFloat(weightText.replace(',', '.'));
  const validWeight = weight > 0 && weight < 1500;
  const rows = useMemo(
    () => (validWeight ? emergencyDoses(weight, species, concentrations) : []).filter((r) => group === 'Todos' || r.drug.group === group),
    [weight, validWeight, species, concentrations, group],
  );

  const downloadPdf = async () => {
    if (!validWeight) return;
    const label = species === 'dog' ? 'Cão' : 'Gato';
    const pdf = new PdfDoc('Tabela de Emergência por Peso', `${label} · ${formatDose(weight)} kg`);
    pdf.h1(`Doses de emergência: ${label}, ${formatDose(weight)} kg`);
    pdf.p(`Gerado em ${new Date().toLocaleString('pt-BR')}. Volumes calculados para as concentrações indicadas; confira a ampola antes de aspirar.`, { muted: true });
    pdf.table(
      ['Fármaco', 'Indicação', 'Dose/kg', 'Dose total', 'Concentração', 'Volume', 'Via'],
      emergencyDoses(weight, species, concentrations).map((r) => [
        r.drug.name,
        r.drug.indication,
        `${formatDose(r.dosePerKg)} ${r.drug.unit}/kg`,
        `${formatDose(r.totalDose)} ${r.drug.unit}`,
        r.drug.unit === 'mL' ? '-' : `${formatDose(concentrations[r.drug.id] || r.drug.concentration)} ${r.drug.unit}/mL`,
        `${formatDose(r.volumeMl)} mL`,
        r.drug.route,
      ]),
      [26, 30, 15, 15, 17, 13, 17],
    );
    const blob = pdf.finish('Doses de referência (RECOVER e literatura veterinária). A decisão clínica é do médico-veterinário responsável.');
    const outcome = await saveFile(`VetCalcPro_Emergencia_${label}_${formatDose(weight)}kg.pdf`, blob);
    if (outcome === 'saved') showToast('Tabela de emergência baixada.');
  };

  return (
    <div className="space-y-5">
      <div className="bg-[var(--surface)] rounded-3xl p-4 sm:p-6 border border-[var(--border)] shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
            <Siren className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[var(--text-main)]">Tabela de Emergência por Peso</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Informe a espécie e o peso: o volume de cada fármaco aparece na hora. Toque na concentração para ajustar à ampola que você tem.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div role="radiogroup" aria-label="Espécie" className="inline-flex p-1 rounded-xl bg-[var(--input-bg)] border border-[var(--border)]">
            {(['dog', 'cat'] as const).map((sp) => (
              <button
                key={sp}
                id={`emerg-species-${sp}`}
                role="radio"
                aria-checked={species === sp}
                onClick={() => setSpecies(sp)}
                className={`px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors ${
                  species === sp ? 'bg-[var(--primary)] text-[#062C23]' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'
                }`}
              >
                {sp === 'dog' ? 'Cão' : 'Gato'}
              </button>
            ))}
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Peso (kg)</span>
            <input
              id="emerg-weight"
              type="text"
              inputMode="decimal"
              value={weightText}
              onChange={(e) => setWeightText(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl border-2 border-[var(--primary)] bg-[var(--input-bg)] text-[var(--text-main)] font-mono text-lg font-bold focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={!validWeight}
            className="ml-auto px-4 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text-main)] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:border-[var(--primary)] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Baixar tabela (PDF)
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                group === g
                  ? 'bg-[var(--primary)] text-[#062C23] border-transparent'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-main)]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <PcrTimer adrenalineMl={validWeight ? emergencyDoses(weight, species, concentrations).find((r) => r.drug.id === 'adrenalina-baixa')?.volumeMl ?? null : null} />

      {!validWeight ? (
        <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-secondary)]">
          Informe o peso do paciente em kg para ver as doses.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rows.map(({ drug, dosePerKg, totalDose, volumeMl }) => (
            <div key={drug.id} className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)] space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-[var(--text-main)] leading-tight">{drug.name}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{drug.indication}</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--input-bg)] text-[var(--text-secondary)] shrink-0">
                  {drug.group}
                </span>
              </div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="font-mono text-2xl font-extrabold text-[var(--primary)] leading-none tabular-nums">
                    {formatDose(volumeMl)} <span className="text-sm">mL</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-1 tabular-nums">
                    {formatDose(totalDose)} {drug.unit} · {formatDose(dosePerKg)} {drug.unit}/kg · {drug.route}
                  </div>
                </div>
                {drug.unit !== 'mL' && (
                  <label className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-[10px] text-[var(--text-secondary)]">Concentração ({drug.unit}/mL)</span>
                    <input
                      id={`emerg-conc-${drug.id}`}
                      type="text"
                      inputMode="decimal"
                      defaultValue={String(drug.concentration).replace('.', ',')}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value.replace(',', '.'));
                        setConcentrations((prev) => ({ ...prev, [drug.id]: v > 0 ? v : drug.concentration }));
                      }}
                      className="w-20 px-2 py-1 rounded-lg bg-[var(--input-bg)] border border-[var(--border)] text-right font-mono text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </label>
                )}
              </div>
              {drug.note && <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">{drug.note}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 leading-relaxed">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Doses de referência das diretrizes RECOVER e da literatura de emergência veterinária. Confira a concentração da ampola, dilua volumes muito pequenos e ajuste ao paciente. A decisão clínica é do médico-veterinário responsável.
        </span>
      </div>
    </div>
  );
};
