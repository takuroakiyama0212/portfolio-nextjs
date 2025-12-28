import React from 'react';
import AppImage from '../../../components/ui/AppImage';
import Icon from '../../../components/ui/AppIcon';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  tags: string[];
  icon: string;
}

const ProjectHighlights = () => {
  const featuredProjects: Project[] = [
  {
    id: 1,
    title: 'Auto Matcher',
    description: 'Intelligent matching system that connects users based on preferences and compatibility scores using advanced algorithms.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_12f5fe13a-1764644024710.png",
    alt: 'Modern dashboard interface showing matching algorithm visualization with blue and purple gradient charts on dark background',
    tags: ['React', 'Node.js', 'MongoDB'],
    icon: 'SparklesIcon'
  },
  {
    id: 2,
    title: 'Charge Spotter',
    description: 'Real-time EV charging station locator with availability tracking and route optimization for electric vehicle drivers.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16f293165-1765107317626.png",
    alt: 'Electric vehicle charging station map interface displayed on laptop screen with green location markers and route planning',
    tags: ['Next.js', 'TypeScript', 'Google Maps API'],
    icon: 'BoltIcon'
  },
  {
    id: 3,
    title: 'Secure.zip',
    description: 'Enterprise-grade file encryption and secure sharing platform with end-to-end encryption and access controls.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_11004fe63-1764660024095.png",
    alt: 'Security lock icon overlaid on digital binary code background with blue and green encryption visualization',
    tags: ['Python', 'AWS', 'Cryptography'],
    icon: 'LockClosedIcon'
  },
  {
    id: 4,
    title: 'YouTube Dual Subtitle',
    description: 'Browser extension enabling simultaneous display of two subtitle languages for enhanced language learning experience.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_140107a56-1765126812866.png",
    alt: 'Video player interface showing dual language subtitles in English and Japanese with synchronized text display',
    tags: ['JavaScript', 'Chrome Extension', 'YouTube API'],
    icon: 'LanguageIcon'
  }];


  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
            <Icon name="RocketLaunchIcon" size={16} />
            Featured Work
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Projects That Make an Impact
          </h2>
          <p className="text-lg text-text-secondary">
            Showcasing solutions that bridge technologies and solve real-world problems across different domains and industries.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredProjects.map((project) =>
          <div
            key={project.id}
            className="group bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary hover:shadow-elevation transition-all duration-base">

              {/* Project Image */}
              <div className="relative h-64 overflow-hidden bg-muted">
                <AppImage
                src={project.image}
                alt={project.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-base"></div>
                
                {/* Icon Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-surface rounded-xl flex items-center justify-center shadow-subtle">
                  <Icon name={project.icon as any} size={24} className="text-primary" />
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-base">
                    {project.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) =>
                <span
                  key={index}
                  className="px-3 py-1 bg-muted text-text-secondary text-xs font-medium rounded-full">

                      {tag}
                    </span>
                )}
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-base">
                    View Details
                    <Icon name="ArrowRightIcon" size={16} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View All Projects CTA */}
        <div className="text-center">
          <Link
            href="/projects-showcase"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 hover:shadow-elevation hover:-translate-y-1 transition-all duration-base">

            View All Projects
            <Icon name="ArrowRightIcon" size={20} />
          </Link>
        </div>
      </div>
    </section>);

};

export default ProjectHighlights;