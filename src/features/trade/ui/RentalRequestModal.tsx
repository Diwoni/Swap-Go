import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useDateRange } from '@/shared/hooks/useDateRange';
import { Modal } from '@/shared/ui';
import { DateRangeCalendar } from '@/shared/ui/DateRangeCalendar';

import { useRequestRentalTrade } from '../hooks/useRequestTrade';

interface RentalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
}

export const RentalRequestModal = ({ isOpen, onClose, itemId }: RentalRequestModalProps) => {
  const { dateRange, setDateRange, reset, formatted, display, isValid } = useDateRange();
  const { mutate: requestRental, isPending } = useRequestRentalTrade();

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleConfirm = () => {
    if (!isValid || !formatted.start || !formatted.end) return;

    requestRental(
      { itemId, startDate: formatted.start, endDate: formatted.end },
      {
        onSuccess: () => {
          toast.success('거래 요청을 보냈어요.');
          onClose();
        },
        onError: () => {
          toast.error('요청 전송에 실패했어요. 잠시 후 다시 시도해주세요.');
        },
      }
    );
  };

  return (
    <Modal isModalOpen={isOpen} closeModal={onClose} className="w-auto p-6">
      <div className="flex flex-col items-center gap-4">
        {/* Header Section */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">렌탈 기간 선택</h3>
          <p className="text-sm text-gray-500 mt-1">대여 시작일과 반납일을 선택해주세요.</p>
        </div>

        {/* Calendar Section */}
        <DateRangeCalendar selected={dateRange} onSelect={setDateRange} className="mb-2" />

        {/* Summary Section (선택 정보 요약) */}
        <div className="w-full bg-gray-50 rounded-lg p-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {display.start} ~ {display.end}
          </div>
          <div className="text-sm font-bold text-primary-200">{display.duration}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending || !isValid}
            className="flex-1 px-4 py-3 text-sm font-bold text-white bg-primary-150 rounded-xl hover:bg-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? '요청 중...' : '렌탈 요청하기'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
