import { useApiNotunicCreateThread, useApiNotunicThreadsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { PortalContainer } from '@dimasbaguspm/providers/portal-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Hr, NoResults, PageContent, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
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
  const [threads, , { isInitialFetching }] = useApiNotunicThreadsInfiniteQuery({
    spaceId: [spaceId],
    sortBy: 'createdAt',
    sortOrder: 'asc',
  });

  const [createThread, , { isPending: isCreatePending }] = useApiNotunicCreateThread();

  const form = useForm<SendSpaceMessageForm>();

  const handleFormSubmit = async (data: SendSpaceMessageForm) => {
    if (isCreatePending) return;

    await createThread({
      spaceId,
      userId: user.id,
      content: data.message,
    });

    form.reset();
  };

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
          <ul className={threads.length > 5 ? 'pb-48' : ''}>
            {threads.map((thread, index) => {
              const isLast = index === threads.length - 1;
              return (
                <li key={thread.id}>
                  <ThreadCard thread={thread} as="div" />
                  {!isLast && <Hr />}
                </li>
              );
            })}
          </ul>
        </If>
      </PageContent>
      <PortalContainer id={PORTAL_ROUTES.BOTTOM_BAR}>
        <SendForm form={form} handleFormSubmit={handleFormSubmit} />
      </PortalContainer>
    </>
  );
};

export default function () {
  const { id } = useParams<{ id: string }>();

  return <SpacesDetailThreadsPage spaceId={Number(id)} />;
}
