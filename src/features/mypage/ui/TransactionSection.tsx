import { useState } from 'react';

import { Modal } from '@/shared/ui';
import { formatDate, formatPrice } from '@/shared/utils';

import {
  useBuyerTransactions,
  useRequestEarlyReturn,
  useSellerTransactions,
  useUpdateEarlyReturn,
} from '../hooks/useTransactions';
import { Transaction } from '../types/mypage.types';

const TransactionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-xl p-4 flex gap-4">{children}</div>
);

const TransactionThumbnail = ({ url, title }: { url: string; title: string }) => (
  <img src={url} alt={title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
);

const TransactionInfo = ({ transaction }: { transaction: Transaction }) => (
  <div className="flex flex-col gap-1 text-sm">
    <span className="font-semibold">{transaction.itemTitle}</span>
    <span className="text-gray-500">{formatPrice(transaction.itemPrice)}원</span>
    {transaction.startAt && transaction.endAt && (
      <span className="text-gray-400 text-xs">
        {formatDate(transaction.startAt)} ~ {formatDate(transaction.endAt)}
      </span>
    )}
    <span className="text-gray-400 text-xs">{transaction.itemLocation}</span>
  </div>
);

const BuyerActiveRentalCard = ({ transaction }: { transaction: Transaction }) => {
  const requestEarlyReturn = useRequestEarlyReturn();
  const updateEarlyReturn = useUpdateEarlyReturn();
  const [isEarlyReturnModalOpen, setIsEarlyReturnModalOpen] = useState(false);
  const [newEndAt, setNewEndAt] = useState('');

  const handleRequestEarlyReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEndAt) return;
    requestEarlyReturn.mutate(
      { transactionId: transaction.transactionId, data: { newEndAt: `${newEndAt}T10:00:00` } },
      { onSuccess: () => setIsEarlyReturnModalOpen(false) }
    );
  };

  const handleCancelEarlyReturn = () => {
    updateEarlyReturn.mutate({
      transactionId: transaction.transactionId,
      data: { status: 'CANCELED' },
    });
  };

  return (
    <>
      <TransactionCard>
        <TransactionThumbnail url={transaction.itemThumbnailUrl} title={transaction.itemTitle} />
        <div className="flex flex-1 justify-between items-start">
          <TransactionInfo transaction={transaction} />
          <div className="shrink-0">
            {transaction.earlyReturnStatus === 'NONE' && (
              <button
                onClick={() => setIsEarlyReturnModalOpen(true)}
                className="px-3 py-1.5 text-xs rounded-lg border border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                조기 반납 신청
              </button>
            )}
            {transaction.earlyReturnStatus === 'PENDING' && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-yellow-600 font-medium">조기 반납 요청중</span>
                <button
                  onClick={handleCancelEarlyReturn}
                  disabled={updateEarlyReturn.isPending}
                  className="px-3 py-1 text-xs rounded-lg border text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                >
                  요청 취소
                </button>
              </div>
            )}
            {transaction.earlyReturnStatus === 'ACCEPTED' && (
              <span className="text-xs text-green-600 font-medium">조기 반납 수락됨</span>
            )}
            {transaction.earlyReturnStatus === 'REJECTED' && (
              <span className="text-xs text-red-500 font-medium">조기 반납 거절됨</span>
            )}
          </div>
        </div>
      </TransactionCard>

      <Modal
        isModalOpen={isEarlyReturnModalOpen}
        closeModal={() => setIsEarlyReturnModalOpen(false)}
        className="w-full max-w-sm p-6"
      >
        <h2 className="text-base font-semibold mb-4">조기 반납 신청</h2>
        <form onSubmit={handleRequestEarlyReturn} className="space-y-4">
          <div>
            <label htmlFor="early-return-date" className="block text-sm text-gray-600 mb-1">
              반납 희망일
            </label>
            <input
              id="early-return-date"
              type="date"
              value={newEndAt}
              onChange={(e) => setNewEndAt(e.target.value)}
              min={formatDate(new Date().toISOString())}
              max={transaction.endAt ? formatDate(transaction.endAt) : undefined}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEarlyReturnModalOpen(false)}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={requestEarlyReturn.isPending}
              className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              신청
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const SellerActiveRentalCard = ({ transaction }: { transaction: Transaction }) => {
  const updateEarlyReturn = useUpdateEarlyReturn();

  const handleAccept = () => {
    updateEarlyReturn.mutate({
      transactionId: transaction.transactionId,
      data: { status: 'ACCEPTED' },
    });
  };

  const handleReject = () => {
    updateEarlyReturn.mutate({
      transactionId: transaction.transactionId,
      data: { status: 'REJECTED' },
    });
  };

  return (
    <TransactionCard>
      <TransactionThumbnail url={transaction.itemThumbnailUrl} title={transaction.itemTitle} />
      <div className="flex flex-1 justify-between items-start">
        <div className="space-y-1">
          <TransactionInfo transaction={transaction} />
          <span className="text-xs text-gray-400">구매자: {transaction.buyerName}</span>
        </div>
        <div className="shrink-0">
          {transaction.earlyReturnStatus === 'PENDING' && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-yellow-600 font-medium">조기 반납 요청 수신</span>
              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  disabled={updateEarlyReturn.isPending}
                  className="px-3 py-1 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  수락
                </button>
                <button
                  onClick={handleReject}
                  disabled={updateEarlyReturn.isPending}
                  className="px-3 py-1 text-xs rounded-lg border border-red-300 text-red-500 hover:bg-red-50 disabled:opacity-50"
                >
                  거절
                </button>
              </div>
            </div>
          )}
          {transaction.earlyReturnStatus === 'ACCEPTED' && (
            <span className="text-xs text-green-600 font-medium">조기 반납 수락됨</span>
          )}
          {transaction.earlyReturnStatus === 'REJECTED' && (
            <span className="text-xs text-red-500 font-medium">조기 반납 거절됨</span>
          )}
          {(transaction.earlyReturnStatus === 'NONE' || transaction.earlyReturnStatus === null) && (
            <span className="text-xs text-gray-400">대여중</span>
          )}
        </div>
      </div>
    </TransactionCard>
  );
};

const CompletedTransactionCard = ({ transaction }: { transaction: Transaction }) => (
  <TransactionCard>
    <TransactionThumbnail url={transaction.itemThumbnailUrl} title={transaction.itemTitle} />
    <div className="flex flex-1 justify-between items-start">
      <TransactionInfo transaction={transaction} />
      <span className="text-xs text-gray-400">
        {transaction.itemType === 'rental' ? '단기렌탈' : '중고거래'}
      </span>
    </div>
  </TransactionCard>
);

const ActiveRentalsSection = () => {
  const { activeRentals: buyerActiveRentals, isLoading: isBuyerLoading } = useBuyerTransactions();
  const { activeRentals: sellerActiveRentals, isLoading: isSellerLoading } =
    useSellerTransactions();

  const isLoading = isBuyerLoading || isSellerLoading;

  if (isLoading) {
    return <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">내가 빌리고 있는</h3>
        {buyerActiveRentals.length === 0 ? (
          <p className="text-sm text-gray-400">대여중인 상품이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {buyerActiveRentals.map((t) => (
              <BuyerActiveRentalCard key={t.transactionId} transaction={t} />
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">내가 빌려주고 있는</h3>
        {sellerActiveRentals.length === 0 ? (
          <p className="text-sm text-gray-400">빌려주고 있는 상품이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {sellerActiveRentals.map((t) => (
              <SellerActiveRentalCard key={t.transactionId} transaction={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CompletedTransactionsSection = () => {
  const { completedTransactions: buyerCompleted, isLoading: isBuyerLoading } =
    useBuyerTransactions();
  const { completedTransactions: sellerCompleted, isLoading: isSellerLoading } =
    useSellerTransactions();

  const isLoading = isBuyerLoading || isSellerLoading;

  if (isLoading) {
    return <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">구매 내역</h3>
        {buyerCompleted.length === 0 ? (
          <p className="text-sm text-gray-400">구매 내역이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {buyerCompleted.map((t) => (
              <CompletedTransactionCard key={t.transactionId} transaction={t} />
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">판매 내역</h3>
        {sellerCompleted.length === 0 ? (
          <p className="text-sm text-gray-400">판매 내역이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {sellerCompleted.map((t) => (
              <CompletedTransactionCard key={t.transactionId} transaction={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const TransactionSection = () => {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="font-semibold text-base mb-4">현재 대여중인 상품</h2>
        <ActiveRentalsSection />
      </div>
      <div>
        <h2 className="font-semibold text-base mb-4">거래 완료 내역</h2>
        <CompletedTransactionsSection />
      </div>
    </section>
  );
};
