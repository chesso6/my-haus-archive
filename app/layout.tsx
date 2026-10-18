import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HAUS OF GAGA | Photography Anthology',
  description: 'An archived gallery of Lady Gaga photography through every era.',
  icons: {
    icon: '/assets/images/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}