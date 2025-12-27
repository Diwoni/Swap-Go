// mocks/data/resale.ts
import sampleImg from '../../assets/image.png';
import { ResaleListResponse } from '../../features/product/types/resale';

// 타입 정의에서 items 배열의 요소 타입만 추출
type ResaleItem = ResaleListResponse['items'][0];

export const MOCK_PRODUCTS: ResaleItem[] = Array.from({ length: 50 })
  .map((_, index) => {
    const id = index + 1;
    const isSell = index % 3 === 0; // 3번에 1번꼴로 판매글

    // 명세서에 맞게 boolean 값 생성 (true: 판매중, false: 거래완료)
    const isAvailable = index % 5 !== 0;

    return {
      id,
      title: `[${isSell ? '판매' : '구매'}] 아이폰 1${index % 5} Pro ${isSell ? '팝니다' : '구해요'} (${id}번째)`,
      deposit: null,
      price: (index + 1) * 10000,
      region: index % 2 === 0 ? 'Warsaw' : 'Ulm',
      dealType: isSell ? 'SELL' : 'BUY', // ✨ deal_type -> dealType (Type 정의 일치)
      category: index % 2 === 0 ? '전자기기' : '가구',
      status: isAvailable, // ✨ string -> boolean (Type 정의 일치)
      isLiked: index % 4 === 0,
      thumbnailUrl: sampleImg,
      // 최신순 정렬 (ID가 클수록 최신)
      createdAt: new Date(Date.now() - (50 - index) * 1000 * 60 * 60).toISOString(),
    };
  })
  .reverse(); // 최신순이 먼저 오도록 정렬
