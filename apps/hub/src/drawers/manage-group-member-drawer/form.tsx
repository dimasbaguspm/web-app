import { useApiHiUsersInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, PageLoader, SearchInput, SelectableMultipleInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { UserCard } from '../../components/user-card';

interface FormProps {
  handleOnUserSelect: (ids: number[]) => void;
  userIds: number[];
}
export const Form: FC<FormProps> = ({ handleOnUserSelect, userIds }) => {
  const [searchTerm, setSearchTerm] = useDebouncedState<string>();

  const [users, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiHiUsersInfiniteQuery({
      search: searchTerm,
      pageSize: 15,
    });

  return (
    <>
      <div className="mb-4">
        <SearchInput defaultValue={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" />
      </div>

      <If condition={isInitialFetching}>
        <PageLoader />
      </If>

      <If condition={!!users.length}>
        <ul className="mb-4">
          {users.map((user) => (
            <li key={user.id}>
              <SelectableMultipleInput
                checked={userIds.includes(user.id)}
                value={user.id.toString()}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleOnUserSelect([...userIds, user.id]);
                  } else {
                    handleOnUserSelect(userIds.filter((id) => id !== user.id));
                  }
                }}
              >
                <UserCard as="div" size="none" user={user} />
              </SelectableMultipleInput>
            </li>
          ))}
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
