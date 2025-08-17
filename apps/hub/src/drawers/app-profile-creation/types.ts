export interface AppProfileCreationFormData {
  name: string;
  profileType: 'user' | 'group';
  selectedId: number;
}

export interface ProfileOption {
  id: number;
  name: string;
  type: 'user' | 'group';
}
