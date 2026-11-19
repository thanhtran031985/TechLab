import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'TechLab — Nền tảng học tập kỹ thuật phần mềm tương tác',
  description:
    'Học thiết kế hệ thống và kỹ thuật phần mềm qua các sandbox tương tác Split-Screen.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
