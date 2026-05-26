import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Download, Sparkles, Menu, X } from 'lucide-react';
import OrbBackground from './OrbBackground';

const NAV_LINKS = [
  { to: '/#how-it-works', label: 'How it Works', external: false },
  { to: '/#features',     label: 'Features',     external: false },
  { to: '/api-docs',      label: 'API',           external: false },
];

const FOOTER_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms',   label: 'Terms of Service' },
  { to: '/contact', label: 'Contact' },
];

function NavbarLink({ to, label }: { to: string; label: string }) {
  if (to.startsWith('/#')) {
    return (
      <a
        href={to}
        className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5 hover:text-white"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </a>
    );
  }
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-white/8 text-white'
            : 'hover:bg-white/5 hover:text-white'
        }`
      }
      style={({ isActive }) => ({ color: isActive ? 'var(--text)' : 'var(--text-muted)' })}
    >
      {label}
    </NavLink>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header role="banner">
      <nav className="glass-nav sticky top-0 z-50" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="SubFetch home"
            onClick={() => setOpen(false)}
          >
            <div
              className="btn-primary w-8 h-8 shrink-0"
              style={{ borderRadius: 'var(--r-sm)', padding: 0 }}
              aria-hidden="true"
            >
              <Download className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-lg font-black text-white"
              style={{ fontFamily: 'var(--font-head)', letterSpacing: '-0.02em' }}
            >
              SubFetch
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5" role="navigation">
            {NAV_LINKS.map(l => (
              <NavbarLink key={l.to} to={l.to} label={l.label} />
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="badge badge-purple hide-sm">
              <Sparkles className="w-2.5 h-2.5" /> v2.1
            </span>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            id="mobile-menu"
            className="md:hidden glass border-t px-4 py-4 space-y-1"
            style={{ borderTopColor: 'var(--border)' }}
          >
            {NAV_LINKS.map(l => (
              <div key={l.to}>
                <NavbarLink to={l.to} label={l.label} />
              </div>
            ))}
            <div className="divider my-3" />
            {FOOTER_LINKS.map(l => (
              <div key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {l.label}
                </NavLink>
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer
      role="contentinfo"
      className="glass-nav border-t py-10 mt-auto"
      style={{ borderTopColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-3">
              <div
                className="btn-primary w-7 h-7 shrink-0"
                style={{ borderRadius: 'var(--r-sm)', padding: 0 }}
                aria-hidden="true"
              >
                <Download className="w-3.5 h-3.5 text-white" />
              </div>
              <span
                className="font-black text-white text-base"
                style={{ fontFamily: 'var(--font-head)' }}
              >
                SubFetch
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Free subtitle downloader for YouTube, Vimeo, and Dailymotion. Download SRT, VTT, or TXT in seconds.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="eyebrow mb-4">Tools</p>
            <nav aria-label="Footer tools" className="space-y-2">
              {[
                { to: '/', label: 'Subtitle Downloader' },
                { to: '/api-docs', label: 'API Documentation' },
                { to: '/#how-it-works', label: 'How it Works' },
                { to: '/#faq', label: 'FAQ' },
              ].map(l => (
                <div key={l.to}>
                  {l.to.startsWith('/#') ? (
                    <a
                      href={l.to}
                      className="text-sm hover:text-white transition-colors block"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.to}
                      className="text-sm hover:text-white transition-colors block"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {l.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="eyebrow mb-4">Legal</p>
            <nav aria-label="Footer legal" className="space-y-2">
              {FOOTER_LINKS.map(l => (
                <div key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm hover:text-white transition-colors block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {l.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--text-subtle)' }}>
          <p>© {new Date().getFullYear()} SubFetch. All rights reserved.</p>
          <p>Powered by <span style={{ color: 'var(--accent)' }}>Cloudflare Workers</span> · Built for speed &amp; privacy</p>
        </div>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  /** If true, the animated orb background is rendered (default: true) */
  withOrbs?: boolean;
}

export default function Layout({ children, withOrbs = true }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>
      {withOrbs && <OrbBackground />}
      <Navbar />
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
