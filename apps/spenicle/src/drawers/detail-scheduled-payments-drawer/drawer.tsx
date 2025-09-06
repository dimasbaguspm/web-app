import { TransactionModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatSpenicleScheduledTransaction } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonIcon,
  Drawer,
  Heading,
  Hr,
  Icon,
  NoResults,
  PageLoader,
} from '@dimasbaguspm/versaur';
import { Edit2Icon, ListXIcon, Trash2Icon } from 'lucide-react';
import { FC } from 'react';

import { TransactionCard } from '../../components/transaction-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';

import { useDetailsScheduledPaymentsData } from './use-details-scheduled-payments-data';

interface DetailScheduledPaymentsDrawerProps {
  scheduledTransactionId: number;
}

export const DetailScheduledPaymentsDrawer: FC<DetailScheduledPaymentsDrawerProps> = ({ scheduledTransactionId }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const { data, scheduledTransaction, isLoading, isInitialFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useDetailsScheduledPaymentsData(scheduledTransactionId);

  const { name, installmentProgress, isRecurring, pastOccurrences } =
    formatSpenicleScheduledTransaction(scheduledTransaction);

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_SCHEDULED_PAYMENTS, {
      scheduledTransactionId,
    });
  };

  const handleOnDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_SCHEDULED_PAYMENT, {
      scheduledPaymentId: scheduledTransactionId,
    });
  };

  const handleOnTransactionClick = (transaction: TransactionModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_TRANSACTION, {
      transactionId: transaction.id,
    });
  };

  const isFirstLoading = isLoading || isInitialFetching;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>{name} Scheduled Payment</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <ButtonGroup hasMargin alignment="between">
          <Button variant="outline" onClick={handleOnEditClick}>
            <Icon as={Edit2Icon} color="inherit" size="sm" />
            Edit
          </Button>
          <ButtonIcon
            variant="danger-outline"
            as={Trash2Icon}
            aria-label="Delete Scheduled Payment"
            onClick={handleOnDeleteClick}
          />
        </ButtonGroup>

        <BadgeGroup hasMargin>
          <Badge color="info">{isRecurring ? 'Recurring' : 'Installment'}</Badge>

          <If condition={[!isRecurring, installmentProgress]}>
            <Badge color="info">{installmentProgress} Installments</Badge>
          </If>
          <If condition={isRecurring}>
            <Badge color="info">{pastOccurrences} Occurrences</Badge>
          </If>
        </BadgeGroup>

        <If condition={isFirstLoading}>
          <PageLoader />
        </If>
        <If condition={!isFirstLoading}>
          <Hr hasMargin />
          <Heading hasMargin level={3}>
            Past Transactions ({data.length})
          </Heading>
        </If>
        <If condition={[!isFirstLoading, !data.length]}>
          <NoResults
            icon={ListXIcon}
            title="No Scheduled Payments"
            subtitle="There are no scheduled payments at the moment"
          />
        </If>
        <If condition={[!isFirstLoading, data.length]}>
          <ul className="mb-4">
            {data.map(({ account, category, transaction }, index) => {
              const isLastItem = index === data.length - 1;
              return (
                <li key={transaction.id}>
                  <TransactionCard
                    transaction={transaction}
                    account={account}
                    category={category}
                    onClick={handleOnTransactionClick}
                    useDateTime
                  />
                  {!isLastItem && <Hr />}
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
      </Drawer.Body>
    </>
  );
};
