import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  increment,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';
import { Listing } from '../../types';
import { OrganisationProfile } from '../../types';

// ─── LISTINGS ────────────────────────────────────────────────

export const getListings = async (): Promise<Listing[]> => {
  const snapshot = await getDocs(
    query(collection(db, 'listings'), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Listing));
};

export const getListingById = async (id: string): Promise<Listing | null> => {
  const snap = await getDoc(doc(db, 'listings', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Listing;
};

export const submitListing = async (
  listing: Omit<Listing, 'id'>,
  userId: string
): Promise<string> => {
  const ref = await addDoc(collection(db, 'listings'), {
    ...listing,
    submittedBy: userId,
    status: 'pending',
    views: 0,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
};

export const updateListing = async (
  id: string,
  data: Partial<Listing>
): Promise<void> => {
  await updateDoc(doc(db, 'listings', id), data as any);
};

export const deleteListing = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'listings', id));
};

export const getUserListings = async (userId: string): Promise<Listing[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'listings'),
      where('submittedBy', '==', userId),
      orderBy('createdAt', 'desc')
    )
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Listing));
};

export const updateListingStatus = async (
  id: string,
  status: 'active' | 'pending' | 'expired' | 'partnership-found'
): Promise<void> => {
  await updateDoc(doc(db, 'listings', id), { status });
};

// Real-time listener — returns unsubscribe function
export const subscribeToListings = (
  callback: (listings: Listing[]) => void
): (() => void) => {
  const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Listing));
    callback(listings);
  });
};

// ─── ORGANISATION PROFILES ───────────────────────────────────

export const getProfile = async (userId: string): Promise<OrganisationProfile | null> => {
  const snap = await getDoc(doc(db, 'profiles', userId));
  if (!snap.exists()) return null;
  return snap.data() as OrganisationProfile;
};

export const saveProfile = async (
  userId: string,
  profile: OrganisationProfile
): Promise<void> => {
  await setDoc(doc(db, 'profiles', userId), profile, { merge: true });
};

// ─── ADMIN ───────────────────────────────────────────────────

export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, 'admins', userId));
  return snap.exists();
};

// ─── VIEWS COUNTER ───────────────────────────────────────────

export const incrementListingViews = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'listings', id), { views: increment(1) });
};

// FETCH ALL PROFILES (for Organisations directory)
export const getProfiles = async (): Promise<(OrganisationProfile & { uid: string })[]> => {
  const snapshot = await getDocs(collection(db, 'profiles'));
  return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as OrganisationProfile & { uid: string }));
};

export const subscribeToProfiles = (
  callback: (profiles: (OrganisationProfile & { uid: string })[]) => void
): (() => void) => {
  return onSnapshot(collection(db, 'profiles'), (snapshot) => {
    const profiles = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as OrganisationProfile & { uid: string }));
    callback(profiles);
  });
};

// ─── USERS ───────────────────────────────────────────────────

export const upsertUser = async (
  uid: string,
  data: { email: string | null; displayName: string | null; photoURL: string | null }
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const adminRef = doc(db, 'admins', uid);

  const [snap, adminSnap] = await Promise.all([
    getDoc(userRef),
    getDoc(adminRef),
  ]);

  const isAdmin = adminSnap.exists();

  if (!snap.exists()) {
    // First time — create full record
    await setDoc(userRef, {
      uid,
      email: data.email || '',
      displayName: data.displayName || '',
      photoURL: data.photoURL || '',
      joinedAt: new Date().toISOString(),
      listingCount: 0,
      status: 'active',
      isAdmin,
    });
  } else {
    // Returning user — update display info and sync admin status
    await updateDoc(userRef, {
      displayName: data.displayName || '',
      email: data.email || '',
      isAdmin,
    });
  }
};

export const subscribeToUsers = (
  callback: (users: any[]) => void
): (() => void) => {
  return onSnapshot(collection(db, 'users'), (snapshot) => {
    const users = snapshot.docs.map((d) => ({ ...d.data() }));
    callback(users);
  });
};
