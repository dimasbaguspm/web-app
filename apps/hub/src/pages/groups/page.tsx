import { Button, ButtonGroup, ButtonIcon, Icon, PageContent, PageHeader } from '@dimasbaguspm/versaur';
import { PlusIcon } from 'lucide-react';
import { FC } from 'react';

import { useAuthProvider } from '../../providers/auth-provider';

import { GroupsStateProvider, useGroupsStateContext } from './context';
import { useCreateGroup, useGroupsData } from './hooks';
import { CreateGroupModal, GroupSearchBar, GroupsList } from './presentation';

const GroupPageContent: FC = () => {
  const { user } = useAuthProvider();

  const { searchQuery, setIsCreating, closeModal } = useGroupsStateContext();

  const { myGroups, isGroupsLoading, createGroup, getGroupMemberCount, isGroupOwner } = useGroupsData(user);

  const { handleCreateGroup } = useCreateGroup(createGroup, closeModal);

  const handleCreateGroupWithName = async (groupName: string) => {
    await handleCreateGroup(groupName);
  };

  // Filter groups based on search query
  const filteredGroups = myGroups?.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <PageHeader
        title="My Groups"
        subtitle="Manage your groups and discover apps together"
        actions={
          <ButtonGroup>
            <Button onClick={() => setIsCreating(true)}>
              <Icon as={PlusIcon} color="inherit" />
              Create New Group
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon as={PlusIcon} aria-label="New Group" onClick={() => setIsCreating(true)} />
          </ButtonGroup>
        }
      />

      <PageContent>
        <GroupSearchBar />
        <GroupsList
          groups={filteredGroups}
          isLoading={isGroupsLoading}
          getMemberCount={getGroupMemberCount}
          isOwner={isGroupOwner}
        />
      </PageContent>

      <CreateGroupModal onCreateGroup={handleCreateGroupWithName} />
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
