import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './config';

export const uploadLogo = async (userId: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `logos/${userId}/logo`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const uploadThumbnail = async (
  userId: string,
  listingId: string,
  file: File
): Promise<string> => {
  const storageRef = ref(storage, `thumbnails/${userId}/${listingId}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const deleteFile = async (url: string): Promise<void> => {
  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
};
