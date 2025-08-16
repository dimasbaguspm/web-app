import { CreateGroupModel } from '@dimasbaguspm/hooks/use-api';

import { GroupData } from '../types';

export const useCreateGroup = (
  createGroup: (data: CreateGroupModel) => Promise<GroupData>,
  closeModal: () => void,
) => {
  const handleCreateGroup = async (groupName: string) => {
    if (!groupName.trim()) return;

    try {
      await createGroup({ name: groupName.trim() });
      closeModal();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return { handleCreateGroup };
};
