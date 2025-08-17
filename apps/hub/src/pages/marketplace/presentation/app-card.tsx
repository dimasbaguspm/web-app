import { formatDate } from '@dimasbaguspm/utils/date';
import { Avatar, Button, Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { AppWindowIcon, PlusIcon } from 'lucide-react';
import { FC } from 'react';

import { useMarketplaceContext } from '../context/context';

import type { AppCardProps } from '../types';

export const AppCard: FC<AppCardProps> = ({ app }) => {
  const { actions } = useMarketplaceContext();

  const handleAction = () => {
    actions.installApp(app.id);
  };

  return (
    <Tile>
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
          </div>

          <Text as="p" className="text-sm mb-3 line-clamp-2" color="gray">
            {app.description}
          </Text>

          <div className="flex items-center justify-between">
            <Text as="span" color="gray" fontSize="xs">
              Available since {formatDate(app.createdAt, 'longDate')}
            </Text>
            <Button onClick={handleAction} size="sm" variant="primary">
              <Icon as={PlusIcon} size="sm" color="inherit" />
              Install
            </Button>
          </div>
        </div>
      </div>
    </Tile>
  );
};
