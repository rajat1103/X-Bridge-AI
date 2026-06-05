import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'X-Bridge AI — Enterprise Multi-Agent Intelligence Platform',
  description: 'The definitive enterprise AI platform combining Agentic AI, CDP, Workflow Automation, Analytics, and Customer Intelligence into one powerful system.',
  keywords: 'AI platform, multi-agent, enterprise AI, customer intelligence, workflow automation, analytics',
  authors: [{ name: 'X-Bridge AI Team' }],
  openGraph: {
    title: 'X-Bridge AI — Enterprise Multi-Agent Intelligence Platform',
    description: 'Build, deploy, and scale enterprise AI workflows with autonomous agents',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B1220" />
      </head>
      <body>{children}</body>
    </html>
  );
}
