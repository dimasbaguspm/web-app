import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';

import { FilterDateRangePresets, FilterFrequency, useSummaryFilter } from '../../hooks/use-summary-filter';

import { FilterSummaryFormSchema } from './types';

export const getFrequencyForPreset = (preset: FilterDateRangePresets): FilterFrequency => {
  switch (preset) {
    case FilterDateRangePresets.Last7Days:
    case FilterDateRangePresets.ThisWeek:
    case FilterDateRangePresets.LastWeek:
      return FilterFrequency.Daily;
    case FilterDateRangePresets.Last30Days:
    case FilterDateRangePresets.ThisMonth:
    case FilterDateRangePresets.LastMonth:
      return FilterFrequency.Weekly;
    case FilterDateRangePresets.Last6Months:
    case FilterDateRangePresets.ThisYear:
    case FilterDateRangePresets.LastYear:
      return FilterFrequency.Monthly;
    case FilterDateRangePresets.AllTime:
      return FilterFrequency.Yearly;
    default:
      return FilterFrequency.Monthly;
  }
};

export const getDefaultValues = (
  summaryFilters: ReturnType<typeof useSummaryFilter>,
  payload?: Record<string, unknown>,
): FilterSummaryFormSchema => {
  const defaultRangePreset =
    (payload?.dateRangePreset as FilterDateRangePresets) ??
    summaryFilters.currentDateRangePreset ??
    FilterDateRangePresets.Last6Months;

  return {
    dateRangePreset: defaultRangePreset,
    useCustomDateRange: (payload?.useCustomDateRange as boolean) || summaryFilters.currentDateRangePreset === null,
    customDateFrom:
      (payload?.customDateFrom as string) || formatDate(summaryFilters.appliedFilters.dateFrom, DateFormat.ISO_DATE),
    customDateTo:
      (payload?.customDateTo as string) || formatDate(summaryFilters.appliedFilters.dateTo, DateFormat.ISO_DATE),
    customFrequency: (payload?.customFrequency as string) || summaryFilters.appliedFilters.frequency,
    categoryIds: (payload?.categoryIds as number[]) || summaryFilters.appliedFilters.categoryId || [],
    accountIds: (payload?.accountIds as number[]) || summaryFilters.appliedFilters.accountId || [],
  };
};
