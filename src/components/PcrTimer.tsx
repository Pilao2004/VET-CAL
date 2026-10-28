import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Square, Syringe, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDose } from '../data/emergencyDrugs';

const CYCLE_MS = 2 * 60 * 1000;

const mmss = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/** Sinal sonoro curto (sem arquivo de áudio) e vibração no celular. */
function alertBeep() {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.25, 0.5].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.value = 0.25;
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.15);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {}
  try {
    navigator.vibrate?.([300, 150, 300, 150, 300]);
  } catch {}
}

interface Props {
  /** Volume de adrenalina (dose baixa) para o peso atual, em mL; null se o peso não foi informado. */
  adrenalineMl: number | null;
}

/** Cronômetro de RCP: ciclos de 2 minutos, lembrete de adrenalina a cada 2 ciclos e registro das doses. */
export const PcrTimer: React.FC<Props> = ({ adrenalineMl }) => {
  const { showToast } = useApp();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [pausedTotal, setPausedTotal] = useState(0);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [doses, setDoses] = useState<number[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const lastCycle = useRef(0);
  const wakeLock = useRef<any>(null);

  const running = startedAt !== null && pausedAt === null;
  const elapsed = startedAt === null ? 0 : (pausedAt ?? now) - startedAt - pausedTotal;
  const cycle = Math.floor(elapsed / CYCLE_MS) + 1;
  const cycleLeft = CYCLE_MS - (elapsed % CYCLE_MS);
  const adrenalineCycle = cycle % 2 === 1; // ciclo sim, ciclo não (a cada 3-5 min)

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [running]);

  // Fim de cada ciclo de 2 minutos: aviso sonoro, vibração e mensagem
  useEffect(() => {
    if (!running) return;
    const completed = Math.floor(elapsed / CYCLE_MS);
    if (completed > lastCycle.current) {
      lastCycle.current = completed;
      alertBeep();
      const next = completed + 1;
      showToast(
        next % 2 === 1
          ? `Fim do ciclo ${completed}: troque quem faz a massagem, cheque o ritmo (até 10 s) e aplique a adrenalina.`
          : `Fim do ciclo ${completed}: troque quem faz a massagem e cheque o ritmo (até 10 s).`,
      );
    }
  }, [elapsed, running, showToast]);

  // Mantém a tela acesa durante a RCP, quando o navegador permite
  useEffect(() => {
    if (running && 'wakeLock' in navigator) {
      (navigator as any).wakeLock.request('screen').then((l: any) => (wakeLock.current = l)).catch(() => {});
    }
    return () => {
      wakeLock.current?.release?.().catch(() => {});
      wakeLock.current = null;
    };
  }, [running]);

  const start = () => {
    const t = Date.now();
    setStartedAt(t);
    setNow(t);
    setPausedTotal(0);
    setPausedAt(null);
    setDoses([]);
    setSummary(null);
    lastCycle.current = 0;
  };

  const togglePause = () => {
    if (pausedAt === null) setPausedAt(Date.now());
    else {
      setPausedTotal((p) => p + (Date.now() - pausedAt));
      setPausedAt(null);
      setNow(Date.now());
    }
  };

  const stop = () => {
    const lines = [
      `RCP: ${mmss(elapsed)} de duração, ${cycle} ciclo(s).`,
      doses.length ? `Adrenalina aplicada em: ${doses.map(mmss).join(', ')}.` : 'Nenhuma dose de adrenalina registrada.',
    ];
    setSummary(lines.join(' '));
    setStartedAt(null);
    setPausedAt(null);
  };

  const copySummary = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      showToast('Resumo da RCP copiado.');
    } catch {
      showToast('Não foi possível copiar.');
    }
  };

  if (startedAt === null) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={start}
          className="w-full sm:w-auto px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Timer className="w-5 h-5" /> Iniciar cronômetro de RCP
        </button>
        {summary && (
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-xs text-[var(--text-main)] flex flex-wrap items-center justify-between gap-2">
            <span>{summary}</span>
            <button type="button" onClick={copySummary} className="text-[var(--primary)] font-bold underline cursor-pointer">
              Copiar para o prontuário
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-20 md:top-32 z-30 rounded-2xl border-2 border-red-500 bg-[var(--surface)] shadow-xl p-4 space-y-3" role="timer" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider">RCP em andamento{pausedAt !== null ? ' (pausado)' : ''}</p>
          <p className="font-mono text-3xl font-extrabold text-[var(--text-main)] leading-none mt-1">{mmss(elapsed)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[var(--text-secondary)]">Ciclo {cycle} · troca em</p>
          <p className={`font-mono text-2xl font-extrabold leading-none mt-1 ${cycleLeft < 15000 ? 'text-red-400 animate-pulse' : 'text-[var(--primary)]'}`}>{mmss(cycleLeft)}</p>
        </div>
      </div>

      <div className="h-2 rounded-full bg-[var(--input-bg)] overflow-hidden">
        <div className="h-full bg-red-500 transition-[width] duration-200" style={{ width: `${100 - (cycleLeft / CYCLE_MS) * 100}%` }} />
      </div>

      <p className={`text-xs font-semibold rounded-xl px-3 py-2 ${adrenalineCycle ? 'bg-red-500/15 text-red-300 dark:text-red-200' : 'bg-[var(--input-bg)] text-[var(--text-secondary)]'}`}>
        {adrenalineCycle
          ? `Ciclo de adrenalina: dose baixa ${adrenalineMl !== null ? `${formatDose(adrenalineMl)} mL` : '(informe o peso)'} IV/IO.`
          : 'Ciclo sem adrenalina: massagem contínua e ventilação 10 por minuto.'}
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setDoses((d) => [...d, elapsed]);
            showToast(`Adrenalina registrada em ${mmss(elapsed)}.`);
          }}
          className="flex-1 min-w-[140px] py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Syringe className="w-4 h-4" /> Adrenalina aplicada ({doses.length})
        </button>
        <button type="button" onClick={togglePause} className="px-3 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer">
          {pausedAt === null ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {pausedAt === null ? 'Pausar' : 'Retomar'}
        </button>
        <button type="button" onClick={stop} className="px-3 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer">
          <Square className="w-4 h-4" /> Encerrar
        </button>
      </div>
    </div>
  );
};
