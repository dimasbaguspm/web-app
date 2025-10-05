import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicComment } from '@dimasbaguspm/utils/data';
import { Anchor, Avatar, Card, CardProps, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

export interface CommentActionCardProps
  extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  comment: CommentModel;
  onClick?: (comment: CommentModel) => void;
}

export const CommentActionCard: FC<CommentActionCardProps> = ({ comment, ...rest }) => {
  const { description, senderInitial, isActionDone, senderName, actionDueDateTime } = formatNotunicComment(comment);

  const handleOnClick = () => {
    rest.onClick?.(comment);
  };

  const time = isActionDone
    ? `Done in ${actionDueDateTime}`
    : actionDueDateTime
      ? `Due ${actionDueDateTime}`
      : 'No due date';

  return (
    <button type="button" className="w-full flex flex-row items-start gap-2" onClick={handleOnClick}>
      <div className="flex-shrink-0">
        <Avatar shape="circle" size="md">
          {senderInitial}
        </Avatar>
      </div>
      <div className="flex-grow flex flex-col text-left">
        <div className="flex items-center gap-2">
          <Text fontWeight="semibold" fontSize="sm">
            {senderName}
          </Text>
          <Text color="gray" fontWeight="normal" fontSize="xs">
            {time}
          </Text>
        </div>
        <Text color="gray" fontWeight="normal" fontSize="base" className="mb-2 whitespace-pre-wrap">
          {description}
        </Text>
        <Card.List>
          <Card.ListItem>
            <Anchor color="ghost" fontWeight="normal" fontSize="sm" onClick={handleOnClick}>
              {isActionDone ? 'View' : 'Add'} Follow-up
            </Anchor>
          </Card.ListItem>
        </Card.List>
      </div>
    </button>
  );
};
