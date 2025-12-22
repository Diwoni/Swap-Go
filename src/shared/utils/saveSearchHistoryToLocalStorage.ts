export const saveSearchHistoryToLocalStorage = (key: string, value: string) => {
  if (!value || value.trim() === '') return;

  const stored = localStorage.getItem(key);
  const searchHistoryList: string[] = stored ? JSON.parse(stored) : [];

  // 이미 그 검색어가 있었으면 지우고 다시 맨 앞에 추가
  const filteredList = searchHistoryList.filter((item) => item !== value);
  const updatedList = [value, ...filteredList].slice(0, 5);

  localStorage.setItem(key, JSON.stringify(updatedList));
};
