import { AppModel, AppProfileModel } from '@dimasbaguspm/interfaces';

export interface ProfileWithApp extends AppProfileModel {
  app: AppModel;
  type: 'user' | 'group';
  ownerName: string;
}

export interface ProfilesContextValue {
  // Data
  profiles: ProfileWithApp[];
  apps: AppModel[];
  searchTerm: string;
  isLoading: boolean;

  // Actions
  onSearchChange: (term: string) => void;
  onDeleteProfile: (profileId: number) => void;
  onPlayProfile: (profile: ProfileWithApp) => void;
  onCreateProfile: (appId: number) => void;
}

export interface ProfileCardProps {
  profile: ProfileWithApp;
  onDelete: (profileId: number) => void;
  onPlay: (profile: ProfileWithApp) => void;
  onEdit?: (profileId: number) => void;
}

export interface ProfilesEmptyStateProps {
  searchTerm?: string;
  onClearSearch: () => void;
}

export interface ProfilesHeaderProps {
  onCreateProfile?: () => void;
}

export interface ProfilesQuickStatsProps {
  profilesCount: number;
  personalProfiles: number;
  groupProfiles: number;
  totalApps: number;
}
