import { useApiSpenicleScheduledTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { formatSpenicleScheduledTransaction } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Badge, BadgeGroup, Button, ButtonGroup, Card, Icon, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';

const SettingsScheduledPaymentRecurringPage = () => {
  const [scheduledTransactions, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleScheduledTransactionsInfiniteQuery({});

  return (
    <>
      <If condition={isInitialFetching}>
        <PageLoader />
      </If>
      <If condition={[!isInitialFetching, !scheduledTransactions.length]}>
        <NoResults
          icon={SearchXIcon}
          title="No Recurring Transactions"
          subtitle="You have no recurring transactions at the moment. Click the button below to create your first recurring transaction"
          action={
            <ButtonGroup alignment="center">
              <Button variant="outline">Set Up Recurring Transaction</Button>
            </ButtonGroup>
          }
        />
      </If>
      <If condition={[!isInitialFetching, scheduledTransactions.length]}>
        <ul>
          {scheduledTransactions.map((scheduledTransaction) => {
            const {
              trimmedNotes,
              variant,
              capitalizedType,
              capitalizedStatus,
              amount,
              intervalName,
              IntervalIcon,
              nextRunDateTime,
            } = formatSpenicleScheduledTransaction(scheduledTransaction);
            return (
              <li key={scheduledTransaction.id}>
                <Card
                  title={amount}
                  subtitle={
                    <Card.List>
                      <Card.ListItem>
                        <Icon as={IntervalIcon} className="mr-2" color="inherit" />
                        {intervalName}
                      </Card.ListItem>
                      <Card.ListItem>{trimmedNotes}</Card.ListItem>
                    </Card.List>
                  }
                  badge={
                    <BadgeGroup>
                      <Badge color={variant}>{capitalizedType}</Badge>
                      <Badge color="accent_3">{capitalizedStatus}</Badge>
                    </BadgeGroup>
                  }
                  supplementaryInfo={`Next run: ${nextRunDateTime}`}
                />
              </li>
            );
          })}
        </ul>
        <If condition={hasNextPage}>
          <ButtonGroup alignment="center">
            <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              Load More
            </Button>
          </ButtonGroup>
        </If>
      </If>
    </>
  );
};

export default SettingsScheduledPaymentRecurringPage;
