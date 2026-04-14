import { ChatCurrentUser } from '../types/chat';
import { createMockChatRealtimeClient } from './mockChatRealtimeClient';
import { createWebSocketChatRealtimeClient } from './webSocketChatRealtimeClient';

export const createChatRealtimeClient = (currentUser?: ChatCurrentUser) => {
  const useMockSocket = import.meta.env.DEV && import.meta.env.VITE_USE_MSW !== 'false';

  if (useMockSocket) {
    return createMockChatRealtimeClient(currentUser);
  }

  return createWebSocketChatRealtimeClient(currentUser);
};
