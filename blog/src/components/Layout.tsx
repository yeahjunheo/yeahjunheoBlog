import Navbar from './Navbar';
import Footer from './Footer';
import ThemeSwitcher from './ThemeSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating theme switcher in bottom right corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
