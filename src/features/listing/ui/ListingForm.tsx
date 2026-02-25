import { Controller, UseFormReturn } from 'react-hook-form';

import { SidebarCategory } from '../../../widgets/ui/Sidebar/components/SidebarCategory';
import { SidebarDealType } from '../../../widgets/ui/Sidebar/components/SidebarDealType';
import { SidebarLocation } from '../../../widgets/ui/Sidebar/components/SidebarLocation';
import { ListingSchema } from '../types/listing.schema';

type Props = {
  form: UseFormReturn<ListingSchema>;
  isMapLoaded: boolean;
  itemType: 'resale' | 'rental';
};

export const ListingForm = ({ form, isMapLoaded, itemType }: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      {/* 제목 */}
      <Section label="제목" error={errors.title?.message}>
        <input {...register('title')} placeholder="제목을 입력해주세요" className="input" />
      </Section>

      {/* 가격, 보증금 */}
      <div className="flex gap-3 w-[430px]">
        <Section
          label={`가격 ${itemType === 'rental' ? '(월 기준)' : ''}`}
          error={errors.price?.message}
          className="flex-1"
        >
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="가격 입력"
            className="w-full h-[50px] input"
          />
        </Section>
        {itemType === 'rental' && (
          <Section label="보증금" className="flex-1" error={errors.deposit?.message}>
            <input
              type="number"
              {...register('deposit', { valueAsNumber: true })}
              placeholder="보증금 입력"
              className="w-full h-[50px] px-4 border border-gray-300 rounded-lg outline-none focus:border-[#88B04B] focus:ring-1 focus:ring-[#88B04B] transition-all"
            />
          </Section>
        )}
      </div>

      {/* 팝니다,삽니다 */}
      <div className="w-[430px]">
        <Controller
          control={control}
          name="dealType"
          render={({ field }) => (
            <SidebarDealType
              value={field.value}
              onChange={(val) => field.onChange(val ?? 'SELL')}
            />
          )}
        />
      </div>

      {/* 카테코리 */}
      <div className="w-[430px]">
        <Label text="카테고리" error={errors.category?.message} />
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-2">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SidebarCategory
                mode="single"
                selected={field.value ? [field.value] : []}
                onChange={(selected) => field.onChange(selected[0] ?? '')}
              />
            )}
          />
        </div>
      </div>

      {/* 지역 */}
      <div className="w-[430px]">
        <Label text="지역" error={errors.region?.message} />
        <div className="mt-2">
          <Controller
            control={control}
            name="region"
            render={({ field }) => (
              <SidebarLocation
                isLoaded={isMapLoaded}
                selectedLocation={field.value}
                onLocationChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      {/* 내용 */}
      <Section label="내용" error={errors.content?.message}>
        <textarea
          {...register('content')}
          placeholder="게시물 내용을 입력해주세요."
          className="w-[430px] h-[200px] p-4 border border-gray-300 rounded-lg outline-none focus:border-[#88B04B] focus:ring-1 focus:ring-[#88B04B] transition-all resize-none custom-scrollbar"
        />
      </Section>
    </div>
  );
};

const Label = ({ text, error }: { text: string; error?: string }) => (
  <div className="flex justify-between items-baseline">
    <label className="text-sm font-medium text-gray-400">{text}</label>
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);

const Section = ({
  label,
  children,
  className = '',
  error,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <Label text={label} error={error} />
    {children}
  </div>
);
