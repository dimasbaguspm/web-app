import { useApiSpenicleAccountsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { AccountModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  FormLayout,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLoader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { FoldersIcon, PlusIcon, SearchXIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { AccountCard } from '../../components/account-card';
import { AccountFiltersControl } from '../../components/account-filter-control';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { DEEP_LINKS } from '../../constants/page-routes';
import { useAccountFilter } from '../../hooks/use-account-filter';

const AccountsPage = () => {
  const { openDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  const navigate = useNavigate();

  const [debouncedAccountFilter, setDebouncedAccountFilter] = useDebouncedState<string>({
    adapter: 'url',
    urlKey: 'q',
  });
  const accountFilter = useAccountFilter({ adapter: 'url' });

  const [accounts, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountsInfiniteQuery({
      search: debouncedAccountFilter,
      type: accountFilter.appliedFilters.type,
      accountGroupIds: accountFilter.appliedFilters.groupId,
      pageSize: 15,
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
              <Icon as={FoldersIcon} color="inherit" size="sm" />
              Manage Group
            </Button>
            <Button onClick={handleOpenDrawer}>
              <Icon as={PlusIcon} color="inherit" size="sm" />
              New Account
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon
              as={FoldersIcon}
              variant="outline"
              aria-label="Manage Groups"
              onClick={handleManageGroupClick}
            />
            <ButtonIcon as={PlusIcon} aria-label="New Account" onClick={handleOpenDrawer} />
          </ButtonGroup>
        }
      />
      <PageContent>
        <FormLayout>
          <FormLayout.Column span={isDesktop ? 4 : 12}>
            <SearchInput
              defaultValue={debouncedAccountFilter}
              onChange={(ev) => setDebouncedAccountFilter(ev.target.value)}
            />
          </FormLayout.Column>
          <FormLayout.Column span={isDesktop ? 8 : 12}>
            <AccountFiltersControl config={accountFilter} />
          </FormLayout.Column>
        </FormLayout>

        <If condition={isInitialFetching}>
          <PageLoader />
        </If>

        <If condition={[!isInitialFetching, accounts]}>
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
