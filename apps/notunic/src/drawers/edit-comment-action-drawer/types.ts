export interface EditCommentActionFormSchema {
  commentActionId: number;
  dueDate: string | undefined;
  followedUpDate: string;
  followedUpNote: string;
}
