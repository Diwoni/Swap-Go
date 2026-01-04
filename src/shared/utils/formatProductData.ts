export const formatPrice = (price: number) => price.toLocaleString('ko-KR');

export const formatDate = (dateString: string) => dateString.split('T')[0];
