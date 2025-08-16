import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery, UseApiQueryOptions } from '../../use-api-query';

import {
  SearchAccountsModel,
  AccountsPageModel,
  AccountModel,
  CreateAccountModel,
  UpdateAccountModel,
} from './types';

export const useApiSpenicleAccountsPaginatedQuery = (
  params: SearchAccountsModel,
  options?: Partial<
    UseApiQueryOptions<AccountsPageModel, SearchAccountsModel, unknown>
  >,
) => {
  return useApiQuery<AccountsPageModel, SearchAccountsModel>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_PAGINATED(params),
    queryParams: params,
    path: SPENICLE_URL.ACCOUNT.PAGINATED,
  });
};

export const useApiSpenicleAccountQuery = (
  id: number,
  options?: Partial<UseApiQueryOptions<AccountModel, unknown, unknown>>,
) => {
  return useApiQuery<AccountModel, unknown>({
    ...options,
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_ACCOUNT_BY_ID(id),
    path: SPENICLE_URL.ACCOUNT.BY_ID(id),
  });
};

export const useApiSpenicleCreateAccount = () => {
  return useApiMutate<AccountModel, CreateAccountModel>({
    path: '/account',
    method: 'POST',
    base: 'SPENICLE',
  });
};

export const useApiSpenicleUpdateAccount = () => {
  return useApiMutate<AccountModel, UpdateAccountModel>({
    path: '/account/:id',
    method: 'PATCH',
    base: 'SPENICLE',
  });
};
