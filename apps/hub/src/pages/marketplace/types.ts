import {
  AppModel,
  AppProfileModel,
  GroupModel,
} from '@dimasbaguspm/hooks/use-api';

export interface MarketplaceData {
  appsMap: Map<number, AppModel>;
  groupsMap: Map<number, GroupModel>;
  userAppProfiles: AppProfileModel[];
  groupAppProfiles: AppProfileModel[];
  installedAppIds: Set<number>;
  availableApps: AppModel[];
  searchTerm: string;
}

export interface MarketplaceContextType {
  data: MarketplaceData;
  loading: {
    apps: boolean;
    appProfiles: boolean;
  };
  actions: {
    openApp: (url: string) => void;
    installApp: (appId: number) => void;
    onSearchChange: (searchTerm: string) => void;
  };
}

export interface AppCardProps {
  app: AppModel;
}
