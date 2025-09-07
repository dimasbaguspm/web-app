export interface FilterSummaryFormSchema {
  startDate: string;
  endDate: string;
  frequency: string;
  accountIds: number[] | undefined;
  categoryIds: number[] | undefined;
}
