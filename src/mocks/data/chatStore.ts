import sampleImg from '@/assets/image.png';
import { mockChatRealtimeChannel } from '@/features/chat/realtime/mockChatRealtimeClient';
import {
  ChatItemType,
  ChatMessage,
  ChatRoom,
  CreateChatRoomRequest,
} from '@/features/chat/types/chat';
import { createMockRentalDetail, createMockResaleDetail } from '@/mocks/data/productDetail';

import { StoredUser } from '../auth.handlers';

interface MockChatUser {
  userId: number;
  email: string;
  username: string;
}

interface MockChatRoomRecord {
  roomId: number;
  itemId: number;
  itemType: ChatItemType;
  itemTitle: string;
  itemThumbnailUrl: string | null;
  participantIds: number[];
}

interface MockChatMessageRecord {
  messageId: number;
  roomId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
}

const DEFAULT_CHAT_USERS: MockChatUser[] = [
  { userId: 1, email: 'test@example.com', username: '테스트유저' },
  { userId: 2, email: 'seller18@example.com', username: 'User18_판매왕' },
  { userId: 3, email: 'seller39@example.com', username: 'User39_판매왕' },
];

let roomSequence = 2;
let messageSequence = 4;

const usersByEmail = new Map<string, MockChatUser>(
  DEFAULT_CHAT_USERS.map((user) => [user.email, user])
);

const usersById = new Map<number, MockChatUser>(
  DEFAULT_CHAT_USERS.map((user) => [user.userId, user])
);

const rooms: MockChatRoomRecord[] = [
  {
    roomId: 1,
    itemId: 18,
    itemType: 'resale',
    itemTitle: createMockResaleDetail(18).title,
    itemThumbnailUrl: createMockResaleDetail(18).images[0] ?? sampleImg,
    participantIds: [1, 2],
  },
  {
    roomId: 2,
    itemId: 39,
    itemType: 'rental',
    itemTitle: createMockRentalDetail(39).title,
    itemThumbnailUrl: createMockRentalDetail(39).images[0] ?? sampleImg,
    participantIds: [1, 3],
  },
];

const messages: MockChatMessageRecord[] = [
  {
    messageId: 1,
    roomId: 1,
    senderId: 2,
    senderName: 'User18_판매왕',
    content: '안녕하세요. 아직 판매 중입니다.',
    createdAt: '2026-04-09T09:30:00.000Z',
  },
  {
    messageId: 2,
    roomId: 1,
    senderId: 1,
    senderName: '테스트유저',
    content: '직거래 가능한 시간대가 있을까요?',
    createdAt: '2026-04-09T09:31:00.000Z',
  },
  {
    messageId: 3,
    roomId: 2,
    senderId: 3,
    senderName: 'User39_판매왕',
    content: '렌탈 기간은 일주일까지 가능합니다.',
    createdAt: '2026-04-09T08:10:00.000Z',
  },
  {
    messageId: 4,
    roomId: 2,
    senderId: 1,
    senderName: '테스트유저',
    content: '보증금은 현장 전달하면 될까요?',
    createdAt: '2026-04-09T08:13:00.000Z',
  },
];

const unreadCountsByRoomId = new Map<number, Map<number, number>>([
  [
    1,
    new Map([
      [1, 1],
      [2, 0],
    ]),
  ],
  [
    2,
    new Map([
      [1, 0],
      [3, 0],
    ]),
  ],
]);

const getOrCreateUser = (user: StoredUser | MockChatUser): MockChatUser => {
  const storedUser = usersByEmail.get(user.email);
  if (storedUser) {
    return storedUser;
  }

  const nextUserId = usersById.size + 1;
  const nextUser: MockChatUser = {
    userId: nextUserId,
    email: user.email,
    username: user.username,
  };

  usersByEmail.set(nextUser.email, nextUser);
  usersById.set(nextUser.userId, nextUser);

  return nextUser;
};

const createSellerUser = (itemId: number, itemType: ChatItemType) => {
  const detail =
    itemType === 'resale' ? createMockResaleDetail(itemId) : createMockRentalDetail(itemId);
  const sellerEmail = `seller-${itemType}-${detail.seller.sellerId}@example.com`;

  return getOrCreateUser({
    email: sellerEmail,
    username: detail.seller.username,
    password: 'password123',
    address: {
      country: 'South Korea',
      region: detail.region,
    },
  });
};

const getRoomMessages = (roomId: number) => {
  return messages
    .filter((message) => message.roomId === roomId)
    .sort((previousMessage, nextMessage) => {
      return (
        new Date(previousMessage.createdAt).getTime() - new Date(nextMessage.createdAt).getTime()
      );
    });
};

const createChatMessage = (message: MockChatMessageRecord, currentUserId: number): ChatMessage => {
  return {
    ...message,
    isMine: message.senderId === currentUserId,
    senderId: message.senderId,
  };
};

const updateUnreadCounts = (roomId: number, senderId: number) => {
  const unreadCounts = unreadCountsByRoomId.get(roomId) ?? new Map<number, number>();
  const room = rooms.find((chatRoom) => chatRoom.roomId === roomId);

  if (!room) {
    return;
  }

  room.participantIds.forEach((participantId) => {
    if (participantId === senderId) {
      unreadCounts.set(participantId, 0);
      return;
    }

    unreadCounts.set(participantId, (unreadCounts.get(participantId) ?? 0) + 1);
  });

  unreadCountsByRoomId.set(roomId, unreadCounts);
};

const markRoomAsRead = (roomId: number, userId: number) => {
  const unreadCounts = unreadCountsByRoomId.get(roomId) ?? new Map<number, number>();
  unreadCounts.set(userId, 0);
  unreadCountsByRoomId.set(roomId, unreadCounts);
};

const createRoomSummary = (room: MockChatRoomRecord, currentUserId: number): ChatRoom => {
  const participants = room.participantIds
    .map((participantId) => usersById.get(participantId))
    .filter(Boolean);
  const partner = participants.find((participant) => participant?.userId !== currentUserId) ?? null;
  const roomMessages = getRoomMessages(room.roomId);
  const latestMessage = roomMessages[roomMessages.length - 1];
  const unreadCount = unreadCountsByRoomId.get(room.roomId)?.get(currentUserId) ?? 0;

  return {
    roomId: room.roomId,
    itemId: room.itemId,
    itemType: room.itemType,
    itemTitle: room.itemTitle,
    itemThumbnailUrl: room.itemThumbnailUrl,
    partnerId: partner?.userId ?? null,
    partnerName: partner?.username ?? '상대방',
    lastMessage: latestMessage?.content ?? '',
    lastMessageAt: latestMessage?.createdAt ?? null,
    unreadCount,
  };
};

export const getChatRoomsByUser = (user: StoredUser) => {
  const currentUser = getOrCreateUser(user);

  return rooms
    .filter((room) => room.participantIds.includes(currentUser.userId))
    .map((room) => createRoomSummary(room, currentUser.userId))
    .sort((previousRoom, nextRoom) => {
      const previousTime = previousRoom.lastMessageAt
        ? new Date(previousRoom.lastMessageAt).getTime()
        : 0;
      const nextTime = nextRoom.lastMessageAt ? new Date(nextRoom.lastMessageAt).getTime() : 0;

      return nextTime - previousTime;
    });
};

export const getChatMessagesByRoom = (roomId: number, user: StoredUser) => {
  const currentUser = getOrCreateUser(user);
  markRoomAsRead(roomId, currentUser.userId);

  return getRoomMessages(roomId).map((message) => createChatMessage(message, currentUser.userId));
};

export const createOrGetChatRoom = (payload: CreateChatRoomRequest, user: StoredUser) => {
  const currentUser = getOrCreateUser(user);
  const seller = createSellerUser(payload.itemId, payload.itemType);
  const existingRoom = rooms.find((room) => {
    const participantIds = [...room.participantIds].sort(
      (previousId, nextId) => previousId - nextId
    );
    const targetParticipantIds = [currentUser.userId, seller.userId].sort(
      (previousId, nextId) => previousId - nextId
    );

    return (
      room.itemId === payload.itemId &&
      room.itemType === payload.itemType &&
      participantIds.join(',') === targetParticipantIds.join(',')
    );
  });

  if (existingRoom) {
    return existingRoom.roomId;
  }

  roomSequence += 1;

  const detail =
    payload.itemType === 'resale'
      ? createMockResaleDetail(payload.itemId)
      : createMockRentalDetail(payload.itemId);

  rooms.unshift({
    roomId: roomSequence,
    itemId: payload.itemId,
    itemType: payload.itemType,
    itemTitle: detail.title,
    itemThumbnailUrl: detail.images[0] ?? sampleImg,
    participantIds: [currentUser.userId, seller.userId],
  });

  unreadCountsByRoomId.set(
    roomSequence,
    new Map([
      [currentUser.userId, 0],
      [seller.userId, 0],
    ])
  );

  return roomSequence;
};

export const appendChatMessage = (
  roomId: number,
  user: StoredUser,
  content: string
): ChatMessage => {
  const currentUser = getOrCreateUser(user);

  messageSequence += 1;

  const nextMessage: MockChatMessageRecord = {
    messageId: messageSequence,
    roomId,
    senderId: currentUser.userId,
    senderName: currentUser.username,
    content,
    createdAt: new Date().toISOString(),
  };

  messages.push(nextMessage);
  updateUnreadCounts(roomId, currentUser.userId);

  const normalizedMessage = createChatMessage(nextMessage, currentUser.userId);
  mockChatRealtimeChannel.emit(normalizedMessage);

  return normalizedMessage;
};

export const resetChatStore = () => {
  while (rooms.length > 2) {
    rooms.pop();
  }

  while (messages.length > 4) {
    messages.pop();
  }

  roomSequence = 2;
  messageSequence = 4;
  unreadCountsByRoomId.clear();
  unreadCountsByRoomId.set(
    1,
    new Map([
      [1, 1],
      [2, 0],
    ])
  );
  unreadCountsByRoomId.set(
    2,
    new Map([
      [1, 0],
      [3, 0],
    ])
  );
};
