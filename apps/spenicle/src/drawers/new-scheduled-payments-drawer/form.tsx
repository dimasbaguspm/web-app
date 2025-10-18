import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { DateFormat, formatDate } from '@dimasbaguspm/utils/date';
import {
  ChipSingleInput,
  DateSinglePickerInput,
  FormLayout,
  Hr,
  Icon,
  PriceInput,
  SelectInput,
  SwitchInput,
  TextAreaInput,
  TextInput,
} from '@dimasbaguspm/versaur';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { NewScheduledPaymentsFormSchema } from './types';
import { useNewScheduledPaymentsData } from './use-new-scheduled-payments-data';

interface Props {
  defaultValues?: Partial<NewScheduledPaymentsFormSchema>;
  onSubmit: (data: NewScheduledPaymentsFormSchema) => void;
}

export const NewScheduledPaymentsForm: FC<Props> = ({ defaultValues, onSubmit }) => {
  const { openDrawer } = useDrawerRoute();
  const { control, getValues, handleSubmit } = useForm<NewScheduledPaymentsFormSchema>({
    defaultValues,
  });

  const { accountData, categoryData } = useNewScheduledPaymentsData(getValues());

  const handleOnOpenSelectDrawer = (drawerId: string, fieldId: string) => () => {
    openDrawer(
      drawerId,
      {
        payloadId: fieldId,
      },
      {
        replace: true,
        state: {
          payload: getValues(),
          returnToDrawer: DRAWER_ROUTES.NEW_SCHEDULED_PAYMENTS,
        },
      },
    );
  };

  return (
    <form id="new-scheduled-payments-form" onSubmit={handleSubmit(onSubmit)}>
      <FormLayout>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Name is required',
              maxLength: {
                value: 50,
                message: 'Name must be at most 50 characters',
              },
            }}
            render={({ field, fieldState }) => (
              <TextInput
                label="Name"
                placeholder="Enter scheduled payment name"
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="type"
            rules={{
              required: 'Type is required',
            }}
            render={({ field }) => (
              <ChipSingleInput {...field} label="Type">
                <ChipSingleInput.Option value="expense">
                  <Icon as={TrendingDownIcon} color="inherit" size="sm" />
                  Expense
                </ChipSingleInput.Option>
                <ChipSingleInput.Option value="income">
                  <Icon as={TrendingUpIcon} color="inherit" size="sm" />
                  Income
                </ChipSingleInput.Option>
              </ChipSingleInput>
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="amount"
            rules={{
              validate: (value) => {
                if (value == null || Number.isNaN(value)) {
                  return 'Amount is required';
                }
                if (value <= 0) {
                  return 'Amount must be greater than 0';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <PriceInput
                label="Amount"
                {...field}
                value={field.value == null ? '' : String(field.value)}
                onChange={(val) => {
                  const cleaned = String(val).replace(/[^0-9-]+/g, '');
                  const parsed = cleaned === '' ? 0 : parseFloat(cleaned);
                  field.onChange(Number.isNaN(parsed) ? 0 : parsed);
                }}
                error={fieldState.error?.message}
                helperText="Per occurrence"
              />
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="accountId"
            rules={{
              validate: (value) => {
                if (!value) {
                  return 'Source account is required';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  readOnly
                  onClick={handleOnOpenSelectDrawer(DRAWER_ROUTES.SELECT_ACCOUNT, 'accountId')}
                  label="Source"
                  placeholder="Select account"
                  value={accountData?.name ?? ''}
                  error={fieldState.error?.message}
                />
                <input type="hidden" {...field} />
              </>
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="categoryId"
            rules={{
              validate: (value) => {
                if (!value) {
                  return 'Category is required';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <TextInput
                  readOnly
                  label="Category"
                  onClick={handleOnOpenSelectDrawer(DRAWER_ROUTES.SELECT_CATEGORY, 'categoryId')}
                  placeholder="Select category"
                  value={categoryData?.name ?? ''}
                  error={fieldState.error?.message}
                />
                <input type="hidden" {...field} />
              </>
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Hr />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="startDate"
            rules={{
              validate: (value) => {
                if (!value) {
                  return 'First date is required';
                }
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                  return 'First date cannot be in the past';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <DateSinglePickerInput
                label="First Date"
                placeholder="Select first date"
                {...field}
                formatter={(date) => formatDate(date, DateFormat.FULL_DATE)}
                error={fieldState.error?.message}
              />
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={6}>
          <Controller
            control={control}
            name="interval"
            rules={{
              validate: (value) => {
                if (!value) {
                  return 'Frequency is required';
                }
                if (['daily', 'weekly', 'monthly', 'yearly'].indexOf(value) === -1) {
                  return 'Invalid frequency';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <SelectInput
                label="Frequency"
                placeholder="Select frequency"
                {...field}
                error={fieldState.error?.message}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </SelectInput>
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={6}>
          <Controller
            control={control}
            name="frequency"
            rules={{
              validate: (value) => {
                if (value == null || Number.isNaN(value)) {
                  return 'Interval is required';
                }
                if (value <= 0) {
                  return 'Interval must be at least 1';
                }
                if (value > 100) {
                  return 'Interval must be at most 100';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <TextInput
                type="number"
                label="Interval"
                placeholder="Enter interval"
                {...field}
                value={field.value == null ? '' : String(field.value)}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  field.onChange(Number.isNaN(parsed) ? 0 : parsed);
                }}
                error={fieldState.error?.message}
              />
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="until"
            rules={{
              deps: ['startDate', 'frequency', 'interval'],
              validate: (value) => {
                if (value) {
                  const startDate = new Date(getValues('startDate'));
                  const untilDate = new Date(value);
                  if (untilDate < startDate) {
                    return 'Until date must be after start date';
                  }
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <DateSinglePickerInput
                label="Until (Optional)"
                placeholder="Select end date"
                {...field}
                value={field.value === undefined ? '' : field.value}
                formatter={(date) => (date ? formatDate(date, DateFormat.FULL_DATE) : '')}
                error={fieldState.error?.message}
              />
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="immediate"
            render={({ field }) => (
              <SwitchInput
                {...field}
                label="Create first payment immediately?"
                checked={field.value || false}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Hr />
        </FormLayout.Column>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="notes"
            render={({ field }) => <TextAreaInput label="Notes" placeholder="Enter notes" {...field} />}
          />
        </FormLayout.Column>
      </FormLayout>
    </form>
  );
};
