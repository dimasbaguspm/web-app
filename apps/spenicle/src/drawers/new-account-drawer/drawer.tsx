import { useApiSpenicleCreateAccount } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  Button,
  ButtonGroup,
  ChipSingleInput,
  Drawer,
  FormLayout,
  Icon,
  TextAreaInput,
  TextInput,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { FC } from 'react';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';

export const NewAccountDrawer: FC = () => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [createAccount, , { isPending }] = useApiSpenicleCreateAccount();
  const { register, handleSubmit, control, formState, getFieldState } = useForm({
    defaultValues: {
      name: '',
      type: 'income',
      notes: '',
    },
  });

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await createAccount({
      name: data.name,
      type: data.type,
      note: data.notes,
      amount: 0,
    });
    showSnack('success', 'Account created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Create Account</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-account-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <TextInput
                label="Name"
                placeholder="Enter account name"
                {...register('name', {
                  required: 'Name is required',
                })}
                error={getFieldState('name', formState).error?.message}
              />
            </FormLayout.Column>
            <FormLayout.Column span={12}>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Type is required' }}
                render={({ field, fieldState }) => (
                  <ChipSingleInput {...field} label="Type" error={fieldState.error?.message}>
                    <ChipSingleInput.Option value="income">
                      <Icon as={TrendingUpIcon} color="inherit" size="sm" />
                      Income
                    </ChipSingleInput.Option>
                    <ChipSingleInput.Option value="expense">
                      <Icon as={TrendingDownIcon} color="inherit" size="sm" />
                      Expense
                    </ChipSingleInput.Option>
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
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button type="submit" form="new-account-form" disabled={isPending || !formState.isValid}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
