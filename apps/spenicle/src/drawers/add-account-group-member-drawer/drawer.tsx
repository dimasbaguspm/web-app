import {
  useApiSpenicleAccountGroupQuery,
  useApiSpenicleAccountsInfiniteQuery,
  useApiSpenicleUpdateAccount,
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
  Drawer,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableMultipleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface AddAccountGroupMemberDrawerProps {
  accountGroupId: number;
}

export const AddAccountGroupMemberDrawer: FC<AddAccountGroupMemberDrawerProps> = ({ accountGroupId }) => {
  const { openDrawer, closeDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  const [searchTerm, setSearchTerm] = useDebouncedState();

  const [updateAccount] = useApiSpenicleUpdateAccount();
  const [accountGroup] = useApiSpenicleAccountGroupQuery(accountGroupId);

  const [accounts, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountsInfiniteQuery({
      search: searchTerm,
    });

  const defaultSelectedAccountIds = accounts
    .filter((account) => account.accountGroupId === accountGroupId)
    .map((account) => account.id);

  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>(defaultSelectedAccountIds);

  useEffect(() => {
    setSelectedAccountIds((prevSelected) => prevSelected.filter((id) => defaultSelectedAccountIds.includes(id)));
  }, [accounts]);

  const handleCreateNewAccount = () => {
    openDrawer(DRAWER_ROUTES.NEW_ACCOUNT);
  };

  const handleOnSubmit = () => {
    const promises: Promise<unknown>[] = [];

    selectedAccountIds.forEach((accountId) => {
      promises.push(
        updateAccount({
          id: accountId,
          accountGroupId,
        }),
      );
    });

    Promise.all(promises).then(() => {
      closeDrawer();
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Manage {accountGroup?.name} Members</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <div className="mb-4">
          <SearchInput
            defaultValue={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <If condition={isInitialFetching}>
          <LoadingIndicator size="sm" type="bar" />
        </If>
        <If condition={[!isInitialFetching, !accounts.length]}>
          <NoResults
            icon={SearchXIcon}
            title="No accounts found"
            subtitle="There are no accounts available to add to this group"
            action={
              <ButtonGroup alignment="center">
                <Button variant="outline" onClick={handleCreateNewAccount}>
                  Create
                </Button>
              </ButtonGroup>
            }
          />
        </If>
        <If condition={!!accounts.length}>
          <ul>
            {accounts.map((account) => {
              const { type, variant } = formatSpenicleAccount(account);
              return (
                <li key={account.id}>
                  <SelectableMultipleInput
                    label={
                      <div className="flex flex-col w-auto">
                        <Text className="mb-2" fontSize="base" fontWeight="semibold">
                          {account.name}
                        </Text>
                        <BadgeGroup>
                          <Badge color={variant} size="sm">
                            {type}
                          </Badge>
                        </BadgeGroup>
                      </div>
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
              <Button variant="ghost" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
                Load more
              </Button>
            </ButtonGroup>
          </If>
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
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
