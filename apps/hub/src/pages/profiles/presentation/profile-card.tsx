import { formatDate } from '@dimasbaguspm/utils/date';
import { Avatar, Badge, Button, ButtonIcon, Icon, Text, Tile } from '@dimasbaguspm/versaur';
import { AppWindowIcon, PlayIcon, TrashIcon, User2Icon, UsersIcon } from 'lucide-react';
import { FC } from 'react';

import type { ProfileCardProps } from '../types';

export const ProfileCard: FC<ProfileCardProps> = ({ profile, onDelete, onPlay }) => {
  const handleDelete = () => {
    onDelete(profile.id);
  };

  const handlePlay = () => {
    onPlay(profile);
  };

  const typeIcon = profile.type === 'user' ? User2Icon : UsersIcon;
  const typeColor = profile.type === 'user' ? 'primary' : 'secondary';

  return (
    <Tile>
      <div className="flex items-start gap-4">
        {/* App Logo */}
        <div className="flex-shrink-0">
          <Avatar size="lg" shape="rounded">
            {profile.app.logoUrl ? (
              <img alt={profile.app.name} className="w-full h-full object-cover" src={profile.app.logoUrl} />
            ) : (
              <AppWindowIcon className="w-6 h-6" />
            )}
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header with profile name and actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Text as="h3" className="truncate" fontSize="lg" fontWeight="semibold">
                  {profile.name}
                </Text>
                <Badge color={typeColor}>
                  <Icon as={typeIcon} size="xs" />
                  {profile.type === 'user' ? 'Personal' : 'Group'}
                </Badge>
              </div>
              <Text as="p" className="truncate text-sm mb-2" color="gray">
                {profile.app.name}
              </Text>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ButtonIcon
                as={TrashIcon}
                variant="danger-ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                aria-label="Delete profile"
              />
            </div>
          </div>

          {/* App Description */}
          {profile.app.description && (
            <Text as="p" className="text-sm mb-3 line-clamp-2" color="gray">
              {profile.app.description}
            </Text>
          )}

          {/* Profile Info and Play Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Icon as={typeIcon} size="xs" color="ghost" />
              <Text as="span" color="gray">
                {profile.ownerName}
              </Text>
              <Text as="span" color="gray" fontSize="xs">
                • Created {formatDate(profile.createdAt, 'mediumDate')}
              </Text>
            </div>

            {profile.app.url && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay();
                }}
              >
                <Icon as={PlayIcon} size="md" color="inherit" />
                Play
              </Button>
            )}
          </div>
        </div>
      </div>
    </Tile>
  );
};
