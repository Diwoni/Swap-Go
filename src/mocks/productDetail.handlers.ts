import { delay, http, HttpResponse } from 'msw';

import { BASE_URL } from '@/shared/libs/constants';

// ✨ createMockRentalDetail import 추가
import { createMockRentalDetail, createMockResaleDetail } from './data/productDetail';

export const productDetailHandlers = [
  // 1. Resale 상세 조회 핸들러
  http.get(`${BASE_URL}/resale/items/:itemId`, async ({ params }) => {
    await delay(500);
    const id = Number(params.itemId);

    if (Number.isNaN(id)) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }

    const data = createMockResaleDetail(id);
    return HttpResponse.json(data);
  }),

  // 2. Rental 상세 조회 핸들러
  http.get(`${BASE_URL}/rental/items/:itemId`, async ({ params }) => {
    await delay(500);
    const id = Number(params.itemId);

    if (Number.isNaN(id)) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }

    // ✨ 여기를 수정했습니다! (Resale -> Rental 생성 함수로 변경)
    const data = createMockRentalDetail(id);
    return HttpResponse.json(data);
  }),
];
