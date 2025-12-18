import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sprout, UserCircle, Home } from 'lucide-react';
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

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => (
    <Link href={href} className="flex flex-col items-center gap-1 group">
      <Button
        variant="ghost"
        className={cn(
          "font-medium transition-all duration-200 hover:bg-transparent",
          isActive(href)
            ? "text-orange hover:text-orange"
            : "text-navbar-text hover:text-navbar-text"
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="hidden md:inline">{children}</span>
      </Button>
    </Link>
  );

  return (
    <nav className="bg-navbar-bg shadow-2xl border-b-4 border-cyan">
      <div className="mx-auto px-6 py-5 max-w-4xl">
        <div className="flex items-center justify-between">
          <NavLink href="/" icon={Home}>Home</NavLink>
          <NavLink href="/garden" icon={Sprout}>Garden</NavLink>
          <NavLink href="/me" icon={UserCircle}>About Me</NavLink>
        </div>
      </div>
    </nav>
  );
}
