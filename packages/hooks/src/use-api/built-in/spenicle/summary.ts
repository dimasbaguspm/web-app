import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiQuery } from '../../use-api-query';

import { SearchSummaryModel, SummaryModel } from './types';

export const useApiSpenicleSummaryQuery = (params: SearchSummaryModel) => {
  return useApiQuery<SummaryModel, SearchSummaryModel>({
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SUMMARY(params),
    path: SPENICLE_URL.SUMMARY,
  });
};
