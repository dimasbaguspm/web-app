import { SearchAccountsModel } from '@dimasbaguspm/interfaces';
import { useSearchParams } from 'react-router';

export interface AccountFilterModel {
  q?: NonNullable<SearchAccountsModel>['search'];
  type?: NonNullable<SearchAccountsModel>['type'];
  // sortBy?: NonNullable<SearchAccountsModel>['sortBy'];
  sortBy?: 'name-desc' | 'amount-asc' | 'amount-desc';
}

const FILTERS = ['q', 'type', 'sortBy'] satisfies (keyof AccountFilterModel)[];

export const useAccountFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const appliedFilters = {
    q: searchParams.get('q') ?? undefined,
    type: (searchParams.getAll('type') ?? []) as NonNullable<SearchAccountsModel>['type'],
    sortBy: (searchParams.get('sortBy') ?? undefined) as AccountFilterModel['sortBy'],
  } satisfies AccountFilterModel;

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
        case 'sortBy':
          if (appliedFilters.sortBy) {
            acc.push(['sortBy', 'Sort By']);
          }
          break;
      }
      return acc;
    },
    [] as [keyof AccountFilterModel, string][],
  );

  const setFilters = (newFilters: Partial<AccountFilterModel>) => {
    const stringifiedFilters: Record<string, string | string[]> = {};

    const parsedNewFilters = {
      ...appliedFilters,
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

  const getFilterValue = (key: keyof AccountFilterModel) => {
    return searchParams.get(key) ?? undefined;
  };

  const addFilter = (key: keyof AccountFilterModel, value: string | string[]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.set(key, value);
    }

    setSearchParams(searchParams, { replace: true });
  };

  const removeFilter = (key: keyof AccountFilterModel) => {
    searchParams.delete(key);

    setSearchParams(searchParams, { replace: true });
  };

  const removeAllFilters = () => {
    FILTERS.forEach((key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams, { replace: true });
  };

  const getParsedSorterFilters = (): Partial<NonNullable<SearchAccountsModel>> => {
    const sortBy = searchParams.get('sortBy');
    if (!sortBy) return {};

    let parsedSortBy: NonNullable<SearchAccountsModel>['sortBy'] | undefined;
    let parsedSortOrder: NonNullable<SearchAccountsModel>['sortOrder'] | undefined;

    switch (sortBy) {
      case 'name-asc':
        parsedSortBy = 'name';
        parsedSortOrder = 'asc';
        break;
      case 'amount-asc':
        parsedSortBy = 'amount';
        parsedSortOrder = 'asc';
        break;
      case 'amount-desc':
        parsedSortBy = 'amount';
        parsedSortOrder = 'desc';
        break;
    }

    return {
      sortBy: parsedSortBy,
      sortOrder: parsedSortOrder,
    };
  };

  return {
    appliedFilters,
    humanizedFilters,
    getFilterValue,
    getParsedSorterFilters,
    addFilter,
    setFilters,
    removeFilter,
    removeAllFilters,
  };
};
