import { CiLocationOn } from 'react-icons/ci';
import { IoIosArrowDown } from 'react-icons/io';

export const LocationBar = () => {
  return (
    <button className="flex items-center justify-between p-4 w-[200px] h-[60px] border-2 border-primary-50 rounded-xl">
      <CiLocationOn className="w-8 h-8" />
      <span className="text-lg">국가 및 지역</span>
      <IoIosArrowDown className="w-6 h-6" />
    </button>
  );
};
