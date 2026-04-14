import { api } from '@/shared/utils';

import {
  ChatCurrentUser,
  ChatItemType,
  ChatMessage,
  ChatMessagesResponse,
  ChatRoom,
  ChatRoomsResponse,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from '../types/chat';

const CHAT_ROOMS_ENDPOINT = '/chat/rooms';
const CHAT_MESSAGES_ENDPOINT = '/chat/messages';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === 'object' && value !== null;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsedNumber = Number(value);
    return Number.isFinite(parsedNumber) ? parsedNumber : null;
  }

  return null;
};

const toStringValue = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  }

  return null;
};

const toItemType = (value: unknown): ChatItemType | null => {
  return value === 'resale' || value === 'rental' ? value : null;
};

const getNestedRecord = (source: UnknownRecord, key: string): UnknownRecord | null => {
  const value = source[key];
  return isRecord(value) ? value : null;
};

const getStringByKeys = (source: UnknownRecord, keys: string[]): string | null => {
  return keys.map((key) => toStringValue(source[key])).find((value) => value !== null) ?? null;
};

const getNumberByKeys = (source: UnknownRecord, keys: string[]): number | null => {
  return keys.map((key) => toNumber(source[key])).find((value) => value !== null) ?? null;
};

const getArrayFromResponse = (response: unknown, keys: string[]): unknown[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isRecord(response)) {
    return [];
  }

  for (const key of keys) {
    const value = response[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

const isCurrentUsersMessage = (record: UnknownRecord, currentUser?: ChatCurrentUser): boolean => {
  const rawIsMine = record.isMine;
  if (typeof rawIsMine === 'boolean') {
    return rawIsMine;
  }

  const sender = getNestedRecord(record, 'sender');
  const senderName =
    getStringByKeys(record, ['senderName', 'nickname', 'username']) ??
    (sender ? getStringByKeys(sender, ['username', 'nickname', 'name']) : null);
  const senderEmail =
    getStringByKeys(record, ['senderEmail', 'email']) ??
    (sender ? getStringByKeys(sender, ['email']) : null);

  if (currentUser?.email && senderEmail) {
    return currentUser.email === senderEmail;
  }

  if (currentUser?.username && senderName) {
    return currentUser.username === senderName;
  }

  return false;
};

const normalizeChatRoom = (rawRoom: unknown): ChatRoom | null => {
  if (!isRecord(rawRoom)) {
    return null;
  }

  const item = getNestedRecord(rawRoom, 'item');
  const partner = getNestedRecord(rawRoom, 'partner');
  const participant = getNestedRecord(rawRoom, 'participant');

  const roomId = getNumberByKeys(rawRoom, ['roomId', 'chatRoomId', 'id']);

  if (roomId === null) {
    return null;
  }

  return {
    roomId,
    itemId:
      getNumberByKeys(rawRoom, ['itemId']) ??
      (item ? getNumberByKeys(item, ['itemId', 'id']) : null),
    itemType:
      toItemType(rawRoom.itemType) ?? (item ? toItemType(item.itemType ?? item.type) : null),
    itemTitle:
      getStringByKeys(rawRoom, ['itemTitle', 'title']) ??
      (item ? getStringByKeys(item, ['title', 'itemTitle', 'name']) : null) ??
      '상품 정보 없음',
    itemThumbnailUrl:
      getStringByKeys(rawRoom, ['itemThumbnailUrl', 'thumbnailUrl']) ??
      (item ? getStringByKeys(item, ['thumbnailUrl', 'imageUrl']) : null),
    partnerId:
      getNumberByKeys(rawRoom, ['partnerId']) ??
      (partner ? getNumberByKeys(partner, ['id', 'userId', 'partnerId']) : null) ??
      (participant ? getNumberByKeys(participant, ['id', 'userId']) : null),
    partnerName:
      getStringByKeys(rawRoom, ['partnerName']) ??
      (partner ? getStringByKeys(partner, ['username', 'nickname', 'name']) : null) ??
      (participant ? getStringByKeys(participant, ['username', 'nickname', 'name']) : null) ??
      '상대방',
    lastMessage: getStringByKeys(rawRoom, ['lastMessage', 'message', 'lastChat']) ?? '',
    lastMessageAt:
      getStringByKeys(rawRoom, ['lastMessageAt', 'updatedAt', 'createdAt', 'lastSentAt']) ?? null,
    unreadCount: getNumberByKeys(rawRoom, ['unreadCount', 'unreadMessageCount']) ?? 0,
  };
};

export const normalizeChatMessage = (
  rawMessage: unknown,
  currentUser?: ChatCurrentUser
): ChatMessage | null => {
  if (!isRecord(rawMessage)) {
    return null;
  }

  const sender = getNestedRecord(rawMessage, 'sender');
  const room = getNestedRecord(rawMessage, 'room');

  const messageId = getNumberByKeys(rawMessage, ['messageId', 'chatMessageId', 'id']);
  const roomId =
    getNumberByKeys(rawMessage, ['roomId']) ??
    (room ? getNumberByKeys(room, ['roomId', 'id']) : null);

  if (messageId === null || roomId === null) {
    return null;
  }

  return {
    messageId,
    roomId,
    senderId:
      getNumberByKeys(rawMessage, ['senderId', 'userId']) ??
      (sender ? getNumberByKeys(sender, ['id', 'userId']) : null),
    senderName:
      getStringByKeys(rawMessage, ['senderName', 'nickname', 'username']) ??
      (sender ? getStringByKeys(sender, ['username', 'nickname', 'name']) : null) ??
      '알 수 없음',
    content: getStringByKeys(rawMessage, ['content', 'message', 'text']) ?? '',
    createdAt:
      getStringByKeys(rawMessage, ['createdAt', 'sentAt', 'timestamp']) ?? new Date().toISOString(),
    isMine: isCurrentUsersMessage(rawMessage, currentUser),
  };
};

export const chatApi = {
  async getChatRooms(): Promise<ChatRoomsResponse> {
    const response = await api.get(CHAT_ROOMS_ENDPOINT);
    const rooms = getArrayFromResponse(response.data, ['rooms', 'chatRooms', 'items'])
      .map(normalizeChatRoom)
      .filter((room): room is ChatRoom => room !== null);

    return { rooms };
  },

  async getChatMessages(
    roomId: number,
    currentUser?: ChatCurrentUser
  ): Promise<ChatMessagesResponse> {
    const response = await api.get(`${CHAT_ROOMS_ENDPOINT}/${roomId}/messages`);
    const messages = getArrayFromResponse(response.data, [
      'messages',
      'chatMessages',
      'items',
      'content',
    ])
      .map((rawMessage) => normalizeChatMessage(rawMessage, currentUser))
      .filter((message): message is ChatMessage => message !== null);

    return { messages };
  },

  async createChatRoom(payload: CreateChatRoomRequest): Promise<CreateChatRoomResponse> {
    const response = await api.post(CHAT_ROOMS_ENDPOINT, payload);
    const responseData = isRecord(response.data) ? response.data : {};
    const roomId = getNumberByKeys(responseData, ['roomId', 'chatRoomId', 'id']);

    if (roomId === null) {
      throw new Error('채팅방 생성 응답이 올바르지 않습니다.');
    }

    return {
      roomId,
      message: getStringByKeys(responseData, ['message']) ?? '채팅방이 생성되었습니다.',
    };
  },

  async sendChatMessage(
    payload: SendChatMessageRequest,
    currentUser?: ChatCurrentUser
  ): Promise<SendChatMessageResponse> {
    const response = await api.post(CHAT_MESSAGES_ENDPOINT, payload);
    const normalizedMessage = normalizeChatMessage(response.data, currentUser);

    if (!normalizedMessage) {
      throw new Error('메시지 전송 응답이 올바르지 않습니다.');
    }

    return {
      message: normalizedMessage,
    };
  },
};
