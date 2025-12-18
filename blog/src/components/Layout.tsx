import Navbar from './Navbar';
import ThemeSwitcher from './ThemeSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>

      {/* Floating theme switcher in bottom right corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeSwitcher />
      </div>
    </>
  );
}
