// mocks/handlers/resale.ts
import { delay, http, HttpResponse } from 'msw';

import { BASE_URL } from '../shared/libs/constants';
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
    const priceRange = params.get('priceRange'); // "1000-20000"
    const cursor = Number(params.get('cursor')) || 0;
    const PAGE_SIZE = 10;

    // --- 2. 필터링 로직 ---
    const filteredItems = MOCK_PRODUCTS.filter((item) => {
      // 1) 지역 필터
      if (region && item.region !== region) return false;

      // 2) 카테고리 필터
      if (categoryParam) {
        const categories = categoryParam.split(',');
        if (!categories.includes(item.category)) return false;
      }

      // 3) 거래 상태 (판매중만 보기: status === true)
      // 만약 params의 isAvailable이 true면, item.status도 true여야 함
      if (isAvailable && item.status !== true) return false;

      // 4) 거래 유형 (SELL / BUY)
      if (dealType && item.dealType !== dealType) return false;

      // 5) 키워드 검색
      if (keyword && !item.title.includes(keyword)) return false;

      // 6) 가격 범위
      if (priceRange) {
        const [minStr, maxStr] = priceRange.split('-');
        const min = Number(minStr) || 0;
        // maxStr이 없거나 빈 문자열이면 무한대 처리
        const max = maxStr ? Number(maxStr) : Infinity;

        if (item.price < min || item.price > max) return false;
      }

      return true;
    });

    // --- 3. 정렬 (최신순) ---
    // createdAt 기준 내림차순
    filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // --- 4. 페이지네이션 (Cursor 기반) ---
    let startIndex = 0;

    // cursor가 있다면, 해당 cursor(ID)를 가진 아이템의 *다음 인덱스*부터 시작
    if (cursor) {
      const cursorIndex = filteredItems.findIndex((item) => item.id === cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);

    // 다음 페이지 존재 여부
    const hasNext = startIndex + PAGE_SIZE < filteredItems.length;

    // ✨ 수정: 마지막 아이템을 먼저 안전하게 꺼냅니다.
    const lastItem = paginatedItems[paginatedItems.length - 1];

    // ✨ 수정: hasNext가 true이고, 실제로 아이템이 있을 때만 id를 사용
    const nextCursor = hasNext && lastItem ? lastItem.id : null;

    // --- 5. 응답 반환 ---
    return HttpResponse.json({
      count: filteredItems.length,
      nextCursor,
      hasNext,
      items: paginatedItems,
    });
  }),

  // ---------------------------------------------------------
  // 1. 찜 추가 (POST /items/:itemId/favorites)
  // ---------------------------------------------------------
  http.post(`${BASE_URL}/items/:itemId/favorites`, async ({ params }) => {
    await delay(300); // 네트워크 지연 시뮬레이션

    const { itemId } = params;
    const id = Number(itemId);

    // Mock 데이터에서 해당 상품 찾기
    const targetItem = MOCK_PRODUCTS.find((item) => item.id === id);

    if (!targetItem) {
      return new HttpResponse(null, { status: 404 });
    }

    // 데이터 업데이트 (찜 상태 true)
    targetItem.isLiked = true;

    // 응답 반환 (FavoriteResponse 타입에 맞춤)
    return HttpResponse.json({
      success: true,
      isLiked: true,
      message: '찜 목록에 추가되었습니다.',
    });
  }),

  // ---------------------------------------------------------
  // 2. 찜 해제 (DELETE /items/:itemId/favorites)
  // ---------------------------------------------------------
  http.delete(`${BASE_URL}/items/:itemId/favorites`, async ({ params }) => {
    await delay(300);

    const { itemId } = params;
    const id = Number(itemId);

    const targetItem = MOCK_PRODUCTS.find((item) => item.id === id);

    if (!targetItem) {
      return new HttpResponse(null, { status: 404 });
    }

    // 데이터 업데이트 (찜 상태 false)
    targetItem.isLiked = false;

    // 응답 반환
    return HttpResponse.json({
      success: true,
      isLiked: false,
      message: '찜 목록에서 삭제되었습니다.',
    });
  }),
];
