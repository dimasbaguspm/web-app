import { ThreadModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicThread } from '@dimasbaguspm/utils/data';
import { Avatar, CardProps, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface ThreadCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  thread: ThreadModel;
  onClick?: (thread: ThreadModel) => void;
}

export const ThreadCard: FC<ThreadCardProps> = (props) => {
  const { thread, onClick } = props;
  const { description, createdDateTime, senderName, senderInitial } = formatNotunicThread(thread);

  const handleClick = () => {
    onClick?.(thread);
  };

  return (
    <div className="@container/card p-3 sm:p-4" onClick={handleClick}>
      <div className="mb-2">
        <div className="flex justify-between transition-colors duration-200 w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light hover:bg-gray-50 cursor-pointer @container/card">
          <div className="flex items-start gap-3">
            <Avatar shape="rounded">{senderInitial}</Avatar>
            <Text fontWeight="semibold">{senderName}</Text>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-2">
          <Text color="gray" fontWeight="normal" fontSize="base">
            {description}
          </Text>
        </div>

        <div className="flex justify-end">
          <Text color="gray" fontWeight="normal" fontSize="sm">
            Created on {createdDateTime}
          </Text>
        </div>
      </div>
    </div>
  );
};
