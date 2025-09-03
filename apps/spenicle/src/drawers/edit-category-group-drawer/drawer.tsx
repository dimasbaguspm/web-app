import { useApiSpenicleCategoryGroupQuery, useApiSpenicleUpdateCategoryGroup } from '@dimasbaguspm/hooks/use-api';
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
  categoryGroupId: number;
}

export const EditCategoryGroupDrawer: FC<Props> = ({ categoryGroupId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [categoryGroup, , { isPending: isLoadingCategoryGroup }] = useApiSpenicleCategoryGroupQuery(categoryGroupId);
  const [updateCategoryGroup, , { isPending }] = useApiSpenicleUpdateCategoryGroup();

  const { register, handleSubmit, formState, getFieldState, reset } = useForm({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (categoryGroup) {
      reset({
        name: categoryGroup.name,
      });
    }
  }, [categoryGroup, reset]);

  const handleOnValidSubmit: SubmitHandler<FieldValues> = async (data) => {
    await updateCategoryGroup({
      id: categoryGroupId,
      name: data.name,
    });
    showSnack('success', 'Category group updated successfully');
    closeDrawer();
  };

  if (isLoadingCategoryGroup) {
    return (
      <>
        <Drawer.Header>
          <Drawer.Title>Edit Category Group</Drawer.Title>
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
        <Drawer.Title>Edit Category Group</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <form id="update-category-group-form" onSubmit={handleSubmit(handleOnValidSubmit)}>
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
          <Button type="submit" form="update-category-group-form" disabled={isPending || !formState.isValid}>
            Update Group
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
