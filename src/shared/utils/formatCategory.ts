export const formatCategory = (category?: string | string[]): string | undefined => {
  if (!category) return undefined;
  return Array.isArray(category) ? category.join(',') : category;
};
