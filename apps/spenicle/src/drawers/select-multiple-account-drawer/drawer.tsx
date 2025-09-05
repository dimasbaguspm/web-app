import {
  useApiSpenicleAccountGroupsInfiniteQuery,
  useApiSpenicleAccountsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonMenu,
  Card,
  Drawer,
  FormLayout,
  Icon,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableMultipleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, SlidersHorizontalIcon } from 'lucide-react';
import { FC, useState } from 'react';

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
          <LoadingIndicator size="sm" type="bar" />
        </If>

        <If condition={[accounts.length, !isInitialFetching]}>
          <ul>
            {accounts?.map((account) => {
              const { type, variant, hasGroup, groups, formattedAmount } = formatSpenicleAccount(account);
              return (
                <li key={account.id}>
                  <SelectableMultipleInput
                    label={
                      <Card
                        title={account.name}
                        className="p-0"
                        badge={
                          <BadgeGroup>
                            <Badge color={variant} size="sm">
                              {type}
                            </Badge>
                            <If condition={hasGroup}>
                              {groups.map(({ name }) => (
                                <Badge key={name} color="info" size="sm">
                                  {name}
                                </Badge>
                              ))}
                            </If>
                          </BadgeGroup>
                        }
                        supplementaryInfo={formattedAmount}
                      />
                    }
                    checked={selectedAccountIds.includes(account.id)}
                    value={account.id.toString()}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccountIds([...selectedAccountIds, account.id]);
                      } else {
                        setSelectedAccountIds(selectedAccountIds.filter((id) => id !== account.id));
                      }
                    }}
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
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
