import { delay, http, HttpResponse } from 'msw';

import type { CreateListingRequest } from '@/features/listing/types/listing.types';
import { BASE_URL } from '@/shared/libs/constants';

import { getUserFromAuthHeader } from './auth.handlers';
import { addCreatedListing } from './data/createdListings';

export const listingHandlers = [
  http.post(`${BASE_URL}/items`, async ({ request }) => {
    await delay(500);

    const mockError = request.headers.get('x-mock-error');
    if (mockError) {
      const status = Number(mockError);
      const message =
        status === 401
          ? '로그인이 필요합니다.'
          : status === 403
            ? '계정 정지 상태로 물품을 등록할 수 없습니다.'
            : '서버 오류가 발생했습니다.';
      return HttpResponse.json({ error: message }, { status });
    }

    const formData = await request.formData();
    const dataPart = formData.get('data');

    if (!dataPart) {
      return HttpResponse.json({ error: '요청 데이터가 없습니다.' }, { status: 400 });
    }

    let payload: CreateListingRequest;

    try {
      const jsonText = typeof dataPart === 'string' ? dataPart : await dataPart.text();
      payload = JSON.parse(jsonText) as CreateListingRequest;
    } catch {
      return HttpResponse.json({ error: '요청 데이터 파싱 실패' }, { status: 400 });
    }

    const seller = getUserFromAuthHeader(request.headers.get('authorization'));
    if (!seller) {
      return HttpResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const images = formData
      .getAll('images')
      .filter((image): image is File => image instanceof File && image.size > 0);

    const imageUrls = images.map((image) => {
      if (typeof URL.createObjectURL === 'function') {
        return URL.createObjectURL(image);
      }

      return `mock-file://${image.name}`;
    });

    const { itemId } = addCreatedListing({ data: payload, imageUrls, seller });

    return HttpResponse.json({
      itemId,
      message: '물품이 등록되었습니다.',
    });
  }),
];
