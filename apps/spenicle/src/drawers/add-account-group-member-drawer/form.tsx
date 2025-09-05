import { useApiSpenicleAccountsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableMultipleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

interface FormProps {
  handleCreateNewAccount: () => void;
  handleOnAccountSelect: (ids: number[]) => void;
  accountIds: number[];
}
export const Form: FC<FormProps> = ({ handleCreateNewAccount, handleOnAccountSelect, accountIds }) => {
  const [searchTerm, setSearchTerm] = useDebouncedState<string>();

  const [accounts, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleAccountsInfiniteQuery({
      search: searchTerm,
    });

  return (
    <>
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
        <ul className="mb-4">
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
            <Button variant="ghost" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              Load more
            </Button>
          </ButtonGroup>
        </If>
      </If>
    </>
  );
};
