import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';
import { SearchCategoriesModel } from '@dimasbaguspm/interfaces';

export interface CategoryFilterModel extends Record<string, unknown> {
  q?: SearchCategoriesModel['search'];
  type?: SearchCategoriesModel['type'];
  groupId?: SearchCategoriesModel['categoryGroupIds'];
}

const FILTERS = ['q', 'type', 'groupId'] satisfies (keyof CategoryFilterModel)[];

const HUMANIZED_FILTER_LABELS: Record<keyof CategoryFilterModel, string> = {
  q: 'Search',
  type: 'Type',
  groupId: 'Groups',
} as const;

export const useCategoryFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<CategoryFilterModel>(opts);

  // parse applied filters with proper typing
  const appliedFilters: CategoryFilterModel = {
    q: filters.getSingle('q'),
    type: filters.getAll('type') as SearchCategoriesModel['type'],
    groupId: filters.getAll('groupId').map(Number) as SearchCategoriesModel['categoryGroupIds'],
  };

  // Generate humanized filter labels for active filters
  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'q':
          if (appliedFilters.q) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
        case 'groupId':
          if (appliedFilters.groupId?.length) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
        case 'type':
          if (appliedFilters.type?.length) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
      }
      return acc;
    },
    [] as [keyof CategoryFilterModel, string][],
  );

  return {
    filters,

    // Computed values for convenience
    appliedFilters,
    humanizedFilters,

    // Convenience methods for common operations
    removeFilter: (key: keyof CategoryFilterModel) => filters.removeSingle(key),
    removeAllFilters: () => filters.removeAll(FILTERS),
  };
};
