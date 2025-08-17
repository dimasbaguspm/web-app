import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { AppBar, Button, ButtonIcon, Text } from '@dimasbaguspm/versaur';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';
import { FC } from 'react';

import type { ProfilesHeaderProps } from '../types';

export const ProfilesHeader: FC<ProfilesHeaderProps> = ({
  onCreateProfile,
}) => {
  const { isMobile } = useWindowResize();
  if (isMobile) {
    return (
      <AppBar>
        <AppBar.Leading>
          <ButtonIcon
            as={ArrowLeftIcon}
            variant="neutral-ghost"
            aria-label="Back"
            size="lg"
          />
        </AppBar.Leading>
        <AppBar.Center>
          <AppBar.Headline>Profiles</AppBar.Headline>
          <AppBar.Subtitle>Manage your app profiles</AppBar.Subtitle>
        </AppBar.Center>
        {onCreateProfile && (
          <AppBar.Trailing>
            <ButtonIcon
              as={PlusIcon}
              variant="primary"
              size="md"
              onClick={onCreateProfile}
              aria-label="Create Profile"
            />
          </AppBar.Trailing>
        )}
      </AppBar>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <Text as="h1" fontSize="3xl" fontWeight="bold" color="black">
            Profiles
          </Text>
          <Text as="p" color="gray">
            Manage your app profiles and settings.
          </Text>
        </div>
        {onCreateProfile && (
          <Button onClick={onCreateProfile} variant="primary">
            <PlusIcon className="w-4 h-4" />
            Create Profile
          </Button>
        )}
      </div>
    </div>
  );
};
