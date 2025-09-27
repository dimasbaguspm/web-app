import { useApiNotunicThreadGroupTagsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { ThreadGroupModel } from '@dimasbaguspm/interfaces/notunic-api';
import { ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { ChevronDownIcon } from 'lucide-react';
import { FC, useMemo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { SendSpaceMessageForm } from '../types';

interface ThreadGroupMenuProps {
  threadGroup: ThreadGroupModel;
  disabled?: boolean;
}

export const ThreadGroupMenu: FC<ThreadGroupMenuProps> = ({ threadGroup, disabled = false }) => {
  const { watch, setValue } = useFormContext<SendSpaceMessageForm>();

  const selectedTags = watch('tags') ?? [];

  const [threadGroupTags, , { isLoading }] = useApiNotunicThreadGroupTagsInfiniteQuery({
    threadGroupId: [threadGroup?.id],
  });

  const groupTagIds = useMemo(() => threadGroupTags?.map((tag) => tag.id) ?? [], [threadGroupTags]);

  const selectedTagInGroup = useMemo(
    () => threadGroupTags?.find((tag) => selectedTags.includes(tag.id)),
    [threadGroupTags, selectedTags],
  );

  const handleTagSelection = useCallback(
    (tagId: number) => {
      if (disabled || selectedTags.includes(tagId)) return;

      // Remove all tags from the same group first, then add the selected tag
      const filteredTags = selectedTags.filter((id) => !groupTagIds.includes(id));
      setValue('tags', [...filteredTags, tagId]);
    },
    [disabled, selectedTags, groupTagIds, setValue],
  );

  if (isLoading) {
    return (
      <ButtonMenu
        label={
          <>
            <Icon as={ChevronDownIcon} size="sm" color="inherit" />
            Loading...
          </>
        }
        variant="outline"
        disabled
      >
        <ButtonMenu.Item disabled>Loading tags...</ButtonMenu.Item>
      </ButtonMenu>
    );
  }

  if (!threadGroupTags?.length) {
    return (
      <ButtonMenu
        label={
          <>
            <Icon as={ChevronDownIcon} size="sm" color="inherit" />
            No tags
          </>
        }
        variant="outline"
        disabled
      >
        <ButtonMenu.Item disabled>No tags available</ButtonMenu.Item>
      </ButtonMenu>
    );
  }

  return (
    <ButtonMenu
      label={
        <>
          <Icon as={ChevronDownIcon} size="sm" color="inherit" />
          {selectedTagInGroup ? selectedTagInGroup.name : `Select ${threadGroup.name}`}
        </>
      }
      variant="outline"
      size="sm"
      disabled={disabled}
    >
      {threadGroupTags.map((tag) => (
        <ButtonMenu.Item
          key={tag.id}
          active={selectedTagInGroup?.id === tag.id}
          onClick={() => handleTagSelection(tag.id)}
          disabled={disabled}
        >
          {tag.name}
        </ButtonMenu.Item>
      ))}
    </ButtonMenu>
  );
};
