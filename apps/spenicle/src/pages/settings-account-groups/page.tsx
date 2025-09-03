import {
  useApiSpenicleAccountGroupsInfiniteQuery,
  useApiSpenicleAccountsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Hr,
  Icon,
  LoadingIndicator,
  NoResults,
  PageContent,
  PageHeader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { AccountGroupCard } from './components';

const SettingsAccountGroupsPage = () => {
  const { openDrawer } = useDrawerRoute();

  const [accountGroupSearch, setAccountGroupSearch] = useState('');

  const [accountGroups, , { isPending: isLoadingAccountGroups }] = useApiSpenicleAccountGroupsInfiniteQuery({
    search: accountGroupSearch,
    pageSize: 15,
  });
  const [accounts] = useApiSpenicleAccountsInfiniteQuery({
    accountGroupId: accountGroups.map((group) => group.id),
    pageSize: 15,
  });

  const accountGroupMemberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    accounts.forEach((account) => {
      if (account.accountGroupId) {
        counts[account.accountGroupId] = (counts[account.accountGroupId] || 0) + 1;
      }
    });
    return counts;
  }, [accounts]);

  const handleNewAccountGroup = () => {
    openDrawer(DRAWER_ROUTES.NEW_ACCOUNT_GROUP);
  };

  return (
    <>
      <PageHeader
        title="Account Groups"
        subtitle="Manage your account groups to organize your accounts"
        actions={
          <ButtonGroup>
            <Button variant="outline" onClick={handleNewAccountGroup}>
              <Icon as={PlusIcon} color="inherit" size="sm" />
              Create
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} aria-label="Create account group" onClick={handleNewAccountGroup} />
          </ButtonGroup>
        }
      />

      <PageContent>
        <SearchInput
          placeholder="Search account groups..."
          value={accountGroupSearch}
          onChange={(e) => setAccountGroupSearch(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-4">
          <If condition={isLoadingAccountGroups}>
            <LoadingIndicator size="sm" type="bar" />
          </If>
          <If condition={[!isLoadingAccountGroups, accountGroups.length === 0]}>
            <NoResults
              icon={SearchXIcon}
              title="No account groups found"
              subtitle={
                accountGroupSearch
                  ? 'Try adjusting your search terms'
                  : 'Create your first account group to organize your accounts'
              }
              action={
                <ButtonGroup>
                  <Button variant="outline" onClick={handleNewAccountGroup}>
                    Create
                  </Button>
                </ButtonGroup>
              }
            />
          </If>
          <If condition={[!isLoadingAccountGroups, accountGroups.length > 0]}>
            <ul>
              {accountGroups.map((accountGroup, index) => {
                const isLastItem = index === accountGroups.length - 1;
                return (
                  <li>
                    <AccountGroupCard
                      key={accountGroup.id}
                      accountGroup={accountGroup}
                      accountCount={accountGroupMemberCounts[accountGroup.id] || 0}
                    />
                    {!isLastItem && <Hr />}
                  </li>
                );
              })}
            </ul>
          </If>
        </div>
      </PageContent>
    </>
  );
};

export default SettingsAccountGroupsPage;
