import type { ReactNode } from 'react';
import { NavBar } from '../components/NavBar';
import { Providers } from './providers';

export const metadata = {
  title: 'Web',
  description: 'Bootstrapped by .pip',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
