import { useChatPage } from '@/features/chat/hooks/useChatPage';
import { ChatPageContent } from '@/features/chat/ui/ChatPageContent';

const ChatPage = () => {
  const {
    chatRooms,
    chatMessages,
    selectedRoom,
    messageInput,
    setMessageInput,
    handleSelectRoom,
    handleSendMessage,
    isRoomsLoading,
    isRoomsError,
    refetchRooms,
    isRoomsEmpty,
    isMessagesLoading,
    isMessagesError,
    refetchMessages,
    isMessagesEmpty,
    isSendingMessage,
  } = useChatPage();

  return (
    <ChatPageContent
      chatRooms={chatRooms}
      chatMessages={chatMessages}
      selectedRoom={selectedRoom}
      messageInput={messageInput}
      setMessageInput={setMessageInput}
      handleSelectRoom={handleSelectRoom}
      handleSendMessage={handleSendMessage}
      isRoomsLoading={isRoomsLoading}
      isRoomsError={isRoomsError}
      isRoomsEmpty={isRoomsEmpty}
      isMessagesLoading={isMessagesLoading}
      isMessagesError={isMessagesError}
      isMessagesEmpty={isMessagesEmpty}
      isSendingMessage={isSendingMessage}
      refetchRooms={() => {
        void refetchRooms();
      }}
      refetchMessages={() => {
        void refetchMessages();
      }}
    />
  );
};

export default ChatPage;
