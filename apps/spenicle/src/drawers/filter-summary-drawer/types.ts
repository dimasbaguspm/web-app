import { SummaryFrequencyType } from '../../pages/summary/hooks/use-summary-filter';

export interface FilterSummaryFormSchema {
  frequency: SummaryFrequencyType;
  startDate: string;
  endDate: string;
  customRange: boolean;
  accountIds: number[] | undefined;
  categoryIds: number[] | undefined;
}
