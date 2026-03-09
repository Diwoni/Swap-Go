import React from 'react';

import { MAX_LISTING_IMAGE_COUNT } from '../types/listing.types';

type Props = {
  previews: string[];
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  error?: string;
};

export const ListingImageUploader = ({ previews, onAddImages, onRemoveImage, error }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAddImages(event.target.files);
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3 w-[430px]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">이미지</span>
        <span className="text-xs text-gray-400">
          {previews.length}/{MAX_LISTING_IMAGE_COUNT}장
        </span>
      </div>

      <label
        htmlFor="listing-image-upload"
        className="flex items-center justify-center h-[120px] border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 text-gray-500 hover:border-primary-200 hover:text-gray-700 transition-colors cursor-pointer"
      >
        <input
          id="listing-image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <div className="text-sm">클릭해서 이미지 업로드</div>
      </label>
      <span className="text-xs text-gray-400">
        최대 {MAX_LISTING_IMAGE_COUNT}장까지 등록할 수 있습니다.
      </span>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative w-full h-[100px] rounded-lg overflow-hidden border border-gray-100 bg-gray-100"
            >
              <img src={src} alt={`preview-${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
