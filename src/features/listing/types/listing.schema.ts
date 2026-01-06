import z from 'zod';

export const listingSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  price: z.number().min(0),
  deposit: z.number().nullable().optional(),
  content: z.string().min(1, '내용을 입력해주세요.'),
  region: z.string().min(1, '지역을 선택해주세요.'),
  dealType: z.enum(['BUY', 'SELL']),
  itemType: z.enum(['resale', 'rental']),
  images: z.array(z.string()),
});

export type ListingSchema = z.infer<typeof listingSchema>;
