import { useApiNotunicThreadGroupTagsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { ChevronDownIcon } from 'lucide-react';
import { FC, useEffect, useMemo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { SendSpaceMessageForm } from '../types';

interface ThreadGroupMenuProps {
  threadGroupId: number;
  disabled?: boolean;
}

export const ThreadGroupMenu: FC<ThreadGroupMenuProps> = ({ threadGroupId, disabled = false }) => {
  const { watch, setValue } = useFormContext<SendSpaceMessageForm>();

  const selectedTags = watch('tags') ?? [];

  const [threadGroupTags, , { isLoading }] = useApiNotunicThreadGroupTagsInfiniteQuery({
    threadGroupId: [threadGroupId],
  });

  const groupTagIds = useMemo(() => threadGroupTags?.map((tag) => tag.id) ?? [], [threadGroupTags]);

  const selectedTagInGroup = useMemo(
    () => threadGroupTags?.find((tag) => selectedTags.includes(tag.id)),
    [threadGroupTags, selectedTags],
  );

  const hasValidSelection = useMemo(
    () => selectedTags.some((id) => groupTagIds.includes(id)),
    [selectedTags, groupTagIds],
  );

  // Auto-select first tag when no valid selection exists
  useEffect(() => {
    if (!hasValidSelection && threadGroupTags?.length > 0 && !disabled) {
      const firstTag = threadGroupTags[0];
      setValue('tags', [...selectedTags, firstTag.id]);
    }
  }, [hasValidSelection, threadGroupTags, selectedTags, setValue, disabled]);

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
          {selectedTagInGroup ? selectedTagInGroup.name : 'Select tag'}
        </>
      }
      variant="outline"
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
