import {
  useApiSpenicleAccountQuery,
  useApiSpenicleCategoryQuery,
} from '@dimasbaguspm/hooks/use-api';

import { NewTransactionFormSchema } from '../types';

export const useNewTransactionData = (payload: NewTransactionFormSchema) => {
  const { accountId, categoryId, destinationAccountId } = payload;

  const [accountData, , { isFetching: isAccountFetching }] =
    useApiSpenicleAccountQuery(+accountId, {
      enabled: !!accountId,
    });
  const [
    destinationAccountData,
    ,
    { isFetching: isDestinationAccountFetching },
  ] = useApiSpenicleAccountQuery(+destinationAccountId!, {
    enabled: !!destinationAccountId,
  });

  const [categoryData, , { isFetching: isCategoryFetching }] =
    useApiSpenicleCategoryQuery(+categoryId, {
      enabled: !!categoryId,
    });

  const isLoading =
    isAccountFetching || isCategoryFetching || isDestinationAccountFetching;

  return {
    accountData,
    destinationAccountData,
    categoryData,
    isLoading,
  };
};
