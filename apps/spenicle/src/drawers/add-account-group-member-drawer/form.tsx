import { useApiSpenicleAccountsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  NoResults,
  PageLoader,
  SearchInput,
  SelectableMultipleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { AccountCard } from '../../components/account-card';
import { AccountFiltersControl } from '../../components/account-filter-control';
import { useAccountFilter } from '../../hooks/use-account-filter';

interface FormProps {
  handleCreateNewAccount: () => void;
  handleOnAccountSelect: (ids: number[]) => void;
  accountIds: number[];
}
export const Form: FC<FormProps> = ({ handleCreateNewAccount, handleOnAccountSelect, accountIds }) => {
  const [searchTerm, setSearchTerm] = useDebouncedState<string>();

  const filter = useAccountFilter({ adapter: 'state' });

  const [accounts, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountsInfiniteQuery({
      ...filter.appliedFilters,
      search: searchTerm,
      pageSize: 15,
    });

  return (
    <>
      <div className="mb-4">
        <SearchInput
          variant="neutral"
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />
      </div>
      <AccountFiltersControl config={filter} hideGroupFilter />

      <If condition={isInitialFetching}>
        <PageLoader />
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
        <ul className="mb-4">
          {accounts.map((account) => {
            return (
              <li key={account.id}>
                <SelectableMultipleInput
                  label={<AccountCard account={account} as="div" size="none" />}
                  checked={accountIds.includes(account.id)}
                  value={account.id.toString()}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleOnAccountSelect([...accountIds, account.id]);
                    } else {
                      handleOnAccountSelect(accountIds.filter((id) => id !== account.id));
                    }
                  }}
                />
              </li>
            );
          })}
        </ul>
        <If condition={hasNextPage}>
          <ButtonGroup alignment="center">
            <Button variant="outline" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              Load More
            </Button>
          </ButtonGroup>
        </If>
      </If>
    </>
  );
};
