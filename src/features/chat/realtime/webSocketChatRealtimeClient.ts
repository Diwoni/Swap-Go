import { API_CONFIG } from '@/shared/libs/constants';

import { normalizeChatMessage } from '../api/chat.api';
import { ChatCurrentUser, ChatMessage } from '../types/chat';

type MessageListener = (message: ChatMessage) => void;

const buildWebSocketUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_CHAT_WS_URL as string | undefined;
  if (configuredUrl) {
    return configuredUrl;
  }

  const apiBaseUrl = API_CONFIG.BASE_URL ?? '';
  const socketBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '').replace(/^http/, 'ws');

  return `${socketBaseUrl}/ws/chat`;
};

export const createWebSocketChatRealtimeClient = (currentUser?: ChatCurrentUser) => {
  return {
    subscribe(roomId: number, listener: MessageListener) {
      const socket = new WebSocket(buildWebSocketUrl());

      socket.addEventListener('open', () => {
        socket.send(
          JSON.stringify({
            type: 'SUBSCRIBE',
            roomId,
          })
        );
      });

      socket.addEventListener('message', (event) => {
        try {
          const eventData = typeof event.data === 'string' ? event.data : '';
          const rawData = eventData ? (JSON.parse(eventData) as unknown) : null;
          const normalizedMessage = normalizeChatMessage(rawData, currentUser);

          if (normalizedMessage?.roomId !== roomId) {
            return;
          }

          listener(normalizedMessage);
        } catch (error) {
          console.error('채팅 웹소켓 메시지 파싱에 실패했습니다.', error);
        }
      });

      return () => {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close();
        }
      };
    },
  };
};
