import {
  useApiSpenicleCreateReportsSettings,
  useApiSpenicleReportsSettingsQuery,
  useApiSpenicleUpdateReportsSettings,
} from '@dimasbaguspm/hooks/use-api';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  FormLayout,
  NoResults,
  PageContent,
  PageHeader,
  PageLayout,
  PageLoader,
  SelectInput,
  SwitchInput,
  useSnackbars,
} from '@dimasbaguspm/versaur';
import { InfoIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { SettingsReportsDailyOverviewForm } from './types';

const SettingsReportsDailyOverviewPage = () => {
  const { user } = useAuthProvider();
  const { showSnack } = useSnackbars();

  const [reportsSettings, , { isLoading }] = useApiSpenicleReportsSettingsQuery();
  const [createReports] = useApiSpenicleCreateReportsSettings();
  const [updateReports] = useApiSpenicleUpdateReportsSettings();

  const { control, handleSubmit } = useForm<SettingsReportsDailyOverviewForm>();

  const doesUserHaveReportsSettings = Boolean(reportsSettings);

  const handleOnEnableReports = async () => {
    await createReports({
      email: user.email,
      enabled: true,
      frequency: 'daily',
    });
  };

  const handleOnFormSubmit = async (data: SettingsReportsDailyOverviewForm) => {
    await updateReports({
      enabled: data.enabled,
      frequency: data.frequency,
    });
    showSnack('success', 'Settings updated successfully');
  };
  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader title="Reports" subtitle="Manage your daily overview reports" size="wide" />
      </PageLayout.HeaderRegion>
      <PageLayout.ContentRegion>
        <PageContent size="wide">
          <If condition={isLoading}>
            <PageLoader />
          </If>
          <If condition={!isLoading}>
            {doesUserHaveReportsSettings ? (
              <form onSubmit={handleSubmit(handleOnFormSubmit)}>
                <FormLayout>
                  <FormLayout.Column span={12}>
                    <Controller
                      name="enabled"
                      control={control}
                      defaultValue={reportsSettings?.enabled}
                      render={({ field }) => <SwitchInput label="Enable Daily Overview Reports" {...field} />}
                    />
                  </FormLayout.Column>
                  <FormLayout.Column span={12}>
                    <Controller
                      name="frequency"
                      control={control}
                      defaultValue={reportsSettings?.frequency}
                      render={({ field }) => (
                        <SelectInput label="Report Frequency" {...field}>
                          <SelectInput.Option value="daily">Daily</SelectInput.Option>
                          <SelectInput.Option value="weekly">Weekly</SelectInput.Option>
                          <SelectInput.Option value="monthly">Monthly</SelectInput.Option>
                        </SelectInput>
                      )}
                    />
                  </FormLayout.Column>
                </FormLayout>
                <ButtonGroup alignment="end" className="mt-4">
                  <Button type="submit" variant="primary">
                    Save
                  </Button>
                </ButtonGroup>
              </form>
            ) : (
              <NoResults
                title="Configure Daily Overview Reports"
                subtitle="You have not enabled daily overview reports yet. Enable reports to receive daily summaries of your spending habits directly to your email."
                icon={InfoIcon}
                action={
                  <Button onClick={handleOnEnableReports} variant="outline">
                    Enable Reports
                  </Button>
                }
              />
            )}
          </If>
        </PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

export default SettingsReportsDailyOverviewPage;
