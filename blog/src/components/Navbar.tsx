import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Code, Lightbulb, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => (
    <Button
      asChild
      variant={isActive(href) ? 'default' : 'ghost'}
      className={cn(
        "font-medium transition-all duration-200 w-full justify-start md:w-auto md:justify-center",
        isActive(href)
          ? "bg-navbar-active-bg text-navbar-active-text shadow-md"
          : "text-navbar-text hover:text-accent-hover hover:scale-105"
      )}
      onClick={() => setOpen(false)}
    >
      <Link href={href}>
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </Link>
    </Button>
  );

  return (
    <nav className="bg-navbar-bg shadow-2xl border-b-4 border-cyan">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="relative flex items-center justify-between">
          {/* Mobile: Hamburger Menu - Far Left */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-navbar-text">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-navbar-bg border-cyan text-navbar-text">
              <div className="flex flex-col gap-4 mt-8">
                <NavLink href="/code" icon={Code}>Code</NavLink>
                <NavLink href="/thoughts" icon={Lightbulb}>Thoughts</NavLink>
                <NavLink href="/me" icon={UserCircle}>About Me</NavLink>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo - Far Left on Desktop, Centered on Mobile */}
          <Link href="/" className="text-2xl font-bold text-navbar-text hover:text-accent-hover transition-colors duration-200 flex items-center gap-2 group md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0">
            <span className="text-cyan text-3xl group-hover:text-accent-hover transition-colors">&lt;</span>
            <span className="group-hover:scale-105 transition-transform">yeahjunheo</span>
            <span className="text-coral text-3xl group-hover:text-accent-hover transition-colors">/&gt;</span>
          </Link>

          {/* Desktop: Tabs - Centered (Hidden on Mobile) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6 items-center">
            <NavLink href="/code" icon={Code}>Code</NavLink>
            <NavLink href="/thoughts" icon={Lightbulb}>Thoughts</NavLink>
          </div>

          {/* Desktop: About Me - Far Right (Hidden on Mobile) */}
          <div className="hidden md:block">
            <NavLink href="/me" icon={UserCircle}>About Me</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
