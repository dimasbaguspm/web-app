import { useApiSpenicleAccountQuery, useApiSpenicleCategoryQuery } from '@dimasbaguspm/hooks/use-api';

import { EditScheduledPaymentsFormSchema } from './types';

export const useEditScheduledPaymentsData = (payload: EditScheduledPaymentsFormSchema) => {
  const { accountId, categoryId } = payload;

  const [accountData, , { isLoading: isAccountFetching }] = useApiSpenicleAccountQuery(+accountId, {
    enabled: !!accountId,
  });

  const [categoryData, , { isLoading: isCategoryFetching }] = useApiSpenicleCategoryQuery(+categoryId, {
    enabled: !!categoryId,
  });

  const isLoading = isAccountFetching || isCategoryFetching;

  return {
    accountData,
    categoryData,
    isLoading,
  };
};
