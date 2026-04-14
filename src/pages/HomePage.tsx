import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import mainBgImage from '@/assets/main.png';
import { getProductList } from '@/features/product/api/product.api';
import { productKeys } from '@/features/product/queryKeys';
import { ProductItem, ProductType } from '@/features/product/types/productList';
import { formatDate, formatPrice } from '@/shared/utils';

const HOME_SHOWCASE_PARAMS = {};

const serviceHighlights = [
  {
    title: '중고거래 + 단기렌탈',
    description:
      '잠깐 쓰고 정리해야 하는 교환학생 생활에 맞춰 구매와 대여를 한 서비스 안에서 이어지게 구성했습니다.',
    badge: 'Core',
  },
  {
    title: '지역 기반 탐색',
    description:
      '위치, 카테고리, 키워드를 함께 사용해 생활 반경 안에서 빠르게 필요한 물품을 찾을 수 있습니다.',
    badge: 'Search',
  },
  {
    title: '거래 요청부터 채팅까지',
    description:
      '상품 상세에서 거래 요청을 보내고 바로 채팅으로 이어져, 협의 과정을 자연스럽게 연결합니다.',
    badge: 'Flow',
  },
];

const flowSteps = [
  {
    step: '01',
    title: '필요한 물품 찾기',
    description: '지역, 카테고리, 키워드 기반으로 중고거래와 단기렌탈 물품을 빠르게 탐색합니다.',
  },
  {
    step: '02',
    title: '거래 방식 선택',
    description: '구매가 나은지, 짧게 빌리는 게 나은지 상황에 맞춰 바로 판단할 수 있습니다.',
  },
  {
    step: '03',
    title: '요청 및 채팅 진행',
    description: '거래 요청과 채팅을 연결해 판매자와 일정, 장소, 조건을 효율적으로 조율합니다.',
  },
  {
    step: '04',
    title: '거래 관리',
    description: '보낸 요청, 받은 요청, 거래 내역, 렌탈 상태를 마이페이지에서 확인하고 관리합니다.',
  },
];

const featureCards = [
  {
    title: '생활 반경 안에서 거래',
    description:
      '교환학생은 이동 범위가 제한적인 경우가 많기 때문에 지역 기반 탐색 경험을 우선으로 설계했습니다.',
  },
  {
    title: '짧은 체류 기간에 맞는 렌탈',
    description:
      '가구, 전자기기, 생활용품처럼 잠깐 필요하지만 구매 부담이 큰 물품을 단기렌탈로 연결합니다.',
  },
  {
    title: '판매자 정보와 최근 게시글 확인',
    description:
      '상세 페이지에서 판매자와 최근 등록 물품을 함께 보여줘 거래 맥락을 더 쉽게 파악할 수 있습니다.',
  },
  {
    title: '거래 후 관리까지 고려',
    description:
      '렌탈 기간, 거래 요청 상태, 거래 내역을 마이페이지에서 관리할 수 있도록 흐름을 이어집니다.',
  },
];

const HomePage = () => {
  const [resaleQuery, rentalQuery] = useQueries({
    queries: [
      {
        queryKey: productKeys.list('resale', HOME_SHOWCASE_PARAMS),
        queryFn: () => getProductList('resale', HOME_SHOWCASE_PARAMS),
      },
      {
        queryKey: productKeys.list('rental', HOME_SHOWCASE_PARAMS),
        queryFn: () => getProductList('rental', HOME_SHOWCASE_PARAMS),
      },
    ],
  });

  const latestResaleItems = resaleQuery.data?.items.slice(0, 3) ?? [];
  const latestRentalItems = rentalQuery.data?.items.slice(0, 3) ?? [];

  return (
    <div className="flex w-full flex-col items-center overflow-hidden">
      <section className="relative flex min-h-[780px] w-full max-w-[1400px] flex-col justify-between bg-white px-6 pb-10 pt-10 lg:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative z-10 mt-10 flex max-w-[620px] flex-col gap-5 lg:mt-[120px]">
            <div className="flex flex-col gap-2">
              <p className="font-yangjin text-4xl leading-snug text-black-200 animate-fade-in-up lg:text-5xl">
                교환학생 라이프 올인원 플랫폼
              </p>
              <p
                className="font-yangjin text-sm text-black-200 animate-fade-in-up lg:text-4xl"
                style={{ animationDelay: '0.2s' }}
              >
                나누고 빌리고, 함께 떠나는
              </p>
              <p
                className="mt-1 font-maplestory text-4xl font-extrabold text-primary-200 animate-fade-in-up lg:text-5xl"
                style={{ animationDelay: '0.4s' }}
              >
                Swap&amp;Go
              </p>
            </div>

            <p
              className="max-w-[560px] text-base leading-relaxed text-black-150 animate-fade-in-up lg:text-lg"
              style={{ animationDelay: '0.6s' }}
            >
              필요한 물건은 빠르게 구하고, 떠날 때는 가볍게 정리할 수 있도록 중고거래와 단기렌탈을
              하나의 흐름으로 연결한 서비스입니다.
            </p>

            <div
              className="flex flex-col gap-3 pt-4 animate-fade-in-up sm:flex-row"
              style={{ animationDelay: '0.8s' }}
            >
              <Link
                to="/resale"
                className="inline-flex h-[54px] items-center justify-center rounded-2xl bg-primary-200 px-6 text-base font-semibold text-white transition-colors hover:bg-primary-150"
              >
                중고거래 둘러보기
              </Link>
              <Link
                to="/rental"
                className="inline-flex h-[54px] items-center justify-center rounded-2xl border border-primary-100 bg-white px-6 text-base font-semibold text-primary-200 transition-colors hover:bg-primary-50"
              >
                단기렌탈 살펴보기
              </Link>
            </div>
          </div>

          <HeroVisual />
        </div>

        <div className="relative z-10 mt-12 grid gap-4 lg:mt-0 lg:grid-cols-3">
          {serviceHighlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-[28px] border border-primary-50 bg-white p-6 shadow-[0_18px_50px_rgba(39,38,67,0.06)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
                {highlight.badge}
              </span>
              <h2 className="mt-3 text-xl font-bold text-black-200">{highlight.title}</h2>
              <p className="mt-3 text-sm leading-6 text-black-150">{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="w-full bg-[linear-gradient(180deg,#F1F3E0_0%,#FCFCF7_100%)] px-6 py-20 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-12">
          <div className="flex flex-col gap-4 text-center">
            <span className="font-maplestory text-sm font-bold text-primary-200">HOW IT WORKS</span>
            <h2 className="font-yangjin text-3xl text-black-200 lg:text-5xl">
              Swap&amp;Go에서 시작하는
              <br />
              교환학생 생활 루틴
            </h2>
            <p className="mx-auto max-w-[760px] text-sm leading-7 text-black-150 lg:text-base">
              필요한 물건을 찾는 순간부터 거래 요청, 채팅, 거래 내역 관리까지 교환학생의 실제 생활
              흐름에 맞춘 서비스
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {flowSteps.map((flowStep) => (
              <article
                key={flowStep.step}
                className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_18px_40px_rgba(119,136,115,0.10)]"
              >
                <div className="absolute right-4 top-4 text-5xl font-bold text-primary-50">
                  {flowStep.step}
                </div>
                <span className="text-sm font-semibold text-primary-200">{flowStep.step}</span>
                <h3 className="mt-4 text-xl font-bold text-black-200">{flowStep.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black-150">{flowStep.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-20 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1400px] gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-black-200 px-8 py-10 text-white shadow-[0_22px_60px_rgba(39,38,67,0.14)]">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-100">
              Why Swap&amp;Go
            </span>
            <h2 className="mt-5 font-yangjin text-3xl leading-snug lg:text-5xl">
              교환학생에게
              <br />
              필요한 거래 경험을
              <br />
              다시 설계했습니다.
            </h2>
            <p className="mt-6 max-w-[520px] text-sm leading-7 text-white/80 lg:text-base">
              일반적인 중고거래 서비스는 단기 체류자에게 꼭 맞지 않습니다. Swap&amp;Go는 짧은 체류
              기간, 제한된 이동 반경, 빠른 거래 정리 니즈를 기준으로 탐색부터 거래 관리까지
              연결합니다.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="text-3xl font-bold text-primary-100">2 in 1</span>
                <p className="mt-2 text-sm text-white/75">
                  중고거래와 단기렌탈을 한 흐름 안에서 탐색
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="text-3xl font-bold text-primary-100">Local First</span>
                <p className="mt-2 text-sm text-white/75">
                  지역 기반으로 빠르게 찾고 만나기 쉬운 구조
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[28px] border border-primary-50 bg-white p-7 shadow-[0_18px_45px_rgba(39,38,67,0.08)] transition-transform hover:-translate-y-1"
              >
                <div className="h-3 w-16 rounded-full bg-primary-100" />
                <h3 className="mt-5 text-xl font-bold text-black-200">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-black-150">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#FCFCF7] px-6 py-20 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-14">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="font-maplestory text-sm font-bold text-primary-200">
                LIVE SHOWCASE
              </span>
              <h2 className="mt-3 font-yangjin text-3xl text-black-200 lg:text-5xl">
                지금 올라온 물품을
                <br />
                홈에서 바로 확인해보세요
              </h2>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <ShowcaseSection
              title="최신 중고거래"
              description="교환학생이 빠르게 사고 팔 수 있는 생활 물품"
              type="resale"
              href="/resale"
              items={latestResaleItems}
              isLoading={resaleQuery.isLoading}
              isError={resaleQuery.isError}
            />
            <ShowcaseSection
              title="최신 단기렌탈"
              description="짧은 체류에 맞춘 가벼운 대여 물품"
              type="rental"
              href="/rental"
              items={latestRentalItems}
              isLoading={rentalQuery.isLoading}
              isError={rentalQuery.isError}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const HeroVisual = () => {
  return (
    <div className="relative flex min-h-[560px] items-center justify-center bg-white lg:min-h-[680px]">
      <img
        src={mainBgImage}
        alt="Swap&Go 메인 비주얼"
        className="w-full max-w-[620px] object-contain"
      />
    </div>
  );
};

interface ShowcaseSectionProps {
  title: string;
  description: string;
  type: ProductType;
  href: string;
  items: ProductItem[];
  isLoading: boolean;
  isError: boolean;
}

const ShowcaseSection = ({
  title,
  description,
  type,
  href,
  items,
  isLoading,
  isError,
}: ShowcaseSectionProps) => {
  const isEmpty = !isLoading && !isError && items.length === 0;

  return (
    <section className="rounded-[32px] border border-primary-50 bg-white p-7 shadow-[0_18px_45px_rgba(39,38,67,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-sm font-semibold text-primary-200">{title}</span>
          <h3 className="mt-2 text-2xl font-bold text-black-200">{description}</h3>
        </div>
        <Link
          to={href}
          className="shrink-0 rounded-full border border-primary-100 px-4 py-2 text-sm font-semibold text-primary-200 transition-colors hover:bg-primary-50"
        >
          전체보기
        </Link>
      </div>

      {isLoading && (
        <div className="mt-8 grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[24px] bg-gray-100" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-8 rounded-[24px] bg-red-50 px-6 py-8 text-center">
          <p className="text-base font-semibold text-gray-800">상품을 불러오지 못했습니다.</p>
          <p className="mt-2 text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
        </div>
      )}

      {isEmpty && (
        <div className="mt-8 rounded-[24px] bg-gray-50 px-6 py-8 text-center">
          <p className="text-base font-semibold text-gray-800">아직 등록된 상품이 없습니다.</p>
          <p className="mt-2 text-sm text-gray-500">첫 번째 게시글을 등록해보세요.</p>
        </div>
      )}

      {!isLoading && !isError && !isEmpty && (
        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <Link
              key={`${type}-${item.itemId}`}
              to={`/product/${type}/${item.itemId}`}
              className="group flex gap-4 rounded-[24px] border border-gray-100 p-4 transition-colors hover:border-primary-100 hover:bg-primary-50/40"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[20px] bg-gray-100">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="line-clamp-1 text-lg font-bold text-black-200">{item.title}</h4>
                  <span className="shrink-0 text-xs text-black-100">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-black-150">{item.region}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-200">
                    {formatPrice(item.price)}원
                  </span>
                  {item.deposit !== null && (
                    <span className="rounded-full bg-[#FFF7ED] px-3 py-1 text-sm font-semibold text-[#AE6A1D]">
                      보증금 {formatPrice(item.deposit)}원
                    </span>
                  )}
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-black-150">
                    {item.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default HomePage;
