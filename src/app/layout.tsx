import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Treatments by Ghost',
    template: '%s — Treatments by Ghost',
  },
  description: 'We put treatments together.',
  openGraph: {
    title: 'Treatments by Ghost',
    description: 'We put treatments together.',
    url: 'https://treatmentsbyghost.com',
    siteName: 'Treatments by Ghost',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Treatments by Ghost',
    description: 'We put treatments together.',
  },
  metadataBase: new URL('https://treatmentsbyghost.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="site-nav">
            <Link href="/">Blog</Link>
            <span className="nav-dot">&middot;</span>
            <Link href="/about">About</Link>
            <span className="nav-dot">&middot;</span>
            <a href="https://instagram.com/ghost_treatments" target="_blank" rel="noopener noreferrer">Instagram</a>
          </nav>
          <Link href="/" className="site-logo">
            <img src="/ghost-logo.png" alt="Ghost" />
          </Link>
          <p className="site-tagline">We put treatments together.</p>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-links">
              <a href="https://treatmentsbyghost.com" target="_blank" rel="noopener noreferrer">
                treatmentsbyghost.com
              </a>
              <a href="https://instagram.com/ghost_treatments" target="_blank" rel="noopener noreferrer">
                @ghost_treatments
              </a>
              <a href="mailto:info@treatmentsbyghost.com">
                info@treatmentsbyghost.com
              </a>
            </div>
            <p className="footer-tagline">We put treatments together.</p>
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} Treatments by Ghost. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
