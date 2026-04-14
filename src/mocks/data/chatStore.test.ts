import { beforeEach, describe, expect, it } from 'vitest';

import { StoredUser } from '../auth.handlers';
import {
  appendChatMessage,
  createOrGetChatRoom,
  getChatMessagesByRoom,
  getChatRoomsByUser,
  resetChatStore,
} from './chatStore';

const currentUser: StoredUser = {
  email: 'test@example.com',
  password: 'password123',
  username: '테스트유저',
  address: {
    country: 'South Korea',
    region: 'Seoul',
  },
};

describe('chatStore', () => {
  beforeEach(() => {
    resetChatStore();
  });

  it('같은 상품으로 채팅방을 다시 생성하면 기존 채팅방을 재사용한다', () => {
    const firstRoomId = createOrGetChatRoom({ itemId: 18, itemType: 'resale' }, currentUser);
    const secondRoomId = createOrGetChatRoom({ itemId: 18, itemType: 'resale' }, currentUser);

    expect(firstRoomId).toBe(secondRoomId);
  });

  it('메시지를 보내면 채팅방 마지막 메시지와 메시지 목록이 함께 갱신된다', () => {
    const roomId = createOrGetChatRoom({ itemId: 39, itemType: 'rental' }, currentUser);

    const sentMessage = appendChatMessage(roomId, currentUser, '지금 바로 거래 가능할까요?');
    const rooms = getChatRoomsByUser(currentUser);
    const messages = getChatMessagesByRoom(roomId, currentUser);
    const targetRoom = rooms.find((room) => room.roomId === roomId);

    expect(sentMessage.content).toBe('지금 바로 거래 가능할까요?');
    expect(targetRoom?.lastMessage).toBe('지금 바로 거래 가능할까요?');
    expect(messages[messages.length - 1]?.content).toBe('지금 바로 거래 가능할까요?');
  });
});
