import toast from 'react-hot-toast';
import { CiLocationOn } from 'react-icons/ci';

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
      <ImageSection src={images[0]} alt={title} />

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
      <span>
        {rentedFrom} ~ {rentedUntil}
      </span>
      {isCurrentlyRented && <span className="ml-2 font-medium text-gray-500">(대여중)</span>}
    </InfoRow>
  );
};

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4 last:mb-0">
    <span className="block text-[14px] font-semibold text-gray-800 mb-1">{label}</span>
    <div className="text-[16px] text-gray-600 leading-relaxed">{children}</div>
  </div>
);

const ImageSection = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="w-[500px] h-[500px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm shrink-0 border border-gray-100">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="flex w-full h-full items-center justify-center text-gray-400">
        이미지 없음
      </div>
    )}
  </div>
);
