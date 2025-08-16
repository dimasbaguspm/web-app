import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAppsPaginatedQuery,
  useApiHiGroupsPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useMemo, useState } from 'react';

import { useAuthProvider } from '../../../providers/auth-provider';

import type {
  App,
  AppProfile,
  Group,
  MarketplaceContextType,
  MarketplaceData,
} from '../types';

export const useMarketplaceData = (): MarketplaceContextType => {
  const { appProfiles, groupMembers } = useAuthProvider();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [appsData, , { isLoading: appsLoading }] = useApiHiAppsPaginatedQuery(
    {},
  );

  const [appProfilesData, , { isLoading: appProfilesLoading }] =
    useApiHiAppProfilesPaginatedQuery({
      id: appProfiles.map((profile) => profile.id),
    });

  // Get unique group IDs from group members to fetch group data
  const groupIds = useMemo(() => {
    return [...new Set(groupMembers.map((member) => member.groupId))];
  }, [groupMembers]);

  const [groupsData] = useApiHiGroupsPaginatedQuery({
    id: groupIds,
  });

  // Process and memoize marketplace data
  const data: MarketplaceData = useMemo(() => {
    // First filter apps by search term
    const filteredApps = appsData?.items
      ? appsData.items.filter(({ name }) =>
          name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : [];

    // Create maps for quick lookup
    const appsMap = new Map<number, App>();
    filteredApps.forEach((app: App) => {
      appsMap.set(app.id, app);
    });

    const groupsMap = new Map<number, Group>();
    if (groupsData?.items) {
      groupsData.items.forEach((group: Group) => {
        groupsMap.set(group.id, group);
      });
    }

    // Process app profiles
    let userAppProfiles: AppProfile[] = [];
    let groupAppProfiles: AppProfile[] = [];
    let installedAppIds = new Set<number>();

    if (appProfilesData?.items) {
      userAppProfiles = appProfilesData.items.filter(
        (profile: AppProfile) => profile.userId,
      );
      groupAppProfiles = appProfilesData.items.filter(
        (profile: AppProfile) => profile.groupId,
      );
      installedAppIds = new Set(
        appProfilesData.items.map((profile: AppProfile) => profile.appId),
      );
    }

    // Get available apps (not yet installed) from filtered apps
    const availableApps: App[] = filteredApps.filter(
      (app: App) => !installedAppIds.has(app.id),
    );

    return {
      appsMap,
      groupsMap,
      userAppProfiles,
      groupAppProfiles,
      installedAppIds,
      availableApps,
      searchTerm,
    };
  }, [appsData, appProfilesData, groupsData, searchTerm]);

  // Actions
  const actions = useMemo(
    () => ({
      openApp: (url: string) => {
        window.open(url, '_blank');
      },
      installApp: (appId: number) => {
        // TODO: Implement app installation logic
        console.log(`Installing app with ID: ${appId}`);
      },
      onSearchChange: (newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
      },
    }),
    [],
  );

  return {
    data,
    loading: {
      apps: appsLoading,
      appProfiles: appProfilesLoading,
    },
    actions,
  };
};
