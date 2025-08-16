import { ChangeEvent } from 'react';

export interface GroupData {
  id: number;
  name: string;
  createdAt: string;
}

export interface GroupMemberData {
  id: number;
  groupId: number;
  userId: number;
  role: 'owner' | 'member';
}

export interface AppData {
  id: number;
  name: string;
}

export interface User {
  id: number;
}

export interface GroupHeaderProps {
  isMobile: boolean;
  onCreateGroup: () => void;
}

export interface GroupSearchBarProps {
  searchQuery: string;
  onSearchChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}

export interface CreateGroupModalProps {
  isOpen: boolean;
  newGroupName: string;
  onClose: () => void;
  onGroupNameChange: (name: string) => void;
  onCreateGroup: () => void;
}

export interface GroupTileProps {
  group: GroupData;
  memberCount: number;
  isOwner: boolean;
}

export interface GroupsListProps {
  groups: GroupData[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  onCreateGroup: () => void;
  onClearSearch: () => void;
  getMemberCount: (groupId: number) => number;
  isOwner: (groupId: number) => boolean;
}

export interface GroupsEmptyStateProps {
  searchQuery?: string;
  onCreateGroup?: () => void;
  onClearSearch?: () => void;
}

export interface GroupsQuickStatsProps {
  groupsCount: number;
  totalMembers: number;
  availableApps: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
