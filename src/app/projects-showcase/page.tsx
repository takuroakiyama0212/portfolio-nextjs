import React from 'react';
import Header from '../../components/common/Header';
import ProjectHighlights from '../homepage/components/ProjectHighlights';
import Footer from '../homepage/components/Footer';

export default function ProjectsShowcasePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ProjectHighlights />
      </main>
      <Footer />
    </div>
  );
}


