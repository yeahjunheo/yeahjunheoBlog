import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const Icon = theme === 'light' ? Sun : Moon;
  const nextTheme = theme === 'light' ? 'dark' : 'light';
  const buttonColor = theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 rounded-full' : 'bg-gray-700 hover:bg-gray-600 rounded-full';

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${nextTheme} theme`}
      className={buttonColor}
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
}
