import { ButtonIcon } from '@dimasbaguspm/versaur';
import { SendIcon } from 'lucide-react';
import { FC, useRef, KeyboardEvent, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface ReplyBarProps {
  isReplying?: boolean;
}

export const ReplyBar: FC<ReplyBarProps> = ({ isReplying }) => {
  const { control } = useFormContext<{ content: string }>();
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Allow Enter key for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      return;
    }
  };

  return (
    <div className="flex items-end gap-2 w-full">
      <div className="flex-1">
        <Controller
          name="content"
          control={control}
          render={({ field }) => {
            // Bidirectional sync: update contentEditable when field value changes
            useEffect(() => {
              if (contentEditableRef.current && contentEditableRef.current.innerText !== field.value) {
                contentEditableRef.current.innerText = field.value || '';
              }
            }, [field.value]);

            return (
              <div
                ref={(el) => {
                  contentEditableRef.current = el;
                }}
                contentEditable
                onInput={(e) => {
                  const text = e.currentTarget.innerText;
                  field.onChange(text);
                }}
                onKeyDown={handleKeyDown}
                role="textbox"
                aria-label={isReplying ? 'Write reply' : 'Add a comment'}
                aria-multiline="true"
                className="min-h-[36px] max-h-[120px] overflow-y-auto block w-full rounded-md border bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-50 border-primary/30 text-foreground focus:border-primary focus:ring-primary/20 px-3 py-1"
                data-placeholder={isReplying ? 'Write reply' : 'Add a comment'}
                suppressContentEditableWarning
              />
            );
          }}
        />
      </div>
      <div className="flex-shrink-0">
        <ButtonIcon
          as={SendIcon}
          variant="primary"
          aria-label="Send message"
          /** @ts-expect-error know issue with types */
          type="submit"
        />
      </div>
    </div>
  );
};
