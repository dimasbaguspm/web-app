import {
  useApiSpenicleAccountQuery,
  useApiSpenicleCategoryQuery,
  useApiSpenicleTransactionQuery,
} from '@dimasbaguspm/hooks/use-api';

interface useDetailTransactionDataProps {
  transactionId: number;
}

export const useDetailTransactionData = ({ transactionId }: useDetailTransactionDataProps) => {
  const [transactionData, , { isLoading: isFetchingTransaction }] = useApiSpenicleTransactionQuery(transactionId);

  const [accountData, , { isLoading: isFetchingAccount }] = useApiSpenicleAccountQuery(
    transactionData?.accountId || 0,
    {
      enabled: !!transactionData?.accountId,
    },
  );
  const [destinationAccountData, , { isLoading: isFetchingDestinationAccount }] = useApiSpenicleAccountQuery(
    transactionData?.destinationAccountId || 0,
    {
      enabled: !!transactionData?.destinationAccountId,
    },
  );
  const [categoryData, , { isLoading: isFetchingCategory }] = useApiSpenicleCategoryQuery(
    transactionData?.categoryId || 0,
    {
      enabled: !!transactionData?.categoryId,
    },
  );

  const isInitialLoading =
    isFetchingTransaction || isFetchingAccount || isFetchingDestinationAccount || isFetchingCategory;

  return {
    transactionData,
    accountData,
    destinationAccountData,
    categoryData,
    isInitialLoading,
  };
};
