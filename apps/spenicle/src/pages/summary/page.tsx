import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  Button,
  ButtonGroup,
  FilterChip,
  FilterChipGroup,
  Icon,
  PageContent,
  PageHeader,
} from '@dimasbaguspm/versaur';
import { FilterIcon } from 'lucide-react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { useSummaryFilter } from './hooks/use-summary-filter';

const SummaryPage = () => {
  const { humanizedFilters, removeFilter, removeAllFilters } =
    useSummaryFilter();
  const { openDrawer } = useDrawerRoute();

  const handleOnFilterClick = () => {
    openDrawer(DRAWER_ROUTES.FILTER_SUMMARY);
  };
  return (
    <>
      <PageHeader title="Summary" subtitle="Manage your summary transactions" />
      <PageContent>
        <ButtonGroup className="mb-4" alignment="between">
          <Button variant="outline" onClick={handleOnFilterClick}>
            <Icon as={FilterIcon} color="inherit" size="sm" />
            Filter
          </Button>
        </ButtonGroup>
        <FilterChipGroup>
          {humanizedFilters.map((filter) => (
            <FilterChip
              key={filter.key}
              onClick={() => removeFilter(filter.key)}
            >
              {filter.label}
            </FilterChip>
          ))}
          <Button variant="ghost" onClick={removeAllFilters}>
            Reset
          </Button>
        </FilterChipGroup>
      </PageContent>
    </>
  );
};

export default SummaryPage;
