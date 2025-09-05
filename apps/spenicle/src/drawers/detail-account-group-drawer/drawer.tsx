import { useApiSpenicleAccountGroupQuery, useApiSpenicleAccountsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonIcon,
  Card,
  Drawer,
  Heading,
  Icon,
  LoadingIndicator,
  NoResults,
  Text,
} from '@dimasbaguspm/versaur';
import { Edit3Icon, TrashIcon, UsersRoundIcon, UserX2Icon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';

interface DetailAccountGroupDrawerProps {
  accountGroupId: number;
}

export const DetailAccountGroupDrawer: FC<DetailAccountGroupDrawerProps> = ({ accountGroupId }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const [accountGroup] = useApiSpenicleAccountGroupQuery(accountGroupId, {
    enabled: Boolean(accountGroupId),
  });

  const [accounts, , { isFetching: isFetchingAccounts }] = useApiSpenicleAccountsInfiniteQuery(
    {
      id: accountGroup?.memberIds || [],
    },
    {
      enabled: Boolean(accountGroup?.memberIds.length),
    },
  );

  const handleAddMembersClick = () => {
    openDrawer(DRAWER_ROUTES.ADD_ACCOUNT_GROUP_MEMBERS, { accountGroupId });
  };

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_ACCOUNT_GROUP, { accountGroupId });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_ACCOUNT_GROUP, { accountGroupId });
  };

  const handleAccountClick = (accountId: number) => {
    openDrawer(DRAWER_ROUTES.ACCOUNT_DETAIL, { accountId });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>{accountGroup?.name ?? 'Account Group Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <ButtonGroup alignment="between" hasMargin>
          <ButtonGroup>
            <Button variant="outline" onClick={handleEditClick}>
              <Icon as={Edit3Icon} color="inherit" size="sm" />
              Edit
            </Button>
            <Button variant="outline" aria-label="Manage Members" onClick={handleAddMembersClick}>
              <Icon as={UsersRoundIcon} color="inherit" size="sm" />
              Manage
            </Button>
          </ButtonGroup>
          <ButtonIcon
            as={TrashIcon}
            variant="danger-outline"
            aria-label="Delete Account Group"
            onClick={handleDeleteClick}
          />
        </ButtonGroup>

        <div>
          <Heading level={3} hasMargin>
            Members
          </Heading>
          <If condition={isFetchingAccounts}>
            <LoadingIndicator size="sm" type="bar" />
          </If>
          <If condition={[!isFetchingAccounts, !accounts.length]}>
            <NoResults
              icon={UserX2Icon}
              title="No members found"
              subtitle="This group doesn't have any members yet. Start adding to manage accounts."
              action={
                <ButtonGroup>
                  <Button variant="outline" onClick={handleAddMembersClick}>
                    Create Group
                  </Button>
                </ButtonGroup>
              }
            />
          </If>
          <If condition={[!isFetchingAccounts, accounts.length]}>
            <ul>
              {accounts?.map((account) => {
                const { type, variant, initialName, formattedAmount } = formatSpenicleAccount(account);
                return (
                  <li key={account.id}>
                    <Card
                      onClick={() => handleAccountClick(account.id)}
                      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
                      title={account.name}
                      badge={
                        <BadgeGroup>
                          <Badge color={variant}>{type}</Badge>
                        </BadgeGroup>
                      }
                      supplementaryInfo={
                        <Text fontSize="sm" color="gray">
                          {formattedAmount}
                        </Text>
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </If>
        </div>
      </Drawer.Body>
    </>
  );
};
