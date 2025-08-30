import { useApiSpenicleAccountsPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
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
import { PlusIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { AccountCard } from './components';
import { ActionsControl } from './components/actions-control';
import { FilterControl } from './components/filter-control';
import { useAccountFilter } from './hooks/use-account-filter';

const AccountsPage = () => {
  const { openDrawer } = useDrawerRoute();
  const { appliedFilters } = useAccountFilter();

  const [accounts, , { isLoading }] = useApiSpenicleAccountsPaginatedQuery({
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
            <ButtonIcon
              as={PlusIcon}
              aria-label="New Account"
              onClick={handleOpenDrawer}
            />
          </ButtonGroup>
        }
      />
      <PageContent>
        <If condition={isLoading}>
          <LoadingIndicator type="bar" size="sm" />
        </If>

        <If condition={[accounts, accounts?.items]}>
          <ActionsControl />
          <FilterControl />
          <div className="space-y-4">
            <ul className="grid grid-cols-1">
              {accounts?.items.map((account) => (
                <li key={account.id} className="border-b border-border">
                  <AccountCard account={account} onClick={handleAccountClick} />
                </li>
              ))}
            </ul>
          </div>
        </If>

        <If condition={[!isLoading, accounts?.items.length === 0]}>
          <NoResults
            icon={PlusIcon}
            title="No accounts yet"
            subtitle="Create your first account to start managing your finances"
            action={
              <ButtonGroup>
                <Button onClick={handleOpenDrawer}>
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
