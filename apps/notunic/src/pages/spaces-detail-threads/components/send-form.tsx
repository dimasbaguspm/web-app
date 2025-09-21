import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { Button, ButtonIcon, ButtonMenu, FormLayout, Icon, PageLayout, TextAreaInput } from '@dimasbaguspm/versaur';
import { ChevronDownIcon, SendIcon } from 'lucide-react';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SendSpaceMessageForm } from '../types';

interface SendFormProps {
  form: UseFormReturn<SendSpaceMessageForm>;
  handleFormSubmit: (data: SendSpaceMessageForm) => Promise<void>;
}

export const SendForm: FC<SendFormProps> = ({ handleFormSubmit, form }) => {
  const { isMobile, isTablet } = useWindowResize();

  return (
    <PageLayout
      type={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
      className="fixed bottom-0 bg-background left-1/2 -translate-x-1/2 pb-4"
    >
      <div className="px-4 pt-4 sm:px-6 border-t border-border">
        <div className="mb-4">
          <ButtonMenu
            label={
              <>
                <Icon as={ChevronDownIcon} size="sm" color="inherit" />
                Notes
              </>
            }
            variant="outline"
          >
            <ButtonMenu.Item active>Notes</ButtonMenu.Item>
            <ButtonMenu.Item>Feedback</ButtonMenu.Item>
            <ButtonMenu.Item>Question</ButtonMenu.Item>
            <ButtonMenu.Item>Annoucement</ButtonMenu.Item>
          </ButtonMenu>
        </div>

        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FormLayout className="grid-cols-20">
            <FormLayout.Column className="col-span-18">
              <TextAreaInput
                {...form.register('message')}
                autoComplete="off"
                placeholder="Type your message"
                fieldSizing="content"
                rows={3}
              />
            </FormLayout.Column>
            <FormLayout.Column className="col-span-2 ml-auto">
              {!isMobile ? (
                <Button variant="primary" type="submit">
                  Send
                  <Icon as={SendIcon} size="sm" color="inherit" />
                </Button>
              ) : (
                <ButtonIcon
                  variant="primary"
                  shape="circle"
                  size="lg"
                  aria-label="Send message"
                  as={SendIcon}
                  // @ts-expect-error versaur ButtonIcon missing type prop
                  type="submit"
                />
              )}
            </FormLayout.Column>
          </FormLayout>
        </form>
      </div>
    </PageLayout>
  );
};
