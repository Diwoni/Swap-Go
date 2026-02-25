import { zodResolver } from '@hookform/resolvers/zod';
import { useJsApiLoader } from '@react-google-maps/api';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { RentalProductDetail, ResaleProductDetail } from '../../product/types/productDetail';
import { ListingSchema, listingSchema } from '../types/listing.schema';
import { ListingRequest } from '../types/listing.types';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const libraries: ('places' | 'geometry' | 'drawing' | 'visualization')[] = ['places'];

type Props = {
  initialData?: ResaleProductDetail | RentalProductDetail; // 게시물 수정 시에만 존재
  onSubmit: (data: ListingRequest) => void;
};

export const useListingForm = ({ initialData, onSubmit }: Props) => {
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  });

  const form = useForm<ListingSchema>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      category: '',
      price: 0,
      deposit: null,
      content: '',
      region: '',
      itemType: 'resale',
      dealType: 'SELL',
      images: [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (initialData) {
      const isRental = 'rentalInfo' in initialData;
      reset({
        title: initialData.title,
        category: initialData.category,
        price: initialData.price,
        deposit: isRental ? initialData.deposit : null,
        content: initialData.content,
        region: initialData.region,
        itemType: isRental ? 'rental' : 'resale',
        dealType: 'SELL',
        images: initialData.images,
      });
    }
  }, [initialData, reset]);

  const currentItemType = form.watch('itemType');

  return {
    form,
    isMapLoaded,
    currentItemType,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};

export type ListingFormReturn = ReturnType<typeof useListingForm>;
