import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';
import { SearchCommentsModel } from '@dimasbaguspm/interfaces/notunic-api';

export interface CommentCategoryFilterModel extends Record<string, unknown> {
  categoryId?: number;
  categoryIds?: NonNullable<SearchCommentsModel>['categoryIds'];
}

const FILTERS = ['categoryId', 'categoryIds'] satisfies (keyof CommentCategoryFilterModel)[];

const HUMANIZED_FILTER_LABELS: Record<keyof CommentCategoryFilterModel, string> = {
  categoryId: 'Category',
  categoryIds: 'Categories',
} as const;

export const useCommentCategoryFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<CommentCategoryFilterModel>(opts);

  // parse applied filters with proper typing
  const appliedFilters: CommentCategoryFilterModel = {
    categoryId: filters.getSingle('categoryId') !== undefined ? Number(filters.getSingle('categoryId')) : undefined,
    categoryIds: (filters.getAll('categoryIds') || []).map(Number),
  };

  // Generate humanized filter labels for active filters
  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'categoryId':
          if (appliedFilters?.categoryId) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
        case 'categoryIds':
          if (appliedFilters?.categoryIds && appliedFilters.categoryIds.length > 0) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
      }
      return acc;
    },
    [] as [keyof CommentCategoryFilterModel, string][],
  );

  return {
    filters,

    // Computed values for convenience
    appliedFilters,
    humanizedFilters,

    // Convenience methods for common operations
    removeFilter: (key: keyof CommentCategoryFilterModel) => filters.removeSingle(key),
    removeAllFilters: () => filters.removeAll(FILTERS),
  };
};
