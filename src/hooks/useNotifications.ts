import { useState, useEffect } from 'react';
import { PartnerRequest } from '../types/partnerRequest';
import { Listing } from '../types';
import {
  getIncomingRequests,
  getSentRequests,
  subscribeToAnnouncements,
  getDismissedAnnouncements,
  getUserSettings,
} from '../services/firebase/firestore';

export const useNotifications = (
  currentUserUid: string | null,
  isAdmin: boolean,
  listings: Listing[]
) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [incomingRequests, setIncomingRequests] = useState<PartnerRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<PartnerRequest[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUserUid) return;
    getUserSettings(currentUserUid).then((settings) => {
      setNotificationsEnabled(settings.inAppNotifications);
    });
  }, [currentUserUid]);

  useEffect(() => {
    if (!currentUserUid || !notificationsEnabled) return;
    Promise.all([getIncomingRequests(currentUserUid), getSentRequests(currentUserUid)]).then(
      ([incoming, sent]) => {
        setIncomingRequests(incoming);
        setSentRequests(sent);
      }
    );
  }, [currentUserUid, notificationsEnabled]);

  useEffect(() => {
    if (!notificationsEnabled) return;
    const unsubscribe = subscribeToAnnouncements((data) => setAnnouncements(data));
    return () => unsubscribe();
  }, [notificationsEnabled]);

  useEffect(() => {
    if (!currentUserUid || !notificationsEnabled) return;
    getDismissedAnnouncements(currentUserUid).then(setDismissedIds);
  }, [currentUserUid, notificationsEnabled]);

  const conversations = [...incomingRequests, ...sentRequests]
    .filter((r) => r.status === 'accepted')
    .filter((r, idx, arr) => arr.findIndex((x) => x.id === r.id) === idx);

  const isConversationUnread = (req: PartnerRequest): boolean => {
    if (!req.lastMessageAt || !currentUserUid) return false;
    const myLastRead = req.readStatus?.[currentUserUid];
    return !myLastRead || req.lastMessageAt > myLastRead;
  };

  const unreadConversations = notificationsEnabled ? conversations.filter(isConversationUnread) : [];
  const pendingIncomingRequests = notificationsEnabled ? incomingRequests.filter((r) => r.status === 'pending') : [];
  const visibleAnnouncements = notificationsEnabled ? announcements.filter((a: any) => !dismissedIds.includes(a.id)) : [];
  const pendingListings = notificationsEnabled && isAdmin ? listings.filter((l) => l.status === 'pending') : [];

  const unreadMessagesCount = unreadConversations.length;
  const pendingRequestsCount = pendingIncomingRequests.length;
  const unreadAnnouncementsCount = visibleAnnouncements.length;
  const pendingListingsCount = pendingListings.length;

  const totalCount = unreadMessagesCount + pendingRequestsCount + unreadAnnouncementsCount + pendingListingsCount;

  return {
    unreadMessagesCount,
    pendingRequestsCount,
    unreadAnnouncementsCount,
    pendingListingsCount,
    totalCount,
    unreadConversations,
    pendingIncomingRequests,
    visibleAnnouncements,
    pendingListings,
  };
};
