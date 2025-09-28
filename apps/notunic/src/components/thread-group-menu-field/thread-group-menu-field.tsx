import { useApiNotunicThreadGroupTagsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { ThreadGroupModel } from '@dimasbaguspm/interfaces/notunic-api';
import { ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { ChevronDownIcon } from 'lucide-react';
import { FC, useMemo, useCallback } from 'react';

interface ThreadGroupMenuProps {
  selectedTags: number[];
  threadGroup: ThreadGroupModel;
  onTagSelect: (tags: number[]) => void;
}

export const ThreadGroupMenuField: FC<ThreadGroupMenuProps> = ({ threadGroup, selectedTags = [], onTagSelect }) => {
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
      if (selectedTags.includes(tagId)) return;

      const filteredTags = selectedTags.filter((id) => !groupTagIds.includes(id));

      if (tagId === -1) {
        // Remove all tags from the same group
        onTagSelect?.([...filteredTags]);
        return;
      }

      onTagSelect?.([...filteredTags, tagId]);
    },
    [selectedTags, groupTagIds, onTagSelect],
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
    >
      <ButtonMenu.Item onClick={() => handleTagSelection(-1)}>Select {threadGroup.name}</ButtonMenu.Item>
      {threadGroupTags.map((tag) => (
        <ButtonMenu.Item
          key={tag.id}
          active={selectedTagInGroup?.id === tag.id}
          onClick={() => handleTagSelection(tag.id)}
        >
          {tag.name}
        </ButtonMenu.Item>
      ))}
    </ButtonMenu>
  );
};
