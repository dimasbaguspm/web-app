import { useApiSpenicleGetPaginatedTransactions } from '@dimasbaguspm/hooks/use-api';
import { uniqBy } from 'lodash';
import { useState } from 'react';

import { NewTransactionFormSchema } from '../types';

export interface NewTransactionSuggestion {
  trimmedNotes: string | undefined;
  notes: string | undefined;
  categoryId: number | undefined;
  accountId: number | undefined;
  amount: number | undefined;
}

export const useNewTransactionSuggestion = (payload: NewTransactionFormSchema) => {
  const [suggestions, setSuggestions] = useState<NewTransactionSuggestion[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [mutateAsync] = useApiSpenicleGetPaginatedTransactions();

  const shouldTrim = (note: string) => {
    return note.length > 30 ? note.slice(0, 30) + '...' : note;
  };

  const fetchSuggestions = async () => {
    const response = await mutateAsync({
      type: [payload?.type],
      amount: payload?.amount ? [payload?.amount - 10000, payload?.amount + 10000] : undefined,
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
      const data = response.items.map(({ note, categoryId, accountId, amount }) => ({
        trimmedNotes: shouldTrim(note || ''),
        notes: note || '',
        categoryId: +categoryId,
        accountId: +accountId,
        amount: +amount,
      })) satisfies NewTransactionSuggestion[];

      const filteredData = uniqBy(
        data,
        ({ trimmedNotes, categoryId, accountId }) => `${trimmedNotes ?? ''}::${categoryId ?? ''}::${accountId ?? ''}`,
      );

      setSuggestions(filteredData);
      setIsVisible(true);
    }
  };

  const resetSuggestions = () => {
    setSuggestions([]);
    setIsVisible(false);
  };

  return [suggestions, isVisible, fetchSuggestions, resetSuggestions] as const;
};
