export const formatPrice = (price: number) => price.toLocaleString('ko-KR');

export const formatDate = (dateString: string): string => {
  const date = dateString.split('T')[0];
  return date != null && date !== '' ? date : '정보 없음';
};
