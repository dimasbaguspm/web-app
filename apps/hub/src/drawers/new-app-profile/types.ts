export interface NewAppProfileFormSchema {
  name: string;
  type: 'personal' | 'group';
  relatedId: number;
}
