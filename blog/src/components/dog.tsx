import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  const linkClass = (path: string) => {
    const base = 'hover:text-foreground transition-colors';
    return isActive(path)
      ? `${base} text-foreground font-medium`
      : `${base} text-gray-600 dark:text-gray-400`;
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
            yeahjunheo
          </Link>

          <div className="flex gap-6">
            <Link href="/code" className={linkClass('/code')}>
              Code
            </Link>
            <Link href="/thoughts" className={linkClass('/thoughts')}>
              Thoughts
            </Link>
            <Link href="/me" className={linkClass('/me')}>
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
