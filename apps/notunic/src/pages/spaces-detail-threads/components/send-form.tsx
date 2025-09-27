import { useApiNotunicThreadGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonIcon, FormLayout, Icon, PageLayout, TextAreaInput } from '@dimasbaguspm/versaur';
import { SendIcon } from 'lucide-react';
import { FC, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SendSpaceMessageForm } from '../types';

import { ThreadGroupMenu } from './thread-group-menu';

interface SendFormProps {
  form: UseFormReturn<SendSpaceMessageForm>;
  handleFormSubmit: (data: SendSpaceMessageForm) => Promise<void>;
  isSubmitting?: boolean;
}

export const SendForm: FC<SendFormProps> = ({ handleFormSubmit, form, isSubmitting = false }) => {
  const { isMobile, isTablet } = useWindowResize();
  const [threadGroups, , { isLoading: isLoadingThreadGroups }] = useApiNotunicThreadGroupsInfiniteQuery({});

  const { watch, formState } = form;
  const message = watch('message');

  const isFormValid = useMemo(() => {
    return message?.trim().length > 0 && !formState.isSubmitting;
  }, [message, formState.isSubmitting]);

  const layoutType = useMemo(() => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }, [isMobile, isTablet]);

  return (
    <PageLayout type={layoutType} className="fixed bottom-0 bg-background left-1/2 -translate-x-1/2 pb-4 ">
      <div className="px-4 pt-4 sm:px-6 border-t border-border">
        <If condition={!isLoadingThreadGroups && threadGroups?.length > 0}>
          <div className="mb-4" role="group" aria-label="Thread group selection">
            <div className="flex gap-2 flex-wrap">
              {threadGroups?.map((threadGroup) => (
                <ThreadGroupMenu key={threadGroup.id} threadGroupId={threadGroup.id} disabled={isSubmitting} />
              ))}
            </div>
          </div>
        </If>

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FormLayout className="grid-cols-20">
            <FormLayout.Column className="col-span-18">
              <TextAreaInput
                {...form.register('message', {
                  required: 'Message is required',
                  validate: (value) => value?.trim().length > 0 || 'Message cannot be empty',
                })}
                autoComplete="off"
                placeholder="Type your message..."
                fieldSizing="content"
                rows={3}
                maxLength={2000}
                disabled={isSubmitting}
                error={formState.errors.message?.message}
              />
            </FormLayout.Column>

            <FormLayout.Column className="col-span-2 flex items-end">
              {!isMobile && !isTablet ? (
                <Button variant="primary" type="submit" disabled={!isFormValid || isSubmitting}>
                  Send
                  <Icon as={SendIcon} size="sm" color="inherit" />
                </Button>
              ) : (
                <ButtonIcon
                  variant="primary"
                  shape="circle"
                  size="lg"
                  aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
                  as={SendIcon}
                  disabled={!isFormValid || isSubmitting}
                  onClick={form.handleSubmit(handleFormSubmit)}
                />
              )}
            </FormLayout.Column>
          </FormLayout>
        </form>
      </div>
    </PageLayout>
  );
};
