import {
  useApiSpenicleBackupRequestDownload,
  useApiSpenicleBackupRequestsInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { BackupRequestModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleBackupRequest } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonIcon,
  Card,
  Hr,
  Icon,
  NoResults,
  PageContent,
  PageHeader,
  PageLoader,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import { Download, FolderInputIcon, FolderOutputIcon, SearchXIcon } from 'lucide-react';
import { useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

const SettingsBackupPage = () => {
  const { openDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [downloadFile] = useApiSpenicleBackupRequestDownload();
  const [backupRequest, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleBackupRequestsInfiniteQuery({});

  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleOnDownloadClick = async (data: BackupRequestModel) => {
    try {
      setDownloadingId(data.id);

      const response = await downloadFile({ id: data.id });

      // Create a blob from the response
      const blob = new Blob([response], { type: 'application/octet-stream' });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;

      const filename = `backup-request-${data.id}-${new Date().toISOString().slice(0, 10)}.json.enc`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSnack('success', 'Backup file downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      showSnack('danger', 'Failed to download backup file. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOnCreateBackupClick = () => {
    openDrawer(DRAWER_ROUTES.NEW_BACKUP_REQUEST);
  };

  const handleOnRestoreBackupClick = () => {
    openDrawer(DRAWER_ROUTES.RESTORE_BACKUP_REQUEST);
  };

  return (
    <>
      <PageHeader
        title="Backup History"
        subtitle="View and manage your backup requests"
        actions={
          <ButtonGroup>
            <Button onClick={handleOnRestoreBackupClick} variant="outline">
              <Icon as={FolderInputIcon} size="sm" color="inherit" />
              Restore Backup
            </Button>
            <Button onClick={handleOnCreateBackupClick}>
              <Icon as={FolderOutputIcon} size="sm" color="inherit" />
              Create Backup
            </Button>
          </ButtonGroup>
        }
        mobileActions={
          <ButtonGroup>
            <ButtonIcon onClick={handleOnRestoreBackupClick} as={FolderInputIcon} aria-label="Restore Backup" />
            <ButtonIcon onClick={handleOnCreateBackupClick} as={FolderOutputIcon} aria-label="Create Backup" />
          </ButtonGroup>
        }
      />
      <PageContent>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>

        <If condition={!isInitialFetching && !backupRequest.length}>
          <NoResults
            icon={SearchXIcon}
            title="No backup requests yet"
            subtitle="You haven't created any backup requests. Start by creating a new backup to preserve your data."
          />
        </If>

        <If condition={!isInitialFetching && !!backupRequest.length}>
          <ul className="mb-4">
            {backupRequest.map((item, index) => {
              const { status, variant, dateRange, requestedDate, finishedDate, isReady, isFailed, errorMessage } =
                formatSpenicleBackupRequest(item);

              const isLastItem = index === backupRequest.length - 1;
              return (
                <li key={item.id}>
                  <Card
                    key={item.id}
                    title={dateRange || 'Backup Request'}
                    subtitle={
                      <Card.List>
                        <If condition={isReady}>
                          <Card.ListItem>Requested on {requestedDate || 'Unknown date'}</Card.ListItem>
                          <Card.ListItem>Successfully completed on {finishedDate || 'Unknown date'}</Card.ListItem>
                        </If>
                        <If condition={isFailed && errorMessage}>
                          <Card.ListItem>Failed: {errorMessage}</Card.ListItem>
                        </If>
                        <If condition={!isReady && !isFailed}>
                          <Card.ListItem>Requested on {requestedDate || 'Unknown date'}</Card.ListItem>
                          <Card.ListItem>Processing in progress...</Card.ListItem>
                        </If>
                      </Card.List>
                    }
                    badge={
                      <BadgeGroup>
                        <Badge color={variant}>{status}</Badge>
                      </BadgeGroup>
                    }
                    supplementaryInfo={
                      <ButtonGroup alignment="end">
                        <If condition={isReady}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOnDownloadClick(item)}
                            disabled={downloadingId === item.id}
                          >
                            <Icon as={Download} size="sm" color="inherit" />
                            {downloadingId === item.id ? 'Downloading...' : 'Download'}
                          </Button>
                        </If>
                      </ButtonGroup>
                    }
                  />
                  {!isLastItem && <Hr />}
                </li>
              );
            })}
          </ul>

          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>
      </PageContent>
    </>
  );
};

export default SettingsBackupPage;
