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
  PageLoader,
  SelectInput,
  TextInputAsButton,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { FilterFrequency, FREQUENCY_LABELS, useSummaryFilter } from '../../hooks/use-summary-filter';

import { FilterSummaryFormSchema } from './types';

interface FilterSummaryDrawer {
  payload?: Record<string, unknown>;
}
export const FilterSummaryDrawer: FC<FilterSummaryDrawer> = ({ payload }) => {
  const { isDesktop } = useWindowResize();
  const { appliedFilters, filters } = useSummaryFilter({ adapter: 'url' });

  const { openDrawer, closeDrawer } = useDrawerRoute();

  const { control, handleSubmit, watch, getValues } = useForm<FilterSummaryFormSchema>({
    defaultValues: {
      startDate: formatDate((payload?.startDate as string) ?? appliedFilters.dateFrom, DateFormat.ISO_DATE),
      endDate: formatDate((payload?.endDate as string) ?? appliedFilters.dateTo, DateFormat.ISO_DATE),
      frequency: (payload?.frequency as string) || appliedFilters.frequency || FilterFrequency.Monthly,
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
    const { startDate, endDate, frequency, categoryIds, accountIds } = data ?? {};

    filters.replaceAll({
      dateFrom: dayjs(startDate).startOf('day').toISOString(),
      dateTo: dayjs(endDate).endOf('day').toISOString(),
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
              <FormLayout.Column span={12}>
                <Controller
                  name="frequency"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SelectInput
                      {...field}
                      label="Frequency"
                      error={fieldState.error?.message}
                      placeholder="Select frequency"
                    >
                      {Object.entries(FREQUENCY_LABELS).map(([key, label], index) => (
                        <SelectInput.Option key={index} value={key}>
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
