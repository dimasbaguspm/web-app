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
  SelectInput,
  SwitchInput,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useSummaryOverviewFilter } from '../../pages/summary-overview/hooks/use-summary-overview-filter';

import { FilterSummaryFormSchema } from './types';

export const FilterSummaryOverviewDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const {
    appliedFilters,
    setFilters,
    setFiltersByFrequency,
    getCurrentFrequency,
  } = useSummaryOverviewFilter();
  const { closeDrawer } = useDrawerRoute();

  const { control, handleSubmit, watch } = useForm<FilterSummaryFormSchema>({
    defaultValues: {
      frequency: getCurrentFrequency() || 'thisWeek',
      customRange: getCurrentFrequency() === null,
      startDate: formatDate(
        appliedFilters.range.startDate,
        DateFormat.ISO_DATE,
      ),
      endDate: formatDate(appliedFilters.range.endDate, DateFormat.ISO_DATE),
    },
  });

  const handleOnValidSubmit: SubmitHandler<FilterSummaryFormSchema> = (
    data,
  ) => {
    const { frequency, startDate, endDate, customRange } = data ?? {};

    if (customRange && startDate && endDate) {
      setFilters({
        range: {
          startDate: dayjs(data.startDate),
          endDate: dayjs(data.endDate),
        },
      });
      return;
    }

    setFiltersByFrequency(frequency);
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Filter Summary</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <Drawer.Body>
        <form
          id="filter-transaction-form"
          onSubmit={handleSubmit(handleOnValidSubmit)}
        >
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
                render={({ field }) => (
                  <SwitchInput
                    {...field}
                    checked={field.value}
                    label="Custom Range?"
                  />
                )}
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

                      return startDate.isBefore(endDate)
                        ? true
                        : 'Start date must be before end date';
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
                      return endDate.isAfter(startDate)
                        ? true
                        : 'End date must be after start date';
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
          </FormLayout>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="filter-transaction-form"
            variant="primary"
          >
            Apply
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
