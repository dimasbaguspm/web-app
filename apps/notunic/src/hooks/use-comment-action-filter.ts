import { useFilters, UseFiltersOptions } from '@dimasbaguspm/hooks/use-filters';
import { SearchCommentsModel } from '@dimasbaguspm/interfaces/notunic-api';

export interface CommentActionFilterModel extends Record<string, unknown> {
  status?: NonNullable<SearchCommentsModel>['actionStatus'];
}

const FILTERS = ['status'] satisfies (keyof CommentActionFilterModel)[];

const HUMANIZED_FILTER_LABELS: Record<keyof CommentActionFilterModel, string> = {
  status: 'Status',
  groupId: 'Groups',
} as const;

export const useCommentActionFilter = (opts?: UseFiltersOptions) => {
  const filters = useFilters<CommentActionFilterModel>(opts);

  // parse applied filters with proper typing
  const appliedFilters: CommentActionFilterModel = {
    status: (filters.getSingle('status') as NonNullable<SearchCommentsModel>['actionStatus']) || 'todo',
  };

  // Generate humanized filter labels for active filters
  const humanizedFilters = FILTERS.reduce(
    (acc, key) => {
      switch (key) {
        case 'status':
          if (appliedFilters.status) {
            acc.push([key, HUMANIZED_FILTER_LABELS[key]]);
          }
          break;
      }
      return acc;
    },
    [] as [keyof CommentActionFilterModel, string][],
  );

  return {
    filters,

    // Computed values for convenience
    appliedFilters,
    humanizedFilters,

    // Convenience methods for common operations
    removeFilter: (key: keyof CommentActionFilterModel) => filters.removeSingle(key),
    removeAllFilters: () => filters.removeAll(FILTERS),
  };
};
