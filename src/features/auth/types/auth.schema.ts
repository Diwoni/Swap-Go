import z from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Address 스키마
export const addressSchema = z.object({
  // 클라이언트는 placeId 없이 country, region, street 만 보낼 수 있음.
  placeId: z.string().min(1).optional(),
  country: z.string().min(1, '국가를 입력해주세요.').max(100),
  region: z.string().min(1, '지역을 입력해주세요.').max(100),
  street: z.string().max(100).optional(),
});

// Signup 스키마
export const signupSchema = z.object({
  email: z.email('올바른 이메일 형식이 아닙니다').min(1, '이메일을 입력해주세요'),

  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[a-z\d@$!%*?&#]+$/,
      '비밀번호는 소문자, 숫자, 특수문자(@$!%*?&#)를 모두 포함해야 합니다'
    ),

  username: z
    .string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(50, '이름은 50자 이하여야 합니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름에는 특수문자와 숫자를 사용할 수 없습니다'),
  address: addressSchema,
});

export type SignupFormData = z.infer<typeof signupSchema>;
