import {
  useApiSpenicleAccountQuery,
  useApiSpenicleCategoryQuery,
  useApiSpenicleTransactionQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  formatSpenicleAccount,
  formatSpenicleCategory,
  formatSpenicleTransaction,
} from '@dimasbaguspm/utils/data';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
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
import dayjs from 'dayjs';
import { CopyIcon, Edit2Icon, TrashIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface DetailTransactionDrawerProps {
  transactionId: number;
}

export const DetailTransactionDrawer: FC<DetailTransactionDrawerProps> = ({
  transactionId,
}) => {
  const { openDrawer } = useDrawerRoute();

  const [transactionData, , { isFetching }] =
    useApiSpenicleTransactionQuery(transactionId);
  const [accountData, , { isFetching: isFetchingAccount }] =
    useApiSpenicleAccountQuery(transactionData?.accountId || 0, {
      enabled: !!transactionData?.accountId,
    });
  const [
    destinationAccountData,
    ,
    { isFetching: isFetchingDestinationAccount },
  ] = useApiSpenicleAccountQuery(transactionData?.destinationAccountId || 0, {
    enabled: !!transactionData?.destinationAccountId,
  });
  const [categoryData, , { isFetching: isFetchingCategory }] =
    useApiSpenicleCategoryQuery(transactionData?.categoryId || 0, {
      enabled: !!transactionData?.categoryId,
    });

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
        payload: {
          type: transactionData?.type,
          date: formatDate(dayjs(), DateFormat.ISO_DATE),
          time: formatDate(dayjs(), DateFormat.TIME_24H),
          accountId:
            typeof transactionData?.accountId === 'number'
              ? transactionData?.accountId
              : undefined,
          destinationAccountId:
            typeof transactionData?.destinationAccountId === 'number'
              ? transactionData?.destinationAccountId
              : undefined,
          categoryId:
            typeof transactionData?.categoryId === 'number'
              ? transactionData?.categoryId
              : undefined,
          amount:
            typeof transactionData?.amount === 'number'
              ? transactionData?.amount
              : undefined,
          notes: transactionData?.note,
        },
      },
    });
  };

  const isLoading =
    isFetching ||
    isFetchingAccount ||
    isFetchingDestinationAccount ||
    isFetchingCategory;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Transaction Details</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isLoading, !transactionData]}>
        <LoadingIndicator size="sm" type="bar" />
      </If>

      <If condition={[!isLoading, transactionData]}>
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
