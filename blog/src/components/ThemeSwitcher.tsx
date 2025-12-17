import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

const themes = [
  { id: 'light', name: 'Light', icon: SunIcon },
  { id: 'dark', name: 'Dark', icon: MoonIcon },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
        {themes.map((t) => {
          if (t.id === theme) {
            const Icon = t.icon;
            return <Icon key={t.id} className="w-5 h-5" />;
          }
          return null;
        })} </MenuButton>
      <MenuItems className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50">
        {themes.map((t) => {
          const Icon = t.icon;
          return (
            <MenuItem key={t.id}>
              {({ active }) => (
                <button
                  onClick={() => setTheme(t.id)}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-800' : ''
                  } flex items-center gap-2 w-full px-3 py-2 rounded-md text-left`}
                >
                  <Icon className="w-4 h-4" />
                  {t.name}
                </button>
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
