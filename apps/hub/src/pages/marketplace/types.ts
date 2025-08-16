import { ReactNode } from 'react';

export interface AppProfile {
  id: number;
  appId: number;
  userId?: number | null;
  groupId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: number;
  name: string;
  description: string;
  url: string;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: number;
  name: string;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceData {
  appsMap: Map<number, App>;
  groupsMap: Map<number, Group>;
  userAppProfiles: AppProfile[];
  groupAppProfiles: AppProfile[];
  installedAppIds: Set<number>;
  availableApps: App[];
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
  app: App;
  profile?: AppProfile;
  isUserProfile?: boolean;
  groupName?: string | null;
  variant: 'installed' | 'available';
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}
