import { useState } from 'react';

type onSearchProps = {
  category: string;
  query: string;
};

type Props = {
  categories: string[];
  onSearch: ({ category, query }: onSearchProps) => void;
};

export const useSearchBar = ({ categories, onSearch }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchValue, setSearchValue] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    closeDropdown();
  };

  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const doSearch = () => {
    onSearch({ category: selectedCategory, query: searchValue });
  };

  return {
    isDropdownOpen,
    selectedCategory,
    searchValue,
    toggleDropdown,
    selectCategory,
    updateSearchValue,
    doSearch,
  };
};
