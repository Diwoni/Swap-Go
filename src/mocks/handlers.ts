import { BASE_URL } from '@/shared/libs/constants';
import { http, HttpResponse } from 'msw';

// 더미 데이터
const dummyRentalProducts = Array.from({ length: 20 }, (_, i) => ({
  name: `이름 ${i + 1}`,
  price: 5000,
}));

const registeredUsers: Array<{
  email: string;
  password: string;
  name: string;
  // address: {
  //   country: string;
  //   region: string;
  //   street?: string;
  // };
}> = [];

export const handlers = [
  http.get(`${BASE_URL}/rental/products`, () => {
    return HttpResponse.json(dummyRentalProducts);
  }),

  // 회원가입 api
  http.post(`${BASE_URL}/auth/signup`, async ({ request }) => {
    const requestBody = (await request.json()) as {
      email: string;
      password: string;
      name: string;
      // address: {
      //   country: string;
      //   region: string;
      //   street?: string;
      // };
    };

    // 이메일 중복 체크
    const existingUser = registeredUsers.find(
      (user) => user.email === requestBody.email
    );

    if (existingUser) {
      return HttpResponse.json(
        {
          message: '이미 가입된 이메일입니다',
          error: 'EMAIL_ALREADY_EXISTS',
        },
        { status: 409 }
      );
    }

    // 새 사용자 생성
    const newUser = {
      email: requestBody.email,
      name: requestBody.name,
      password: requestBody.password,
      // address: requestBody.address,
    };

    registeredUsers.push(newUser);

    // 성공 응답
    return HttpResponse.json(
      {
        message: '회원가입이 완료되었습니다',
        user: {
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
        },
        accessToken: 'mock-access-token-' + newUser.email,
        refreshToken: 'mock-refresh-token-' + newUser.email,
      },
      { status: 201 }
    );
  }),
];
