import {
  useApiSpenicleAccountQuery,
  useApiSpenicleUpdateAccount,
} from '@dimasbaguspm/hooks/use-api';
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
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

interface Props {
  accountId: number;
}

export const EditAccountDrawer: FC<Props> = ({ accountId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [accountData] = useApiSpenicleAccountQuery(accountId);

  const [updateAccount, , { isPending }] = useApiSpenicleUpdateAccount();

  const { register, handleSubmit, control, formState, getFieldState } = useForm(
    {
      defaultValues: {
        name: accountData?.name || '',
        type: accountData?.type || '',
        notes: accountData?.note || '',
      },
    },
  );

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (accountData == null) return;

    await updateAccount({
      id: accountId,
      name: data.name,
      type: data.type,
      note: data.notes,
      amount: accountData.amount,
    });

    showSnack('success', 'Account updated successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Account</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form
          id="update-account-form"
          onSubmit={handleSubmit(handleOnValidSubmit)}
        >
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
                  <ChipSingleInput
                    {...field}
                    label="Type"
                    error={fieldState.error?.message}
                  >
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
              <TextAreaInput
                label="Notes"
                fieldSizing="content"
                minRows={4}
                rows={6}
                {...register('notes')}
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
            form="update-account-form"
            disabled={isPending || !formState.isValid}
          >
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
