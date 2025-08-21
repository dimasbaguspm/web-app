import { GroupModel, UserModel } from '@dimasbaguspm/interfaces';
import {
  FormLayout,
  RadioInput,
  SelectInput,
  TextInput,
} from '@dimasbaguspm/versaur';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import type { AppProfileCreationFormData, ProfileOption } from './types';

interface AppProfileCreationFormProps {
  user: UserModel;
  groups: GroupModel[];
}

export const AppProfileCreationForm: FC<AppProfileCreationFormProps> = ({
  user,
  groups,
}) => {
  const { register, watch, setValue, formState } =
    useFormContext<AppProfileCreationFormData>();

  const [profileType] = watch(['profileType', 'selectedId']);
  const hasGroups = Boolean(groups.length);

  const profileOptions: ProfileOption[] = useMemo(() => {
    const options: ProfileOption[] = [];

    if (user) {
      options.push({
        id: user.id,
        name: `${user.name} (Personal)`,
        type: 'user',
      });
    }

    // Add group options
    if (groups) {
      groups.forEach((group) => {
        options.push({
          id: group.id,
          name: group.name,
          type: 'group',
        });
      });
    }

    return options.filter((option) => option.type === profileType);
  }, [user, groups, profileType]);

  return (
    <FormLayout>
      <FormLayout.Column span={12}>
        <TextInput
          label="Name"
          {...register('name', {
            required: 'Name is required',
          })}
          autoFocus
          error={formState.errors.name?.message}
        />
      </FormLayout.Column>
      {hasGroups && (
        <>
          <FormLayout.Column span={12}>
            <RadioInput
              label="Type"
              name="profileType"
              value={profileType}
              error={formState.errors.profileType?.message}
              onChange={(e) => {
                setValue(
                  e.target.name as 'profileType',
                  e.target.value as 'user' | 'group',
                  {
                    shouldDirty: true,
                  },
                );
              }}
            >
              <RadioInput.Option
                value="user"
                defaultChecked={profileType === 'user'}
              >
                Personal Profile
              </RadioInput.Option>
              <RadioInput.Option
                value="group"
                defaultChecked={profileType === 'group'}
              >
                Group Profile
              </RadioInput.Option>
            </RadioInput>
          </FormLayout.Column>
          <FormLayout.Column span={12}>
            <SelectInput
              {...register('selectedId')}
              label={`Select ${profileType === 'user' ? 'User' : 'Group'}`}
              error={formState.errors.selectedId?.message}
            >
              {profileOptions.map((option) => (
                <option key={option.id} value={+option.id}>
                  {option.name}
                </option>
              ))}
            </SelectInput>
          </FormLayout.Column>
        </>
      )}
    </FormLayout>
  );
};
