import { SearchBar } from '@/shared/ui';

type onSearchProps = {
  category: string;
  query: string;
};

const HomePage = () => {
  const onSearch = ({ category, query }: onSearchProps) => {
    console.log('선택한 카테고리 ' + category);
    console.log('검색한 단어 ' + query);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-[1400px] h-[600px] items-center px-24">
        <div className="flex justify-between px-[60px] pt-[100px] mb-[30px] w-full">
          <div className="flex flex-col justify-end gap-1">
            <p className="text-3xl font-semibold">교환학생 라이프 올인원 플랫폼</p>
            <p className="text-2xl font-semibold">나누고 빌리고, 함께 떠나는</p>
            <p className="text-4xl font-extrabold text-primary-100">Swap&Go</p>
          </div>
          <img src="/main.svg" alt="logo" className="w-[470px] h-[318px]" />
        </div>
        <div>
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
      {/* 보라색 섹션 */}
      <div className="flex flex-col items-center w-screen bg-primary-50 h-[500px] py-8 gap-8">
        <div className="flex gap-2">
          <span className="text-3xl font-black text-primary-100">Swap&Go</span>
          <span className="text-3xl font-semibold text-white">에서 시작해요!</span>
        </div>
        <div className="flex w-[1400px] border-2 h-[400px]"></div>
      </div>
    </div>
  );
};

export default HomePage;
