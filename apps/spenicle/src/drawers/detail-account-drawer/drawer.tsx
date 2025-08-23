import { useApiSpenicleAccountQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  DescriptionList,
  Drawer,
  Icon,
  LoadingIndicator,
} from '@dimasbaguspm/versaur';
import { EditIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface DetailAccountDrawerProps {
  accountId: number;
}

export const DetailAccountDrawer: FC<DetailAccountDrawerProps> = ({
  accountId,
}) => {
  const { openDrawer } = useDrawerRoute();
  const [account, , { isLoading }] = useApiSpenicleAccountQuery(accountId);

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_ACCOUNT, { accountId });
  };

  return (
    <>
      <Drawer.Header>
        <If condition={isLoading}>
          <Drawer.Title>Loading</Drawer.Title>
        </If>
        <If condition={!isLoading}>
          <Drawer.Title>{account?.name}</Drawer.Title>
        </If>

        <Drawer.CloseButton />
      </Drawer.Header>

      <If condition={isLoading}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isLoading, account]}>
        {() => {
          const { formattedAmount, type, isExpense } = formatSpenicleAccount(
            account!,
          );

          return (
            <Drawer.Body>
              <ButtonGroup className="mb-4">
                <Button variant="outline" onClick={handleEditClick}>
                  <Icon as={EditIcon} color="inherit" size="sm" />
                  Edit
                </Button>
              </ButtonGroup>

              <BadgeGroup className="mb-4">
                <Badge color={isExpense ? 'danger' : 'success'} size="md">
                  {type}
                </Badge>
              </BadgeGroup>

              <DescriptionList>
                <DescriptionList.Item span={12}>
                  <DescriptionList.Term>Amount</DescriptionList.Term>
                  <DescriptionList.Details>
                    {formattedAmount}
                  </DescriptionList.Details>
                </DescriptionList.Item>

                <If condition={account?.note}>
                  <DescriptionList.Item span={12}>
                    <DescriptionList.Term>Notes</DescriptionList.Term>
                    <DescriptionList.Details>
                      {account?.note || '-'}
                    </DescriptionList.Details>
                  </DescriptionList.Item>
                </If>
              </DescriptionList>
            </Drawer.Body>
          );
        }}
      </If>
    </>
  );
};
