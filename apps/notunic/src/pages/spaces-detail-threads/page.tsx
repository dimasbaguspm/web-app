import { useApiNotunicCreateThread, useApiNotunicThreadsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { PortalContainer } from '@dimasbaguspm/providers/portal-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Hr, NoResults, PageContent, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { ThreadCard } from '../../components/thread-card';
import { PORTAL_ROUTES } from '../../constants/portal-routes';

import { SendForm } from './components/send-form';
import { SendSpaceMessageForm } from './types';

interface SpacesDetailThreadsPageProps {
  spaceId: number;
}

const SpacesDetailThreadsPage: FC<SpacesDetailThreadsPageProps> = ({ spaceId }) => {
  const { user } = useAuthProvider();
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitiallyScrolled = useRef<boolean>(false);
  const [threads, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicThreadsInfiniteQuery({
      spaceId: [spaceId],
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

  const [createThread, , { isPending: isCreatePending }] = useApiNotunicCreateThread();

  const form = useForm<SendSpaceMessageForm>();

  // Auto-scroll to bottom only when initial fetch is done (not for pagination)
  useEffect(() => {
    if (!isInitialFetching && threads.length > 0 && !hasInitiallyScrolled.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' });
      hasInitiallyScrolled.current = true;
    }
  }, [isInitialFetching, threads.length]);

  const handleFormSubmit = async (data: SendSpaceMessageForm) => {
    if (isCreatePending) return;

    await createThread({
      spaceId,
      userId: user.id,
      content: data.message,
      tagIds: data.tags,
    });

    form.reset();

    // Scroll to bottom after sending a message
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' });
    }, 100);
  };

  const reverseThreads = [...threads].reverse();

  return (
    <>
      <PageContent>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>
        <If condition={[!isInitialFetching, !threads.length]}>
          <NoResults
            icon={SearchXIcon}
            title="No threads yet"
            subtitle="There are no threads in this space. Start a new thread to get the conversation going!"
          />
        </If>
        <If condition={[!isInitialFetching, !!threads.length]}>
          {hasNextPage && (
            <ButtonGroup hasMargin alignment="center">
              <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Load more
              </Button>
            </ButtonGroup>
          )}
          <ul className={reverseThreads.length > 3 ? 'pb-48' : ''}>
            {reverseThreads.map((thread, index) => {
              const isLast = index === reverseThreads.length - 1;
              return (
                <li key={thread.id}>
                  <ThreadCard thread={thread} as="div" />
                  {!isLast && <Hr />}
                </li>
              );
            })}
          </ul>
          <div ref={bottomRef} />
        </If>
      </PageContent>
      <FormProvider {...form}>
        <PortalContainer id={PORTAL_ROUTES.BOTTOM_BAR}>
          <SendForm form={form} handleFormSubmit={handleFormSubmit} />
        </PortalContainer>
      </FormProvider>
    </>
  );
};

export default function () {
  const { id } = useParams<{ id: string }>();

  return <SpacesDetailThreadsPage spaceId={Number(id)} />;
}
