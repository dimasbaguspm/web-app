import { useApiHiGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { GroupModel } from '@dimasbaguspm/interfaces';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatHiGroup } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  Button,
  ButtonGroup,
  ButtonIcon,
  Card,
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
    openDrawer(DRAWER_ROUTES.DETAIL_GROUP, { groupId: group.id.toString() });
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
              const { initialName, name, createdDateTime } = formatHiGroup(group);
              const isLastItem = index === groups.length - 1;
              return (
                <li key={group.id}>
                  <Card
                    avatar={<Avatar size="lg">{initialName}</Avatar>}
                    title={name}
                    supplementaryInfo={createdDateTime}
                    onClick={() => handleOnCardClick(group)}
                  />
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
