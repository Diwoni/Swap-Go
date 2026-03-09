import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import {
  CreateListingRequest,
  ListingRequest,
  MAX_LISTING_IMAGE_COUNT,
} from '../types/listing.types';
import { useCreateListingMutation } from './useCreateListingMutation';
import { useListingForm } from './useListingForm';

const formatCreatePayload = (data: ListingRequest): CreateListingRequest => {
  return {
    title: data.title,
    itemType: data.itemType,
    content: data.content,
    category: data.category,
    deposit: data.itemType === 'resale' ? null : (data.deposit ?? null),
    price: data.price,
    dealType: data.dealType,
    region: data.region,
  };
};

export const useCreateListingForm = () => {
  const navigate = useNavigate();
  const { mutate: createListing, isPending } = useCreateListingMutation();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const submitCreate = (data: ListingRequest) => {
    const payload = formatCreatePayload(data);

    createListing(
      { data: payload, images: imageFiles },
      {
        onSuccess: (response) => {
          navigate(`/product/${payload.itemType}/${response.itemId}`);
        },
      }
    );
  };

  const { form, isMapLoaded, currentItemType, handleSubmit } = useListingForm({
    onSubmit: submitCreate,
  });

  const addImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_LISTING_IMAGE_COUNT - imageFiles.length;
    if (remainingSlots <= 0) {
      toast.error(`이미지는 최대 ${MAX_LISTING_IMAGE_COUNT}장까지 등록할 수 있습니다.`);
      return;
    }

    const incomingFiles = Array.from(files);
    const newFiles = incomingFiles.slice(0, remainingSlots);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    if (incomingFiles.length > remainingSlots) {
      toast.error(`이미지는 최대 ${MAX_LISTING_IMAGE_COUNT}장까지 등록할 수 있습니다.`);
    }

    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    const nextImages = [...form.getValues('images'), ...newPreviews];
    form.setValue('images', nextImages, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    setImagePreviews((prev) => {
      const next = prev.filter((_, currentIndex) => currentIndex !== index);
      const removed = prev[index];
      if (removed) {
        URL.revokeObjectURL(removed);
      }
      form.setValue('images', next, { shouldValidate: true, shouldDirty: true });
      return next;
    });
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return {
    form,
    isMapLoaded,
    currentItemType,
    handleSubmit,
    imagePreviews,
    addImages,
    removeImage,
    isSubmitting: isPending,
  };
};
