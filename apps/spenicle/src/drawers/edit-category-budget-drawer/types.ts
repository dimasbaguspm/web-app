export interface EditCategoryBudgetFormValues {
  maxAmount: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  type: 'income' | 'expense';
  notes: string;
}
