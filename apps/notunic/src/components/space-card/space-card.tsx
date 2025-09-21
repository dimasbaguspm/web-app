import { SpaceModel } from '@dimasbaguspm/interfaces/notunic-api';
import { formatNotunicSpace } from '@dimasbaguspm/utils/data';
import { Avatar, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface SpaceCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  space: SpaceModel;
  onClick?: (space: SpaceModel) => void;
  hideDescription?: boolean;
}

export const SpaceCard: FC<SpaceCardProps> = (props) => {
  const { space, onClick, hideDescription, ...rest } = props;
  const { name, initial, trimmedDescription, createdDateTime } = formatNotunicSpace(space);

  const handleClick = () => {
    onClick?.(space);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{initial}</Avatar>}
      title={name}
      subtitle={!hideDescription && trimmedDescription}
      supplementaryInfo={`Created on ${createdDateTime}`}
      {...rest}
    />
  );
};
