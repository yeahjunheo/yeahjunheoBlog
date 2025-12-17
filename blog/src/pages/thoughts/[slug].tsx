import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { CalendarIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getPostBySlug, getAllPostSlugs, Post } from '@/lib/markdown';

interface PostPageProps {
  post: Post;
}

export default function PostPage({ post }: PostPageProps) {
  return (
    <>
      <Head>
        <title>{`${post.title} | Thoughts | yeahjunheo`}</title>
        <meta name="description" content={post.description || post.title} />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link href="/thoughts" className="inline-flex items-center gap-2 text-cyan hover:text-coral font-medium transition-colors duration-200 mb-8 group">
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Thoughts</span>
          </Link>

          <article className="bg-surface rounded-lg shadow-lg p-8 border-t-4 border-orange">
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-purple mb-6">{post.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-text-secondary pb-6 border-b-2 border-border">
                <time dateTime={post.date} className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-orange" />
                  <span className="font-medium">{post.date}</span>
                </time>
                <span className="text-border">•</span>
                <span className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-coral" />
                  <span className="font-medium">{post.readingTime}</span>
                </span>
              </div>
            </header>

            <div className="markdown-body">
              {post.isMdx && post.mdxSource ? (
                <MDXRemote {...post.mdxSource} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              )}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs('thoughts');
  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug('thoughts', slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};
