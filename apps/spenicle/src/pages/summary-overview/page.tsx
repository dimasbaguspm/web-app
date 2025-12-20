import { useApiSpenicleSummaryTotalQuery, useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { Heading, PageLoader } from '@dimasbaguspm/versaur';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/page-routes';
import { useSummaryFilter } from '../../hooks/use-summary-filter';

import { AccountsListFilter } from './components/accounts-list-filter';
import { AccountsSummaryTable } from './components/accounts-summary-table';
import { NetBalanceChart } from './components/net-balance-chart';

const SummaryOverviewPage = () => {
  const { isMobile } = useWindowResize();
  const { appliedFilters, filters } = useSummaryFilter({ adapter: 'url' });
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigateToSummaryBreakdown = (startDate: string, endDate: string) => {
    const existingParams = new URLSearchParams(location.search);
    existingParams.set('dateFrom', startDate);
    existingParams.set('dateTo', endDate);

    navigate(
      {
        pathname: DEEP_LINKS.SUMMARY_BREAKDOWN.path,
        search: existingParams.toString(),
      },
      {
        preventScrollReset: false,
      },
    );
  };

  // Get total summary with date range and account filter
  const [totalSummary] = useApiSpenicleSummaryTotalQuery({
    from: appliedFilters.dateFrom,
    to: appliedFilters.dateTo,
    accountId: appliedFilters.accountId?.length > 0 ? appliedFilters.accountId : undefined,
  });

  // Get chart data with date range, frequency, and account filter
  const [summaryTransactions, , { isLoading: isLoadingChart }] = useApiSpenicleSummaryTransactionsQuery({
    frequency: appliedFilters.frequency,
    from: appliedFilters.dateFrom,
    to: appliedFilters.dateTo,
    accountId: appliedFilters.accountId?.length > 0 ? appliedFilters.accountId : undefined,
  });

  const totalIncome = totalSummary?.income ?? 0;
  const totalExpense = Math.abs(totalSummary?.expense ?? 0);
  const netBalance = totalIncome - totalExpense;

  const isLoading = isLoadingChart;

  const handleAccountsChange = (accountIds: number[]) => {
    filters.replaceAll({
      ...appliedFilters,
      accountId: accountIds,
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {/* Desktop: 3-column grid, Mobile: single column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <NetBalanceChart
            balance={netBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            summaryTransactions={summaryTransactions ?? []}
            isMobile={isMobile}
            hasAccountFilter={appliedFilters.accountId?.length > 0}
            frequency={appliedFilters.frequency}
          />

          {/* Breakdown table - always visible to explain the chart */}
          <div>
            <div className="flex justify-between">
              <Heading level={3} hasMargin>
                {appliedFilters.frequency === 'daily'
                  ? 'Daily Breakdown'
                  : appliedFilters.frequency === 'weekly'
                    ? 'Weekly Breakdown'
                    : appliedFilters.frequency === 'yearly'
                      ? 'Yearly Breakdown'
                      : 'Monthly Breakdown'}
              </Heading>
            </div>
            <AccountsSummaryTable
              accountsSummary={summaryTransactions ?? []}
              frequency={appliedFilters.frequency}
              onRowClick={handleNavigateToSummaryBreakdown}
            />
          </div>
        </div>

        {!isMobile && (
          <div className="lg:col-span-1">
            <AccountsListFilter
              selectedAccountIds={appliedFilters.accountId ?? []}
              onAccountsChange={handleAccountsChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SummaryOverviewPage;
