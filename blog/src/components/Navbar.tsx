import Link from 'next/link';
import { useRouter } from 'next/router';
import { CodeBracketIcon, LightBulbIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  const linkClass = (path: string) => {
    const base = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
    return isActive(path)
      ? `${base} bg-white text-purple shadow-md`
      : `${base} text-white hover:bg-purple-dark hover:scale-105`;
  };

  return (
    <nav className="bg-gradient-to-r from-navy via-purple-dark to-navy shadow-2xl border-b-4 border-cyan">
      <div className="max-w-5xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-yellow transition-colors duration-200 flex items-center gap-2 group">
            <span className="text-cyan text-3xl group-hover:text-yellow transition-colors">&lt;</span>
            <span className="group-hover:scale-105 transition-transform">yeahjunheo</span>
            <span className="text-coral text-3xl group-hover:text-yellow transition-colors">/&gt;</span>
          </Link>

          <div className="flex gap-3 items-center">
            <Link href="/code" className={linkClass('/code')}>
              <div className="flex items-center gap-2">
                <CodeBracketIcon className="h-5 w-5" />
                <span>Code</span>
              </div>
            </Link>
            <Link href="/thoughts" className={linkClass('/thoughts')}>
              <div className="flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5" />
                <span>Thoughts</span>
              </div>
            </Link>
            <Link href="/me" className={linkClass('/me')}>
              <div className="flex items-center gap-2">
                <UserCircleIcon className="h-5 w-5" />
                <span>About</span>
              </div>
            </Link>

            <div className="ml-2 pl-3 border-l border-white border-opacity-30">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
