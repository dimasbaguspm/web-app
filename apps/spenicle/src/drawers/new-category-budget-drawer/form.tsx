import { CategoryModel } from '@dimasbaguspm/interfaces';
import { ChipSingleInput, FormLayout, Icon, PriceInput, TextAreaInput } from '@dimasbaguspm/versaur';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { NewCategoryBudgetFormValues } from './types';

interface NewCategoryBudgetFormProps {
  category: CategoryModel;
  onSubmit: (data: NewCategoryBudgetFormValues) => void;
}

export const NewCategoryBudgetForm: FC<NewCategoryBudgetFormProps> = ({ category, onSubmit }) => {
  const { control, handleSubmit } = useForm<NewCategoryBudgetFormValues>({
    defaultValues: {
      type: ['expense', 'income'].includes(category?.type as string)
        ? (category?.type as 'expense' | 'income')
        : 'expense',
      maxAmount: '0',
      frequency: 'daily',
      notes: '',
    },
  });

  return (
    <form id="new-category-budget-form" onSubmit={handleSubmit(onSubmit)}>
      <FormLayout>
        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="type"
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
            name="maxAmount"
            render={({ field }) => <PriceInput {...field} label="Amount" />}
          />
        </FormLayout.Column>

        <FormLayout.Column span={12}>
          <Controller
            control={control}
            name="frequency"
            render={({ field }) => (
              <ChipSingleInput {...field} label="Frequency">
                <ChipSingleInput.Option value="daily">Daily</ChipSingleInput.Option>
                <ChipSingleInput.Option value="weekly">Weekly</ChipSingleInput.Option>
                <ChipSingleInput.Option value="monthly">Monthly</ChipSingleInput.Option>
                <ChipSingleInput.Option value="yearly">Yearly</ChipSingleInput.Option>
              </ChipSingleInput>
            )}
          />
        </FormLayout.Column>

        <FormLayout.Column span={12}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => <TextAreaInput label="Notes" row={6} {...field} />}
          />
        </FormLayout.Column>
      </FormLayout>
    </form>
  );
};
