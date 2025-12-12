import {
  useApiSpenicleScheduledTransactionsPaginatedQuery,
  useApiSpenicleSummaryTotalQuery,
  useApiSpenicleSummaryTransactionsQuery,
  useApiSpenicleTransactionsPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { ScheduledTransactionModel, TransactionModel } from '@dimasbaguspm/interfaces';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatHiUserData } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { ChipSingleInput, PageContent, PageHeader, PageLayout } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { NetBalanceCard, RecentTransactions, ScheduledTransactions, ThisMonthSummaryCards } from './components';
import { DashboardTransactionViewMode } from './types';

const DashboardPage = () => {
  const { user } = useAuthProvider();
  const { isMobile } = useWindowResize();

  const [totalSummary] = useApiSpenicleSummaryTotalQuery({});
  const [summaryTransactions] = useApiSpenicleSummaryTransactionsQuery({
    frequency: 'monthly',
    from: dayjs().subtract(6, 'month').startOf('month').toISOString(),
    to: dayjs().endOf('month').toISOString(),
  });
  const [transactions] = useApiSpenicleTransactionsPaginatedQuery({
    pageSize: 5,
  });

  const [scheduledTransactions] = useApiSpenicleScheduledTransactionsPaginatedQuery({
    status: 'active',
    pageSize: 5,
    nextRunAtFrom: dayjs().startOf('day').toISOString(),
    nextRunAtTo: dayjs().add(1, 'week').endOf('day').toISOString(),
    sortBy: 'next_run_at',
    sortOrder: 'asc',
  });

  const navigate = useNavigate();
  const { openDrawer } = useDrawerRoute();

  const [transactionViewMode, setTransactionViewMode] = useState<DashboardTransactionViewMode>(
    DashboardTransactionViewMode.Recent,
  );

  const { name } = formatHiUserData(user);

  const totalIncome = totalSummary?.income ?? 0;
  const totalExpense = Math.abs(totalSummary?.expense ?? 0);
  const netBalance = totalIncome - totalExpense;

  // Get current month summary from summaryTransactions
  const currentMonthSummary = useMemo(() => {
    if (!Array.isArray(summaryTransactions) || summaryTransactions.length === 0) {
      return { income: 0, expense: 0 };
    }
    // Get the latest month (last item in sorted array)
    const latest = summaryTransactions[summaryTransactions.length - 1];
    return {
      income: Math.abs(latest?.income ?? 0),
      expense: Math.abs(latest?.expense ?? 0),
    };
  }, [summaryTransactions]);

  // Get recent transactions
  const recentTransactionsList = useMemo(() => transactions?.items?.slice(0, 5) ?? [], [transactions]);

  const upcomingScheduledTransactions = useMemo(
    () => scheduledTransactions?.items?.slice(0, 5) ?? [],
    [scheduledTransactions],
  );

  const handleTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, { transactionId: transaction.id });
  };

  const handleScheduledTransactionClick = (scheduledTransaction: ScheduledTransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_SCHEDULED_PAYMENTS, { scheduledTransactionId: scheduledTransaction.id });
  };

  const handleViewAllTransactions = () => {
    navigate(DEEP_LINKS.TRANSACTIONS_ALT.path);
  };

  const handleViewAllScheduled = () => {
    navigate(DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path);
  };

  const handleViewMoreSummary = () => {
    navigate(DEEP_LINKS.SUMMARY.path);
  };

  const handleTransactionViewModeChange = (mode: string) => {
    setTransactionViewMode(mode as DashboardTransactionViewMode);
  };

  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader title={`Welcome, ${name}!`} size="wide" />
      </PageLayout.HeaderRegion>
      <PageLayout.ContentRegion>
        <PageContent size={isMobile ? 'narrow' : 'wide'}>
          {/* Desktop: 2-column grid, Mobile: single column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <NetBalanceCard
                balance={netBalance}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                summaryTransactions={summaryTransactions ?? []}
                isMobile={isMobile}
              />

              <ThisMonthSummaryCards
                totalIncome={currentMonthSummary.income}
                totalExpense={currentMonthSummary.expense}
                onViewMore={handleViewMoreSummary}
              />
            </div>

            {/* Right Column - Transactions (1/3 width on desktop) */}
            <div className="lg:col-span-1 space-y-6">
              <ChipSingleInput
                name="fruits"
                value={transactionViewMode}
                onChange={handleTransactionViewModeChange}
                size="md"
              >
                <ChipSingleInput.Option value={DashboardTransactionViewMode.Recent}>
                  Recent Transactions
                </ChipSingleInput.Option>
                <ChipSingleInput.Option value={DashboardTransactionViewMode.Upcoming}>
                  Upcoming Bills
                </ChipSingleInput.Option>
              </ChipSingleInput>
              <If condition={transactionViewMode === DashboardTransactionViewMode.Upcoming}>
                <ScheduledTransactions
                  scheduledTransactions={upcomingScheduledTransactions}
                  onScheduledTransactionClick={handleScheduledTransactionClick}
                  onViewAll={handleViewAllScheduled}
                />
              </If>
              <If condition={transactionViewMode === DashboardTransactionViewMode.Recent}>
                <RecentTransactions
                  transactions={recentTransactionsList}
                  onTransactionClick={handleTransactionClick}
                  onViewAll={handleViewAllTransactions}
                />
              </If>
            </div>
          </div>
        </PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

export default DashboardPage;
