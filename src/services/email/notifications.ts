// Email notification service
// Will use Firebase Cloud Functions or a backend email service

export const sendApprovalNotification = async (
  email: string,
  organisationName: string,
  listingId: string
): Promise<void> => {
  // TODO: trigger email when admin approves a listing
  throw new Error('Email notifications not yet implemented');
};

export const sendMessageNotification = async (
  email: string,
  senderName: string,
  messagePreview: string
): Promise<void> => {
  // TODO: trigger email when user receives a new internal message
  throw new Error('Email notifications not yet implemented');
};
