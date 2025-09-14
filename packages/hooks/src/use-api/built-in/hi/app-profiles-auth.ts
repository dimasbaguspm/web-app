import {
  AppProfileAuthModel,
  UpsertAppProfileAuthModel,
  VerifyAppProfileAuthModel,
  VerifyAppProfileAuthResponseModel,
} from '@dimasbaguspm/interfaces';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

export const useApiHiAppProfileAuthQuery = (
  options?: Partial<UseApiQueryOptions<AppProfileAuthModel, unknown, unknown>>,
) => {
  return useApiQuery<AppProfileAuthModel, unknown>({
    ...options,
    base: 'HI',
    queryKey: QUERY_KEYS.HI_APP_PROFILES_AUTH(),
    path: HI_URL.APP_PROFILES_AUTH.GET,
  });
};

export const useApiHiUpsertAppProfileAuth = () => {
  return useApiMutate<AppProfileAuthModel, UpsertAppProfileAuthModel>({
    base: 'HI',
    path: HI_URL.APP_PROFILES_AUTH.UPSERT,
  });
};

export const useApiHiVerifyAppProfileAuthPin = () => {
  return useApiMutate<VerifyAppProfileAuthResponseModel, VerifyAppProfileAuthModel>({
    base: 'HI',
    path: HI_URL.APP_PROFILES_AUTH.VERIFY_PIN,
  });
};
