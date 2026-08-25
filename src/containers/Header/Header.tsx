'use client';

import { usePathname } from 'next/navigation';
import PageContent from '@components/layouts/PageContent';
import { getRoute } from '@utils/routes';
import { NavigationMenu } from '../../components/organisms/NavigationMenu';
import { ThemeToggle } from '@containers/ThemeToggle';

export const Header = () => {
  const pathname = usePathname();
  const currentMenu = pathname.split('/')[1];

  return (
    <header className="header sticky top-0 bg-glass backdrop-blur-xs z-10 shadow-header md:shadow-none print:hidden">
      <PageContent>
        <div className="flex justify-between items-center">
          <nav className="flex items-center h-headerHeight">
            <NavigationMenu
              currentMenu={currentMenu || 'post'}
              data={[
                { id: 'post', title: 'BLOG', href: getRoute.root() },
                { id: 'work', title: 'WORK', href: getRoute.work() },
                { id: 'cv', title: 'CV', href: getRoute.cv() },
              ]}
            />
          </nav>
          <ThemeToggle />
        </div>
      </PageContent>
    </header>
  );
};
