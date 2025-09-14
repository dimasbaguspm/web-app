import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { NoResults } from '@dimasbaguspm/versaur';
import { ShieldOffIcon } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface AdminGuardProps {
  children: ReactNode;
  showWarning?: boolean;
}

// similar like feature-flag but for admin role
export const AdminGuard: FC<AdminGuardProps> = ({ children, showWarning }) => {
  const { isAdmin } = useAuthProvider();

  if (!isAdmin) {
    if (showWarning) {
      return (
        <NoResults
          icon={ShieldOffIcon}
          title="Access Denied"
          subtitle="You do not have permission to perform this action."
        />
      );
    }

    return null;
  }

  return children;
};
