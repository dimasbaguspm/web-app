import { SummaryOverviewFrequencyType } from '../../pages/summary-overview/hooks/use-summary-overview-filter';

export interface FilterSummaryFormSchema {
  frequency: SummaryOverviewFrequencyType;
  startDate: string;
  endDate: string;
  customRange: boolean;
}
