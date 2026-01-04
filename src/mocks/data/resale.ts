import sampleImg from '../../assets/image.png';
import { ProductItem } from '../../features/product/types';

export const MOCK_PRODUCTS: ProductItem[] = Array.from({ length: 50 })
  .map((_, index) => {
    const id = index + 1;
    const isSell = index % 3 === 0; // 3번에 1번꼴로 판매글

    // 명세서에 맞게 boolean 값 생성 (true: 판매중, false: 거래완료)
    const isAvailable = index % 5 !== 0;

    return {
      itemId: id,
      title: `[${isSell ? '판매' : '구매'}] 아이폰 1${index % 5} Pro ${isSell ? '팝니다' : '구해요'} (${id}번째)`,
      deposit: null, // 중고거래는 보증금 없음
      price: (index + 1) * 10000,
      region: index % 2 === 0 ? 'Warsaw' : 'Ulm',

      // ✨ dealType 복구: 판매(SELL) 또는 구매(BUY)
      dealType: isSell ? 'SELL' : 'BUY',

      category: index % 2 === 0 ? '전자기기' : '가구',
      isAvailable: isAvailable,
      isLiked: index % 4 === 0,
      thumbnailUrl: sampleImg,
      createdAt: new Date(Date.now() - (50 - index) * 1000 * 60 * 60).toISOString(),
    };
  })
  .reverse();
