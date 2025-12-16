import { SummaryTransactionsModel } from '@dimasbaguspm/interfaces';
import { formatPrice } from '@dimasbaguspm/utils/price';
import { ButtonIcon } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { ChevronRightIcon } from 'lucide-react';
import { useMemo } from 'react';

interface AccountsSummaryTableProps {
  accountsSummary: SummaryTransactionsModel;
  frequency?: string;
}

export const AccountsSummaryTable = ({ accountsSummary, frequency = 'monthly' }: AccountsSummaryTableProps) => {
  const tableData = useMemo(() => {
    if (!Array.isArray(accountsSummary) || accountsSummary.length === 0) return [];

    // Format date based on frequency
    const getDateLabel = (date: string) => {
      const d = dayjs(date);
      switch (frequency) {
        case 'daily':
          return d.format('MMM D, YYYY');
        case 'weekly': {
          // Show week range: start of week - end of week
          const weekStart = d.startOf('week');
          const weekEnd = d.endOf('week');
          // If same month, show: "2 - 8 Jun 2025"
          // If different months, show: "30 May - 5 Jun 2025"
          if (weekStart.month() === weekEnd.month()) {
            return `${weekStart.format('D')} - ${weekEnd.format('D MMM YYYY')}`;
          } else {
            return `${weekStart.format('D MMM')} - ${weekEnd.format('D MMM YYYY')}`;
          }
        }
        case 'yearly':
          return d.format('YYYY');
        case 'monthly':
        default:
          return d.format('MMM YYYY');
      }
    };

    // Group by date and show transactions data
    const monthlyData = accountsSummary.reduce(
      (acc, item) => {
        const monthKey = getDateLabel(item.date);
        if (!acc[monthKey]) {
          acc[monthKey] = {
            date: item.date,
            month: monthKey,
            totalExpense: Math.abs(item.expense ?? 0),
            totalIncome: Math.abs(item.income ?? 0),
            accounts: [],
          };
        }

        return acc;
      },
      {} as Record<
        string,
        {
          date: string;
          month: string;
          totalExpense: number;
          totalIncome: number;
          accounts: Array<{
            accountName: string;
            accountType?: string;
            expense: number;
            income: number;
          }>;
        }
      >,
    );

    // Convert to array and sort by date descending (latest first)
    return Object.values(monthlyData).sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
  }, [accountsSummary, frequency]);

  if (tableData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data available for selected accounts</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-[25%] px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {frequency === 'daily'
                ? 'Date'
                : frequency === 'weekly'
                  ? 'Week'
                  : frequency === 'yearly'
                    ? 'Year'
                    : 'Month'}
            </th>
            <th className="w-[20%] px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Income
            </th>
            <th className="w-[20%] px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expense
            </th>
            <th className="w-[25%] px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Net
            </th>
            <th className="w-[10%] px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((monthData, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-900 truncate">
                {monthData.month}
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-right text-secondary-600 font-medium">
                {formatPrice(monthData.totalIncome)}
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-right text-primary-600 font-medium">
                {formatPrice(monthData.totalExpense)}
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-right font-medium">
                {formatPrice(monthData.totalIncome - monthData.totalExpense)}
              </td>
              <td className="px-2 sm:px-4 py-3 text-center">
                <ButtonIcon
                  as={ChevronRightIcon}
                  size="sm"
                  variant="ghost"
                  aria-label="View transactions"
                  onClick={() => {
                    // TODO: Navigate to transactions page with date range filter
                    console.log('View transactions for:', monthData.month, monthData.date);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
