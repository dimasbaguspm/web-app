import { Button, ButtonGroup, Icon, NoResults } from '@dimasbaguspm/versaur';
import { PlusIcon, SearchIcon, UsersIcon } from 'lucide-react';
import { FC } from 'react';

import type { GroupsEmptyStateProps } from '../types';

export const GroupsEmptyState: FC<GroupsEmptyStateProps> = ({
  searchQuery,
  onCreateGroup,
  onClearSearch,
}) => {
  if (searchQuery) {
    return (
      <NoResults
        icon={SearchIcon}
        title="No groups found"
        subtitle={`We couldn't find any groups matching "${searchQuery}"`}
        action={
          <ButtonGroup>
            <Button onClick={onClearSearch} variant="neutral-outline">
              Clear Search
            </Button>
          </ButtonGroup>
        }
      />
    );
  }

  return (
    <NoResults
      icon={UsersIcon}
      title="No groups yet"
      subtitle="You're not a member of any groups. Create your first group to get started!"
      action={
        <ButtonGroup>
          <Button onClick={onCreateGroup} variant="neutral-outline">
            <Icon as={PlusIcon} color="inherit" />
            Create Your First Group
          </Button>
        </ButtonGroup>
      }
    />
  );
};
