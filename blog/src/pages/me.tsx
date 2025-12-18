import Head from 'next/head';
import Link from 'next/link';

export default function MePage() {
  return (
    <>
      <Head>
        <title>About Me | yeahjunheo</title>
        <meta name="description" content="About yeahjunheo - software engineer and problem solver" />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-purple mb-4">About Me</h1>
            <div className="h-1 w-32 bg-purple rounded-full"></div>
          </header>

          <div className="bg-surface rounded-lg shadow-lg p-8 border-t-4 border-purple">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-text-primary leading-relaxed mb-8">
                Welcome to my corner of the internet!
                This is where I share my journey as a problem solver and software enthusiast.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
