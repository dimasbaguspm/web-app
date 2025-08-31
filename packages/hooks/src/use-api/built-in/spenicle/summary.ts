import {
  SearchSummaryAccountsModel,
  SearchSummaryCategoriesModel,
  SearchSummaryTotalTransactionsModel,
  SearchSummaryTransactionsModel,
  SummaryAccountsModel,
  SummaryCategoriesModel,
  SummaryTotalTransactionsModel,
  SummaryTransactionsModel,
} from '@dimasbaguspm/interfaces';

import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiQuery } from '../../use-api-query';

export const useApiSpenicleSummaryTransactionsQuery = (params: SearchSummaryTransactionsModel) => {
  return useApiQuery<SummaryTransactionsModel, SearchSummaryTransactionsModel>({
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SUMMARY_TRANSACTIONS(params),
    queryParams: params,
    path: SPENICLE_URL.SUMMARY.TRANSACTIONS,
  });
};

export const useApiSpenicleSummaryAccountsQuery = (params: SearchSummaryAccountsModel) => {
  return useApiQuery<SummaryAccountsModel, SearchSummaryAccountsModel>({
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SUMMARY_ACCOUNTS(params),
    queryParams: params,
    path: SPENICLE_URL.SUMMARY.ACCOUNTS,
  });
};

export const useApiSpenicleSummaryCategoriesQuery = (params: SearchSummaryCategoriesModel) => {
  return useApiQuery<SummaryCategoriesModel, SearchSummaryCategoriesModel>({
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SUMMARY_CATEGORIES(params),
    queryParams: params,
    path: SPENICLE_URL.SUMMARY.CATEGORIES,
  });
};

export const useApiSpenicleSummaryTotalQuery = (params: SearchSummaryTotalTransactionsModel) => {
  return useApiQuery<SummaryTotalTransactionsModel, SearchSummaryTotalTransactionsModel>({
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_SUMMARY_TOTAL(params),
    queryParams: params,
    path: SPENICLE_URL.SUMMARY.TOTAL,
  });
};
