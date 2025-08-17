import { SearchInput } from '@dimasbaguspm/versaur';
import { ChangeEvent, FC } from 'react';

import { useProfilesContext } from '../context';

export const ProfilesSearchBar: FC = () => {
  const { searchTerm, onSearchChange } = useProfilesContext();

  const handleSearchChange = (ev: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(ev.target.value);
  };

  return (
    <div className="mb-6">
      <SearchInput
        onChange={handleSearchChange}
        placeholder="Search profiles by name, app, or owner... (⌘K)"
        value={searchTerm}
      />
    </div>
  );
};
