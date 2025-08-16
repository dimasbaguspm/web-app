import { createContext, FC, ReactNode, useContext, useState } from 'react';

export interface GroupsStateContextValue {
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Modal state
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;

  // New group form state
  newGroupName: string;
  setNewGroupName: (name: string) => void;

  // Helper actions
  closeModal: () => void;
}

const GroupsStateContext = createContext<GroupsStateContextValue | undefined>(
  undefined,
);

export interface GroupsStateProviderProps {
  children: ReactNode;
}

export const GroupsStateProvider: FC<GroupsStateProviderProps> = ({
  children,
}) => {
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

  const value: GroupsStateContextValue = {
    searchQuery,
    setSearchQuery,
    clearSearch,
    isCreating,
    setIsCreating,
    newGroupName,
    setNewGroupName,
    closeModal,
  };

  return (
    <GroupsStateContext.Provider value={value}>
      {children}
    </GroupsStateContext.Provider>
  );
};

export const useGroupsStateContext = (): GroupsStateContextValue => {
  const context = useContext(GroupsStateContext);
  if (!context) {
    throw new Error(
      'useGroupsStateContext must be used within a GroupsStateProvider',
    );
  }
  return context;
};
