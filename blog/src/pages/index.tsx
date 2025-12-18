import Head from 'next/head';
import { GetStaticProps } from 'next';
import { getAllPosts, PostMetadata } from '@/lib/markdown';
import HeroBanner from '@/components/HeroBanner';
import PostsGrid from '@/components/PostsGrid';

interface HomeProps {
  allPosts: PostMetadata[];
}

export default function Home({ allPosts }: HomeProps) {
  return (
    <>
      <Head>
        <title>yeahjunheo | Portfolio & Blog</title>
        <meta name="description" content="Personal blog and portfolio of yeahjunheo" />
      </Head>

      <div className="min-h-screen bg-background">
        <HeroBanner />
        <PostsGrid posts={allPosts} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // Get all posts in chronological order (newest first)
  const allPosts = getAllPosts();

  return {
    props: {
      allPosts,
    },
  };
};
