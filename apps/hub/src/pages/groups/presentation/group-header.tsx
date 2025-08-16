import { Button, ButtonIcon, Icon, Text } from '@dimasbaguspm/versaur';
import { PlusIcon } from 'lucide-react';
import { FC } from 'react';

import type { GroupHeaderProps } from '../types';

export const GroupHeader: FC<GroupHeaderProps> = ({
  isMobile,
  onCreateGroup,
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <Text as="h1" fontSize="3xl" fontWeight="bold" color="black">
            My Groups
          </Text>
          {!isMobile && (
            <Text as="p" color="gray">
              Manage your groups and discover apps together
            </Text>
          )}
        </div>

        {isMobile ? (
          <ButtonIcon
            as={PlusIcon}
            size="md"
            onClick={onCreateGroup}
            aria-label="Create New Group"
          />
        ) : (
          <Button onClick={onCreateGroup} title="Create New Group (⌘N)">
            <Icon as={PlusIcon} size="md" color="neutral" />
            Create New Group
          </Button>
        )}
      </div>
    </div>
  );
};
