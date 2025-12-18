import Link from 'next/link';
import { useRouter } from 'next/router';
import { Code, Lightbulb, UserCircle } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  return (
    <nav className="bg-purple-dark shadow-2xl border-b-4 border-cyan">
      <div className="max-w-5xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-yellow transition-colors duration-200 flex items-center gap-2 group">
            <span className="text-cyan text-3xl group-hover:text-yellow transition-colors">&lt;</span>
            <span className="group-hover:scale-105 transition-transform">yeahjunheo</span>
            <span className="text-coral text-3xl group-hover:text-yellow transition-colors">/&gt;</span>
          </Link>

          <div className="flex gap-3 items-center">
            <Button
              asChild
              variant={isActive('/code') ? 'default' : 'ghost'}
              className={cn(
                "font-medium transition-all duration-200",
                isActive('/code') ? "bg-white text-purple shadow-md" : "text-white hover:bg-purple-dark hover:scale-105"
              )}
            >
              <Link href="/code">
                <Code className="h-5 w-5" />
                <span>Code</span>
              </Link>
            </Button>
            <Button
              asChild
              variant={isActive('/thoughts') ? 'default' : 'ghost'}
              className={cn(
                "font-medium transition-all duration-200",
                isActive('/thoughts') ? "bg-white text-purple shadow-md" : "text-white hover:bg-purple-dark hover:scale-105"
              )}
            >
              <Link href="/thoughts">
                <Lightbulb className="h-5 w-5" />
                <span>Thoughts</span>
              </Link>
            </Button>
            <Button
              asChild
              variant={isActive('/me') ? 'default' : 'ghost'}
              className={cn(
                "font-medium transition-all duration-200",
                isActive('/me') ? "bg-white text-purple shadow-md" : "text-white hover:bg-purple-dark hover:scale-105"
              )}
            >
              <Link href="/me">
                <UserCircle className="h-5 w-5" />
                <span>About</span>
              </Link>
            </Button>

            <div className="ml-2 pl-3 border-l border-white border-opacity-30">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
