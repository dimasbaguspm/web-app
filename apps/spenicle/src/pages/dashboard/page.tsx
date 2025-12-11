import {
  useApiSpenicleSummaryTotalQuery,
  useApiSpenicleSummaryTransactionsQuery,
  useApiSpenicleTransactionsPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatHiUserData } from '@dimasbaguspm/utils/data';
import { PageContent, PageHeader, PageLayout } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { NetBalanceCard, RecentTransactions, ThisMonthSummaryCards } from './components';

const DashboardPage = () => {
  const { isMobile } = useWindowResize();

  const { user } = useAuthProvider();
  const [totalSummary] = useApiSpenicleSummaryTotalQuery({});
  const [summaryTransactions] = useApiSpenicleSummaryTransactionsQuery({
    frequency: 'monthly',
    from: dayjs().subtract(6, 'month').startOf('month').toISOString(),
    to: dayjs().endOf('month').toISOString(),
  });
  const [transactions] = useApiSpenicleTransactionsPaginatedQuery({});

  const navigate = useNavigate();
  const { openDrawer } = useDrawerRoute();

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

  const handleTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, { transactionId: transaction.id });
  };

  const handleViewAllTransactions = () => {
    navigate(DEEP_LINKS.TRANSACTIONS_ALT.path);
  };

  const handleViewMoreSummary = () => {
    navigate(DEEP_LINKS.SUMMARY.path);
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
            <div className="lg:col-span-1">
              <RecentTransactions
                transactions={recentTransactionsList}
                onTransactionClick={handleTransactionClick}
                onViewAll={handleViewAllTransactions}
              />
            </div>
          </div>
        </PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

export default DashboardPage;
