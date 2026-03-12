import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CiLocationOn } from 'react-icons/ci';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { useModal } from '../../../shared/hooks';
import { formatDate, formatPrice } from '../../../shared/utils';
import { useDeleteListing, useUpdateListing } from '../../listing/hooks/useListingMutation';
import { ListingRequest } from '../../listing/types/listing.types';
import { EditListingModal } from '../../listing/ui/EditListingModal';
import { TradeRequestButton } from '../../trade/ui/TradeRequestButton';
import { useProductLike } from '../hooks/useProductLike';
import { RentalProductDetail, ResaleProductDetail } from '../types/productDetail';
import { LikeButton } from './LikeButton';

type Props = {
  type: 'resale' | 'rental';
  productData: ResaleProductDetail | RentalProductDetail;
};

const isRentalProduct = (
  data: ResaleProductDetail | RentalProductDetail
): data is RentalProductDetail => 'rentalInfo' in data;

const IMAGE_FALLBACK_TEXT = '이미지 없음';

export const ProductDetailCard = ({ type, productData }: Props) => {
  const { itemId, title, images, isLiked, isMine } = productData;

  const { isLiked: currentLikeState, toggleLike } = useProductLike(isLiked, itemId);
  const { isModalOpen, openModal, closeModal } = useModal();
  const { mutate: updateListing, isPending: isUpdating } = useUpdateListing();
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  const handleSave = (formData: ListingRequest) => {
    updateListing(
      { itemId, data: formData },
      {
        onSuccess: () => {
          toast.success('게시물이 수정되었습니다.');
          closeModal();
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) deleteListing(itemId);
  };

  return (
    <div className="flex w-full justify-center items-start p-10">
      <ImageSection images={images} alt={title} />

      <div className="flex h-[500px] w-[650px] flex-col px-10">
        <Header title={title}>
          <LikeButton isLiked={currentLikeState} onToggle={toggleLike} />
        </Header>

        <MetaInfo type={type} data={productData} />
        <DetailList type={type} data={productData} />

        <div className="mt-auto pt-6">
          {isMine ? (
            <OwnerActions onEdit={openModal} onDelete={handleDelete} isDeleting={isDeleting} />
          ) : (
            <ViewerActions type={type} itemId={itemId} />
          )}
        </div>
      </div>

      {isMine && (
        <EditListingModal
          isOpen={isModalOpen}
          onClose={closeModal}
          productData={productData}
          onSubmit={handleSave}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  );
};

const OwnerActions = ({
  onEdit,
  onDelete,
  isDeleting,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) => (
  <div className="flex gap-3">
    <button
      type="button"
      onClick={onEdit}
      className="flex-1 h-[50px] rounded-lg bg-[#2C2C35] text-white font-medium hover:bg-[#1a1a1f] transition-colors"
    >
      게시글 수정하기
    </button>
    <button
      type="button"
      onClick={onDelete}
      disabled={isDeleting}
      className="flex-1 h-[50px] rounded-lg border border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isDeleting ? '삭제 중...' : '게시글 삭제하기'}
    </button>
  </div>
);

const ViewerActions = ({ type, itemId }: { type: 'resale' | 'rental'; itemId: number }) => (
  <div className="flex gap-3">
    <button
      type="button"
      onClick={() => alert('채팅 기능 준비 중입니다.')}
      className="flex-1 h-[50px] rounded-lg bg-[#2C2C35] text-white font-medium hover:bg-[#1a1a1f] transition-colors"
    >
      채팅 보내기
    </button>
    <div className="flex-1 h-[50px]">
      <TradeRequestButton type={type} itemId={itemId} />
    </div>
  </div>
);

// ... (Header, MetaInfo, DetailList, RentalInfo, InfoRow, ImageSection 등 나머지 컴포넌트는 UI 변경사항 없으므로 유지) ...
const Header = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex justify-between items-start mb-4">
    <h1 className="text-[22px] font-bold text-gray-900 leading-tight">{title}</h1>
    {children}
  </div>
);

const MetaInfo = ({
  type,
  data,
}: {
  type: 'rental' | 'resale';
  data: ResaleProductDetail | RentalProductDetail;
}) => {
  const { price, region, createdAt, category } = data;
  const isRental = type === 'rental' && isRentalProduct(data);
  const deposit = isRental ? data.deposit : null;

  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 pb-6">
      <div className="text-[14px] text-gray-500 flex gap-3 mb-1">
        <span>{formatDate(createdAt)}</span>
        <span>{category}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[24px] font-semibold text-gray-900">
          {formatPrice(price)}원
          {isRental && <span className="text-[18px] font-normal"> / (월)</span>}
        </span>
        {deposit !== null && (
          <span className="text-[18px] text-gray-600 ml-2">보증금 {formatPrice(deposit)}원</span>
        )}
      </div>
      <div className="flex items-center gap-1 text-gray-600 mt-1">
        <CiLocationOn />
        <span className="text-[16px]">{region}</span>
      </div>
      <InfoRow label="판매자">{data.seller.username}</InfoRow>
      <RentalInfo type={type} data={data} />
    </div>
  );
};

const DetailList = ({
  data,
}: {
  type: 'rental' | 'resale';
  data: ResaleProductDetail | RentalProductDetail;
}) => (
  <div className="flex flex-col flex-1 mt-6 overflow-y-auto custom-scrollbar pr-2">
    <InfoRow label="물품 관련 내용">
      <p className="whitespace-pre-wrap">{data.content}</p>
    </InfoRow>
  </div>
);

const RentalInfo = ({
  type,
  data,
}: {
  type: string;
  data: ResaleProductDetail | RentalProductDetail;
}) => {
  if (type !== 'rental' || !isRentalProduct(data)) return null;
  const { rentedFrom, rentedUntil, isCurrentlyRented } = data.rentalInfo;
  return (
    <InfoRow label="현재 상품 대여 상태">
      {isCurrentlyRented && rentedFrom && rentedUntil ? (
        <span>
          {rentedFrom} ~ {rentedUntil}
          <span className="ml-2 font-medium text-gray-500">(대여중)</span>
        </span>
      ) : (
        <span>대여 가능</span>
      )}
    </InfoRow>
  );
};

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4 last:mb-0">
    <span className="block text-[14px] font-semibold text-gray-800 mb-1">{label}</span>
    <div className="text-[16px] text-gray-600 leading-relaxed">{children}</div>
  </div>
);

const ImageSection = ({ images, alt }: { images: string[]; alt: string }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="w-[500px] h-[500px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm shrink-0 border border-gray-100">
        <div className="flex w-full h-full items-center justify-center text-gray-400">
          {IMAGE_FALLBACK_TEXT}
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  const moveToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const moveToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-[500px] shrink-0">
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
        <img
          src={currentImage}
          alt={`${alt} 이미지 ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {hasMultipleImages && (
          <>
            <CarouselButton direction="left" onClick={moveToPrevious} label="이전 이미지 보기" />
            <CarouselButton direction="right" onClick={moveToNext} label="다음 이미지 보기" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`h-20 overflow-hidden rounded-xl border transition-all ${
                  isSelected
                    ? 'border-primary-200 ring-2 ring-primary-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`${index + 1}번째 이미지 보기`}
              >
                <img
                  src={image}
                  alt={`${alt} 썸네일 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CarouselButton = ({
  direction,
  onClick,
  label,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  label: string;
}) => {
  const isLeft = direction === 'left';
  const Icon = isLeft ? IoIosArrowBack : IoIosArrowForward;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-3 text-white transition-colors hover:bg-black/60 ${
        isLeft ? 'left-4' : 'right-4'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
};
