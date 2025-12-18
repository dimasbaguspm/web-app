import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCategoriesPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  Drawer,
  FormLayout,
  PageLoader,
  SelectInput,
  TextInputAsButton,
} from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { FilterDateRangePresets, FilterFrequency, useSummaryFilter } from '../../hooks/use-summary-filter';

import { FilterSummaryFormSchema } from './types';

// Helper function to determine frequency based on date range preset
const getFrequencyForPreset = (preset: FilterDateRangePresets): FilterFrequency => {
  switch (preset) {
    case FilterDateRangePresets.Last7Days:
    case FilterDateRangePresets.ThisWeek:
    case FilterDateRangePresets.LastWeek:
      return FilterFrequency.Daily;
    case FilterDateRangePresets.Last30Days:
    case FilterDateRangePresets.ThisMonth:
    case FilterDateRangePresets.LastMonth:
      return FilterFrequency.Weekly;
    case FilterDateRangePresets.Last6Months:
    case FilterDateRangePresets.ThisYear:
    case FilterDateRangePresets.LastYear:
      return FilterFrequency.Monthly;
    case FilterDateRangePresets.AllTime:
      return FilterFrequency.Yearly;
    default:
      return FilterFrequency.Monthly;
  }
};

interface FilterSummaryDrawer {
  payload?: Record<string, unknown>;
}
export const FilterSummaryDrawer: FC<FilterSummaryDrawer> = ({ payload }) => {
  const { isDesktop } = useWindowResize();
  const { appliedFilters, filters, currentDateRangePreset, DATE_RANGE_PRESET_LABELS, getDateRangeFromPreset } =
    useSummaryFilter({
      adapter: 'url',
    });

  const { openDrawer, closeDrawer } = useDrawerRoute();

  const { control, handleSubmit, getValues } = useForm<FilterSummaryFormSchema>({
    defaultValues: {
      dateRangePreset:
        (payload?.dateRangePreset as FilterDateRangePresets) ??
        currentDateRangePreset ??
        FilterDateRangePresets.Last6Months,
      categoryIds: (payload?.categoryIds as number[]) || appliedFilters.categoryId || [],
      accountIds: (payload?.accountIds as number[]) || appliedFilters.accountId || [],
    },
  });

  const [categories, , { isLoading: isCategoriesFetching }] = useApiSpenicleCategoriesPaginatedQuery(
    {
      id: getValues().categoryIds,
    },
    {
      enabled: Boolean(getValues().categoryIds?.length),
    },
  );

  const [accounts, , { isLoading: isAccountsFetching }] = useApiSpenicleAccountsPaginatedQuery(
    {
      id: getValues().accountIds,
    },
    {
      enabled: Boolean(getValues().accountIds?.length),
    },
  );

  const handleOnValidSubmit: SubmitHandler<FilterSummaryFormSchema> = (data) => {
    const { dateRangePreset, categoryIds, accountIds } = data ?? {};

    // Automatically determine frequency based on the preset
    const frequency = getFrequencyForPreset(dateRangePreset);

    // Get the date range for the selected preset
    const { dateFrom, dateTo } = getDateRangeFromPreset(dateRangePreset);

    // Apply all filters at once
    filters.replaceAll({
      dateFrom,
      dateTo,
      frequency: frequency,
      accountId: accountIds,
      categoryId: categoryIds,
    });
  };

  const handleOnAccountClick = () => {
    openDrawer(
      DRAWER_ROUTES.SELECT_MULTIPLE_ACCOUNT,
      {
        payloadId: 'accountIds',
      },
      {
        replace: true,
        state: {
          payload: getValues(),
          returnToDrawer: DRAWER_ROUTES.FILTER_SUMMARY,
        },
      },
    );
  };

  const handleOnCategoryClick = () => {
    openDrawer(
      DRAWER_ROUTES.SELECT_MULTIPLE_CATEGORY,
      {
        payloadId: 'categoryIds',
      },
      {
        replace: true,
        state: {
          payload: getValues(),
          returnToDrawer: DRAWER_ROUTES.FILTER_SUMMARY,
        },
      },
    );
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Summary Filter</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <If condition={[isAccountsFetching, isCategoriesFetching]}>
        <PageLoader />
      </If>

      <If condition={[!isAccountsFetching, !isCategoriesFetching]}>
        <Drawer.Body>
          <form id="filter-transaction-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
            <FormLayout>
              <FormLayout.Column span={12}>
                <Controller
                  name="dateRangePreset"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SelectInput
                      {...field}
                      label="Date Range"
                      error={fieldState.error?.message}
                      placeholder="Select date range"
                    >
                      {Object.entries(DATE_RANGE_PRESET_LABELS).map(([key, label]) => (
                        <SelectInput.Option key={key} value={key}>
                          {label}
                        </SelectInput.Option>
                      ))}
                    </SelectInput>
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <Controller
                  name="accountIds"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInputAsButton
                      label="Accounts"
                      placeholder="Select Accounts"
                      displayValue={field.value ? accounts?.items?.map((acc) => acc.name).join(', ') : ''}
                      value={field.value}
                      onClick={handleOnAccountClick}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <Controller
                  name="categoryIds"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInputAsButton
                      label="Categories"
                      placeholder="Select Categories"
                      displayValue={field.value ? categories?.items?.map((cat) => cat.name).join(', ') : ''}
                      value={field.value}
                      onClick={handleOnCategoryClick}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </FormLayout.Column>
            </FormLayout>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <ButtonGroup alignment="end" fluid={!isDesktop}>
            <Button variant="ghost" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button type="submit" form="filter-transaction-form" variant="primary">
              Apply
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};
