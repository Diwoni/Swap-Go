export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  messages: () => [...chatKeys.all, 'messages'] as const,
  messageList: (roomId: number) => [...chatKeys.messages(), roomId] as const,
} as const;
