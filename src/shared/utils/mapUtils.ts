import toast from 'react-hot-toast';

export type AddressData = {
  country: string;
  region: string;
  street: string;
  fullAddress: string;
};

export const extractAddressComponents = (results: google.maps.GeocoderResult[]): AddressData => {
  const result = results[0]; // 가장 정확도가 높은 첫번째 결과

  if (!result) {
    return {
      country: '',
      region: '',
      street: '',
      fullAddress: '',
    };
  }

  const components = result.address_components;

  let country = '';
  let region = '';
  let street = '';
  let locality = '';
  let sublocality = '';
  let adminLevel1 = '';

  if (!components) {
    toast.error('주소 정보를 가져오지 못했습니다. 다시 시도해주세요.');
  }

  components.forEach((component) => {
    const types = component.types;

    if (types.includes('country')) {
      country = component.long_name;
    }
    if (types.includes('route') || types.includes('street_address')) {
      street = component.long_name;
    }
    // 행정 구역별 분리 저장
    if (types.includes('locality')) {
      locality = component.long_name;
    }
    if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
      sublocality = component.long_name;
    }
    if (types.includes('administrative_area_level_1')) {
      adminLevel1 = component.long_name;
    }

    region = locality || sublocality || adminLevel1;
  });

  return {
    country,
    region,
    street: street || result.formatted_address,
    fullAddress: result.formatted_address,
  };
};
