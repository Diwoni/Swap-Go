import { z } from 'zod';

import { captureException } from '@/shared/utils/sentry';

import { RentalProductDetail, ResaleProductDetail } from '../types/productDetail';
import { ProductListResponse } from '../types/productList';

const ProductItemSchema = z.object({
  itemId: z.number(),
  title: z.string().catch(''),
  price: z.number().catch(0),
  deposit: z.number().nullable().catch(null),
  region: z.string().catch(''),
  dealType: z.string().catch(''),
  category: z.string().catch(''),
  isAvailable: z.boolean().catch(false),
  isLiked: z.boolean().catch(false),
  thumbnailUrl: z.string().catch(''),
  createdAt: z.string().catch(''),
});

const RecentPostBySellerSchema = ProductItemSchema.extend({
  itemType: z.enum(['resale', 'rental']),
});

const SellerSchema = z.object({
  sellerId: z.number().catch(0),
  username: z.string().catch(''),
});

// 배열 내 개별 아이템을 safeParse로 검증하고, 실패한 항목은 Sentry에 기록 후 제거
const parseArraySafely = <T>(schema: z.ZodType<T>, items: unknown[]): T[] =>
  items.flatMap((item) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      captureException(result.error, { item });
      return [];
    }
    return [result.data];
  });

const ResaleProductDetailSchema = z.object({
  itemId: z.number(),
  title: z.string().catch(''),
  content: z.string().catch(''),
  price: z.number().catch(0),
  region: z.string().catch(''),
  category: z.string().catch(''),
  isMine: z.boolean().catch(false),
  isLiked: z.boolean().catch(false),
  isAvailable: z.boolean().catch(false),
  createdAt: z.string().catch(''),
  images: z.array(z.string()).catch([]),
  seller: SellerSchema.catch({ sellerId: 0, username: '' }),
  recentPostsBySeller: z
    .array(z.unknown())
    .catch([])
    .transform((items) => parseArraySafely(RecentPostBySellerSchema, items)),
});

const RentalInfoSchema = z.object({
  isCurrentlyRented: z.boolean().catch(false),
  rentedFrom: z.string().nullable().catch(null),
  rentedUntil: z.string().nullable().catch(null),
});

const RentalProductDetailSchema = ResaleProductDetailSchema.extend({
  deposit: z.number().catch(0),
  rentalInfo: RentalInfoSchema.catch({
    isCurrentlyRented: false,
    rentedFrom: null,
    rentedUntil: null,
  }),
});

const ProductListResponseSchema = z.object({
  count: z.number().catch(0),
  nextCursor: z.number().nullable().catch(null),
  hasNext: z.boolean().catch(false),
  items: z
    .array(z.unknown())
    .catch([])
    .transform((items) => parseArraySafely(ProductItemSchema, items)),
});

const toObject = (raw: unknown): object => (raw != null && typeof raw === 'object' ? raw : {});

export const parseProductListResponse = (raw: unknown): ProductListResponse => {
  const result = ProductListResponseSchema.safeParse(toObject(raw));
  if (!result.success) {
    captureException(result.error, { context: 'parseProductListResponse' });
    return { count: 0, nextCursor: null, hasNext: false, items: [] };
  }
  return result.data;
};

export const parseResaleProductDetail = (raw: unknown): ResaleProductDetail => {
  const result = ResaleProductDetailSchema.safeParse(toObject(raw));
  if (!result.success) {
    captureException(result.error, { context: 'parseResaleProductDetail', raw });
    throw new Error('상품 정보를 불러올 수 없습니다.');
  }
  return result.data;
};

export const parseRentalProductDetail = (raw: unknown): RentalProductDetail => {
  const result = RentalProductDetailSchema.safeParse(toObject(raw));
  if (!result.success) {
    captureException(result.error, { context: 'parseRentalProductDetail', raw });
    throw new Error('상품 정보를 불러올 수 없습니다.');
  }
  return result.data;
};
