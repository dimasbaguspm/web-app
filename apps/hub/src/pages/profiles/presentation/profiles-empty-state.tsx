import { Button, NoResults } from '@dimasbaguspm/versaur';
import { SearchIcon, User2Icon } from 'lucide-react';
import { FC } from 'react';

import type { ProfilesEmptyStateProps } from '../types';

export const ProfilesEmptyState: FC<ProfilesEmptyStateProps> = ({
  searchTerm,
  onClearSearch,
}) => {
  if (searchTerm) {
    return (
      <NoResults
        icon={SearchIcon}
        title="No profiles found"
        subtitle={`We couldn't find any profiles matching "${searchTerm}"`}
        action={
          <Button variant="neutral-outline" onClick={onClearSearch}>
            Clear Search
          </Button>
        }
      />
    );
  }

  return (
    <NoResults
      icon={User2Icon}
      title="No profiles yet"
      subtitle="You haven't created any app profiles yet. Install apps from the marketplace to get started."
    />
  );
};
