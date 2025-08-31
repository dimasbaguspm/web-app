import { Button, Modal, Text, TextInput } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useGroupsStateContext } from '../context';

export interface CreateGroupModalProps {
  onCreateGroup: (groupName: string) => Promise<void>;
}

/**
 * Alternative implementation of CreateGroupModal that uses context directly.
 * This eliminates the need for multiple props and makes the component more self-contained.
 */
export const CreateGroupModal: FC<CreateGroupModalProps> = ({ onCreateGroup }) => {
  const { isCreating, newGroupName, setNewGroupName, closeModal } = useGroupsStateContext();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newGroupName.trim()) {
      handleCreateGroup();
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      await onCreateGroup(newGroupName.trim());
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <Modal isOpen={isCreating} onClose={closeModal} size="lg">
      <Modal.Header>
        <Text as="h3" fontSize="lg" fontWeight="semibold">
          Create New Group
        </Text>
      </Modal.Header>
      <Modal.Body>
        <TextInput
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter group name..."
          autoFocus
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()} className="flex-1">
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
