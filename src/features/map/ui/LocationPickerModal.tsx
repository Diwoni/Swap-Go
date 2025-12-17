import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import { Modal } from '../../../shared/ui';

type LocationPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
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

export const LocationPickerModal = ({ isOpen, onClose }: LocationPickerModalProps) => {
  // 컴포넌트가 렌더링될 때만 스크립트를 로드하는 hook
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
    language: 'en',
  });

  if (!isOpen) return null;

  if (!isLoaded) {
    // TODO : 로딩 스패너로 교체
    return <div>Loading...</div>;
  }

  return (
    <Modal isModalOpen={isOpen} closeModal={onClose} className="w-[600px] p-6">
      <h2>위치 검색 및 설정</h2>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        X
      </button>
      {/* 지도 영역 */}
      <div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={15}
          options={{ disableDefaultUI: true, zoomControl: true }}
        ></GoogleMap>
      </div>
    </Modal>
  );
};
