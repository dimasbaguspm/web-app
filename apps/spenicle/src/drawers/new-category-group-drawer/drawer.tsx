import { useApiSpenicleCreateCategoryGroup } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, FormLayout, TextInput, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

export const NewCategoryGroupDrawer: FC = () => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [createCategoryGroup, , { isPending }] = useApiSpenicleCreateCategoryGroup();
  const { register, handleSubmit, formState, getFieldState } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await createCategoryGroup({
      name: data.name,
    });
    showSnack('success', 'Category group created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Create Category Group</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="new-category-group-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <TextInput
                label="Name"
                placeholder="Enter category group name"
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
          <Button type="submit" form="new-category-group-form" disabled={isPending || !formState.isValid}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
