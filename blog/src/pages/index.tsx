import Head from 'next/head';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllPosts, PostMetadata } from '@/lib/markdown';
import HeroBanner from '@/components/HeroBanner';
import PostsGrid from '@/components/PostsGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HomeProps {
  allPosts: PostMetadata[];
  hasMore: boolean;
}

export default function Home({ allPosts, hasMore }: HomeProps) {
  return (
    <>
      <Head>
        <title>yeahjunheo | Portfolio & Blog</title>
        <meta name="description" content="Personal blog and portfolio of yeahjunheo" />
      </Head>

      <div className="min-h-screen bg-background">
        <HeroBanner />
        <PostsGrid posts={allPosts} />

        {hasMore && (
          <div className="max-w-5xl mx-auto px-6 pb-16 flex justify-center">
            <Link href="/posts">
              <Button size="lg" className="group">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // Get all posts in chronological order (newest first)
  const allPosts = getAllPosts();
  const POSTS_PER_PAGE = 12;

  // Only show first 12 posts on home page
  const displayedPosts = allPosts.slice(0, POSTS_PER_PAGE);
  const hasMore = allPosts.length > POSTS_PER_PAGE;

  return {
    props: {
      allPosts: displayedPosts,
      hasMore,
    },
  };
};
