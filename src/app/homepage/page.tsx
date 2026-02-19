import React from 'react';
import type { Metadata } from 'next';
import HomepageInteractive from './components/HomepageInteractive.tsx';

export const metadata: Metadata = {
  title: 'Takuro - Full-Stack Developer Portfolio',
  description: 'Professional developer portfolio showcasing full-stack expertise with international experience across Japan, USA, and Australia. Building bridges through code with modern web technologies.',
};

export default function Homepage() {
  return <HomepageInteractive />;
}
