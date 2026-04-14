import { delay, http, HttpResponse } from 'msw';

import { BASE_URL } from '@/shared/libs/constants';

import { getUserFromAuthHeader } from './auth.handlers';
import {
  appendChatMessage,
  createOrGetChatRoom,
  getChatMessagesByRoom,
  getChatRoomsByUser,
} from './data/chatStore';

export const chatHandlers = [
  http.get(`${BASE_URL}/chat/rooms`, async ({ request }) => {
    await delay(250);

    const user = getUserFromAuthHeader(request.headers.get('authorization'));
    if (!user) {
      return HttpResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    return HttpResponse.json({
      rooms: getChatRoomsByUser(user),
    });
  }),

  http.get(`${BASE_URL}/chat/rooms/:roomId/messages`, async ({ params, request }) => {
    await delay(200);

    const user = getUserFromAuthHeader(request.headers.get('authorization'));
    if (!user) {
      return HttpResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const roomId = Number(params.roomId);
    if (!Number.isFinite(roomId)) {
      return HttpResponse.json({ message: '유효하지 않은 채팅방입니다.' }, { status: 400 });
    }

    return HttpResponse.json({
      messages: getChatMessagesByRoom(roomId, user),
    });
  }),

  http.post(`${BASE_URL}/chat/rooms`, async ({ request }) => {
    await delay(300);

    const user = getUserFromAuthHeader(request.headers.get('authorization'));
    if (!user) {
      return HttpResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = (await request.json()) as { itemId?: number; itemType?: 'resale' | 'rental' };

    if (!body.itemId || (body.itemType !== 'resale' && body.itemType !== 'rental')) {
      return HttpResponse.json(
        { message: '채팅방 생성 정보가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const roomId = createOrGetChatRoom(
      {
        itemId: body.itemId,
        itemType: body.itemType,
      },
      user
    );

    return HttpResponse.json({
      roomId,
      message: '채팅방이 준비되었습니다.',
    });
  }),

  http.post(`${BASE_URL}/chat/messages`, async ({ request }) => {
    await delay(120);

    const user = getUserFromAuthHeader(request.headers.get('authorization'));
    if (!user) {
      return HttpResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = (await request.json()) as { roomId?: number; content?: string };

    if (!body.roomId || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return HttpResponse.json({ message: '메시지 내용이 비어 있습니다.' }, { status: 400 });
    }

    return HttpResponse.json(appendChatMessage(body.roomId, user, body.content.trim()));
  }),
];
