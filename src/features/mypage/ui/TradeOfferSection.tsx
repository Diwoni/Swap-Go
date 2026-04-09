import { formatDate } from '@/shared/utils';

import {
  useReceivedTradeOffers,
  useSentTradeOffers,
  useUpdateTradeOffer,
} from '../hooks/useTradeOffers';
import { TradeOffer } from '../types/mypage.types';

const ITEM_TYPE_LABEL: Record<string, string> = {
  rental: '대여',
  resale: '중고거래',
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기중',
  ACCEPTED: '수락',
  REJECTED: '거절',
  CANCELED: '취소',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-yellow-600',
  ACCEPTED: 'text-green-600',
  REJECTED: 'text-red-500',
  CANCELED: 'text-gray-400',
};

const TradeOfferDateRange = ({ offer }: { offer: TradeOffer }) => {
  if (!offer.startAt || !offer.endAt) return <span>-</span>;
  return (
    <span>
      {formatDate(offer.startAt)} ~ {formatDate(offer.endAt)}
    </span>
  );
};

const ReceivedTradeOffersTable = () => {
  const { tradeOffers, isLoading, isEmpty } = useReceivedTradeOffers();
  const updateTradeOffer = useUpdateTradeOffer();

  const handleAccept = (tradeOfferId: number) => {
    updateTradeOffer.mutate({ tradeOfferId, data: { status: 'ACCEPTED' } });
  };

  const handleReject = (tradeOfferId: number) => {
    updateTradeOffer.mutate({ tradeOfferId, data: { status: 'REJECTED' } });
  };

  if (isLoading) {
    return <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />;
  }

  if (isEmpty) {
    return <p className="text-sm text-gray-400 py-4">받은 거래 요청이 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium">상품명</th>
            <th className="px-4 py-3 text-left font-medium">거래 타입</th>
            <th className="px-4 py-3 text-left font-medium">거래 요청 내용</th>
            <th className="px-4 py-3 text-left font-medium">요청 보낸 사람</th>
            <th className="px-4 py-3 text-left font-medium">요청 보낸 날짜</th>
            <th className="px-4 py-3 text-left font-medium">처리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tradeOffers.map((offer) => (
            <tr key={offer.tradeOfferId} className="hover:bg-gray-50">
              <td className="px-4 py-3">{offer.itemTitle}</td>
              <td className="px-4 py-3">{ITEM_TYPE_LABEL[offer.itemType] ?? offer.itemType}</td>
              <td className="px-4 py-3">
                <TradeOfferDateRange offer={offer} />
              </td>
              <td className="px-4 py-3">{offer.requesterName}</td>
              <td className="px-4 py-3">{formatDate(offer.createdAt)}</td>
              <td className="px-4 py-3">
                {offer.status === 'PENDING' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(offer.tradeOfferId)}
                      disabled={updateTradeOffer.isPending}
                      className="px-3 py-1 text-xs rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => handleReject(offer.tradeOfferId)}
                      disabled={updateTradeOffer.isPending}
                      className="px-3 py-1 text-xs rounded-lg border border-red-300 text-red-500 hover:bg-red-50 disabled:opacity-50"
                    >
                      거절
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-medium ${STATUS_COLOR[offer.status] ?? ''}`}>
                    {STATUS_LABEL[offer.status] ?? offer.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SentTradeOffersTable = () => {
  const { tradeOffers, isLoading, isEmpty } = useSentTradeOffers();
  const updateTradeOffer = useUpdateTradeOffer();

  const handleCancel = (tradeOfferId: number) => {
    updateTradeOffer.mutate({ tradeOfferId, data: { status: 'CANCELED' } });
  };

  if (isLoading) {
    return <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />;
  }

  if (isEmpty) {
    return <p className="text-sm text-gray-400 py-4">보낸 거래 요청이 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left font-medium">상품명</th>
            <th className="px-4 py-3 text-left font-medium">거래 타입</th>
            <th className="px-4 py-3 text-left font-medium">거래 요청 내용</th>
            <th className="px-4 py-3 text-left font-medium">누구에게</th>
            <th className="px-4 py-3 text-left font-medium">요청 보낸 날짜</th>
            <th className="px-4 py-3 text-left font-medium">상태</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tradeOffers.map((offer) => (
            <tr key={offer.tradeOfferId} className="hover:bg-gray-50">
              <td className="px-4 py-3">{offer.itemTitle}</td>
              <td className="px-4 py-3">{ITEM_TYPE_LABEL[offer.itemType] ?? offer.itemType}</td>
              <td className="px-4 py-3">
                <TradeOfferDateRange offer={offer} />
              </td>
              <td className="px-4 py-3">{offer.ownerName}</td>
              <td className="px-4 py-3">{formatDate(offer.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${STATUS_COLOR[offer.status] ?? ''}`}>
                    {STATUS_LABEL[offer.status] ?? offer.status}
                  </span>
                  {offer.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(offer.tradeOfferId)}
                      disabled={updateTradeOffer.isPending}
                      className="px-2 py-1 text-xs rounded-lg border text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                    >
                      취소
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TradeOfferSection = () => {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-semibold text-base mb-4">받은 거래 요청</h2>
        <ReceivedTradeOffersTable />
      </div>
      <div>
        <h2 className="font-semibold text-base mb-4">보낸 거래 요청</h2>
        <SentTradeOffersTable />
      </div>
    </section>
  );
};
