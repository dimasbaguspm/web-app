import { FrequencyType } from '../../pages/summary-overview/hooks/use-summary-filter';

export interface FilterSummaryFormSchema {
  frequency: FrequencyType;
  startDate: string;
  endDate: string;
  customRange: boolean;
}
