export interface NewAppProfileFormSchema {
  appId: number;
  name: string;
  type: 'personal' | 'group';
  relatedId: number;
}
