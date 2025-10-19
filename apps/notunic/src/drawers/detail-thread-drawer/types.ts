export enum DetailThreadDrawerMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export interface DetailThreadFormSchema {
  content: string;
  categoryId: number[];
  commentId?: number;
  mode: DetailThreadDrawerMode;
}

export enum DetailThreadSubTab {
  Comments = 'comments',
  Actions = 'actions',
}
