import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import {
  Button,
  ButtonGroup,
  DateSinglePickerInput,
  Drawer,
  FormLayout,
} from '@dimasbaguspm/versaur';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useSummaryFilter } from '../../pages/summary/hooks/use-summary-filter';

import { FilterSummaryFormSchema } from './types';

export const FilterSummaryDrawer: FC = () => {
  const { isDesktop } = useWindowResize();
  const { appliedFilters, setFilters } = useSummaryFilter();
  const { closeDrawer } = useDrawerRoute();

  const { control, handleSubmit, watch } = useForm<FilterSummaryFormSchema>({
    defaultValues: {
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
    setFilters({
      range: {
        startDate: dayjs(data.startDate),
        endDate: dayjs(data.endDate),
      },
    });
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
            <FormLayout.Column span={12}>
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
