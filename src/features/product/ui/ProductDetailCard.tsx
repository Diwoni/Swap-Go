import { formatDate, formatPrice } from '../../../shared/utils';
import { useProductLike } from '../hooks/useProductLike';
import { RentalProductDetail, ResaleProductDetail } from '../types/productDetail';
import { LikeButton } from './LikeButton';

const isRentalProduct = (
  data: ResaleProductDetail | RentalProductDetail
): data is RentalProductDetail => 'rentalInfo' in data;

type Props = {
  type: 'resale' | 'rental';
  productData: ResaleProductDetail | RentalProductDetail;
};

export const ProductDetailCard = ({ type, productData }: Props) => {
  const { itemId, title, images, isLiked, isMine } = productData;
  const { isLiked: currentLikeState, toggleLike } = useProductLike(isLiked, itemId);

  return (
    <div className="flex w-full justify-center items-start p-10">
      <ImageSection src={images[0]} alt={title} />

      <div className="flex h-[500px] w-[650px] flex-col px-10">
        <Header title={title}>
          <LikeButton isLiked={currentLikeState} onToggle={toggleLike} />
        </Header>
        <MetaInfo type={type} data={productData} />
        <DetailList type={type} data={productData} />
        <ActionButtons isMine={isMine} />
      </div>
    </div>
  );
};

const Header = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex justify-between items-start">
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
    <div className="flex flex-col gap-1">
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
          <span className="text-[18px] text-gray-600 ml-2">보증금 - {formatPrice(deposit)}원</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-gray-600 mt-1">
        <LocationIcon />
        <span className="text-[16px]">{region}</span>
      </div>
    </div>
  );
};

const DetailList = ({
  type,
  data,
}: {
  type: 'rental' | 'resale';
  data: ResaleProductDetail | RentalProductDetail;
}) => {
  return (
    <div className="flex flex-col flex-1 mt-6 overflow-y-auto">
      <InfoRow label="판매자">{data.seller.username}</InfoRow>

      {/* 렌탈일 경우에만 렌더링 (조건부 렌더링 로직 내부 위임) */}
      <RentalInfo type={type} data={data} />

      <InfoRow label="물품 관련 내용">
        <p className="line-clamp-4">{data.content}</p>
      </InfoRow>
    </div>
  );
};

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

const ActionButtons = ({ isMine }: { isMine: boolean }) => {
  if (isMine) {
    return (
      <div className="flex gap-3 mt-4">
        <button
          className="btn btn-md btn-primary bg-black-200 hover:bg-[#000000]"
          onClick={() => alert('수정하기')}
        >
          게시글 수정하기
        </button>
        <button className="btn btn-md btn-primary" onClick={() => alert('삭제하기')}>
          게시글 삭제하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mt-4">
      <button
        className="btn btn-md btn-primary bg-black-200 hover:bg-[#000000]"
        onClick={() => alert('채팅 보내기')}
      >
        채팅 보내기
      </button>
      <button className="btn btn-md btn-primary" onClick={() => alert('거래 요청 보내기')}>
        거래 요청 보내기
      </button>
    </div>
  );
};

const InfoRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-4 last:mb-0">
    <span className="block text-[14px] font-semibold text-gray-800 mb-1">{label}</span>
    <div className="text-[16px] text-gray-600 leading-relaxed">{children}</div>
  </div>
);

const ImageSection = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="w-[500px] h-[500px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm shrink-0">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="flex w-full h-full items-center justify-center text-gray-400">
        이미지 없음
      </div>
    )}
  </div>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);
