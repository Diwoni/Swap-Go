import { useMyPage } from '@/features/mypage/hooks/useMyPage';
import { MyItemsSection } from '@/features/mypage/ui/MyItemsSection';
import { MyPageSidebar } from '@/features/mypage/ui/MyPageSidebar';
import { ProfileSection } from '@/features/mypage/ui/ProfileSection';
import { TradeOfferSection } from '@/features/mypage/ui/TradeOfferSection';
import { TransactionSection } from '@/features/mypage/ui/TransactionSection';

export const MyPage = () => {
  const { activeSidebarOption, handleSelectOption } = useMyPage();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex gap-8">
      <MyPageSidebar
        activeSidebarOption={activeSidebarOption}
        onSelectOption={handleSelectOption}
      />

      <div className="flex-1 space-y-8 min-w-0">
        <ProfileSection />
        <MyItemsSection />

        {activeSidebarOption === 'tradeOffer' && <TradeOfferSection />}
        {activeSidebarOption === 'transaction' && <TransactionSection />}
      </div>
    </div>
  );
};
