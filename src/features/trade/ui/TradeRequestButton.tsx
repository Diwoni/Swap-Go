import toast from 'react-hot-toast';

import { useModal, useProtectedAction } from '@/shared/hooks';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

import { useRequestResaleTrade } from '../hooks/useRequestTrade';
import { RentalRequestModal } from './RentalRequestModal';

type Props = {
  type: 'resale' | 'rental';
  itemId: number;
};

export const TradeRequestButton = ({ type, itemId }: Props) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const { mutate: requestResale, isPending: isResalePending } = useRequestResaleTrade();
  const { withAuth } = useProtectedAction();

  const handleClick = () => {
    withAuth(() => openModal());
  };

  const handleConfirmResale = () => {
    requestResale(
      { itemId },
      {
        onSuccess: () => {
          toast.success('거래 요청을 보냈어요.');
          closeModal();
        },
      }
    );
  };

  return (
    <>
      <button className="btn btn-md btn-primary" onClick={handleClick} disabled={isResalePending}>
        거래 요청 보내기
      </button>

      {type === 'resale' && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleConfirmResale}
          title="거래 요청"
          message="판매자에게 거래 요청을 보낼까요?"
          confirmText="전송"
          cancelText="취소"
          isPending={isResalePending}
        />
      )}
      {type === 'rental' && (
        <RentalRequestModal isOpen={isModalOpen} onClose={closeModal} itemId={itemId} />
      )}
    </>
  );
};
