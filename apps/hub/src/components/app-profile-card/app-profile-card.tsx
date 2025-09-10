import { AppModel, AppProfileModel } from '@dimasbaguspm/interfaces';
import { formatHiAppData, formatHiAppProfile } from '@dimasbaguspm/utils/data';
import { Avatar, Badge, BadgeGroup, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface AppProfileCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  appProfile: AppProfileModel;
  app: AppModel;
  onClick?: (appProfile: AppProfileModel) => void;
}

export const AppProfileCard: FC<AppProfileCardProps> = (props) => {
  const { appProfile, app, onClick, ...rest } = props;

  const { name: appName } = formatHiAppData(app);
  const { name: profileName, initial, groupRelatedVariant, type, createdDateTime } = formatHiAppProfile(appProfile);

  const handleClick = () => {
    onClick?.(appProfile);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={<Avatar shape="rounded">{initial}</Avatar>}
      title={profileName}
      badge={
        <BadgeGroup>
          <Badge color={groupRelatedVariant}>{type}</Badge>
          <Badge color="info">{appName}</Badge>
        </BadgeGroup>
      }
      supplementaryInfo={createdDateTime}
      {...rest}
    />
  );
};
