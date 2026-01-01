// mocks/data/productDetail.ts
import sampleImg from '../../assets/image.png'; // 기존에 쓰시던 이미지 경로
import {
  RentalProductDetail,
  ResaleProductDetail,
} from '../../features/product/types/productDetail';

// 판매자(Seller) 더미 데이터 생성기
const getMockSeller = (id: number) => ({
  sellerId: id + 9000,
  nickname: `User${id}_판매왕`,
});

// 판매자의 최근 게시글 더미 데이터
const getMockRecentPosts = (baseId: number, type: 'SELL' | 'RENTAL') => {
  return Array.from({ length: 4 }).map((_, idx) => ({
    productId: baseId + idx + 100,
    thumbnail: sampleImg,
    price: (baseId + idx) * 1000,
    isLiked: idx % 2 === 0,
    itemType: type,
    createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// 1. 중고 거래(Resale) 상세 데이터 생성 함수
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
    status: true, // true: 판매중
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2일 전
    images: [sampleImg, sampleImg, sampleImg], // 이미지 3장
    seller: getMockSeller(id),
    recentPostsBySeller: getMockRecentPosts(id, 'SELL'),
  };
};

// 2. 대여(Rental) 상세 데이터 생성 함수
export const createMockRentalDetail = (id: number): RentalProductDetail => {
  const isMine = id % 10 === 0;

  return {
    itemId: id,
    title: `[대여] 고성능 게이밍 노트북 빌려드립니다 (${id}번 상품)`,
    content: `
      단기 프로젝트나 게임용으로 좋습니다.

      - 모델명: ASUS ROG Zephyrus
      - 사양: i9-13900H, RTX 4070, 32GB RAM
      - 대여 기간: 최소 3일부터 가능

      보증금은 반납 시 기기 확인 후 즉시 돌려드립니다.
      파손 시 수리비 청구될 수 있습니다.
    `,
    deposit: 500000, // 보증금
    price: 30000, // 일일 대여료
    region: id % 2 === 0 ? 'Warsaw' : 'Wroclaw',
    category: '전자기기',
    isMine,
    isLiked: id % 3 === 0,
    status: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
    images: [sampleImg, sampleImg],
    rentalInfo: {
      isCurrentlyRented: false, // 현재 대여 가능
      rentedFrom: '',
      rentedUntil: '',
    },
    seller: getMockSeller(id),
    recentPostsBySeller: getMockRecentPosts(id, 'RENTAL'),
  };
};
