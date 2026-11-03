// Perfil e prontuários na conta Google do usuário (Firestore: usuarios/{uid}).
// Os prontuários continuam salvos no aparelho; a nuvem é uma cópia que acompanha a conta.
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, User } from '../lib/firebase';
import { PatientRecord } from '../types';

export interface VetProfile {
  name: string;
  crmv: string;
  clinic: string;
}

export const VET_PROFILE_KEY = 'vetcalc_vet_profile';

export function loadLocalVetProfile(): VetProfile {
  try {
    const saved = JSON.parse(localStorage.getItem(VET_PROFILE_KEY) || '{}');
    return { name: saved.name || '', crmv: saved.crmv || '', clinic: saved.clinic || '' };
  } catch {
    return { name: '', crmv: '', clinic: '' };
  }
}

export function saveLocalVetProfile(profile: VetProfile) {
  try {
    localStorage.setItem(VET_PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

const userDoc = (uid: string) => doc(db, 'usuarios', uid);
const patientsDoc = (uid: string) => doc(db, 'usuarios', uid, 'dados', 'prontuarios');

/** Salva o perfil (nome para a receita, CRMV, clínica) junto com os dados da conta Google. */
export async function saveCloudProfile(user: User, profile: VetProfile) {
  await setDoc(
    userDoc(user.uid),
    {
      email: user.email || '',
      contaNome: user.displayName || '',
      foto: user.photoURL || '',
      nomeReceita: profile.name,
      crmv: profile.crmv,
      clinica: profile.clinic,
      atualizadoEm: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function loadCloudProfile(uid: string): Promise<VetProfile | null> {
  const snap = await getDoc(userDoc(uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { name: d.nomeReceita || '', crmv: d.crmv || '', clinic: d.clinica || '' };
}

/** O Firestore aceita até 1 MiB por documento; acima disso o backup na nuvem é recusado. */
const MAX_BYTES = 950_000;

export async function saveCloudPatients(uid: string, patients: PatientRecord[]): Promise<{ ok: boolean; reason?: 'too_big' }> {
  const real = patients.filter((p) => !p.id?.startsWith('demo-'));
  const json = JSON.stringify(real);
  if (new Blob([json]).size > MAX_BYTES) return { ok: false, reason: 'too_big' };
  await setDoc(patientsDoc(uid), { pacientes: json, total: real.length, atualizadoEm: serverTimestamp() });
  return { ok: true };
}

export async function loadCloudPatients(uid: string): Promise<PatientRecord[] | null> {
  const snap = await getDoc(patientsDoc(uid));
  if (!snap.exists()) return null;
  try {
    const list = JSON.parse(snap.data().pacientes || '[]');
    return Array.isArray(list) ? list : null;
  } catch {
    return null;
  }
}

/** Junta os prontuários do aparelho com os da conta, sem perder nenhum (o do aparelho vale em caso de empate). */
export function mergePatients(local: PatientRecord[], cloud: PatientRecord[]): PatientRecord[] {
  const byId = new Map<string, PatientRecord>();
  for (const p of cloud) if (p?.id) byId.set(p.id, p);
  for (const p of local) if (p?.id && !p.id.startsWith('demo-')) byId.set(p.id, p);
  return [...byId.values()];
}
