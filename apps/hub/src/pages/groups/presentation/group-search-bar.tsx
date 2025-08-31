import { SearchInput } from '@dimasbaguspm/versaur';
import { ChangeEvent, FC } from 'react';

import { useGroupsStateContext } from '../context';

/**
 * Alternative implementation of GroupSearchBar that uses context directly.
 * This eliminates the need for prop drilling and makes the component more self-contained.
 */
export const GroupSearchBar: FC = () => {
  const { searchQuery, setSearchQuery } = useGroupsStateContext();

  const handleOnSearchChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setSearchQuery(value);
  };

  return (
    <div className="mb-6">
      <SearchInput onChange={handleOnSearchChange} placeholder="Search your groups... (⌘K)" value={searchQuery} />
    </div>
  );
};
