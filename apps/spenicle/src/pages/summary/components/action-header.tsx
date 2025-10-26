import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { If } from '@dimasbaguspm/utils/if';
import { ChipSingleInput, FilterChip, FilterChipGroup, Icon } from '@dimasbaguspm/versaur';
import { ChartBarBigIcon, ChartNoAxesCombinedIcon, TargetIcon } from 'lucide-react';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../../constants/page-routes';
import { useSummaryFilter } from '../../../hooks/use-summary-filter';

import { FiltersControl } from './filters-control';

export const ActionHeader: FC = () => {
  const { isDesktop } = useWindowResize();
  const navigate = useNavigate();
  const location = useLocation();
  const { humanizedFilters, removeFilter } = useSummaryFilter();

  const handleOnNavigate = (value: 'overview' | 'trends' | 'timeline') => {
    navigate({
      pathname:
        value === 'trends'
          ? DEEP_LINKS.SUMMARY_TRENDS.path
          : value === 'timeline'
            ? DEEP_LINKS.SUMMARY_TIMELINE.path
            : DEEP_LINKS.SUMMARY.path,
      search: location.search,
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between w-full mb-4">
        <FiltersControl />

        <ChipSingleInput
          value={
            location.pathname === DEEP_LINKS.SUMMARY.path
              ? 'overview'
              : location.pathname === DEEP_LINKS.SUMMARY_TRENDS.path
                ? 'trends'
                : 'timeline'
          }
          label=""
          size="md"
          name="1"
          className="w-auto"
          onChange={(data) => handleOnNavigate(data as 'overview' | 'trends' | 'timeline')}
        >
          <ChipSingleInput.Option value="overview">
            <Icon as={TargetIcon} color="inherit" size="sm" />
            {isDesktop && 'Overview'}
          </ChipSingleInput.Option>
          <ChipSingleInput.Option value="trends">
            <Icon as={ChartNoAxesCombinedIcon} color="inherit" size="sm" />
            {isDesktop && 'Trends'}
          </ChipSingleInput.Option>
          <ChipSingleInput.Option value="timeline">
            <Icon as={ChartBarBigIcon} color="inherit" size="sm" />
            {isDesktop && 'Timeline'}
          </ChipSingleInput.Option>
        </ChipSingleInput>
      </div>

      <If condition={humanizedFilters.length > 0}>
        <FilterChipGroup overlay hasMargin>
          {humanizedFilters.map(([key, label]) => (
            <FilterChip key={key} onClick={() => removeFilter(key)}>
              {label}
            </FilterChip>
          ))}
        </FilterChipGroup>
      </If>
    </>
  );
};
