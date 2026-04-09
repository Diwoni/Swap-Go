import { delay, http, HttpResponse } from 'msw';

import { BASE_URL } from '../shared/libs/constants';

// ─── 프로필 ───────────────────────────────────────────────────────────────────

const mockProfile = {
  email: 'test@example.com',
  username: '테스트유저',
  address: {
    country: 'South Korea',
    region: 'Seoul',
    street: '123 Test Street',
  },
};

// ─── 내 상품 ──────────────────────────────────────────────────────────────────

const mockMyItems = {
  count: 2,
  nextCursor: null,
  hasNext: false,
  items: [
    {
      itemId: 101,
      title: '소니 WH-1000 헤드셋',
      price: 50000,
      deposit: null,
      region: 'Seoul',
      dealType: 'SELL',
      category: '전자기기',
      isAvailable: true,
      isLiked: false,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      createdAt: '2025-12-20T10:00:00',
    },
    {
      itemId: 102,
      title: '보드게임 5종 세트',
      price: 8000,
      deposit: 10000,
      region: 'Seoul',
      dealType: 'RENT',
      category: '기타',
      isAvailable: true,
      isLiked: false,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
      createdAt: '2025-12-18T10:00:00',
    },
  ],
};

// ─── 거래요청 ─────────────────────────────────────────────────────────────────

const mockReceivedTradeOffers = [
  {
    tradeOfferId: 507,
    transactionId: null,
    itemId: 101,
    itemType: 'rental',
    itemTitle: '소니 WH-1000 헤드셋',
    requesterId: 2,
    requesterName: '박성윤',
    ownerId: 1,
    ownerName: '테스트유저',
    status: 'PENDING',
    createdAt: '2026-03-11T09:00:00',
    startAt: '2026-03-12T10:00:00',
    endAt: '2026-03-18T10:00:00',
  },
  {
    tradeOfferId: 506,
    transactionId: null,
    itemId: 101,
    itemType: 'resale',
    itemTitle: '소니 WH-1000 헤드셋',
    requesterId: 3,
    requesterName: '김철수',
    ownerId: 1,
    ownerName: '테스트유저',
    status: 'PENDING',
    createdAt: '2026-03-10T09:00:00',
    startAt: null,
    endAt: null,
  },
  {
    tradeOfferId: 505,
    transactionId: null,
    itemId: 102,
    itemType: 'rental',
    itemTitle: '보드게임 5종 세트',
    requesterId: 2,
    requesterName: '박성윤',
    ownerId: 1,
    ownerName: '테스트유저',
    status: 'REJECTED',
    createdAt: '2026-03-09T09:00:00',
    startAt: '2026-03-15T10:00:00',
    endAt: '2026-03-20T10:00:00',
  },
];

const mockSentTradeOffers = [
  {
    tradeOfferId: 504,
    transactionId: null,
    itemId: 39,
    itemType: 'rental',
    itemTitle: '전동 드릴 세트',
    requesterId: 1,
    requesterName: '테스트유저',
    ownerId: 2,
    ownerName: '장은호',
    status: 'PENDING',
    createdAt: '2026-03-11T09:00:00',
    startAt: '2026-03-16T10:00:00',
    endAt: '2026-03-23T10:00:00',
  },
  {
    tradeOfferId: 503,
    transactionId: null,
    itemId: 18,
    itemType: 'resale',
    itemTitle: '초저가 헤드폰 정리',
    requesterId: 1,
    requesterName: '테스트유저',
    ownerId: 2,
    ownerName: '장은호',
    status: 'ACCEPTED',
    createdAt: '2026-03-10T09:00:00',
    startAt: null,
    endAt: null,
  },
  {
    tradeOfferId: 502,
    transactionId: null,
    itemId: 19,
    itemType: 'rental',
    itemTitle: '여행용 캐리어 대형',
    requesterId: 1,
    requesterName: '테스트유저',
    ownerId: 2,
    ownerName: '장은호',
    status: 'REJECTED',
    createdAt: '2026-03-09T09:00:00',
    startAt: '2026-03-12T10:00:00',
    endAt: '2026-03-15T10:00:00',
  },
];

// ─── 거래내역 ─────────────────────────────────────────────────────────────────

const mockBuyerTransactions = [
  {
    transactionId: 403,
    itemId: 39,
    itemTitle: '보드게임 5종 세트',
    itemThumbnailUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    itemPrice: 8000,
    itemLocation: 'Berlin',
    itemType: 'rental',
    itemStatus: 'RENTED',
    isLiked: false,
    buyerId: 1,
    buyerName: '테스트유저',
    sellerId: 2,
    sellerName: '장은호',
    startAt: '2026-03-16T19:22:13',
    endAt: '2026-03-25T19:22:13',
    earlyReturnStatus: 'NONE',
    createdAt: '2026-03-20T16:59:41',
  },
  {
    transactionId: 402,
    itemId: 18,
    itemTitle: '초저가 헤드폰 정리',
    itemThumbnailUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    itemPrice: 15000,
    itemLocation: 'Berlin',
    itemType: 'resale',
    itemStatus: 'COMPLETED',
    isLiked: false,
    buyerId: 1,
    buyerName: '테스트유저',
    sellerId: 2,
    sellerName: '장은호',
    startAt: null,
    endAt: null,
    earlyReturnStatus: 'NONE',
    createdAt: '2026-03-20T16:56:37',
  },
];

const mockSellerTransactions = [
  {
    transactionId: 4,
    itemId: 83,
    itemTitle: '전동 드릴 세트',
    itemThumbnailUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    itemPrice: 15000,
    itemLocation: 'Berlin',
    itemType: 'rental',
    itemStatus: 'RENTED',
    isLiked: false,
    buyerId: 2,
    buyerName: '장은호',
    sellerId: 1,
    sellerName: '테스트유저',
    startAt: '2026-03-05T16:26:09',
    endAt: '2026-03-26T16:26:09',
    earlyReturnStatus: 'PENDING',
    createdAt: '2026-03-12T16:26:09',
  },
  {
    transactionId: 3,
    itemId: 86,
    itemTitle: '여행용 캐리어 대형',
    itemThumbnailUrl:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    itemPrice: 10000,
    itemLocation: 'Berlin',
    itemType: 'resale',
    itemStatus: 'COMPLETED',
    isLiked: false,
    buyerId: 2,
    buyerName: '장은호',
    sellerId: 1,
    sellerName: '테스트유저',
    startAt: null,
    endAt: null,
    earlyReturnStatus: null,
    createdAt: '2026-03-12T16:26:09',
  },
];

// ─── 핸들러 ───────────────────────────────────────────────────────────────────

export const mypageHandlers = [
  // 프로필 조회
  http.get(`${BASE_URL}/mypage/profile`, async () => {
    await delay(300);
    return HttpResponse.json(mockProfile);
  }),

  // 프로필 수정
  http.patch(`${BASE_URL}/mypage/profile`, async () => {
    await delay(400);
    return HttpResponse.json({ message: '사용자 정보가 성공적으로 수정되었습니다.' });
  }),

  // 회원 탈퇴
  http.delete(`${BASE_URL}/mypage/profile`, async () => {
    await delay(400);
    return HttpResponse.json({ message: '회원 탈퇴가 완료되었습니다.' });
  }),

  // 내 게시글 목록 조회
  http.get(`${BASE_URL}/mypage/items`, async () => {
    await delay(300);
    return HttpResponse.json(mockMyItems);
  }),

  // 받은 거래요청 목록 조회
  http.get(`${BASE_URL}/tradeoffers`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const role = url.searchParams.get('role');

    if (role === 'receiver') {
      return HttpResponse.json(mockReceivedTradeOffers);
    }
    if (role === 'sender') {
      return HttpResponse.json(mockSentTradeOffers);
    }
    return HttpResponse.json([]);
  }),

  // 거래요청 상태 변경 (수락/거절/취소)
  http.patch(`${BASE_URL}/tradeoffers/:tradeOfferId`, async ({ request, params }) => {
    await delay(400);
    const { tradeOfferId } = params;
    const body = (await request.json()) as { status: string };

    return HttpResponse.json({
      tradeOfferId: Number(tradeOfferId),
      itemId: 101,
      requesterId: 2,
      status: body.status,
      createdAt: new Date().toISOString(),
      startAt: null,
      endAt: null,
    });
  }),

  // 구매한 거래 목록 조회
  http.get(`${BASE_URL}/transactions/buyer`, async () => {
    await delay(300);
    return HttpResponse.json(mockBuyerTransactions);
  }),

  // 판매한 거래 목록 조회
  http.get(`${BASE_URL}/transactions/seller`, async () => {
    await delay(300);
    return HttpResponse.json(mockSellerTransactions);
  }),

  // 조기 반납 요청
  http.post(`${BASE_URL}/transactions/:transactionId/early-return`, async ({ params }) => {
    await delay(400);
    const { transactionId } = params;

    return HttpResponse.json({
      transactionId: Number(transactionId),
      itemId: 39,
      requesterId: 1,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      earlyReturnAt: '2026-03-22T10:00:00',
      currentEndAt: '2026-03-25T19:22:13',
    });
  }),

  // 조기 반납 요청 상태 변경 (취소/수락/거절)
  http.patch(
    `${BASE_URL}/transactions/:transactionId/early-return`,
    async ({ request, params }) => {
      await delay(400);
      const { transactionId } = params;
      const body = (await request.json()) as { status: string };

      return HttpResponse.json({
        transactionId: Number(transactionId),
        itemId: 39,
        requesterId: 2,
        status: body.status,
        requestedAt: '2026-03-16T20:25:01',
        earlyReturnAt: '2026-03-22T10:00:00',
        currentEndAt: body.status === 'ACCEPTED' ? '2026-03-22T10:00:00' : '2026-03-25T19:22:13',
      });
    }
  ),
];
