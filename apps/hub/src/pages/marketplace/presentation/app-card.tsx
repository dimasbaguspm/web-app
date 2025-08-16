import { Avatar, Badge, Button, Text, Tile } from '@dimasbaguspm/versaur';
import {
  AppWindowIcon,
  ExternalLinkIcon,
  PlusIcon,
  UsersIcon,
} from 'lucide-react';
import { FC } from 'react';

import { useMarketplaceContext } from '../context/context';

import type { AppCardProps } from '../types';

export const AppCard: FC<AppCardProps> = ({
  app,
  profile,
  isUserProfile = false,
  groupName,
  variant,
}) => {
  const { actions } = useMarketplaceContext();

  const handleAction = () => {
    if (variant === 'installed') {
      actions.openApp(app.url);
    } else {
      actions.installApp(app.id);
    }
  };

  return (
    <Tile className="hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Avatar size="lg" shape="rounded">
            {app.logoUrl ? (
              <img
                alt={app.name}
                className="w-full h-full object-cover"
                src={app.logoUrl}
              />
            ) : (
              <AppWindowIcon className="w-6 h-6" />
            )}
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Text
              as="h3"
              className="truncate"
              fontSize="lg"
              fontWeight="semibold"
            >
              {app.name}
            </Text>
            {variant === 'installed' && (
              <>
                {isUserProfile ? (
                  <Badge color="primary" size="sm">
                    Personal
                  </Badge>
                ) : (
                  <Badge color="secondary" size="sm">
                    <UsersIcon className="w-3 h-3 mr-1" />
                    {groupName || 'Group'}
                  </Badge>
                )}
              </>
            )}
          </div>

          <Text as="p" className="text-sm mb-3 line-clamp-2" color="gray">
            {app.description}
          </Text>

          <div className="flex items-center justify-between">
            <Text as="span" color="gray" fontSize="xs">
              {variant === 'installed' && profile
                ? `Installed ${new Date(profile.createdAt).toLocaleDateString()}`
                : `Available since ${new Date(app.createdAt).toLocaleDateString()}`}
            </Text>
            <Button
              onClick={handleAction}
              size="sm"
              variant={variant === 'installed' ? 'outline' : 'primary'}
            >
              {variant === 'installed' ? (
                <>
                  <ExternalLinkIcon className="w-4 h-4 mr-1" />
                  Open
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Install
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Tile>
  );
};
