import { useApiNotunicCreateThread, useApiNotunicThreadGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NewThreadForm } from './form';
import { NewThreadFormSchema } from './types';

interface NewThreadDrawerProps {
  spaceId: number;
}

export const NewThreadDrawer: FC<NewThreadDrawerProps> = ({ spaceId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { user } = useAuthProvider();

  const [threadGroups, , { isLoading: isLoadingThreadGroup }] = useApiNotunicThreadGroupsInfiniteQuery({
    spaceId: [spaceId],
  });

  const [createThread, , { isPending }] = useApiNotunicCreateThread();

  const form = useForm<NewThreadFormSchema>({
    defaultValues: {
      content: '',
      tags: [],
    },
  });

  const handleOnSubmit = async (data: NewThreadFormSchema) => {
    console.log(data);
    // return;
    await createThread({
      spaceId: spaceId,
      userId: user?.id,
      title: data.title,
      content: data.content,
      tagIds: data.tags,
    });
    showSnack('success', 'Thread created successfully');
    closeDrawer();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Thread</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <If condition={[!isLoadingThreadGroup]}>
        <Drawer.Body>
          <form id="edit-thread-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
            <FormProvider {...form}>
              <NewThreadForm threadGroups={threadGroups} />
            </FormProvider>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <ButtonGroup fluid={!isDesktop} alignment="end">
            <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="edit-thread-form" disabled={isPending}>
              Update
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};
