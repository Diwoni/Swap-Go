import { useState } from 'react';

export type MyPageSidebarOption = 'tradeOffer' | 'transaction';

export const useMyPage = () => {
  const [activeSidebarOption, setActiveSidebarOption] = useState<MyPageSidebarOption | null>(null);

  const handleSelectOption = (option: MyPageSidebarOption) => {
    setActiveSidebarOption((prev) => (prev === option ? null : option));
  };

  return { activeSidebarOption, handleSelectOption };
};
