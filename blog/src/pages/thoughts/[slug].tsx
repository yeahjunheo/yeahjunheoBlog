import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getPostBySlug, getAllPostSlugs, Post } from '@/lib/markdown';

interface PostPageProps {
  post: Post;
}

export default function PostPage({ post }: PostPageProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Thoughts | yeahjunheo</title>
        <meta name="description" content={post.description || post.title} />
      </Head>

      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link href="/thoughts" className="inline-flex items-center text-cyan hover:text-coral font-medium transition-colors duration-200 mb-8 group">
            <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
            <span className="ml-2">Back to Thoughts</span>
          </Link>

          <article className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-orange">
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-purple mb-6">{post.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 pb-6 border-b-2 border-cream">
                <time dateTime={post.date} className="flex items-center gap-2">
                  <span className="text-orange">●</span>
                  <span className="font-medium">{post.date}</span>
                </time>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-coral">●</span>
                  <span className="font-medium">{post.readingTime}</span>
                </span>
              </div>
            </header>

            <div
              className="prose prose-lg max-w-none
                prose-headings:text-purple
                prose-a:text-cyan prose-a:no-underline hover:prose-a:text-coral
                prose-code:bg-cream prose-code:text-purple prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:border-l-4 prose-pre:border-orange
                prose-blockquote:border-l-orange prose-blockquote:text-purple
                prose-strong:text-purple"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
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
