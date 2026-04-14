export type ChatItemType = 'resale' | 'rental';

export interface ChatRoom {
  roomId: number;
  itemId: number | null;
  itemType: ChatItemType | null;
  itemTitle: string;
  itemThumbnailUrl: string | null;
  partnerId: number | null;
  partnerName: string;
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ChatMessage {
  messageId: number;
  roomId: number;
  senderId: number | null;
  senderName: string;
  content: string;
  createdAt: string;
  isMine: boolean;
}

export interface ChatRoomsResponse {
  rooms: ChatRoom[];
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
}

export interface CreateChatRoomRequest {
  itemId: number;
  itemType: ChatItemType;
}

export interface CreateChatRoomResponse {
  roomId: number;
  message: string;
}

export interface SendChatMessageRequest {
  roomId: number;
  content: string;
}

export interface SendChatMessageResponse {
  message: ChatMessage;
}

export interface ChatCurrentUser {
  email?: string;
  username?: string;
}
