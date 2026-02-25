import { BiX } from 'react-icons/bi';

import { Modal } from '../../../shared/ui/Modal';
import { RentalProductDetail, ResaleProductDetail } from '../../product/types/productDetail';
import { useListingForm } from '../hooks/useListingForm';
import { ListingRequest } from '../types/listing.types';
import { ListingForm } from './ListingForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productData: ResaleProductDetail | RentalProductDetail;
  onSubmit: (data: ListingRequest) => void;
  isSubmitting: boolean;
};

export const EditListingModal = ({
  isOpen,
  onClose,
  productData,
  onSubmit,
  isSubmitting,
}: Props) => {
  const { form, isMapLoaded, currentItemType, handleSubmit } = useListingForm({
    initialData: productData,
    onSubmit,
  });

  return (
    <Modal
      isModalOpen={isOpen}
      closeModal={onClose}
      className="w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[20px]"
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="relative">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[24px] font-bold text-gray-900">게시물 수정</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <BiX size={28} />
          </button>
        </div>

        {/* Body (재사용 가능한 폼 필드 컴포넌트) */}
        <div className="p-8">
          <ListingForm form={form} isMapLoaded={isMapLoaded} itemType={currentItemType} />
        </div>

        {/* Footer (모달 전용 버튼) */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 flex gap-3 justify-center z-10 rounded-b-[20px]">
          <button
            type="button"
            onClick={onClose}
            className="w-[140px] h-[50px] rounded-lg bg-[#2C2C35] text-white font-medium hover:bg-[#1a1a1f] transition-colors"
          >
            취소하기
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-[280px] h-[50px] rounded-lg bg-[#A7C47B] text-white font-medium hover:bg-[#96b36a] transition-colors disabled:opacity-70"
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
