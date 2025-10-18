import { useApiSpenicleAccountGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountGroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Hr,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLoader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';
import { useState } from 'react';

import { AccountGroupCard } from '../../components/account-group-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const SettingsAccountGroupsPage = () => {
  const { openDrawer } = useDrawerRoute();

  const [accountGroupSearch, setAccountGroupSearch] = useState('');

  const [accountGroups, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountGroupsInfiniteQuery({
      search: accountGroupSearch,
      pageSize: 15,
    });

  const handleNewAccountGroup = () => {
    openDrawer(DRAWER_ROUTES.NEW_ACCOUNT_GROUP);
  };

  const handleAccountGroupClick = (accountGroup: AccountGroupModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_ACCOUNT_GROUP, { accountGroupId: accountGroup.id });
  };

  return (
    <>
      <PageHeader
        title="Account Groups"
        subtitle="Manage your account groups to organize your accounts"
        size="wide"
        actions={
          <ButtonGroup>
            <Button onClick={handleNewAccountGroup}>
              <Icon as={PlusIcon} color="inherit" size="sm" />
              New Group
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} aria-label="Create account group" onClick={handleNewAccountGroup} />
          </ButtonGroup>
        }
      />

      <PageContent size="wide">
        <SearchInput
          placeholder="Search account groups..."
          value={accountGroupSearch}
          onChange={(e) => setAccountGroupSearch(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-4">
          <If condition={isInitialFetching}>
            <PageLoader />
          </If>
          <If condition={[!isInitialFetching, accountGroups.length === 0]}>
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
          <If condition={[!isInitialFetching, accountGroups.length > 0]}>
            <ul>
              {accountGroups.map((accountGroup, index) => {
                const isLastItem = index === accountGroups.length - 1;
                return (
                  <li key={accountGroup.id}>
                    <AccountGroupCard accountGroup={accountGroup} onClick={handleAccountGroupClick} />
                    {!isLastItem && <Hr />}
                  </li>
                );
              })}
            </ul>
            <If condition={hasNextPage}>
              <ButtonGroup>
                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  Load More
                </Button>
              </ButtonGroup>
            </If>
          </If>
        </div>
      </PageContent>
    </>
  );
};

export default SettingsAccountGroupsPage;
