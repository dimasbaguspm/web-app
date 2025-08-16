import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { FC } from 'react';

import { useAuthProvider } from '../../providers/auth-provider';

import { GroupsStateProvider, useGroupsStateContext } from './context';
import { useCreateGroup, useGroupsData } from './hooks';
import {
  CreateGroupModal,
  GroupHeader,
  GroupSearchBar,
  GroupsList,
  GroupsQuickStats,
} from './presentation';

const GroupPageContent: FC = () => {
  const { user } = useAuthProvider();
  const { isMobile } = useWindowResize();

  const { searchQuery, setIsCreating, closeModal } = useGroupsStateContext();

  const {
    myGroups,
    myGroupMembers,
    apps,
    isGroupsLoading,
    createGroup,
    getGroupMemberCount,
    isGroupOwner,
  } = useGroupsData(user);

  const { handleCreateGroup } = useCreateGroup(createGroup, closeModal);

  const handleCreateGroupWithName = async (groupName: string) => {
    await handleCreateGroup(groupName);
  };

  // Filter groups based on search query
  const filteredGroups = myGroups?.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* Header Section */}
      <GroupHeader
        isMobile={isMobile}
        onCreateGroup={() => setIsCreating(true)}
      />

      {/* Search Bar */}
      <GroupSearchBar />

      {/* Create Group Modal */}
      <CreateGroupModal onCreateGroup={handleCreateGroupWithName} />

      {/* Groups List */}
      <GroupsList
        groups={filteredGroups}
        isLoading={isGroupsLoading}
        getMemberCount={getGroupMemberCount}
        isOwner={isGroupOwner}
      />

      {/* Quick Stats */}
      {filteredGroups && filteredGroups.length > 0 && (
        <GroupsQuickStats
          groupsCount={filteredGroups.length}
          totalMembers={myGroupMembers?.totalItems || 0}
          availableApps={apps?.totalItems || 0}
        />
      )}
    </>
  );
};

const GroupPage: FC = () => {
  return (
    <GroupsStateProvider>
      <GroupPageContent />
    </GroupsStateProvider>
  );
};

export default GroupPage;
