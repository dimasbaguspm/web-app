import { useApiSpenicleSummaryTransactionsQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { AttributeList, Badge, BadgeGroup, Button, ButtonGroup, ButtonIcon, Hr, Icon } from '@dimasbaguspm/versaur';
import { EditIcon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

import { TransactionTrends } from '../../../components/transaction-trends';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../../constants/modal-routes';
import { useTransactionTrendsFilter } from '../../../hooks/use-transaction-trends-filter';

interface DetailsTabProps {
  data: AccountModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ data }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();
  const { type, isExpense, formattedAmount, notes, hasGroup, groups } = formatSpenicleAccount(data);

  const filters = useTransactionTrendsFilter({ adapter: 'state' });

  const [transactionsTrends, , { isLoading: isTrendsLoading }] = useApiSpenicleSummaryTransactionsQuery({
    accountId: [data.id],
    from: filters.appliedFilters.startDate,
    to: filters.appliedFilters.endDate,
    frequency: filters.appliedFilters.frequency,
    sortBy: 'date',
  });

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_ACCOUNT, { accountId: data.id });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_ACCOUNT, { accountId: data.id });
  };

  return (
    <>
      <ButtonGroup className="mb-4">
        <Button variant="outline" onClick={handleEditClick}>
          <Icon as={EditIcon} color="inherit" size="sm" />
          Edit
        </Button>
        <ButtonIcon
          as={TrashIcon}
          onClick={handleDeleteClick}
          className="ml-auto"
          variant="outline"
          aria-label="Delete category"
        />
      </ButtonGroup>

      <BadgeGroup className="mb-4">
        <Badge color={isExpense ? 'primary' : 'secondary'} size="md">
          {type}
        </Badge>
      </BadgeGroup>

      <AttributeList columns={1} className="mb-4">
        <AttributeList.Item title="Amount">{formattedAmount}</AttributeList.Item>
        <If condition={hasGroup}>
          <AttributeList.Item title="Groups">{groups.map(({ name }) => name).join(', ')}</AttributeList.Item>
        </If>
        <If condition={notes}>
          <AttributeList.Item title="Notes">{notes}</AttributeList.Item>
        </If>
      </AttributeList>

      <Hr hasMargin />

      <If condition={!isTrendsLoading}>
        <TransactionTrends
          transactions={transactionsTrends || []}
          metric={filters.appliedFilters.metric}
          frequency={filters.appliedFilters.frequency}
          hideStats
        />
      </If>
    </>
  );
};
