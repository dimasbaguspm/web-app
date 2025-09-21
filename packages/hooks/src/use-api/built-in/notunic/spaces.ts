import {
  SearchSpacesModel,
  SpacesPageModel,
  SpaceModel,
  CreateSpaceModel,
  UpdateSpaceModel,
} from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiInfiniteQuery, UseApiInfiniteQueryOptions } from '../../use-api-infinite-query';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicSpacesInfiniteQuery = (
  params: SearchSpacesModel,
  options?: Partial<UseApiInfiniteQueryOptions<SpaceModel, SearchSpacesModel, unknown>>,
) => {
  return useApiInfiniteQuery({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_SPACES_INFINITE(params),
    queryParams: params,
    path: NOTUNIC_URL.SPACES.PAGINATED,
  });
};

export const useApiNotunicSpacesPaginatedQuery = (
  params: SearchSpacesModel,
  options?: Partial<UseApiQueryOptions<SpacesPageModel, SearchSpacesModel, unknown>>,
) => {
  return useApiQuery<SpacesPageModel, SearchSpacesModel>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_SPACES_PAGINATED(params),
    queryParams: params,
    path: NOTUNIC_URL.SPACES.PAGINATED,
  });
};

export const useApiNotunicSpaceQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<SpaceModel, unknown, unknown>>,
) => {
  const queryClient = useQueryClient();

  return useApiQuery<SpaceModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_SPACES_BY_ID(id),
    path: NOTUNIC_URL.SPACES.BY_ID(id),
    initialData: () => {
      return queryClient
        .getQueryData<SpacesPageModel>(QUERY_KEYS.NOTUNIC_SPACES_PAGINATED().slice(0, 3))
        ?.items.find((space) => space.id === id);
    },
    initialDataUpdatedAt: queryClient.getQueryState(QUERY_KEYS.NOTUNIC_SPACES_PAGINATED().slice(0, 3))?.dataUpdatedAt,
  });
};

export const useApiNotunicCreateSpace = () => {
  const queryClient = useQueryClient();
  return useApiMutate<SpaceModel, CreateSpaceModel>({
    path: '/spaces',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_SPACES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_SPACES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_SPACES_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateSpace = () => {
  const queryClient = useQueryClient();
  return useApiMutate<SpaceModel, UpdateSpaceModel>({
    path: '/spaces/:id',
    method: 'PATCH',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_SPACES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_SPACES_INFINITE().slice(0, 3),
        exact: false,
      });
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_SPACES_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteSpace = () => {
  const queryClient = useQueryClient();
  return useApiMutate<{ id: number }, unknown>({
    path: '/spaces/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_SPACES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTUNIC_SPACES_INFINITE().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiNotunicCachedSpaces = (): SpaceModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<SpaceModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_SPACES, 'by-id'],
    exact: false,
    type: 'all',
  });
  const cachePaginatedQuery = queryClient.getQueriesData<SpacesPageModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_SPACES, 'paginated'],
    exact: false,
    type: 'all',
  });
  const cacheInfiniteQuery = queryClient.getQueriesData<SpaceModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_SPACES, 'infinite'],
    exact: false,
    type: 'all',
  });

  const cache: SpaceModel[] = [
    ...cacheSingleQuery.map(([, space]) => space!),
    ...cachePaginatedQuery.flatMap(([, page]) => page?.items ?? []),
    ...cacheInfiniteQuery.map(([, space]) => space!),
  ];

  return uniqBy(cache, 'id').filter(Boolean);
};
