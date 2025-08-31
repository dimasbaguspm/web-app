import { Button, FilterChip, FilterChipGroup } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useSummaryFilter } from '../hooks/use-summary-filter';

export const FilterControl: FC = () => {
  const { humanizedFilters, removeFilter, removeAllFilters } = useSummaryFilter();

  return (
    <FilterChipGroup className="mb-4">
      {humanizedFilters.map((filter) => (
        <FilterChip key={filter.key} onClick={() => removeFilter(filter.key)}>
          {filter.label}
        </FilterChip>
      ))}
      <Button variant="ghost" onClick={removeAllFilters}>
        Reset
      </Button>
    </FilterChipGroup>
  );
};
