export interface NewScheduledPaymentsFormSchema {
  name: string;

  startDate: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  frequency: number;
  until: string | undefined;

  amount: number;
  accountId: string;
  categoryId: string;
  type: 'income' | 'expense';
  notes: string;

  immediate?: boolean;
}
