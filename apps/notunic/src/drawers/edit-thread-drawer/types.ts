export interface EditThreadFormSchema {
  spaceId: number;
  threadId: number;
  title: string;
  content: string;
  categoryIds: number[];
}
