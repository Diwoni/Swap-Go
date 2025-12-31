// mocks/data/rental.ts
import sampleImg from '../../assets/image.png';
import { ProductListResponse } from '../../features/product/types';

// 타입 정의: items의 요소 타입 추론
// (통합된 ProductItem 타입을 사용한다고 가정 시 deposit은 number | null)
type RentalItem = ProductListResponse['items'][0];

export const MOCK_RENTAL_PRODUCTS: RentalItem[] = Array.from({ length: 50 })
  .map((_, index) => {
    // Resale과 ID가 겹치지 않게 1000번부터 시작
    const id = index + 1000;
    const isAvailable = index % 5 !== 0; // 5개 중 1개는 대여중(false)

    // dealType 다양화 (단기렌탈 / 장기렌탈)
    const dealType = index % 2 === 0 ? 'SHORT' : 'LONG';

    return {
      id,
      title: `[렌탈] 맥북 프로 M${(index % 3) + 1} 대여합니다 (${id}번)`,

      // ✨ 핵심: 렌탈은 보증금이 존재함 (숫자)
      deposit: (index + 1) * 5000,

      // 월 대여료 (판매가보다 보통 저렴)
      price: (index + 1) * 1000,

      region: index % 2 === 0 ? 'Warsaw' : 'Ulm',
      dealType: dealType,
      category: index % 2 === 0 ? '전자기기' : '가구',
      status: isAvailable,
      isLiked: index % 3 === 0,
      thumbnailUrl: sampleImg,
      createdAt: new Date(Date.now() - (50 - index) * 1000 * 60 * 60).toISOString(),
    };
  })
  .reverse(); // 최신순 정렬
