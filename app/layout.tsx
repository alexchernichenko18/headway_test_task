import type { Metadata } from 'next';
import Providers from '@/src/context/Providers';

import '../src/styles/globals.css';

export const metadata: Metadata = {
  title: 'Game App',
  description: 'Who wants to be a millionaire?',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
