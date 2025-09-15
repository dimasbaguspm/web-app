import {
  UpsertAppProfileAuthByIdModel,
  UpsertAppProfileAuthModel,
  VerifyAppProfileAuthModel,
  VerifyAppProfileAuthResponseModel,
} from '@dimasbaguspm/interfaces';

import { HI_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';

export const useApiHiUpsertAppProfileAuthById = () => {
  return useApiMutate<boolean, UpsertAppProfileAuthByIdModel>({
    base: 'HI',
    method: 'PATCH',
    path: HI_URL.APP_PROFILES_AUTH.UPSERT_BYID,
  });
};

export const useApiHiUpsertAppProfileAuth = () => {
  return useApiMutate<boolean, UpsertAppProfileAuthModel>({
    base: 'HI',
    method: 'PATCH',
    path: HI_URL.APP_PROFILES_AUTH.UPSERT,
  });
};

export const useApiHiVerifyAppProfileAuthPin = () => {
  return useApiMutate<VerifyAppProfileAuthResponseModel, VerifyAppProfileAuthModel>({
    base: 'HI',
    method: 'POST',
    path: HI_URL.APP_PROFILES_AUTH.VERIFY_PIN,
  });
};
