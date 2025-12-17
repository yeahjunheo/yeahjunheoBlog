import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button } from '@headlessui/react';

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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const Icon = theme === 'light' ? MoonIcon : SunIcon;
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <Button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-surface border border-transparent hover:border-accent text-accent hover:text-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all"
      aria-label={`Switch to ${nextTheme} theme`}
    >
      <Icon className="h-6 w-6" />
    </Button>
  );
}
