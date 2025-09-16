import {
  DeleteAppProfileAuthModel,
  UpsertAppProfileAuthByIdModel,
  UpsertAppProfileAuthModel,
  VerifyAppProfileAuthModel,
  VerifyAppProfileAuthResponseModel,
} from '@dimasbaguspm/interfaces';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';

export const useApiHiUpsertAppProfileAuthById = () => {
  const queryClient = useQueryClient();
  return useApiMutate<boolean, UpsertAppProfileAuthByIdModel>({
    base: 'HI',
    method: 'PATCH',
    path: HI_URL.APP_PROFILES_AUTH.UPSERT_BYID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiHiUpsertAppProfileAuth = () => {
  const queryClient = useQueryClient();
  return useApiMutate<boolean, UpsertAppProfileAuthModel>({
    base: 'HI',
    method: 'PATCH',
    path: HI_URL.APP_PROFILES_AUTH.UPSERT,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED().slice(0, 3),
        exact: false,
      });
    },
  });
};

export const useApiHiVerifyAppProfileAuthPin = () => {
  return useApiMutate<VerifyAppProfileAuthResponseModel, VerifyAppProfileAuthModel>({
    base: 'HI',
    method: 'POST',
    path: HI_URL.APP_PROFILES_AUTH.VERIFY_PIN,
  });
};

export const useApiHiDeleteAppProfileAuth = () => {
  const queryClient = useQueryClient();
  return useApiMutate<boolean, DeleteAppProfileAuthModel>({
    base: 'HI',
    method: 'DELETE',
    path: HI_URL.APP_PROFILES_AUTH.UPSERT_BYID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_PAGINATED().slice(0, 3),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.HI_APP_PROFILES_BY_ID(0).slice(0, 3),
        exact: false,
        type: 'active',
        stale: true,
      });
    },
  });
};
