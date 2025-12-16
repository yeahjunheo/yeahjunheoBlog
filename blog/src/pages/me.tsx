import Head from 'next/head';
import Link from 'next/link';

export default function MePage() {
  return (
    <>
      <Head>
        <title>About Me | yeahjunheo</title>
        <meta name="description" content="About yeahjunheo - software engineer and problem solver" />
      </Head>

      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <header className="mb-12">
            <Link href="/" className="text-sm hover:underline mb-4 inline-block">
              ê Home
            </Link>
            <h1 className="text-4xl font-bold mb-2">About Me</h1>
          </header>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              Welcome to my corner of the internet! This is where I share my journey as a software engineer.
            </p>

            <h2>What I Do</h2>
            <p>
              I enjoy solving problems, learning new technologies, and building things that matter.
              You'll find my coding solutions, technical explorations, and personal thoughts here.
            </p>

            <h2>What You'll Find Here</h2>
            <ul>
              <li><strong>Code:</strong> Solutions to coding problems and technical deep-dives</li>
              <li><strong>Thoughts:</strong> Personal reflections and musings</li>
            </ul>

            <h2>Get in Touch</h2>
            <p>
              Feel free to reach out if you'd like to connect!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
