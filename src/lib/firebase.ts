// Firebase: login (e-mail/senha e Google), liberação do acesso no Firestore e IA (Firebase AI Logic).
// Esta configuração é pública por natureza; a proteção dos dados vem das regras em firestore.rules.
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDdwa1_pKLrw9LyT7YUP9t9RP2ExVdV-Y8',
  authDomain: 'vet-calc-pro.firebaseapp.com',
  projectId: 'vet-calc-pro',
  storageBucket: 'vet-calc-pro.firebasestorage.app',
  messagingSenderId: '369269483620',
  appId: '1:369269483620:web:c91af42238582234afd771',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
auth.languageCode = 'pt';
export const db = getFirestore(firebaseApp);

export type { User };

export const normalizeEmail = (email: string | null | undefined) => String(email || '').trim().toLowerCase();

/** Conta com e-mail confirmado: o Google já vem confirmado; e-mail/senha confirma pelo link enviado. */
export const isVerified = (user: User | null) => Boolean(user?.emailVerified);

export const watchAuth = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);

/**
 * Acompanha a liberação do acesso: documento acessos/{e-mail} com { liberado: true }.
 * Quem libera é o dono do app, pelo console do Firebase (Firestore Database).
 */
export function watchAccess(email: string, cb: (access: { liberado: boolean; expiraEm?: string }) => void, onError: () => void) {
  return onSnapshot(
    doc(db, 'acessos', normalizeEmail(email)),
    (snap) => {
      const data = snap.data() || {};
      cb({ liberado: data.liberado === true, expiraEm: typeof data.expiraEm === 'string' ? data.expiraEm : undefined });
    },
    onError,
  );
}

const authMessage = (err: any): string => {
  const code = String(err?.code || '');
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'E-mail ou senha incorretos.';
  if (code.includes('email-already-in-use')) return 'Já existe uma conta com este e-mail. Use "Entrar".';
  if (code.includes('weak-password')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (code.includes('invalid-email')) return 'E-mail inválido.';
  if (code.includes('too-many-requests')) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (code.includes('popup-closed') || code.includes('cancelled-popup')) return 'Login com o Google cancelado.';
  if (code.includes('popup-blocked')) return 'O navegador bloqueou a janela do Google. Libere pop-ups e tente de novo.';
  if (code.includes('network')) return 'Sem conexão. Verifique a internet e tente de novo.';
  if (code.includes('configuration-not-found') || code.includes('operation-not-allowed')) return 'O login ainda não foi ativado no Firebase (Authentication > Método de login).';
  if (code.includes('unauthorized-domain')) return 'Este endereço ainda não está autorizado no Firebase (Authentication > Configurações > Domínios autorizados).';
  return 'Não foi possível concluir. Tente de novo.';
};

type Result = { success: boolean; message: string };

export async function loginWithGoogle(): Promise<Result> {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    return { success: true, message: 'Login realizado.' };
  } catch (err) {
    return { success: false, message: authMessage(err) };
  }
}

export async function loginWithEmail(email: string, password: string): Promise<Result> {
  try {
    await signInWithEmailAndPassword(auth, normalizeEmail(email), password);
    return { success: true, message: 'Login realizado.' };
  } catch (err) {
    return { success: false, message: authMessage(err) };
  }
}

export async function signUpWithEmail(email: string, password: string, name?: string): Promise<Result> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, normalizeEmail(email), password);
    // Nome que aparece no perfil
    if (name?.trim()) await updateProfile(cred.user, { displayName: name.trim() });
    await sendEmailVerification(cred.user);
    return { success: true, message: 'Conta criada. Enviamos um link de confirmação para o seu e-mail: abra-o e depois toque em "Já confirmei".' };
  } catch (err) {
    return { success: false, message: authMessage(err) };
  }
}

export async function resendVerification(): Promise<Result> {
  try {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
    return { success: true, message: 'Link de confirmação reenviado. Confira também a caixa de spam.' };
  } catch (err) {
    return { success: false, message: authMessage(err) };
  }
}

/** Recarrega a conta para ver se o e-mail já foi confirmado. */
export async function reloadUser(): Promise<User | null> {
  if (!auth.currentUser) return null;
  await auth.currentUser.reload();
  await auth.currentUser.getIdToken(true);
  return auth.currentUser;
}

export async function resetPassword(email: string): Promise<Result> {
  try {
    await sendPasswordResetEmail(auth, normalizeEmail(email));
    return { success: true, message: 'Enviamos um link para criar uma nova senha. Confira também a caixa de spam.' };
  } catch (err) {
    return { success: false, message: authMessage(err) };
  }
}

export const logout = () => signOut(auth);
