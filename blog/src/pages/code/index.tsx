import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts, PostMetadata } from '@/lib/markdown';

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

      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <header className="mb-12">
            <Link href="/" className="text-sm hover:underline mb-4 inline-block">
              &larr; Home
            </Link>
            <h1 className="text-4xl font-bold mb-2">Code</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Solutions to coding problems and technical explorations
            </p>
          </header>

          <div className="space-y-8">
            {posts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No posts yet. Check back soon!</p>
            ) : (
              posts.map((post) => (
                <article key={post.slug} className="border-b border-gray-200 dark:border-gray-800 pb-8">
                  <Link href={`/code/${post.slug}`}>
                    <h2 className="text-2xl font-semibold mb-2 hover:underline">{post.title}</h2>
                  </Link>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>&middot;</span>
                    <span>{post.readingTime}</span>
                  </div>
                  {post.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{post.description}</p>
                  )}
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Problem &rarr;
                    </a>
                  )}
                </article>
              ))
            )}
          </div>
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
