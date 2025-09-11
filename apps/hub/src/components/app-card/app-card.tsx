import { AppModel } from '@dimasbaguspm/interfaces';
import { formatHiAppData } from '@dimasbaguspm/utils/data';
import { Brand, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface AppCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  app: AppModel;
  onClick?: (app: AppModel) => void;
}

export const AppCard: FC<AppCardProps> = (props) => {
  const { app, onClick, ...rest } = props;

  const { name, createdDateTime, brandName } = formatHiAppData(app);

  const handleClick = () => {
    onClick?.(app);
  };

  return (
    <Card
      onClick={handleClick}
      title={name}
      avatar={<Brand name={brandName} shape="rounded" />}
      supplementaryInfo={`Created on ${createdDateTime}`}
      {...rest}
    />
  );
};
