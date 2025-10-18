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
  SelectableMultipleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, XIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { AccountCard } from '../../components/account-card';
import { AccountFiltersControl } from '../../components/account-filter-control';
import { useAccountFilter } from '../../hooks/use-account-filter';

interface SelectMultipleAccountDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payload: Record<string, unknown>;
  payloadId: string;
}

export const SelectMultipleAccountDrawer: FC<SelectMultipleAccountDrawerProps> = ({
  returnToDrawer,
  returnToDrawerId = null,
  payloadId,
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();

  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>(
    typeof payload?.[payloadId] === 'number'
      ? [payload[payloadId]]
      : Array.isArray(payload?.[payloadId])
        ? payload[payloadId]
        : [],
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
          [payloadId]: selectedAccountIds,
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

        <If condition={[accounts.length, !isInitialFetching]}>
          <ul className="mb-4">
            <li>
              <SelectableMultipleInput
                checked={selectedAccountIds.length === accounts.length && selectedAccountIds.length > 0}
                value="all"
                onChange={() => {
                  if (selectedAccountIds.length === accounts.length) {
                    setSelectedAccountIds([]);
                  } else {
                    setSelectedAccountIds(accounts.map((account) => account.id));
                  }
                }}
              >
                Select All Visible
              </SelectableMultipleInput>
            </li>
            {accounts?.map((account) => {
              return (
                <li key={account.id}>
                  <SelectableMultipleInput
                    checked={selectedAccountIds.includes(account.id)}
                    value={account.id.toString()}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccountIds([...selectedAccountIds, account.id]);
                      } else {
                        setSelectedAccountIds(selectedAccountIds.filter((id) => id !== account.id));
                      }
                    }}
                  >
                    <AccountCard as="div" size="none" account={account} supplementaryInfo="" />
                  </SelectableMultipleInput>
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
            subtitle="Try adjusting your search criteria, or create a new account."
          />
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button form="select-account-form" onClick={handleOnSubmit}>
            Select
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
