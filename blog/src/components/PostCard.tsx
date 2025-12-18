import Link from 'next/link';
import { ArrowDownRight } from 'lucide-react';
import type { PostMetadata } from '@/lib/markdown';

interface PostCardProps {
  post: PostMetadata;
}

export default function PostCard({ post }: PostCardProps) {
  const href = `/${post.slug}`;

  return (
    <Link href={href}>
      <article className="relative bg-surface border border-border hover:border-accent transition-all duration-200 p-6 h-64 flex flex-col group cursor-pointer">
        {/* Date - Top Left */}
        <time
          dateTime={post.date}
          className="text-xs text-text-secondary font-medium mb-4"
        >
          {post.date}
        </time>

        {/* Title - Center (grows to fill space) */}
        <div className="flex-1 flex items-center justify-center px-4">
          <h3 className="text-center font-bold text-text-primary group-hover:text-accent transition-colors duration-200 line-clamp-4"
              style={{
                fontSize: 'clamp(1.25rem, 2vw + 0.5rem, 2rem)',
                lineHeight: '1.3'
              }}>
            {post.title}
          </h3>
        </div>

        {/* Click Icon - Bottom Right */}
        <div className="flex justify-end">
          <ArrowDownRight className="w-5 h-5 text-text-secondary group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </div>
      </article>
    </Link>
  );
}
