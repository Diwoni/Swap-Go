// mocks/handlers/rental.ts
import { delay, http, HttpResponse } from 'msw';

import { BASE_URL } from '@/shared/libs/constants'; // 절대 경로(@) 사용 권장

import { getCreatedListItems } from './data/createdListings';
import { MOCK_RENTAL_PRODUCTS } from './data/rental';

export const rentalHandlers = [
  // ✨ 렌탈 검색 엔드포인트
  http.get(`${BASE_URL}/rental/items/search`, async ({ request }) => {
    await delay(500); // 네트워크 지연 시뮬레이션

    const url = new URL(request.url);
    const params = url.searchParams;

    // --- 1. 파라미터 파싱 ---
    const region = params.get('region');
    const categoryParam = params.get('category');
    const isAvailable = params.get('isAvailable') === 'true';
    const dealType = params.get('dealType'); // 'SHORT' | 'LONG'
    const keyword = params.get('keyword');
    const priceRange = params.get('priceRange');
    const cursor = Number(params.get('cursor')) || 0;
    const PAGE_SIZE = 10;

    // --- 2. 필터링 로직 (Rental 데이터 대상) ---
    const allItems = [...getCreatedListItems('rental'), ...MOCK_RENTAL_PRODUCTS];
    const filteredItems = allItems.filter((item) => {
      // 1) 지역
      if (region && item.region !== region) return false;

      // 2) 카테고리
      if (categoryParam) {
        const categories = categoryParam.split(',');
        if (!categories.includes(item.category)) return false;
      }

      // 3) 상태 (✨ status -> isAvailable 변경)
      if (isAvailable && item.isAvailable !== true) return false;

      // 4) 거래 유형 (SHORT / LONG)
      if (dealType && item.dealType !== dealType) return false;

      // 5) 검색어
      if (keyword && !item.title.includes(keyword)) return false;

      // 6) 가격 범위
      if (priceRange) {
        const [minStr, maxStr] = priceRange.split('-');
        const min = minStr ? Number(minStr) : 0;
        const max = maxStr ? Number(maxStr) : Infinity;
        if (item.price < min || item.price > max) return false;
      }

      return true;
    });

    // --- 3. 정렬 ---
    filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // --- 4. 페이지네이션 ---
    let startIndex = 0;
    if (cursor) {
      // ✨ id -> itemId 변경
      const cursorIndex = filteredItems.findIndex((item) => item.itemId === cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);
    const hasNext = startIndex + PAGE_SIZE < filteredItems.length;
    const lastItem = paginatedItems[paginatedItems.length - 1];

    // ✨ id -> itemId 변경
    const nextCursor = hasNext && lastItem ? lastItem.itemId : null;

    // --- 5. 응답 ---
    return HttpResponse.json({
      count: filteredItems.length,
      nextCursor,
      hasNext,
      items: paginatedItems,
    });
  }),
];
