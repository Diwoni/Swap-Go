import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks';

import { chatApi } from '../api/chat.api';
import { chatKeys } from '../queryKeys';
import { createChatRealtimeClient } from '../realtime/chatRealtimeClient';
import { ChatMessage, ChatRoom } from '../types/chat';

const upsertChatMessage = (messages: ChatMessage[], nextMessage: ChatMessage): ChatMessage[] => {
  const hasSameMessage = messages.some((message) => message.messageId === nextMessage.messageId);

  if (hasSameMessage) {
    return messages.map((message) =>
      message.messageId === nextMessage.messageId ? nextMessage : message
    );
  }

  return [...messages, nextMessage].sort(
    (previousMessage, nextMessageItem) =>
      new Date(previousMessage.createdAt).getTime() - new Date(nextMessageItem.createdAt).getTime()
  );
};

const updateRoomSummary = (rooms: ChatRoom[], nextMessage: ChatMessage): ChatRoom[] => {
  return rooms
    .map((room) => {
      if (room.roomId !== nextMessage.roomId) {
        return room;
      }

      return {
        ...room,
        lastMessage: nextMessage.content,
        lastMessageAt: nextMessage.createdAt,
        unreadCount: nextMessage.isMine ? room.unreadCount : room.unreadCount + 1,
      };
    })
    .sort((previousRoom, nextRoom) => {
      const previousTime = previousRoom.lastMessageAt
        ? new Date(previousRoom.lastMessageAt).getTime()
        : 0;
      const nextTime = nextRoom.lastMessageAt ? new Date(nextRoom.lastMessageAt).getTime() : 0;

      return nextTime - previousTime;
    });
};

export const useChatPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messageInput, setMessageInput] = useState('');

  const currentUser = useMemo(
    () => ({
      email: user?.email,
      username: user?.username,
    }),
    [user?.email, user?.username]
  );

  const {
    data: chatRoomsResponse,
    isLoading: isRoomsLoading,
    isError: isRoomsError,
    error: roomsError,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: () => chatApi.getChatRooms(),
  });

  const chatRooms = useMemo(() => chatRoomsResponse?.rooms ?? [], [chatRoomsResponse?.rooms]);
  const requestedRoomId = Number(searchParams.get('roomId'));
  const activeRoomId =
    Number.isFinite(requestedRoomId) && requestedRoomId > 0 ? requestedRoomId : null;

  useEffect(() => {
    if (chatRooms.length === 0) {
      return;
    }

    const hasRequestedRoom =
      activeRoomId !== null && chatRooms.some((room) => room.roomId === activeRoomId);

    if (hasRequestedRoom) {
      return;
    }

    const firstRoom = chatRooms[0];
    if (!firstRoom) {
      return;
    }

    setSearchParams({ roomId: String(firstRoom.roomId) }, { replace: true });
  }, [activeRoomId, chatRooms, setSearchParams]);

  const selectedRoom = useMemo(() => {
    if (activeRoomId === null) {
      return null;
    }

    return chatRooms.find((room) => room.roomId === activeRoomId) ?? null;
  }, [activeRoomId, chatRooms]);

  const {
    data: chatMessagesResponse,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: activeRoomId ? chatKeys.messageList(activeRoomId) : chatKeys.messages(),
    queryFn: () => {
      if (activeRoomId === null) {
        return Promise.resolve({ messages: [] });
      }

      return chatApi.getChatMessages(activeRoomId, currentUser);
    },
    enabled: activeRoomId !== null,
  });

  const chatMessages = useMemo(
    () => chatMessagesResponse?.messages ?? [],
    [chatMessagesResponse?.messages]
  );

  useEffect(() => {
    if (activeRoomId === null) {
      return;
    }

    const realtimeClient = createChatRealtimeClient(currentUser);
    const unsubscribe = realtimeClient.subscribe(activeRoomId, (incomingMessage) => {
      queryClient.setQueryData(
        chatKeys.messageList(activeRoomId),
        (previousData: { messages: ChatMessage[] } | undefined) => ({
          messages: upsertChatMessage(previousData?.messages ?? [], incomingMessage),
        })
      );

      queryClient.setQueryData(
        chatKeys.rooms(),
        (previousData: { rooms: ChatRoom[] } | undefined) => ({
          rooms: updateRoomSummary(previousData?.rooms ?? [], incomingMessage),
        })
      );
    });

    return unsubscribe;
  }, [activeRoomId, currentUser, queryClient]);

  const sendChatMessageMutation = useMutation({
    mutationFn: ({ roomId, content }: { roomId: number; content: string }) =>
      chatApi.sendChatMessage({ roomId, content }, currentUser),
    onSuccess: ({ message }) => {
      queryClient.setQueryData(
        chatKeys.messageList(message.roomId),
        (previousData: { messages: ChatMessage[] } | undefined) => ({
          messages: upsertChatMessage(previousData?.messages ?? [], message),
        })
      );

      queryClient.setQueryData(
        chatKeys.rooms(),
        (previousData: { rooms: ChatRoom[] } | undefined) => ({
          rooms: updateRoomSummary(previousData?.rooms ?? [], message),
        })
      );
      setMessageInput('');
    },
  });

  const handleSelectRoom = (roomId: number) => {
    setSearchParams({ roomId: String(roomId) });
  };

  const handleSendMessage = async () => {
    if (activeRoomId === null) {
      return;
    }

    const normalizedMessage = messageInput.trim();
    if (!normalizedMessage) {
      return;
    }

    await sendChatMessageMutation.mutateAsync({
      roomId: activeRoomId,
      content: normalizedMessage,
    });
  };

  return {
    chatRooms,
    chatMessages,
    selectedRoom,
    messageInput,
    setMessageInput,
    handleSelectRoom,
    handleSendMessage,
    isRoomsLoading,
    isRoomsError,
    roomsError,
    refetchRooms: () => {
      void refetchRooms();
    },
    isRoomsEmpty: !isRoomsLoading && chatRooms.length === 0,
    isMessagesLoading,
    isMessagesError,
    messagesError,
    refetchMessages: () => {
      void refetchMessages();
    },
    isMessagesEmpty: !isMessagesLoading && chatMessages.length === 0,
    isSendingMessage: sendChatMessageMutation.isPending,
  };
};
