import { SearchCategoriesModel } from '@dimasbaguspm/interfaces';
import { useSearchParams } from 'react-router';

export interface CategoryFilterModel {
  q?: NonNullable<SearchCategoriesModel>['search'];
  type?: NonNullable<SearchCategoriesModel>['type'];
}

const FILTERS = ['q', 'type'] satisfies (keyof CategoryFilterModel)[];

export const useCategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const appliedFilters = {
    q: searchParams.get('q') ?? undefined,
    type: (searchParams.getAll('type') ??
      []) as NonNullable<SearchCategoriesModel>['type'],
  } satisfies CategoryFilterModel;

  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'q':
          if (appliedFilters.q) {
            acc.push(['q', 'Name']);
          }
          break;
        case 'type':
          if (appliedFilters.type?.length) {
            acc.push(['type', 'Type']);
          }
          break;
      }
      return acc;
    },
    [] as [keyof CategoryFilterModel, string][],
  );

  const setFilters = (newFilters: CategoryFilterModel) => {
    const stringifiedFilters: Record<string, string | string[]> = {};

    const parsedNewFilters = {
      q: newFilters.q,
      type: newFilters.type,
    };

    Object.entries(parsedNewFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        stringifiedFilters[key] = value.map(String);
      } else if (value !== undefined && value !== null && value !== '') {
        stringifiedFilters[key] = String(value);
      }
    });

    setSearchParams(stringifiedFilters, { replace: true });
  };

  const removeFilter = (key: keyof CategoryFilterModel) => {
    searchParams.delete(key);

    setSearchParams(searchParams, { replace: true });
  };

  const removeAllFilters = () => {
    FILTERS.forEach((key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams, { replace: true });
  };

  return {
    appliedFilters,
    humanizedFilters,
    setFilters,
    removeFilter,
    removeAllFilters,
  };
};
