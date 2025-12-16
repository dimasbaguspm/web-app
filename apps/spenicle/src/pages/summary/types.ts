export interface ComparisonData {
  current: number;
  previous: number;
  percentageChange: number;
  isIncrease: boolean;
}

export interface PeriodStats {
  income: number;
  expense: number;
  net: number;
}

export interface PeriodComparison {
  current: PeriodStats;
  previous: PeriodStats;
  incomeChange: ComparisonData;
  expenseChange: ComparisonData;
  netChange: ComparisonData;
}

export interface CategoryBudget {
  categoryId: number;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverBudget: boolean;
  previousSpent?: number;
  spentChange?: ComparisonData;
}

export interface ExpenseBreakdownItem {
  id: number;
  name: string;
  amount: number;
  percentage: number;
  previousAmount?: number;
  change?: ComparisonData;
}
