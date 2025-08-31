import { Button, FilterChip, FilterChipGroup } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { useTransactionsFilter } from '../hooks/use-transactions-filter';

export const FiltersControl: FC = () => {
  const { humanizedFilters, removeAllFilters, removeFilter } = useTransactionsFilter();

  return (
    <FilterChipGroup className="mb-4">
      {humanizedFilters.map(({ key, label }) => (
        <FilterChip key={key} onClick={() => removeFilter(key)}>
          {label}
        </FilterChip>
      ))}
      <Button variant="ghost" onClick={removeAllFilters}>
        Clear All
      </Button>
    </FilterChipGroup>
  );
};
