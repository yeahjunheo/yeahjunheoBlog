import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  TreeDeciduous,
  TreePine,
  Trees,
  Flower,
  Flower2,
  Leaf,
  Sprout,
  Bird,
  Bug,
  Fish,
  Shell,
  Snail,
  Rabbit,
  Squirrel,
  Sun,
  Moon,
  CloudRain,
  Droplet,
  Droplets,
  Wind,
  Snowflake,
  Globe,
  Recycle,
  Heart,
  Sparkles,
  Star,
  Apple,
  Cherry,
  Turtle,
  LucideIcon,
} from 'lucide-react';

// Nature-themed icon pool
const NATURE_ICONS: LucideIcon[] = [
  TreeDeciduous,
  TreePine,
  Trees,
  Flower,
  Flower2,
  Leaf,
  Sprout,
  Bird,
  Bug,
  Fish,
  Shell,
  Snail,
  Rabbit,
  Squirrel,
  Sun,
  Moon,
  CloudRain,
  Droplet,
  Droplets,
  Wind,
  Snowflake,
  Globe,
  Recycle,
  Heart,
  Sparkles,
  Star,
  Apple,
  Cherry,
  Turtle,
];

interface Post {
  slug: string;
  title: string;
}

interface BlogGardenProps {
  posts: Post[];
  gridSize?: number;
}

type CellPost = {
  type: 'post';
  post: Post;
  Icon: LucideIcon;
  scale: number;
  animationDelay: number;
  animationDuration: number;
};

type CellEmpty = {
  type: 'empty';
};

type Cell = CellPost | CellEmpty;

// Simple hash function to consistently map slug to icon
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate consistent random value between min and max from a seed
function seededRandom(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return min + random * (max - min);
}

function GardenCell({ cell, index }: { cell: Cell; index: number }) {
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const cellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cell.type === 'post' && cellRef.current) {
      const updatePosition = () => {
        const rect = cellRef.current?.getBoundingClientRect();
        if (!rect) return;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Check space available in each direction
        const spaceTop = rect.top;
        const spaceBottom = viewportHeight - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = viewportWidth - rect.right;

        // Determine best position (prefer top, then bottom, then sides)
        if (spaceTop > 80) {
          setTooltipPosition('top');
        } else if (spaceBottom > 80) {
          setTooltipPosition('bottom');
        } else if (spaceRight > 200) {
          setTooltipPosition('right');
        } else if (spaceLeft > 200) {
          setTooltipPosition('left');
        } else {
          setTooltipPosition('top'); // fallback
        }
      };

      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [cell]);

  const getTooltipClasses = () => {
    const base = "absolute hidden group-hover:block pointer-events-none z-50";
    const positions = {
      top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
      bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
      left: "right-full mr-2 top-1/2 -translate-y-1/2",
      right: "left-full ml-2 top-1/2 -translate-y-1/2"
    };
    return `${base} ${positions[tooltipPosition]}`;
  };

  const getArrowClasses = () => {
    const positions = {
      top: "left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-orange rotate-45",
      bottom: "left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-orange rotate-45",
      left: "top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-orange rotate-45",
      right: "top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-orange rotate-45"
    };
    return `absolute ${positions[tooltipPosition]}`;
  };

  return (
    <div
      ref={cellRef}
      key={index}
      className="aspect-square flex items-center justify-center"
    >
      {cell.type === 'post' ? (
        <Link
          href={`/${cell.post.slug}`}
          className="w-full h-full flex items-center justify-center hover:scale-125 transition-all duration-200 group relative"
        >
          <cell.Icon
            className="w-7 h-7 text-text-secondary group-hover:text-orange transition-colors"
            style={{
              transform: `scale(${cell.scale})`,
              animation: `float ${cell.animationDuration}s ease-in-out ${cell.animationDelay}s infinite`,
            }}
          />
          {/* Tooltip */}
          <div className={getTooltipClasses()}>
            <div className="bg-surface border-2 border-orange rounded px-3 py-2 text-sm text-text-primary shadow-lg max-w-sm wrap-break-words text-center">
              {cell.post.title}
            </div>
            {/* Arrow */}
            <div className={getArrowClasses()} />
          </div>
        </Link>
      ) : (
        <div className="w-1 h-1 bg-border rounded-full" />
      )}
    </div>
  );
}

export default function BlogGarden({ posts, gridSize = 16 }: BlogGardenProps) {
  const totalCells = gridSize * gridSize;

  // Create shuffled positions for random placement
  const shuffledPositions = Array.from({ length: totalCells }, (_, i) => i);

  // Shuffle positions using a simple deterministic method based on all post slugs
  const seedValue = posts.reduce((acc, post) => acc + hashString(post.slug), 0);
  for (let i = shuffledPositions.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seedValue + i, 0, 1) * (i + 1));
    [shuffledPositions[i], shuffledPositions[j]] = [shuffledPositions[j], shuffledPositions[i]];
  }

  // Initialize empty cells
  const cells: Cell[] = Array.from({ length: totalCells }, () => ({ type: 'empty' as const }));

  // Place posts at shuffled positions
  posts.forEach((post, index) => {
    const position = shuffledPositions[index];
    const hash = hashString(post.slug);
    const iconIndex = hash % NATURE_ICONS.length;
    const Icon = NATURE_ICONS[iconIndex];

    // Generate consistent random properties for this post
    const scale = seededRandom(hash, 0.85, 1.15);
    const animationDelay = 0;
    const animationDuration = seededRandom(hash * 3, 3, 6);

    cells[position] = { type: 'post', post, Icon, scale, animationDelay, animationDuration };
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(1px, -1px) rotate(1deg);
          }
          50% {
            transform: translate(-1px, -2px) rotate(-1deg);
          }
          75% {
            transform: translate(-1px, 1px) rotate(0.5deg);
          }
        }
      `}</style>
      <div
        className="grid gap-2 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell, index) => (
          <GardenCell key={index} cell={cell} index={index} />
        ))}
      </div>
    </div>
  );
}
