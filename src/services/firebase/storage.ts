// LOGO UPLOAD
export const uploadLogo = async (userId: string, file: File): Promise<string> => {
  // TODO: upload logo to Firebase Storage at path logos/{userId}/logo
  // Return download URL
  throw new Error('Firebase Storage not yet implemented');
};

// THUMBNAIL UPLOAD
export const uploadThumbnail = async (userId: string, listingId: string, file: File): Promise<string> => {
  // TODO: upload thumbnail to Firebase Storage at path thumbnails/{userId}/{listingId}
  // Return download URL
  throw new Error('Firebase Storage not yet implemented');
};

// DELETE FILE
export const deleteFile = async (url: string): Promise<void> => {
  // TODO: delete file from Firebase Storage by download URL
  throw new Error('Firebase Storage not yet implemented');
};
