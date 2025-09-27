import { ThreadGroupTagModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicThreadGroupTag } from '@dimasbaguspm/utils/data';
import { Avatar, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface ThreadGroupTagCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  threadGroupTag: ThreadGroupTagModel;
  onClick?: (threadGroupTag: ThreadGroupTagModel) => void;
}

export const ThreadGroupTagCard: FC<ThreadGroupTagCardProps> = (props) => {
  const { threadGroupTag, onClick, ...rest } = props;
  const { name, initialName, createdDateTime } = formatNotunicThreadGroupTag(threadGroupTag);

  const handleClick = () => {
    onClick?.(threadGroupTag);
  };

  return (
    <Card
      onClick={onClick ? handleClick : undefined}
      as={onClick ? 'button' : 'div'}
      title={name}
      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
      supplementaryInfo={`Created on ${createdDateTime}`}
      {...rest}
    />
  );
};
