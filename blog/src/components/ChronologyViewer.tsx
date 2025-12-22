import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import type { PostMetadata } from '@/lib/markdown';

interface ChronologyViewerProps {
  posts: PostMetadata[];
  selectedPeriod: string | null;
  onSelectPeriod: (period: string | null) => void;
}

interface PostsByDate {
  [year: string]: {
    [month: string]: number;
  };
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ChronologyViewer({ posts, selectedPeriod, onSelectPeriod }: ChronologyViewerProps) {
  // Group posts by year and month
  const postsByDate = useMemo(() => {
    const grouped: PostsByDate = {};

    posts.forEach(post => {
      // Extract year and month from the date string
      // The date is in format "Month day, year" (e.g., "December 22, 2025")
      const dateMatch = post.date.match(/(\w+)\s+\d+,\s+(\d{4})/);
      if (dateMatch) {
        const monthName = dateMatch[1];
        const year = dateMatch[2];
        const _monthIndex = MONTH_NAMES.findIndex(m => m === monthName);

        if (!grouped[year]) {
          grouped[year] = {};
        }
        if (!grouped[year][monthName]) {
          grouped[year][monthName] = 0;
        }
        grouped[year][monthName]++;
      }
    });

    return grouped;
  }, [posts]);

  // Sort years in descending order
  const sortedYears = useMemo(() => {
    return Object.keys(postsByDate).sort((a, b) => parseInt(b) - parseInt(a));
  }, [postsByDate]);

  // Get total posts count
  const totalPosts = posts.length;

  const handlePeriodClick = (period: string) => {
    if (selectedPeriod === period) {
      onSelectPeriod(null); // Deselect if already selected
    } else {
      onSelectPeriod(period);
    }
  };

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-purple" />
          <h2 className="text-lg font-bold text-text-primary">Timeline</h2>
        </div>

        {/* All Posts Button */}
        <button
          onClick={() => onSelectPeriod(null)}
          className={`w-full text-left px-3 py-2 rounded-md mb-4 transition-all ${
            selectedPeriod === null
              ? 'bg-purple text-white font-medium'
              : 'text-text-secondary hover:bg-purple/10 hover:text-purple'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>All Posts</span>
            <span className="text-sm">{totalPosts}</span>
          </div>
        </button>

        <div className="border-t border-border pt-4">
          {sortedYears.length === 0 ? (
            <p className="text-text-secondary text-sm">No posts yet</p>
          ) : (
            <div className="space-y-4">
              {sortedYears.map(year => {
                const months = postsByDate[year];
                const sortedMonths = Object.keys(months).sort((a, b) => {
                  return MONTH_NAMES.indexOf(b) - MONTH_NAMES.indexOf(a);
                });
                const yearPostCount = Object.values(months).reduce((sum, count) => sum + count, 0);

                return (
                  <div key={year}>
                    {/* Year Header */}
                    <button
                      onClick={() => handlePeriodClick(year)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-all ${
                        selectedPeriod === year
                          ? 'bg-purple text-white font-medium'
                          : 'text-text-primary font-semibold hover:bg-purple/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{year}</span>
                        <span className="text-sm opacity-75">{yearPostCount}</span>
                      </div>
                    </button>

                    {/* Months */}
                    <div className="ml-4 mt-2 space-y-1">
                      {sortedMonths.map(month => {
                        const count = months[month];
                        const periodKey = `${year}-${month}`;

                        return (
                          <button
                            key={month}
                            onClick={() => handlePeriodClick(periodKey)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all ${
                              selectedPeriod === periodKey
                                ? 'bg-purple text-white font-medium'
                                : 'text-text-secondary hover:bg-purple/10 hover:text-purple'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{month}</span>
                              <span className="text-xs opacity-75">{count}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
