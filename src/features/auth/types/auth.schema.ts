import z from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup 스키마
export const signupSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),

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
});

export type SignupFormData = z.infer<typeof signupSchema>;
