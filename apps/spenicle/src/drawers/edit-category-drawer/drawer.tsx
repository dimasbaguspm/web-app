import {
  useApiSpenicleCategoryQuery,
  useApiSpenicleUpdateCategory,
} from '@dimasbaguspm/hooks/use-api';
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

interface Props {
  categoryId: number;
}

export const EditCategoryDrawer: FC<Props> = ({ categoryId }) => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [categoryData] = useApiSpenicleCategoryQuery(categoryId);

  const [updateCategory, , { isPending }] = useApiSpenicleUpdateCategory();

  const { register, handleSubmit, formState, getFieldState } = useForm({
    defaultValues: {
      name: categoryData?.name || '',
      notes: categoryData?.note || '',
    },
  });

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (categoryData == null) return;

    await updateCategory({
      id: categoryId,
      name: data.name,
      note: data.notes,
    });

    showSnack('success', 'Category updated successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form
          id="update-category-form"
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
            form="update-category-form"
            disabled={isPending || !formState.isValid}
          >
            Update
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
