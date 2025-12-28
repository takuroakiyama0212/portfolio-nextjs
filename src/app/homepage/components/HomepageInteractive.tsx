'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import HeroSection from './HeroSection.tsx';
import ProjectHighlights from './ProjectHighlights.tsx';
import AboutSection from './AboutSection.tsx';
import SkillsShowcase from './SkillsShowcase.tsx';
import ContactSection from './ContactSection.tsx';
import Footer from './Footer.tsx';

const HomepageInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleViewProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadResume = () => {
    // Mock resume download
    if (isHydrated) {
      const link = document.createElement('a');
      link.href = '#';
      link.download = 'Takuro_Resume.pdf';
      link?.click();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onViewProjects={handleViewProjects} onDownloadResume={handleDownloadResume} />
        <div id="projects">
          <ProjectHighlights />
        </div>
        <AboutSection />
        <SkillsShowcase />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomepageInteractive;