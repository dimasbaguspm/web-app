import { AppModel, AppProfileModel, GroupModel } from '@dimasbaguspm/interfaces';

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
    goToDetailPage: (appId: number) => void;
    onSearchChange: (searchTerm: string) => void;
  };
}

export interface AppCardProps {
  app: AppModel;
}
