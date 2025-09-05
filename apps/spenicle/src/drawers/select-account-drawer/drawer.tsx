import {
  useApiSpenicleAccountGroupsInfiniteQuery,
  useApiSpenicleAccountsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonMenu,
  Drawer,
  FormLayout,
  Icon,
  NoResults,
  PageLoader,
  SearchInput,
  SelectableSingleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { FC, useState } from 'react';

import { AccountCard } from '../../components/account-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

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

  const [searchValue, setSearchValue] = useDebouncedState({ defaultValue: '' });
  const [selectGroupId, setSelectGroupId] = useDebouncedState<number[]>({ defaultValue: [], debounceTime: 100 });

  const [accounts, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountsInfiniteQuery({
      search: searchValue,
      accountGroupIds: selectGroupId ? selectGroupId : undefined,
    });

  const [accountGroups] = useApiSpenicleAccountGroupsInfiniteQuery({
    pageSize: 100,
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
            <ButtonGroup>
              <If condition={accountGroups?.length}>
                <ButtonMenu
                  variant="outline"
                  preserve
                  label={
                    <>
                      <Icon as={SlidersHorizontalIcon} color="inherit" size="sm" />
                      Group
                    </>
                  }
                >
                  {accountGroups?.map((group) => (
                    <ButtonMenu.Item
                      key={group.id}
                      active={selectGroupId?.includes(group.id)}
                      onClick={() => {
                        if (selectGroupId?.includes(group.id)) {
                          setSelectGroupId(selectGroupId.filter((id) => id !== group.id));
                        } else {
                          setSelectGroupId([...selectGroupId, group.id]);
                        }
                      }}
                    >
                      {group.name}
                    </ButtonMenu.Item>
                  ))}
                </ButtonMenu>
              </If>
            </ButtonGroup>
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isInitialFetching]}>
          <PageLoader />
        </If>

        <If condition={[accounts?.length, !isInitialFetching]}>
          <ul>
            {accounts?.map((account) => {
              return (
                <li key={account.id}>
                  <SelectableSingleInput
                    label={<AccountCard as="div" account={account} size="none" />}
                    value={account.id.toString()}
                    checked={account.id === selectedAccountId}
                    onChange={() => setSelectedAccountId(account.id)}
                  />
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
