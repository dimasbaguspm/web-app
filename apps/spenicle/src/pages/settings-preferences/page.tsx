import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { Tile, Text, Icon, BadgeGroup, Badge, PageHeader, PageContent } from '@dimasbaguspm/versaur';
import { ChevronRightIcon, InfoIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

import { settingsGroups } from './constants';

const SettingsPreferencesPage = () => {
  const navigate = useNavigate();
  const { isDesktop } = useWindowResize();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <PageHeader title="Preferences" subtitle="Configure settings and streamline your app preferences" />
      <PageContent>
        <div className="space-y-8">
          {settingsGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3">
              <div className="flex items-center gap-3 ">
                <Text as="h3" fontSize="lg" fontWeight="semibold">
                  {group.title}
                </Text>
                <div className="hidden lg:block flex-1">
                  <Text fontSize="sm" color="gray">
                    {group.description}
                  </Text>
                </div>
              </div>

              <Tile className="overflow-hidden p-0">
                <div className="divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer duration-200"
                      onClick={() => handleNavigate(item.path)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-primary-soft group-hover:to-primary-light duration-200">
                          <Icon as={item.icon} color="inherit" className="group-hover:text-primary" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Text fontWeight="semibold">{item.title}</Text>
                            {item.badge && (
                              <BadgeGroup>
                                <Badge shape="rounded" color={item.badge === 'New' ? 'info' : 'success'}>
                                  {item.badge}
                                </Badge>
                              </BadgeGroup>
                            )}
                          </div>
                          {isDesktop && (
                            <Text color="gray" fontSize="sm">
                              {item.description}
                            </Text>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isDesktop && (
                          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg group-hover:bg-primary-soft">
                            <Icon as={InfoIcon} size="xs" color="inherit" className="group-hover:text-primary" />
                            <Text className="text-xs font-medium text-gray-600 group-hover:text-primary">
                              Configure
                            </Text>
                          </div>
                        )}
                        <Icon as={ChevronRightIcon} size="sm" color="black" />
                      </div>
                    </div>
                  ))}
                </div>
              </Tile>
            </div>
          ))}
        </div>
      </PageContent>
    </>
  );
};

export default SettingsPreferencesPage;
