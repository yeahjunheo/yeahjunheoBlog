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

      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <header className="mb-12">
            <Link href="/" className="inline-flex items-center text-cyan hover:text-coral font-medium transition-colors duration-200 mb-6 group">
              <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
              <span className="ml-2">Back to Home</span>
            </Link>
            <h1 className="text-5xl font-bold mb-4 flex items-center gap-3">
              <span className="text-cyan">&lt;</span>
              <span className="text-purple">Code</span>
              <span className="text-cyan">/&gt;</span>
            </h1>
            <p className="text-xl text-text-secondary">
              Solutions to coding problems and technical explorations
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-cyan to-purple mt-4 rounded-full"></div>
          </header>

          <div className="grid gap-6">
            {posts.length === 0 ? (
              <div className="bg-surface rounded-lg shadow-md p-12 text-center border-t-4 border-cyan">
                <div className="text-6xl mb-6">💻</div>
                <p className="text-xl text-text-primary mb-2">No code posts yet.</p>
                <p className="text-text-secondary">Check back soon for coding solutions and tutorials!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.slug} className="bg-surface rounded-lg shadow-md p-6 border-l-4 border-cyan hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                  <Link href={`/code/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-purple hover:text-cyan transition-colors duration-200 mb-3">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="flex gap-4 text-sm text-text-secondary mb-4">
                    <time dateTime={post.date} className="flex items-center gap-1">
                      <span className="text-orange">●</span> {post.date}
                    </time>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <span className="text-coral">●</span> {post.readingTime}
                    </span>
                  </div>
                  {post.description && (
                    <p className="text-text-primary mb-4">{post.description}</p>
                  )}
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-cyan hover:text-coral font-medium transition-colors duration-200 group"
                    >
                      <span>View Problem</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
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
