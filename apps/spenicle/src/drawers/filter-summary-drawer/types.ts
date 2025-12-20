import { FilterDateRangePresets } from '../../hooks/use-summary-filter';

export interface FilterSummaryFormSchema {
  dateRangePreset: FilterDateRangePresets;
  useCustomDateRange: boolean;
  customDateFrom: string | undefined;
  customDateTo: string | undefined;
  customFrequency: string | undefined;
  accountIds: number[] | undefined;
  categoryIds: number[] | undefined;
}
