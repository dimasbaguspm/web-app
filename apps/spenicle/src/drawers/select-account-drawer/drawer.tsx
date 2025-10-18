import { useApiSpenicleAccountsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  Drawer,
  FormLayout,
  NoResults,
  PageLoader,
  SearchInput,
  SelectableSingleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, XIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { AccountCard } from '../../components/account-card';
import { AccountFiltersControl } from '../../components/account-filter-control';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { useAccountFilter } from '../../hooks/use-account-filter';

interface SelectAccountDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payload: Record<string, unknown>;
  payloadId: string;
}

export const SelectAccountDrawer: FC<SelectAccountDrawerProps> = ({
  returnToDrawer,
  returnToDrawerId = null,
  payloadId,
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    typeof payload?.[payloadId] === 'number' ? payload[payloadId] : null,
  );

  const accountFilters = useAccountFilter({ adapter: 'state' });
  const [searchValue, setSearchValue] = useDebouncedState({ defaultValue: '' });

  const [accounts, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountsInfiniteQuery({
      search: searchValue,
      accountGroupIds: accountFilters.appliedFilters.groupId,
      type: accountFilters.appliedFilters.type,
      sortBy: 'name',
      sortOrder: 'asc',
      pageSize: 15,
    });

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedAccountId,
        },
      },
    });
  };

  const handleOnCancel = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload,
      },
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Account</Drawer.Title>
        <ButtonIcon as={XIcon} size="sm" variant="ghost" aria-label="Close" onClick={handleOnCancel} />
      </Drawer.Header>

      <Drawer.Body>
        <FormLayout className="mb-4">
          <FormLayout.Column span={12}>
            <SearchInput defaultValue={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          </FormLayout.Column>
          <FormLayout.Column span={12}>
            <AccountFiltersControl config={accountFilters} />
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isInitialFetching]}>
          <PageLoader />
        </If>

        <If condition={[accounts?.length, !isInitialFetching]}>
          <ul className="mb-4">
            {accounts?.map((account) => {
              return (
                <li key={account.id}>
                  <SelectableSingleInput
                    value={account.id.toString()}
                    checked={account.id === selectedAccountId}
                    onChange={() => setSelectedAccountId(account.id)}
                  >
                    <AccountCard as="div" account={account} size="none" supplementaryInfo="" />
                  </SelectableSingleInput>
                </li>
              );
            })}
          </ul>
          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button onClick={() => fetchNextPage()} variant="outline" disabled={isFetchingNextPage}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>

        <If condition={[!accounts?.length, !isInitialFetching]}>
          <NoResults
            icon={SearchXIcon}
            title="No accounts found"
            subtitle="Try adjusting your search criteria, or create a new account"
            action={
              <ButtonGroup>
                <Button variant="outline" onClick={() => openDrawer(DRAWER_ROUTES.NEW_ACCOUNT)}>
                  Create Account
                </Button>
              </ButtonGroup>
            }
          />
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button form="select-account-form" onClick={handleOnSubmit} disabled={!selectedAccountId}>
            Select
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
