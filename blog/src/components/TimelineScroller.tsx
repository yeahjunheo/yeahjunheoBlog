import { useState, useEffect, useRef, useMemo } from 'react';
import type { PostMetadata } from '@/lib/markdown';

interface TimelineScrollerProps {
  posts: PostMetadata[];
  onPeriodClick: (period: string) => void;
}

interface TimelinePeriod {
  key: string;
  year: string;
  month: string;
  count: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBREV = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TimelineScroller({ posts, onPeriodClick }: TimelineScrollerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Group posts by year-month (memoized to prevent effect re-runs)
  const periods: TimelinePeriod[] = useMemo(() => {
    const grouped: { [key: string]: { year: string; month: string; count: number } } = {};

    posts.forEach(post => {
      const dateMatch = post.date.match(/(\w+)\s+\d+,\s+(\d{4})/);
      if (dateMatch) {
        const month = dateMatch[1];
        const year = dateMatch[2];
        const key = `${year}-${month}`;

        if (!grouped[key]) {
          grouped[key] = { year, month, count: 0 };
        }
        grouped[key].count++;
      }
    });

    return Object.keys(grouped)
      .sort((a, b) => {
        const [yearA, monthA] = a.split('-');
        const [yearB, monthB] = b.split('-');
        if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
        return MONTH_NAMES.indexOf(monthB) - MONTH_NAMES.indexOf(monthA);
      })
      .map(key => ({ key, ...grouped[key] }));
  }, [posts]);

  // Scroll detection with auto-hide
  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Only show if scrolled down past 100px
      if (scrollY > 100) {
        if (!isScrolling) {
          isScrolling = true;
          setIsVisible(true);
        }

        // Hide after 1.5 seconds of no scrolling
        timeoutRef.current = setTimeout(() => {
          isScrolling = false;
          setIsVisible(false);
        }, 2000);
      } else {
        // At top of page - hide immediately
        isScrolling = false;
        setIsVisible(false);
      }

      // Track active period based on scroll position
      const sections = periods.map(p => {
        const element = document.getElementById(p.key);
        if (!element) return null;

        const rect = element.getBoundingClientRect();
        return {
          key: p.key,
          top: rect.top,
          bottom: rect.bottom,
        };
      }).filter(Boolean);

      const viewportMiddle = window.innerHeight / 2;
      const currentSection = sections.find(s =>
        s && s.top <= viewportMiddle && s.bottom >= viewportMiddle
      );

      if (currentSection) {
        setActivePeriod(currentSection.key);
      } else if (sections.length > 0) {
        const closest = sections.reduce((prev, curr) => {
          if (!curr || !prev) return curr || prev;
          const currDist = Math.abs(curr.top - viewportMiddle);
          const prevDist = Math.abs(prev.top - viewportMiddle);
          return currDist < prevDist ? curr : prev;
        });
        if (closest) setActivePeriod(closest.key);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [periods]);

  const handlePeriodClick = (periodKey: string) => {
    onPeriodClick(periodKey);

    const element = document.getElementById(periodKey);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Group periods by year for display
  const yearGroups = periods.reduce((acc, period) => {
    if (!acc[period.year]) acc[period.year] = [];
    acc[period.year].push(period);
    return acc;
  }, {} as { [year: string]: TimelinePeriod[] });

  return (
    <div
      className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2 md:gap-3">
        {/* Timeline Track */}
        <div className="relative flex flex-col items-center">
          {/* Vertical Line */}
          <div className="absolute top-0 bottom-0 w-1 bg-border" />

          {/* Period Markers */}
          <div className="relative space-y-2 md:space-y-3">
            {Object.keys(yearGroups).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
              <div key={year} className="flex flex-col items-center">
                {/* Year Label */}
                <div className="relative group">
                  <div
                    className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-purple cursor-pointer hover:scale-125 transition-transform"
                    onClick={() => {
                      const firstPeriod = yearGroups[year][0];
                      handlePeriodClick(firstPeriod.key);
                    }}
                  />
                  <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    <div className="bg-surface border border-border px-3 md:px-4 py-1 md:py-1.5 rounded-md shadow-lg">
                      <span className="text-sm md:text-base font-bold text-text-primary">{year}</span>
                    </div>
                  </div>
                </div>

                {/* Month Markers */}
                {yearGroups[year].map(period => {
                  const isActive = activePeriod === period.key;
                  const monthIndex = MONTH_NAMES.indexOf(period.month);

                  return (
                    <div key={period.key} className="relative group my-1 md:my-1.5">
                      <div
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full cursor-pointer transition-all ${
                          isActive
                            ? 'bg-purple scale-150 ring-2 md:ring-3 ring-purple/30'
                            : 'bg-border hover:bg-purple/50 hover:scale-110'
                        }`}
                        onClick={() => handlePeriodClick(period.key)}
                      />

                      {/* Tooltip */}
                      <div className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        <div className="bg-surface border border-border px-3 md:px-4 py-1.5 md:py-2 rounded-md shadow-lg">
                          <span className="text-sm font-medium text-text-primary">
                            {MONTH_ABBREV[monthIndex]} {period.year}
                          </span>
                          <span className="text-sm text-text-secondary ml-2">({period.count})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Current Period Label - Hidden on mobile */}
        {activePeriod && (
          <div className="ml-2 md:ml-3 animate-in fade-in hidden sm:block">
            <div className="bg-purple text-white px-3 md:px-4 py-1.5 md:py-2 rounded-md shadow-lg whitespace-nowrap">
              <span className="text-sm md:text-base font-medium">
                {(() => {
                  const period = periods.find(p => p.key === activePeriod);
                  if (!period) return '';
                  const monthIndex = MONTH_NAMES.indexOf(period.month);
                  return `${MONTH_ABBREV[monthIndex]} ${period.year}`;
                })()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
