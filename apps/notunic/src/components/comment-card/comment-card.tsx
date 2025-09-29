import { CommentModel } from '@dimasbaguspm/interfaces/notunic-api';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatNotunicComment } from '@dimasbaguspm/utils/data';
import { Avatar, ButtonMenuIcon, CardProps, Text } from '@dimasbaguspm/versaur';
import { EllipsisVerticalIcon } from 'lucide-react';
import { FC } from 'react';

import { MODAL_ROUTES } from '../../constants/modal-routes';

interface CommentCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  comment: CommentModel;
  onClick?: (comment: CommentModel) => void;
}

export const CommentCard: FC<CommentCardProps> = (props) => {
  const { comment, onClick } = props;
  const { openModal } = useModalRoute();
  const { description, createdDateTime, senderName, senderInitial } = formatNotunicComment(comment);

  const handleClick = () => {
    onClick?.(comment);
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_COMMENT, { commentId: comment.id });
  };

  return (
    <div className="py-4" onClick={handleClick}>
      <div className="mb-2">
        <div className="flex justify-between w-full">
          <div className="w-full flex items-start gap-3">
            <Avatar shape="circle" size="sm">
              {senderInitial}
            </Avatar>
            <Text fontWeight="semibold">{senderName}</Text>
            <div className="flex-grow flex justify-end gap-1">
              <ButtonMenuIcon as={EllipsisVerticalIcon} size="xs" variant="ghost" aria-label="More options">
                <ButtonMenuIcon.Item onClick={handleDeleteClick}>Delete</ButtonMenuIcon.Item>
              </ButtonMenuIcon>
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

        <div className="flex justify-end">
          <Text color="gray" fontWeight="normal" fontSize="sm" align="right">
            {createdDateTime}
          </Text>
        </div>
      </div>
    </div>
  );
};
