'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '../ui/AppIcon';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', href: '/homepage' },
    { label: 'Projects', href: '/projects-showcase' },
    { label: 'About', href: '/homepage#about' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 border-b border-border/40 shadow-elevation bg-[rgba(5,8,22,0.98)] backdrop-blur-sm ${className}`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-base">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <span className="text-primary-foreground font-bold text-xl font-mono">T</span>
            </div>
            <span className="text-xl font-semibold text-brand-primary-foreground font-headline hidden sm:block">
              Takuro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-semibold text-brand-primary-foreground/85 hover:text-brand-primary-foreground hover:bg-white/8 rounded-lg transition-all duration-base"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/projects-showcase"
              className="px-4 py-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors duration-base"
            >
              View Work
            </Link>
            <Link
              href="#contact"
              className="px-4 py-2 text-sm font-semibold bg-cta text-cta-foreground rounded-lg hover:bg-cta/90 hover:shadow-elevation hover:-translate-y-0.5 transition-all duration-base"
            >
              Get In Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-brand-primary-foreground/85 hover:text-brand-primary-foreground hover:bg-white/8 rounded-lg transition-all duration-base"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-[rgba(5,8,22,0.98)] animate-fade-in">
            <nav className="flex flex-col px-4 py-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-brand-primary-foreground/85 hover:text-brand-primary-foreground hover:bg-white/8 rounded-lg transition-all duration-base"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 space-y-2 border-t border-border/30 mt-2">
                <Link
                  href="/projects-showcase"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-center text-brand-secondary hover:text-brand-secondary/80 border border-brand-secondary rounded-lg transition-all duration-base"
                >
                  View Work
                </Link>
                <Link
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-center bg-cta text-cta-foreground rounded-lg hover:bg-cta/90 transition-all duration-base"
                >
                  Get In Touch
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
