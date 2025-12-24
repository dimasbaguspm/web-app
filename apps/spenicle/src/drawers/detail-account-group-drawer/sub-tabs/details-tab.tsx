import { useApiSpenicleAccountsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountGroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, ButtonIcon, Heading, Icon, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { Edit3Icon, TrashIcon, UsersRoundIcon, UserX2Icon } from 'lucide-react';
import { FC } from 'react';

import { AccountCard } from '../../../components/account-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../../constants/modal-routes';

interface DetailsTabProps {
  accountGroup: AccountGroupModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ accountGroup }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const [accounts, , { isLoading: isFetchingAccounts }] = useApiSpenicleAccountsInfiniteQuery(
    {
      id: accountGroup?.memberIds || [],
    },
    {
      enabled: Boolean(accountGroup?.memberIds.length),
    },
  );

  const handleAddMembersClick = () => {
    openDrawer(DRAWER_ROUTES.ADD_ACCOUNT_GROUP_MEMBERS, { accountGroupId: accountGroup.id });
  };

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_ACCOUNT_GROUP, { accountGroupId: accountGroup.id });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_ACCOUNT_GROUP, { accountGroupId: accountGroup.id });
  };

  const handleAccountClick = (accountId: number) => {
    openDrawer(DRAWER_ROUTES.ACCOUNT_DETAIL, { accountId });
  };

  return (
    <>
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
          variant="destructive"
          aria-label="Delete Account Group"
          onClick={handleDeleteClick}
        />
      </ButtonGroup>

      <div>
        <Heading as="h4" hasMargin>
          Members
        </Heading>
        <If condition={isFetchingAccounts}>
          <PageLoader />
        </If>
        <If condition={[!isFetchingAccounts, !accounts.length]}>
          <NoResults
            icon={UserX2Icon}
            title="No members found"
            subtitle="This group doesn't have any members yet. Start adding to manage accounts."
            action={
              <ButtonGroup>
                <Button variant="outline" onClick={handleAddMembersClick}>
                  Add Members
                </Button>
              </ButtonGroup>
            }
          />
        </If>
        <If condition={[!isFetchingAccounts, accounts.length]}>
          <ul>
            {accounts?.map((account) => {
              return (
                <li key={account.id}>
                  <AccountCard account={account} onClick={() => handleAccountClick(account.id)} />
                </li>
              );
            })}
          </ul>
        </If>
      </div>
    </>
  );
};
