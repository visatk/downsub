import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Download, Sparkles, Menu, X } from 'lucide-react';
import OrbBackground from './OrbBackground';

const NAV_LINKS = [
  { to: '/#how-it-works', label: 'How it Works' },
  { to: '/#features',     label: 'Features'     },
  { to: '/api-docs',      label: 'API'           },
];

const FOOTER_LINKS = [
  { to: '/privacy', label: 'Privacy Policy'  },
  { to: '/terms',   label: 'Terms of Service'},
  { to: '/contact', label: 'Contact'         },
];

/* ── Shared link styles ────────────────────────────────────────── */
const navLinkStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '0.875rem',
  fontWeight: 500,
  borderRadius: '8px',
  color: 'var(--text-muted)',
  transition: 'color 0.15s, background 0.15s',
  textDecoration: 'none',
  display: 'inline-block',
};

function NavbarLink({ to, label }: { to: string; label: string }) {
  if (to.startsWith('/#')) {
    return (
      <a href={to} style={navLinkStyle}
        onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = 'white'; (e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = 'var(--text-muted)'; (e.target as HTMLAnchorElement).style.background = 'transparent'; }}
      >
        {label}
      </a>
    );
  }
  return (
    <NavLink to={to}
      style={({ isActive }) => ({
        ...navLinkStyle,
        color: isActive ? 'white' : 'var(--text-muted)',
        background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
      })}
    >
      {label}
    </NavLink>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header role="banner">
      <nav
        className="glass-nav"
        aria-label="Main navigation"
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* Logo */}
          <Link
            to="/"
            aria-label="SubFetch home"
            onClick={() => setOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
          >
            <div
              className="btn-primary"
              style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', padding: 0, flexShrink: 0 }}
              aria-hidden="true"
            >
              <Download style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.125rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
              SubFetch
            </span>
          </Link>

          {/* Desktop nav — hidden below 768px */}
          <div
            role="navigation"
            style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
            className="hide-mobile-nav"
          >
            {NAV_LINKS.map(l => <NavbarLink key={l.to} to={l.to} label={l.label} />)}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-purple hide-sm">
              <Sparkles style={{ width: 10, height: 10 }} /> v2.1
            </span>
            {/* Hamburger — always shown, desktop nav hides via CSS */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="show-mobile-menu-btn"
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                display: 'none', /* shown via CSS below 768px */
              }}
            >
              {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            id="mobile-menu"
            className="glass"
            style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            {NAV_LINKS.map(l => (
              <div key={l.to}>
                <NavbarLink to={l.to} label={l.label} />
              </div>
            ))}
            <div className="divider" style={{ margin: '8px 0' }} />
            {FOOTER_LINKS.map(l => (
              <div key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={navLinkStyle}
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

function FooterLink({ to, label, isAnchor }: { to: string; label: string; isAnchor?: boolean }) {
  const style: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    display: 'block',
    padding: '2px 0',
    transition: 'color 0.15s',
  };
  if (isAnchor) return (
    <a href={to} style={style}
      onMouseEnter={e => (e.currentTarget.style.color = 'white')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
    >{label}</a>
  );
  return (
    <Link to={to} style={style}
      onMouseEnter={e => (e.currentTarget.style.color = 'white')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
    >{label}</Link>
  );
}

function Footer() {
  return (
    <footer
      role="contentinfo"
      className="glass-nav"
      style={{ borderTop: '1px solid var(--border)', padding: '2.5rem 0', marginTop: 'auto' }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* 3-col footer grid */}
        <div className="footer-grid" style={{ marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '0.75rem' }}>
              <div className="btn-primary" style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', padding: 0, flexShrink: 0 }} aria-hidden="true">
                <Download style={{ width: 14, height: 14, color: 'white' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 900, color: 'white', fontSize: '1rem' }}>SubFetch</span>
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
              Free subtitle downloader for YouTube, Vimeo, and Dailymotion. Download SRT, VTT, or TXT in seconds.
            </p>
          </div>

          {/* Tools */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>Tools</p>
            <nav aria-label="Footer tools" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <FooterLink to="/" label="Subtitle Downloader" />
              <FooterLink to="/api-docs" label="API Documentation" />
              <FooterLink to="/#how-it-works" label="How it Works" isAnchor />
              <FooterLink to="/#faq" label="FAQ" isAnchor />
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>Legal</p>
            <nav aria-label="Footer legal" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {FOOTER_LINKS.map(l => <FooterLink key={l.to} to={l.to} label={l.label} />)}
            </nav>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: '1.5rem' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          <p>© {new Date().getFullYear()} SubFetch. All rights reserved.</p>
          <p>Powered by <span style={{ color: 'var(--accent)' }}>Cloudflare Workers</span> · Built for speed &amp; privacy</p>
        </div>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
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
