import { useApiHiGroupMembersInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { GroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Card, Heading, Hr, Icon, PageLoader } from '@dimasbaguspm/versaur';
import { Edit2Icon, Users2Icon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface DetailsTabProps {
  group: GroupModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ group }) => {
  const { openDrawer } = useDrawerRoute();

  const [
    groupMembers,
    ,
    {
      isInitialFetching: isInitialFetchingGroupMembers,
      hasNextPage: hasNextPageGroupMembers,
      isFetchingNextPage: isFetchingNextPageGroupMembers,
    },
    { fetchNextPage: fetchNextPageGroupMembers },
  ] = useApiHiGroupMembersInfiniteQuery(
    {
      groupId: [group.id.toString()],
    },
    {
      enabled: !!group.id,
    },
  );

  const handleOnEditGroupClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_GROUP, { groupId: group.id.toString() });
  };

  const handleOnManageMembersClick = () => {
    openDrawer(DRAWER_ROUTES.MANAGE_GROUP_MEMBERS, { groupId: group.id.toString() });
  };

  return (
    <>
      <ButtonGroup>
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

      <If condition={isInitialFetchingGroupMembers}>
        <PageLoader />
      </If>

      <If condition={[!isInitialFetchingGroupMembers, groupMembers?.length]}>
        <ul className="mb-4">
          {groupMembers?.map((member, index) => {
            const isLast = index === groupMembers.length - 1;
            return (
              <li key={member.id}>
                <Card
                  title={member.userId}
                  subtitle={
                    <Card.List>
                      <Card.ListItem>`Role: ${member.role}`</Card.ListItem>
                    </Card.List>
                  }
                />
                {!isLast && <Hr />}
              </li>
            );
          })}
        </ul>
        <If condition={hasNextPageGroupMembers}>
          <ButtonGroup alignment="center">
            <Button
              onClick={() => fetchNextPageGroupMembers()}
              variant="outline"
              disabled={isFetchingNextPageGroupMembers}
            >
              Load More
            </Button>
          </ButtonGroup>
        </If>
      </If>
    </>
  );
};
