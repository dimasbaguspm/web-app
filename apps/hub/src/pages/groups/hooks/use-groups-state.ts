import { useState } from 'react';

export const useGroupsState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const closeModal = () => {
    setIsCreating(false);
    setNewGroupName('');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    isCreating,
    setIsCreating,
    newGroupName,
    setNewGroupName,
    closeModal,
    clearSearch,
  };
};
