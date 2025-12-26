import mainBgImage from '@/assets/main_bg.svg';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex flex-col w-[1400px] h-[780px] items-center px-24">
        <div className="flex justify-between px-[60px] w-full">
          <div className="relative flex flex-col mt-[180px] gap-1 z-10">
            <p className="font-yangjin text-6xl animate-fade-in-up">
              교환학생 라이프 올인원 플랫폼
            </p>
            <p
              className="font-yangjin text-4xl animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              나누고 빌리고, 함께 떠나는
            </p>
            <p
              className="font-maplestory mt-2 text-5xl font-extrabold text-primary-200 animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              Swap&Go
            </p>
          </div>
        </div>

        <img
          src={mainBgImage}
          alt="Main Background"
          className="absolute bottom-0 right-0 w-[1050px] h-[450px] object-cover pointer-events-none -z-0"
        />
      </div>
      {/* 섹션 2 */}
      <div className="flex flex-col items-center w-screen bg-primary-50 h-[500px] py-8 gap-8">
        <div className="flex gap-2">
          <span className="font-maplestory text-4xl font-black text-primary-150">Swap&Go</span>
          <span className="text-4xl font-yangjin text-primary-200">에서 시작해요!</span>
        </div>
        <div className="flex w-[1400px] border-2 h-[400px]"></div>
      </div>
      <div></div>
    </div>
  );
};

export default HomePage;
