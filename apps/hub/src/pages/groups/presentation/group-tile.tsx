import { formatDate } from '@dimasbaguspm/utils/date';
import { Avatar, Badge, Button, Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { AppWindowIcon, CalendarIcon, UsersIcon } from 'lucide-react';
import { FC } from 'react';

import type { GroupTileProps } from '../types';

export const GroupTile: FC<GroupTileProps> = ({
  group,
  memberCount,
  isOwner,
}) => {
  return (
    <Tile key={group.id}>
      <div className="flex items-center gap-3 mb-3">
        <Avatar size="md" shape="rounded">
          {group.name.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex-1 min-w-0">
          <Text
            as="h3"
            fontSize="lg"
            fontWeight="semibold"
            className="truncate mb-1"
          >
            {group.name}
          </Text>
          <div className="flex items-center gap-2 mb-2">
            <Badge color={isOwner ? 'warning' : 'secondary'}>
              {isOwner ? 'Owner' : 'Member'}
            </Badge>
            <div className="flex items-center gap-1">
              <Icon as={UsersIcon} size="xs" color="ghost" />
              <Text as="span" fontSize="sm" color="gray">
                {memberCount} member{memberCount !== 1 ? 's' : ''}
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Icon as={CalendarIcon} size="xs" color="ghost" />
            <Text as="span" fontSize="xs" color="gray">
              Created {formatDate(group.createdAt, 'mediumDate')}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="neutral-outline" size="sm">
          <Icon as={UsersIcon} size="sm" color="ghost" />
          Manage Members
        </Button>
        <Button variant="neutral-outline" size="sm">
          <Icon as={AppWindowIcon} size="sm" color="ghost" />
          View Relevant Apps
        </Button>
      </div>
    </Tile>
  );
};
