import { useApiNotunicSpaceQuery, useApiNotunicUpdateSpace } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { NewSpaceForm } from './form';
import { formatToFormValue, formatToPayload } from './helpers';
import { EditSpaceFormSchema } from './types';

interface EditSpaceDrawerProps {
  spaceId: number;
}

export const EditSpaceDrawer: FC<EditSpaceDrawerProps> = ({ spaceId }) => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [space, , { isLoading: isLoadingSpace }] = useApiNotunicSpaceQuery(spaceId);
  const [editSpace, , { isPending: isPendingEditSpace }] = useApiNotunicUpdateSpace();

  const form = useForm<EditSpaceFormSchema>({
    defaultValues: formatToFormValue(space),
  });

  const handleOnValidSubmit: SubmitHandler<EditSpaceFormSchema> = async (data) => {
    await editSpace(formatToPayload(spaceId, data));
    showSnack('success', 'Space updated successfully');
    closeDrawer();
  };

  useEffect(() => {
    if (space) {
      form.reset(formatToFormValue(space));
    }
  }, [space, formatToFormValue]);

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit Space</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoadingSpace}>
          <PageLoader />
        </If>
        <If condition={[!isLoadingSpace, space]}>
          <form id="edit-space-form" onSubmit={form.handleSubmit(handleOnValidSubmit)}>
            <FormProvider {...form}>
              <NewSpaceForm />
            </FormProvider>
          </form>
        </If>
        <If condition={[!isLoadingSpace, !space]}>
          <NoResults
            icon={SearchXIcon}
            title="Space not found"
            subtitle="The space you are looking for does not exist"
          />
        </If>
      </Drawer.Body>
      <If condition={[!isLoadingSpace, space]}>
        <Drawer.Footer>
          <ButtonGroup alignment="end" fluid={!isDesktop}>
            <Button variant="ghost" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button type="submit" form="edit-space-form" disabled={isPendingEditSpace || !form.formState.isValid}>
              Update
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};
