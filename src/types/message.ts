export interface Message {
  id: string;
  requestId: string;
  fromUid: string;
  toUid: string;
  participants: string[];
  text: string;
  createdAt: string;
}
