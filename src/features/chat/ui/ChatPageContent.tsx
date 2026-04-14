import { KeyboardEvent } from 'react';

import { ChatMessage, ChatRoom } from '../types/chat';

interface Props {
  chatRooms: ChatRoom[];
  chatMessages: ChatMessage[];
  selectedRoom: ChatRoom | null;
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSelectRoom: (roomId: number) => void;
  handleSendMessage: () => Promise<void>;
  isRoomsLoading: boolean;
  isRoomsError: boolean;
  isRoomsEmpty: boolean;
  isMessagesLoading: boolean;
  isMessagesError: boolean;
  isMessagesEmpty: boolean;
  isSendingMessage: boolean;
  refetchRooms: () => void;
  refetchMessages: () => void;
}

export const ChatPageContent = ({
  chatRooms,
  chatMessages,
  selectedRoom,
  messageInput,
  setMessageInput,
  handleSelectRoom,
  handleSendMessage,
  isRoomsLoading,
  isRoomsError,
  isRoomsEmpty,
  isMessagesLoading,
  isMessagesError,
  isMessagesEmpty,
  isSendingMessage,
  refetchRooms,
  refetchMessages,
}: Props) => {
  const handleMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void handleSendMessage();
  };

  return (
    <div className="w-full max-w-6xl px-4 pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">채팅</h1>
        <p className="mt-2 text-sm text-gray-500">거래 상대와 실시간으로 대화를 이어가세요.</p>
      </div>

      <div className="grid min-h-[720px] w-full grid-cols-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="border-b border-gray-200 bg-gray-50 lg:border-b-0 lg:border-r">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">채팅방 목록</h2>
          </div>

          {isRoomsLoading && (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          )}

          {isRoomsError && (
            <StatePanel
              title="채팅방을 불러오지 못했습니다."
              description="잠시 후 다시 시도해주세요."
              actionLabel="다시 시도"
              onAction={refetchRooms}
            />
          )}

          {isRoomsEmpty && (
            <StatePanel
              title="아직 대화 중인 채팅방이 없습니다."
              description="상품 상세에서 채팅 보내기를 눌러 새 대화를 시작하세요."
            />
          )}

          {!isRoomsLoading && !isRoomsError && !isRoomsEmpty && (
            <ul className="max-h-[720px] overflow-y-auto p-3">
              {chatRooms.map((room) => (
                <li key={room.roomId}>
                  <button
                    type="button"
                    onClick={() => handleSelectRoom(room.roomId)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                      selectedRoom?.roomId === room.roomId
                        ? 'bg-white shadow-sm ring-1 ring-primary-300'
                        : 'hover:bg-white'
                    }`}
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gray-200">
                      {room.itemThumbnailUrl ? (
                        <img
                          src={room.itemThumbnailUrl}
                          alt={room.itemTitle}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                          이미지 없음
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-gray-900">
                          {room.partnerName}
                        </span>
                        <span className="shrink-0 text-xs text-gray-400">
                          {formatChatTime(room.lastMessageAt)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-gray-500">{room.itemTitle}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="truncate text-sm text-gray-600">
                          {room.lastMessage || '대화를 시작해보세요.'}
                        </p>
                        {room.unreadCount > 0 && (
                          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-500 px-2 text-xs font-semibold text-white">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex min-h-[720px] flex-col">
          {!selectedRoom && (
            <StatePanel
              title="선택된 채팅방이 없습니다."
              description="왼쪽 목록에서 대화할 채팅방을 선택해주세요."
            />
          )}

          {selectedRoom && (
            <>
              <header className="flex items-center gap-4 border-b border-gray-200 px-6 py-5">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gray-200">
                  {selectedRoom.itemThumbnailUrl ? (
                    <img
                      src={selectedRoom.itemThumbnailUrl}
                      alt={selectedRoom.itemTitle}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-gray-900">
                    {selectedRoom.partnerName}
                  </h2>
                  <p className="truncate text-sm text-gray-500">{selectedRoom.itemTitle}</p>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50 px-6 py-6">
                {isMessagesLoading && (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-16 animate-pulse rounded-2xl bg-gray-200 ${
                          index % 2 === 0 ? 'mr-20' : 'ml-20'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {isMessagesError && (
                  <StatePanel
                    title="메시지를 불러오지 못했습니다."
                    description="잠시 후 다시 시도해주세요."
                    actionLabel="다시 시도"
                    onAction={refetchMessages}
                  />
                )}

                {isMessagesEmpty && !isMessagesLoading && !isMessagesError && (
                  <StatePanel
                    title="아직 주고받은 메시지가 없습니다."
                    description="첫 메시지를 보내서 거래 대화를 시작해보세요."
                  />
                )}

                {!isMessagesLoading && !isMessagesError && !isMessagesEmpty && (
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.messageId}
                        className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-3xl px-4 py-3 shadow-sm ${
                            message.isMine
                              ? 'rounded-br-md bg-primary-500 text-white'
                              : 'rounded-bl-md bg-white text-gray-900 ring-1 ring-gray-200'
                          }`}
                        >
                          {!message.isMine && (
                            <p className="mb-1 text-xs font-semibold text-gray-500">
                              {message.senderName}
                            </p>
                          )}
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {message.content}
                          </p>
                          <p
                            className={`mt-2 text-right text-xs ${
                              message.isMine ? 'text-white/80' : 'text-gray-400'
                            }`}
                          >
                            {formatChatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 bg-white px-5 py-4">
                <div className="flex items-end gap-3">
                  <textarea
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    onKeyDown={handleMessageKeyDown}
                    placeholder="메시지를 입력하세요."
                    rows={3}
                    className="min-h-[88px] flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      void handleSendMessage();
                    }}
                    disabled={isSendingMessage || messageInput.trim().length === 0}
                    className="h-[88px] rounded-2xl bg-primary-500 px-6 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {isSendingMessage ? '전송 중...' : '보내기'}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

interface StatePanelProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const StatePanel = ({ title, description, actionLabel, onAction }: StatePanelProps) => (
  <div className="flex h-full min-h-[240px] flex-col items-center justify-center px-6 text-center">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-5 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const formatChatTime = (value: string | null) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
