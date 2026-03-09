import { beforeEach, describe, expect, it } from 'vitest';

import { StoredUser } from '../auth.handlers';
import {
  addCreatedListing,
  clearCreatedListings,
  getCreatedDetail,
  getCreatedListItems,
} from './createdListings';

const testSeller: StoredUser = {
  email: 'test@example.com',
  password: 'password123',
  username: '테스트유저',
  address: {
    country: 'South Korea',
    region: 'Seoul',
    street: '123 Test Street',
  },
};

describe('createdListings', () => {
  beforeEach(() => {
    clearCreatedListings();
  });

  it('생성한 이미지가 목록 썸네일과 상세 이미지에 반영된다', () => {
    const imageUrls = ['blob:mock-image-1', 'blob:mock-image-2'];

    const { itemId } = addCreatedListing({
      seller: testSeller,
      imageUrls,
      data: {
        title: '테스트 게시글',
        itemType: 'resale',
        content: '본문',
        category: '전자기기',
        price: 10000,
        dealType: 'SELL',
        region: 'Seoul',
        deposit: null,
      },
    });

    const listItem = getCreatedListItems('resale')[0];
    const detail = getCreatedDetail('resale', itemId);

    expect(listItem?.thumbnailUrl).toBe(imageUrls[0]);
    expect(detail?.images).toEqual(imageUrls);
  });

  it('로그인 사용자의 이름과 같은 판매자 최근 게시글을 상세에 반영한다', () => {
    const first = addCreatedListing({
      seller: testSeller,
      imageUrls: ['blob:first'],
      data: {
        title: '첫 번째 글',
        itemType: 'resale',
        content: '본문 1',
        category: '전자기기',
        price: 10000,
        dealType: 'SELL',
        region: 'Seoul',
        deposit: null,
      },
    });

    const second = addCreatedListing({
      seller: testSeller,
      imageUrls: ['blob:second'],
      data: {
        title: '두 번째 글',
        itemType: 'rental',
        content: '본문 2',
        category: '전자기기',
        price: 20000,
        dealType: 'SELL',
        region: 'Seoul',
        deposit: 5000,
      },
    });

    const detail = getCreatedDetail('rental', second.itemId);

    expect(detail?.seller.username).toBe('테스트유저');
    expect(detail?.recentPostsBySeller).toHaveLength(1);
    expect(detail?.recentPostsBySeller[0]?.itemId).toBe(first.itemId);
    expect(detail?.recentPostsBySeller[0]?.itemType).toBe('resale');
  });
});
