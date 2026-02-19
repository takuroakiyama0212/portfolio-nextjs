'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '../../../components/ui/AppIcon';

const Footer = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerLinks = {
    navigation: [
      { label: 'Home', href: '/homepage' },
      { label: 'Projects', href: '/projects-showcase' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
    projects: [
      { label: 'Auto Matcher', href: '/projects-showcase' },
      { label: 'Charge Spotter', href: '/projects-showcase' },
      { label: 'Secure.zip', href: '/projects-showcase' },
      { label: 'YouTube Dual Subtitle', href: '/projects-showcase' },
    ],
    resources: [
      { label: 'Resume', href: '#resume' },
      { label: 'GitHub', href: 'https://github.com/takuroakiyama0212' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/takuroakiyama0212' },
      { label: 'Blog', href: '#blog' },
    ],
  };

  const socialLinks = [
    { icon: 'CodeBracketIcon', href: 'https://github.com/takuroakiyama0212', label: 'GitHub' },
    { icon: 'UserGroupIcon', href: 'https://www.linkedin.com/in/takuroakiyama0212', label: 'LinkedIn' },
    { icon: 'EnvelopeIcon', href: 'mailto:akiyamatakuro0212@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="bg-brand-primary text-brand-primary-foreground border-t border-border/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-base">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <span className="text-primary-foreground font-bold text-xl font-mono">T</span>
                </div>
                <span className="text-xl font-semibold font-headline">Takuro</span>
              </Link>
              <p className="text-sm text-brand-primary-foreground/70 max-w-sm leading-relaxed">
                Full-stack developer building bridges through code. Passionate about creating efficient, user-focused solutions with international perspective.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-10 h-10 bg-brand-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-base"
                    aria-label={social.label}
                  >
                    <Icon name={social.icon as any} size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Navigation</h3>
              <ul className="space-y-3">
                {footerLinks.navigation.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-primary-foreground/70 hover:text-brand-primary-foreground hover:translate-x-1 transition-all duration-base inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Projects</h3>
              <ul className="space-y-3">
                {footerLinks.projects.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-primary-foreground/70 hover:text-brand-primary-foreground hover:translate-x-1 transition-all duration-base inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-brand-primary-foreground/70 hover:text-brand-primary-foreground hover:translate-x-1 transition-all duration-base inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-brand-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-brand-primary-foreground/60 text-center md:text-left">
              {isHydrated && currentYear ? (
                <>© {currentYear} Takuro. All rights reserved.</>
              ) : (
                <>© Takuro. All rights reserved.</>
              )}
            </p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="text-sm text-brand-primary-foreground/60 hover:text-brand-primary-foreground transition-colors duration-base">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-brand-primary-foreground/60 hover:text-brand-primary-foreground transition-colors duration-base">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
