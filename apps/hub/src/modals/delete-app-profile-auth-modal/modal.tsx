import { useApiHiDeleteAppProfileAuth, useApiHiVerifyAppProfileAuthPin } from '@dimasbaguspm/hooks/use-api';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { FormLayout, Modal, PinField, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DeleteAppProfileAuthFormSchema } from './types';

interface DeleteAppProfileAuthModalProps {
  appProfileId: number;
}

export const DeleteAppProfileAuthModal: FC<DeleteAppProfileAuthModalProps> = ({ appProfileId }) => {
  const { closeModal } = useModalRoute();
  const { showSnack } = useSnackbars();

  const { control, handleSubmit } = useForm<DeleteAppProfileAuthFormSchema>();
  const [deleteAppProfile] = useApiHiDeleteAppProfileAuth();
  const [verifyAppProfile] = useApiHiVerifyAppProfileAuthPin();

  const handleOnSubmit = async (data: DeleteAppProfileAuthFormSchema) => {
    const resp = await verifyAppProfile({
      pin: data.pin,
    });

    if (!resp.verified) {
      showSnack('danger', 'Pin is incorrect');
      return;
    }

    await deleteAppProfile({
      id: appProfileId,
    });
    showSnack('success', 'PIN authentication is successfully deleted');
    closeModal();
  };

  return (
    <>
      <Modal.Header>Verify PIN</Modal.Header>

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
                render={({ field, fieldState }) => <PinField {...field} secure error={fieldState.error?.message} />}
              />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Modal.Body>
      <Modal.Footer>{null}</Modal.Footer>
    </>
  );
};
