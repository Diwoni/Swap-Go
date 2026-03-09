// mocks/handlers/resale.ts
import { delay, http, HttpResponse } from 'msw';

import { BASE_URL } from '@/shared/libs/constants'; // 절대 경로(@) 사용 권장

import { getCreatedListItems } from './data/createdListings';
import { MOCK_PRODUCTS } from './data/resale';

export const resaleHandlers = [
  http.get(`${BASE_URL}/resale/items/search`, async ({ request }) => {
    // 0. 리얼한 네트워크 지연 (0.5초)
    await delay(500);

    const url = new URL(request.url);
    const params = url.searchParams;

    // --- 1. 파라미터 파싱 ---
    const region = params.get('region');
    const categoryParam = params.get('category'); // "전자기기,가구"
    // isAvailable이 'true' 문자열로 오므로 boolean 변환
    const isAvailable = params.get('isAvailable') === 'true';
    const dealType = params.get('dealType');
    const keyword = params.get('keyword');
    const priceRange = params.get('priceRange'); // "1000-20000" or "1000-" or "-5000"
    const cursor = Number(params.get('cursor')) || 0;
    const PAGE_SIZE = 10;

    // --- 2. 필터링 로직 ---
    const allItems = [...getCreatedListItems('resale'), ...MOCK_PRODUCTS];
    const filteredItems = allItems.filter((item) => {
      // 1) 지역 필터
      if (region && item.region !== region) return false;

      // 2) 카테고리 필터
      if (categoryParam) {
        const categories = categoryParam.split(',');
        if (!categories.includes(item.category)) return false;
      }

      // 3) 거래 상태 (판매중만 보기: ✨ status -> isAvailable)
      if (isAvailable && item.isAvailable !== true) return false;

      // 4) 거래 유형 (SELL / BUY)
      if (dealType && item.dealType !== dealType) return false;

      // 5) 키워드 검색
      if (keyword && !item.title.includes(keyword)) return false;

      // 6) 가격 범위 로직
      if (priceRange) {
        const [minStr, maxStr] = priceRange.split('-');
        const min = minStr ? Number(minStr) : 0;
        const max = maxStr ? Number(maxStr) : Infinity;
        if (item.price < min || item.price > max) return false;
      }

      return true;
    });

    // --- 3. 정렬 (최신순) ---
    filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // --- 4. 페이지네이션 (Cursor 기반) ---
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

    // --- 5. 응답 반환 ---
    return HttpResponse.json({
      count: filteredItems.length,
      nextCursor,
      hasNext,
      items: paginatedItems,
    });
  }),

  // ---------------------------------------------------------
  // 1. 찜 추가
  http.post(`${BASE_URL}/items/:itemId/favorites`, async ({ params }) => {
    await delay(300);
    const { itemId } = params;
    const id = Number(itemId);

    // ✨ id -> itemId 변경
    const targetItem = MOCK_PRODUCTS.find((item) => item.itemId === id);

    if (!targetItem) return new HttpResponse(null, { status: 404 });
    targetItem.isLiked = true;

    return HttpResponse.json({
      success: true,
      isLiked: true,
      message: '찜 목록에 추가되었습니다.',
    });
  }),

  // ---------------------------------------------------------
  // 2. 찜 해제
  http.delete(`${BASE_URL}/items/:itemId/favorites`, async ({ params }) => {
    await delay(300);
    const { itemId } = params;
    const id = Number(itemId);

    // ✨ id -> itemId 변경
    const targetItem = MOCK_PRODUCTS.find((item) => item.itemId === id);

    if (!targetItem) return new HttpResponse(null, { status: 404 });
    targetItem.isLiked = false;

    return HttpResponse.json({
      success: true,
      isLiked: false,
      message: '찜 목록에서 삭제되었습니다.',
    });
  }),
];
