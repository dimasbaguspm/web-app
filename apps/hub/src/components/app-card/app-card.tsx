import { AppModel } from '@dimasbaguspm/interfaces';
import { formatHiAppData } from '@dimasbaguspm/utils/data';
import { Badge, BadgeGroup, Brand, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface AppCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  app: AppModel;
  onClick?: (app: AppModel) => void;
}

export const AppCard: FC<AppCardProps> = (props) => {
  const { app, onClick, ...rest } = props;

  const { name, createdDateTime, brandName, description } = formatHiAppData(app);

  const handleClick = () => {
    onClick?.(app);
  };

  return (
    <Card
      onClick={handleClick}
      title={name}
      subtitle={description}
      avatar={<Brand name={brandName} shape="rounded" />}
      badge={
        <BadgeGroup>
          <Badge>Web</Badge>
        </BadgeGroup>
      }
      supplementaryInfo={`Created on ${createdDateTime}`}
      {...rest}
    />
  );
};
