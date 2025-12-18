import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getAllPosts, PostMetadata } from '@/lib/markdown';
import BlogGarden from '@/components/BlogGarden';
import BlogCount from '@/components/BlogCount';

interface Post {
  slug: string;
  title: string;
}

interface GardenPageProps {
  posts: Post[];
}

export default function GardenPage({ posts }: GardenPageProps) {
  return (
    <>
      <Head>
        <title>Garden | yeahjunheo</title>
        <meta
          name="description"
          content="A visual representation of all blog posts - watch the garden grow with each new post"
        />
      </Head>

      <div className="min-h-screen bg-background py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-text-primary">
              My Blog Garden
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Each icon represents a blog post. Click on them to read the post.
              Watch the garden grow as I write more!
            </p>
          </div>

          {/* Blog Count */}
          {/* <BlogCount count={posts.length} maxCapacity={256} /> */}

          {/* Blog Garden */}
          <BlogGarden posts={posts} gridSize={16} />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<GardenPageProps> = async () => {
  // Get all posts
  const allPosts = getAllPosts();

  // Format posts
  const posts: Post[] = allPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
  }));

  // Sort by title or slug for consistent ordering
  posts.sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    props: {
      posts,
    },
  };
};
