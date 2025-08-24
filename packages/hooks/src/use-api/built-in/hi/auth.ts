import { AuthMeModel, SetActiveProfileModel } from '@dimasbaguspm/interfaces';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

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
  return useQuery<boolean, unknown>({
    queryKey: QUERY_KEYS.HI_AUTH_TOKEN,
    queryFn: async () => {
      const { value: accessToken } =
        (await cookieStore.get('accessToken')) ?? {};

      const [, payload] = accessToken?.split('.') ?? [];

      const expiredTime = new Date(JSON.parse(atob(payload)).exp * 1000);

      // Reduce 15 minutes (15 * 60 * 1000 milliseconds) from expiration time to catch expiration earlier
      const adjustedExpiredTime = new Date(
        expiredTime.getTime() - 15 * 60 * 1000,
      );
      const isExpired = adjustedExpiredTime < new Date();

      if (!isExpired) return true;

      try {
        await axios.post(BASE_URL.HI + HI_URL.AUTH.REFRESH, null, {
          withCredentials: true,
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            const currentUrl = window.location.href;
            window.location.href =
              BASE_URL.LOGIN + '/sign-in?redirectTo=' + currentUrl;
          }
        }
        return false;
      }

      return true;
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
