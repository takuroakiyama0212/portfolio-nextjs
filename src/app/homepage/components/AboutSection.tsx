'use client';

import React from 'react';
import Icon from '../../../components/ui/AppIcon';

const AboutSection = () => {
  const aboutContent = [
    "Aspiring Full-stack Developer proficient in React, TypeScript, Python, and modern web frameworks.",
    "Highly motivated to build scalable applications and leverage international experience across Japan, the U.S., and Australia.",
    "Seeking an entry-level Software Engineer role where strong communication and problem-solving skills can drive efficient solutions.",
    "I am currently based in Australia and studying Computer Science in University of the People on online.",
  ];

  const projectHighlights = [
    {
      title: "Auto Matcher",
      tech: "React, TypeScript, Node.js, Express, PostgreSQL, TanStack Query",
      description: "Built a full-stack matching application with real-time data synchronization.",
      details: [
        "Implemented RESTful API with Express and PostgreSQL for data persistence.",
        "Created responsive UI components using React and Tailwind CSS.",
      ],
    },
  ];

  const techStack = [
    { name: 'CSS3', color: 'bg-blue-500' },
    { name: 'JAVA', color: 'bg-orange-500' },
    { name: 'HTML5', color: 'bg-red-500' },
    { name: 'PYTHON', color: 'bg-blue-600' },
    { name: 'PHP', color: 'bg-purple-500' },
    { name: 'TYPESCRIPT', color: 'bg-cyan-500' },
    { name: 'AWS', color: 'bg-orange-600' },
    { name: 'GOOGLECLOUD', color: 'bg-blue-700' },
    { name: 'EXPRESS.JS', color: 'bg-gray-700' },
    { name: 'FLASK', color: 'bg-gray-900' },
    { name: 'MYSQL', color: 'bg-blue-500' },
    { name: 'NODE.JS', color: 'bg-green-500' },
    { name: 'REACT', color: 'bg-cyan-400' },
    { name: 'SASS', color: 'bg-pink-500' },
    { name: 'ADOBE LIGHTROOM', color: 'bg-blue-500' },
    { name: 'GIT', color: 'bg-red-600' },
    { name: 'GITHUB', color: 'bg-gray-800' },
    { name: 'REACT QUERY', color: 'bg-pink-400' },
    { name: 'TENSORFLOW', color: 'bg-orange-500' },
    { name: 'OPENCV', color: 'bg-green-600' },
    { name: 'NUMPY', color: 'bg-purple-600' },
    { name: 'PANDAS', color: 'bg-blue-500' },
    { name: 'MATPLOTLIB', color: 'bg-gray-900' },
  ];

  const certifications = [
    {
      issuer: 'freeCodeCamp',
      title: 'JavaScript Developer Certification',
      date: 'Dec 23, 2025',
      effort: '≈ 300 hours',
      verifyUrl: 'https://freecodecamp.org/certification/takuroakiyama0212/javascript-v9',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Me Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Icon name="StarIcon" size={24} className="text-primary" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              About Me:
            </h2>
          </div>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            {aboutContent.map((paragraph, index) => (
              <p key={index} className="text-base lg:text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Project Highlights */}
          {projectHighlights.map((project, index) => (
            <div key={index} className="mt-8 p-6 bg-surface rounded-xl border border-border">
              <h3 className="text-xl font-bold text-text-primary mb-2">{project.title}</h3>
              <p className="text-sm text-text-secondary mb-3 font-medium">{project.tech}</p>
              <p className="text-text-secondary mb-3">{project.description}</p>
              <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                {project.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Socials (combined) */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="GlobeAltIcon" size={24} className="text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Contact & Socials</h2>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="mailto:akiyamatakuro0212@gmail.com"
                className="group flex items-start gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary hover:shadow-subtle transition-all duration-base"
              >
                <div className="mt-0.5 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors duration-base">
                  <Icon name="EnvelopeIcon" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">Email</p>
                  <p className="text-sm text-text-secondary truncate">akiyamatakuro0212@gmail.com</p>
                </div>
              </a>

              <a
                href="tel:+61405726234"
                className="group flex items-start gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary hover:shadow-subtle transition-all duration-base"
              >
                <div className="mt-0.5 w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success group-hover:bg-success/15 transition-colors duration-base">
                  <Icon name="PhoneIcon" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">Phone</p>
                  <p className="text-sm text-text-secondary truncate">+61 405 726 234</p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/takuroakiyama0212"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary hover:shadow-subtle transition-all duration-base"
              >
                <div className="mt-0.5 w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600/15 transition-colors duration-base">
                  <Icon name="UserGroupIcon" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">LinkedIn</p>
                  <p className="text-sm text-text-secondary truncate">linkedin.com/in/takuroakiyama0212</p>
                </div>
              </a>

              <a
                href="https://github.com/takuroakiyama0212"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary hover:shadow-subtle transition-all duration-base"
              >
                <div className="mt-0.5 w-10 h-10 rounded-lg bg-text-primary/10 flex items-center justify-center text-text-primary group-hover:bg-text-primary/15 transition-colors duration-base">
                  <Icon name="CodeBracketIcon" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">GitHub</p>
                  <p className="text-sm text-text-secondary truncate">github.com/takuroakiyama0212</p>
                </div>
              </a>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <div className="mt-0.5 w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center text-cta">
                <Icon name="MapPinIcon" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">Location</p>
                <p className="text-sm text-text-secondary">Golden Beach, QLD, Australia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="CodeBracketSquareIcon" size={24} className="text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Tech Stack:</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className={`px-4 py-2 ${tech.color} text-white text-sm font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-base`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="AcademicCapIcon" size={24} className="text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Certifications</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((cert) => (
              <div key={cert.verifyUrl} className="bg-surface rounded-2xl border border-border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-secondary">{cert.issuer}</p>
                    <h3 className="mt-1 text-lg font-bold text-text-primary truncate">{cert.title}</h3>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon name="CheckBadgeIcon" size={20} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Icon name="CalendarDaysIcon" size={16} />
                    <span className="truncate">{cert.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Icon name="ClockIcon" size={16} />
                    <span className="truncate">{cert.effort}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-base"
                  >
                    Verify certificate
                    <Icon name="ArrowTopRightOnSquareIcon" size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

