import { ActionLinkModel, CreateActionLinkModel, UpdateActionLinkModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useQueryClient } from '@tanstack/react-query';
import { uniqBy } from 'lodash';

import { BASE_QUERY_KEYS } from '../../constants';
import { QUERY_KEYS } from '../../query-keys';
import { NOTUNIC_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiNotunicActionLinkQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<ActionLinkModel, unknown, unknown>>,
) => {
  return useApiQuery<ActionLinkModel, unknown>({
    ...options,
    base: 'NOTUNIC',
    queryKey: QUERY_KEYS.NOTUNIC_ACTION_LINKS_BY_ID(id),
    path: NOTUNIC_URL.ACTION_LINKS.BY_ID(id),
  });
};

export const useApiNotunicCreateActionLink = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ActionLinkModel, CreateActionLinkModel>({
    path: '/action-links',
    method: 'POST',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_ACTION_LINKS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicUpdateActionLink = () => {
  const queryClient = useQueryClient();
  return useApiMutate<ActionLinkModel, UpdateActionLinkModel>({
    path: '/action-links/:id',
    method: 'PATCH',
    base: 'NOTUNIC',
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.NOTUNIC_ACTION_LINKS_BY_ID(data.id), data);
    },
  });
};

export const useApiNotunicDeleteActionLink = () => {
  return useApiMutate<{ id: number }, unknown>({
    path: '/action-links/:id',
    method: 'DELETE',
    base: 'NOTUNIC',
  });
};

export const useApiNotunicCachedActionLinks = (): ActionLinkModel[] => {
  const queryClient = useQueryClient();

  const cacheSingleQuery = queryClient.getQueriesData<ActionLinkModel>({
    queryKey: [...BASE_QUERY_KEYS.NOTUNIC_ACTION_LINKS, 'by-id'],
    exact: false,
    type: 'all',
  });

  const cache: ActionLinkModel[] = [...cacheSingleQuery.map(([, a]) => a!)];

  return uniqBy(cache, 'id').filter(Boolean);
};
