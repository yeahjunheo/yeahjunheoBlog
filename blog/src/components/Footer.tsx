import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/yeahjunheo',
      color: 'hover:text-purple'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/in/yeahjunheo',
      color: 'hover:text-cyan'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/yeahjunheo',
      color: 'hover:text-coral'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:your.email@example.com',
      color: 'hover:text-orange'
    },
  ];

  return (
    <footer className="bg-surface border-t-4 border-cyan mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-text-secondary transition-all duration-200 hover:scale-110 ${link.color}`}
                aria-label={link.name}
              >
                <link.icon className="w-6 h-6" />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-32 h-px bg-border" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-text-secondary">
              &copy; {currentYear} yeahjunheo. All rights reserved.
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
