import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAppsPaginatedQuery,
  useApiHiDeleteAppProfile,
  useApiHiGroupsPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useSnackbars } from '@dimasbaguspm/versaur';
import { useMemo, useState } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { useAuthProvider } from '../../../providers/auth-provider';

import type { ProfileWithApp, ProfilesContextValue } from '../types';

export const useProfilesData = (): ProfilesContextValue => {
  const { appProfiles, user } = useAuthProvider();
  const { showSnack } = useSnackbars();
  const { openDrawer } = useDrawerRoute();

  const [searchTerm, setSearchTerm] = useState('');

  // Fetch apps data
  const [appsData, , { isLoading: isAppsLoading }] = useApiHiAppsPaginatedQuery({
    pageSize: 100,
  });

  // Fetch detailed app profiles data
  const [appProfilesData, , { isLoading: isAppProfilesLoading }] = useApiHiAppProfilesPaginatedQuery(
    {
      id: appProfiles.map((profile) => profile.id),
      pageSize: 100,
      sortBy: 'created_at',
      sortOrder: 'desc',
    },
    {
      enabled: !!appProfiles.length,
    },
  );

  // Fetch groups for group profiles
  const [groupsData, , { isLoading: isGroupsLoading }] = useApiHiGroupsPaginatedQuery({
    pageSize: 100,
  });

  // Delete profile mutation
  const [deleteProfile] = useApiHiDeleteAppProfile();

  // Process profiles with app and owner information
  const profilesWithApps: ProfileWithApp[] = useMemo(() => {
    if (!appProfilesData?.items || !appsData?.items) return [];

    const groups = groupsData?.items || [];

    return appProfilesData.items
      .map((profile) => {
        const app = appsData.items.find((a) => a.id === profile.appId);
        const isUserProfile = !!profile.userId;
        const isGroupProfile = !!profile.groupId;

        let ownerName = 'Unknown';
        let type: 'user' | 'group' = 'user';

        if (isUserProfile) {
          ownerName = user.name;
          type = 'user';
        } else if (isGroupProfile) {
          const group = groups.find((g) => g.id === profile.groupId);
          ownerName = group?.name || 'Unknown Group';
          type = 'group';
        }

        return {
          ...profile,
          app: app!,
          type,
          ownerName,
        };
      })
      .filter((profile) => profile.app); // Only include profiles with valid apps
  }, [appProfilesData, appsData, groupsData, user]);

  // Filter profiles based on search term
  const filteredProfiles = useMemo(() => {
    if (!searchTerm.trim()) return profilesWithApps;

    const searchLower = searchTerm.toLowerCase();
    return profilesWithApps.filter(
      (profile) =>
        profile.name.toLowerCase().includes(searchLower) ||
        profile.app?.name.toLowerCase().includes(searchLower) ||
        profile.ownerName.toLowerCase().includes(searchLower),
    );
  }, [profilesWithApps, searchTerm]);

  const isLoading = isAppsLoading || isAppProfilesLoading || isGroupsLoading;

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleDeleteProfile = async (profileId: number) => {
    try {
      await deleteProfile({ id: profileId });
      showSnack('success', 'Profile deleted successfully');
    } catch {
      showSnack('danger', 'Failed to delete profile');
    }
  };

  const handleCreateProfile = (appId: number) => {
    openDrawer(DRAWER_ROUTES.APP_PROFILE_CREATION, { appId });
  };

  const handlePlayProfile = (profile: ProfileWithApp) => {
    if (profile.app.url) {
      window.open(profile.app.url, '_blank');
    }
  };

  return {
    profiles: filteredProfiles,
    apps: appsData?.items || [],
    searchTerm,
    isLoading,
    onSearchChange: handleSearchChange,
    onDeleteProfile: handleDeleteProfile,
    onPlayProfile: handlePlayProfile,
    onCreateProfile: handleCreateProfile,
  };
};
