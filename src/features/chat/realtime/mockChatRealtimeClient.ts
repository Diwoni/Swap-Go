import { ChatCurrentUser, ChatMessage } from '../types/chat';

type MessageListener = (message: ChatMessage) => void;

class MockChatRealtimeChannel {
  private eventTarget = new EventTarget();

  subscribe(listener: MessageListener): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ChatMessage>;
      listener(customEvent.detail);
    };

    this.eventTarget.addEventListener('message', handler);

    return () => {
      this.eventTarget.removeEventListener('message', handler);
    };
  }

  emit(message: ChatMessage): void {
    this.eventTarget.dispatchEvent(new CustomEvent('message', { detail: message }));
  }
}

export const mockChatRealtimeChannel = new MockChatRealtimeChannel();

export const createMockChatRealtimeClient = (_currentUser?: ChatCurrentUser) => {
  return {
    subscribe(roomId: number, listener: MessageListener) {
      return mockChatRealtimeChannel.subscribe((message) => {
        if (message.roomId !== roomId) {
          return;
        }

        listener(message);
      });
    },
  };
};
