import { useApiSpenicleAccountsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLoader,
} from '@dimasbaguspm/versaur';
import { BoltIcon, PlusIcon, SearchXIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { AccountCard } from '../../components/account-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';

import { ActionsControl } from './components/actions-control';
import { FilterControl } from './components/filter-control';
import { useAccountFilter } from './hooks/use-account-filter';

const AccountsPage = () => {
  const navigate = useNavigate();
  const { openDrawer } = useDrawerRoute();
  const { appliedFilters, getParsedSorterFilters } = useAccountFilter();

  const [accounts, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountsInfiniteQuery({
      pageSize: 15,
      search: appliedFilters.q,
      type: appliedFilters.type,
      ...getParsedSorterFilters(),
    });

  const handleOpenDrawer = () => {
    openDrawer(DRAWER_ROUTES.NEW_ACCOUNT);
  };

  const handleAccountClick = (account: AccountModel) => {
    openDrawer(DRAWER_ROUTES.ACCOUNT_DETAIL, { accountId: account.id });
  };

  const handleManageGroupClick = () => {
    navigate(DEEP_LINKS.SETTINGS_ACCOUNT_GROUPS.path);
  };

  return (
    <>
      <PageHeader
        title="Accounts"
        subtitle="Manage your accounts"
        actions={
          <ButtonGroup>
            <Button variant="outline" aria-label="Manage Groups" onClick={handleManageGroupClick}>
              <Icon as={BoltIcon} color="inherit" size="sm" />
              Manage Group
            </Button>
            <Button onClick={handleOpenDrawer}>
              <Icon as={PlusIcon} color="inherit" />
              New Account
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={BoltIcon} variant="outline" aria-label="Manage Groups" onClick={handleManageGroupClick} />
            <ButtonIcon as={PlusIcon} aria-label="New Account" onClick={handleOpenDrawer} />
          </ButtonGroup>
        }
      />
      <PageContent>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>

        <If condition={[!isInitialFetching, accounts]}>
          <ActionsControl />
          <FilterControl />
          <ul className="mb-4">
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
