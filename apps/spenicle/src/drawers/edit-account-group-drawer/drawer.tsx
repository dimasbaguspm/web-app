import { useApiSpenicleAccountGroupQuery, useApiSpenicleUpdateAccountGroup } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  Button,
  ButtonGroup,
  Drawer,
  FormLayout,
  LoadingIndicator,
  TextInput,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import { FC, useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

interface Props {
  accountGroupId: number;
}

export const EditAccountGroupDrawer: FC<Props> = ({ accountGroupId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [accountGroup, , { isPending: isLoadingAccountGroup }] = useApiSpenicleAccountGroupQuery(accountGroupId);
  const [updateAccountGroup, , { isPending }] = useApiSpenicleUpdateAccountGroup();

  const { register, handleSubmit, formState, getFieldState, reset } = useForm({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (accountGroup) {
      reset({
        name: accountGroup.name,
      });
    }
  }, [accountGroup, reset]);

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await updateAccountGroup({
      id: accountGroupId,
      name: data.name,
    });
    showSnack('success', 'Account group updated successfully');
    closeDrawer();
  };

  if (isLoadingAccountGroup) {
    return (
      <>
        <Drawer.Header>
          <Drawer.Title>Edit Account Group</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <div className="flex justify-center py-8">
            <LoadingIndicator size="lg" />
          </div>
        </Drawer.Body>
      </>
    );
  }

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Account Group</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="update-account-group-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
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
          <Button type="submit" form="update-account-group-form" disabled={isPending || !formState.isValid}>
            Update Group
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
