import { AuthMeModel, SetActiveProfileModel } from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery } from '../../use-api-query';

export const useApiHiAuthMeQuery = () => {
  return useApiQuery<AuthMeModel, unknown>({
    queryKey: QUERY_KEYS.HI_AUTH_ME,
    base: 'HI',
    path: HI_URL.AUTH.ME,
  });
};

export const useApiHiAuthSetActiveProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutate<unknown, SetActiveProfileModel, unknown>({
    base: 'HI',
    path: HI_URL.AUTH.SET_ACTIVE_PROFILE,
    method: 'POST',
    headers: {
      authorization: '',
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_AUTH_ME,
        exact: false,
      });
    },
  });
};
