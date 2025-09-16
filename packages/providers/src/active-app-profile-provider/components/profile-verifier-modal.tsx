import { useApiHiVerifyAppProfileAuthPin } from '@dimasbaguspm/hooks/use-api';
import { FormLayout, Modal, PinField, useSnackbars } from '@dimasbaguspm/versaur';
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
  const [pinVerifying] = useApiHiVerifyAppProfileAuthPin();
  const { showSnack } = useSnackbars();

  const { control, handleSubmit } = useForm<ProfileSwitcherFormSchema>();

  const handleOnSubmit = async (data: ProfileSwitcherFormSchema) => {
    const resp = await pinVerifying({
      pin: data.pin,
    });

    if (!resp.verified) {
      showSnack('danger', 'Pin is incorrect');
      return;
    }

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
                  <PinField {...field} secure error={fieldState.error?.message} autoSubmit />
                )}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Modal.Body>
      <Modal.Footer>{null}</Modal.Footer>
    </Modal>
  );
};
