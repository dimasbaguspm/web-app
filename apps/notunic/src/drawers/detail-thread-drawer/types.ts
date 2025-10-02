export enum DetailThreadDrawerMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export interface DetailThreadFormSchema {
  content: string;
  commentId?: number;
  mode: DetailThreadDrawerMode;
}
