import { ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatNotunicThread } from '@dimasbaguspm/utils/data';
import { Avatar, Badge, BadgeGroup, ButtonIcon, CardProps, Text } from '@dimasbaguspm/versaur';
import { sortBy } from 'lodash';
import { Edit2Icon, EllipsisVerticalIcon, ReplyIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface ThreadCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  thread: ThreadModel;
  onClick?: (thread: ThreadModel) => void;
}

export const ThreadCard: FC<ThreadCardProps> = (props) => {
  const { thread, onClick } = props;
  const { openDrawer } = useDrawerRoute();
  const { description, createdDateTime, senderName, senderInitial } = formatNotunicThread(thread);

  const handleClick = () => {
    onClick?.(thread);
  };

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_THREAD, { threadId: thread.id });
  };

  const sortedGroups = sortBy(thread.groups, (group) => group.id);

  return (
    <div className="p-4" onClick={handleClick}>
      <div className="mb-2">
        <div className="flex justify-between w-full">
          <div className="w-full flex items-start gap-3">
            <Avatar shape="rounded">{senderInitial}</Avatar>
            <Text fontWeight="semibold">{senderName}</Text>
            <div className="flex-grow flex justify-end gap-1">
              <ButtonIcon as={ReplyIcon} size="xs" variant="ghost" aria-label="Reply to thread" onClick={handleClick} />
              <ButtonIcon as={Edit2Icon} size="xs" variant="ghost" aria-label="Edit thread" onClick={handleEditClick} />
              <ButtonIcon as={EllipsisVerticalIcon} size="xs" variant="ghost" aria-label="More options" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-4">
          <Text color="gray" fontWeight="normal" fontSize="base">
            {description}
          </Text>
        </div>

        <div className="flex flex-col sm:flex-row justify-between">
          <BadgeGroup className="mb-2 sm:mb-0" aria-label="Thread groups">
            {sortedGroups?.map((group) => (
              <Badge key={group.id} color="accent_1" shape="square" size="sm">
                {group.tagName}
              </Badge>
            ))}
          </BadgeGroup>
          <Text color="gray" fontWeight="normal" fontSize="sm" align="right">
            {createdDateTime}
          </Text>
        </div>
      </div>
    </div>
  );
};
