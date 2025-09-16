import { useApiHiVerifyAppProfileAuthPin } from '@dimasbaguspm/hooks/use-api';
import { Button, ButtonGroup, FormLayout, Modal, TextInput } from '@dimasbaguspm/versaur';
import { noop } from 'lodash';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ProfileSwitcherFormSchema {
  pin: string;
}

interface ProfileVerifierModalProps {
  onSubmit?: () => void;
}

export const ProfileVerifierModal: FC<ProfileVerifierModalProps> = ({ onSubmit }) => {
  const [pinVerifying, , { isPending }] = useApiHiVerifyAppProfileAuthPin();

  const { control, handleSubmit } = useForm<ProfileSwitcherFormSchema>();

  const handleOnSubmit = async (data: ProfileSwitcherFormSchema) => {
    await pinVerifying({
      pin: data.pin,
    });
    await onSubmit?.();
  };

  return (
    <Modal isOpen onClose={noop} disableEscapeKeyDown disableOverlayClickToClose>
      <Modal.Header>Verify Ownership</Modal.Header>

      <Modal.Body className="max-h-[56dvh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleOnSubmit)} id="profile-verifier-form">
          <FormLayout>
            <FormLayout.Column span={12}>
              <Controller
                control={control}
                name="pin"
                rules={{
                  validate: (value) => {
                    if (!value) {
                      return 'Pin is required';
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    type="password"
                    label="Pin"
                    inputMode="numeric"
                    placeholder="Enter your pin"
                    autoFocus
                    autoComplete="on"
                    error={fieldState.error?.message}
                  />
                )}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <ButtonGroup alignment="end" fluid>
          <Button type="submit" form="profile-verifier-form" disabled={isPending}>
            Submit
          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};
