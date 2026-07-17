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
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { Listing } from '../../types';
import { OrganisationProfile } from '../../types';
import { PartnerRequest } from '../../types/partnerRequest';
import { Message } from '../../types/message';
import { deleteUserLogo } from './storage';

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
  status: 'active' | 'pending' | 'expired' | 'partnership-found' | 'rejected'
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
  }, (error) => {
    console.error('subscribeToListings error:', error);
    callback([]);
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

export const updateUserBanStatus = async (
  uid: string,
  status: 'active' | 'banned'
): Promise<void> => {
  await updateDoc(doc(db, 'users', uid), { status });
};

export const promoteUserToAdmin = async (uid: string): Promise<void> => {
  await setDoc(doc(db, 'admins', uid), { grantedAt: new Date().toISOString() });
  await updateDoc(doc(db, 'users', uid), { isAdmin: true });
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
  const q = query(collection(db, 'profiles'), orderBy('organisationName', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const profiles = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as OrganisationProfile & { uid: string }));
    callback(profiles);
  }, (error) => {
    console.error('subscribeToProfiles error:', error);
    callback([]);
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
  }, (error) => {
    console.error('subscribeToUsers error:', error);
    callback([]);
  });
};

export const deleteUserData = async (userId: string): Promise<void> => {
  // Delete profile
  await deleteDoc(doc(db, 'profiles', userId));
  // Delete user record
  await deleteDoc(doc(db, 'users', userId));
  // Mark all user's listings as expired so they are no longer publicly visible
  const userListings = await getDocs(
    query(collection(db, 'listings'), where('submittedBy', '==', userId))
  );
  const expirePromises = userListings.docs.map((d) =>
    updateDoc(doc(db, 'listings', d.id), { status: 'expired' })
  );
  await Promise.all(expirePromises);

  // Delete partner requests where this user is either party (sent or received)
  const [sentRequests, receivedRequests] = await Promise.all([
    getDocs(query(collection(db, 'partnerRequests'), where('fromOrgUid', '==', userId))),
    getDocs(query(collection(db, 'partnerRequests'), where('toOrgUid', '==', userId))),
  ]);
  const requestDeletePromises = [...sentRequests.docs, ...receivedRequests.docs].map((d) =>
    deleteDoc(doc(db, 'partnerRequests', d.id))
  );
  await Promise.all(requestDeletePromises);

  // Delete all chat messages this user sent or received
  const userMessages = await getDocs(
    query(collection(db, 'messages'), where('participants', 'array-contains', userId))
  );
  const messageDeletePromises = userMessages.docs.map((d) =>
    deleteDoc(doc(db, 'messages', d.id))
  );
  await Promise.all(messageDeletePromises);

  // Delete the user's uploaded logo from Storage (no-op if none exists)
  await deleteUserLogo(userId);
};

export const saveUserSettings = async (userId: string, settings: {
  emailNotifications?: boolean;
  showEmailOnProfile?: boolean;
  showLocationOnProfile?: boolean;
  profilePublic?: boolean;
}): Promise<void> => {
  await setDoc(doc(db, 'users', userId), { settings }, { merge: true });
};

export const getUserSettings = async (userId: string): Promise<{
  emailNotifications: boolean;
  showEmailOnProfile: boolean;
  showLocationOnProfile: boolean;
  profilePublic: boolean;
}> => {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return {
    emailNotifications: true,
    showEmailOnProfile: true,
    showLocationOnProfile: true,
    profilePublic: true,
  };
  const settings = snap.data()?.settings || {};
  return {
    emailNotifications: settings.emailNotifications ?? true,
    showEmailOnProfile: settings.showEmailOnProfile ?? true,
    showLocationOnProfile: settings.showLocationOnProfile ?? true,
    profilePublic: settings.profilePublic ?? true,
  };
};

// ─── PARTNER REQUESTS ────────────────────────────────────────

export const submitPartnerRequest = async (
  request: Omit<PartnerRequest, 'id'>
): Promise<string> => {
  const ref = await addDoc(collection(db, 'partnerRequests'), request);
  return ref.id;
};

export const getRequestsForListing = async (
  listingId: string
): Promise<PartnerRequest[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'partnerRequests'),
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    )
  );
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PartnerRequest));
};

export const getIncomingRequests = async (
  toOrgUid: string
): Promise<PartnerRequest[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'partnerRequests'),
      where('toOrgUid', '==', toOrgUid),
      orderBy('createdAt', 'desc')
    )
  );
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PartnerRequest));
};

export const getSentRequests = async (
  fromOrgUid: string
): Promise<PartnerRequest[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'partnerRequests'),
      where('fromOrgUid', '==', fromOrgUid),
      orderBy('createdAt', 'desc')
    )
  );
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PartnerRequest));
};

export const updateRequestStatus = async (
  requestId: string,
  status: 'accepted' | 'declined'
): Promise<void> => {
  await updateDoc(doc(db, 'partnerRequests', requestId), { status });
};

export const hideRequestForUser = async (
  requestId: string,
  userUid: string
): Promise<void> => {
  await updateDoc(doc(db, 'partnerRequests', requestId), {
    hiddenBy: arrayUnion(userUid)
  });
};

export const archiveConversation = async (requestId: string, userUid: string): Promise<void> => {
  await updateDoc(doc(db, 'partnerRequests', requestId), {
    archivedBy: arrayUnion(userUid),
  });
};

export const unarchiveConversation = async (requestId: string, userUid: string): Promise<void> => {
  await updateDoc(doc(db, 'partnerRequests', requestId), {
    archivedBy: arrayRemove(userUid),
  });
};

export const withdrawPartnerRequest = async (
  requestId: string
): Promise<void> => {
  await deleteDoc(doc(db, 'partnerRequests', requestId));
};

export const checkExistingRequest = async (
  listingId: string,
  fromOrgUid: string
): Promise<boolean> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'partnerRequests'),
      where('listingId', '==', listingId),
      where('fromOrgUid', '==', fromOrgUid)
    )
  );
  return !snapshot.empty;
};

// ─── MESSAGES ────────────────────────────────────────────────

export const sendMessage = async (
  requestId: string,
  fromUid: string,
  toUid: string,
  text: string
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await addDoc(collection(db, 'messages'), {
    requestId,
    fromUid,
    toUid,
    participants: [fromUid, toUid],
    text,
    createdAt,
  });
  // Denormalise the last message onto the partner request so the inbox can show a preview,
  // and mark the sender as caught up so their own messages never appear unread to them
  await updateDoc(doc(db, 'partnerRequests', requestId), {
    lastMessageText: text,
    lastMessageAt: createdAt,
    [`readStatus.${fromUid}`]: createdAt,
  });
};

export const subscribeToMessages = (
  requestId: string,
  currentUserUid: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'messages'),
    where('requestId', '==', requestId),
    where('participants', 'array-contains', currentUserUid)
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() } as Message))
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    callback(messages);
  });
};

export const markConversationRead = async (
  requestId: string,
  userUid: string
): Promise<void> => {
  await updateDoc(doc(db, 'partnerRequests', requestId), {
    [`readStatus.${userUid}`]: new Date().toISOString(),
  });
};

export const getFavourites = async (userId: string): Promise<string[]> => {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return [];
  return snap.data()?.favourites || [];
};

export const toggleFavourite = async (userId: string, listingId: string): Promise<string[]> => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  const current: string[] = snap.exists() ? (snap.data()?.favourites || []) : [];
  const updated = current.includes(listingId)
    ? current.filter((id: string) => id !== listingId)
    : [...current, listingId];
  await setDoc(userRef, { favourites: updated }, { merge: true });
  return updated;
};

export const saveProfilePrivacySettings = async (
  userId: string,
  settings: {
    showEmailOnProfile?: boolean;
    showLocationOnProfile?: boolean;
    profilePublic?: boolean;
  }
): Promise<void> => {
  await setDoc(doc(db, 'profiles', userId), settings, { merge: true });
};

// ─── ANNOUNCEMENTS ───────────────────────────────────────────

export const subscribeToAnnouncements = (
  callback: (announcements: any[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'announcements'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const announcements = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(announcements);
  }, (error) => {
    console.error('subscribeToAnnouncements error:', error);
    callback([]);
  });
};

export const createAnnouncement = async (
  title: string,
  message: string,
  adminUid: string
): Promise<void> => {
  await addDoc(collection(db, 'announcements'), {
    title,
    message,
    createdAt: new Date().toISOString(),
    createdBy: adminUid,
  });
};

export const updateAnnouncement = async (
  id: string,
  title: string,
  message: string
): Promise<void> => {
  await updateDoc(doc(db, 'announcements', id), {
    title,
    message,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'announcements', id));
};

export const saveDismissedAnnouncements = async (
  userId: string,
  dismissedIds: string[]
): Promise<void> => {
  await setDoc(doc(db, 'users', userId), { dismissedAnnouncements: dismissedIds }, { merge: true });
};

export const getDismissedAnnouncements = async (
  userId: string
): Promise<string[]> => {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return [];
  return snap.data()?.dismissedAnnouncements || [];
};
