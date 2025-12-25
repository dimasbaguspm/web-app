import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicComment } from '@dimasbaguspm/utils/data';
import { Avatar, CardProps, Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

export interface CommentActionCardProps
  extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  comment: CommentModel;
  onClick?: (comment: CommentModel) => void;
}

export const CommentActionCard: FC<CommentActionCardProps> = ({ comment, ...rest }) => {
  const {
    description,
    senderInitial,
    isActionDone,
    senderName,
    actionDueDate,
    actionFollowUpDate,
    isActionOverdue,
    isActionNearDue,
  } = formatNotunicComment(comment);

  const handleOnClick = () => {
    rest.onClick?.(comment);
  };

  const time = isActionDone ? `Done in ${actionFollowUpDate}` : actionDueDate ? `Due ${actionDueDate}` : 'No due date';

  return (
    <button
      type="button"
      className="w-full flex flex-row items-start gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light cursor-pointer "
      onClick={handleOnClick}
    >
      <div className="flex-shrink-0">
        <Avatar shape="circle" size="md">
          {senderInitial}
        </Avatar>
      </div>
      <div className="flex-grow flex flex-col text-left">
        <div className="flex items-center gap-2">
          <Text fontWeight="semibold" as="small">
            {senderName}
          </Text>
          <Text
            color={isActionOverdue ? 'danger' : isActionNearDue ? 'warning' : 'ghost'}
            fontWeight="normal"
            as="small"
          >
            {time}
          </Text>
        </div>
        <Text color="gray" fontWeight="normal" className="mb-2 whitespace-pre-wrap">
          {description}
        </Text>
      </div>
    </button>
  );
};
