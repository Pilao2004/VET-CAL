// Contador de perguntas do Assistente IA Premium (limite mensal).
// Com conta: usuarios/{uid}/dados/uso_ia no Firestore; sem conta (prévia do dono): neste aparelho.
// O limite definitivo é conferido no servidor quando a IA paga estiver ligada; aqui ele serve para mostrar o uso.
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const currentMonth = () => new Date().toISOString().slice(0, 7);
const LOCAL_KEY = 'vetcalc_ia_uso';

export interface IaUsage {
  mes: string;
  perguntas: number;
}

const usageDoc = (uid: string) => doc(db, 'usuarios', uid, 'dados', 'uso_ia');

function readLocal(): IaUsage {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
    if (saved.mes === currentMonth()) return { mes: saved.mes, perguntas: Number(saved.perguntas) || 0 };
  } catch {}
  return { mes: currentMonth(), perguntas: 0 };
}

function writeLocal(u: IaUsage) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(u));
  } catch {}
}

export async function loadIaUsage(uid: string | null): Promise<IaUsage> {
  if (!uid) return readLocal();
  try {
    const snap = await getDoc(usageDoc(uid));
    const d = snap.data();
    if (d && d.mes === currentMonth()) return { mes: d.mes, perguntas: Number(d.perguntas) || 0 };
  } catch {}
  return { mes: currentMonth(), perguntas: 0 };
}

/** Soma uma pergunta ao mês atual e devolve o uso atualizado. */
export async function addIaQuestion(uid: string | null, current: IaUsage): Promise<IaUsage> {
  const base = current.mes === currentMonth() ? current : { mes: currentMonth(), perguntas: 0 };
  const next = { mes: base.mes, perguntas: base.perguntas + 1 };
  if (!uid) {
    writeLocal(next);
    return next;
  }
  try {
    await setDoc(usageDoc(uid), next);
  } catch {}
  return next;
}
