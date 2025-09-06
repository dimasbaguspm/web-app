export interface EditScheduledPaymentsFormSchema {
  name: string;

  startDate: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  frequency: number;
  until: string | undefined;

  amount: number;
  accountId: number | string;
  categoryId: number | string;
  type: 'income' | 'expense';
  notes: string;

  immediate?: boolean;
}
