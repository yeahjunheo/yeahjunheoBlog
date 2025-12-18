import Link from 'next/link';
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
    const animationDelay = seededRandom(hash * 2, 0, 4);
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
          <div
            key={index}
            className="aspect-square flex items-center justify-center"
          >
            {cell.type === 'post' ? (
              <Link
                href={`/${cell.post.slug}`}
                className="w-full h-full flex items-center justify-center hover:scale-125 transition-all duration-200 group"
                title={cell.post.title}
              >
                <cell.Icon
                  className="w-7 h-7 text-text-secondary group-hover:text-orange transition-colors"
                  style={{
                    transform: `scale(${cell.scale})`,
                    animation: `float ${cell.animationDuration}s ease-in-out ${cell.animationDelay}s infinite`,
                  }}
                />
              </Link>
            ) : (
              <div className="w-1 h-1 bg-border rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
