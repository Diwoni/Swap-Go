// mocks/handlers/productDetail.ts
import { delay, http, HttpResponse } from 'msw';

import { BASE_URL } from '@/shared/libs/constants';

import { createMockRentalDetail, createMockResaleDetail } from './data/productDetail';

export const productDetailHandlers = [
  // 1. Resale 상세 조회 핸들러
  http.get(`${BASE_URL}/resale/items/:itemId`, async ({ params }) => {
    await delay(500); // 로딩 시뮬레이션
    const { itemId } = params;
    const id = Number(itemId);

    // ID가 숫자가 아니거나 유효하지 않으면 404 처리 (선택사항)
    if (Number.isNaN(id)) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }

    // 동적으로 데이터 생성하여 반환
    const data = createMockResaleDetail(id);
    return HttpResponse.json(data);
  }),

  // 2. Rental 상세 조회 핸들러
  http.get(`${BASE_URL}/rental/items/:itemId`, async ({ params }) => {
    await delay(500);
    const { itemId } = params;
    const id = Number(itemId);

    if (Number.isNaN(id)) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }

    const data = createMockRentalDetail(id);
    return HttpResponse.json(data);
  }),
];
