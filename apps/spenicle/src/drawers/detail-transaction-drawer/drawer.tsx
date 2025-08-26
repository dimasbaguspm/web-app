import { useApiSpenicleTransactionQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleTransaction } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  AttributeList,
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  Drawer,
  Icon,
  LoadingIndicator,
  Text,
} from '@dimasbaguspm/versaur';
import { Edit2Icon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface DetailTransactionDrawerProps {
  transactionId: number;
}

export const DetailTransactionDrawer: FC<DetailTransactionDrawerProps> = ({
  transactionId,
}) => {
  const [transactionData, , { isFetching }] =
    useApiSpenicleTransactionQuery(transactionId);
  const { openDrawer } = useDrawerRoute();

  const { note, variant, capitalizedType, time, date, amount, updatedAt } =
    formatSpenicleTransaction(transactionData);

  const handleOnEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_TRANSACTION, {
      transactionId,
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Transaction Details</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={[isFetching, !transactionData]}>
        <LoadingIndicator size="sm" type="bar" />
      </If>

      <If condition={[!isFetching, transactionData]}>
        <Drawer.Body>
          <ButtonGroup className="mb-4">
            <Button variant="outline" onClick={handleOnEditClick}>
              <Icon as={Edit2Icon} size="sm" color="inherit" />
              Edit
            </Button>
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
            <AttributeList.Item title="Last update">
              <Text>{updatedAt}</Text>
            </AttributeList.Item>
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
