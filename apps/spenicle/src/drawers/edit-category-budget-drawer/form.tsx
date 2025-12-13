import { CategoryBudgetModel } from '@dimasbaguspm/interfaces';
import { ChipSingleInput, FormLayout, Icon, PriceInput, TextAreaInput } from '@dimasbaguspm/versaur';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EditCategoryBudgetFormValues } from './types';

interface EditCategoryBudgetFormProps {
  categoryBudget: CategoryBudgetModel;
  onSubmit: (data: EditCategoryBudgetFormValues) => void;
}

export const EditCategoryBudgetForm: FC<EditCategoryBudgetFormProps> = ({ categoryBudget, onSubmit }) => {
  const { control, handleSubmit } = useForm<EditCategoryBudgetFormValues>({
    defaultValues: {
      type: categoryBudget.type,
      maxAmount: categoryBudget.maxAmount.toString(),
      frequency: categoryBudget.frequency,
      notes: categoryBudget.note || '',
    },
  });

  return (
    <form id="edit-category-budget-form" onSubmit={handleSubmit(onSubmit)}>
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
