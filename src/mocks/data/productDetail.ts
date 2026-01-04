// mocks/data/productDetail.ts
import sampleImg from '../../assets/image.png';
import { ProductType, RecentPostBySeller } from '../../features/product/types';
import {
  RentalProductDetail,
  ResaleProductDetail,
} from '../../features/product/types/productDetail';

// ----------------------------------------------------------------------
// 1. Helper: 판매자 정보 생성
// ----------------------------------------------------------------------
const getMockSeller = (id: number) => ({
  sellerId: id + 9000,
  username: `User${id}_판매왕`,
});

// ----------------------------------------------------------------------
// 2. Helper: 판매자의 최근 게시글 목록 생성 (타입별 생성기)
// ----------------------------------------------------------------------
const getMockRecentPosts = (baseId: number, type: ProductType): RecentPostBySeller[] => {
  return Array.from({ length: 4 }).map((_, idx) => {
    // ID 충돌 방지를 위해 타입별로 ID 범위 분리
    // resale: 100번대 ~, rental: 2000번대 ~
    const idOffset = type === 'resale' ? 100 : 2000;
    const generatedItemId = baseId + idx + idOffset;

    return {
      // ProductItem 공통 필드
      itemId: generatedItemId,
      title:
        type === 'resale'
          ? `[판매] 판매자의 다른 물품 ${idx + 1}`
          : `[렌탈] 판매자의 다른 렌탈 ${idx + 1}`,
      price: (baseId + idx) * 1000 + 5000,

      // 렌탈일 경우 보증금 필수, 중고는 null
      deposit: type === 'rental' ? 300000 : null,

      region: 'Warsaw',

      // 상세 페이지 로직에 맞는 거래 유형 설정
      dealType: 'BUY',

      category: '전자기기',
      isAvailable: true, // status -> isAvailable
      isLiked: idx % 2 !== 0,
      thumbnailUrl: sampleImg,
      createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),

      // 식별용 타입 (UI 필터링에 사용됨)
      itemType: type,
    };
  });
};

// ----------------------------------------------------------------------
// 3. Main: 중고 거래(Resale) 상세 데이터 생성 함수
// ----------------------------------------------------------------------
export const createMockResaleDetail = (id: number): ResaleProductDetail => {
  const isMine = id % 10 === 0; // ID가 10의 배수면 내 글

  return {
    itemId: id,
    title: `[판매] 아이폰 15 Pro Max 급처합니다 (${id}번 상품)`,
    content: `
      안녕하세요. 기기 변경으로 인해 판매합니다.

      - 구매일: 2023년 11월
      - 배터리 효율: 98%
      - 상태: S급 (찍힘, 기스 없음)
      - 구성품: 박스 풀세트

      직거래는 강남역 근처에서 가능합니다.
      네고 문의는 정중히 사양합니다.
    `,
    price: id * 15000,
    region: id % 2 === 0 ? 'Warsaw' : 'Krakow',
    category: '전자기기',
    isMine,
    isLiked: id % 3 === 0,
    isAvailable: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2일 전
    images: [sampleImg, sampleImg, sampleImg],
    seller: getMockSeller(id),

    // ✨ 핵심 수정: 중고 물품과 렌탈 물품을 모두 포함시켜 반환
    recentPostsBySeller: [...getMockRecentPosts(id, 'resale'), ...getMockRecentPosts(id, 'rental')],
  };
};

// ----------------------------------------------------------------------
// 4. ✨ New: 렌탈(Rental) 상세 데이터 생성 함수
// ----------------------------------------------------------------------
export const createMockRentalDetail = (id: number): RentalProductDetail => {
  const isMine = id % 10 === 0;

  return {
    itemId: id,
    title: `[렌탈] 고성능 카메라 대여해드립니다 (${id}번 상품)`,
    content: `
      여행용으로 딱 좋은 카메라 렌탈합니다.

      - 기종: Sony A7M4
      - 렌즈: 24-70 GM II
      - 상태: S급

      보증금 확인 후 대여 가능합니다.
      직거래 선호합니다.
    `,
    price: id * 1000 + 5000, // 1일 대여료
    deposit: 500000, // ✨ 보증금 (Resale에는 없음)
    region: 'Warsaw',
    category: '전자기기',
    isMine,
    isLiked: id % 3 === 0,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    images: [sampleImg, sampleImg], // 렌탈용 이미지
    seller: getMockSeller(id),

    // ✨ 렌탈 전용 필수 정보 (이게 있어야 ProductDetailCard에서 렌더링됨)
    rentalInfo: {
      isCurrentlyRented: id % 2 === 0, // 짝수 ID는 대여중 상태 시뮬레이션
      rentedFrom: '2024-05-01',
      rentedUntil: '2024-05-05',
    },

    recentPostsBySeller: [...getMockRecentPosts(id, 'resale'), ...getMockRecentPosts(id, 'rental')],
  };
};
