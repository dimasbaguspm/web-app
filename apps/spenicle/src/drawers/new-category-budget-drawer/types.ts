export interface NewCategoryBudgetFormValues {
  maxAmount: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  type: 'income' | 'expense';
  notes: string;
}
