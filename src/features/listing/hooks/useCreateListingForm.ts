import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateListingRequest, ListingRequest } from '../types/listing.types';
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

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    form.setValue('images', [...form.getValues('images'), ...newPreviews], {
      shouldValidate: true,
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
      form.setValue('images', next, { shouldValidate: true });
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
