import { operations } from '../../../../types/hi.openapi';

export type SearchUsersModel =
  operations['getUser']['responses']['200']['content']['application/json'];
export type UsersPageModel =
  operations['getUser']['responses']['200']['content']['application/json'];
export type UserModel =
  operations['getUserById']['responses']['200']['content']['application/json'];
export type UpdateUserModel =
  operations['patchUserById']['requestBody']['content']['application/json'] & {
    userId: number;
  };

export type AuthMeModel = {
  user: UserModel;
  tokenPayload: {
    userId: number;
  };
};
