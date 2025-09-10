import { useApiHiUsersInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { formatHiUserData } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  PageLoader,
  SearchInput,
  SelectableMultipleInput,
} from '@dimasbaguspm/versaur';
import { FC } from 'react';

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
          {users.map((user) => {
            const { name, initial } = formatHiUserData(user);
            return (
              <li key={user.id}>
                <SelectableMultipleInput
                  label={<Card as="div" size="none" title={name} avatar={<Avatar shape="rounded">{initial}</Avatar>} />}
                  checked={userIds.includes(user.id)}
                  value={user.id.toString()}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleOnUserSelect([...userIds, user.id]);
                    } else {
                      handleOnUserSelect(userIds.filter((id) => id !== user.id));
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
