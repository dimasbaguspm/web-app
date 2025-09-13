import { AppModel, AppProfileModel } from '@dimasbaguspm/interfaces';
import { formatHiAppData, formatHiAppProfile } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Avatar, Badge, BadgeGroup, Brand, Card, CardProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';

interface AppProfileCardProps extends Pick<CardProps, 'as' | 'size' | 'shape' | 'bordered' | 'supplementaryInfo'> {
  appProfile: AppProfileModel;
  app: AppModel;
  onClick?: (appProfile: AppProfileModel) => void;
  useBrandAvatar?: boolean;
  hideAppBadge?: boolean;
  hideGroupRelatedBadge?: boolean;
}

export const AppProfileCard: FC<AppProfileCardProps> = (props) => {
  const { appProfile, app, onClick, hideAppBadge, hideGroupRelatedBadge, useBrandAvatar, ...rest } = props;

  const { name: appName, brandName } = formatHiAppData(app);
  const { name: profileName, initial, groupRelatedVariant, type, createdDateTime } = formatHiAppProfile(appProfile);

  const handleClick = () => {
    onClick?.(appProfile);
  };

  return (
    <Card
      onClick={handleClick}
      avatar={useBrandAvatar ? <Brand name={brandName} shape="rounded" /> : <Avatar shape="rounded">{initial}</Avatar>}
      title={profileName}
      badge={
        <BadgeGroup>
          <If condition={!hideGroupRelatedBadge}>
            <Badge color={groupRelatedVariant}>{type}</Badge>
          </If>
          <If condition={!hideAppBadge}>
            <Badge color="info">{appName}</Badge>
          </If>
        </BadgeGroup>
      }
      supplementaryInfo={`Created on ${createdDateTime}`}
      {...rest}
    />
  );
};
