import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'X-Bridge AI — Platform',
  description: 'Enterprise Multi-Agent Intelligence Platform',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
