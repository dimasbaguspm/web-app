import { ThreadGroupModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicThreadGroup } from '@dimasbaguspm/utils/data';
import { Avatar, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface ThreadGroupCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  threadGroup: ThreadGroupModel;
  onClick?: (threadGroup: ThreadGroupModel) => void;
  hideDescription?: boolean;
}

export const ThreadGroupCard: FC<ThreadGroupCardProps> = (props) => {
  const { threadGroup, onClick, hideDescription, ...rest } = props;
  const { name, initialName, subtitle, createdDateTime } = formatNotunicThreadGroup(threadGroup);

  const handleClick = () => {
    onClick?.(threadGroup);
  };

  return (
    <Card
      onClick={handleClick}
      title={name}
      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
      subtitle={!hideDescription && subtitle}
      supplementaryInfo={`Created on ${createdDateTime}`}
      {...rest}
    />
  );
};
