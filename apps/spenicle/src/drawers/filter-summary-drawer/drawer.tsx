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
  SwitchInput,
  TextInput,
  TextInputAsButton,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { FREQUENCY_LABELS, useSummaryFilter } from '../../hooks/use-summary-filter';

import { getDefaultValues, getFrequencyForPreset } from './helpers';
import { FilterSummaryFormSchema } from './types';

interface FilterSummaryDrawer {
  payload?: Record<string, unknown>;
}
export const FilterSummaryDrawer: FC<FilterSummaryDrawer> = ({ payload }) => {
  const { isDesktop } = useWindowResize();
  const summaryFilters = useSummaryFilter({
    adapter: 'url',
  });
  const { filters, DATE_RANGE_PRESET_LABELS, getDateRangeFromPreset } = summaryFilters;

  const { openDrawer, closeDrawer } = useDrawerRoute();

  const { control, handleSubmit, getValues, watch } = useForm<FilterSummaryFormSchema>({
    defaultValues: getDefaultValues(summaryFilters, payload),
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
    const {
      dateRangePreset,
      categoryIds,
      accountIds,
      useCustomDateRange,
      customDateFrom,
      customDateTo,
      customFrequency,
    } = data ?? {};

    // Automatically determine frequency based on the preset
    const frequency = getFrequencyForPreset(dateRangePreset);

    // Get the date range for the selected preset
    const { dateFrom, dateTo } = getDateRangeFromPreset(dateRangePreset);

    if (useCustomDateRange) {
      filters.replaceAll({
        dateFrom: dayjs(customDateFrom).startOf('day').toISOString(),
        dateTo: dayjs(customDateTo).endOf('day').toISOString(),
        frequency: customFrequency,
        accountId: accountIds,
        categoryId: categoryIds,
      });
    } else {
      // Apply all filters at once
      filters.replaceAll({
        dateFrom,
        dateTo,
        frequency: frequency,
        accountId: accountIds,
        categoryId: categoryIds,
      });
    }
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

  const useCustomDateRange = watch('useCustomDateRange', false);

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
                  control={control}
                  name="useCustomDateRange"
                  render={({ field }) => <SwitchInput {...field} label="Custom Date Range" />}
                />
              </FormLayout.Column>
              {useCustomDateRange && (
                <>
                  <FormLayout.Column span={6}>
                    <Controller
                      name="customDateFrom"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextInput {...field} type="date" label="From" error={fieldState.error?.message} />
                      )}
                    />
                  </FormLayout.Column>
                  <FormLayout.Column span={6}>
                    <Controller
                      name="customDateTo"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextInput {...field} type="date" label="To" error={fieldState.error?.message} />
                      )}
                    />
                  </FormLayout.Column>
                  <FormLayout.Column span={12}>
                    <Controller
                      name="customFrequency"
                      control={control}
                      render={({ field, fieldState }) => (
                        <SelectInput
                          {...field}
                          label="Frequency"
                          error={fieldState.error?.message}
                          placeholder="Select frequency"
                        >
                          {Object.entries(FREQUENCY_LABELS).map(([key, label]) => (
                            <SelectInput.Option key={key} value={key}>
                              {label}
                            </SelectInput.Option>
                          ))}
                        </SelectInput>
                      )}
                    />
                  </FormLayout.Column>
                </>
              )}
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
