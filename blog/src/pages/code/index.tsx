import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllPosts, PostMetadata } from '@/lib/markdown';
import PostCard from '@/components/PostCard';

interface CodePageProps {
  posts: PostMetadata[];
}

export default function CodePage({ posts }: CodePageProps) {
  return (
    <>
      <Head>
        <title>Code | yeahjunheo</title>
        <meta name="description" content="Coding problems, solutions, and technical posts" />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {posts.length === 0 ? (
            <div className="bg-surface shadow-md p-12 text-center border-t-4 border-cyan">
              <div className="text-6xl mb-6">💻</div>
              <p className="text-xl text-text-primary mb-2">No code posts yet.</p>
              <p className="text-text-secondary">Check back soon for coding solutions and tutorials!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} category="code" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<CodePageProps> = async () => {
  const posts = getAllPosts('code');

  return {
    props: {
      posts,
    },
  };
};
