import { Controller } from 'react-hook-form';

import { useCreateListingForm } from '../features/listing/hooks/useCreateListingForm';
import { ListingForm } from '../features/listing/ui/ListingForm';
import { ListingImageUploader } from '../features/listing/ui/ListingImageUploader';
import { TradeTypeSelector } from '../widgets/ui/SearchBar/components/TradeTypeSelector';

const ListingCreatePage = () => {
  const {
    form,
    isMapLoaded,
    currentItemType,
    handleSubmit,
    imagePreviews,
    addImages,
    removeImage,
    isSubmitting,
  } = useCreateListingForm();

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-[1120px] px-4 pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-[28px] font-bold text-gray-900">게시글 작성</h1>
        <p className="text-sm text-gray-500">중고거래 또는 단기렌탈 게시글을 등록해주세요.</p>
      </div>

      <form onSubmit={(event) => void handleSubmit(event)}>
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-gray-400">거래 유형</span>
              <Controller
                control={control}
                name="itemType"
                render={({ field }) => (
                  <TradeTypeSelector selected={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            {errors.itemType?.message && (
              <span className="text-xs text-red-500 font-medium">{errors.itemType.message}</span>
            )}

            <ListingForm form={form} isMapLoaded={isMapLoaded} itemType={currentItemType} />
          </div>

          <div className="flex flex-col gap-6">
            <ListingImageUploader
              previews={imagePreviews}
              onAddImages={addImages}
              onRemoveImage={removeImage}
            />
          </div>
        </div>

        <div className="mt-10 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-[280px] h-[50px] rounded-lg bg-[#A7C47B] text-white font-medium hover:bg-[#96b36a] transition-colors disabled:opacity-70"
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListingCreatePage;
