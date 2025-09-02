import { useApiSpenicleAccountsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Icon,
  LoadingIndicator,
  NoResults,
  PageContent,
  PageHeader,
} from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { AccountCard } from './components';
import { ActionsControl } from './components/actions-control';
import { FilterControl } from './components/filter-control';
import { useAccountFilter } from './hooks/use-account-filter';

const AccountsPage = () => {
  const { openDrawer } = useDrawerRoute();
  const { appliedFilters } = useAccountFilter();

  const [accounts, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountsInfiniteQuery({
      pageSize: 15,
      search: appliedFilters.q,
      type: appliedFilters.type,
    });

  const handleOpenDrawer = () => {
    openDrawer(DRAWER_ROUTES.NEW_ACCOUNT);
  };

  const handleAccountClick = (account: AccountModel) => {
    openDrawer(DRAWER_ROUTES.ACCOUNT_DETAIL, { accountId: account.id });
  };

  return (
    <>
      <PageHeader
        title="Accounts"
        subtitle="Manage your accounts"
        actions={
          <ButtonGroup>
            <Button onClick={handleOpenDrawer}>
              <Icon as={PlusIcon} color="inherit" />
              New Account
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} aria-label="New Account" onClick={handleOpenDrawer} />
          </ButtonGroup>
        }
      />
      <PageContent>
        <If condition={isInitialFetching}>
          <LoadingIndicator type="bar" size="sm" />
        </If>

        <If condition={[accounts]}>
          <ActionsControl />
          <FilterControl />
          <div className="space-y-4">
            <ul className="grid grid-cols-1 mb-4">
              {accounts?.map((account) => (
                <li key={account.id} className="border-b border-border">
                  <AccountCard account={account} onClick={handleAccountClick} />
                </li>
              ))}
            </ul>
            <If condition={hasNextPage}>
              <ButtonGroup alignment="center">
                <Button onClick={() => fetchNextPage()} variant="outline" disabled={isFetchingNextPage}>
                  Load More
                </Button>
              </ButtonGroup>
            </If>
          </div>
        </If>

        <If condition={[!isInitialFetching, accounts?.length === 0]}>
          <NoResults
            icon={SearchXIcon}
            title="No accounts yet"
            subtitle="Create your first account to start managing your finances"
            action={
              <ButtonGroup>
                <Button onClick={handleOpenDrawer} variant="outline">
                  <Icon as={PlusIcon} color="inherit" />
                  Create Account
                </Button>
              </ButtonGroup>
            }
          />
        </If>
      </PageContent>
    </>
  );
};

export default AccountsPage;
