import z from 'zod';

import { MAX_LISTING_IMAGE_COUNT } from './listing.types';

export const listingSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  price: z.number().min(0),
  deposit: z.number().nullable().optional(),
  content: z.string().min(1, '내용을 입력해주세요.'),
  region: z.string().min(1, '지역을 선택해주세요.'),
  dealType: z.enum(['BUY', 'SELL']),
  itemType: z.enum(['resale', 'rental']),
  images: z
    .array(z.string())
    .max(
      MAX_LISTING_IMAGE_COUNT,
      `이미지는 최대 ${MAX_LISTING_IMAGE_COUNT}장까지 등록할 수 있습니다.`
    ),
});

export type ListingSchema = z.infer<typeof listingSchema>;
