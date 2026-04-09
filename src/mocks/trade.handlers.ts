import { delay, http, HttpResponse } from 'msw';

import { RentalTradeRequest, ResaleTradeRequest } from '@/features/trade/types/trade';

import { BASE_URL } from '../shared/libs/constants';

export const tradeHandlers = [
  // 1. 중고거래 요청 (POST /tradeoffers/resale)
  http.post(`${BASE_URL}/tradeoffers/resale`, async ({ request }) => {
    const body = (await request.json()) as ResaleTradeRequest;

    // 네트워크 지연 시뮬레이션 (0.5초)
    await delay(500);

    // 성공 응답 (201 Created)
    return HttpResponse.json(
      {
        requestId: Math.floor(Math.random() * 10000), // 랜덤 ID 생성
        itemId: body.itemId,
        receiverId: 999, // 임의의 판매자 ID
        status: 'REQUESTED',
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );

    // 💡 에러 테스트를 하려면 위 return을 주석 처리하고 아래를 주석 해제하세요.
    // return HttpResponse.json(
    //   { message: '이미 거래 요청된 상품입니다.' },
    //   { status: 400 }
    // );
  }),

  // 2. 단기렌탈 요청 (POST /tradeoffers/rental)
  http.post(`${BASE_URL}/tradeoffers/rental`, async ({ request }) => {
    const body = (await request.json()) as RentalTradeRequest;

    await delay(500);

    return HttpResponse.json(
      {
        requestId: Math.floor(Math.random() * 10000),
        itemId: body.itemId,
        receiverId: 888, // 임의의 임대인 ID
        status: 'REQUESTED',
        startDate: body.startDate, // 요청한 날짜를 그대로 반환
        endDate: body.endDate, // 요청한 날짜를 그대로 반환
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
];
