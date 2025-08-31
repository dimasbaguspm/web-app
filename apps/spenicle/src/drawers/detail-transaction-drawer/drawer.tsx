import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import {
  formatSpenicleAccount,
  formatSpenicleCategory,
  formatSpenicleTransaction,
} from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  AttributeList,
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonIcon,
  Drawer,
  Icon,
  LoadingIndicator,
  Text,
} from '@dimasbaguspm/versaur';
import { CopyIcon, Edit2Icon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';

import { generatePayloadCopyTransaction } from './helpers';
import { useDetailTransactionData } from './hooks/use-detail-transaction-data';

interface DetailTransactionDrawerProps {
  transactionId: number;
}

export const DetailTransactionDrawer: FC<DetailTransactionDrawerProps> = ({
  transactionId,
}) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const {
    transactionData,
    accountData,
    destinationAccountData,
    categoryData,
    isInitialLoading,
  } = useDetailTransactionData({ transactionId });

  const { note, variant, capitalizedType, time, date, amount } =
    formatSpenicleTransaction(transactionData);

  const { name: accountName } = formatSpenicleAccount(accountData);
  const { name: destinationAccountName } = formatSpenicleAccount(
    destinationAccountData,
  );
  const { name: categoryName } = formatSpenicleCategory(categoryData);

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_TRANSACTION, {
      transactionId,
    });
  };

  const handleOnCopyClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_TRANSACTION, undefined, {
      state: {
        payload: generatePayloadCopyTransaction(transactionData!),
      },
    });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_TRANSACTION, {
      transactionId,
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Transaction Details</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isInitialLoading, !transactionData]}>
        <LoadingIndicator size="sm" type="bar" />
      </If>

      <If condition={[!isInitialLoading, transactionData]}>
        <Drawer.Body>
          <ButtonGroup className="mb-4">
            <Button variant="outline" onClick={handleOnEditClick}>
              <Icon as={Edit2Icon} size="sm" color="inherit" />
              Edit
            </Button>

            <Button variant="outline" onClick={handleOnCopyClick}>
              <Icon as={CopyIcon} size="sm" color="inherit" />
              Copy
            </Button>

            <ButtonIcon
              as={TrashIcon}
              onClick={handleDeleteClick}
              size="sm"
              className="ml-auto"
              variant="outline"
              aria-label="Delete transaction"
            />
          </ButtonGroup>

          <BadgeGroup className="mb-4">
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
              <Text>{categoryName}</Text>
            </AttributeList.Item>
            <AttributeList.Item title="Source">
              <Text>{accountName}</Text>
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
