import sampleImg from '../../assets/image.png';
import { CreateListingRequest } from '../../features/listing/types/listing.types';
import { ProductItem } from '../../features/product/types';
import {
  RentalProductDetail,
  ResaleProductDetail,
} from '../../features/product/types/productDetail';

type CreatedListing = {
  itemId: number;
  itemType: 'resale' | 'rental';
  detail: ResaleProductDetail | RentalProductDetail;
  listItem: ProductItem;
};

const createdListings: CreatedListing[] = [];

const getNextItemId = () => {
  const maxId = createdListings.reduce((max, listing) => Math.max(max, listing.itemId), 2000);
  return maxId + 1;
};

const buildListItem = (data: CreateListingRequest, itemId: number): ProductItem => {
  return {
    itemId,
    title: data.title,
    price: data.price,
    deposit: data.itemType === 'rental' ? (data.deposit ?? 0) : null,
    region: data.region,
    dealType: data.dealType,
    category: data.category,
    isAvailable: true,
    isLiked: false,
    thumbnailUrl: sampleImg,
    createdAt: new Date().toISOString(),
  };
};

const buildDetail = (data: CreateListingRequest, itemId: number) => {
  const base: ResaleProductDetail = {
    itemId,
    title: data.title,
    content: data.content,
    price: data.price,
    region: data.region,
    category: data.category,
    isMine: true,
    isLiked: false,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    images: [sampleImg, sampleImg],
    seller: {
      sellerId: 1,
      username: '내 계정',
    },
    recentPostsBySeller: [],
  };

  if (data.itemType === 'rental') {
    const rentalDetail: RentalProductDetail = {
      ...base,
      deposit: data.deposit ?? 0,
      rentalInfo: {
        isCurrentlyRented: false,
        rentedFrom: '2026-03-01',
        rentedUntil: '2026-03-07',
      },
    };
    return rentalDetail;
  }

  return base;
};

export const addCreatedListing = (data: CreateListingRequest) => {
  const itemId = getNextItemId();
  const detail = buildDetail(data, itemId);
  const listItem = buildListItem(data, itemId);

  createdListings.unshift({
    itemId,
    itemType: data.itemType,
    detail,
    listItem,
  });

  return { itemId };
};

export const getCreatedListItems = (type: 'resale' | 'rental') => {
  return createdListings
    .filter((listing) => listing.itemType === type)
    .map((listing) => listing.listItem);
};

export const getCreatedDetail = (type: 'resale' | 'rental', itemId: number) => {
  return createdListings.find((listing) => listing.itemType === type && listing.itemId === itemId)
    ?.detail;
};
