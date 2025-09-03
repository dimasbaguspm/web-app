import { useApiSpenicleCreateAccountGroup } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

export const NewAccountGroupDrawer: FC = () => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [createAccountGroup, , { isPending }] = useApiSpenicleCreateAccountGroup();
  const { register, handleSubmit, formState, getFieldState } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await createAccountGroup({
      name: data.name,
    });
    showSnack('success', 'Account group created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Create Account Group</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-account-group-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <TextInput
                label="Name"
                placeholder="Enter account group name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                error={getFieldState('name', formState).error?.message}
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
          <Button type="submit" form="new-account-group-form" disabled={isPending || !formState.isValid}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
