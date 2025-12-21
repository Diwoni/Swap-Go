import { Autocomplete, GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { RiMapPin2Fill } from 'react-icons/ri';

import { Modal } from '../../../shared/ui';
import { AddressData, extractAddressComponents } from '../../../shared/utils/mapUtils';

type LocationPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: AddressData, lat: number, lng: number) => void;
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 37.5665,
  lng: 126.978,
};

// 이 배열은 컴포넌트 내부에서 places 로 선언하면 렌더링 될 때마다 새로 생성되어 무한 로딩이 발생할 수 있으므로 컴포넌트 외부에 선언
const libraries: ('places' | 'geometry' | 'drawing' | 'visualization')[] = ['places'];

export const LocationPickerModal = ({
  isOpen,
  onClose,
  onSelectLocation,
}: LocationPickerModalProps) => {
  // 컴포넌트가 렌더링될 때만 스크립트를 로드하는 hook
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
    language: 'en',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [address, setAddress] = useState<string>('위치를 찾는중..');
  const [currentDetails, setCurrentDetails] = useState<AddressData | null>(null);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        map?.panTo({ lat: newLat, lng: newLng });
        // panTo 이후 자동으로 onIdle 이 호출되어 주소를 업데이트함.
      } else {
        toast.error('장소 정보를 찾을 수 없습니다.');
      }
    }
  };

  const onIdle = useCallback(() => {
    if (!map) return;

    const newCenter = map.getCenter();
    if (!newCenter) return;

    const lat = newCenter.lat();
    const lng = newCenter.lng();
    setCenter({ lat, lng });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if ((status as string) === 'OK' && results?.[0]) {
        const parsedAddress = extractAddressComponents(results);
        setAddress(parsedAddress.fullAddress);
        setCurrentDetails(parsedAddress);
      } else {
        setAddress('주소를 가져오지 못했습니다. 다시 시도해주세요.');
      }
    });
  }, [map]);

  const confirmLocation = () => {
    if (currentDetails) {
      // SignupForm 으로 주소 데이터 전달 (트리거 역할)
      onSelectLocation(currentDetails, center.lat, center.lng);
      onClose();
    } else {
      toast('주소 정보를 불러오는 중입니다.');
    }
  };

  if (!isOpen) return null;

  if (!isLoaded) {
    // TODO : 로딩 스패너로 교체
    return <div>Loading...</div>;
  }

  return (
    <Modal isModalOpen={isOpen} closeModal={onClose} className="w-[600px] p-6">
      <h2 className="text-xl font-bold mb-4">위치 검색 및 설정</h2>

      <div className="mb-4 relative z-20">
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="장소를 검색하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </Autocomplete>
      </div>

      <div className="relative w-full h-[400px] border border-gray-200 rounded overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={(map) => setMap(map)}
          onIdle={onIdle}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none pb-8">
            <span className="text-4xl filter drop-shadow-md">
              <RiMapPin2Fill color="#3b82f6" />
            </span>
          </div>
        </GoogleMap>
      </div>

      <div className="mt-4 p-3 bg-gray-50 border rounded text-center font-medium">{address}</div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          취소
        </button>
        <button
          onClick={confirmLocation}
          className="px-6 py-2 bg-orange-500 text-white font-bold rounded hover:bg-orange-600"
        >
          이 위치 선택
        </button>
      </div>
    </Modal>
  );
};
