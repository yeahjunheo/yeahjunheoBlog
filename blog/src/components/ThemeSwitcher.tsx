import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon, SparklesIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const themes = [
  { id: 'light', name: 'Light', icon: SunIcon },
  { id: 'dark', name: 'Dark', icon: MoonIcon },
  { id: 'obsidian', name: 'Obsidian', icon: SparklesIcon },
  { id: 'minimal', name: 'Minimal', icon: Squares2X2Icon },
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
    <div className="relative group">
      <button
        className="p-2 rounded-lg transition-all duration-200 hover:bg-opacity-10 hover:bg-white"
        title="Change theme"
      >
        {themes.find((t) => t.id === theme)?.icon ? (
          (() => {
            const Icon = themes.find((t) => t.id === theme)!.icon;
            return <Icon className="h-5 w-5" />;
          })()
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {themes.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                theme === t.id
                  ? 'bg-cyan bg-opacity-10 text-cyan font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{t.name}</span>
              {theme === t.id && <span className="ml-auto text-sm">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
