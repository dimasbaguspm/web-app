import { useApiHiUsersInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { GroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Heading, Hr, Icon, PageLoader } from '@dimasbaguspm/versaur';
import { Edit2Icon, Users2Icon } from 'lucide-react';
import { FC } from 'react';

import { UserCard } from '../../../components/user-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface DetailsTabProps {
  group: GroupModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ group }) => {
  const { openDrawer } = useDrawerRoute();

  const [users, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiHiUsersInfiniteQuery({
      id: group.memberIds,
    });

  const handleOnEditGroupClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_GROUP, { groupId: group.id.toString() });
  };

  const handleOnManageMembersClick = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_GROUP_MEMBERS, { groupId: group.id.toString() });
  };

  return (
    <>
      <ButtonGroup hasMargin>
        <Button variant="outline" onClick={handleOnEditGroupClick}>
          <Icon as={Edit2Icon} size="sm" color="inherit" />
          Edit
        </Button>
        <Button variant="outline" onClick={handleOnManageMembersClick}>
          <Icon as={Users2Icon} size="sm" color="inherit" />
          Manage Members
        </Button>
      </ButtonGroup>

      <Heading hasMargin>Members</Heading>

      <If condition={isInitialFetching}>
        <PageLoader />
      </If>

      <If condition={[!isInitialFetching, users?.length]}>
        <ul className="mb-4">
          {users?.map((user, index) => {
            const isLast = index === users.length - 1;
            return (
              <li key={user.id}>
                <UserCard user={user} onClick={() => {}} />
                {!isLast && <Hr />}
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
    </>
  );
};
