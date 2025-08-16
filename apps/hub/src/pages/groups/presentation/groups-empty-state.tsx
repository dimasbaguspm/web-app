import { Button, Icon, Text } from '@dimasbaguspm/versaur';
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
      <div className="flex flex-col items-center py-12">
        <div className="flex flex-row items-center gap-4 mb-4">
          <Icon as={SearchIcon} size="lg" color="ghost" />
          <Text as="h3" fontSize="lg" fontWeight="medium">
            No groups found
          </Text>
        </div>
        <Text as="p" color="gray" className="mb-6">
          We couldn't find any groups matching "{searchQuery}"
        </Text>
        <Button onClick={onClearSearch} variant="neutral-outline">
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-12">
      <div className="flex flex-row items-center gap-4 mb-4">
        <Icon as={UsersIcon} size="lg" color="ghost" />
        <Text as="h3" fontSize="lg" fontWeight="medium">
          No groups yet
        </Text>
      </div>
      <Text as="p" color="gray" className="mb-6">
        You're not a member of any groups. Create your first group to get
        started!
      </Text>
      <Button onClick={onCreateGroup} variant="neutral-outline">
        <Icon as={PlusIcon} color="inherit" />
        Create Your First Group
      </Button>
    </div>
  );
};
