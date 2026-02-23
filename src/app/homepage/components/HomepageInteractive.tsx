'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import HeroSection from './HeroSection';
import ProjectHighlights from './ProjectHighlights';
import AboutSection from './AboutSection';
import SkillsShowcase from './SkillsShowcase';
import ContactSection from './ContactSection';
import Footer from './Footer';

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
    // Download resume from public/
    if (isHydrated) {
      const link = document.createElement('a');
      link.href = '/TakuroAkiyama-my-resume.pdf';
      link.download = 'TakuroAkiyama-my-resume.pdf';
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
