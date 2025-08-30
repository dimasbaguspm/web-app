import { If } from '@dimasbaguspm/utils/if';
import { Button, FilterChip, FilterChipGroup } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useCategoryFilter } from '../hooks/use-category-filter';

export const FilterControl: FC = () => {
  const { humanizedFilters, removeFilter, removeAllFilters } =
    useCategoryFilter();

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
