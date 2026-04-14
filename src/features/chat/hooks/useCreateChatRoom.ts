import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ROUTE_PATH } from '@/app/router/path';

import { chatApi } from '../api/chat.api';
import { chatKeys } from '../queryKeys';
import { ChatItemType, CreateChatRoomRequest } from '../types/chat';

export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChatRoomRequest) => chatApi.createChatRoom(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
};

export const useCreateChatRoomNavigation = () => {
  const navigate = useNavigate();
  const createChatRoomMutation = useCreateChatRoom();

  const handleCreateChatRoom = async (payload: { itemId: number; itemType: ChatItemType }) => {
    const response = await createChatRoomMutation.mutateAsync(payload);
    navigate(`${ROUTE_PATH.CHAT}?roomId=${response.roomId}`);
  };

  return {
    createChatRoom: handleCreateChatRoom,
    isPending: createChatRoomMutation.isPending,
  };
};
