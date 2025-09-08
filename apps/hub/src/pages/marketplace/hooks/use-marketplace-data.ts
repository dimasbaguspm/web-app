import {
  useApiHiAppProfilesPaginatedQuery,
  useApiHiAppsPaginatedQuery,
  useApiHiGroupsPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { AppModel, AppProfileModel, GroupModel } from '@dimasbaguspm/interfaces';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../../constants/page-routes';
import { useAuthProvider } from '../../../providers/auth-provider';

import type { MarketplaceContextType, MarketplaceData } from '../types';

export const useMarketplaceData = (): MarketplaceContextType => {
  const { appProfiles, groupMembers } = useAuthProvider();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [appsData, , { isLoading: appsLoading }] = useApiHiAppsPaginatedQuery({});

  const [appProfilesData, , { isLoading: appProfilesLoading }] = useApiHiAppProfilesPaginatedQuery({
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
      ? appsData.items.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      : [];

    // Create maps for quick lookup
    const appsMap = new Map<number, AppModel>();
    filteredApps.forEach((app: AppModel) => {
      appsMap.set(app.id, app);
    });

    const groupsMap = new Map<number, GroupModel>();
    if (groupsData?.items) {
      groupsData.items.forEach((group: GroupModel) => {
        groupsMap.set(group.id, group);
      });
    }

    // Process app profiles
    let userAppProfiles: AppProfileModel[] = [];
    let groupAppProfiles: AppProfileModel[] = [];
    let installedAppIds = new Set<number>();

    if (appProfilesData?.items) {
      userAppProfiles = appProfilesData.items.filter((profile: AppProfileModel) => profile.userId);
      groupAppProfiles = appProfilesData.items.filter((profile: AppProfileModel) => profile.groupId);
      installedAppIds = new Set(appProfilesData.items.map((profile: AppProfileModel) => profile.appId));
    }

    // Get available apps (not yet installed) from filtered apps
    const availableApps: AppModel[] = filteredApps;

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
      goToDetailPage: (appId: number) => {
        navigate(DEEP_LINKS.MARKETPLACE_DETAIL(appId).path);
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
