import { FilterDateRangePresets } from '../../hooks/use-summary-filter';

export interface FilterSummaryFormSchema {
  dateRangePreset: FilterDateRangePresets;
  accountIds: number[] | undefined;
  categoryIds: number[] | undefined;
}
