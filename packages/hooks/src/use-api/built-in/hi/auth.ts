import { AuthMeModel, SetActiveProfileModel } from '@dimasbaguspm/interfaces';
import { useGlobalProvider } from '@dimasbaguspm/providers/global-provider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { BASE_URL } from '../../constants';
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

export const useApiHiAuthTokenRefresher = () => {
  const { clientId } = useGlobalProvider();
  return useQuery<boolean, unknown>({
    queryKey: QUERY_KEYS.HI_AUTH_TOKEN,
    enabled: !!clientId,
    queryFn: async () => {
      try {
        const { value: accessToken } =
          (await cookieStore.get('accessToken')) ?? {};

        if (!accessToken) throw new Error('No access token found');

        const [, payload] = accessToken?.split('.') ?? [];

        const expiredTime = new Date(JSON.parse(atob(payload)).exp * 1000);

        const isExpired = expiredTime < new Date();

        if (!isExpired) return true;

        await axios.post(BASE_URL.HI + HI_URL.AUTH.REFRESH, null, {
          withCredentials: true,
          headers: {
            'client-id': clientId,
          },
        });

        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : String(err);

        window.confirm(message);
        const currentUrl = new URL(window.location.href);

        window.location.href =
          BASE_URL.LOGIN +
          '/sign-in?redirectTo=' +
          currentUrl.toString() +
          '&clientId=' +
          clientId;
      }
      return false;
    },
  });
};
export const useApiHiAuthSetActiveProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutate<unknown, SetActiveProfileModel, unknown>({
    base: 'HI',
    path: HI_URL.AUTH.SET_ACTIVE_PROFILE,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_AUTH_ME,
        exact: false,
      });
    },
  });
};
