import { LoadingIndicator } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { ProfilesProvider } from './context/provider';
import { useProfilesContext } from './context/use-profiles-context';
import {
  ProfilesEmptyState,
  ProfilesGrid,
  ProfilesHeader,
  ProfilesSearchBar,
} from './presentation';

const ProfilesContent: FC = () => {
  const { profiles, searchTerm, isLoading, onSearchChange } =
    useProfilesContext();

  if (isLoading) {
    return <LoadingIndicator size="sm" type="bar" />;
  }

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <>
      <ProfilesHeader />

      <ProfilesSearchBar />

      {profiles.length > 0 ? (
        <ProfilesGrid />
      ) : (
        <ProfilesEmptyState
          searchTerm={searchTerm}
          onClearSearch={handleClearSearch}
        />
      )}
    </>
  );
};

const ProfilesPage: FC = () => {
  return (
    <ProfilesProvider>
      <ProfilesContent />
    </ProfilesProvider>
  );
};

export default ProfilesPage;
