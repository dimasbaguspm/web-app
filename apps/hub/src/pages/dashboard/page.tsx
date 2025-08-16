import { useApiHiAppsPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { Text } from '@dimasbaguspm/versaur';
import { FC } from 'react';

const DashboardPage: FC = () => {
  const [apps] = useApiHiAppsPaginatedQuery({});

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <Text as="h2" style={{ marginBottom: '20px' }}>
        Welcome to the Dashboard
      </Text>
      <Text as="h3" style={{ marginBottom: '16px' }}>
        Your Apps ({apps?.totalItems || 0})
      </Text>

      {apps?.items.length ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {apps.items.map((app) => (
            <div
              key={app.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f8fafc',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <Text
                  as="h4"
                  style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}
                >
                  {app.name}
                </Text>
              </div>

              {app.description && (
                <Text as="p" style={{ margin: '8px 0', color: '#64748b' }}>
                  {app.description}
                </Text>
              )}

              {app.url && (
                <div style={{ marginTop: '12px' }}>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    Visit App →
                  </a>
                </div>
              )}

              <div
                style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: '#94a3b8',
                }}
              >
                Created: {new Date(app.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#64748b',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <Text as="p">
            No apps found. Create your first app to get started!
          </Text>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
