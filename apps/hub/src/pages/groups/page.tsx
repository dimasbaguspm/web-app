import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  FormLayout,
  Icon,
  PageContent,
  PageHeader,
  SearchInput,
} from '@dimasbaguspm/versaur';
import { PlusIcon } from 'lucide-react';
import { FC } from 'react';

import { GroupsStateProvider, useGroupsStateContext } from './context';
import { useCreateGroup, useGroupsData } from './hooks';
import { CreateGroupModal, GroupsList } from './presentation';

const GroupPageContent: FC = () => {
  const { user } = useAuthProvider();
  const { isDesktop } = useWindowResize();

  const [searchTerm, setSearchTerm] = useDebouncedState<string>();
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
        <FormLayout className="mb-4">
          <FormLayout.Column span={isDesktop ? 4 : 12}>
            <SearchInput
              placeholder="Search"
              variant="neutral"
              defaultValue={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
            />
          </FormLayout.Column>
        </FormLayout>
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
