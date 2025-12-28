'use client';

import React, { useEffect, useState } from 'react';
import AppImage from '../../../components/ui/AppImage';
import Icon from '../../../components/ui/AppIcon';

interface HeroSectionProps {
  onViewProjects: () => void;
  onDownloadResume: () => void;
}

const HeroSection = ({ onViewProjects, onDownloadResume }: HeroSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [codeLineIndex, setCodeLineIndex] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const codeSnippets = [
  "const developer = 'Takuro';",
  "const skills = ['React', 'Node.js', 'TypeScript'];",
  "const passion = 'Building bridges through code';",
  "const location = ['Japan', 'USA', 'Australia'];",
  "return <Innovation />;"];


  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setCodeLineIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHydrated, codeSnippets.length]);

  const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '15+', label: 'Projects Completed' },
  { value: '3', label: 'Countries Worked' },
  { value: '100%', label: 'Client Satisfaction' }];


  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-surface to-muted overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Available for new opportunities
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
                Building Bridges
                <span className="block text-primary mt-2"> Through Code</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto lg:mx-0">
                Aspiring Full-stack Developer proficient in React, TypeScript, Python, and modern web frameworks. Highly motivated to build scalable applications and leverage international experience across Japan, the U.S., and Australia.
              </p>
            </div>

            {/* Key Value Props */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="GlobeAltIcon" size={20} className="text-brand-secondary" />
                <span className="text-sm font-medium">International Perspective</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="CodeBracketIcon" size={20} className="text-brand-secondary" />
                <span className="text-sm font-medium">Full-Stack Expertise</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-brand-secondary" />
                <span className="text-sm font-medium">Multilingual Communication</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onViewProjects}
                className="group px-8 py-4 bg-cta text-cta-foreground rounded-lg font-semibold hover:bg-cta/90 hover:shadow-elevation hover:-translate-y-1 transition-all duration-base flex items-center justify-center gap-2">

                View Projects
                <Icon name="ArrowRightIcon" size={20} className="group-hover:translate-x-1 transition-transform duration-base" />
              </button>
              <button
                onClick={onDownloadResume}
                className="px-8 py-4 bg-surface text-text-primary border-2 border-border rounded-lg font-semibold hover:border-primary hover:text-primary hover:shadow-subtle transition-all duration-base flex items-center justify-center gap-2">

                <Icon name="ArrowDownTrayIcon" size={20} />
                Download Resume
              </button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start pt-4">
              <a
                href="https://github.com/takuroakiyama0212"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-primary hover:shadow-subtle transition-all duration-base"
                aria-label="GitHub Profile">

                <Icon name="CodeBracketIcon" size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/takuroakiyama0212"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-primary hover:shadow-subtle transition-all duration-base"
                aria-label="LinkedIn Profile">

                <Icon name="UserGroupIcon" size={24} />
              </a>
              <a
                href="mailto:akiyamatakuro0212@gmail.com"
                className="p-3 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-primary hover:shadow-subtle transition-all duration-base"
                aria-label="Email Contact">

                <Icon name="EnvelopeIcon" size={24} />
              </a>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Code Editor Mockup */}
            <div className="relative bg-brand-primary rounded-2xl shadow-elevation overflow-hidden border border-border/20">
              {/* Editor Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-brand-primary/80 border-b border-border/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <span className="text-xs text-text-secondary ml-4 font-mono">developer.tsx</span>
              </div>

              {/* Code Content */}
              <div className="p-6 space-y-3 font-mono text-sm min-h-[300px] bg-gradient-to-br from-brand-primary to-brand-primary/90">
                {isHydrated ?
                <>
                    {codeSnippets.map((line, index) =>
                  <div
                    key={index}
                    className={`transition-all duration-500 ${
                    index === codeLineIndex ?
                    'text-accent opacity-100 scale-105' : 'text-text-secondary/60 opacity-70'}`
                    }>

                        <span className="text-text-secondary/40 mr-4">{index + 1}</span>
                        {line}
                      </div>
                  )}
                  </> :

                <>
                    {codeSnippets.map((line, index) =>
                  <div key={index} className="text-text-secondary/60 opacity-70">
                        <span className="text-text-secondary/40 mr-4">{index + 1}</span>
                        {line}
                      </div>
                  )}
                  </>
                }
              </div>

              {/* Profile Image Overlay */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-surface shadow-elevation">
                <AppImage
                  src="/assets/images/takuro.jpg"
                  alt="Profile photo"
                  className="w-full h-full object-cover" />

              </div>
            </div>

          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 lg:mt-32">
          {stats.map((stat, index) =>
          <div
            key={index}
            className="text-center p-6 bg-surface rounded-xl border border-border hover:border-primary hover:shadow-subtle transition-all duration-base">

              <p className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-sm text-text-secondary font-medium">{stat.label}</p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDownIcon" size={32} className="text-text-secondary" />
      </div>
    </section>);

};

export default HeroSection;