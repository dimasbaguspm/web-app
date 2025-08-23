import { useApiSpenicleCreateCategory } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  Button,
  ButtonGroup,
  Drawer,
  FormLayout,
  TextAreaInput,
  TextInput,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

export const NewCategoryDrawer: FC = () => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [createCategory, , { isPending }] = useApiSpenicleCreateCategory();
  const { register, handleSubmit, formState, getFieldState } = useForm();

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await createCategory({
      name: data.name,
      note: data.notes,
    });
    showSnack('success', 'Category created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Create Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form
          id="new-category-form"
          onSubmit={handleSubmit(handleOnValidSubmit)}
        >
          <FormLayout>
            <FormLayout.Column span={12}>
              <TextInput
                label="Name"
                placeholder="Enter category name"
                {...register('name', {
                  required: 'Name is required',
                })}
                error={getFieldState('name', formState).error?.message}
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
        <ButtonGroup alignment="end">
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-category-form"
            disabled={isPending || !formState.isValid}
          >
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
