'use client';

import React, { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: 'EnvelopeIcon',
      title: 'Email',
      value: 'akiyamatakuro0212@gmail.com',
      link: 'mailto:akiyamatakuro0212@gmail.com',
      color: 'text-primary',
    },
    {
      icon: 'PhoneIcon',
      title: 'Phone',
      value: '+61 405 726 234',
      link: 'tel:+61405726234',
      color: 'text-success',
    },
    {
      icon: 'MapPinIcon',
      title: 'Location',
      value: 'Golden Beach, QLD, Australia',
      link: '#',
      color: 'text-cta',
    },
    {
      icon: 'ClockIcon',
      title: 'Availability',
      value: 'AEST (UTC+10)',
      link: '#',
      color: 'text-brand-secondary',
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cta/10 border border-cta/20 rounded-full text-sm font-medium text-cta mb-6">
            <Icon name="ChatBubbleLeftEllipsisIcon" size={16} />
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-lg text-text-secondary">
            Open to new opportunities and collaborations. Whether you have a project in mind or just want to connect, I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-surface rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-text-primary mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted transition-all duration-base group"
                  >
                    <div className={`w-12 h-12 bg-muted rounded-xl flex items-center justify-center ${method.color} group-hover:scale-110 transition-transform duration-base`}>
                      <Icon name={method.icon as any} size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary mb-1">{method.title}</p>
                      <p className="text-base font-semibold text-text-primary">{method.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-primary/5 to-brand-secondary/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-xl font-bold text-text-primary mb-4">Connect on Social Media</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com/takuroakiyama0212"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-surface rounded-xl border border-border hover:border-primary hover:shadow-subtle transition-all duration-base"
                  aria-label="GitHub Profile"
                >
                  <Icon name="CodeBracketIcon" size={24} className="text-text-primary" />
                  <span className="text-sm font-medium text-text-primary">GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/takuroakiyama0212"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-4 bg-surface rounded-xl border border-border hover:border-primary hover:shadow-subtle transition-all duration-base"
                  aria-label="LinkedIn Profile"
                >
                  <Icon name="UserGroupIcon" size={24} className="text-text-primary" />
                  <span className="text-sm font-medium text-text-primary">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-xl p-6 border border-border text-center">
                <p className="text-3xl font-bold text-primary mb-2">&lt; 24h</p>
                <p className="text-sm text-text-secondary">Response Time</p>
              </div>
              <div className="bg-surface rounded-xl p-6 border border-border text-center">
                <p className="text-3xl font-bold text-success mb-2">100%</p>
                <p className="text-sm text-text-secondary">Availability</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-surface rounded-2xl p-8 border border-border">
            <h3 className="text-2xl font-bold text-text-primary mb-6">Send a Message</h3>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-3">
                <Icon name="CheckCircleIcon" size={24} className="text-success" />
                <p className="text-sm font-medium text-success">Message sent successfully! I&apos;ll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-base"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-base"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-base"
                >
                  <option value="">Select a subject</option>
                  <option value="job">Job Opportunity</option>
                  <option value="project">Project Collaboration</option>
                  <option value="consultation">Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-base resize-none"
                  placeholder="Tell me about your project or inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isHydrated}
                className="w-full px-8 py-4 bg-cta text-cta-foreground rounded-lg font-semibold hover:bg-cta/90 hover:shadow-elevation hover:-translate-y-1 transition-all duration-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Icon name="PaperAirplaneIcon" size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
