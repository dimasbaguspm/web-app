import { LoadingIndicator } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useGroupsStateContext } from '../context';

import { GroupTile } from './group-tile';
import { GroupsEmptyState } from './groups-empty-state';

import type { GroupData } from '../types';

export interface GroupsListProps {
  groups: GroupData[] | undefined;
  isLoading: boolean;
  getMemberCount: (groupId: number) => number;
  isOwner: (groupId: number) => boolean;
}

/**
 * Alternative implementation of GroupsList that uses context for search-related props.
 * This eliminates the need for prop drilling of search state and actions.
 */
export const GroupsList: FC<GroupsListProps> = ({
  groups,
  isLoading,
  getMemberCount,
  isOwner,
}) => {
  const { searchQuery, setIsCreating, clearSearch } = useGroupsStateContext();

  if (isLoading) {
    return <LoadingIndicator type="bar" size="sm" />;
  }

  if (!groups || groups.length === 0) {
    return (
      <GroupsEmptyState
        searchQuery={searchQuery}
        onCreateGroup={() => setIsCreating(true)}
        onClearSearch={clearSearch}
      />
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <GroupTile
          key={group.id}
          group={group}
          memberCount={getMemberCount(group.id)}
          isOwner={isOwner(group.id)}
        />
      ))}
    </div>
  );
};
