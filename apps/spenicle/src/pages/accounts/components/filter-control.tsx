import { If } from '@dimasbaguspm/utils/if';
import { Button, FilterChip, FilterChipGroup } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useAccountFilter } from '../hooks/use-account-filter';

export const FilterControl: FC = () => {
  const { humanizedFilters, removeFilter, removeAllFilters } = useAccountFilter();

  return (
    <If condition={[humanizedFilters.length]}>
      <FilterChipGroup className="mb-4">
        {humanizedFilters.map(([key, label]) => (
          <FilterChip key={key} onClick={() => removeFilter(key)}>
            {label}
          </FilterChip>
        ))}
        <Button variant="ghost" onClick={removeAllFilters}>
          Reset
        </Button>
      </FilterChipGroup>
    </If>
  );
};
