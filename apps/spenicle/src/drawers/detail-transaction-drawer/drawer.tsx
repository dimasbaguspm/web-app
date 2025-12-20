import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatSpenicleAccount, formatSpenicleCategory, formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Anchor,
  AttributeList,
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonIcon,
  Drawer,
  Icon,
  PageLoader,
  Text,
} from '@dimasbaguspm/versaur';
import { Edit2Icon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';

import { useDetailTransactionData } from './hooks/use-detail-transaction-data';

interface DetailTransactionDrawerProps {
  transactionId: number;
}

export const DetailTransactionDrawer: FC<DetailTransactionDrawerProps> = ({ transactionId }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const { transactionData, accountData, destinationAccountData, categoryData, isInitialLoading } =
    useDetailTransactionData({ transactionId });

  const { note, variant, capitalizedType, date, time, amount } = formatSpenicleTransaction(transactionData);

  const { name: accountName } = formatSpenicleAccount(accountData);
  const { name: destinationAccountName } = formatSpenicleAccount(destinationAccountData);
  const { name: categoryName } = formatSpenicleCategory(categoryData);

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_TRANSACTION, {
      transactionId,
    });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_TRANSACTION, {
      transactionId,
    });
  };

  const handleCategoryClick = () => {
    openDrawer(DRAWER_ROUTES.DETAIL_CATEGORY, {
      categoryId: categoryData?.id.toString() || '',
    });
  };

  const handleAccountClick = () => {
    openDrawer(DRAWER_ROUTES.ACCOUNT_DETAIL, {
      accountId: accountData?.id.toString() || '',
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Transaction Details</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isInitialLoading, !transactionData]}>
        <PageLoader />
      </If>

      <If condition={[!isInitialLoading, transactionData]}>
        <Drawer.Body>
          <ButtonGroup hasMargin>
            <Button variant="outline" onClick={handleOnEditClick}>
              <Icon as={Edit2Icon} size="sm" color="inherit" />
              Edit
            </Button>

            <ButtonIcon
              as={TrashIcon}
              onClick={handleDeleteClick}
              className="ml-auto"
              variant="outline"
              aria-label="Delete transaction"
            />
          </ButtonGroup>

          <BadgeGroup hasMargin>
            <Badge color={variant}>{capitalizedType}</Badge>
          </BadgeGroup>

          <AttributeList className="mb-4" columns={2}>
            <AttributeList.Item title="Time">
              <Text>{time}</Text>
            </AttributeList.Item>
            <AttributeList.Item title="Date">
              <Text>{date}</Text>
            </AttributeList.Item>
            <AttributeList.Item title="Amount">
              <Text>{amount}</Text>
            </AttributeList.Item>
            <AttributeList.Item title="Category">
              <Anchor onClick={handleCategoryClick}>{categoryName}</Anchor>
            </AttributeList.Item>
            <AttributeList.Item title="Source">
              <Anchor onClick={handleAccountClick}>{accountName}</Anchor>
            </AttributeList.Item>
            <If condition={[destinationAccountName]}>
              <AttributeList.Item title="Destination">
                <Text>{destinationAccountName}</Text>
              </AttributeList.Item>
            </If>
            <If condition={[note]}>
              <AttributeList.Item title="Notes" span={2}>
                <Text>{note}</Text>
              </AttributeList.Item>
            </If>
          </AttributeList>
        </Drawer.Body>
      </If>
    </>
  );
};
