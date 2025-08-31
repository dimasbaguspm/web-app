import {
  useApiSpenicleAccountsPaginatedQuery,
  useApiSpenicleCategoriesPaginatedQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  DateSinglePickerInput,
  Drawer,
  FormLayout,
  LoadingIndicator,
  SelectInput,
  SwitchInput,
  TextAreaInput,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { SummaryFrequencyType, useSummaryFilter } from '../../pages/summary/hooks/use-summary-filter';

import { FilterSummaryFormSchema } from './types';

interface FilterSummaryDrawer {
  payload?: Record<string, unknown>;
}
export const FilterSummaryDrawer: FC<FilterSummaryDrawer> = ({ payload }) => {
  const { isDesktop } = useWindowResize();
  const { appliedFilters, setFilters, frequencyToDateRange, frequency } = useSummaryFilter();

  const { openDrawer, closeDrawer } = useDrawerRoute();

  const { control, handleSubmit, watch, getValues } = useForm<FilterSummaryFormSchema>({
    defaultValues: {
      frequency: frequency || 'thisWeek',
      customRange: frequency === SummaryFrequencyType.custom,
      startDate: formatDate(appliedFilters.range.startDate, DateFormat.ISO_DATE),
      endDate: formatDate(appliedFilters.range.endDate, DateFormat.ISO_DATE),
      categoryIds: (payload?.categoryIds as number[]) || appliedFilters.categoryIds || [],
      accountIds: (payload?.accountIds as number[]) || appliedFilters.accountIds || [],
    },
  });

  const [categories, , { isFetching: isCategoriesFetching }] = useApiSpenicleCategoriesPaginatedQuery(
    {
      id: getValues().categoryIds,
    },
    {
      enabled: Boolean(getValues().categoryIds),
    },
  );

  const [accounts, , { isFetching: isAccountsFetching }] = useApiSpenicleAccountsPaginatedQuery(
    {
      id: getValues().accountIds,
    },
    {
      enabled: Boolean(getValues().accountIds),
    },
  );

  const handleOnValidSubmit: SubmitHandler<FilterSummaryFormSchema> = (data) => {
    const { frequency, startDate, endDate, customRange, categoryIds, accountIds } = data ?? {};

    if (customRange && startDate && endDate) {
      setFilters({
        range: {
          startDate: dayjs(data.startDate),
          endDate: dayjs(data.endDate),
        },
        categoryIds,
        accountIds,
      });
      return;
    }

    const { startDate: frequencyStartDate, endDate: frequencyEndDate } = frequencyToDateRange(frequency);

    setFilters({
      range: {
        startDate: frequencyStartDate,
        endDate: frequencyEndDate,
      },
      categoryIds,
      accountIds,
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
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isAccountsFetching, !isCategoriesFetching]}>
        <Drawer.Body>
          <form id="filter-transaction-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
            <FormLayout>
              <FormLayout.Column span={12}>
                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <SelectInput {...field} label="Frequency">
                      <option value="thisWeek">This Week</option>
                      <option value="lastWeek">Last Week</option>
                      <option value="thisMonth">This Month</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="thisYear">This Year</option>
                      <option value="allTheTime">All Time</option>
                    </SelectInput>
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <Controller
                  name="customRange"
                  control={control}
                  render={({ field }) => <SwitchInput {...field} checked={field.value} label="Custom Range?" />}
                />
              </FormLayout.Column>
              <If condition={watch('customRange')}>
                <FormLayout.Column span={6}>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{
                      deps: ['endDate'],
                      validate: (value) => {
                        const endDate = dayjs(watch('endDate'));
                        const startDate = dayjs(value);

                        return startDate.isBefore(endDate) ? true : 'Start date must be before end date';
                      },
                    }}
                    render={({ field, formState }) => (
                      <DateSinglePickerInput
                        {...field}
                        label="Start Date"
                        max={watch('endDate')}
                        placeholder="Select a start date"
                        error={formState.errors.startDate?.message}
                      />
                    )}
                  />
                </FormLayout.Column>
                <FormLayout.Column span={6}>
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{
                      deps: ['startDate'],
                      validate: (value) => {
                        const startDate = dayjs(watch('startDate'));
                        const endDate = dayjs(value);
                        return endDate.isAfter(startDate) ? true : 'End date must be after start date';
                      },
                    }}
                    render={({ field, formState }) => (
                      <DateSinglePickerInput
                        {...field}
                        label="End Date"
                        max={dayjs().toISOString()}
                        placeholder="Select an end date"
                        error={formState.errors.endDate?.message}
                      />
                    )}
                  />
                </FormLayout.Column>
              </If>
              <FormLayout.Column span={12}>
                <Controller
                  name="accountIds"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TextAreaInput
                        readOnly
                        onClick={handleOnAccountClick}
                        value={
                          field.value
                            ? accounts?.items
                                ?.filter((account) => field.value?.includes(account.id))
                                ?.map((account) => account.name)
                            : []
                        }
                        label="Accounts"
                        placeholder="Select accounts"
                      />
                      <input type="hidden" {...field} value={field.value?.map(String)} />
                    </>
                  )}
                />
              </FormLayout.Column>
              <FormLayout.Column span={12}>
                <Controller
                  name="categoryIds"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TextAreaInput
                        readOnly
                        onClick={handleOnCategoryClick}
                        value={
                          field.value
                            ? categories?.items
                                ?.filter((category) => field.value?.includes(category.id))
                                ?.map((category) => category.name)
                            : []
                        }
                        label="Categories"
                        placeholder="Select categories"
                      />
                      <input type="hidden" {...field} value={field.value?.map(String)} />
                    </>
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
