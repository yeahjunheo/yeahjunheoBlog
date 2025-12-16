import Head from 'next/head';
import Link from 'next/link';

export default function MePage() {
  return (
    <>
      <Head>
        <title>About Me | yeahjunheo</title>
        <meta name="description" content="About yeahjunheo - software engineer and problem solver" />
      </Head>

      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-12">
            <Link href="/" className="inline-flex items-center text-cyan hover:text-coral font-medium transition-colors duration-200 mb-6 group">
              <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
              <span className="ml-2">Back to Home</span>
            </Link>
            <h1 className="text-5xl font-bold text-purple mb-4">About Me</h1>
            <div className="h-1 w-32 bg-gradient-to-r from-purple via-coral to-orange rounded-full"></div>
          </header>

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Welcome to my corner of the internet! This is where I share my journey as a software engineer.
              </p>

              <div className="bg-cream rounded-lg p-6 my-8 border-l-4 border-cyan">
                <h2 className="text-purple mt-0 flex items-center gap-2">
                  <span className="text-cyan">●</span>
                  What I Do
                </h2>
                <p className="text-gray-700 mb-0">
                  I enjoy solving problems, learning new technologies, and building things that matter.
                  You will find my coding solutions, technical explorations, and personal thoughts here.
                </p>
              </div>

              <div className="bg-cream rounded-lg p-6 my-8 border-l-4 border-orange">
                <h2 className="text-purple mt-0 flex items-center gap-2">
                  <span className="text-orange">●</span>
                  What You will Find Here
                </h2>
                <ul className="space-y-3 mb-0">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan font-bold text-xl">&lt;/&gt;</span>
                    <div>
                      <strong className="text-purple">Code:</strong>
                      <span className="text-gray-700"> Solutions to coding problems and technical deep-dives</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-coral font-bold text-xl">💭</span>
                    <div>
                      <strong className="text-purple">Thoughts:</strong>
                      <span className="text-gray-700"> Personal reflections and musings</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple to-cyan rounded-lg p-8 my-8 text-white">
                <h2 className="text-white mt-0 mb-4">Get in Touch</h2>
                <p className="text-white mb-4">
                  Feel free to reach out if you would like to connect!
                </p>
                <div className="flex gap-4">
                  <Link href="/code" className="px-6 py-3 bg-white text-purple rounded-lg font-medium hover:bg-cream transition-colors duration-200">
                    View Code
                  </Link>
                  <Link href="/thoughts" className="px-6 py-3 bg-white text-purple rounded-lg font-medium hover:bg-cream transition-colors duration-200">
                    View Thoughts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
