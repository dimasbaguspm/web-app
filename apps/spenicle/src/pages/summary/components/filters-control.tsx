import { useApiSpenicleTransactionsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { ButtonGroup, ButtonIcon, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import {
  DATE_RANGE_PRESET_LABELS,
  FilterDateRangePresets,
  FilterFrequency,
  useSummaryFilter,
} from '../../../hooks/use-summary-filter';

export const FiltersControl: FC = () => {
  const { openDrawer } = useDrawerRoute();
  const { filters, appliedFilters, currentDateRangePreset, getDateRangeFromPreset } = useSummaryFilter();
  const [firstTransaction] = useApiSpenicleTransactionsInfiniteQuery({
    pageSize: 1,
    sortBy: 'date',
    sortOrder: 'asc',
  });

  const handleOnFilterClick = () => {
    openDrawer(DRAWER_ROUTES.FILTER_SUMMARY);
  };

  const handleOnDateRangeClick = (id: FilterDateRangePresets) => {
    const firstDate = firstTransaction?.[0] ? dayjs(firstTransaction[0].date) : undefined;

    const { dateFrom, dateTo } = getDateRangeFromPreset(id, firstDate);

    let nextFrequency = appliedFilters.frequency;

    switch (id) {
      case FilterDateRangePresets.Last30Days:
      case FilterDateRangePresets.ThisMonth:
      case FilterDateRangePresets.LastMonth:
        nextFrequency = FilterFrequency.Weekly;
        break;
      case FilterDateRangePresets.ThisWeek:
      case FilterDateRangePresets.LastWeek:
      case FilterDateRangePresets.Last7Days:
        nextFrequency = FilterFrequency.Daily;
        break;
      case FilterDateRangePresets.ThisYear:
      case FilterDateRangePresets.LastYear:
        nextFrequency = FilterFrequency.Monthly;
        break;
      case FilterDateRangePresets.AllTime:
        if (firstDate) {
          const todaysDiff = dayjs(dateTo).diff(firstDate, 'day');
          if (todaysDiff <= 31) {
            nextFrequency = FilterFrequency.Daily;
            break;
          }

          const monthsDiff = dayjs(dateTo).diff(firstDate, 'month');
          nextFrequency = monthsDiff <= 12 ? FilterFrequency.Monthly : FilterFrequency.Yearly;
        } else {
          nextFrequency = FilterFrequency.Yearly;
        }
        break;
      default:
        nextFrequency = FilterFrequency.Monthly;
        break;
    }

    filters.replaceAll({
      dateFrom,
      dateTo,
      frequency: nextFrequency,
      accountId: appliedFilters.accountId,
      categoryId: appliedFilters.categoryId,
    });
  };

  return (
    <ButtonGroup>
      <ButtonMenu
        variant="outline"
        size="md"
        label={
          <>
            <Icon as={ChevronDownIcon} color="inherit" size="sm" />
            {currentDateRangePreset ? DATE_RANGE_PRESET_LABELS[currentDateRangePreset] : 'Custom Range'}
          </>
        }
      >
        {Object.entries(DATE_RANGE_PRESET_LABELS).map(([key, label], index) => (
          <ButtonMenu.Item
            key={index}
            onClick={() => handleOnDateRangeClick(key as FilterDateRangePresets)}
            active={key === currentDateRangePreset}
          >
            {label}
          </ButtonMenu.Item>
        ))}
      </ButtonMenu>

      <ButtonIcon
        as={FilterIcon}
        variant="outline"
        onClick={handleOnFilterClick}
        size="md"
        aria-label="Advanced Filter"
      />
    </ButtonGroup>
  );
};
