import { ButtonIcon, TextAreaInput } from '@dimasbaguspm/versaur';
import { SendIcon } from 'lucide-react';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface ReplyBarProps {
  isReplying?: boolean;
}

export const ReplyBar: FC<ReplyBarProps> = ({ isReplying }) => {
  const { control } = useFormContext<{ content: string }>();

  return (
    <div className="flex items-end gap-3 w-full">
      <div className="flex-1">
        <Controller
          name="content"
          control={control}
          render={({ field }) => {
            return <TextAreaInput {...field} placeholder={isReplying ? 'Write reply' : 'Add a comment'} row={1} />;
          }}
        />
      </div>
      <div>
        <ButtonIcon
          as={SendIcon}
          variant="primary"
          aria-label="Send message"
          shape="circle"
          size="lg"
          /** @ts-expect-error know issue with types */
          type="submit"
        />
      </div>
    </div>
  );
};
