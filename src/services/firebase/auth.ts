import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updatePassword as firebaseUpdatePassword,
  deleteUser as firebaseDeleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
} from 'firebase/auth';
import { auth } from './config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

const toAuthUser = (user: any): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

export const signInWithGoogle = async (): Promise<AuthUser> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return toAuthUser(result.user);
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return toAuthUser(result.user);
};

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  await firebaseSendEmailVerification(result.user);
  return toAuthUser({ ...result.user, displayName });
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const onAuthStateChanged = (
  callback: (user: AuthUser | null) => void
): (() => void) => {
  return firebaseOnAuthStateChanged(auth, (user) => {
    callback(user ? toAuthUser(user) : null);
  });
};

export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No authenticated user');
  
  // Re-authenticate before changing password
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await firebaseUpdatePassword(user, newPassword);
};

export const deleteUserAccount = async (password?: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  // Re-authenticate if email/password user
  if (password && user.email) {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  }

  await firebaseDeleteUser(user);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const resendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  await firebaseSendEmailVerification(user);
};

export const isEmailPasswordUser = (): boolean => {
  const user = auth.currentUser;
  if (!user) return false;
  return user.providerData.some(p => p.providerId === 'password');
};
