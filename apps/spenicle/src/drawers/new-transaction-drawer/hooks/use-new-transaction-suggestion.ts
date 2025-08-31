import { useApiSpenicleGetPaginatedTransactions } from '@dimasbaguspm/hooks/use-api';
import { useState } from 'react';

import { NewTransactionFormSchema } from '../types';

export const useNewTransactionSuggestion = (
  payload: NewTransactionFormSchema,
) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [mutateAsync] = useApiSpenicleGetPaginatedTransactions();

  const shouldTrim = (note: string) => {
    return note.length > 30 ? note.slice(0, 30) + '...' : note;
  };

  const fetchSuggestions = async () => {
    const response = await mutateAsync({
      type: [payload?.type],
      amount: payload?.amount
        ? [payload?.amount - 10000, payload?.amount + 10000]
        : undefined,
      search: payload?.notes ? payload?.notes : undefined,
      categoryId: payload?.categoryId ? [payload?.categoryId] : undefined,
      accountId:
        payload?.accountId && payload?.destinationAccountId
          ? [payload?.accountId, payload?.destinationAccountId]
          : payload?.accountId
            ? [payload?.accountId]
            : payload?.destinationAccountId
              ? [payload?.destinationAccountId]
              : undefined,
      pageSize: 10,
    });

    if (response) {
      setSuggestions(
        response.items
          .filter(({ note }) => note !== '')
          .map(({ note }) => shouldTrim(note || '')),
      );
      setIsVisible(true);
    }
  };

  const resetSuggestions = () => {
    setSuggestions([]);
    setIsVisible(false);
  };

  return [suggestions, isVisible, fetchSuggestions, resetSuggestions] as const;
};
