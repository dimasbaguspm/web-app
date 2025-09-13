import { useApiHiGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { GroupModel } from '@dimasbaguspm/interfaces';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  FormLayout,
  Hr,
  Icon,
  PageContent,
  PageHeader,
  PageLoader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { PlusIcon } from 'lucide-react';
import { FC } from 'react';

import { GroupCard } from '../../components/group-card';
import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const GroupPage: FC = () => {
  const { openDrawer } = useDrawerRoute();
  const { user } = useAuthProvider();
  const { isDesktop } = useWindowResize();

  const [searchTerm, setSearchTerm] = useDebouncedState<string>();

  const [groups, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiHiGroupsInfiniteQuery({
      search: searchTerm,
      memberIds: user?.id ? [user.id] : undefined,
      sortBy: 'name',
      sortOrder: 'asc',
      pageSize: 15,
    });

  const handleOnNewGroupClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_GROUP);
  };

  const handleOnCardClick = (group: GroupModel) => {
    openDrawer(DRAWER_ROUTES.DETAIL_GROUP, { groupId: group.id });
  };

  return (
    <>
      <PageHeader
        title="My Groups"
        subtitle="Manage your groups and their members"
        actions={
          <ButtonGroup>
            <Button onClick={handleOnNewGroupClick}>
              <Icon as={PlusIcon} color="inherit" />
              New Group
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} aria-label="New Group" onClick={handleOnNewGroupClick} />
          </ButtonGroup>
        }
      />

      <PageContent>
        <FormLayout className="mb-4">
          <FormLayout.Column span={isDesktop ? 4 : 12}>
            <SearchInput
              placeholder="Search"
              variant="neutral"
              defaultValue={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
            />
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isInitialFetching]}>
          <PageLoader />
        </If>
        <If condition={[groups?.length, !isInitialFetching]}>
          <ul className="mb-4">
            {groups?.map((group, index) => {
              const isLastItem = index === groups.length - 1;
              return (
                <li key={group.id}>
                  <GroupCard group={group} onClick={handleOnCardClick} />
                  {!isLastItem && <Hr />}
                </li>
              );
            })}
          </ul>

          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button disabled={isFetchingNextPage} variant="outline" onClick={() => fetchNextPage()}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>
      </PageContent>
    </>
  );
};

export default GroupPage;
