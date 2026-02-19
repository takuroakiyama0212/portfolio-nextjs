import React from 'react';
import Icon from '../../../components/ui/AppIcon';

interface Skill {
  name: string;
  icon: string;
  proficiency: number;
  category: string;
}

interface SkillCategory {
  title: string;
  icon: string;
  color: string;
  skills: Skill[];
}

const SkillsShowcase = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend Development',
      icon: 'DevicePhoneMobileIcon',
      color: 'text-brand-secondary',
      skills: [
        { name: 'React', icon: 'CodeBracketIcon', proficiency: 90, category: 'frontend' },
        { name: 'TypeScript', icon: 'DocumentTextIcon', proficiency: 85, category: 'frontend' },
        { name: 'HTML5', icon: 'CodeBracketSquareIcon', proficiency: 88, category: 'frontend' },
        { name: 'CSS3', icon: 'PaintBrushIcon', proficiency: 87, category: 'frontend' },
        { name: 'SASS', icon: 'PaintBrushIcon', proficiency: 80, category: 'frontend' },
      ],
    },
    {
      title: 'Backend Development',
      icon: 'ServerIcon',
      color: 'text-success',
      skills: [
        { name: 'Node.js', icon: 'CpuChipIcon', proficiency: 85, category: 'backend' },
        { name: 'Python', icon: 'CodeBracketSquareIcon', proficiency: 88, category: 'backend' },
        { name: 'Express.js', icon: 'ServerIcon', proficiency: 82, category: 'backend' },
        { name: 'Flask', icon: 'ServerIcon', proficiency: 80, category: 'backend' },
        { name: 'PHP', icon: 'CodeBracketIcon', proficiency: 75, category: 'backend' },
        { name: 'Java', icon: 'CodeBracketSquareIcon', proficiency: 78, category: 'backend' },
      ],
    },
    {
      title: 'Database & Cloud',
      icon: 'CloudIcon',
      color: 'text-cta',
      skills: [
        { name: 'PostgreSQL', icon: 'CircleStackIcon', proficiency: 85, category: 'database' },
        { name: 'MySQL', icon: 'CircleStackIcon', proficiency: 82, category: 'database' },
        { name: 'AWS', icon: 'CloudIcon', proficiency: 80, category: 'cloud' },
        { name: 'Google Cloud', icon: 'CloudIcon', proficiency: 75, category: 'cloud' },
      ],
    },
    {
      title: 'Data Science & ML',
      icon: 'CpuChipIcon',
      color: 'text-brand-secondary',
      skills: [
        { name: 'TensorFlow', icon: 'CpuChipIcon', proficiency: 75, category: 'ml' },
        { name: 'OpenCV', icon: 'PhotoIcon', proficiency: 70, category: 'ml' },
        { name: 'NumPy', icon: 'ChartBarIcon', proficiency: 80, category: 'ml' },
        { name: 'Pandas', icon: 'TableCellsIcon', proficiency: 82, category: 'ml' },
        { name: 'Matplotlib', icon: 'ChartBarIcon', proficiency: 78, category: 'ml' },
      ],
    },
    {
      title: 'Tools & Libraries',
      icon: 'WrenchScrewdriverIcon',
      color: 'text-success',
      skills: [
        { name: 'Git', icon: 'CommandLineIcon', proficiency: 90, category: 'tools' },
        { name: 'GitHub', icon: 'CodeBracketIcon', proficiency: 92, category: 'tools' },
        { name: 'React Query', icon: 'ArrowPathIcon', proficiency: 85, category: 'tools' },
        { name: 'Adobe Lightroom', icon: 'PhotoIcon', proficiency: 75, category: 'tools' },
      ],
    },
  ];

  const softSkills = [
    { name: 'Cross-Cultural Communication', icon: 'ChatBubbleLeftRightIcon' },
    { name: 'Problem Solving', icon: 'LightBulbIcon' },
    { name: 'Team Collaboration', icon: 'UserGroupIcon' },
    { name: 'Agile Methodology', icon: 'ArrowPathIcon' },
  ];

  return (
    <section className="py-20 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-6">
            <Icon name="AcademicCapIcon" size={16} />
            Technical Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Skills & Technologies
          </h2>
          <p className="text-lg text-text-secondary">
            Comprehensive technical stack with hands-on experience in modern web development technologies and best practices.
          </p>
        </div>

        {/* Technical Skills Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-background rounded-2xl p-6 border border-border hover:border-primary hover:shadow-subtle transition-all duration-base"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 bg-muted rounded-xl flex items-center justify-center ${category.color}`}>
                  <Icon name={category.icon as any} size={24} />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{category.title}</h3>
              </div>

              {/* Skills List */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name={skill.icon as any} size={16} className="text-text-secondary" />
                        <span className="text-sm font-medium text-text-primary">{skill.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">{skill.proficiency}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-brand-secondary rounded-full transition-all duration-1000"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Soft Skills Section */}
        <div className="bg-gradient-to-br from-primary/5 to-brand-secondary/5 rounded-2xl p-8 border border-primary/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary mb-2">Professional Competencies</h3>
            <p className="text-text-secondary">Essential skills that complement technical expertise</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {softSkills.map((skill, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-surface rounded-xl border border-border hover:border-primary hover:shadow-subtle transition-all duration-base"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name={skill.icon as any} size={28} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-text-primary">{skill.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-success/10 border border-success/20 rounded-xl">
            <Icon name="CheckBadgeIcon" size={24} className="text-success" />
            <div className="text-left">
              <p className="text-sm font-semibold text-text-primary">Certified Professional</p>
              <p className="text-xs text-text-secondary">AWS, Google Cloud, and multiple development certifications</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsShowcase;
