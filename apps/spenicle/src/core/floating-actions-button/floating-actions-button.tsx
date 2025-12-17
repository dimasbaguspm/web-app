import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonIcon } from '@dimasbaguspm/versaur';
import { cx } from 'class-variance-authority';
import { PlusIcon, XIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';
import { useMatches, useNavigate } from 'react-router';

import { PAGE_HANDLES } from '../../constants/page-routes';

interface FloatingActionButton {
  label: string;
  link: string | { path: string };
  type: (typeof PAGE_HANDLES)[keyof typeof PAGE_HANDLES];
}

interface RouteHandle {
  floatingActionButton?: FloatingActionButton[];
}

/**
 * Floating actions button component
 * Renders in all pages based on routes configuration and their floatingActionButton handle
 */
export const FloatingActionsButton: FC = () => {
  const { openDrawer } = useDrawerRoute();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { isDesktop } = useWindowResize();

  const matches = useMatches();

  const floatingActionButtons = useMemo(() => {
    const matchWithButtons = matches
      .slice()
      .reverse()
      .find((match) => {
        const handle = match.handle as RouteHandle | undefined;
        return handle?.floatingActionButton && handle.floatingActionButton.length > 0;
      });

    const handle = matchWithButtons?.handle as RouteHandle | undefined;
    return handle?.floatingActionButton || [];
  }, [matches]);

  const handleOnClick = (button: FloatingActionButton) => {
    const link = typeof button.link === 'string' ? button.link : button.link.path;

    if (button.type === PAGE_HANDLES.DRAWER) {
      openDrawer(link);
    } else {
      navigate(link);
    }

    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Don't render if there are no buttons
  if (floatingActionButtons.length === 0) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cx('fixed right-6 z-40 flex flex-col items-end gap-3', isDesktop ? 'bottom-6' : 'bottom-20')}>
        {isOpen && (
          <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {floatingActionButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleOnClick(button)}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}

        {/* Main toggle button */}
        <ButtonIcon
          size="lg"
          className="h-12 w-12"
          shape="circle"
          as={isOpen ? XIcon : PlusIcon}
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        />
      </div>
    </>
  );
};
