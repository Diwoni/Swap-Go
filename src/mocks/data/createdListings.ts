import sampleImg from '../../assets/image.png';
import { CreateListingRequest } from '../../features/listing/types/listing.types';
import { ProductItem } from '../../features/product/types';
import {
  RentalProductDetail,
  ResaleProductDetail,
} from '../../features/product/types/productDetail';
import { StoredUser } from '../auth.handlers';

type CreatedListing = {
  itemId: number;
  itemType: 'resale' | 'rental';
  createdAt: string;
  imageUrls: string[];
  data: CreateListingRequest;
  seller: StoredUser;
};

const createdListings: CreatedListing[] = [];

const getNextItemId = () => {
  const maxId = createdListings.reduce((max, listing) => Math.max(max, listing.itemId), 2000);
  return maxId + 1;
};

const getSellerId = (email: string) => {
  return Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const buildListItem = (listing: CreatedListing): ProductItem => {
  const { itemId, createdAt, imageUrls, data } = listing;

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
    thumbnailUrl: imageUrls[0] ?? sampleImg,
    createdAt,
  };
};

const getRecentPostsBySeller = (sellerEmail: string, currentItemId: number) => {
  return createdListings
    .filter((listing) => listing.seller.email === sellerEmail && listing.itemId !== currentItemId)
    .slice(0, 10)
    .map((listing) => ({
      ...buildListItem(listing),
      itemType: listing.itemType,
    }));
};

const buildDetail = (listing: CreatedListing) => {
  const { itemId, imageUrls, data, seller, createdAt } = listing;
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
    createdAt,
    images: imageUrls.length > 0 ? imageUrls : [sampleImg],
    seller: {
      sellerId: getSellerId(seller.email),
      username: seller.username,
    },
    recentPostsBySeller: getRecentPostsBySeller(seller.email, itemId),
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

export const addCreatedListing = ({
  data,
  imageUrls,
  seller,
}: {
  data: CreateListingRequest;
  imageUrls: string[];
  seller: StoredUser;
}) => {
  const itemId = getNextItemId();
  const createdAt = new Date().toISOString();

  createdListings.unshift({
    itemId,
    itemType: data.itemType,
    createdAt,
    imageUrls,
    data,
    seller,
  });

  return { itemId };
};

export const getCreatedListItems = (type: 'resale' | 'rental') => {
  return createdListings
    .filter((listing) => listing.itemType === type)
    .map((listing) => buildListItem(listing));
};

export const getCreatedDetail = (type: 'resale' | 'rental', itemId: number) => {
  const listing = createdListings.find(
    (createdListing) => createdListing.itemType === type && createdListing.itemId === itemId
  );

  if (!listing) {
    return undefined;
  }

  return buildDetail(listing);
};

export const clearCreatedListings = () => {
  createdListings.length = 0;
};
