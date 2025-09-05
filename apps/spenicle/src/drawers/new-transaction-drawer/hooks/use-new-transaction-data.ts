import { useApiSpenicleAccountQuery, useApiSpenicleCategoryQuery } from '@dimasbaguspm/hooks/use-api';

import { NewTransactionFormSchema } from '../types';

export const useNewTransactionData = (payload: NewTransactionFormSchema) => {
  const { accountId, categoryId, destinationAccountId } = payload;

  const [accountData, , { isLoading: isAccountFetching }] = useApiSpenicleAccountQuery(+accountId, {
    enabled: !!accountId,
  });
  const [destinationAccountData, , { isLoading: isDestinationAccountFetching }] = useApiSpenicleAccountQuery(
    +destinationAccountId!,
    {
      enabled: !!destinationAccountId,
    },
  );

  const [categoryData, , { isLoading: isCategoryFetching }] = useApiSpenicleCategoryQuery(+categoryId, {
    enabled: !!categoryId,
  });

  const isLoading = isAccountFetching || isCategoryFetching || isDestinationAccountFetching;

  return {
    accountData,
    destinationAccountData,
    categoryData,
    isLoading,
  };
};
