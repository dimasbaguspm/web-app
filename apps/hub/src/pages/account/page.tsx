import { Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

const AccountPage: FC = () => {
  return (
    <div className="p-4">
      <Text as="h1" fontSize="3xl" fontWeight="bold" color="black">
        Account
      </Text>
      <Text as="p" color="gray" className="mb-4">
        Manage your account settings and preferences.
      </Text>
    </div>
  );
};

export default AccountPage;
