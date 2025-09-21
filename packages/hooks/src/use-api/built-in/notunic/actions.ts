import {
  SearchActionsModel,
  ActionsPageModel,
  ActionModel,
  CreateActionModel,
  UpdateActionModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicActionsInfiniteQuery = (
  params: SearchActionsModel,
  options?: Partial<UseApiInfiniteQueryOptions<ActionModel, SearchActionsModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.ACTIONS.PAGINATED,
  });
};

export const useApiNotunicActionsPaginatedQuery = (
  params: SearchActionsModel,
  options?: Partial<UseApiQueryOptions<ActionsPageModel, SearchActionsModel, unknown>>,
) => {
  return useApiQuery<ActionsPageModel, SearchActionsModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.ACTIONS.PAGINATED,
  });
};

export const useApiNotunicActionQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<ActionModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<ActionModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_BY_ID(id),
    path: NOTUNIC_URL.ACTIONS.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<ActionsPageModel>(QUERY_KEYS.NOTUNIC_ACTIONS_PAGINATED().slice(0, 3))
        ?.items.find((a) => a.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_ACTIONS_PAGINATED().slice(0, 3))?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateAction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ActionModel, CreateActionModel>({
    path: '/actions',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_ACTIONS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateAction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ActionModel, UpdateActionModel>({
    path: '/actions/:id',
    method: 'PATCH',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_ACTIONS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteAction = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/actions/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_ACTIONS_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiNotunicCachedActions = (): ActionModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<ActionModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_ACTIONS, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<ActionsPageModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_ACTIONS, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<ActionModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_ACTIONS, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: ActionModel[] = [
    ...cacheSingleQuery.map(([, a]) => a!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, a]) => a!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
