import { ButtonIcon, TextAreaInput } from '@dimasbaguspm/versaur';
import { SendIcon } from 'lucide-react';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CommentCategoryFiltersControl } from '../../../components/comment-category-filter-control';
import { useCommentCategoryFilter } from '../../../hooks/use-comment-category-filter';
import { DetailThreadFormSchema } from '../types';

export interface ReplyBarProps {
  isReplying?: boolean;
}

export const ReplyBar: FC<ReplyBarProps> = ({ isReplying }) => {
  const { control, formState } = useFormContext<DetailThreadFormSchema>();

  const commentCategoryFilter = useCommentCategoryFilter({ adapter: 'state' });

  return (
    <div>
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <CommentCategoryFiltersControl
            config={commentCategoryFilter}
            hideMultiSelect
            singleSelectValue={field.value?.[0]}
            onSingleSelectChange={(categoryId) => {
              field.onChange(categoryId ? [categoryId] : []);
            }}
          />
        )}
      />

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
            busy={formState.isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};
